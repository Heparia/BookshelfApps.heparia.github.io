document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputDataBuku')
    submitForm.addEventListener('submit', function (event){
        event.preventDefault();
        actionForm()
        submitForm.reset()
    })
    const searchButton = document.getElementById('cariBuku')
    searchButton.addEventListener('submit', function(event){
        const pilihanPencarian = document.getElementById('pilihanPencarian').value
        const kataKunciPencarian = document.getElementById('inputKataKunciPencarian').value
        if (dataPertamaJikaKlikSubmit == []) {
            hapusDataDiv()   
        }
        event.preventDefault();
        let dataSesuaiPilihanPencarian = []
        for (const item of dataSemuaBuku) {
            for (let index = 0; index < Object.keys(item).length; index++) {
                if (Object.keys(item)[index] == pilihanPencarian) {
                    dataSesuaiPilihanPencarian.unshift(Object.values(item)[index])
                }}
        }
        function checkKesamaan(data){
            return data.toUpperCase() == kataKunciPencarian.toUpperCase() 
        }
        if (document.getElementById('inputKataKunciPencarian').value != '') {
            if (dataSesuaiPilihanPencarian.some(checkKesamaan) == true) {
                hapusDataDiv()
                location.href = dataPertamaJikaKlikSubmit[0]
                dataPertamaJikaKlikSubmit.splice(0,dataPertamaJikaKlikSubmit.length)
            } else{
                alert('Kesalahan! Data buku tidak ditemukan.')
            }
        }
        else {
            alert('Kesalahan! Kamu belum memasukkan input di kolom pencarian.')
        }
        searchButton.reset()
        }
    )
    const urutanIncompleteBooks = document.getElementById('selectBukuBelumSelesaiDibaca').value
    const urutanCompleteBooks = document.getElementById('selectBukuSelesaiDibaca').value
    if (urutanIncompleteBooks == 'Terbaru' || urutanCompleteBooks == 'Terbaru') {
        if (localStorage.storageBooks != null) {
            arrayStorage()
            const data = JSON.parse(localStorage.storageBooks)
            for (const item of data.reverse()) {
                listBuku(item)
            }
        }
    } else {
        if (localStorage.storageBooks != null) {
            arrayStorage()
            const data = JSON.parse(localStorage.storageBooks)
            for (const item of data) {
                listBuku(item)
            }
        }
    }

})

function uniqueID(){
    return +new Date()
}

