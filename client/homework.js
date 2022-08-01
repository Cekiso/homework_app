import axios from "axios";

export default function homeworkApp() {

    return {
        firstname: null,
        lastname: null,
        username: null,
        password: null,
        role: null,
        signLog: true,
        createAcc: false,
        logUser: false,
        teachersLandingPage:false,
        addedSubject: null,
        addedTopic: null,
        addSubjectSection: false,
        topicSection: false,
        homeworkSection:false,
        homeworkForTopic: false,
        subjectsList: [],
        subjectname: null,
        topicsList: [],
        topicname: null,
        nav:true,
        addQuestionSection: false,
        question: null,
        questionId: null,
        answer: null,
        answerList: [],
        list: [],
        finalList: JSON.parse(localStorage.getItem('store')) || [],
        gameSection:false,
        kidsQuestion:false,
        radioValue: false,
        object: {},
        index: null,
        displayQuestionsSection: false,
        answerId: null,
        topicId : null,
        
        signIn: {
            username: null,
            password: null,
        },

        signUp: {
            firstname: null,
            lastname: null,
            username: null,
            password: null,
            role: null,
        },

   register() {
            const { firstname, lastname, username, password, role } = this.signUp
            axios.post('http://localhost:8585/api/signUp', {
                firstname, lastname, username, password, role
            })
                .then((users) => {
                    console.log(users.data)
                    this.createAcc = false
                    this.logUser = true
                    this.user = users.data.user;
                    
                })
        },

        login() {

            const { username, password } = this.signIn
            console.log('kkkkkk' + this.signUp.role)

            axios.post('http://localhost:8585/api/login', {
                username, password
            })
                .then((users) => {
                    console.log(users)

                        this.user = users.data.user;
                        this.addSubjectSection = true;
                        
                })
                .catch(e => console.log(e))
        },

        addSubject() {
            console.log('checking subject' + this.addedSubject)

            let subjectTitle = this.addedSubject
           const subject = subjectTitle.charAt(0).toUpperCase() + subjectTitle.slice(1).toLowerCase();

            axios
                .post('http://localhost:8585/api/addSubjects', { subject })
                .then((result) => {
                    console.log(result.data)

                })

        },

        displaySubjects() {
            axios
                .get(`http://localhost:8585/api/subjects`)
                .then((result) => {
                    console.log(result.data.data)
                    console.log('jjj' + JSON.stringify(result.data.data))

                    this.subjectsList = result.data.data
                })
        },

        addTopics() {
            console.log('hey' + this.subjectname + this.addedTopic)

            
            const subject = this.subjectname
            const topic = this.addedTopic

            axios
                .post('http://localhost:8585/api/addTopics', { subject, topic })
                .then((result) => {
                    console.log('checking added topics' + JSON.stringify(result.data))
                })
        },

        displayTopics() {
            console.log('oooo' + this.subjectname)
            const subject = this.subjectname

            axios
                .get(`http://localhost:8585/api/topics/${subject}`)
                .then((result) => {
                    console.log('checking' + result.data)
                    console.log('checking topics' + JSON.stringify(result.data))

                    this.topicsList = result.data.data
                })
        },

        addQuestions() {
            console.log('check question  ' + this.question + this.topicname)
            const question = this.question
            const topic = this.topicname
            axios
                .post('http://localhost:8585/api/addQuestions', { question, topic })
                .then((result) => {
                    console.log(result.data)
                    this.questionId = result.data.questionid
                    this.topicId =result.data.topicid

                })
        },
        addAnswers() {
            console.log('check answers  ' + this.answer + this.questionId)

            this.answerList.push(this.answer)
            const answer = this.answer
            const questionId = this.questionId
            const booleanVal = this.radioValue

            axios
                .post('http://localhost:8585/api/addAnswers', { answer, questionId,booleanVal })
                .then((result) => {
                    console.log(result.data)
                    this.list.push({
                        answer: this.answer,
                        id: result.data.answerId,
                        topicId: this.topicId,
                        questionId : this.questionId,
                        correct: false,
                    });
                    console.log('list of answers' + JSON.stringify(this.list))
                })
        },

        getCorrectValue() {
            this.list.forEach(element => {
                if (element.answer == this.answer) {
                    element.correct = true
                } else {
                    element.correct = false
                }
            });

            console.log('updated list' + JSON.stringify(this.list))

            this.list.forEach(element => {

                let booleanVal = element.correct
                let answerId = element.id
                console.log('beyonce' + booleanVal + answerId)
                axios
                    .put('http://localhost:8585/api/updateAnswer', { booleanVal, answerId })
                    .then((result) => {
                        console.log(result.data)
                    })
            });

        },

        displayHomework(){
            const topic = this.topicname
            console.log('ASDFGNJM, ' + topic)
            axios
                .get(`http://localhost:8585/api/qAndA/${topic}`)
                .then((result) => {
                    console.log(result.data)
                })
        },

        storingQAndA(){
            this.finalList.push({
                question: this.question,
                answers: this.list
            })
            localStorage['store'] = JSON.stringify(this.finalList);
            console.log('aye' + JSON.stringify(this.finalList))

        },

        
    }
}
