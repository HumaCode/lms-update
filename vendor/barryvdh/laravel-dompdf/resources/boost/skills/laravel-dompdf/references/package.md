# Laravel DOMPDF Package Notes

This skill is based on the local `barryvdh/laravel-dompdf` package source.

## Key Files

- `src/ServiceProvider.php`
  - Registers `dompdf`, `dompdf.options`, and `dompdf.wrapper`
  - Publishes `config/dompdf.php`
- `src/PDF.php`
  - Main wrapper used by the facade
  - Exposes `loadView`, `loadHTML`, `loadFile`, `save`, `stream`, `download`, `output`
  - Supports `setPdfA`, `addEmbeddedFile`, `setAdditionalXmpRdf`, and `setEncryption`
- `config/dompdf.php`
  - Holds DOMPDF defaults and security-sensitive options
- `resources/example.md`
  - Provides copyable Laravel examples for downloads, streams, saved PDFs, options, PDF/A, and remote assets

## Package Facts Worth Remembering

- Composer package: `barryvdh/laravel-dompdf`
- Laravel facade aliases: `Pdf` and `PDF`
- Laravel provider: `Barryvdh\\DomPDF\\ServiceProvider`
- Underlying engine: `dompdf/dompdf ^3.1`
- Remote asset loading is disabled by default in 3.x
- Default backend is `CPDF`

## High-Value Config Keys

- `show_warnings`
- `public_path`
- `convert_entities`
- `pdfa.enabled`
- `options.font_dir`
- `options.font_cache`
- `options.temp_dir`
- `options.chroot`
- `options.pdf_backend`
- `options.default_paper_size`
- `options.default_paper_orientation`
- `options.default_font`
- `options.dpi`
- `options.enable_php`
- `options.enable_javascript`
- `options.enable_remote`
- `options.allowed_remote_hosts`

## Useful Runtime Methods

- `Pdf::loadView(...)`
- `Pdf::loadHTML(...)`
- `Pdf::loadFile(...)`
- `->setPaper('a4', 'landscape')`
- `->setOption([...])`
- `->setWarnings(false)`
- `->setPdfA()`
- `->output()`
- `->save(...)`
- `->stream(...)`
- `->download(...)`
