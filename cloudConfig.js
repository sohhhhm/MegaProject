const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  //configure = Jodaych
  cloud_name: process.env.CLOUD_NAME, //from .env file
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//by default use above names

 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowedFormats: ["png","jpg","jpeg"]
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }