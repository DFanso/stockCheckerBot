const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

async function checkAvailability(UPC, ZIP) {
    console.log("hey bro stock ")
  const params = {
    api_key: process.env.BLUE_CART_API,
    type: "product",
    item_id: "",
    customer_zipcode: ZIP,
    gtin: UPC
  }

  try {
    const response = await axios.get('https://api.bluecartapi.com/request', { params });
    
    const productData = response.data.product;
    const locationInfo = response.data.location_info;

    return {
      availability: productData.buybox_winner.availability.in_stock ? "In Stock" : "Out of Stock",
      price:productData.buybox_winner.price,
      item_id: productData.item_id,
      product_id: productData.product_id,
      upc: productData.upc,
      link: productData.link,
      description: productData.title,
      name:productData.title_excluding_brand,
      store_id: locationInfo.store_id,
      city: locationInfo.city,
      state: locationInfo.state,
      zipcode: locationInfo.zipcode
    };
  } catch (error) {
    console.error(error);
    throw new Error(error+"Failed to fetch product data.");
  }
}

module.exports = checkAvailability;
