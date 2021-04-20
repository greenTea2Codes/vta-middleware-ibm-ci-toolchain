const config = require("../config/config");
const jwt = require("jsonwebtoken");
const GenericResponse = require('../models/genericResponse');

exports.has_valid_token = function (req, res, next) {
    let token = req.header('Auth');
    let response = new GenericResponse('error', 'The token is invalid.', null);
    if (!token) {
        response.message = 'Please provide a valid token';
        return res.status(400).send(response);
    }

    try {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft();
        }
        const decoded_token = jwt.verify(token, config.TOKEN_SECRET);
        if( decoded_token.username !== config.DEMO_USER.username ) {
            return res.status(401).send(response);
        }
        next();
    }
    catch (err) {
        res.status(401).send(response);
    }
};
