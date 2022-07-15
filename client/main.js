import './style.css'
import './index.css'

import Alpine from 'alpinejs'

import homeworkApp from './homework'
Alpine.data('enterOpen', homeworkApp)

window.Alpine = Alpine

Alpine.start()