import './style.css'

import Alpine from 'alpinejs'
 
window.Alpine = Alpine

Alpine.start()

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
