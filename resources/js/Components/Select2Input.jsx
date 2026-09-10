import React from 'react';
import Select from 'react-select';

export default function Select2Input({
    options = [],
    value,
    onChange,
    placeholder = '-- Select --',
    isSearchable = true,
    isClearable = false,
    error = false,
    className = '',
    id,
    isDisabled = false,
}) {
    // Custom styling to match Bootstrap 5 form control aesthetics
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '38px',
            borderRadius: '0.375rem',
            borderColor: error ? '#dc3545' : state.isFocused ? '#86b7fe' : '#dee2e6',
            boxShadow: state.isFocused
                ? error
                    ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)'
                    : '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
                : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#86b7fe' : '#adb5bd',
            },
            backgroundColor: isDisabled ? '#e9ecef' : '#ffffff',
            fontSize: '0.95rem',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#0d6efd'
                : state.isFocused
                ? '#f1f5f9'
                : '#ffffff',
            color: state.isSelected ? '#ffffff' : '#1e293b',
            fontSize: '0.9rem',
            paddingTop: '8px',
            paddingBottom: '8px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#0d6efd',
                color: '#ffffff',
            },
        }),
        groupHeading: (provided) => ({
            ...provided,
            fontWeight: '700',
            color: '#0f172a',
            fontSize: '0.875rem',
            textTransform: 'none',
            paddingBottom: '4px',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '4px',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d',
            fontSize: '0.95rem',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#212529',
            fontSize: '0.95rem',
        }),
    };

    // Find active selected option object from value (primitive string/number or object)
    const findOption = (opts, val) => {
        if (val === null || val === undefined || val === '') return null;
        for (const opt of opts) {
            if (opt.options) {
                const found = opt.options.find((subOpt) => String(subOpt.value) === String(val));
                if (found) return found;
            } else if (String(opt.value) === String(val)) {
                return opt;
            }
        }
        return null;
    };

    const selectedOption = findOption(options, value);

    return (
        <div className={`select2-input-wrapper ${className}`}>
            <Select
                id={id}
                options={options}
                value={selectedOption}
                onChange={(selected) => {
                    onChange(selected ? selected.value : '');
                }}
                placeholder={placeholder}
                isSearchable={isSearchable}
                isClearable={isClearable}
                isDisabled={isDisabled}
                styles={customStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
        </div>
    );
}
