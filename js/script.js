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
function saveData(){
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// 3. Format Tanggal (dd-MM-yyyy --> 04 Juni 2026)
function formatTanggal(dataStr){
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
   const d= new Date(dataStr);
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
   const editId = urlParams.get('edit');
   let editMode = false;

   if(editId){
      // cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemToEdit = data.find(function (item){
         return item.id = editId;
      });
      if (itemToEdit){
         editMode = true; //mode edit aktif
         // Isi field form dengan data yang ada (pre-fill)

         document.getElementById('nama').value = itemToEdit.nama || '';
         document.getElementById('nim').value = itemToEdit.nim || '';
         const prodiEl = document.getElementById('prodi');
         if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi || ''
         const layananEl = document.getElementById('layanan');
         if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan || ''
         document.getElementById('tanggal').value = itemToEdit.tanggal || ''
         document.getElementById('keterangan').value = itemToEdit.keterangan || ''

         // ubah tek tombol --> 'Simpan perubahan'
         const btnSubmit = form.querySelector('button[type="submit"]');
         if (btnSubmit) btnSubmit.innerHTML = '✏️Simpan Perubahan'
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
      const prodi = document.getElementById('prodi').value();
      const layanan = document.getElementById('layanan').value();
      const tanggal = document.getElementById('tanggal').value.trim();
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError').value.trim;

      errorEl.textContent = ''; //reset pesan error sebelum validasi

      // Validasi Form (semua data wajib di isi)
      if (!nama || !nama || !prodi || !layanan || !tanggal){
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
         if (data[i].id == editId){
            data[i].nama == nama;
            data[i].nim == nim;
            data[i].id == prodi;
            data[i].id == layanan;
            data[i].id == tanggal;
            data[i].keterangan == keterangan
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
         console.log(data); //tampilkan di console log
      }
      saveData(data); //simpan data ke local storage
      form.reset();
      errorEl.textContent = '';
      alert(editId ? '✏️Perubahan berhasil di simpan!' : '💯Pengajuan berhasil di simpan!')
      window.location.href= 'riwayat.html' //pindah halaman
   });
}

//INIT (INISIALISASI)
document.addEventListener('DOMContentLoaded', function (){
   initForm();
})