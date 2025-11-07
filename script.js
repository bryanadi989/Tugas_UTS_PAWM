let products = []; //variabel, buat nyimpan data dari api
let cart = [];
const apiUrl = 'https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts';

const productGrid = document.querySelector('#semua-produk .product-grid');
const featuredGrid = document.querySelector('#produk-unggulan .product-grid');
const searchInput = document.getElementById('input-pencarian');
const dropZone = document.getElementById('drop-zone');
const cartList = document.getElementById('cart-items-list');
const waButton = document.getElementById('wa-button');
const baseWaLink = "https://wa.me/6289694176828";

function displayProducts(productList, container) {
    container.innerHTML = '';
    productList.forEach(product => {
        const productCardHTML = `
            <article class="product-card" draggable="true">
                <img src="${product.image}" alt="Gambar ${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${product.price}</p>
                <a href="detail.html?product=${encodeURIComponent(product.name)}" class="details-button">Lihat Detail</a>
            </article>
        `;

        const cardElement = document.createElement('div');
        cardElement.innerHTML = productCardHTML.trim();
        const productCardNode = cardElement.firstChild;

        productCardNode.addEventListener('dragstart', (event) => {
            // Simpan nama | harga 
            event.dataTransfer.setData('text/plain', `${product.name}|${product.price}`);
        });

        container.appendChild(productCardNode);
    });
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartList.innerHTML = '<li>Belum ada produk...</li>';
        return;
    }
    cartList.innerHTML = ''; 
    cart.forEach(product => {
        cartList.innerHTML += `<li>${product.name} (${product.price})</li>`;
    });
}

function updateWaLink() {
    if (cart.length === 0) {
        waButton.href = baseWaLink; 
        return;
    }
    let message = "Halo, saya ingin konsultasi mengenai produk:\n"; // Pesan awal buat wa nya
    cart.forEach(product => {
        message += `\n- ${product.name}`;
    });
    waButton.href = `${baseWaLink}?text=${encodeURIComponent(message)}`;
}

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault(); 
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});


dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    // ambil data sebelumnya yang nama | harga
    const data = event.dataTransfer.getData('text/plain');
    const [productName, productPrice] = data.split('|');

    // buat cek duplikasi
    const isAlreadyInCart = cart.some(product => product.name === productName);

    if (!isAlreadyInCart) {
        cart.push({ name: productName, price: productPrice });
        updateCartDisplay();
        updateWaLink();
    } else {
        alert('Produk sudah ada di keranjang konsultasi.');
    }
});

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
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');

    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 500); 
        }
    }, 1000); // 1000 ms = 1 detik buat splashscreen awal
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
        //error handling, bisa g perlu sih
        console.error("Gagal memuat produk dari API:", error);
        productGrid.innerHTML = "<p>Gagal memuat data produk. Coba lagi nanti.</p>";
    }
}
updateWaLink();
loadProducts();