function dataDataBuku(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function listBuku(data){
    let listRakBuku = ['listBukuBelumSelesai', 'listBukuSelesai']
    let listTombol = ['Sudah Dibaca', 'Hapus Buku', 'Edit Buku']
    if (data.isComplete == true) {
        container = document.getElementById(listRakBuku[1])
        listTombol[0] = 'Belum Selesai Dibaca'
    } else {
        container = document.getElementById(listRakBuku[0])
        listTombol[0] = 'Sudah Dibaca'
    } 

    const artikel = document.createElement('article')
    artikel.setAttribute('class', 'buku')
    artikel.setAttribute('id', data.id)

    const dataTitleID = document.createElement('div')
    dataTitleID.setAttribute('class', 'head')
    const titleBook = document.createElement('h3')
    const idBook = document.createElement('h5')
    titleBook.setAttribute('class', 'header title')
    idBook.innerText = 'ID: '+JSON.stringify(data.id)
    idBook.setAttribute('class', 'header id')
    titleBook.innerText = JSON.stringify(data.title).toUpperCase().slice(1,-1)
    dataTitleID.appendChild(titleBook)
    dataTitleID.appendChild(idBook)
    artikel.appendChild(dataTitleID)

    let dataAuthorYear = ['Penulis: '+data.author, 'Tahun: '+data.year]
    for (const item of dataAuthorYear) {
        const itemData = document.createElement('p')
        itemData.innerText = item
        artikel.appendChild(itemData)
    }

    const tombol = document.createElement('div')
    tombol.setAttribute('class', 'action')
    for (const item of listTombol) {
        const itemTombol = document.createElement('button')
        itemTombol.innerText = item
        itemTombol.setAttribute('class', item)
        itemTombol.setAttribute('id', `${item}${data.year}${data.id}`)
        itemTombol.setAttribute('value', 'false')
        itemTombol.addEventListener('mouseover', function(){
            itemTombol.style.backgroundColor = '#142850'
        })
        itemTombol.addEventListener('mouseout', function(){
            itemTombol.style.backgroundColor = '#00909E'
        })
        itemTombol.addEventListener('click', function(){
            if (item == 'Sudah Dibaca' || item == 'Belum Selesai Dibaca') {
                perpindahanRak(data)
            } 
            else if (item == 'Hapus Buku') {
                hapusBuku(data)
            } 
            else {
                editBuku(data, itemTombol.value)
            }
        })
        tombol.appendChild(itemTombol)
    }
    
    artikel.appendChild(tombol)

    container.appendChild(artikel)
    
    return container;
}

const storageBooks = 'BookshelfApp'
function saveBook(){
    const parsed = JSON.stringify(dataSemuaBuku)
    localStorage.setItem('storageBooks', parsed)
    tampilkanStorageBooks()
}

function tampilkanStorageBooks (){
    let element = document.getElementsByClassName("listBuku");
    for (const item of element) {
        while (item.firstChild) {
            item.removeChild(item.firstChild);
    }}
    const data = JSON.parse(localStorage.storageBooks)
    for (const item of data.reverse()) {
        listBuku(item)
    }
}

function arrayStorage(){
    if (localStorage.storageBooks != null) {
        const dataSebelumReload = JSON.parse(localStorage.storageBooks)
        for (const item of dataSebelumReload) {
            dataSemuaBuku.push(item)
        }}
    }
const dataSemuaBuku = [];
function actionForm (){
    const idBook = uniqueID()
    const titleBook = document.getElementById('inputDataBukuJudul').value;
    const authorBook = document.getElementById('inputDataBukuPenulis').value;
    const yearBook = Number(document.getElementById('inputDataBukuTahun').value);
    const isCompleteBook = document.getElementById('inputDataBukuSudahSelesai');
    if (isCompleteBook.checked == true) {
        const dataBuku = dataDataBuku (idBook, titleBook, authorBook, yearBook, true)
        dataSemuaBuku.push(dataBuku)
        saveBook()
    } else {
        const dataBuku = dataDataBuku(idBook, titleBook, authorBook, yearBook, false)
        dataSemuaBuku.push(dataBuku)
        saveBook()
    }
}

function perubahanTextSpan(){
    const isCompleteBook = document.getElementById('inputDataBukuIsComplete');
    if (isCompleteBook.checked == true) {
        document.querySelector('span').innerText = 'Selesai Dibaca'
    } else {
        document.querySelector('span').innerText = 'Belum Selesai Dibaca'
    }
}

function perpindahanRak(nilai){
    const dataLocalStorage = JSON.parse(localStorage.storageBooks)
    for (const item in dataLocalStorage) {
        if (nilai.id == dataLocalStorage[item].id) {
            if (nilai.isComplete == false) {
                dataLocalStorage[item].isComplete = true
            } else {
                dataLocalStorage[item].isComplete = false
            }
            dataSemuaBuku[item] = dataLocalStorage[item]
        }
    }
    localStorage.removeItem(storageBooks)
    saveBook()
}
function hapusBuku(nilai){
    if (confirm('Tekan "ok" jika kamu yakin ingin menghapusnya')) {
        const dataLocalStorage = JSON.parse(localStorage.storageBooks)
        for (const item in dataLocalStorage) {
            if (nilai.id == dataLocalStorage[item].id) {
                dataSemuaBuku.splice(item, 1)
            }
        }
    localStorage.removeItem(storageBooks)
    saveBook()}
}

function Batal(id, year){
    document.getElementById(`Edit Buku${year}${id}`).value = 'false'
    let tombol = document.getElementById(id)
        tombol.removeChild(tombol.lastChild)
        tombol.style.backgroundColor = '#DAE1E7'
        tombol.style.color = 'black'
}

function stringToBoolean(data){
    var valueStatusNew = data.options[data.selectedIndex].value;
    if (valueStatusNew == 'true') {
        return true
    } else {
        return false
    }
}
function Simpan(id){
    const titleNew = document.getElementById('Judul').value
    const authorNew = document.getElementById('Penulis').value
    const yearNew = document.getElementById('Tahun').value
    const statusNew = document.getElementById('batalSimpan')
    const valueBooleanStatus = stringToBoolean(statusNew)
    const dataBukuNew = dataDataBuku(id, titleNew, authorNew, yearNew, valueBooleanStatus)
    for (let item in dataSemuaBuku) {
        if (dataSemuaBuku[item].id == id) {
            dataSemuaBuku[item] = dataBukuNew
        }
    }
    localStorage.removeItem(storageBooks)
    saveBook()
}

function editBuku(nilai, button){
    if (button === 'false') {
        document.getElementById(`Edit Buku${nilai.year}${nilai.id}`).value = 'true'
    const bukuYangDiedit = document.getElementById(nilai.id)
    bukuYangDiedit.style.backgroundColor = '#27496D'
    bukuYangDiedit.style.color = '#DAE1E7'

    const editBukuTerpilih = document.createElement('article')
    editBukuTerpilih.style.backgroundColor = '#00909E'
    editBukuTerpilih.setAttribute('class', 'editBuku')

    const idEditBook = document.createElement('h2')
    idEditBook.innerHTML = `Edit Buku<br><strong>ID: ${nilai.id}</strong>`
    editBukuTerpilih.appendChild(idEditBook)

    const formEditBuku = document.createElement('form')
    formEditBuku.setAttribute('class', 'input')
    let labelEdit = ['Judul', 'Penulis', 'Tahun']
    let placeHolder = [nilai.title, nilai.author, nilai.year]
    let typeInput = ['text', 'text', 'number']
    for (const item in labelEdit) {
        const divFormEditBuku = document.createElement('div')
        divFormEditBuku.setAttribute('class', labelEdit[item])
        const label = document.createElement('label')
        label.innerHTML = `${labelEdit[item]}<br>`
        const input = document.createElement('input')
        input.setAttribute('id', labelEdit[item])
        input.setAttribute('type', typeInput[item])
        input.setAttribute('value', placeHolder[item])
        divFormEditBuku.appendChild(label)
        divFormEditBuku.appendChild(input)
        formEditBuku.appendChild(divFormEditBuku)
    }
        
        const divFormEditBuku = document.createElement('div')
        divFormEditBuku.setAttribute('class', 'sudahDibaca')
        if (nilai.isComplete == true) {
            divFormEditBuku.innerHTML = 
            `<br><br><label class='Status_Bacaan'>Status</label>
            <select id='batalSimpan'>
            <option value=true id='OptionTrueIsComplete' class='opsiPilihanSelesaiAtauBelum' selected='selected'>Sudah Dibaca</option>
            <option value=false id='OptionFalseIsComplete' class='opsiPilihanSelesaiAtauBelum'>Belum Selesai Dibaca</option>
            </select>`
        } else {
            divFormEditBuku.innerHTML = 
            `<br><br><label class='Status_Bacaan'>Status</label>
            <select id='batalSimpan'>
            <option value=true id='OptionTrueIsComplete' class='opsiPilihanSelesaiAtauBelum'>Sudah Dibaca</option>
            <option value=false id='OptionFalseIsComplete' class='opsiPilihanSelesaiAtauBelum' selected='selected'>Belum Selesai Dibaca</option>
            </select>`
        }

        formEditBuku.appendChild(divFormEditBuku)
        editBukuTerpilih.appendChild(formEditBuku)

        const simpanBatal = document.createElement('div')
        simpanBatal.setAttribute('id', 'simpanBatal')
        simpanBatal.innerHTML = 
        `<button class='simpanBatal' value='Simpan' onclick='Simpan(${nilai.id})'>Simpan</button>
        <button class='simpanBatal' value='Batal' onclick='Batal(${nilai.id}, ${nilai.year})'>Batal</button>`
        editBukuTerpilih.appendChild(simpanBatal)
    
    bukuYangDiedit.appendChild(editBukuTerpilih)

    } else {
        Batal(nilai.id, nilai.year)
    }
}

function hapusRiwayatPencarianIni(tombolX){
    tombolX.remove()
    document.getElementById('cariBuku').reset()
}

function searching(){
    const divSearchSection = document.getElementById('inputPencarian')
    const pilihanPencarian = document.getElementById('pilihanPencarian').value
    const kataKunciPencarian = document.getElementById('inputKataKunciPencarian').value
    const dataDiv = document.createElement('div')
    dataDiv.setAttribute('class', 'dataDiv')
    dataDiv.innerHTML = `<h1 onclick='hapusRiwayatPencarianIni(this.parentElement)' style='text-align:center'>&times;</h1>`
    if (kataKunciPencarian.length >= 1) {
            for (const item of dataSemuaBuku) {
                if (item[pilihanPencarian].toUpperCase() == kataKunciPencarian.toUpperCase()) {
                    const dataYangCocok = document.createElement('p')
                    dataYangCocok.innerHTML = 
                    `<a href='#${item.id}' class='dataYangCocok' tabindex='0' onblur='hapusDataDiv()'>ID: ${item.id} | ${item[pilihanPencarian]}</a>`
                    dataDiv.appendChild(dataYangCocok)
                    divSearchSection.appendChild(dataDiv)
                }
            }}
    if (document.querySelectorAll('.dataDiv').length > 1) {
        document.querySelector('.dataDiv').remove()
    }
}

const dataPertamaJikaKlikSubmit = []
function hapusDataDiv(){
    const classBuku = document.querySelector('.dataYangCocok')
    dataPertamaJikaKlikSubmit.unshift(classBuku.getAttribute('href'))
    const semuaDataDiv = document.querySelectorAll('.dataDiv')
    for (const item of semuaDataDiv) {
        item.remove()}
}

function urutanBukuBelumSelesai(){
        let indexPertama = []
        let indexKedua = []
        for (const item in dataSemuaBuku) {
            if (dataSemuaBuku[item].isComplete == false) {
                indexPertama.push(item)
                indexKedua.unshift(dataSemuaBuku[item])
            }
        }
        index = 0
        for (let key = 0; key<indexKedua.length; key++) {
            dataSemuaBuku[indexPertama[key]] = indexKedua[key]
        }
    localStorage.removeItem(storageBooks)
    saveBook()
    reload()
}

function urutanBukuSelesai(){
    let indexPertama = []
    let indexKedua = []
    for (const item in dataSemuaBuku) {
        if (dataSemuaBuku[item].isComplete == true) {
            indexPertama.push(item)
            indexKedua.unshift(dataSemuaBuku[item])
        }
    }
    index = 0
    for (let key = 0; key<indexKedua.length; key++) {
        dataSemuaBuku[indexPertama[key]] = indexKedua[key]
    }
localStorage.removeItem(storageBooks)
saveBook()
reload()
}

function reload(){
    var urutanMenurutID = dataSemuaBuku.slice(0);
    urutanMenurutID.sort(function(a,b) {
        return a.id - b.id;
    });
    localStorage.removeItem(storageBooks)
    const parsed = JSON.stringify(urutanMenurutID)
    localStorage.setItem('storageBooks', parsed)
}
function setJenisInput(){
    const pilihanPencarian = document.getElementById('pilihanPencarian').value
    if (pilihanPencarian == 'year' || pilihanPencarian == 'id') {
        document.getElementById('inputKataKunciPencarian').setAttribute('type', 'number')
    } else {
        document.getElementById('inputKataKunciPencarian').setAttribute('type', 'text')
    }
}