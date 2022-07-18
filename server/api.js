const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
module.exports = function name(app, db) {
    app.get('/api/test', function (req, res) {
        res.json({
            name: 'Student'
        });
    });
    app.get('/api/subjects', async function (req, res) {
        let result = []
        result = await db.manyOrNone("select add_subject from subject_table")
        res.json({
            data: result
        })
    });
    app.post('/api/addSubjects', async function (req, res) {
        try {
            const { subject } = req.body
            const checkSubject = await db.oneOrNone('select * from subject_table where add_subject= $1', [subject])

            if (checkSubject == null) {
                await db.none('insert into subject_table(add_subject) values ($1)', [subject])
                res.json({
                    status: 'successful',
                    data: "subject added successfully"
                });
            }
            else {
                res.json({
                    status: 'failure',
                    data: "subject already added"
                });
            }
        } catch (error) {
            console.log(error)
        }
    });

    app.get('/api/topics/:subject', async function (req, res) {
        try {
            let result = []
            const subject = req.params.subject
            const getSubjectId = await db.oneOrNone('select id from subject_table where add_subject=$1', [subject])
            console.log('id ' + JSON.stringify(getSubjectId.id))
            result = await db.manyOrNone("select topic from topic_table where subject_id=$1", [getSubjectId.id])
            res.json({
                status: 'successful',
                data: result
            })
        } catch (error) {
            console.log(error)
        }
    });

    app.post('/api/addTopics', async function (req, res) {
        try {
            const { subject, topic } = req.body
            const getSubjectId = await db.oneOrNone('select id from subject_table where add_subject= $1', [subject])
            const checkTopic = await db.oneOrNone('select topic from topic_table where topic = $1', [topic])
            
            if (checkTopic == null) {
                await db.none('insert into topic_table(topic,subject_id) values ($1,$2)', [topic, getSubjectId.id])
                res.json({
                    status: 'successful',
                    data: 'added topic'
                });
            }
            else {
                res.json({
                    status: 'failure',
                    data: 'already added topic'
                });
            }
        } catch (error) {
            console.log(error)
        }
    });

    app.post('/api/addQuestions', async function (req, res) {
        try {
            const { question, topic } = req.body
            let getTopicId = await db.oneOrNone('select id from topic_table where topic=$1', [topic])
            // console.log('hey'+ getTopicId.id)
            const checkQuestion = await db.oneOrNone('select questions from questions_table where questions = $1', [question])
            if (checkQuestion == null) {
                await db.any('insert into questions_table(questions,topic_id) values ($1,$2)', [question, getTopicId.id])
                let getQuestionId = await db.oneOrNone('select id from questions_table where questions = $1', [question])
                return res.json({
                    status: 'successful',
                    questionid: getQuestionId.id,
                });
            }
            else {
                res.json({
                    status: 'failure',
                });
            }
        } catch (error) {
            console.log(error)
        }
    });
    app.post('/api/addAnswers', async function (req, res) {
        try {
            const { answer, questionId } = req.body
            await db.any('insert into answers_table(answers,questions_id) values ($1,$2)', [answer, questionId])
            return res.json({
                status: 'successful',
            });
        } catch (error) {
            console.log(error)
        }
    });
}