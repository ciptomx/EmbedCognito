# Document Conversion Tools

Aplikasi web profesional untuk mengkonversi dokumen antara berbagai format dengan interface yang modern dan responsif menggunakan Tailwind CSS.

## 🚀 Fitur Utama

### 1. Word to HTML Converter
- Konversi teks Word ke HTML yang bersih
- Dukungan untuk format dasar (bold, italic, underline, strikethrough)
- Konversi header (H1, H2, H3)
- Konversi list (bullet dan numbered)
- Upload file (.doc, .docx, .txt)
- Output HTML yang terstruktur dengan baik

### 2. HTML to Markdown Converter
- Konversi HTML ke Markdown yang sempurna
- Dukungan untuk semua elemen HTML umum
- Konversi link, gambar, dan formatting
- Output Markdown yang bersih dan mudah dibaca
- Preservasi struktur dokumen

### 3. HTML to BBCode Converter
- Konversi HTML ke BBCode untuk forum
- Dukungan untuk formatting dasar dan lanjutan
- Konversi list, quote, dan elemen lainnya
- Output BBCode yang kompatibel dengan berbagai platform

### 4. Blockquote Generator
- Generator blockquote HTML yang mudah digunakan
- Preview real-time
- Opsi untuk menambahkan author dan source
- Output HTML yang terstruktur dengan baik
- Styling yang menarik

## 🎨 Fitur Desain

- **Interface Modern**: Design yang clean dan profesional
- **Responsif**: Bekerja sempurna di desktop, tablet, dan mobile
- **Tailwind CSS**: Utility-first CSS framework untuk rapid development
- **Color Scheme**: Menggunakan tema merah sesuai dengan gambar referensi
- **Icon**: Font Awesome icons untuk visual yang menarik
- **Hover Effects**: Interaksi yang engaging dengan animasi smooth

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur semantik yang modern
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript ES6+**: Fungsi konversi yang powerful
- **Font Awesome**: Icon library yang komprehensif
- **Responsive Design**: Mobile-first approach

## 📱 Responsivitas

Aplikasi ini dirancang dengan pendekatan mobile-first dan mendukung:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small Mobile (< 480px)

## 🚀 Cara Penggunaan

### Setup
1. Download semua file ke folder yang sama
2. Buka `index.html` di browser modern
3. Aplikasi siap digunakan!

### Word to HTML
1. Klik pada judul "Word to HTML Converter"
2. Paste teks Word atau upload file
3. Klik "Convert to HTML"
4. Copy hasil HTML yang dihasilkan

### HTML to Markdown
1. Klik pada judul "HTML to Markdown Converter"
2. Paste kode HTML
3. Klik "Convert to Markdown"
4. Copy hasil Markdown

### HTML to BBCode
1. Klik pada judul "HTML to BBCode Converter"
2. Paste kode HTML
3. Klik "Convert to BBCode"
4. Copy hasil BBCode

### Blockquote Generator
1. Klik pada judul "Blockquote Generator"
2. Masukkan quote, author, dan source (opsional)
3. Klik "Generate Blockquote"
4. Lihat preview dan copy HTML yang dihasilkan

## 📋 Fitur Tambahan

- **Auto-resize Textarea**: Textarea yang menyesuaikan ukuran konten
- **Copy to Clipboard**: Tombol copy yang mudah digunakan
- **File Upload**: Dukungan untuk upload file Word
- **Sample Data**: Data contoh untuk testing
- **Success Messages**: Notifikasi yang informatif
- **Toggle Tool Content**: Klik judul untuk show/hide tool content
- **Error Handling**: Penanganan error yang baik

## 🔧 Customization

### Mengubah Warna Tema
Edit file HTML dan ubah konfigurasi Tailwind:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#e74c3c',    // Warna utama
                secondary: '#2c3e50',  // Warna sekunder
                success: '#27ae60',    // Warna sukses
                info: '#3498db',       // Warna info
                warning: '#f39c12'     // Warna warning
            }
        }
    }
}
```

### Menambah Tool Baru
1. Tambahkan HTML structure di `index.html`
2. Gunakan class Tailwind CSS untuk styling
3. Tambahkan fungsi JavaScript di `script.js`

## 📁 Struktur File

```
document-conversion-tools/
├── index.html          # File HTML utama dengan Tailwind CSS
├── demo.html           # Halaman demo dengan Tailwind CSS
├── test.html           # Halaman testing dengan Tailwind CSS
├── script.js           # Fungsi JavaScript
├── package.json        # Konfigurasi project
├── README.md           # Dokumentasi ini
└── STRUCTURE.md        # Overview arsitektur aplikasi
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers modern

## 📝 Keunggulan Tailwind CSS

- **Utility-First**: Styling langsung dengan class utility
- **Responsive**: Built-in responsive design classes
- **Customizable**: Mudah dikustomisasi dengan config
- **Performance**: CSS yang dioptimasi
- **Developer Experience**: Rapid development dengan utility classes

## 🚀 Cara Menjalankan

### 1. Local Development
```bash
# Buka file index.html langsung di browser
# Atau gunakan live server
npx live-server

# Atau gunakan Python
python3 -m http.server 8000
```

### 2. Production
- Upload semua file ke web server
- Aplikasi siap digunakan tanpa build process
- Tailwind CSS di-load dari CDN

## 🔒 Security & Best Practices

- **Input Sanitization**: HTML escaping untuk user input
- **Safe DOM manipulation**: Menggunakan createElement untuk parsing
- **XSS Prevention**: Tidak ada eval() atau innerHTML langsung
- **File Validation**: Validasi tipe dan ukuran file

## 📈 Performance

- **CDN Loading**: Tailwind CSS dari CDN untuk performa optimal
- **Minimal Dependencies**: Hanya Font Awesome sebagai external dependency
- **Efficient Algorithms**: Konversi yang cepat dan efisien
- **Lazy Loading**: Tool content hanya di-load saat dibutuhkan

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau report issues.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan HTML, JavaScript, dan Tailwind CSS**