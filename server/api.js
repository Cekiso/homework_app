const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
module.exports = (app, db) => {

    const verification = (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        console.log(token + "token");
        if (!token)
            return res.sendStatus(401).json()
        console.log(token + "23232323");
        console.log(authHeader + " 99999999");
        jwt.verify(token, `secretKey`, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    }

    app.post('/api/login', async (req, res) => {
        const { username,
            password } = req.body;
        try {

            if (!(username && password)) {
                throw Error("All input is required");
            }

            let validUserFormat = /^[0-9a-zA-Z_.-]+$/.test(username);
            if (!validUserFormat) {
                throw Error("Invalid username Format")
            }

            const user = await db.oneOrNone('select * from user_detail where username = $1', [username]);
            // console.log(user);
            if (!user) {
                throw Error("User does not exist, please create an account")
            }

            const getRole = await db.oneOrNone('select role from user_detail where username = $1', [username]);
            const getUserid = await db.oneOrNone('select id from user_detail where username = $1', [username]);
            const getName = await db.oneOrNone('select first_name from user_detail where username = $1', [username]);
            const getPassword = await db.one('select password from user_detail where username= $1', [username]);
            console.log(getPassword.password);
            // console.log(user);

            const comparePasswords = await bcrypt.compare(password, user.password);

            if (!comparePasswords) {
                throw new Error("Invalid password, please try again")
            }

            const token = await jwt.sign({ user }, `secretKey`, { expiresIn: `24h` });

            res.json({
                status: 'success',
                data: 'Successfully login',
                user,
                userInfo: { token },
                role: getRole.role,
                userid: getUserid.id,
                name: getName.first_name
                // data: decode
            })



        } catch (error) {
            res.status(500).json({
                status: error.stack,
                data: "error",
                message: error.message

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
            // console.log(username);
            if (!(username && password && firstname && lastname)) {
                throw Error("All input is required");
            }


            let validUser = /^[0-9a-zA-Z_.-]+$/.test(username);
            if (!validUser) {
                throw Error("Invalid username Format")
            }
            const oldUser = await db.oneOrNone('select * from user_detail where username = $1', [username])

            if (!oldUser) {
                const cryptedPassword = await bcrypt.hash(password, 10)
                const user = await db.any('INSERT INTO user_detail (first_name, lastname, username, password, role) VALUES ($1, $2, $3, $4, $5) returning *', [firstname, lastname, username, cryptedPassword, role]);
                console.log(user);
                const token = await jwt.sign({ user }, `secretKey`, { expiresIn: `24h` });

                res.json({
                    status: 'success',
                    token,
                    data: user

                })
            }
            else {
                throw Error("User Already Exist. Please Login");

            }


        } catch (error) {
            console.log(error);
            res.status(500).json({
                data: 'error',
                message: error.message,
            })

        }
    })

    // app.get('/api/authorization', async function (req, res) {
    //     const token = req.body.token;
    // })



    app.get('/api/subjects', verification, async function (req, res) {

        let result = await db.manyOrNone("select add_subject from subject_table")

        res.json({
            data: result,

        })
    });

    app.post('/api/addSubjects', async function (req, res) {
        try {
            let { subject } = req.body

            const checkSubject = await db.oneOrNone('select * from subject_table where add_subject= $1', [subject])


            if (checkSubject == null) {
                await db.none('insert into subject_table(add_subject) values ($1)', [subject])
                const getSubjects = await db.manyOrNone('select add_subject from subject_table')
                // console.log('updated subjects' + JSON.stringify(getSubjects));
                res.json({
                    status: 'successful',
                    data: "subject added successfully",
                    subjects: getSubjects

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
            const subject = req.params.subject
            const getSubjectId = await db.oneOrNone('select id from subject_table where add_subject=$1', [subject])
            // console.log('id ' + JSON.stringify(getSubjectId.id))
            let result = await db.manyOrNone("select topic from topic_table where subject_id=$1", [getSubjectId.id])
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
                // const getTopics = await db.manyOrNone('select topic from subject_table')
                // console.log('updated topics' + JSON.stringify(getTopics));
                res.json({
                    status: 'successful',
                    data: 'added topic',
                    // topics: getTopics
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
                    topicid: getTopicId.id
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
            const { answer, questionId, booleanVal } = req.body

            const getAnswerId = await db.oneOrNone('insert into answers_table(answer,correct,questions_id) values ($1,$2,$3) returning id', [answer, booleanVal, questionId])
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
            const { answerId, booleanVal } = req.body

            await db.none("update answers_table set correct = $1 where id = $2", [booleanVal, answerId])

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

    app.get('/api/qAndA/:topic', async function (req, res) {
        try {
            const topic = req.params.topic

            let list = []

            const getTopicId = await db.oneOrNone('select id from topic_table where topic = $1', [topic])
            // console.log('topic id ' + JSON.stringify(getTopicId.id))

            let questions = await db.manyOrNone('select questions from questions_table where topic_id = $1', [getTopicId.id])
            // console.log('questions' + JSON.stringify(questions));

            if (questions.length === 0) {
                res.json({
                    status: 'No Homework',
                })
            }

            for (const question of questions) {

                let getQuestionId = await db.oneOrNone('select id from questions_table where questions = $1', [question.questions])
                let answers = await db.manyOrNone('select answer,correct from answers_table where questions_id = $1', [getQuestionId.id])

                if (!list.includes(question.questions)) {
                    list.push({
                        question: question.questions,
                        answers: answers
                    })
                }
                // console.log('yeah ' + JSON.stringify(answers))
            }

            // console.log('checking question and answers ' + JSON.stringify(list))
            res.json({
                status: 'successful',
                data: list
            })

        } catch (error) {
            console.log(error)
        }
    });

    app.post('/api/kidsAttempt', async function (req, res) {
        try {
            const { studentId, question, date } = req.body
            const getQuestionId = await db.oneOrNone('select id from questions_table where questions = $1', [question])
            const questionId = getQuestionId.id
            console.log('tt' + JSON.stringify(questionId));

            const checkAttempt = await db.oneOrNone('select * from attempts_table where student_id = $1 and question_id = $2', [studentId, questionId])

            if (!checkAttempt) {
                await db.oneOrNone('insert into attempts_table(student_id,question_id,attempt_date) values ($1,$2,$3)', [studentId, questionId, date])
                return res.json({
                    status: 'successful',
                });
            }

            else {
                throw Error("already exists");
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: error.stack,
                data: "error",
                message: error.message

            })
        }
    });

    app.put('/api/recordAttempts', async function (req, res) {
        try {
            const { studentId, question } = req.body

            const getQuestionId = await db.oneOrNone('select id from questions_table where questions = $1', [question])
            const questionId = getQuestionId.id
            console.log('tt' + JSON.stringify(questionId));
            const checkAttempt1 = await db.oneOrNone('select attempt_1 from attempts_table where student_id = $1 and question_id = $2', [studentId, questionId])
            const checkAttempt2 = await db.oneOrNone('select attempt_2 from attempts_table where student_id = $1 and question_id = $2', [studentId, questionId])
            const checkAttempt3 = await db.oneOrNone('select attempt_3 from attempts_table where student_id = $1 and question_id = $2', [studentId, questionId])

            if (checkAttempt1.attempt_1 == null) {
                await db.none("update attempts_table set attempt_1 = $1 where student_id = $2 and question_id = $3", [1, studentId, questionId])
                return res.json({
                    status: 'successful',
                    data: 'recorded attempt 1'
                });
            }

            else if (checkAttempt2.attempt_2 == null) {
                await db.none("update attempts_table set attempt_2 = $1 where student_id = $2 and question_id = $3", [1, studentId, questionId])
                return res.json({
                    status: 'successful',
                    data: 'recorded attempt 2'
                });
            }

            else if (checkAttempt3.attempt_3 == null) {
                await db.none("update attempts_table set attempt_3 = $1 where student_id = $2 and question_id = $3", [1, studentId, questionId])
                return res.json({
                    status: 'successful',
                    data: 'recorded attempt 3'
                });
            }

            else {
                return res.json({
                    status: 'successful',
                    data: 'all attempts have been used'
                });
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: error.stack,
                data: "error",
                message: error.message

            })
        }
    });

    app.post('/api/getProgress', async function (req, res) {
        try {
            const { studentId, date } = req.body
    
            const checkStudentAttempt = await db.manyOrNone('select * from attempts_table where student_id = $1 and attempt_date = $2', [studentId, date])
                      
            if(checkStudentAttempt.length == 0){
                res.json({
                    status: 'failed',
                });
            }
          
           else{
            const joinTables = await db.manyOrNone(`select attempts_table.*,questions_table.topic_id,topic_table.topic from attempts_table
            inner join questions_table on attempts_table.question_id = questions_table.id inner join topic_table on topic_table.id = questions_table.topic_id
            where student_id=$1 and attempt_date=$2`, [studentId, date]);

                let topicsForStudent = []
                let list = []

                joinTables.forEach(element => {
                    if (!topicsForStudent.includes(element.topic_id)) {
                        topicsForStudent.push(element.topic_id)
                    }
                });

                console.log(topicsForStudent);
                console.log('woof ' + joinTables);

                for (const topic of topicsForStudent) {
                    let numberOfQuestions = await db.oneOrNone(`select count(topic_id) from questions_table where topic_id=$1`, [topic])
                    let topicName = await db.oneOrNone(`select topic from topic_table where id = $1 `, [topic])

                    let i = 0
                    joinTables.forEach(element => {
                        console.log('alien' + JSON.stringify(element));
                        if (element.attempt_3 == 1 && element.topic_id == topic) {
                            i++
                        }
                    })
                    list.push({
                        topic: topicName.topic,
                        numberOfQuestions: numberOfQuestions.count,
                        numberOfAttempt3s: i
                    })
                }

                console.log('the ' + JSON.stringify(list));

            for (const topic of topicsForStudent) {
                let numberOfQuestions = await db.oneOrNone(`select count(topic_id) from questions_table where topic_id=$1`, [topic])
                let i = 0
                joinTables.forEach(element => {
                    if (element.attempt3 == 1 && item.topic_id == topic) {
                        console.log('cvb');
                    }
                })
                list.push({
                    topic: topic,
                    numberOfQuestions: numberOfQuestions.count,
                    numberOfAttempt3s: i
                })
            }

                res.json({
                    status: 'success',
                    data: list
                });
            }
        } catch (error) {
            console.log(error)
        }
    });
}