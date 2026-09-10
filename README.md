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

### 1. 📢 Sistem Pengumuman Kursus (Announcements System)
- **Model & Database**: Dibuat tabel `course_announcements` dengan kolom `content` bertipe `LONGTEXT` untuk mendukung penyimpanan teks kaya (Rich Text) dan gambar berukuran besar.
- **Wizard Manajemen Instruktur**: Ditambahkan langkah ke-3 **Announcements** pada form pengeditan kursus instruktur.
- **Manajemen Gambar Otomatis (`unlink`)**: Saat pengumuman dihapus, seluruh file gambar yang terlampir pada isi HTML pengumuman akan secara otomatis di-`unlink()` dari direktori server.
- **Tampilan Siswa**: Dibuat `AnnouncementsTab.jsx` pada Course Player siswa untuk menampilkan pengumuman terbaru dengan indikator waktu relatif.

### 2. 💬 Diskusi & Q&A (Question & Answer System)
- **Format Waktu Relatif**: Menampilkan waktu relatif Bahasa Indonesia (*"Baru saja"*, *"5 menit yang lalu"*, *"3 hari yang lalu"*) menggunakan helper `timeAgo()`.
- **Fitur Load More ("Lihat Lainnya")**: Secara default hanya menampilkan 10 pertanyaan teratas, dan menyediakan tombol *Lihat lainnya (+10)* untuk menjaga performa rendering tetap cepat pada data dalam jumlah besar.

### 3. ⭐ Sistem Ulasan Peserta & Tanggapan (Reviews & Persistent Votes)
- **Desain Modern Udemy-Style**:
  - Ringkasan skor rata-rata dengan breakdown persentase bintang (1-5 Bintang).
  - Avatar lingkaran dengan **Inisial Dua Huruf Nama User** (misal: *Jhon Deo* -> `JD`).
  - Fitur pencarian ulasan (*Cari ulasan*) dan filter berdasarkan peringkat bintang.
  - Pembatasan 1 ulasan per user per kursus dengan notifikasi ucapan terima kasih.
  - Format judul jumlah ulasan `Reviews (1)` (tanpa `0` di depan).
- **Fitur Load More**: Default 10 data ulasan terbaru dengan tombol *Lebih banyak ulasan*.
- **Tanggapan Interaktif & Persisten (`review_votes`)**:
  - Dibuat tabel & model `ReviewVote` dengan constraint `unique(['user_id', 'review_id'])`.
  - User hanya bisa memilih **satu** tanggapan per ulasan (*Sangat Membantu* / *Kurang Membantu*). Tombol sebaliknya akan otomatis terkunci.
  - Tanggapan tersimpan secara permanen di database dan tetap aktif saat reload halaman maupun re-login.

### 4. 🎓 Dashboard & Modal Detail Review Instruktur
- **Tombol Review di Tabel Instruktur**: Tombol `Review` berwarna oranye (`#c25e00`) pada daftar kursus instruktur.
- **Modal XXL Detail Review (`InstructorReviewsModal.jsx`)**:
  - Tampilan ekstra luas (`maxWidth: 1300px`) dengan tabel berukuran pas (`tableLayout: 'fixed'`).
  - Menampilkan nama kolom **User** (bukan *Siswa*).
  - Menampilkan rincian statistik ulasan yang dilaporkan, ulasan positif, serta total tanggapan **Likes & Dislikes** yang dihitung secara akurat dari database.

---

## 🛠️ Teknologi yang Digunakan
- **Backend**: PHP 8.x, Laravel 11.x, Eloquent ORM
- **Frontend**: Inertia.js, React, Bootstrap 5, FontAwesome Icons
- **Utility**: Custom `timeAgo` formatter, SweetAlert2 / Notyf Notifications, Axios AJAX

