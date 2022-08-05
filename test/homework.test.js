const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

// const test = require('test');

const API = require('../server/api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL;
const config = {
    connectionString: DATABASE_URL
}
if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}
const pgp = PgPromise({});
const db = pgp(config);
API(app, db);

describe('The Homework API', function () {

    before(async function () {
        this.timeout(5000);
        await db.none(`delete from user_detail`);
        await db.none(`delete from answers_table`);
        await db.none(`delete from questions_table`);
        await db.none(`delete from topic_table`);
        await db.none(`delete from subject_table`);
    });

    it('should add user details when user registers', async () => {

		const checkRegistration = await supertest(app).post('/api/signUp').send({
			username: 'Laika',
			firstname: 'Malaika',
			lastname: 'Petoors',
			password: 'password03',
            role:'teacher'
		});

		assert.equal('success', checkRegistration.body.status);
	});

    it('should let user to login', async () => {

		const checkRegistration = await supertest(app).post('/api/login').send({
			username: 'Laika',
			password: 'password03',
		});

		assert.equal('success', checkRegistration.body.status);
	});


    it('should add subjects', async () => {

        const result = await supertest(app).post('/api/addSubjects').send({
            subject: 'Maths'
        });

        assert.equal('successful', result.body.status);
    });

    it('should return subjects added', async () => {

        await supertest(app).post('/api/addSubjects').send({
            subject: 'Maths'
        });

        await supertest(app).post('/api/addSubjects').send({
            subject: 'English'
        });

        const results = await supertest(app)
            .get('/api/subjects')
            .expect(200);

        const subjects = results.body.data.map(subject => {
            return subject.add_subject;
        })

        assert.deepEqual(['Maths', 'English'], subjects);
    });

    it('should add topics for a subject', async () => {

        const result = await supertest(app).post('/api/addTopics').send({
            subject: 'Maths',
            topic: 'Addition'
        });

        assert.equal('successful', result.body.status);
    });

    it('should return topics added for specific subject', async () => {

        const results = await supertest(app)
            .get(`/api/topics/${'Maths'}`)
            .expect(200);

        const topics = results.body.data.map(topic => {
            return topic.topic;
        })

        assert.deepEqual(['Addition'], topics);
    });

    it('should add questions for a topic', async () => {

        const result = await supertest(app).post('/api/addQuestions').send({
            question: 'What is 2+2 ?',
            topic: 'Addition'
        });

        assert.equal('successful', result.body.status);
    });

    it('should add answers for a question', async () => {

        const question = await supertest(app).post('/api/addQuestions').send({
            question: 'What is 3+3 ?',
            topic: 'Addition'
        });

        const questionId = question.body.questionid

        const result = await supertest(app).post('/api/addAnswers').send({
            answer: '6',
            questionId: questionId,
            booleanVal: false
        });


        assert.equal('successful', result.body.status);
    });

    it('should be able to update an answers boolean value', async () => {

        const question = await supertest(app).post('/api/addQuestions').send({
            question: 'What is 4+4 ?',
            topic: 'Addition'
        });

        const questionId = question.body.questionid

        const answer = await supertest(app).post('/api/addAnswers').send({
            answer: '8',
            questionId: questionId,
            booleanVal: false
        });

        const answerId = answer.body.answerId

        const result = await supertest(app).put('/api/updateAnswer').send({
            answerId: answerId,
            booleanVal: true,
        });

        assert.equal('updated answer', result.body.data);
    });

    it('should return questions and answers for specific topic', async () => {

        const results = await supertest(app)
            .get(`/api/qAndA/${'Addition'}`)
            .expect(200);


        assert.equal('successful', results.body.status);
    });

    after(() => {
        db.$pool.end();
    });
});