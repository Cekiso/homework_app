import './style.css'
import './index.css'
import './learner.css'
import Alpine from 'alpinejs'

import homeworkApp from './homework'
Alpine.data('homework', homeworkApp)

window.Alpine = Alpine

Alpine.start()