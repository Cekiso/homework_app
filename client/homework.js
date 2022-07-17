import axios from "axios";

export default function homeworkApp() {

    return {

        addedSubject: null,
        addSubjectSection: true,
        subjectsList: [],

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
        }

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