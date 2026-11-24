import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { vReveal } from './directives/reveal'
import { vParallax } from './directives/parallax'
import { vTilt } from './directives/tilt'

const app = createApp(App)
app.directive('reveal', vReveal)
app.directive('parallax', vParallax)
app.directive('tilt', vTilt)
app.mount('#app')
