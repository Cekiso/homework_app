import axios from 'axios';

export default function signLog() {
    return {
        firstname: null,
        lastname: null,
        username: null,
        password: null,
        role: null,
        signLog: true,
        createAcc: false,
        logUser: false,



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
        
        login() {

            const { username, password } = this.signIn

            axios.post('http://localhost:8585/api/login', {
                username, password
            })
                .then((users) => {
                    console.log(users)
                    if (users.data.status = 'success') {

                        this.user = users.data.user;
                       
                    }
                }).catch(e => console.log(e))
        },
        register() {
            const { firstname, lastname, username, password, role } = this.signUp
            axios.post('http://localhost:8585/api/signUp', {
                firstname, lastname, username, password, role
            })
                .then((users) => {
                    console.log(users.data)
                    if (users.data.status = 'success') {
                        this.user = users.data.user;
                    }
                })
        }
    }
}