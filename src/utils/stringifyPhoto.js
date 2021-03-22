function stringifyPhoto(obj) {
  obj.photo = String(obj.photo);
  return obj;
}

module.exports = stringifyPhoto;
