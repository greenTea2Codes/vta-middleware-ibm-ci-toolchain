const express = require('express');
const user_controller = require('../controllers/userController');
const { body } = require('express-validator');

const router = express.Router();

router.post('/', body('username', 'username is missing').exists(), body('password', 'password is missing').exists(), user_controller.authenticate);

module.exports = router;
