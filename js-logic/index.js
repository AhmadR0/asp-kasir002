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
                <button type="button" class="update" ><img src="pct/edit.png" alt="" width="20px"></button>
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
            // const itemId = event.target.getAttribute('data-id');
            const cofirmPopupEdit = document.getElementById('editPopup');
            const confirmPopupButtonEdit = document.getElementById('editSubmitButton');
            const cencelPopupEdit = document.getElementById('editCancelButton');

            cofirmPopupEdit.style.display = 'block';
            confirmPopupButtonEdit.addEventListener('click',() =>{
                cofirmPopupEdit.style.display = 'none';
            });


            cencelPopupEdit.addEventListener('click',()=>{
                cofirmPopupEdit.style.display = 'none';
            })
            

        }
    });
};




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