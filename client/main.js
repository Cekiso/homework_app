import './style.css'
import './index.css'
import './learner.css'
import './sign.css'
import Alpine from 'alpinejs'

import homeworkApp from './homework'
Alpine.data('homework', homeworkApp)
import signLog from './signup'
Alpine.data ('authenticate',signLog)
window.Alpine = Alpine

Alpine.start()