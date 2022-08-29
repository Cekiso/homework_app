import './src/assert/style.css'
import './src/assert/sign.css'
import './src/assert/index.css'
import './src/assert/learner.css'
import './src/assert/calendar.css'


import Alpine from 'alpinejs'
import homeworkApp from './homework'


// import persist from '@alpinejs/persist'

window.Alpine = Alpine
 
// Alpine.plugin(persist)
 
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

