const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

// const test = require('test');

const API = require('../api');
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

describe('The Movie API', function () {

    before(async function () {
        this.timeout(5000);
        await db.none(`delete from user_detail`);
        await db.none(`delete from answers_table`);
        await db.none(`delete from questions_table`);
        await db.none(`delete from topic_table`);
        await db.none(`delete from subject_table`);
    });


    it('should add user details when user registers', async () => {

        const checkRegistration = await supertest(app).post('/api/signup').send({
            username: 'Laika',
            firstName: 'Malaika',
            lastName: 'Petoors',
            password: 'password03',
        });

        assert.equal('success', checkRegistration.body.status);
    });

    after(() => {
        db.$pool.end();
    });
});