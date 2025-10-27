//DATABASE SEMENTARA
const products = [
    {
        name: 'Multivitamin Super',
        category: 'Suplemen',
        price: 'Rp 75.000',
        image: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Vitamin'
    },
    {
        name: 'Obat Batuk Herbal',
        category: 'Obat Bebas',
        price: 'Rp 25.000',
        image: 'https://via.placeholder.com/150/28A745/FFFFFF?text=Herbal'
    },
    {
        name: 'Paracetamol 500mg',
        category: 'Obat Bebas',
        price: 'Rp 8.000',
        image: 'https://via.placeholder.com/150/FFC107/000000?text=Obat'
    },
    {
        name: 'Vitamin C IPI',
        category: 'Suplemen',
        price: 'Rp 12.000',
        image: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Vitamin'
    },
    {
        name: 'Masker Medis',
        category: 'Alat Kesehatan',
        price: 'Rp 15.000',
        image: 'https://via.placeholder.com/150/6C757D/FFFFFF?text=Alkes'
    }
];

//fungsi nampilin produk
const productGrid = document.querySelector('#semua-produk .product-grid');
const searchInput = document.getElementById('input-pencarian');

function displayProducts(productList) {

    productGrid.innerHTML = ''; //kosongin grid produk dlu

    // Loop setiap produk di dalam list dan buat kartu HTML-nya
    productList.forEach(product => {
        const productCard = `
            <article class="product-card">
                <img src="${product.image}" alt="Gambar ${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${product.price}</p>
                <a href="#" class="details-button">Lihat Detail</a>
            </article>
        `;
        // Masukkan kartu yang sudah jadi ke dalam grid
        productGrid.innerHTML += productCard;
    });
}

//searching
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase(); // Ambil teks inputan ganti ke huruf kecil

    // Filter array 'products'
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm); // Cek apakah nama produk mengandung kata kunci
    });

    // Tampilkan produk yang sudah difilter
    displayProducts(filteredProducts);
});

displayProducts(products); //awalnya nampilin produk smua