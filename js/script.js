// M12 - JS Dasar
// Variabel, Fungsi, Validasi Sederhana

// Variabel Const(Konstanta) untuk Layanan(array menyimpan daftar kode layanan)

const LAYANAN = ['SKA', 'CAK', 'PDA', 'TNM']

// Fungsi Format Tanggal : dd-MM-yyyy(04-06-2026) --> 04 Juni 2026
// Gunakan objek bawaan dari JS

function formatTanggal (dateStr){
    // Formating
    const bulan = ['Jan', 'Feb', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const d= new Date(dateStr);
    // Deklarasi new date obj

    // Format (Tanggal-Bulan-Tahun)
    return d.getDate() + ' ' + bulan [d.getMonth()] + ' ' + d.getFullYear()
}

// Fungsi Validasi Form
function validasiForm(){
    // 1. Get Value setiap inputan (Inputan yang wajib diisi)
    const namaLengkap = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const prodi = document.getElementById('prodi').value;
    const layanan = document.getElementById('layanan').value;
    const tanggal = document.getElementById('tanggal').value;


    // alert(namaLengkap, nim, prodi, layanan, tanggal) //pesan
    // console.log(namaLengkap) //console

    // 2. Validasi --> Cek field kosong
    // Jika nama lengkap 
    if(nama === '' || nim === '' || prodi === '' || layanan === '' || tanggal === '') {
        // berikan pesan eror
    alert('❌ Semua field (data) harus diisi!')

    // mencegah sumbit halaman
    return false;
    }

    if (nim.length !== 9 || isNaN(nim)) { 
    alert('❌ NIM harus terdiri dari 9 digit angka murni!'); 
    return false; 
    }

    // Berhasil (jika tak ada return false dari dua pencegat di atas) 
    // A.consule
     console.log("Data Pengajuan:", { 
         namaLengkap: namaLengkap, 
         nim: nim, 
         prodi: prodi, 
         layanan: layanan, 
         tanggal: formatTanggal(tanggal) 
     });
    
    // b/alert
    alert('✅ Pengajuan berhasil!\n\n' + 
        'Nama: ' + namaLengkap + '\n' + 
        'NIM: ' + nim + '\n' + 
        'Prodi: ' + prodi + '\n' + 
        'Layanan: ' + layanan + '\n' + 
        'Tanggal: ' + formatTanggal(tanggal)); 
 
    return false;
    }