const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, unique: true },
    imageSrc: { type: String, required: true },
    imageAlt: { type: String },
    author: { type: String },
    price: { type: Number },
    Rating: { type: Number },
    tags: { type: Array },
    email: { type: String },
    Category: { type: String }
  },
  { collection: 'courses' }
);

const model = mongoose.model('CourseSchema', CourseSchema);

module.exports = model;
