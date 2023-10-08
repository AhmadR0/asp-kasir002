const http = require('http');
const mysql = require('mysql');
const express= require('express');
const app= express();
const cors =require('cors');
const path = require('path');
const PDFDocument = require('pdfkit-table');
// const fs = require('fs').promises;
 
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'Asp_family'
});

conn.connect((err)=>{
    if(err){
        console.error('Koneksi database gagal',err);
        return;
    }
    console.log('Data Base Terhubung');
})

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization', 
  };
  
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../asp-kasir002-master')));

app.post('/addInventory',(req,res)=>{
    const { namaBarang, kodeBarang, stokBarang, hargaBarang,modalBarang }=req.body;
    const query = `INSERT INTO Inventory (namaBrng,kodeBrng,stokBrng,hrgaBrng,HargaModal) VALUES (?,?,?,?,?)`;
    const values = [namaBarang, kodeBarang, stokBarang, hargaBarang,modalBarang];

    conn.query(query,values,(err,result)=>{
        if(err){
            console.error('Gagal menambahkan data', err);
            res.status(500).json({error : 'Gagal Menambhkan Data'});
        }
        console.log('data berhasil ditambahkan');
        res.status(200).json({message: 'Data berhasil ditambahkan'});
    })

});

app.get('/getInventory',(req,res)=>{
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 15;

    const offset = (page - 1) * perPage;
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM Inventory ORDER BY kodeBrng LIMIT ? OFFSET ?';

    conn.query(query, [parseInt(perPage), parseInt(offset)], (err, rows) => {
        if (err) {
            console.error('Gagal mengambil data dari database', err);
            res.status(500).json({ error: 'Gagal mengambil data dari database' });
            return;
        }

        conn.query('SELECT FOUND_ROWS() as total', (err, result) => {
            if (err) {
                console.error('Gagal menghitung total data', err);
                res.status(500).json({ error: 'Gagal menghitung total data' });
                return;
            }

            const total = result[0].total;

            res.status(200).json({ items: rows, total });
        });
    });
})

app.delete('/deleteInventory/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'DELETE FROM Inventory WHERE id = ?';
    conn.query(query, [itemId], (err, result) => {
        if (err) {
            console.error('Gagal menghapus data', err);
            res.status(500).json({ error: 'Gagal menghapus data' });
        }
        console.log('Data berhasil dihapus');
        res.status(200).json({ message: 'Data berhasil dihapus' });
    });
});


app.get('/getInventory/:id',(req,res)=>{
    const itemId =req.params.id;
    const query = 'SELECT * FROM Inventory WHERE id = ?';
    conn.query(query,[itemId],(err,ress)=>{
        if(err){
            console.error('Gagal Memapilakn Data Edit',err);
            res.status(500).json({error:'Gagal Memapilakn Data Edit'});
        }
        console.log('data berhasil ditampilkan pada form edit');
        res.status(200).json(ress);
    })
    console.log([itemId]);
})


app.post('/editInventory/:id',(req,res)=>{
    const itemId = req.params.id;
    const {namaBarang,kodeBarang,stokBarang,hargaBarang,modalBarang}= req.body;
    
    const query =`
        UPDATE Inventory
        SET namaBrng = ?, kodeBrng = ?, stokBrng = ?, hrgaBrng = ?, HargaModal = ?
        WHERE id = ?
    `;

    const value = [namaBarang,kodeBarang,stokBarang,hargaBarang,modalBarang,itemId];

    conn.query(query,value,(err,result)=>{
        if(err){
            console.error('gagal merubah data',err);
            res.status(500).json({error: 'Gagal Mengubah Data'});
        }
        console.log('Data Berhasil diubah');
        res.status(200).json({ message: 'Data berhasil diubah' });
    });
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});


app.get('/searchInventory',(req,res) => {
    const keyword =req.query.keyword;
    const query = 'SELECT * FROM Inventory WHERE namaBrng LIKE ? OR kodeBrng LIKE ? ORDER BY kodeBrng';
    const values =[`%${keyword}%`,`%${keyword}%`];

    conn.query(query,values,(err,result)=>{
        if(err){
            console.error('gagal mencari data',err);
            res.status(500).json({error: 'Gagal mencari data'});
            return;
        }
        console.log('data berhasil ditemukan masehh');
        res.status(200).json(result);
    });

});


app.get('/generate-pdf',(req,res) =>{
    const query ='SELECT * FROM Inventory';

    conn.query(query,(err,rows)=>{
        if(err){
            console.error('Gagal Mengambil data dari database',err);
            res.status(500).json({error:'Gagal mengambil data dari database'});
            return;
        }
        const doc = new PDFDocument();
        doc.pipe(res);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition','attachment; filename=report-Inventory.pdf');

        doc.fontSize(20).text('Inventory ASP',{ align: 'center'});
        doc.moveDown(1);

        doc.table({
            headers: ['No','Nama Barang','Kode Barang','Jumlah Barang','Harga Barang','Modal Barang'],
            rows: rows.map((row,index)=>[index + 1,row.namaBrng,row.kodeBrng,row.stokBrng, `Rp ${row.hrgabrng}`,`Rp ${row.HargaModal}`]),
        });
        doc.end();
    })
})


