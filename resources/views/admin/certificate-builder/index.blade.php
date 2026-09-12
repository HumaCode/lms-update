@extends('admin.layouts.master')

@push('styles')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@400;500;700&family=Cinzel:wght@500;700&display=swap" rel="stylesheet">
@endpush

@section('content')
    <div class="page-body">
        <div class="container-xl">
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Certificate Content</h3>
    
                        </div>
                        <div class="card-body">
                            <div class="alert alert-primary">
                                <h4 class="alert-heading">Default Variables</h4>
                                <p>[student_name], [course_name], [date], [platform_name], [instructor_name]</p>
                            </div>
                            <form action="{{ route('admin.certificate-builder.update') }}" method="POST" enctype="multipart/form-data">
                                @csrf

                                <div class="accordion" id="certBuilderAccordion">
                                    <!-- Certificate Title Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingTitle">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTitle" aria-expanded="true" aria-controls="collapseTitle">
                                                <i class="ti ti-heading me-2"></i> Certificate Title
                                            </button>
                                        </h2>
                                        <div id="collapseTitle" class="accordion-collapse collapse show" aria-labelledby="headingTitle" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="form-group mb-3">
                                                    <label class="form-label">Font Family (Jenis Font)</label>
                                                    <select name="font_family" id="font_family_select" class="form-select">
                                                        <option value="'Aleo', serif" style="font-family: 'Aleo', serif;">Aleo (Serif)</option>
                                                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;">Playfair Display (Elegant)</option>
                                                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel (Classic Certificate)</option>
                                                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes (Calligraphy Script)</option>
                                                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;">Montserrat (Modern Sans)</option>
                                                        <option value="'Roboto', sans-serif" style="font-family: 'Roboto', sans-serif;">Roboto (Clean Sans)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Title Text</label>
                                                    <input type="text" class="form-control" name="title" value="{{ $certificate?->title }}" placeholder="Enter certificate title">
                                                    <x-input-error :messages="$errors->get('title')" class="mt-2" />
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Title Font Size</label>
                                                    <select id="title_font_size_select" class="form-select">
                                                        <option value="20px">20px (Default)</option>
                                                        <option value="24px">24px</option>
                                                        <option value="28px">28px</option>
                                                        <option value="32px">32px</option>
                                                        <option value="36px" selected>36px (Besar)</option>
                                                        <option value="40px">40px</option>
                                                        <option value="48px">48px (Sangat Besar)</option>
                                                        <option value="56px">56px</option>
                                                        <option value="64px">64px (Jumbo)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group">
                                                    <label class="form-label">Title Color (Warna Judul)</label>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <input type="color" id="title_color_picker" class="form-control form-control-color" value="#1e293b" title="Pilih Warna Judul">
                                                        <input type="text" id="title_color_hex" class="form-control" value="#1e293b" placeholder="#1e293b" style="max-width: 130px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certificate Number Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingCertNumber">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCertNumber" aria-expanded="false" aria-controls="collapseCertNumber">
                                                <i class="ti ti-numbers me-2"></i> Certificate Number
                                            </button>
                                        </h2>
                                        <div id="collapseCertNumber" class="accordion-collapse collapse" aria-labelledby="headingCertNumber" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="alert alert-info py-2 px-3 mb-3">
                                                    <small><i class="ti ti-info-circle me-1"></i> Nomor sertifikat diatur menggunakan tag <strong>[certificate_id]</strong> (atau teks kustom).</small>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Font Family (Jenis Font)</label>
                                                    <select id="cert_number_font_family_select" class="form-select">
                                                        <option value="'Aleo', serif" style="font-family: 'Aleo', serif;">Aleo (Serif)</option>
                                                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;">Playfair Display (Elegant)</option>
                                                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel (Classic Certificate)</option>
                                                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes (Calligraphy Script)</option>
                                                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;">Montserrat (Modern Sans)</option>
                                                        <option value="'Roboto', sans-serif" style="font-family: 'Roboto', sans-serif;" selected>Roboto (Clean Sans)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Certificate Number Font Size</label>
                                                    <select id="cert_number_font_size_select" class="form-select">
                                                        <option value="12px">12px</option>
                                                        <option value="14px" selected>14px (Default)</option>
                                                        <option value="16px">16px</option>
                                                        <option value="18px">18px</option>
                                                        <option value="20px">20px</option>
                                                        <option value="24px">24px (Besar)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group">
                                                    <label class="form-label">Certificate Number Color (Warna Nomor)</label>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <input type="color" id="cert_number_color_picker" class="form-control form-control-color" value="#64748b" title="Pilih Warna Nomor Sertifikat">
                                                        <input type="text" id="cert_number_color_hex" class="form-control" value="#64748b" placeholder="#64748b" style="max-width: 130px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certificate Subtitle Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingSubtitle">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSubtitle" aria-expanded="false" aria-controls="collapseSubtitle">
                                                <i class="ti ti-subtask me-2"></i> Certificate Subtitle
                                            </button>
                                        </h2>
                                        <div id="collapseSubtitle" class="accordion-collapse collapse" aria-labelledby="headingSubtitle" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="form-group mb-3">
                                                    <label class="form-label">Font Family (Jenis Font)</label>
                                                    <select id="subtitle_font_family_select" class="form-select">
                                                        <option value="'Aleo', serif" style="font-family: 'Aleo', serif;">Aleo (Serif)</option>
                                                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;">Playfair Display (Elegant)</option>
                                                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel (Classic Certificate)</option>
                                                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes (Calligraphy Script)</option>
                                                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;" selected>Montserrat (Modern Sans)</option>
                                                        <option value="'Roboto', sans-serif" style="font-family: 'Roboto', sans-serif;">Roboto (Clean Sans)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Subtitle Text</label>
                                                    <input type="text" class="form-control" name="subtitle" value="{{ $certificate?->sub_title }}" placeholder="Enter certificate subtitle">
                                                    <x-input-error :messages="$errors->get('subtitle')" class="mt-2" />
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Subtitle Font Size</label>
                                                    <select id="subtitle_font_size_select" class="form-select">
                                                        <option value="16px">16px</option>
                                                        <option value="18px">18px</option>
                                                        <option value="20px" selected>20px (Default)</option>
                                                        <option value="24px">24px</option>
                                                        <option value="28px">28px</option>
                                                        <option value="32px">32px (Besar)</option>
                                                        <option value="36px">36px</option>
                                                        <option value="40px">40px</option>
                                                        <option value="48px">48px</option>
                                                    </select>
                                                </div>

                                                <div class="form-group">
                                                    <label class="form-label">Subtitle Color (Warna Subtitle)</label>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <input type="color" id="subtitle_color_picker" class="form-control form-control-color" value="#475569" title="Pilih Warna Subtitle">
                                                        <input type="text" id="subtitle_color_hex" class="form-control" value="#475569" placeholder="#475569" style="max-width: 130px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certificate Student Name Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingStudentName">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStudentName" aria-expanded="false" aria-controls="collapseStudentName">
                                                <i class="ti ti-user me-2"></i> Student Name
                                            </button>
                                        </h2>
                                        <div id="collapseStudentName" class="accordion-collapse collapse" aria-labelledby="headingStudentName" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="alert alert-info py-2 px-3 mb-3">
                                                    <small><i class="ti ti-info-circle me-1"></i> Teks nama siswa diatur dinamis menggunakan tag <strong>[student_name]</strong>.</small>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Font Family (Jenis Font)</label>
                                                    <select id="student_name_font_family_select" class="form-select">
                                                        <option value="'Aleo', serif" style="font-family: 'Aleo', serif;">Aleo (Serif)</option>
                                                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;" selected>Playfair Display (Elegant)</option>
                                                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel (Classic Certificate)</option>
                                                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes (Calligraphy Script)</option>
                                                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;">Montserrat (Modern Sans)</option>
                                                        <option value="'Roboto', sans-serif" style="font-family: 'Roboto', sans-serif;">Roboto (Clean Sans)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Student Name Font Size</label>
                                                    <select id="student_name_font_size_select" class="form-select">
                                                        <option value="20px">20px</option>
                                                        <option value="24px">24px</option>
                                                        <option value="28px" selected>28px (Default)</option>
                                                        <option value="32px">32px (Besar)</option>
                                                        <option value="36px">36px</option>
                                                        <option value="40px">40px</option>
                                                        <option value="48px">48px (Sangat Besar)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Student Name Color (Warna Nama Siswa)</label>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <input type="color" id="student_name_color_picker" class="form-control form-control-color" value="#0f172a" title="Pilih Warna Nama Siswa">
                                                        <input type="text" id="student_name_color_hex" class="form-control" value="#0f172a" placeholder="#0f172a" style="max-width: 130px;">
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="form-label">Text Format (Gaya Teks)</label>
                                                    <div class="btn-group w-100" role="group" aria-label="Student Name Format">
                                                        <button type="button" class="btn btn-outline-secondary" id="btn_student_name_bold" title="Bold">
                                                            <i class="ti ti-bold fs-3"></i> <strong>Bold</strong>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-secondary" id="btn_student_name_italic" title="Italic">
                                                            <i class="ti ti-italic fs-3"></i> <em>Italic</em>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-secondary" id="btn_student_name_underline" title="Underline">
                                                            <i class="ti ti-underline fs-3"></i> <u>Underline</u>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Certificate Description Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingDescription">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription" aria-expanded="false" aria-controls="collapseDescription">
                                                <i class="ti ti-file-text me-2"></i> Certificate Description
                                            </button>
                                        </h2>
                                        <div id="collapseDescription" class="accordion-collapse collapse" aria-labelledby="headingDescription" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="form-group mb-3">
                                                    <label class="form-label">Font Family (Jenis Font)</label>
                                                    <select id="description_font_family_select" class="form-select">
                                                        <option value="'Aleo', serif" style="font-family: 'Aleo', serif;">Aleo (Serif)</option>
                                                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;">Playfair Display (Elegant)</option>
                                                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel (Classic Certificate)</option>
                                                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes (Calligraphy Script)</option>
                                                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;">Montserrat (Modern Sans)</option>
                                                        <option value="'Roboto', sans-serif" style="font-family: 'Roboto', sans-serif;" selected>Roboto (Clean Sans)</option>
                                                    </select>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Description Text</label>
                                                    <textarea name="description" id="description_textarea" class="form-control" rows="3" placeholder="Enter certificate description">{{ $certificate?->description }}</textarea>
                                                    <x-input-error :messages="$errors->get('description')" class="mt-2" />
                                                </div>

                                                <div class="card border mb-3">
                                                    <div class="card-header py-2 bg-light">
                                                        <span class="fw-bold text-dark small"><i class="ti ti-bulb me-1 text-warning"></i> Sample Description (Klik untuk pakai):</span>
                                                    </div>
                                                    <div class="list-group list-group-flush">
                                                        <button type="button" class="list-group-item list-group-item-action text-start p-2 apply-sample-desc" data-text="Telah berhasil menyelesaikan kelas [course_name]&#10;pada tanggal [date] dengan hasil yang sangat memuaskan.">
                                                            <div class="fw-bold text-primary mb-1 small">Bahasa Indonesia:</div>
                                                            <div class="small text-dark text-wrap" style="line-height: 1.4;">Telah berhasil menyelesaikan kelas [course_name] pada tanggal [date] dengan hasil yang sangat memuaskan.</div>
                                                        </button>
                                                        <button type="button" class="list-group-item list-group-item-action text-start p-2 apply-sample-desc" data-text="For successfully completing the online course&#10;[course_name] on [date]">
                                                            <div class="fw-bold text-primary mb-1 small">Bahasa Inggris:</div>
                                                            <div class="small text-dark text-wrap" style="line-height: 1.4;">For successfully completing the online course [course_name] on [date]</div>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div class="form-group mb-3">
                                                    <label class="form-label">Description Font Size</label>
                                                    <select id="description_font_size_select" class="form-select">
                                                        <option value="12px">12px</option>
                                                        <option value="14px">14px</option>
                                                        <option value="16px" selected>16px (Default)</option>
                                                        <option value="18px">18px</option>
                                                        <option value="20px">20px</option>
                                                        <option value="24px">24px (Besar)</option>
                                                        <option value="28px">28px</option>
                                                        <option value="32px">32px</option>
                                                    </select>
                                                </div>

                                                <div class="form-group">
                                                    <label class="form-label">Description Color (Warna Deskripsi)</label>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <input type="color" id="description_color_picker" class="form-control form-control-color" value="#1e293b" title="Pilih Warna Deskripsi">
                                                        <input type="text" id="description_color_hex" class="form-control" value="#1e293b" placeholder="#1e293b" style="max-width: 130px;">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Background & Signature Accordion Item -->
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingMedia">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMedia" aria-expanded="false" aria-controls="collapseMedia">
                                                <i class="ti ti-photo me-2"></i> Background & Signature
                                            </button>
                                        </h2>
                                        <div id="collapseMedia" class="accordion-collapse collapse" aria-labelledby="headingMedia" data-bs-parent="#certBuilderAccordion">
                                            <div class="accordion-body">
                                                <div class="form-group mb-3">
                                                    @if ($certificate?->background)
                                                    <x-image-preview src="{{ asset($certificate?->background) }}" />
                                                    @endif
                                                    <label class="form-label">Certificate Background</label>
                                                    <input type="file" name="background" class="form-control">
                                                    <x-input-error :messages="$errors->get('background')" class="mt-2" />
                                                </div>

                                                <div class="form-group mb-3">
                                                    @if ($certificate?->signature)
                                                    <x-image-preview src="{{ asset($certificate?->signature) }}" />
                                                    @endif
                                                    <label class="form-label">Certificate Signature 1 (Tanda Tangan 1)</label>
                                                    <input type="file" name="signature" class="form-control">
                                                    <x-input-error :messages="$errors->get('signature')" class="mt-2" />
                                                </div>

                                                <div class="form-group">
                                                    @if ($certificate?->signature_2)
                                                    <x-image-preview src="{{ asset($certificate?->signature_2) }}" />
                                                    @endif
                                                    <label class="form-label">Certificate Signature 2 (Tanda Tangan 2 - Opsional)</label>
                                                    <input type="file" name="signature_2" class="form-control">
                                                    <x-input-error :messages="$errors->get('signature_2')" class="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mt-3">
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="ti ti-check me-1"></i> Update Certificate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
    
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="card-title m-0">Certificate Builder</h3>
                            <button type="button" id="toggle_layout_lock_btn" class="btn btn-sm btn-outline-warning">
                                <i class="ti ti-lock me-1"></i> <span id="lock_btn_text">Buka Kunci Posisi (Edit Layout)</span>
                            </button>
                        </div>
                        <div class="card-body overflow-auto">
                            <div class="certificate-body" style="{{ $certificate?->background ? 'background-image: url(' . asset($certificate->background) . ');' : '' }}">
                                <div id="title" class="title draggable-element">{{ $certificate?->title ?: 'Certificate of Completion' }}</div>
                                <div id="cert_number" class="cert_number draggable-element">ID: [certificate_id]</div>
                                <div id="subtitle" class="subtitle draggable-element">{{ $certificate?->sub_title ?: 'Certificate Subtitle' }}</div>
                                <div id="student_name" class="student_name draggable-element">[student_name]</div>
                                <div id="description" class="description draggable-element">{{ $certificate?->description ?: 'For successfully completing the course on [course_name]' }}</div>
                                @if ($certificate?->signature)
                                <div id="signature" class="signature draggable-element"><img src="{{ asset($certificate?->signature) }}" alt=""></div>
                                @endif
                                @if ($certificate?->signature_2)
                                <div id="signature_2" class="signature draggable-element"><img src="{{ asset($certificate?->signature_2) }}" alt=""></div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const certBody = document.querySelector('.certificate-body');
            const titleElem = document.querySelector('#title');
            const certNumElem = document.querySelector('#cert_number');
            const subtitleElem = document.querySelector('#subtitle');
            const studentNameElem = document.querySelector('#student_name');
            const descElem = document.querySelector('#description');

            // Live Title Font Family Selector
            const fontSelect = document.querySelector('#font_family_select');
            if (fontSelect && titleElem) {
                fontSelect.addEventListener('change', function() {
                    titleElem.style.fontFamily = this.value;
                });
            }

            // Live Cert Number Font Family Selector
            const certNumFontSelect = document.querySelector('#cert_number_font_family_select');
            if (certNumFontSelect && certNumElem) {
                certNumFontSelect.addEventListener('change', function() {
                    certNumElem.style.fontFamily = this.value;
                });
            }

            // Live Subtitle Font Family Selector
            const subtitleFontSelect = document.querySelector('#subtitle_font_family_select');
            if (subtitleFontSelect && subtitleElem) {
                subtitleFontSelect.addEventListener('change', function() {
                    subtitleElem.style.fontFamily = this.value;
                });
            }

            // Live Student Name Font Family Selector
            const studentNameFontSelect = document.querySelector('#student_name_font_family_select');
            if (studentNameFontSelect && studentNameElem) {
                studentNameFontSelect.addEventListener('change', function() {
                    studentNameElem.style.fontFamily = this.value;
                });
            }

            // Live Description Font Family Selector
            const descFontSelect = document.querySelector('#description_font_family_select');
            if (descFontSelect && descElem) {
                descFontSelect.addEventListener('change', function() {
                    descElem.style.fontFamily = this.value;
                });
            }

            // Live Title Font Size Selector
            const titleFontSizeSelect = document.querySelector('#title_font_size_select');
            if (titleFontSizeSelect && titleElem) {
                titleFontSizeSelect.addEventListener('change', function() {
                    titleElem.style.fontSize = this.value;
                });
                titleElem.style.fontSize = titleFontSizeSelect.value;
            }

            // Live Cert Number Font Size Selector
            const certNumFontSizeSelect = document.querySelector('#cert_number_font_size_select');
            if (certNumFontSizeSelect && certNumElem) {
                certNumFontSizeSelect.addEventListener('change', function() {
                    certNumElem.style.fontSize = this.value;
                });
                certNumElem.style.fontSize = certNumFontSizeSelect.value;
            }

            // Live Subtitle Font Size Selector
            const subtitleFontSizeSelect = document.querySelector('#subtitle_font_size_select');
            if (subtitleFontSizeSelect && subtitleElem) {
                subtitleFontSizeSelect.addEventListener('change', function() {
                    subtitleElem.style.fontSize = this.value;
                });
                subtitleElem.style.fontSize = subtitleFontSizeSelect.value;
            }

            // Live Student Name Font Size Selector
            const studentNameFontSizeSelect = document.querySelector('#student_name_font_size_select');
            if (studentNameFontSizeSelect && studentNameElem) {
                studentNameFontSizeSelect.addEventListener('change', function() {
                    studentNameElem.style.fontSize = this.value;
                });
                studentNameElem.style.fontSize = studentNameFontSizeSelect.value;
            }

            // Live Description Font Size Selector
            const descFontSizeSelect = document.querySelector('#description_font_size_select');
            if (descFontSizeSelect && descElem) {
                descFontSizeSelect.addEventListener('change', function() {
                    descElem.style.fontSize = this.value;
                });
                descElem.style.fontSize = descFontSizeSelect.value;
            }

            // Live Title Color Picker
            const titleColorPicker = document.querySelector('#title_color_picker');
            const titleColorHex = document.querySelector('#title_color_hex');

            if (titleColorPicker && titleElem) {
                titleColorPicker.addEventListener('input', function() {
                    titleElem.style.color = this.value;
                    if (titleColorHex) titleColorHex.value = this.value;
                });
            }

            if (titleColorHex && titleElem) {
                titleColorHex.addEventListener('input', function() {
                    titleElem.style.color = this.value;
                    if (titleColorPicker) titleColorPicker.value = this.value;
                });
            }

            // Live Cert Number Color Picker
            const certNumColorPicker = document.querySelector('#cert_number_color_picker');
            const certNumColorHex = document.querySelector('#cert_number_color_hex');

            if (certNumColorPicker && certNumElem) {
                certNumColorPicker.addEventListener('input', function() {
                    certNumElem.style.color = this.value;
                    if (certNumColorHex) certNumColorHex.value = this.value;
                });
            }

            if (certNumColorHex && certNumElem) {
                certNumColorHex.addEventListener('input', function() {
                    certNumElem.style.color = this.value;
                    if (certNumColorPicker) certNumColorPicker.value = this.value;
                });
            }

            // Live Subtitle Color Picker
            const subtitleColorPicker = document.querySelector('#subtitle_color_picker');
            const subtitleColorHex = document.querySelector('#subtitle_color_hex');

            if (subtitleColorPicker && subtitleElem) {
                subtitleColorPicker.addEventListener('input', function() {
                    subtitleElem.style.color = this.value;
                    if (subtitleColorHex) subtitleColorHex.value = this.value;
                });
            }

            if (subtitleColorHex && subtitleElem) {
                subtitleColorHex.addEventListener('input', function() {
                    subtitleElem.style.color = this.value;
                    if (subtitleColorPicker) subtitleColorPicker.value = this.value;
                });
            }

            // Live Student Name Color Picker
            const studentNameColorPicker = document.querySelector('#student_name_color_picker');
            const studentNameColorHex = document.querySelector('#student_name_color_hex');

            if (studentNameColorPicker && studentNameElem) {
                studentNameColorPicker.addEventListener('input', function() {
                    studentNameElem.style.color = this.value;
                    if (studentNameColorHex) studentNameColorHex.value = this.value;
                });
            }

            if (studentNameColorHex && studentNameElem) {
                studentNameColorHex.addEventListener('input', function() {
                    studentNameElem.style.color = this.value;
                    if (studentNameColorPicker) studentNameColorPicker.value = this.value;
                });
            }

            // Student Name Format Toggles (Bold, Italic, Underline)
            const btnBold = document.querySelector('#btn_student_name_bold');
            const btnItalic = document.querySelector('#btn_student_name_italic');
            const btnUnderline = document.querySelector('#btn_student_name_underline');

            if (btnBold && studentNameElem) {
                btnBold.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.classList.toggle('btn-secondary');
                    this.classList.toggle('btn-outline-secondary');
                    const isBold = this.classList.contains('active');
                    studentNameElem.style.fontWeight = isBold ? 'bold' : 'normal';
                });
            }

            if (btnItalic && studentNameElem) {
                btnItalic.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.classList.toggle('btn-secondary');
                    this.classList.toggle('btn-outline-secondary');
                    const isItalic = this.classList.contains('active');
                    studentNameElem.style.fontStyle = isItalic ? 'italic' : 'normal';
                });
            }

            if (btnUnderline && studentNameElem) {
                btnUnderline.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.classList.toggle('btn-secondary');
                    this.classList.toggle('btn-outline-secondary');
                    const isUnderline = this.classList.contains('active');
                    studentNameElem.style.textDecoration = isUnderline ? 'underline' : 'none';
                });
            }

            // Live Description Color Picker
            const descColorPicker = document.querySelector('#description_color_picker');
            const descColorHex = document.querySelector('#description_color_hex');

            if (descColorPicker && descElem) {
                descColorPicker.addEventListener('input', function() {
                    descElem.style.color = this.value;
                    if (descColorHex) descColorHex.value = this.value;
                });
            }

            if (descColorHex && descElem) {
                descColorHex.addEventListener('input', function() {
                    descElem.style.color = this.value;
                    if (descColorPicker) descColorPicker.value = this.value;
                });
            }

            // Live Text Inputs Preview
            const titleInput = document.querySelector('input[name="title"]');
            if (titleInput && titleElem) {
                titleInput.addEventListener('input', function() {
                    titleElem.textContent = this.value || 'Certificate of Completion';
                });
            }

            const subtitleInput = document.querySelector('input[name="subtitle"]');
            if (subtitleInput && subtitleElem) {
                subtitleInput.addEventListener('input', function() {
                    subtitleElem.textContent = this.value || 'Certificate Subtitle';
                });
            }

            const descInput = document.querySelector('textarea[name="description"]');
            if (descInput && descElem) {
                descInput.addEventListener('input', function() {
                    descElem.textContent = this.value || 'For successfully completing the course on [date]';
                });
            }

            // Click listener for sample description buttons
            document.querySelectorAll('.apply-sample-desc').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sampleText = this.getAttribute('data-text');
                    if (descInput && descElem) {
                        descInput.value = sampleText;
                        descElem.textContent = sampleText;
                    }
                });
            });

            const bgInput = document.querySelector('input[name="background"]');
            if (bgInput && certBody) {
                bgInput.addEventListener('change', function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            certBody.style.backgroundImage = 'url("' + evt.target.result + '")';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            const sigInput = document.querySelector('input[name="signature"]');
            const sigImg = document.querySelector('#signature img');
            if (sigInput && sigImg) {
                sigInput.addEventListener('change', function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            sigImg.src = evt.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            const sig2Input = document.querySelector('input[name="signature_2"]');
            const sig2Img = document.querySelector('#signature_2 img');
            if (sig2Input && sig2Img) {
                sig2Input.addEventListener('change', function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            sig2Img.src = evt.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Initialize Draggable in Disabled (Locked) state by default
            let isLayoutUnlocked = false;

            if (window.jQuery && $.fn.draggable) {
                $('.draggable-element').draggable({
                    containment: '.certificate-body',
                    disabled: true, // Locked by default
                    stop: function(event, ui) {
                        var elementId = $(this).attr('id');
                        var xPosition = ui.position.left;
                        var yPosition = ui.position.top;

                        $.ajax({
                            method: 'POST',
                            url: `{{ url('/') }}/admin/certificate-item`,
                            data: {
                                '_token': '{{ csrf_token() }}',
                                'element_id': elementId,
                                'x_position': xPosition,
                                'y_position': yPosition
                            }
                        });
                    }
                });
            }

            // Toggle Lock/Unlock button logic
            const toggleLockBtn = document.querySelector('#toggle_layout_lock_btn');
            const lockBtnText = document.querySelector('#lock_btn_text');

            if (toggleLockBtn) {
                toggleLockBtn.addEventListener('click', function() {
                    isLayoutUnlocked = !isLayoutUnlocked;
                    
                    if (window.jQuery && $.fn.draggable) {
                        $('.draggable-element').draggable('option', 'disabled', !isLayoutUnlocked);
                    }

                    if (isLayoutUnlocked) {
                        this.classList.remove('btn-outline-warning');
                        this.classList.add('btn-success');
                        this.innerHTML = '<i class="ti ti-lock-open me-1"></i> <span id="lock_btn_text">Kunci Posisi (Selesai Edit)</span>';
                        notyf.success('Posisi unlocked! Anda bisa menggeser posisi elemen sekarang.');
                    } else {
                        this.classList.remove('btn-success');
                        this.classList.add('btn-outline-warning');
                        this.innerHTML = '<i class="ti ti-lock me-1"></i> <span id="lock_btn_text">Buka Kunci Posisi (Edit Layout)</span>';
                        notyf.info('Posisi locked! Tata letak terkunci aman.');
                    }
                });
            }
        });
    </script>
@endpush

@push('styles')
    <style>
        #title {
            left: {{ $certificateItems->where('element_id', 'title')->first()?->x_position ?? 300 }}px;
            top: {{ $certificateItems->where('element_id', 'title')->first()?->y_position ?? 150 }}px;
        }
        #cert_number {
            left: {{ $certificateItems->where('element_id', 'cert_number')->first()?->x_position ?? 300 }}px;
            top: {{ $certificateItems->where('element_id', 'cert_number')->first()?->y_position ?? 185 }}px;
        }
        #subtitle {
            left: {{ $certificateItems->where('element_id', 'subtitle')->first()?->x_position ?? 300 }}px;
            top: {{ $certificateItems->where('element_id', 'subtitle')->first()?->y_position ?? 225 }}px;
        }
        #student_name {
            left: {{ $certificateItems->where('element_id', 'student_name')->first()?->x_position ?? 300 }}px;
            top: {{ $certificateItems->where('element_id', 'student_name')->first()?->y_position ?? 260 }}px;
        }
        #description {
            left: {{ $certificateItems->where('element_id', 'description')->first()?->x_position ?? 200 }}px;
            top: {{ $certificateItems->where('element_id', 'description')->first()?->y_position ?? 320 }}px;
        }
        #signature {
            left: {{ $certificateItems->where('element_id', 'signature')->first()?->x_position ?? 550 }}px;
            top: {{ $certificateItems->where('element_id', 'signature')->first()?->y_position ?? 400 }}px;
        }
        #signature_2 {
            left: {{ $certificateItems->where('element_id', 'signature_2')->first()?->x_position ?? 700 }}px;
            top: {{ $certificateItems->where('element_id', 'signature_2')->first()?->y_position ?? 400 }}px;
        }
    </style>
@endpush