import axios from "axios";

export default function homeworkApp() {

    return {
        firstname: null,
        lastname: null,
        username: null,
        password: null,
        role: null,
        createAcc: false,
        logUser: true,
        teachersLandingPage: false,
        addedSubject: null,
        addedTopic: null,
        showTopicHW: false,
        addSubjectSection: false,
        topicSection: false,
        homeworkSection: false,
        homeworkForTopic: false,
        subjectsList: [],
        subjectname: null,
        topicsList: [],
        topicname: null,
        nav: false,
        addQuestionSection: false,
        question: null,
        questionId: null,
        answer: null,
        answerList: [],
        list: [],
        finalList: [],
        gameSection: false,
        kidsTopic:false,
        kidsQuestion: false,
        kidQuestion: false,
        kidAnswers: [],
        radioValue: false,
        object: {},
        index: null,
        displayQuestionsSection: false,
        qAndASection: false,
        answerId: null,
        topicId: null,
        loginSuccessMsg: null,
        registerSuccessMsg: null,
        successMessage: null,
        successMessageQuestion: null,
        successMessageAnswer: null,
        i: 0,
        clickedAnswer: null,
        addingAnswers: [],

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
                // let username = /^[0-9a-zA-Z_.-]+$/.test(username)
                .then((users) => {

                    console.log(users.data)
                    console.log('user ' + this.registerSuccessMsg);
                    // this.createAcc = false
                    // this.logUser = true
                    if (users.data.status == 'success') {
                        this.registerSuccessMsg = 'Successfully registered'
                        this.user = users.data.user;
                    }

                })
                .catch(e => {
                    console.log(e)
                    this.registerSuccessMsg = e.response.data.message
                })
            setTimeout(() => {
                this.registerSuccessMsg = '';
            }, 3000);
        },

        login() {

            const { username, password } = this.signIn

            axios.post('http://localhost:8585/api/login', {
                username, password
            })
                // let username = /^[0-9a-zA-Z_.-]+$/.test(username)
                .then((users) => {
                    console.log(users)
                    console.log('user ' + this.loginSuccessMsg);
                    if (users.data.status == 'success' && users.data.role == 'teacher') {
                        this.user = users.data.user;
                        this.loginSuccessMsg = 'Successfully login'
                        this.nav = true;
                        this.teachersLandingPage = true;
                        this.logUser = false;
                    }

                    else if (users.data.status == 'success' && users.data.role == 'learner') {
                        this.gameSection = true
                        this.logUser = false;
                    }


                })
                .catch(e => {
                    console.log(e)
                    this.loginSuccessMsg = e.response.data.message
                })
            setTimeout(() => {
                this.loginSuccessMsg = '';
            }, 3000);
        },

        addSubject() {
            console.log('checking subject' + this.addedSubject)

            let subjectTitle = this.addedSubject
            const subject = subjectTitle.charAt(0).toUpperCase() + subjectTitle.slice(1).toLowerCase();

            axios
                .post('http://localhost:8585/api/addSubjects', { subject })
                .then((result) => {
                    console.log(result.data)

                    // this.successMessage = 'successfully added'
                    if (result.data.status == 'successful') {
                        this.successMessage = 'successfully added!'
                        this.subjectsList = result.data.subjects
                    }


                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);

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
                    if (result.data.status == 'successful') {
                        this.successMessage = 'successfully added!'
                        this.topicsList = result.data.topics
                    }


                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);
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
                    this.topicId = result.data.topicid
                    if (result.data.status == 'successful') {
                        this.successMessageQuestion = 'successfully added!'
                    }


                    setTimeout(() => {
                        this.successMessageQuestion = '';
                    }, 3000);


                })
        },
        addAnswers() {
            console.log('check answers  ' + this.answer + this.questionId)

            this.answerList.push(this.answer)
            const answer = this.answer
            console.log(this.questionId);
            const questionId = this.questionId
            const booleanVal = this.radioValue

            axios
                .post('http://localhost:8585/api/addAnswers', { answer, questionId, booleanVal })
                .then((result) => {
                    console.log(result.data)

                    this.list.push({
                        answer: this.answer,
                        id: result.data.answerId,
                        topicId: this.topicId,
                        questionId: this.questionId,
                        correct: false,
                    });
                    console.log('list of answers' + JSON.stringify(this.list))
                })
        },

        getCorrectValue() {
            console.log('alien' + JSON.stringify(this.list));

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
                        if (result.data.status == 'success') {
                            this.successMessageAnswer = 'successfully updated!'
                        }

                        setTimeout(() => {
                            this.successMessageAnswer = '';
                        }, 3000);

                        // this.list=[]
                    })
            });



        },

        displayHomework() {
            const topic = this.topicname
            console.log('ASDFGNJM, ' + topic)
            axios
                .get(`http://localhost:8585/api/qAndA/${topic}`)
                .then((result) => {
                    console.log('ddata' + JSON.stringify(result.data.data))
                    this.finalList = result.data.data

                })
            console.log('yyyy' + JSON.stringify(this.finalList));


        },

        displayHomeworkForKids() {

            const topic = this.topicname

            console.log('eyyyyy ' + this.clickedAnswer)
            axios
                .get(`http://localhost:8585/api/qAndA/${topic}`)
                .then((result) => {
                    console.log('first Q&A' + JSON.stringify(result.data))

                    if (result.data.status == 'successful') {

                        this.kidQuestion = result.data.data[this.i].question
                        this.kidAnswers = result.data.data[this.i].answers


                        if (this.clickedAnswer == true) {

                            if (this.i == result.data.data.length - 1) {
                                this.kidQuestion = 'Homework finished!'
                                this.kidAnswers = null
                                // this.successMessage = 'Done!'
                                console.log('beyonce')
                            }

                            else {
                                this.successMessage = 'Correct!'
                                this.i += 1
                                this.kidQuestion = result.data.data[this.i].question
                                this.kidAnswers = result.data.data[this.i].answers
                            }
                        }

                        else if (this.clickedAnswer == false) {
                            this.successMessage = 'Try again'
                        }
                    }
                    else {
                        this.kidQuestion = result.data.status
                        this.kidAnswers = null
                    }

                    setTimeout(() => {
                        this.successMessage = '';
                        this.errorMessage = '';
                    }, 3000);
                })
        },

    }
}