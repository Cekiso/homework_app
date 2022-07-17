import './style.css'
import './index.css'
import Alpine from 'alpinejs'
import homeworkApp from './homework'

window.Alpine = Alpine
Alpine.data('homework', homeworkApp)
Alpine.start()

