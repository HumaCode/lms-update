# Laravel DOMPDF Examples

This file shows common ways to generate PDFs with `barryvdh/laravel-dompdf` in a Laravel application.

## Configuration

Publish the configuration when you need to customize DOMPDF options:

```bash
php artisan vendor:publish --provider="Barryvdh\\DomPDF\\ServiceProvider"
```

## Download a PDF From a Blade View

```php
<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class InvoiceController
{
    public function download(): Response
    {
        $invoice = [
            'number' => 'INV-1001',
            'customer' => 'Acme Ltd.',
            'total' => 199.99,
        ];

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ])->download('invoice.pdf');
    }
}
```

Example Blade view at `resources/views/pdf/invoice.blade.php`:

```blade
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <h1>Invoice {{ $invoice['number'] }}</h1>

    <p>Customer: {{ $invoice['customer'] }}</p>
    <p class="total">Total: ${{ number_format($invoice['total'], 2) }}</p>
</body>
</html>
```

## Stream a PDF in the Browser

```php
use Barryvdh\DomPDF\Facade\Pdf;

return Pdf::loadView('pdf.report', [
    'title' => 'Monthly Report',
])->stream('monthly-report.pdf');
```

## Generate From an HTML String

```php
use Barryvdh\DomPDF\Facade\Pdf;

$html = '<h1>Hello PDF</h1><p>This PDF was generated from HTML.</p>';

return Pdf::loadHTML($html)
    ->setPaper('a4', 'portrait')
    ->download('example.pdf');
```

## Save a PDF

```php
use Barryvdh\DomPDF\Facade\Pdf;

Pdf::loadView('pdf.invoice', ['invoice' => $invoice])
    ->save(storage_path('app/invoices/invoice-1001.pdf'));
```

To save through a Laravel filesystem disk:

```php
Pdf::loadView('pdf.invoice', ['invoice' => $invoice])
    ->save('invoices/invoice-1001.pdf', 'local');
```

## Set Options

```php
use Barryvdh\DomPDF\Facade\Pdf;

return Pdf::setOption([
        'dpi' => 150,
        'defaultFont' => 'DejaVu Sans',
    ])
    ->loadView('pdf.invoice', ['invoice' => $invoice])
    ->setPaper('a4', 'landscape')
    ->download('invoice.pdf');
```

## PDF/A Example

```php
use Barryvdh\DomPDF\Facade\Pdf;

return Pdf::loadView('pdf.archive-invoice', ['invoice' => $invoice])
    ->setPdfA()
    ->download('archive-invoice.pdf');
```

PDF/A requires embedded fonts. Prefer fonts such as `DejaVu Sans` or `DejaVu Serif` instead of core PDF fonts like Helvetica, Courier, or Times.

## Remote Images

Remote asset loading is disabled by default in version 3.x. Enable it only when the source hosts are trusted:

```php
Pdf::setOption([
    'isRemoteEnabled' => true,
    'allowedRemoteHosts' => ['example.com'],
]);
```
