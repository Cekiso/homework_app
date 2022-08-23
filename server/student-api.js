module.exports = (app, db) => {

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

                list.forEach(element => {
                    element.avgOfAttempt3 = element.numberOfAttempt3s / element.numberOfQuestions * 100
                });

                console.log('roof' + JSON.stringify(list));

                res.json({
                    status: 'success',
                    data: list
                });
            }
        } catch (error) {
            console.log(error)
        }
    });

    app.post('/api/linkStudentToTeacher', async function (req, res) {
        try {
            const { studentId, code } = req.body

            let getTeacher = await db.oneOrNone('select username from user_detail where code=$1', [code])

            const checkLink = await db.oneOrNone('select * from linkstudents_table where student_id = $1 and teacher = $2', [studentId,getTeacher.username])
            
            if(checkLink !=null){
                res.json({
                    status: 'failure',
                    data: 'Already linked'
                });
            }
            if (checkLink == null) {
                await db.any('insert into linkstudents_table(student_id,teacher) values ($1,$2)', [studentId,getTeacher.username])

                return res.json({
                    status: 'successful'
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

    app.get('/api/subjectsForStudent/:studentId', async function (req, res) {
        try {

            const studentId = req.params.studentId
            let list = []
            let subject = []

            const getTeacher = await db.oneOrNone('select teacher from linkstudents_table where student_id = $1', [studentId])
            let topic = await db.manyOrNone('select topic_id from questions_table where teacher = $1', [getTeacher.teacher])
            // console.log('hhhhh'+JSON.stringify(topic));
           
            if (topic.length === 0) {
                res.json({
                    status: 'No Homework',
                })
            }

            topic.forEach(element => {
                if(!list.includes(element.topic_id)){
                    list.push(element.topic_id)
                }
            });

            // console.log('wwww'+JSON.stringify(list));

            for (const topic of list) {

                let getSubject = await db.oneOrNone('select subject_id from topic_table where id = $1', [topic])
                let getSubjectName = await db.oneOrNone('select add_subject from subject_table where id = $1', [getSubject.subject_id])
               
                if (!subject.includes(getSubjectName.add_subject)) {
                    subject.push(getSubjectName.add_subject)
                }
            }

            // console.log('bro bro ' + JSON.stringify(subject))

            res.json({
                status: 'successful',
                 data: subject
            })

        } catch (error) {
            console.log(error)
        }
    });

}