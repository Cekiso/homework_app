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
            const checkSubject = await db.oneOrNone('select add_subject from subject_table where add_subject= $1', [subject])
         
            if (checkSubject == null) {
                await db.none('insert into subject_table(add_subject) values ($1)', [subject])
                // let getSubjectId = await db.oneOrNone('select id from subject_table where add_subject=$1',[subject])
                // console.log('ggggg '+ getSubjectId);
                res.json({
                    status: 'sucessful',
                    data: "subject added successfully"
                    // id: getSubjectId.id
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
            console.log('id ' + JSON.stringify(getSubjectId))
            // console.log('id '+ getSubjectId)
            const checkTopic = await db.oneOrNone('select topic from topic_table where topic = $1', [topic])
            if (checkTopic == null) {
                await db.none('insert into topic_table(topic,subject_id) values ($1,$2)', [topic, getSubjectId.id])
                res.json({
                    status: 'added topic'
                });
            }
            else {
                res.json({
                    status: 'topic already added'
                });
            }
        } catch (error) {
            console.log(error)
        }
    });
    app.post('/api/addQuestions', async function (req, res) {
        try {
            const { question } = req.body
            await db.any('insert into questions_table(questions) values ($1)', [question])
            const getQuestionId = await db.oneOrNone('select id from questions_table where questions = $1', [question])
            res.json({
                status: 'added question',
                questionId: getQuestionId.id
            });
        } catch (error) {
            console.log(error)
        }
    });
}