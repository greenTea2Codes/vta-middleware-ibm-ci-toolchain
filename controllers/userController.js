const config = require("../config/config");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const GenericResponse = require('../models/genericResponse');

exports.authenticate = function (req, res) {
    const validation_errors = validationResult(req);
    let error_response = new GenericResponse('error', null, null);
    if ( !validation_errors.isEmpty() ) {
        error_response.message = validation_errors.array();
        return res.status(400).send(error_response);
    }
    const user = req.body;
    if ( user.username !== config.DEMO_USER.username || user.password !== config.DEMO_USER.password ) {
        error_response.message = 'username or password is incorrect.';
        return res.status(401).send(error_response);
    }
    const token = jwt.sign({ username: user.username }, config.TOKEN_SECRET);
    res.status(200).send({"token": token});
};
