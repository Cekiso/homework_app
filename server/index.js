const express = require("express");
const cors = require("cors");
const PgPromise = require("pg-promise");
const app = express();
require("dotenv").config();

const API = require("./api.js");
const homeworkFunction = require("./factory-function")
app.use(express.json());
app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL;
const config = {
    connectionString: DATABASE_URL,
};
if (process.env.NODE_ENV == "production") {
    config.ssl = {
        rejectUnauthorized: false,
    };
}
const pgp = PgPromise({});
const db = pgp(config);
const homework = homeworkFunction(db)

// API(app, rk);
    app.post('/api/login' , homework.loginUser) 

    app.post('/api/signUp', homework.registerUser) 

    app.get('/api/subjects', homework.getSubject)

    app.post('/api/addSubjects', homework.addSubjects)

    app.get('/api/topics/:subject',homework.getTopic)
        
    app.post('/api/addTopics', homework.addTopics) 

    app.post('/api/addQuestions', homework.addQuestions)

    app.post('/api/addAnswers', homework.addAnswers)

    app.put('/api/updateAnswer', homework.updateAnswers)

    app.get('/api/qAndA/:topic', homework.getQoestionsTopicId)

    app.post('/api/kidsAttempt', homework.kidsAttempt);

    app.put('/api/recordAttempts', homework.recordAttempts);

    app.post('/api/getProgress', homework.getProgress);


let PORT = process.env.PORT;

app.listen(PORT, function () {
  console.log("App starting on port", PORT);
});
