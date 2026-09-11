<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# LMS Update Project

A modern Learning Management System (LMS) built with **Laravel**, **Inertia.js**, and **React**.

---

## 🚀 Rincian Fitur & Pembaruan Terbaru (Changelog)

### 1. 🔔 Sistem Notifikasi Real-Time Database Admin
- **Database & Model (`admin_notifications`)**: Tabel khusus pencatatan notifikasi sistem ke Admin dengan field `title`, `message`, `url`, `is_read`, dan timestamp.
- **Topbar Admin Header Dropdown**: Icon lonceng notifikasi (`SVG`) dengan badge merah berpenunjuk angka belum dibaca (`unread_admin_notifications_count`).
- **Trigger Notifikasi Otomatis**:
  1. Instruktur mengajukan penarikan dana (*Payout Request*).
  2. Instruktur membuat draf kursus baru (*Basic Info*).
  3. Instruktur mengajukan peninjauan kursus (*Submit Course for Review*).
- **Interaksi Satu Klik**: Klik item notifikasi menandai sebagai dibaca dan mengarahkan Admin langsung ke halaman rincian bersangkutan.

### 2. 💸 Penarikan Dana & Mode Payout Ganda (Dual Payout Mode: Manual vs Xendit API)
- **Pengaturan Payout Mode di Admin**: Menu `Payment Settings -> Xendit Configuration` menyediakan opsi saklar:
  - 📝 **Manual Transfer**: Transfer manual via m-Banking lalu tandai status *Approved*.
  - ⚡ **Automatic Xendit Payout API**: Transfer instan otomatis langsung ke 100+ Bank & E-Wallet (DANA, OVO, GoPay) via Xendit Disbursement API.
- **SweetAlert2 Modal Interaktif**: Dialog konfirmasi modern bertema dinamis (*Approve*, *Reject*, atau *API Dispatch*).
- **Redesign Halaman Details Payout**: Tampilan kartu modern dengan info rekening instruktur, avatar kondisional (foto profil/inisial nama), serta status badge.

### 3. 🏷️ Arsitektur Sistem Harga & Diskon Kursus Konsisten
- **Model Accessor (`final_price`)**: Virtual attribute `course.final_price` di model `Course.php` secara otomatis menghitung `price - discount` tanpa ambigu.
- **Label Form Instruktur Jelas**:
  - `Price / Harga Normal (Rp)` (Harga sebelum diskon).
  - `Discount Amount / Potongan Diskon (Rp)` (Nominal potongan diskon).
- **Visualisasi Harga Tiga Elemen**:
  - **Harga Akhir (Hijau Utama)**: Rp 180.000
  - **Harga Asli (Abu Coret)**: ~~Rp 200.000~~
  - **Badge Potongan**: Diskon Rp 20.000
- **Pewarnaan Baris Manajemen Kursus Admin**:
  - Baris bertanda **Pending**: Latar kuning pastel lembut (`rgba(254, 240, 138, 0.25)`).
  - Baris bertanda **Rejected**: Latar merah pastel lembut (`rgba(254, 226, 226, 0.35)`).

### 4. 📢 Sistem Pengumuman Kursus (Announcements System)
- **Model & Database**: Dibuat tabel `course_announcements` dengan kolom `content` bertipe `LONGTEXT` untuk mendukung penyimpanan teks kaya (Rich Text) dan gambar.
- **Wizard Manajemen Instruktur**: Ditambahkan langkah ke-3 **Announcements** pada form pengeditan kursus instruktur.
- **Manajemen Gambar Otomatis (`unlink`)**: Saat pengumuman dihapus, seluruh file gambar yang terlampir pada isi HTML pengumuman akan secara otomatis di-`unlink()` dari direktori server.
- **Tampilan Siswa**: Dibuat `AnnouncementsTab.jsx` pada Course Player siswa untuk menampilkan pengumuman terbaru dengan indikator waktu relatif.

### 5. 💬 Diskusi & Q&A (Question & Answer System)
- **Format Waktu Relatif**: Menampilkan waktu relatif Bahasa Indonesia (*"Baru saja"*, *"5 menit yang lalu"*, *"3 hari yang lalu"*) menggunakan helper `timeAgo()`.
- **Fitur Load More ("Lihat Lainnya")**: Secara default hanya menampilkan 10 pertanyaan teratas dengan tombol *Lihat lainnya (+10)*.

### 6. ⭐ Sistem Ulasan Peserta & Tanggapan (Reviews & Persistent Votes)
- **Desain Modern Udemy-Style**: Ringkasan skor rata-rata dengan breakdown persentase bintang (1-5 Bintang), avatar inisial nama, pencarian, dan filter ulasan.
- **Tanggapan Interaktif & Persisten (`review_votes`)**: Constraint `unique(['user_id', 'review_id'])` menjaga tanggapan user tersimpan secara permanen.

---

## 🛠️ Teknologi yang Digunakan
- **Backend**: PHP 8.x, Laravel 11.x, Eloquent ORM, Xendit PHP SDK
- **Frontend**: Inertia.js, React 19, Bootstrap 5, Tabler UI Icons, FontAwesome
- **Utility**: Custom `timeAgo` & `formatCurrency`, SweetAlert2, Notyf Notifications, Axios AJAX
