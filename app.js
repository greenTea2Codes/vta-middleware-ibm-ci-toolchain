const express = require('express');
const course_router = require('./routes/courseRouter');
const auth_router = require('./routes/authRouter');
const answer_store_router = require('./routes/answerStoreRouter');
// require('dotenv').config({path: './config/.env'});
// const expressValidator = require('express-validator');
// const { body } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;
const base_path = '/api/v1';

app.use(express.json());
// app.use(expressValidator());

app.use(base_path + '/auth', auth_router);
app.use(base_path + '/courses', course_router);
app.use(base_path + '/answerStoreItems', answer_store_router);

app.get(base_path + '/', (req, res) => {
    res.send('Hello World!')
});


app.listen(port, () => {
    console.log(`VTA express app listening at http://localhost:${port}`)
});

module.exports = app;
