const { validationResult } = require('express-validator');
const answerStore = require('../services/answerStore');
const GenericResponse = require('../models/genericResponse');

exports.post_answer_store_items = async (req, res) => {

    const validation_result = validationResult(req);
    let response = new GenericResponse('success', null, null);

    if (!validation_result.isEmpty()) {
        response.response_type = 'error';
        response.message = validation_result.array();
        return res.status(400).send(response);
    }

    answerStore.uploadAnswerStoreItems(req.body)
        .then(result => {
            result.forEach(infoText => console.log(infoText));
            response.message = result.join(';');
            response.preview_link = process.env.ASSISTANT_PREVIEW_LINK;
            // console.log('Successfully added items to answer store\n', result)
            return res.send(response);
        }).catch(err => {
            console.log('ERROR!');
            console.log(err);
            response.response_type = 'error';
            response.message = err;
            res.status(500).send(response);
        });

}