app.post('/addTransaction',(req,res)=>{
    const { namaBarang, jumlahBeli,namaKaryawan } = req.body;

  // Mengambil harga jual dan harga modal dari database berdasarkan namaBarang
  const queryGetPrices = 'SELECT hrgaBrng, HargaModal FROM Inventory WHERE namaBrng = ?';

  conn.query(queryGetPrices, [namaBarang], (err, results) => {
    if (err) {
      console.error('Gagal mengambil harga jual dan harga modal', err);
      res.status(500).json({ error: 'Gagal mengambil harga jual dan harga modal' });
      return;
    }

    if (results.length === 0) {
      // Barang dengan nama tersebut tidak ditemukan di database
      res.status(404).json({ error: 'Barang tidak ditemukan' });
      return;
    }
    const hargaJual = results[0].hrgaBrng;
    const hargaModal = results[0].HargaModal;
    const totalBayar = hargaJual * jumlahBeli;
    const labaKotor = (hargaJual - hargaModal) * jumlahBeli;

    const waktuBayar = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const queryInsertTransaction = `INSERT INTO transaksi (nama_barang, jumlah_pembelian, total_bayar, waktu_transaksi, laba_kotor,NmKaryawan) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [namaBarang, jumlahBeli, totalBayar, waktuBayar, labaKotor, namaKaryawan];


    conn.query(queryInsertTransaction, values, (err, result) => {
      if (err) {
        console.error('Gagagl Meambahakan Data Transaksi maseh !', err);
        res.status(500).json({ error: 'Gagal Menambahkan Data' });
        return;
      }
      console.log('Data riwayat Transaksi berhasil ditambahkan');
      res.status(200).json({ message: 'Data berhasil ditambahkan',labaKotor });
    });
  });

});



app.get('/getModalPrice', (req, res) => {
    const namaBarang = req.query.namaBarang;
    const query = 'SELECT HargaModal FROM Inventory WHERE namaBrng = ?';
    conn.query(query, [namaBarang], (err, result) => {
        if (err) {
        console.error('Gagal mengambil harga modal', err);
        res.status(500).json({ error: 'Gagal mengambil harga modal' });
        return;
        }
    
        if (result.length > 0) {
        const modalPrice = result[0].HargaModal;
        res.status(200).json({ modalPrice });
        } else {
        res.status(404).json({ error: 'Harga modal tidak ditemukan' });
        }
  });
});

app.get('/dailyIncome', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; 
    const query = `
        SELECT SUM(laba_kotor) AS dailyIncome
        FROM transaksi
        WHERE DATE(waktu_transaksi) = ?`;
    
    conn.query(query, [today], (err, result) => {
        if (err) {
            console.error('Gagal menghitung laba harian', err);
            res.status(500).json({ error: 'Gagal menghitung laba harian' });
            return;
        }

        const dailyIncome = result[0].dailyIncome || 0; 

        res.status(200).json({ dailyIncome });
    });
});


app.get('/getTransactionHistoryWithDetails', (req, res) => {
    const query = `
    SELECT
        transaksi.id,
        transaksi.nama_barang,
        transaksi.jumlah_pembelian,
        transaksi.total_bayar,
        DATE_FORMAT(transaksi.waktu_transaksi, '%W, %d %M %Y (%H:%i)') AS waktu_transaksi,
        transaksi.laba_kotor,
        inventory.kodeBrng,
        inventory.hrgaBrng,
        transaksi.NmKaryawan
    FROM
        transaksi
    INNER JOIN
        inventory ON transaksi.nama_barang = inventory.namaBrng
    ORDER BY
        transaksi.waktu_transaksi DESC;
    `;

    conn.query(query, (err, result) => {
        if (err) {
            console.error('Gagal mengambil riwayat transaksi dengan detail', err);
            res.status(500).json({ error: 'Gagal mengambil riwayat transaksi dengan detail' });
            return;
        }
        // console.log(result);
        res.status(200).json(result);
    });
});

app.get('/getEmployees', (req, res) => {
    const query = 'SELECT namaKaryawan FROM karyawan';
    conn.query(query, (err, result) => {
        if (err) {
            console.error('Gagal mengambil data karyawan', err);
            res.status(500).json({ error: 'Gagal mengambil data karyawan' });
            return;
        }

        const employees = result.map(row => row.namaKaryawan);
        res.status(200).json(employees);
    });
});

app.get('/getIncomeByMonth', (req, res) => {
    const selectedMonth = req.query.bulan;
    const query = `
        SELECT NmKaryawan, SUM(laba_kotor) AS total_pendapatan
        FROM transaksi
        WHERE MONTH(waktu_transaksi) = ?
        GROUP BY NmKaryawan
        ORDER BY total_pendapatan DESC
    `;
    conn.query(query, [selectedMonth], (err, result) => {
        if (err) {
            console.error('Terjadi kesalahan dalam mengambil data pendapatan karyawan:', err);
            res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data pendapatan karyawan' });
            return;
        }
        res.status(200).json(result);
    });
});


const port=8000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server Jalan di 0.0.0.0:${port}`);
  });
  
