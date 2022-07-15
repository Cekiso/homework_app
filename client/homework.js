import axios from "axios";

export default function homeworkApp() {

    return {

    }
}
//Multiple alpinex-data
document.addEventListener('alpine:init', () => {
    Alpine.data('subject', () => ({
        init() {
            this.addSubject()
        },
        //it should return this 
        addedSubject: '',

        addSubject() {
            axios
                .post("http://localhost:8585/api/subject", this.addedSubject)
                .then((App) => {
                    console.log(App.data);
                })
        }
    }))

})