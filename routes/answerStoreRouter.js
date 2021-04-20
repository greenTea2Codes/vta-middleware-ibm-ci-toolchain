const express = require('express');
const router = express.Router();
const { has_valid_token } = require('./middleware');
const { validate_answer_store_items } = require('../models/validators');
const answer_store_controller = require('../controllers/answerStoreController');

router.post('/', has_valid_token, validate_answer_store_items(), answer_store_controller.post_answer_store_items);

module.exports = router;