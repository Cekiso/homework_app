
// const homeworkFunction = require("./factory-function")
// const homework = homeworkFunction(db)
module.exports = (app, homework) => {

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
} 
//     app.post('/api/login' , homework.loginUser()) 

//     app.post('/api/signUp', homework.registerUser()) 

//     app.get('/api/subjects', homework.getSubject())

//     app.post('/api/addSubjects', homework.addSubjects())

//     app.get('/api/topics/:subject',homework.getTopic())
        
//     app.post('/api/addTopics', homework.addTopics()) 

//     app.post('/api/addQuestions', homework.addQuestions())

//     app.post('/api/addAnswers', homework.addAnswers())

//     app.put('/api/updateAnswer', homework.updateAnswers())

//     app.get('/api/qAndA/:topic', homework.getQoestionsTopicId())

//     app.post('/api/kidsAttempt', homework.kidsAttempt());

//     app.put('/api/recordAttempts', homework.recordAttempts());

//     app.post('/api/getProgress', homework.getProgress());
// }