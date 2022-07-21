import axios from "axios";

export default function homeworkApp() {

    return {

        addedSubject: null,
        addedTopic: null,
        addSubjectSection: true,
        topicSection: false,
        subjectsList: [],
        subjectname: null,
        topicsList: [],
        topicname: null,
        addQuestionSection: false,
        question: null,
        questionId: null,
        answer: null,
        answerList: [],
        list: [],
        radioValue: false,
        object: {},
        index: null,
        res: '',
        displayQuestionsSection: false,
        answerId: null,

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

                })
        },
        addAnswers() {
            console.log('check answers  ' + this.answer + this.questionId)

            this.answerList.push(this.answer)

            const answer = this.radioValue
            const questionId = this.questionId

            axios
                .post('http://localhost:8585/api/addAnswers', { answer, questionId })
                .then((result) => {
                    console.log(result.data.answerId)
                    this.list.push({
                        answer: this.answer,
                        id: result.data.answerId,
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

                let answer = element.correct
                let answerId = element.id
                console.log('beyonce' + answer + answerId)
                axios
                    .put('http://localhost:8585/api/updateAnswer', { answer, answerId })
                    .then((result) => {
                        console.log(result.data)
                    })
            });

        },

    }
}
