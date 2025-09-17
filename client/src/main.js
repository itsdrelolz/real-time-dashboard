import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import '@fortawesome/fontawesome-free/js/all.js'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import SplitButton from 'primevue/splitbutton'
import Toolbar from 'primevue/toolbar'
import { Avatar } from 'primevue'
import { Skeleton } from 'primevue'
import { Form } from '@primevue/forms'
import Listbox from 'primevue/listbox'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false,
    },
  },
})
app.use(router)

app.component('Button', Button)
app.component('Drawer', Drawer)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('SplitButton', SplitButton)
app.component('Toolbar', Toolbar)
app.component('Avatar', Avatar)
app.component('Skeleton', Skeleton)
app.component('Form', Form)
app.component('Listbox', Listbox)

app.mount('#app')
