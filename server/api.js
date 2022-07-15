const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")

module.exports = function name(app, db) {
    app.get('/api/test', function (req, res) {
        res.json({
            name: 'Student'
        });
    });

    app.post('/api/addSubjects', async function (req, res) {
        try {
            const { subject } = req.body

            const checkSubject = await db.oneOrNone('select * from subject_table where add_subject= $1', [subject])
            if (checkSubject == null) {
                // select add_subject from subject_table where  add_subject= $1
                await db.oneOrNone('insert into subject_table(add_subject) values ($1)',[subject])
                res.json({
                    status: 'added subject'
                });
            }
            else {
                res.json({
                    status: 'subject already added'
                });
            }

        } catch (error) {
            console.log(error)
        }
    });

    app.post('/api/addTopics', async function (req, res) {
        try {
            const { topic } = req.body
            const checkTopic = await db.oneOrNone('select topic from topic_table where topic = $1', [topic])
            
            if (checkTopic == null) {
                await db.any('insert into topic_table(topic) values ($1)', [topic])
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
            const getQuestionId = await db.manyOrOne('select id from questions_table where questions = $1', [question])


            res.json({
                status: 'added question',
                questionId: getQuestionId.id
            });
        } catch (error) {
            console.log(error)
        }
    });

}
