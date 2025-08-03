const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  image: String,
  thirdpartyName: String,
  thirdpartyPhoneNumber: String,
  thirdpartyImage: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
});

module.exports = mongoose.model('Parent', parentSchema);
