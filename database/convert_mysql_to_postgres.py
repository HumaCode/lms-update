#!/usr/bin/env python3
import sys
import re

def parse_sql_values_row(s):
    """
    Parses a single row string e.g. "(1, 'foo', NULL, 'bar\\'baz')" into a list of value strings.
    Handles MySQL string escapes (\', \r, \n, \\).
    """
    s = s.strip()
    if s.startswith('('):
        s = s[1:]
    if s.endswith(')'):
        s = s[:-1]
    
    tokens = []
    i = 0
    n = len(s)
    
    while i < n:
        # Skip spaces/tabs
        while i < n and s[i] in ' \t':
            i += 1
        if i >= n:
            break
            
        if s[i] == "'":
            # String literal
            i += 1 # skip opening quote
            str_parts = []
            while i < n:
                if s[i] == '\\':
                    # Escape in MySQL dump
                    if i + 1 < n:
                        esc = s[i+1]
                        if esc == "'":
                            # Escaped single quote in MySQL -> standard SQL ''
                            str_parts.append("''")
                        elif esc == 'r':
                            str_parts.append('\r')
                        elif esc == 'n':
                            str_parts.append('\n')
                        elif esc == '\\':
                            str_parts.append('\\')
                        elif esc == '"':
                            str_parts.append('"')
                        else:
                            str_parts.append(esc)
                        i += 2
                    else:
                        str_parts.append(s[i])
                        i += 1
                elif s[i] == "'":
                    if i + 1 < n and s[i+1] == "'":
                        # Doubled quote in SQL
                        str_parts.append("''")
                        i += 2
                    else:
                        # End of string literal
                        i += 1
                        break
                else:
                    str_parts.append(s[i])
                    i += 1
            raw_str = "".join(str_parts)
            tokens.append("'" + raw_str + "'")
        else:
            # Non-string literal (number, NULL, boolean, etc.)
            start = i
            while i < n and s[i] != ',':
                i += 1
            tok = s[start:i].strip()
            tokens.append(tok)
            
        # Skip trailing space and comma
        while i < n and s[i] in ' \t':
            i += 1
        if i < n and s[i] == ',':
            i += 1
            
    return tokens

def main():
    # Load schema column types from database/pg_columns.tsv
    pg_types = {}
    with open('database/pg_columns.tsv', 'r') as f:
        for line in f:
            parts = line.strip().split('|')
            if len(parts) >= 3:
                tbl, col, dtype = parts[0], parts[1], parts[2]
                pg_types[(tbl, col)] = dtype

    # Tables to skip (managed by Laravel or temporary/session data)
    skip_tables = {'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'migrations', 'sessions'}

    out_lines = []
    out_lines.append("-- Converted from database_copy.sql for PostgreSQL 18 (lms_db)")
    out_lines.append("SET session_replication_role = 'replica';")
    out_lines.append("BEGIN;")
    out_lines.append("")

    tables_with_inserts = []
    
    # We will collect truncate statements and insert statements separately
    # so all tables are truncated at the beginning, avoiding CASCADE deletes during inserts
    truncate_lines = []
    insert_lines = []

    current_table = None
    current_cols = []
    current_rows = []
    mismatch_count = 0
    total_converted_rows = 0

    insert_header_regex = re.compile(r'^INSERT\s+INTO\s+`([^`]+)`\s*\(([^)]+)\)\s*VALUES', re.IGNORECASE)

    with open('database/database_copy.sql', 'r', encoding='utf-8', errors='replace') as f:
        for line_idx, line in enumerate(f, 1):
            line_str = line.rstrip('\r\n')
            
            # Check if this line starts a new INSERT INTO statement
            m = insert_header_regex.match(line_str)
            if m:
                table_name = m.group(1)
                raw_cols = m.group(2)
                
                if table_name in skip_tables:
                    current_table = None
                    continue
                
                current_table = table_name
                current_cols = [c.strip().strip('`') for c in raw_cols.split(',')]
                current_rows = []
                
                if current_table not in tables_with_inserts:
                    tables_with_inserts.append(current_table)
                continue

            # Check if this is a row inside the current INSERT statement
            if current_table and line_str.startswith('\t('):
                total_converted_rows += 1
                row_raw = line_str.strip()
                is_last_row = row_raw.endswith(');')
                if row_raw.endswith(','):
                    row_raw = row_raw[:-1]
                elif row_raw.endswith(';'):
                    row_raw = row_raw[:-1]
                    
                parsed_vals = parse_sql_values_row(row_raw)
                
                if len(parsed_vals) != len(current_cols):
                    print(f"Error line {line_idx} [{current_table}]: expected {len(current_cols)} columns, got {len(parsed_vals)}")
                    mismatch_count += 1
                
                # Transform values according to PostgreSQL types
                converted_vals = []
                for col_name, val in zip(current_cols, parsed_vals):
                    dtype = pg_types.get((current_table, col_name))
                    if dtype == 'boolean':
                        if val in ('1', "'1'"):
                            val = 'TRUE'
                        elif val in ('0', "'0'"):
                            val = 'FALSE'
                        elif val.upper() == 'NULL':
                            val = 'NULL'
                        else:
                            val = 'TRUE' if val != '0' else 'FALSE'
                    converted_vals.append(val)
                    
                current_rows.append(f"\t({', '.join(converted_vals)})")
                
                if is_last_row:
                    quoted_cols = [f'"{c}"' for c in current_cols]
                    stmt = f'INSERT INTO "{current_table}" ({", ".join(quoted_cols)}) VALUES\n' + ",\n".join(current_rows) + ";"
                    insert_lines.append(stmt)
                    insert_lines.append("")
                    current_table = None
                    current_rows = []

    # Add all TRUNCATE statements at once
    out_lines.append("-- Truncate all tables first to prevent CASCADE deletion during inserts")
    for tbl in tables_with_inserts:
        out_lines.append(f'TRUNCATE TABLE "{tbl}" CASCADE;')
    out_lines.append("")
    
    # Add all INSERT statements
    out_lines.extend(insert_lines)

    out_lines.append("COMMIT;")
    out_lines.append("SET session_replication_role = 'origin';")
    out_lines.append("")
    out_lines.append("-- Reset sequences dynamically for all tables with an id sequence")
    out_lines.append("""DO $$
DECLARE
    seq text;
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND column_name = 'id'
    LOOP
        seq := pg_get_serial_sequence(quote_ident(tbl), 'id');
        IF seq IS NOT NULL THEN
            EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(id) FROM %I), 1))', seq, tbl);
        END IF;
    END LOOP;
END $$;
""")

    out_file = 'database/database_postgres_converted.sql'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(out_lines) + "\n")

    print(f"Conversion finished!")
    print(f"Total tables converted: {len(tables_with_inserts)}")
    print(f"Total rows converted: {total_converted_rows}")
    print(f"Column mismatches: {mismatch_count}")
    print(f"Output saved to: {out_file}")

if __name__ == '__main__':
    main()
