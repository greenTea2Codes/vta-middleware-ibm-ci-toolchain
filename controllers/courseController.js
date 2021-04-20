const { validationResult } = require('express-validator');
const exercises = require('../services/exercises');
const GenericResponse = require('../models/genericResponse');

exports.post_course = async function (req, res) {

    const validation_result = validationResult(req);
    let response = new GenericResponse('success', null, null);

    if (!validation_result.isEmpty()) {
        response.response_type = 'error';
        response.message = validation_result.array();
        return res.status(400).send(response);
    }

    exercises.createExercise(req.body)
        .then(result => {
            console.log('SUCCESS!');
            // console.log(result);
            response.message ='Course exercise is successfully created!';
            response.preview_link = process.env.ASSISTANT_PREVIEW_LINK;
            res.send(response);
        }).catch(err => {
            console.log('ERROR!');
            console.log(err);
            response.response_type = 'error';
            response.message = err;
            res.status(500).send(response);
        });
};
