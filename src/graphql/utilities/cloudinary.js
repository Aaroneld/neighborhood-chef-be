require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function removeImage(url) {
  let arr = url.split('/');
  let public_id = arr[arr.length - 1].split('.')[0];
  await cloudinary.uploader.destroy(public_id, (err, result) => {
    console.log(err);
    console.log(result);
  });
}

async function addNewImage(base64) {
  try {
    const response = await cloudinary.uploader.upload(base64, {
      upload_preset: 'upload',
    });
    return response.url;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function updateImage(url, base64) {
  try {
    let arr = url.split('/');
    let public_id = arr[arr.length - 1].split('.')[0];

    const response = await cloudinary.uploader.upload(base64, {
      public_id: public_id,
      invalidate: true,
    });

    return response.url;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = { removeImage, addNewImage, updateImage };
