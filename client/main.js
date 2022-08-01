import './style.css'
import './index.css'
import './learner.css'
import './sign.css'
import Alpine from 'alpinejs'
import homeworkApp from './homework'
// import signLog from './signup'
// Alpine.data ('signup',signLog)
window.Alpine = Alpine

Alpine.data('homework', homeworkApp)

Alpine.start()

// export default () => {
//     return {
//         ...signLog,
//         ...homeworkApp(),
//         token: Alpine.$persist(0),
//         time: Alpine.$persist(0),
//        }
// }

