/* ================================
   JAVASCRIPT LANJUTAN — SILA
   DOM, Event Handling, CRUD, localStorage
   ================================ */

// ════════════════════════════════
// DATA LAYER (localStorage)
// localStorage adalah penyimpanan data di browser
// Data tidak hilang meskipun: halaman di-refresh, browser ditutup
// yang bertahan meskipun halaman ditutup/refresh.
// Data disimpan sebagai string JSON.
// Alur: Array → JSON → localStorage
// ════════════════════════════════

// 1. Membaca data dari localstorage dan mengkonversi (JSON ke Array)
function getData(){
   const raw = localStorage.getItem('sila_data');
   // Jika datanya ada. Parse JSON --> Array; Jika tidak ada kembalikan Array kosong
   return raw ? JSON.parse(raw) : [];   
}

// 2. Menyimpan data ke localstorage (Array ke JSON)
function saveData(data){
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// 3. Format Tanggal (dd-MM-yyyy --> 04 Juni 2026)
function formatTanggal(dateStr){
   const bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
   ];
   const d= new Date(dateStr);
   return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// 4. FORM HANDLING
// Menangani form pengajuan: Mode Tambah (create), dan mode edit (update), berdasarkan parameter URL
// Tugas form : Mengumpulkan semua input --> validasi --> create data baru --> update data --> simpan ke localstorage

function initForm(){
   const form = document.getElementById('formPengajuan');
   if (!form) return; //jika halaman tidak punya form, keluar

   // deteksi mode edit atau tidak?
   // Jika parameter URL edit ditemukan, maka data lama ditampilkan, jika tidak maka adalah mode tambah (create)
   const urlParams = new URLSearchParams(window.location.search);
   const editId = urlParams.get('edit');
   let editMode = false;

   if(editId){
      // cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemToEdit = data.find(function (item){
         return item.id == editId;
      });
      if (itemToEdit){
         editMode = true; //mode edit aktif
         // Isi field form dengan data yang ada (pre-fill)

         document.getElementById('nama').value = itemToEdit.nama || '';
         document.getElementById('nim').value = itemToEdit.nim || '';
         const prodiEl = document.getElementById('prodi');
         if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi;
         const layananEl = document.getElementById('layanan');
         if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan;
         document.getElementById('tanggal').value = itemToEdit.tanggal || '';
         document.getElementById('keterangan').value = itemToEdit.keterangan || '';

         // ubah tek tombol --> 'Simpan perubahan'
         const btnSubmit = form.querySelector('button[type="submit"]');
         if (btnSubmit) btnSubmit.innerHTML = '✏️Simpan Perubahan';
      }
   }
   // Submit (create)
   // Menggunakan event listener untuk submit form (event-nya 'submit')
   // Sebelum submit, form akan melakukan validasi
   // Saat tombol ajukan di klik: 1.Ambil data dari form. 2.validasi data, 3.simpan data, 4. redirect ke halaman riwayat
   // element.addEventListener('event', function())
   form.addEventListener('submit', function(e){
      // cegah form reload halaman
      e.preventDefault();
      // 1. Ambil nilai semua field
      //trim= menghilangkan karakter yang tidak dipakai
      const nama = document.getElementById('nama').value.trim();
      const nim = document.getElementById('nim').value.trim();
      const prodi = document.getElementById('prodi').value;
      const layanan = document.getElementById('layanan').value;
      const tanggal = document.getElementById('tanggal').value;
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError');

      errorEl.textContent = ''; //reset pesan error sebelum validasi

      // Validasi Form (semua data wajib di isi)
      if (!nama || !nim || !prodi || !layanan || !tanggal){
         errorEl.textContent = '❌ Semua field harus diisi!';
         return; //hentikan eksekusi jika tidak valid
      }
      //NIM harus 8 karakter
      if (nim.length !== 8 || isNaN (nim)){
         errorEl.textContent = '❌ NIM harus terdiri dari 8 digit angka!';
         return;
      }

      // CRUD (Creat dan Update)
      const data = getData();
      if(editMode){//jika mode edit
         for (let i=0; i< data.length; i++){
            //jika ide sama dengan edit ID maka mode edit (timpa data)
            if (data[i].id = editId){
               data[i].nama = nama;
               data[i].nim = nim;
               data[i].prodi = prodi;
               data[i].layanan = layanan;
               data[i].tanggal = tanggal;
               data[i].keterangan = keterangan;
               break;
            }
         }   
      }
      else{ //create : buat data objek baru}
         const item = {
            id: Date.now(),
            nama: nama,
            nim: nim,
            prodi: prodi,
            layanan: layanan,
            tanggal: tanggal,
            keterangan: keterangan,
         };
         data.push(item) //tambah data ke array

      }
      saveData(data); //simpan data ke local storage
      form.reset();
      errorEl.textContent = '';
      alert(editMode ? '✅Perubahan berhasil di simpan!' : '✅Pengajuan berhasil di simpan!')
      window.location.href= 'riwayat.html'; //pindah halaman
   });
}

