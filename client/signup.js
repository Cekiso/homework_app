// import axios from 'axios';

// export default function signLog() {
//     return {
//         firstname: null,
//         lastname: null,
//         username: null,
//         password: null,
//         role: null,
//         signLog: true,
//         createAcc: false,
//         logUser: false,



//         signIn: {
//             username: null,
//             password: null,
//         },

//         signUp: {
//             firstname: null,
//             lastname: null,
//             username: null,
//             password: null,
//             role: null,
//         },

//         register() {
//             const { firstname, lastname, username, password, role } = this.signUp
//             axios.post('http://localhost:8585/api/signUp', {
//                 firstname, lastname, username, password, role
//             })
//                 .then((users) => {
//                     console.log(users.data)
//                     this.createAcc = false
//                     this.logUser = true
//                     if (users.data.status = 'success') {
//                         this.user = users.data.user;
//                     }
//                 })
//         },

//         login() {

//             const { username, password } = this.signIn
//             console.log('kkkkkk' + this.signUp.role)

//             axios.post('http://localhost:8585/api/login', {
//                 username, password
//             })
//                 .then((users) => {
//                     console.log(users)

//                     if (this.signUp.role == 'teacher') {
//                         // this.user = users.data.user;
//                         window.location.assign("./index.html");
//                     }

//                     else if (this.signUp.role == 'learner') {
//                         // this.user = users.data.user;
//                         window.location.assign("./landing-page.html");
//                     }

//                 }).catch(e => console.log(e))
//         },

//     }
// }