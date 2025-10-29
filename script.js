let products = []; //variabel, buat nyimpan data dari api
const apiUrl = 'https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts';

const productGrid = document.querySelector('#semua-produk .product-grid');
const featuredGrid = document.querySelector('#produk-unggulan .product-grid');
const searchInput = document.getElementById('input-pencarian');

function displayProducts(productList, container) {

    container.innerHTML = '';
    productList.forEach(product => {
        const productCard = `
            <article class="product-card">
                <img src="${product.image}" alt="Gambar ${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${product.price}</p>
                <a href="detail.html?product=${encodeURIComponent(product.name)}" class="details-button">Lihat Detail</a>
            </article>
        `;
        //masukin kartu yang sudah jadi ke dalam container
        container.innerHTML += productCard;
    });
}

//searching
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase(); //ambil teks inputan

    //filter array products dari api (pake variabel awal yang udah dideclare)
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm);
    });
    //udah difilter, ditampilin
    displayProducts(filteredProducts, productGrid);
});


//fungsi ambil data dari API
async function loadProducts() {
    try {
        const response = await fetch(apiUrl); //panggil api
        const data = await response.json();   //respon diubah dari json ke object di js
        products = data; //simpan data ke variabel products
        displayProducts(products, productGrid); //tampilin produk ke halaman
        const featuredProducts = products.filter(p => p.category === 'Suplemen').slice(0,1); //maks 1? kan unggulan 
        displayProducts(featuredProducts, featuredGrid); //tampilin produk unggulan
    } catch (error) {
        //error handling
        console.error("Gagal memuat produk dari API:", error);
        productGrid.innerHTML = "<p>Gagal memuat data produk. Coba lagi nanti.</p>";
    }
}

loadProducts();
