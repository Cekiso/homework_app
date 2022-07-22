const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
module.exports = function name(app, db) {

    // app.get('/api/test', function (req, res) {
    //     res.json({
    //         name: 'Student'
    //     });
    // });


    app.post('/api/login', async (req, res) => {
        const { username,
            password } = req.body;
        try {

            if (!(username && password)) {
                throw Error("All input is required");
            }
           
            let validUserFormat =  /^[0-9a-zA-Z_.-]+$/.test(username);
            if (!validUserFormat) {
                throw Error("Invalid username Format")
            }           
            const user = await db.oneOrNone('select username from user_detail where username = $1', [username]);
            console.log(user);
            if (user) {

                const getPassword = await db.one('select password from user_detail where username= $1', [username]);
                console.log(getPassword.password);

                const comparePasswords = await bcrypt.compare(password, getPassword.password);

                console.log(comparePasswords);

                const token = await jwt.sign({ user }, `secretKey`, { expiresIn: `24h` });
                console.log(token);
                res.json({
                    status: 'success',
                    user,
                    token
                })
            }
            else {
                throw new Error("user not found, please try again")
            }


        } catch (error) {
            res.json({
                status: error.stack,

            })
        }

    })

    app.post('/api/signUp', async (req, res) => {
        const {
            firstname,
            lastname,
            username,
            password,
            role } = req.body;
        try {
            console.log(username);
            if (!(username && password && firstname && lastname)) {
                throw Error("All input is required");
            }
            const oldUser = await db.manyOrNone('select * from user_detail where username = $1', [username])
            console.log(oldUser.length === 0);

            if (oldUser.length === 0) {
                const cryptedPassword = await bcrypt.hash(password, 10)
                let insert = await db.any('INSERT INTO user_detail (first_name, lastname, username, password, role) VALUES ($1, $2, $3, $4, $5)', [firstname, lastname, username, cryptedPassword, role]);
                console.log(insert);
                const user = await db.manyOrNone('select * from user_detail where username = $1', [username])

                const token = await jwt.sign({ user }, `secretKey`, { expiresIn: `24h` });
                res.json({
                    status: 'success',
                    token
                })
            }
            else {
                throw Error("User Already Exist. Please Login");
            }


        } catch (error) {
            console.log(error.message);
            res.json({
                status: error.message,
            })

        }
    })


    app.get('/api/subjects', async function (req, res) {
        let result = []
        result = await db.manyOrNone("select add_subject from subject_table")
        res.json({
            data: result
        })
    });
    app.post('/api/addSubjects', async function (req, res) {
        try {
            let { subject } = req.body
            
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

            const getAnswerId = await db.oneOrNone('insert into answers_table(answers,questions_id) values ($1,$2) returning id', [answer, questionId])
            // console.log('answer id' + JSON.stringify(getAnswerId.id))
            return res.json({
                status: 'successful',
                answerId: getAnswerId.id
            });
        } catch (error) {
            console.log(error)
        }
    });

    app.put('/api/updateAnswer', async function (req, res) {
        try {
            const { answerId, answer } = req.body

            await db.none("update answers_table set answers = $1 where id = $2", [answer, answerId])

            res.json({
                status: 'success',
                data: 'updated answer'
            })

        } catch (err) {
            console.log(err);
            res.json({
                status: 'error',
                error: err.message
            })
        }
    });

}