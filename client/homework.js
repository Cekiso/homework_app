import axios from "axios";

export default function homeworkApp() {

    return {
        user: null,
        username: null,
        passwordReg: null,
        name: null,
        surname: null,
        password: null,
        hello: null,
        open: false,
        hide: true,
        loginError: '',
        movieName: null,
        movies: [],
        showError: false,
        hide: false,
        loginSection: false,
        registerSection: true,
        description: null,
        image: null,
        moviename: null,
        userid: null,
        favs: [],
        showFavs: false,
        showSearchResults: false,
        registerMessage:false,
        message: null,
        success:false,

        addSubjects() {
        
            const subject = this.subjectname
    
            axios
                .post('http://localhost:3022/api/addSubjects', {subject})
                .then((result) => {
                    console.log(result.data)
                    if (result.data.status == 'successfully inserted') {
                        console.log('inserted to table')
                    }
                })
        },

     
      
     
    }
}