const apiUrl = 'https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts'; 

//Fungsi isi halaman detail produk
function renderProductDetail(product) {
    const container = document.getElementById('product-detail-container');
    
    container.innerHTML = `
        <article class="product-detail-card">
            <img src="${product.image}" alt="Gambar ${product.name}">
            <h2>${product.name}</h2>
            <p class="product-price">${product.price}</p>
            <p class="product-category">Kategori: ${product.category}</p>

            <h3>Deskripsi</h3>
            <p><strong>Komposisi:</strong> ${product.komposisi || 'Data tidak tersedia'}</p> 
            <p><strong>Cara Pakai:</strong> ${product.cara_pakai || 'Data tidak tersedia'}</p>
            <p><strong>Efek Samping:</strong> ${product.efek_samping || 'Data tidak tersedia'}</p>
            <p><strong>Penyimpanan:</strong> ${product.penyimpanan || 'Data tidak tersedia'}</p>
        </article>
    `; //semisal di database g keisi fieldnya, nanti tampilin Data tidak tersedia (klo g salah keisi smua)
}

function renderRecommendations(products) {
    const container = document.querySelector('#recommendations .product-grid');
    if (!container) return; 

    container.innerHTML = ''; 

    products.forEach(product => {
        const productCard = `
            <article class="product-card">
                <img src="${product.image}" alt="Gambar ${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${product.price}</p>
                <a href="detail.html?product=${encodeURIComponent(product.name)}" class="details-button">Lihat Detail</a>
            </article>
        `;
        container.innerHTML += productCard;
    });
}

// Fungsi saat halaman dimuat
async function loadProductDetail() {
    try {
        // 1. Ambil nama produk dari URL (dari ?product=...)
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('product');

        if (!productName) {
            throw new Error('Produk tidak ditemukan');
        }

        // 2. panggil api smua produk
        const response = await fetch(apiUrl);
        const allProducts = await response.json();

        // 3. Cari produk sesuai nama
        const product = allProducts.find(p => p.name === productName);

        if (product) {
            // 4. tampilin
            renderProductDetail(product);
            const recommendations = allProducts.filter(p => 
            p.category === product.category && //kategori sama
            p.name !== product.name            //bukan produk yg sama
            ).slice(0, 3); //max 3 aja

            //Tampilkan ke halaman
            if (recommendations.length > 0) {
                renderRecommendations(recommendations);
            } else {
                //klo kosong ya ilangin
                const recommendationsSection = document.getElementById('recommendations');
                if (recommendationsSection) {
                    recommendationsSection.style.display = 'none';
                }
            }
        } else {
            throw new Error('Produk tidak ditemukan di database');
        }

    } catch (error) {
        //error handling
        console.error("Gagal memuat detail produk:", error);
        const container = document.getElementById('product-detail-container');
        container.innerHTML = "<p>Gagal memuat detail produk. Silakan kembali ke katalog.</p>";
    }
}

window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');

    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 500); 
        }
    }, 1000); 
});
window.addEventListener('load', loadProductDetail);