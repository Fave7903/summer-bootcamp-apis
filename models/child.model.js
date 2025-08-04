const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: String,
  class: String,
  image: String,
  schoolAttended: String,
  bootcampCourse: String,
  age: Number,
  gender: String,
  allergies: String,
});

module.exports = mongoose.model('Child', childSchema);
