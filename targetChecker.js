const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

async function checkAvailability(UPC, ZIP) {
    console.log("hey bro stock ")
  const params = {
    api_key: process.env.Red_Circle_API,
    type: "product",
    tcin: "",
    customer_zipcode: ZIP,
    gtin: UPC
  }

  try {
    const response = await axios.get('https://api.redcircleapi.com/request', { params });
    
    const productData = response.data.product;
    const locationInfo = response.data.location_info;

    return {
      availability: productData.buybox_winner.availability.in_stock ? "In Stock" : "Out of Stock",
      price:productData.buybox_winner.price,
      item_id: productData.tcin,
      product_id: productData.dpci,
      upc: productData.upc,
      link: productData.link,
      description: productData.title,
      name:productData.title,
      store_name:locationInfo.store_name,
      store_id: locationInfo.store_id,
      address: locationInfo.address,
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
