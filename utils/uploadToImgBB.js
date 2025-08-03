const axios = require('axios');
const FormData = require('form-data');

const uploadToImgBB = async (imageBuffer) => {
  const formData = new FormData();
  formData.append('image', imageBuffer.toString('base64'));

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    { headers: formData.getHeaders() }
  );

  return res.data.data.url;
};

module.exports = uploadToImgBB;
