# Product Requirements Document (PRD)
## Migrasi Monolitik Blade ke Laravel 13 + React + Inertia.js (Clean Code Architecture)

---

## 1. Ringkasan Eksekutif & Tujuan Proyek

### 1.1 Latar Belakang
Aplikasi LMS (Learning Management System) saat ini berjalan di **Laravel 13** dengan rendering sisi server konvensional (**Blade Views**) dan manipulasi DOM berbasis jQuery / JavaScript prosedural. Untuk meningkatkan user experience (UX) menjadi Single Page Application (SPA) yang responsif, modern, dan interaktif tanpa kehilangan kemudahan routing dan otentikasi Laravel, sistem akan dimigrasikan ke tumpukan **Laravel + React + Inertia.js**.

### 1.2 Tujuan Utama
1. **Zero Full-Page Reload**: Seluruh navigasi, submit formulir, dan filter data berjalan secara asinkronus dan mulus via Inertia.js.
2. **Pelestarian Desain Asli (Pixel-Perfect Consistency)**:
   - Tampilan **Admin** tetap mempertahankan desain **Tabler Admin UI**.
   - Tampilan **Instruktor**, **User/Student**, dan **Public Frontend** tetap mempertahankan desain **EduCore Theme**.
   - Aset CSS (`tabler.min.css`, `style.css`, `bootstrap.min.css`, dll.) tetap digunakan; struktur Blade HTML dikonversi menjadi React JSX Components.
3. **Clean Code & Enterprise Architecture**:
   - Menghilangkan logika bisnis dari Controller.
   - Menerapkan arsitektur berlapis: **Controller $\rightarrow$ FormRequest $\rightarrow$ Service $\rightarrow$ Interface/Contract $\rightarrow$ Repository $\rightarrow$ Resource (Data Transformer)**.
4. **Struktur Frontend Modular**:
   - Pengelompokan modular di `resources/js/` dengan namespace yang jelas:
     - `Admin/`
     - `Instructor/`
     - `User/`
     - `Components/` (Shared UI)
     - `Layouts/` (Shared Layouts)
     - `Hooks/` & `Utils/`

---

## 2. Arsitektur Backend (Clean Code)

Setiap modul fitur akan mengikuti alur tanggung jawab tunggal (*Single Responsibility Principle*):

```
HTTP Request
     │
     ▼
[FormRequest] (Validasi input, otorisasi, sanitasi)
     │
     ▼
[Controller] (Orkestrator tipis: menerima DTO, memanggil Service, return Inertia::render)
     │
     ▼
[Service Layer] (Logika bisnis, upload file, transaksi DB, integrasi gateway payment)
     │
     ▼
[Repository Interface] (Contract / Abstraksi)
     │
     ▼
[Eloquent Repository] (Query Eloquent, pagination, filter, relasi)
     │
     ▼
[Database (PostgreSQL 18)]
     │
     ▼
[Inertia / API Resource] (Transformasi payload data props yang bersih & aman ke React)
```

### 2.1 Struktur Direktori Backend
```
app/
├── Contracts/                 # Interface abstraksi
│   ├── Repositories/
│   │   ├── CourseRepositoryInterface.php
│   │   ├── UserRepositoryInterface.php
│   │   ├── OrderRepositoryInterface.php
│   │   └── ...
│   └── Services/
│       ├── CourseServiceInterface.php
│       ├── PaymentServiceInterface.php
│       └── ...
├── Repositories/              # Implementasi query database (Eloquent)
│   ├── Eloquent/
│   │   ├── CourseRepository.php
│   │   ├── UserRepository.php
│   │   ├── OrderRepository.php
│   │   └── ...
├── Services/                  # Business logic & orchestration
│   ├── CourseService.php
│   ├── OrderService.php
│   ├── PaymentService.php
│   ├── MediaService.php       # Upload image/video handling
│   └── ...
├── Http/
│   ├── Controllers/           # Thin Controllers
│   │   ├── Admin/
│   │   │   ├── CourseController.php
│   │   │   ├── DashboardController.php
│   │   │   └── ...
│   │   ├── Instructor/
│   │   │   ├── CourseController.php
│   │   │   └── ...
│   │   └── Frontend/
│   │       ├── HomeController.php
│   │       ├── CourseController.php
│   │       ├── CartController.php
│   │       └── ...
│   ├── Requests/              # Validasi FormRequest
│   │   ├── Admin/
│   │   │   ├── CourseStoreRequest.php
│   │   │   └── ...
│   │   ├── Instructor/
│   │   └── Frontend/
│   └── Resources/             # Data Transformers untuk Inertia Props
│       ├── Admin/
│       │   ├── CourseListResource.php
│       │   └── ...
│       ├── Instructor/
│       └── Frontend/
│           ├── CourseDetailResource.php
│           └── ...
└── Providers/
    └── RepositoryServiceProvider.php   # Binding Interface ke Implementasi
```