// ===================================================
// TABEL RIWAYAT
// Menampilkan semua data pengajuan dalam tabel HTML,
// Serta menangani tombol Edit dan Hapus per baris.
// ===================================================

function initRiwayat() {
   // Ambil elemen-elemen DOM yang dibutuhkan
   const tbody = document.getElementById('tableBody');
   const emptyState = document.getElementById('emptyState');
   const dataCount = document.getElementById('dataCount');
   const btnHapusSemua = document.getElementById('btnHapusSemua');

   if (!tbody) return; // jika bukan halaman riwayat, keluar

   renderTable(); // tampilkan tabel saat halaman pertama dimuat

   // -- Event Listener: Tombol Hapus Semua --
   if (btnHapusSemua) {
      btnHapusSemua.addEventListener('click', function () {
         // confirm() menampilkan dialog konfirmasi, mengembalikan true/false
         if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
            saveData([]); // simpan array kosong -> hapus semua
            renderTable();
         }
      });
   }

   // -- Fungsi Render Tabel --
   // Membuat baris-baris tabel secara dinamis dari data localStorage.
   // Data Array | Baris HTML | Tabel
   function renderTable() {
      const data = getData();

      // Update teks counter jumlah data
      if (dataCount) {
         dataCount.textContent = data.length + ' pengajuan';
      }

      // Jika data kosong: tampilkan empty state, sembunyikan tombol
      if (data.length === 0) {
         tbody.innerHTML = '';
         if (emptyState) emptyState.style.display = 'block';
         if (btnHapusSemua) btnHapusSemua.style.display = 'none';
         return;
      }

      // Sembunyikan empty state, tampilkan tombol hapus semua
      if (emptyState) emptyState.style.display = 'none';
      if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block';

      // Buat baris tabel (tr) untuk setiap item data
      tbody.innerHTML = ''; // bersihkan isi tbody terlebih dulu
      for (let i = 0; i < data.length; i++) {
         const item = data[i];
         const tr = document.createElement('tr'); // buat elemen <tr> baru

         // innerHTML: isi baris dengan data dari objek item
         tr.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + item.nama + '</td>' +
            '<td>' + item.nim + '</td>' +
            '<td>' + item.layanan + '</td>' +
            '<td>' + formatTanggal(item.tanggal) + '</td>' +
            '<td>' +
            // Tombol edit: data-id digunakan untuk mengetahui item mana yang diedit
            '<button class="btn-edit" data-id="' + item.id + '">✏️ Edit</button>' +
            '<button class="btn-hapus" data-id="' + item.id + '">🗑️ Hapus</button>' +
            '</td>';
         tbody.appendChild(tr); // tambahkan baris ke table
      }

      // -- Event Listener: Tombol Edit --
      // querySelectorAll mengembalikan semua elemen dengan kelas .btn-edit
      const btnEdit = document.querySelectorAll('.btn-edit');
      // Mengirim ID data ke halaman form.
      btnEdit.forEach(function (btn) {
         btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id'); // ambil ID dari atribut
            // Redirect ke form dengan parameter edit di URL
            window.location.href = 'layanan.html?edit=' + id;
         });
      });

      // -- Event Listener: Tombol Hapus --
      const btnHapus = document.querySelectorAll('.btn-hapus');
      // Menghapus data berdasarkan ID.
      btnHapus.forEach(function (btn) {
         btn.addEventListener('click', function() {
            const id = Number(this.getAttribute('data-id'));
            if (confirm('Hapus pengajuan ini?')) {
               let data = getData();
               // filter(): buat array baru tanpa item yang dihapus
               data = data.filter(function (item) {
                  return item.id !== id; // pertahankan semua kecuali yang dihapus               
               });
               saveData(data);
               renderTable(); // render ulang tabel setelah penghapusan
            }
         });
      });
   }
}

// ======================================================
// INIT (INSISIALISASI)
// DOMContentLoaded: event yang terjadi ketika
// Seluruh HTML selesai dimuat oleh browser.
// Pastikan JavaScript dijalankan SETELAH HTML tersedia.
// =======================================================

// Menjalankan: 1. initForm() 2. initRiwayat() Setelah HTML selesai dimual.
document.addEventListener('DOMContentLoaded', function (){
   initForm(); // inisialisasi form di halaman layanan.html
   initRiwayat(); // inisialisasi form di halaman riwayat.html
});