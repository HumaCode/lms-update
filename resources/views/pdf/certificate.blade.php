<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Certificate</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@400;500;700&family=Cinzel:wght@500;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: 930px 600px;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            width: 930px;
            height: 600px;
            font-family: 'Roboto', sans-serif;
        }
        .certificate-body {
            width: 930px;
            height: 600px;
            position: relative;
            overflow: hidden;
            background-color: #ffffff;
        }
        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 930px;
            height: 600px;
            z-index: 1;
        }
        .draggable-element {
            position: absolute;
            z-index: 10;
            white-space: pre-line;
            line-height: 1.3;
        }
        .text-element {
            left: 0;
            width: 930px;
            text-align: center;
        }
        .signature img {
            height: 100px;
            width: auto;
        }

        @foreach($certificateItems as $item)
            #{{ $item->element_id }} {
                top: {{ $item->y_position ?? 0 }}px;
                @if(in_array($item->element_id, ['signature', 'signature_2']))
                    left: {{ $item->x_position ?? 0 }}px;
                @endif
                @if($item->font_family) font-family: {!! $item->font_family !!}; @endif
                @if($item->font_size) font-size: {{ $item->font_size }}; @endif
                @if($item->color) color: {{ $item->color }}; @endif
                @if($item->is_bold) font-weight: bold; @else font-weight: normal; @endif
                @if($item->is_italic) font-style: italic; @else font-style: normal; @endif
                @if($item->is_underline) text-decoration: underline; @endif
            }
        @endforeach
    </style>
</head>

<body>
    <div class="certificate-body">
        @php
            $isVisible = function($id) use ($certificateItems) {
                $item = $certificateItems->where('element_id', $id)->first();
                if (!$item) return true;
                return isset($item->is_visible) ? (bool)$item->is_visible : true;
            };
        @endphp

        @if ($certificate->background && file_exists(public_path(ltrim($certificate->background, '/'))))
            <img class="bg-img" src="{{ public_path(ltrim($certificate->background, '/')) }}" alt="Background" />
        @endif

        @if ($isVisible('title'))
            <div id="title" class="draggable-element text-element">{{ $certificate->title ?? 'Certificate of Completion' }}</div>
        @endif
        @if ($isVisible('cert_number'))
            <div id="cert_number" class="draggable-element text-element">ID: [certificate_id]</div>
        @endif
        @if ($isVisible('subtitle'))
            <div id="subtitle" class="draggable-element text-element">{{ $certificate->sub_title ?? 'Certificate Subtitle' }}</div>
        @endif
        @if ($isVisible('student_name'))
            <div id="student_name" class="draggable-element text-element">[student_name]</div>
        @endif
        @if ($isVisible('description'))
            <div id="description" class="draggable-element text-element">{{ $certificate->description ?? 'For successfully completing the course' }}</div>
        @endif

        @if ($isVisible('signature') && $certificate->signature && file_exists(public_path(ltrim($certificate->signature, '/'))))
            <div id="signature" class="signature draggable-element">
                <img src="{{ public_path(ltrim($certificate->signature, '/')) }}" alt="Signature 1">
            </div>
        @endif

        @if ($isVisible('signature_2') && $certificate->signature_2 && file_exists(public_path(ltrim($certificate->signature_2, '/'))))
            <div id="signature_2" class="signature draggable-element">
                <img src="{{ public_path(ltrim($certificate->signature_2, '/')) }}" alt="Signature 2">
            </div>
        @endif
    </div>
</body>

</html>