---

## 3. Arsitektur Frontend (`resources/js/`)

Struktur direktori frontend dirancang modular dan terpisah berdasarkan domain pengguna:

```
resources/js/
├── app.jsx                    # Entry point Inertia
├── bootstrap.js               # Axios & global setup
│
├── Admin/                     # MODUL ADMIN (Tabler Theme)
│   ├── Layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── Pages/
│   │   ├── Dashboard/Index.jsx
│   │   ├── Courses/
│   │   │   ├── Index.jsx
│   │   │   └── Edit.jsx
│   │   ├── Categories/
│   │   ├── Orders/
│   │   ├── Users/
│   │   ├── Blogs/
│   │   ├── Settings/
│   │   └── WithdrawRequests/
│   └── Components/            # Komponen khusus Admin
│       ├── StatCard.jsx
│       ├── DataTable.jsx
│       └── StatusBadge.jsx
│
├── Instructor/                # MODUL INSTRUKTOR (EduCore Dashboard Theme)
│   ├── Layouts/
│   │   ├── InstructorLayout.jsx
│   │   ├── InstructorSidebar.jsx
│   │   └── InstructorHeader.jsx
│   ├── Pages/
│   │   ├── Dashboard/Index.jsx
│   │   ├── Courses/
│   │   │   ├── Index.jsx
│   │   │   ├── Create.jsx
│   │   │   ├── Edit.jsx
│   │   │   └── Curriculum/    # Chapter & Lesson Manager
│   │   ├── Orders/
│   │   ├── Payouts/
│   │   └── Profile/
│   └── Components/
│       ├── CourseStepNav.jsx
│       └── ChapterAccordion.jsx
│
├── User/                      # MODUL USER / STUDENT & PUBLIC (EduCore Theme)
│   ├── Layouts/
│   │   ├── AppLayout.jsx      # Layout Public Frontend (Navbar, Footer, Search)
│   │   ├── StudentLayout.jsx  # Layout Student Dashboard (Sidebar Profil)
│   │   └── PlayerLayout.jsx   # Layout Video Player Belajar (Distraction-free)
│   ├── Pages/
│   │   ├── Home/Index.jsx
│   │   ├── Courses/
│   │   │   ├── Index.jsx      # Catalog & Filter
│   │   │   └── Show.jsx       # Course Detail
│   │   ├── Cart/Index.jsx
│   │   ├── Checkout/Index.jsx
│   │   ├── Learn/Player.jsx   # Video Course Player
│   │   ├── Student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EnrolledCourses.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   └── Profile.jsx
│   │   ├── Blogs/
│   │   └── Contact/
│   └── Components/
│       ├── CourseCard.jsx
│       ├── HeroBanner.jsx
│       ├── FilterSidebar.jsx
│       └── CartDrawer.jsx
│
├── Components/                # GLOBAL SHARED COMPONENTS
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── Dropdown.jsx
│   │   ├── InputField.jsx
│   │   ├── SelectField.jsx
│   │   ├── FileUpload.jsx
│   │   └── RichTextEditor.jsx
│   └── Notifications/
│       └── FlashAlert.jsx     # Notyf / Toast Handler
│
├── Hooks/                     # Custom React Hooks
│   ├── useFilter.js           # Debounced search & query params
│   ├── useNotification.js    # Flash notification listener
│   └── useModal.js            # Modal state controller
│
└── Utils/                     # Helper Functions
    ├── formatters.js          # Currency IDR/USD, Date, Duration
    └── routes.js              # Ziggy integration
```

---

## 4. Rencana Implementasi Bertahap (Roadmap Per Fase)

