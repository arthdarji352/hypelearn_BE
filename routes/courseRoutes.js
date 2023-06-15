var express = require('express');

var router = express.Router();

const { getCourse, getAllCourses, createCourse } = require('../controllers/courseController');

router.get('/get_all_courses', getAllCourses);

router.post('/get_courses', getCourse);

router.post('/create_course', createCourse);

// router.patch();

// router.delete();

module.exports = router;
