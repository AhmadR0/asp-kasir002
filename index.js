const http = require('http');
const mysql = require('mysql');
const express= require('express');
const app= express();
const cors =require('cors');
const path = require('path');
// const fs = require('fs').promises;
 
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

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../asp-kasir002-master')));

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
    const {namaBarang,kodeBarang,stokBarang,hargaBarang}= req.body;
    
    const query =`
        UPDATE Inventory
        SET namaBrng = ?, kodeBrng = ?, stokBrng = ?, hrgaBrng = ?
        WHERE id = ?
    `;

    const value = [namaBarang,kodeBarang,stokBarang,hargaBarang,itemId];

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

const port=8000;
app.listen (port ,()=>{
    console.log(`Server Jalan di localhost:${port}`);
});