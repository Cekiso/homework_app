import axios from "axios";
export default function homeworkApp() {
    const URL_BASE = import.meta.env.VITE_SERVER_URL

    return {
        firstPage:true,
        firstname: null,
        lastname: null,
        username: null,
        password: null,
        role: null,
        createAcc: false,
        logUser: false,
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
        memo:false,

        score: 0,
        numberOfQuestions: 0,
        memorandum: [],
        wrongAnswer: null,
        correctAnswer: null,
        //storing question and attempts
        questionAndAttempts: [],
        //storing just the attempts for a question
        attemptsOnly: [],
        //storing the latest attempts for a question
        correctAnswers: [],
        //another array for control
        correct: null,
        user: {
            role: ''
        },


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

        init() {
            console.log(localStorage['user']);
            if (localStorage['user'] !== undefined) {

               
                this.logUser= false
                this.user = JSON.parse(localStorage.getItem('user'));
                console.log("------------------", this.user)
                console.log(this.user.role)
                this.signIn.username = this.user.username
                if (this.user.role === "teacher") {
                    this.firstPage=false
                    this.teachersLandingPage = true
                    this.nav= true
                } else if (this.user.role === "learner") {
                    this.firstPage=false;
                    this.gameSection = true;

                }
            } else {

                // this.logUser = true;
                // this.firstPage
               ;
            }
        },


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
                // .catch(e => {
                //     console.log(e)
                //     this.registerSuccessMsg = e.response.data.message
                // })
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
                .then((users) => {
                  
                    const { userInfo, user } = users.data
                    console.log(userInfo)
                    if (!userInfo) {
                        return false
                    } localStorage.setItem('user', JSON.stringify(user));
                    this.userInfo = JSON.stringify(userInfo)
                    localStorage.setItem('token', this.userInfo);
                    
                    console.log(users.data.role)
                    console.log('user ' + this.loginSuccessMsg);
                    if (users.data.status == 'success' && users.data.role == 'teacher') {
                        this.user = users.data.user;
                        this.loginSuccessMsg = 'Successfully login'
                        this.nav = true;
                        this.teachersLandingPage = true;
                        this.logUser = false;
                        this.firstPage= false

                    }

                    else if (users.data.status == 'success' && users.data.role == 'learner') {
                        this.gameSection = true
                        this.logUser = false;
                        this.studentId = users.data.userid
                        this.name = users.data.name
                        this.firstPage= false
                        console.log('fff' + this.name);
                    }
                })
                // .catch(e => {
                //     console.log(e)
                //     this.loginSuccessMsg = e.response.data.message
                // })
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

        logOut() {
            localStorage.clear();
            
            this.logUser = true
            this.teachersLandingPage = false
            this.gameSection = false
            location.reload();
        },

        // clearCredentials(){
        //         this.signIn = ''
        // },

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
            this.memorandum = []
            const topic = this.topicname
            const url = `${URL_BASE}/api/qAndA/${topic}`
            this.gettingCorrectValues()
            axios
                .get(url)
                .then((result) => {
                    console.log('p' + JSON.stringify(result.data.data));
                    this.numberOfQuestions = result.data.data.length
                    if (result.data.status == 'successful') {
                        // this.attemptsOnly = []
                        this.kidQuestion = result.data.data[this.i].question
                        this.kidAnswers = result.data.data[this.i].answers
                        this.question = result.data.data[this.i].question
                        this.correct = this.correctAnswers[this.i]
                        this.recordAttempts()
                        if (this.clickedAnswer == true) {
                            if (this.i == result.data.data.length - 1) {
                                this.score += 1
                                this.attemptsOnly = []
                                this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly,this.correct)
                                console.log('stubborn q' + JSON.stringify(this.questionAndAttempts));
                                this.finalAttemptList(this.questionAndAttempts)
                                this.kidQuestion = null
                                this.kidAnswers = null
                                // this.displayMemo(this.questionAndAttempts)
                                this.memo = true
                            }
                            else {
                                this.attemptsOnly = []
                                this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly, this.correct)
                                console.log('stubborn q' + JSON.stringify(this.questionAndAttempts));
                                this.i += 1
                                this.successMessage = 'Correct!'
                                this.score += 1
                                this.kidQuestion = result.data.data[this.i].question
                                this.kidAnswers = result.data.data[this.i].answers
                            }
                        }
                        else if (this.i == result.data.data.length - 1 && this.clickedAnswer == false && this.status == 'attempt 3') {
                            this.kidQuestion = null
                            this.kidAnswers = null
                            this.status = null
                            this.attemptsOnly.push(this.wrongAnswer)
                            this.updateAttempts(this.i, this.studentId, this.kidQuestion)
                            this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly, this.correct)
                        }
                        else if (this.clickedAnswer == false && this.status == 'attempt 3') {
                            console.log('stubborn q' + JSON.stringify(this.questionAndAttempts));
                            console.log('status' + this.status);
                            this.status = null
                            this.attemptsOnly = []
                            this.i += 1
                            this.successMessage = 'Try again'
                            this.attemptsOnly.push(this.wrongAnswer)
                            this.updateAttempts(this.i, this.studentId, this.kidQuestion)
                            this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly, this.correct)
                            this.finalAttemptList(this.questionAndAttempts)
                            this.kidQuestion = result.data.data[this.i].question
                            this.kidAnswers = result.data.data[this.i].answers
                        }
                        else if (this.i == result.data.data.length - 1 && this.clickedAnswer == false) {
                            this.successMessage = 'Try again'
                            this.attemptsOnly.push(this.wrongAnswer)
                            this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly, this.correct)
                            this.updateAttempts(this.i, this.studentId, this.kidQuestion)
                            this.kidQuestion = result.data.data[this.i].question
                            this.kidAnswers = result.data.data[this.i].answers
                        }
                        else if (this.clickedAnswer == false) {
                            console.log('stubborn q' + JSON.stringify(this.questionAndAttempts));
                            console.log('status' + this.status);
                            this.successMessage = 'Try again'
                            this.attemptsOnly.push(this.wrongAnswer)
                            this.storingAttempts(this.questionAndAttempts, this.kidQuestion, this.attemptsOnly, this.correct)
                            this.updateAttempts(this.i, this.studentId, this.kidQuestion)
                            this.kidQuestion = result.data.data[this.i].question
                            this.kidAnswers = result.data.data[this.i].answers
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

        gettingCorrectValues() {
            const topic = this.topicname
            const url = `${URL_BASE}/api/qAndA/${topic}`
            axios
                .get(url)
                .then((result) => {
                    console.log('yoh' + result.data.data);
                    result.data.data.forEach(element => {
                        element.answers.forEach(answer => {
                            console.log('answer' + JSON.stringify(answer))
                        if (!this.correctAnswers.includes(answer.answer) && answer.correct == true) {
                            // this.correctAnswer = element.answers.correct
                            // // console.log('answer' + element.answers.correct)
                            this.correctAnswers.push(answer.answer)
                        }
                        })
                    })
                    console.log('correct answers' + JSON.stringify(this.correctAnswers))
                })
        },

        storingAttempts(list, question, attempts,correct) {
            list.push({
                question: question,
                attempts: attempts,
                correct : correct
            })
            console.log('hashtag ' + JSON.stringify(list))
        },
        
        finalAttemptList(list) {
            const uniqueQuestion = [];
            const noDuplicates = list.filter(element => {
                const isDuplicate = uniqueQuestion.includes(element.question);
                if (!isDuplicate) {
                    uniqueQuestion.push(element.question);
                    return true;
                }
                return false;
            });
            this.memorandum = noDuplicates
            console.log('bad vibes ' + JSON.stringify(this.memorandum));
        },
        
        displayMemo(list) {
            list.forEach((element, index) => {
                const answer = this.correctAnswers[index];
                // console.log(element, answer);
                element.correct = answer
            });
            this.memorandum = list
            console.log('rfab' + JSON.stringify(list))
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

        updateAttempts(index, student, currentQuestion) {
            const url = `${URL_BASE}/api/recordAttempts`
            const studentId = student
            const question = currentQuestion
            axios
                .put(url, {
                    studentId,
                    question
                })
                .then((result) => {
                    console.log('recorded attempts' + JSON.stringify(result.data.data))
                    console.log('first index' + index)
                    if (result.data.data == 'recorded attempt 3') {
                        index += 1
                        this.status = 'attempt 3'
                    }
                    console.log('second index' + index)
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
                                  this.youTube()
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


    }
}