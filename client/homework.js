import axios from "axios";

export default function homeworkApp() {

    return {
        
        addedSubject: null,
        addedTopic:null,
        addSubjectSection: true,
        topicSection:false,
        subjectsList: [],
        subjectname:null,
        topicsList:[],
        topicname:null,
        addQuestionSection:false,


        addSubject() {
            console.log('checking subject' + this.addedSubject)

            const subject = this.addedSubject

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

        addTopics(){
            console.log('hey'+ this.subjectname + this.addedTopic)
              const subject = this.subjectname
              const topic = this.addedTopic

            axios
                .post('http://localhost:8585/api/addTopics', { subject,topic })
                .then((result) => {
                    console.log('checking added topics'+ JSON.stringify(result.data))
                })
        },

        displayTopics() {
            console.log('oooo'+ this.subjectname)
            const subject = this.subjectname

            axios
                .get(`http://localhost:8585/api/topics/${subject}`)
                .then((result) => {
                    console.log('checking' + result.data)
                    console.log('checking topics' + JSON.stringify(result.data))
                 
                    this.topicsList = result.data.data
                })
        },
    }
}
//Multiple alpinex-data
// document.addEventListener('alpine:init', () => {
//     Alpine.data('subject', () => ({
//         init() {
//             this.addSubject()
//         },
//         //it should return this
//         addedSubject: '',

//         addSubject() {
//             axios
//                 .post("http://localhost:8585/api/subject", this.addedSubject)
//                 .then((App) => {
//                     console.log(App.data);
//                 })
//         }
//     }))

// })