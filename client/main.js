import './style.css'
import './index.css'
import './learner.css'
import './sign.css'
import Alpine from 'alpinejs'

// import signLog from './signup'
// Alpine.data ('signup',signLog)
import homeworkApp from './homework'
Alpine.data('homework', homeworkApp)

window.Alpine = Alpine

Alpine.start()