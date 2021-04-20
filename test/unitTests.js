let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let chaiHttp = require('chai-http');
let sinon = require('sinon');
let fs = require('fs');
let path = require('path');
let app = require('../app');
let config = require('../config/config');
const exercises = require('../services/exercises');
const {derive_reference_id} = require('../services/utilities');

chai.use(chaiHttp);

describe('POST ~/api/v1/courses', () => {
    // let req_body;
    let jwt;
    before(function(){
        // the change to req_body seems to be cached
        // let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        // req_body = JSON.parse(buffer.toString());
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: config.DEMO_USER.username, password: config.DEMO_USER.password})
            .end((err, res) => {
                jwt = res.body.token;
            });
    });
    it('should return 400 if there is no auth token', (done) => {
        chai.request(app)
            .post('/api/v1/courses')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 401 if the auth token is invalid', (done) => {
        chai.request(app)
            .post('/api/v1/courses')
            .set('Auth', 'invalid')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if there is no request body', (done) => {
        chai.request(app)
            .post('/api/v1/courses')
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if the posted json contains empty configuration and questions', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration = {};
        req_body.questions = [];
        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if the posted json misses configuration', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if the posted json contains empty configuration', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration = {};
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_id is missing', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.course_id;
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_id is empty', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_id = '';
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_id is null', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_id = null;
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_id is undefined', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_id = undefined;
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_id is number', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_id = 1234;
        // console.log(req_body.configuration.course_id);

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_name is missing', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.course_name;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_name is empty', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_name = '';

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_name is null', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_name = null;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.course_name is number', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.configuration.course_name = 1234;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.template_type is missing', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.template_type;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                done();
            });
    });
    it('should return 400 if configuration.template_type is empty', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.template_type;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    // todo: test topics
    it('should return 400 if configuration.topics does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if configuration.topics.*.title does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].title;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if configuration.topics.*.topic_welcome_text does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].topic_welcome_text;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if configuration.topics.*.subtopics does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].subtopics;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if configuration.topics.*.subtopics.*.title does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].subtopics[0].title;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if configuration.topics.*.subtopics.*.subtopic_welcome_text does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].subtopics[0].subtopic_welcome_text;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if configuration.topics.*.subtopics.*.reference_id does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.configuration.topics[0].subtopics[0].reference_id;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });

    });
    it('should return 400 if the posted json misses questions', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if the posted json contains empty questions', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions = [];

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.question_id does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[req_body.questions.length - 1].question_id;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.question_text does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[req_body.questions.length - 1].question_text;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.question_type does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[req_body.questions.length - 1].question_type;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.image_url is not a valid url', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions[0].image_url = 'abcd';

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.points is not an interger', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions[0].points = 'abcd';

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.fallback is not a boolean', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions[0].points = 'abcd';

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.options is not an array', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions[0].options = 'abc';

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.options.* is not a string', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        req_body.questions[0].options[0] = [];

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.answer_items does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[0].answer_items;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.answer_items.*.value does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[0].answer_items[0].value;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.answer_items.*.synonyms does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[0].answer_items[0].synonyms;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.response_to_correct_answer does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[0].response_to_correct_answer;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 400 if questions.*.response_to_incorrect_answer does not exist', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());
        delete req_body.questions[0].response_to_incorrect_answer;

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            });
    });
    it('should return 200 if the posted json passed validators', (done) => {
        let buffer = fs.readFileSync(path.resolve(__dirname, '../models/example.json'));
        let req_body = JSON.parse(buffer.toString());

        sinon.stub(exercises, 'createExercise').returns(Promise.resolve('created'));

        chai.request(app)
            .post('/api/v1/courses')
            .send(req_body)
            .set('Auth', jwt)
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('success');
                expect(res.body.preview_link).to.be.equal(process.env.ASSISTANT_PREVIEW_LINK);
                done();
            });
    });
});

describe('Utilities', () => {
    it('derive_reference_id should return null if no match', () => {
        let ref_id = derive_reference_id('abc');
        expect(ref_id).to.be.null;

        ref_id = derive_reference_id('1.abc.1');
        expect(ref_id).to.be.null;

        ref_id = derive_reference_id('0.1.1');
        expect(ref_id).to.be.null;

        ref_id = derive_reference_id('a1.1.1');
        expect(ref_id).to.be.null;
    });
    it('derive_reference_id should return reference_id if matches', () => {
        let ref_id = derive_reference_id('1.1.1');
        expect(ref_id).to.equal('1.1');
        ref_id = derive_reference_id('11.2.1');
        expect(ref_id).to.equal('11.2');
        ref_id = derive_reference_id('2.5.1');
        expect(ref_id).to.equal('2.5');
    });

});

describe('POST ~/api/v1/auth', () => {
    it('should return 200 and a token if the credential is correct', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: config.DEMO_USER.username, password: config.DEMO_USER.password})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
            })
    });
    it('should return 400 if username is missing', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({password: config.DEMO_USER.password})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            })
    });
    it('should return 400 if password is missing', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: config.DEMO_USER.username})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            })
    });
    it('should return 401 if username is incorrect', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: 'hacker', password: config.DEMO_USER.password})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            })
    });
    it('should return 401 if username is incorrect', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: config.DEMO_USER.username, password: 'incorrect'})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            })
    });
    it('should return 401 if username and password are incorrect', (done) => {
        chai.request(app)
            .post('/api/v1/auth')
            .send({username: 'hacker', password: 'incorrect'})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('response_type');
                expect(res.body.response_type).to.be.equal('error');
                done();
            })
    });
});
