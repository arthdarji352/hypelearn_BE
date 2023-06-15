const dotenv = require('dotenv');

dotenv.config();
const Course = require('../model/course'); // Mongo User Schema

// Get course
const getAllCourses = async (req, res) => {
  let allCourses;
  try {
    allCourses = await Course.find();
  }
  catch (error) {
    return res.status(500).json({ status: 'error', error: 'error in reading database' });
  }
  return res.status(200).json({ status: 'ok', data: allCourses });
};

// Get course
const getCourse = async (req, res) => {
  const { _id } = req.body;
  console.log('body', req.body);
  const course = await Course.findOne({ _id }).lean();

  if (course) {
    return res.status(200).json({ status: 'ok', data: course });
  }
  return res.status(404).json({ status: 'ok', data: 'course not found' });
};

const createCourse = async (req, res) => {
  try {
    await Course.create(req.body);
    return res.status(200).json({ status: 'ok', data: 'course created successfully' });
  }
  catch (error) {
    if (error.code === 11000) {
      // error.code === 11000 duplicate key
      return res.status(500).json({ status: 'error', error: 'course with same name already there' });
    }
    throw error;
  }
};

module.exports = { getCourse, getAllCourses, createCourse };
