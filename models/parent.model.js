const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  phoneNumber: String,
  image: String,
  imageOfDad: String,
  thirdpartyName: String,
  thirdpartyPhoneNumber: String,
  thirdpartyRel: String,
  thirdpartyImage: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
});

module.exports = mongoose.model('Parent', parentSchema);
