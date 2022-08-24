import axios from "axios";
export default function homeworkApp() {
    const URL_BASE = import.meta.env.VITE_SERVER_URL

    // function updateAxiosJWToken() {
    //     const token = localStorage.getItem('(token)')
    //     axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
    // }

    // updateAxiosJWToken();


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
        kidsTopic: false,
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
        studentId: 0,
        status: null,
        privacy: false,
        getDate: null,
        progressReport: false,
        good: false,
        concern: false,
        name: null,
        goodTopic: [],
        concernTopic: [],
        failed: null,
        url: null,
        link: null,
        number1: 0,
        number2: 0,
        loggeIn: true,
        registration: false,
        // user: {
        //     role: ''
        // },


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

        // init() {
        //     if (localStorage['user'] !== undefined) {
        //         this.loggeIn = false
        //         this.registration = false
        //         this.logUser = true;
        //         this.user = JSON.parse(localStorage.getItem('user'))
                
        //     } else {

        //         this.loggeIn = true
        //         this.registration = false
        //         this.logUser = false;
        //     }
        // },


        register() {
            const url = `${URL_BASE}/api/signUp`
            const { firstname, lastname, username, password, role } = this.signUp
            axios.post(url, {
                firstname,
                lastname,
                username,
                password,
                role
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
            const url = `${URL_BASE}/api/login`
            const { username, password } = this.signIn

            axios.post(url, {
                username,
                password
            })
                // let username = /^[0-9a-zA-Z_.-]+$/.test(username)
                .then((users) => {
                    // console.log(users.data)
                    const { userInfo} = users.data
                    console.log(userInfo.token)
                    // if (!userInfo) {
                    //     return false
                    // }localStorage.setItem('user', JSON.stringify(user));
                    // this.token = JSON.stringify(token)
                    // localStorage.setItem('token', this.token);

                    // if (userInfo && userInfo.token) {
                    //     localStorage.setItem('token', userInfo.token);

                    //     updateAxiosJWToken();
                    // }
                    console.log(users.data.role)
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
                        this.studentId = users.data.userid
                        this.name = users.data.name

                        console.log('fff' + this.name);
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
            const url = `${URL_BASE}/api/addSubjects`
            let subjectTitle = this.addedSubject
            const subject = subjectTitle.charAt(0).toUpperCase() + subjectTitle.slice(1).toLowerCase();

            axios.post(url, {
                subject
            })
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
            const url = `${URL_BASE}/api/subjects`
            console.log(url)
            axios.get(url)
                .then((result) => {
                    console.log(result.data.data)
                    console.log('jjj' + JSON.stringify(result.data.data))

                    this.subjectsList = result.data.data
                })
        },

        addTopics() {
            console.log('hey' + this.subjectname + this.addedTopic)
            const url = `${URL_BASE}/api/addTopics`
            const subject = this.subjectname
            const topic = this.addedTopic

            axios.post(url, {
                subject,
                topic
            })
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

            const url = `${URL_BASE}/api/topics/${subject}`

            axios.get(url)
                .then((result) => {
                    console.log('checking' + result.data)
                    console.log('checking topics' + JSON.stringify(result.data))

                    this.topicsList = result.data.data
                })
        },

        addQuestions() {
            console.log('check question  ' + this.question + this.topicname)
            const url = `${URL_BASE}/api/addQuestions`
            const question = this.question
            const topic = this.topicname
            axios.post(url, {
                question,
                topic
            })
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
            const url = `${URL_BASE}/api/addAnswers`
            this.answerList.push(this.answer)
            const answer = this.answer
            console.log(this.questionId);
            const questionId = this.questionId
            const booleanVal = this.radioValue

            axios.post(url, {
                answer,
                questionId,
                booleanVal
            })
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
                const url = `${URL_BASE}/api/updateAnswer`
                let booleanVal = element.correct
                let answerId = element.id
                console.log('beyonce' + booleanVal + answerId)
                axios.put(url, {
                    booleanVal,
                    answerId
                })
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
            const url = `${URL_BASE}/api/qAndA/${topic}`

            console.log('ASDFGNJM, ' + topic)
            axios
                .get(url)
                .then((result) => {
                    console.log('ddata' + JSON.stringify(result.data.data))
                    this.finalList = result.data.data

                })
            console.log('yyyy' + JSON.stringify(this.finalList));


        },

        displayHomeworkForKids() {
            const topic = this.topicname
            const url = `${URL_BASE}/api/qAndA/${topic}`

            console.log('eyyyyy ' + this.clickedAnswer)
            axios
                .get(url)
                .then((result) => {
                    console.log('first Q&A' + JSON.stringify(result.data))
                    if (result.data.status == 'successful') {

                        this.kidQuestion = result.data.data[this.i].question
                        this.kidAnswers = result.data.data[this.i].answers
                        this.question = result.data.data[this.i].question
                        this.recordAttempts()
                        if (this.i == result.data.data.length - 1) {
                            this.kidQuestion = 'Homework finished!'
                            this.kidAnswers = null
                            // this.successMessage = 'Done!'
                            console.log('beyonce')
                        }

                        if (this.clickedAnswer == true) {
                            if (this.i == result.data.data.length - 1) {
                                this.kidQuestion = 'Homework finished!'
                                this.kidAnswers = null
                                // this.successMessage = 'Done!'
                                console.log('beyonce')
                            }

                            else {
                                this.i += 1
                                this.kidQuestion = result.data.data[this.i].question
                                this.kidAnswers = result.data.data[this.i].answers
                                this.successMessage = 'Correct!'
                            }
                        }
                        else if (this.clickedAnswer == false && this.status == 'attempt 3') {
                            this.i += 1
                            this.kidQuestion = result.data.data[this.i].question
                            this.kidAnswers = result.data.data[this.i].answers
                            this.status = null
                        }

                        else if (this.clickedAnswer == false && this.status != 'attempt 3') {
                            this.successMessage = 'Try again'
                            this.updateAttempts()
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

        recordAttempts() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            today = `${yyyy}-${mm}-${dd}`

            const studentId = this.studentId
            const question = this.question
            const date = today
            console.log('ju' + studentId + question + date);

            const url = `${URL_BASE}/api/kidsAttempt`

            axios.post(url, {
                studentId,
                question,
                date
            })
                .then((result) => {
                    console.log(result.data)
                })
        },

        updateAttempts() {
            const url = `${URL_BASE}/api/recordAttempts`

            const studentId = this.studentId
            const question = this.question

            axios
                .put(url, {
                    studentId,
                    question
                })
                .then((result) => {
                    console.log(result.data)
                    if (result.data.data == 'recorded attempt 3' && this.clickedAnswer == false) {
                        this.status = 'attempt 3'

                    }

                    if (result.data.data != 'recorded attempt 3' && this.clickedAnswer == false) {
                        this.status = null

                    }

                })
        },

        checkProgressByDate() {
            $(function () {
                $('#datepicker').datepicker({
                    format: "yyyy-mm-dd",
                });
            });

            $('.datepicker').on('change', () => {
                this.getDate = $('#example').datepicker({ format: "yyyy-mm-dd", }).val();
                console.log('date' + this.getDate)
            })
        },

        displayProgress() {
            const url = `${URL_BASE}/api/getProgress`

            console.log(`Whats the ${this.studentId} ${this.getDate}`);

            const studentId = this.studentId
            const date = this.getDate

            axios.post(url, {
                studentId,
                date
            })
                .then((result) => {
                    console.log(result.data)
                    // {topic: 'Addition', numberOfQuestions: '4', numberOfAttempt3s: 3, avgOfAttempt3: 75}
                    if (result.data.status == 'failed') {
                        this.progressReport = true
                        this.failed = 'No recorded homework for this day'
                        this.good = false
                        this.concern = false
                        this.goodTopic = []
                        this.concernTopic = []
                    }
                    else if (result.data.status == 'success') {
                        this.progressReport = true
                        this.getDate = date
                        console.log('3 more days' + this.getDate)

                        result.data.data.forEach(element => {
                            if (element.avgOfAttempt3 <= 50) {
                                this.good = true
                                this.goodTopic.push(element.topic);
                                this.failed = null
                                // this.concern = false
                            }

                            else if (element.avgOfAttempt3 > 50) {
                                this.concern = true
                                this.concernTopic.push(element.topic);
                                this.failed = null
                                this.youTube()
                            }
                        })

                        console.log('lists' + JSON.stringify(this.goodTopic) + JSON.stringify(this.concernTopic))
                    }
                })
        },


        youTube() {
            axios
                .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDrS2e-yHHlnbnoDBJIY4HUYZ8b3V147h4&type=video&q=${this.concernTopic} for kids learning`)
                .then((result) => {
                    console.log('ooooo' + JSON.stringify(result.data.items[0].id.videoId));
                    // this.link = result.data.items[0].id.videoId
                    this.url = `https://www.youtube.com/watch?v=${result.data.items[0].id.videoId}`;
                })

        },

        // viewProgress(){
        //     Math.floor(Math.random()*10 + 1)

        // }

    }
}