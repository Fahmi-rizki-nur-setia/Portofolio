# Portofolio Fahmi Rizki Nur Setia

Struktur: index.html, css/style.css, js/script.js, assets/ (profile.jpg, CV PDF, favicon).
Semua path relatif, jadi aman untuk GitHub Pages (https://pamie-still-learning.github.io/Portofolio) maupun Vercel.

## Jalankan lokal
VS Code: install extension Live Server, buka folder ini, klik Go Live di status bar.
(Butuh internet untuk font Google dan GSAP dari CDN.)

## Deploy ke GitHub Pages
1. Ganti isi repo `Portofolio` dengan semua file di folder ini (index.html harus di root).
2. Commit dan push ke branch main. Settings > Pages > Deploy from a branch > main / root.

## Edit konten
- Teks dan pengalaman: index.html
- Warna: variabel di :root pada css/style.css (--steel, --steel-deep, --bone, --ink)
- Ganti CV: timpa assets/CV_Fahmi_Rizki_Nur_Setia.pdf dengan nama file yang sama
- Contoh data di lembar kerja hero adalah ilustrasi (ubah di index.html)
