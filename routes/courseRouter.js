const express = require('express');
const router = express.Router();
const { has_valid_token } = require('./middleware');
const { validate_single_choice_exercise_template } = require('../models/validators');
const course_controller = require('../controllers/courseController');

// todo: create course folder if it does not exist
router.post('/', has_valid_token, validate_single_choice_exercise_template(), course_controller.post_course);

module.exports = router;
