const http = require('http');
const mysql = require('mysql');
const express= require('express');
const app= express();
const cors =require('cors');

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'Asp_family'
});

conn.connect((err)=>{
    if(err){
        console.error('Koneksi database gagal',err);
        return;
    }
    console.log('Data Base Terhubung');
})

app.use(cors());
app.use(express.json());
app.post('/addInventory',(req,res)=>{
    const { namaBarang, kodeBarang, stokBarang, hargaBarang }=req.body;
    const query = `INSERT INTO Inventory (namaBrng,kodeBrng,stokBrng,hrgaBrng) VALUES (?,?,?,?)`;
    const values = [namaBarang, kodeBarang, stokBarang, hargaBarang];

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
    const query='SELECT * FROM Inventory'

    conn.query(query,(err,ress) =>{
        if(err){
            console.error("Gagal Mengambil data:",err);
            res.status(500).json({error: 'Gagal mengambil data'});
            return;
        }
        console.log('Data Berhasil diambil');
        res.status(200).json(ress);
    })
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
    console.log([itemId]);
});

const port=8000;
app.listen (port ,()=>{
    console.log(`Server Jalan di localhost:${port}`);
});