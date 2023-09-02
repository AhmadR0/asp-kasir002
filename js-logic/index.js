
const addButton = document.getElementById("addButton");
const closeButton = document.getElementById("closeButton");
const popupContainer = document.getElementById("popupContainer");
const simpanBtnInventory=document.getElementById('simpan-inventory');



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
            <td>${item.namaBrng}</td>
            <td>${item.kodeBrng}</td>
            <td>${item.stokBrng}</td>
            <td>${item.hrgabrng}</td>
            <td class="action">   
                <button type="button" class="update" data-id="${item.id}"><img src="pct/edit.png" alt="" width="20px"></button>
                <button type="button" class="delete" data-id="${item.id}"><img src="pct/delete.png" alt="" width="20px"></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('update')) {
            const itemId = event.target.getAttribute('data-id');
    
            
            fetch(`http://localhost:8000/getInventory/${itemId}`)
            .then(response => response.json())
            .then(data => {
                populateEditPopup(data);
                const editPopup = document.getElementById('editPopup');
                editPopup.style.display = 'flex';
            })
            .catch(error => {
                console.error('Terjadi Kesalahan', error);
            });



        }
    });
}

function getAndDisplayInventory(){
    fetch('http://localhost:8000/getInventory')
    .then(response => response.json())
    .then(data => {
        data.sort((a,b)=>{
            if(a.namaBarang && b.namaBarang){
                return a.namaBarang.localeCompare(b.namaBaranag);
            }
            return 0;
        });
        populateInventoryTable(data);
    })
    .catch(err => {
        console.error('terjadi kesalahan',err);
    })
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
    console.log(result.massage);
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
})

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

function editInventoryItem(itemId){
    const itemId2 = itemId;
    // console.log(itemId2);
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

    fetch(`http://localhost:8000/editInventory/${itemId2}`,{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        const successPopupEdit = document.getElementById('successPopupEdit');
        successPopupEdit.style.display = 'block';
        setTimeout(function() {
            successPopupEdit.style.display = 'none';
        }, 1000);
        getAndDisplayInventory()
    })
    .catch(error =>{
        console.log('Terjadi Kesalahan',error)
    })
}

function populateEditPopup(data){
    const editNamaBarang = document.getElementById('editNamaBarang');
    const editKodeBarang = document.getElementById('editKodeBarang');
    const editStokBarang = document.getElementById('editStokBarang');
    const editHargaBarang = document.getElementById('editHargaBarang');

    editNamaBarang.value = data[0].namaBrng
    editKodeBarang.value = data[0].kodeBrng;
    editStokBarang.value = data[0].stokBrng;
    editHargaBarang.value = data[0].hrgabrng;

    console.log(data);
}


window.onload = function() {
    getAndDisplayInventory();
    const tableBody = document.getElementById('inventoryTableBody');

    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')) {
            const itemId = event.target.getAttribute('data-id');
            const confirmPopup = document.getElementById('confirmDeletePopup');
            const confirmButton = document.getElementById('confirmDeleteButton');
            const cancelButton = document.getElementById('cancelButton');

            confirmPopup.style.display = 'block';

            confirmButton.addEventListener('click', () => {
                deleteInventoryItem(itemId);
                confirmPopup.style.display = 'none';
            });

            cancelButton.addEventListener('click', () => {
                confirmPopup.style.display = 'none';
            });
        }

        if(event.target.classList.contains('update')){
            const itemId = event.target.getAttribute('data-id');
            const cofirmPopupEdit = document.getElementById('editPopup');
            const confirmPopupButtonEdit = document.getElementById('editSubmitButton');
            const cencelPopupEdit = document.getElementById('editCancelButton');
            console.log(itemId);
            // editInventoryItem(itemId);
            cofirmPopupEdit.style.display = 'flex';
            confirmPopupButtonEdit.addEventListener('click',() =>{
                editInventoryItem(itemId);
                cofirmPopupEdit.style.display = 'none';
            });


            cencelPopupEdit.addEventListener('click',()=>{
                cofirmPopupEdit.style.display = 'none';
            })
            

        }
    });
};




