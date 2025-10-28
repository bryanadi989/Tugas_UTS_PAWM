const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
const cors = require("cors")({origin: true}); // Import dan konfigurasi CORS

//init
initializeApp();

//API Endpoint 
exports.getProducts = onRequest(async (request, response) => {
  //cors untuk allow request dari domain 
  cors(request, response, async () => {
    try {
      //Hubungi database Firestore
      const db = getFirestore();

      //Ambil semua dokumen dari koleksi 'products'
      const productsSnapshot = await db.collection("products").get();

      //Ubah data jadi array yang rapi
      const products = [];
      productsSnapshot.forEach((doc) => {
        products.push(doc.data());
      });

      //Kirim data dalam JSON
      response.status(200).json(products);

    } catch (error) {
      logger.error("Error fetching products:", error);
      response.status(500).send("Gagal mengambil data produk");
    }
  });
});