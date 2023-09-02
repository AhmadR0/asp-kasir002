const addButton = document.getElementById("addButton");
const closeButton = document.getElementById("closeButton");
const popupContainer = document.getElementById("popupContainer");
const simpanBtnInventory = document.getElementById('simpan-inventory');

addButton.addEventListener("click", () => {
    popupContainer.style.display = "flex";
});

closeButton.addEventListener("click", () => {
    popupContainer.style.display = "none";
});

function populateInventoryTable(data){
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML ='';

    data.forEach((item,index)=>{
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.namaBarang}</td>
            <td>${item.kodeBarang}</td>
            <td>${item.stokBarang}</td>
            <td>${item.hargaBarang}</td>
            <td class="action">   
                <button type="button" class="update"><img src="pct/edit.png" alt="" width="20px"></button>
                <button type="button" class="delete" data-id="${item.id}"><img src="pct/delete.png" alt="" width="20px"></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getAndDisplayInventory(){
    fetch('http://localhost:8000/getInventory')
    .then(response => response.json())
    .then(data => {
        data.sort((a,b)=>{
            if(a.namaBarang && b.namaBarang){
                return a.namaBarang.localeCompare(b.namaBarang);
            }
            return 0;
        });
        populateInventoryTable(data);
    })
    .catch(err => {
        console.error('terjadi kesalahan',err);
    });
}

window.onload = function(){
    getAndDisplayInventory();
};

simpanBtnInventory.addEventListener('click',function(){
   const namaBarang = document.getElementById('nama-barang').value;
   const kodeBarang = document.getElementById('kode-barang').value;
   const stokBarang = document.getElementById('stok-barang').value;
   const hargaBarang = document.getElementById('harga-barang').value;

   const data ={
        namaBarang: namaBarang,
        kodeBarang: kodeBarang,
        stokBarang: stokBarang,
        hargaBarang: hargaBarang
   };

   fetch('http://localhost:8000/addInventory',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
   })
   .then(response => response.json())
   .then(result => {
        console.log(result.message);
        const successPopup = document.getElementById('successPopup');
        successPopup.style.display = 'block';
        setTimeout(function() {
            successPopup.style.display = 'none';
        }, 1000);
        getAndDisplayInventory();
   })
   .catch(error => {
        console.error('Terjadi Kesalahan',error);
   });

   popupContainer.style.display = 'none';
});

// Fungsi untuk menghapus data inventaris
function deleteInventoryItem(itemId) {
    fetch(`http://localhost:8000/deleteInventory/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        getAndDisplayInventory(); 
    })
    .catch(error => {
        console.error('Terjadi Kesalahan', error);
    });
}

// Event listener untuk tombol delete
function handleDelete(event) {
    const itemId = event.target.getAttribute('data-id');
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        deleteInventoryItem(itemId);
    }
}

// Tambahkan event listener untuk tombol delete pada saat halaman dimuat
window.onload = function(){
    getAndDisplayInventory();
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
};


app.post('/editInventory/:id', (req, res) => {
    const itemId = req.params.id;
    const { namaBarang, kodeBarang, stokBarang, hargaBarang } = req.body;
    
    const query = `
        UPDATE Inventory
        SET namaBrng = ?, kodeBrng = ?, stokBrng = ?, hrgaBrng = ?
        WHERE id = ?
    `;
    
    const values = [namaBarang, kodeBarang, stokBarang, hargaBarang, itemId];

    conn.query(query, values, (err, result) => {
        if (err) {
            console.error('Gagal mengubah data', err);
            res.status(500).json({ error: 'Gagal mengubah data' });
        }
        console.log('Data berhasil diubah');
        res.status(200).json({ message: 'Data berhasil diubah' });
    });
});

fetch(`http://localhost:8000/editInventory/${itemId}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    console.log(result.message);
    // Sembunyikan pop-up edit dan perbarui tampilan inventaris
    const editPopup = document.getElementById('editPopup');
    editPopup.style.display = 'none';
    getAndDisplayInventory();
})
.catch(error => {
    console.error('Terjadi Kesalahan', error);
});


const editSubmitButton = document.getElementById('editSubmitButton');

editSubmitButton.addEventListener('click', () => {
    const itemId = event.target.getAttribute('data-id'); // Ambil ID dari data yang ingin diubah
    const editNamaBarang = document.getElementById('editNamaBarang').value;
    const editKodeBarang = document.getElementById('editKodeBarang').value;
    const editStokBarang = document.getElementById('editStokBarang').value;
    const editHargaBarang = document.getElementById('editHargaBarang').value;

    const data = {
        namaBarang: editNamaBarang,
        kodeBarang: editKodeBarang,
        stokBarang: editStokBarang,
        hargaBarang: editHargaBarang
    };

    // Kirim data perubahan ke server (gunakan metode POST atau PUT)
    fetch(`http://localhost:8000/editInventory/${itemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        const editPopup = document.getElementById('editPopup');
        editPopup.style.display = 'none';
        getAndDisplayInventory();
    })
    .catch(error => {
        console.error('Terjadi Kesalahan', error);
    });
});
