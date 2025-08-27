const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (file, filename,folder) => {
  const uploadedFile = await imagekit
    .upload({
      file: file,
      fileName: filename,
      folder:folder
    })
  

  return uploadedFile;
};


module.exports = uploadImage