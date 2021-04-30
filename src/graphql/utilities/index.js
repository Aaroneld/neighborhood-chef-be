const checkIfExists = require('./checkIfExists');
const sendErrorRedirect = require('./sendErrorRedirect');
const { removeImage, addNewImage, updateImage } = require('./cloudinary');

module.exports = {
  checkIfExists,
  sendErrorRedirect,
  addNewImage,
  removeImage,
  updateImage,
};