Proses migrasi dibagi ke dalam **4 Fase Terstruktur** untuk meminimalkan risiko regresi data dan fungsionalitas:

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 0: Pondasi & Infrastruktur (Inertia, React, Clean Code)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: Admin Panel Migration (Tabler UI)                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: Instructor Dashboard Migration (EduCore UI)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: User/Student & Public Frontend (EduCore UI)         │
└─────────────────────────────────────────────────────────────┘
```

---

### FASE 0: Pondasi & Infrastruktur (Inertia + React + Arsitektur Dasar)

* **Tujuan**: Mempersiapkan lingkungan kerja agar React, Inertia, dan Clean Code layer siap digunakan tanpa merusak route Blade yang belum dimigrasi (Dual-Engine Mode).
* **Deliverables**:
  1. **Package Setup**:
     - Backend: `composer require inertiajs/inertia-laravel tightenco/ziggy`
     - Frontend: `npm install @inertiajs/react react react-dom @vitejs/plugin-react`
  2. **Vite & Template Root**:
     - Konfigurasi `vite.config.js` dengan `@vitejs/plugin-react`.
     - Pembuatan root template `resources/views/app.blade.php`.
     - Pembuatan `resources/js/app.jsx` dengan dynamic page resolver.
  3. **Middleware Inertia**:
     - Register `HandleInertiaRequests` middleware.
     - Sharing props global: `auth` (user, admin, instructor), `flash` (success, error via Notyf), `settings` (site_name, logo, favicon, currency).
  4. **Base Clean Code Setup**:
     - Pembuatan `RepositoryServiceProvider` dan direktori dasar (`Contracts`, `Repositories`, `Services`, `Requests`, `Resources`).

---

### FASE 1: Migrasi Admin Panel (`resources/js/Admin/`)

* **Target UI**: Tabler UI (`tabler.min.css`, `@tabler/icons`, Inter Font).
* **Lingkup Modul**:
  1. **Auth Admin**:
     - Login Admin (`/admin/login`), Forgot Password.
  2. **Admin Shell / Layout**:
     - `AdminLayout.jsx` (Sidebar collapsible, Header dengan Profil & Notifikasi, Dark/Light Mode Switch, Footer).
  3. **Dashboard Admin**:
     - Widget statistik: Total Revenue, Total Kursus, Total Siswa, Total Instruktor.
     - Grafik pendaftaran kursus dan transaksi bulanan.
  4. **Manajemen Kursus & Kategori**:
     - Daftar Kursus (filter status: pending, approved, rejected).
     - Kategori & Sub-Kategori Kursus (CRUD + modal icon/image).
     - Course Level & Course Language.
  5. **Instruktur & Persetujuan**:
     - Permohonan Instruktur (Verifikasi dokumen, Approve/Reject dengan email notifikasi).
     - Withdraw Requests (Proses penarikan dana instruktur).
  6. **Pesanan & Keuangan**:
     - Daftar Order & Invoice detail.
     - Pengaturan Payment Gateway (PayPal, Stripe, Razorpay).
     - Pengaturan Payout Gateway (Bank Transfer, PayPal).
  7. **Konten & Pengaturan Web**:
     - Blog & Kategori Blog (Rich text editor, tags, cover).
     - Testimonial & Review Management.
     - Dynamic Sections (Hero, Feature, Counter, Video, Top Bar, Footer).
     - Site Settings (General, Logo, Favicon, Mail Server SMTP).

---

### FASE 2: Migrasi Instruktor Panel (`resources/js/Instructor/`)

* **Target UI**: EduCore Instructor Dashboard (Bootstrap 5, Feather/FontAwesome Icons).
* **Lingkup Modul**:
  1. **Instruktur Layout**:
     - `InstructorLayout.jsx` (Sidebar navigasi, Quick Wallet Balance, Profil Menu).
  2. **Dashboard Instruktor**:
     - Total pendapatan (Wallet), Total siswa aktif, Kursus aktif, Rata-rata rating review.
     - Aktivitas penjualan terbaru.
  3. **Course Management Engine (Fitur Kritis)**:
     - Form Multi-step Course Creation:
       - Step 1: Informasi Dasar (Judul, slug, kategori, bahasa, level).
       - Step 2: Media & Detail (Thumbnail image crop/upload, Demo video YouTube/Storage, Deskripsi lengkap).
       - Step 3: Harga & Diskon.
     - **Curriculum Builder (Bab & Materi)**:
       - Tambah/Edit Bab (Chapters).
       - Tambah/Edit Pelajaran (Lessons: Video, Storage link, Durasi, Dokumen lampiran, Free Preview toggle).
       - Drag-and-drop / Sortable urutan bab dan pelajaran.
  4. **Keuangan & Penarikan Dana**:
     - Pengaturan Akun Pembayaran (Payout Account Information).
     - Request Penarikan Dana (Withdraw Request Form & Riwayat Penarikan).
  5. **Manajemen Siswa & Review**:
     - Melihat daftar siswa yang terdaftar di kursus masing-masing.
     - Menjawab ulasan (Q&A / Reviews).

---

### FASE 3: Migrasi User/Student & Public Frontend (`resources/js/User/`)

* **Target UI**: EduCore Public Theme & Student Dashboard.
* **Lingkup Modul**:
  1. **Public Layout & Navigation**:
     - `AppLayout.jsx` (Header dinamis dengan keranjang belanja, status login, mega menu kategori, footer responsive).
  2. **Halaman Publik Utama**:
     - **Landing Page (Home)**: Hero slider, Banner penawaran, Kategori terpopuler, Kursus pilihan/unggulan, Counter statistik, Video pengenalan, Testimonial, Blog terbaru.
     - **Katalog Kursus (`/courses`)**: Filter multi-dimensi (Kategori, Level, Bahasa, Rating, Rentang Harga Slider), live sorting tanpa reload, pagination.
     - **Detail Kursus (`/course/{slug}`)**: Silabus kursus interaktif (accordion bab & pelajaran), demo video modal (Venobox/Plyr), bio instruktur, daftar review siswa, tombol "Add to Cart" / "Enroll Now".
     - **Blog & Halaman Statis**: Blog archive, Blog detail, Contact Us, About Us, Custom Dynamic Pages.
  3. **Keranjang & Checkout (E-Commerce)**:
     - Slide-over / Cart Page: Update jumlah, hapus item, ringkasan subtotal.
     - Checkout Page: Pilih metode pembayaran (PayPal, Stripe, Razorpay), integrasi payment callback via Inertia.
  4. **Dashboard Siswa (`/student/dashboard`)**:
     - `StudentLayout.jsx` (Navigasi profil siswa).
     - **Enrolled Courses**: Grid kursus yang telah dibeli beserta progress bar penyelesaian.
     - **Order History**: Riwayat transaksi & unduh invoice PDF.
     - **Profil & Ganti Password**: Update data diri dan avatar.
  5. **Learning Player (Distraction-Free Video Classroom)**:
     - `PlayerLayout.jsx`: Layar belajar penuh dengan pemutar video adaptif.
     - Sidebar silabus materi dengan penanda centang selesai (*Watch History & Progress Tracking*).
     - Fitur unduh sertifikat kelulusan otomatis jika progres telah 100%.

---

## 5. Standar Teknis & Best Practices

### 5.1 Penanganan State & Data
- **Form Handling**: Wajib menggunakan hook `useForm` dari `@inertiajs/react` untuk mengelola input, error validasi, dan indikator loading state.
- **Filtering & Search**: Menggunakan helper `router.get(url, params, { preserveState: true, replace: true })` dengan debouncing untuk pencarian instan tanpa flicker.
- **Modal Dialogs**: Komponen Modal React terkontrol (*controlled components*), menggantikan manipulasi modal jQuery.

### 5.2 Notifikasi & Flash Messages
- Notifikasi `session()->flash('success', '...')` dari Laravel ditangkap otomatis oleh shared props Inertia dan diteruskan ke **Notyf / Toast** adapter di React.

### 5.3 Otorisasi & Keamanan
- Middleware otentikasi role-based: `auth:web` (User/Student/Instructor) dan `auth:admin` (Admin).
- Pencegahan kebocoran data sensitif dengan selalu melewatkan model melalui **Inertia Resource DTOs** sebelum dirender ke view React.

---

## 6. Kriteria Keberhasilan (Definition of Done)
1. Seluruh fitur yang saat ini ada di Blade berjalan 100% pada versi React + Inertia tanpa ada fungsionalitas yang hilang.
2. Tampilan visual, warna, font, dan spacing identik dengan versi sebelumnya (CSS asli dipertahankan).
3. Controller backend berukuran ramping (*thin controller*), dengan seluruh logika bisnis berada di Service layer dan query di Repository layer.
4. Nilai Core Web Vitals dan kecepatan navigasi halaman meningkat signifikan berkat SPA transition Inertia.js.
