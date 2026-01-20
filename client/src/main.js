import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- NOU
import App from './App.vue'
import router from './router'       // <--- NOU

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ components, directives })

const app = createApp(App)

app.use(createPinia()) // <--- NOU
app.use(router)        // <--- NOU
app.use(vuetify)

app.mount('#app')