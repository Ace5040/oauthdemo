import { createApp } from 'vue'
import App from './App.vue'


import { router } from './router'
import { createPinia } from 'pinia'
import { useHttp } from './modules/http'
import { Quasar,
  QMenu,
  QList,
  QItem,
  QItemSection,
  QSeparator,
  QIcon,
  QDialog,
  QCard,
  QBar,
  QSpace,
  QBtn,
  QCardSection,
  QForm,
  QRadio,
  QCardActions,
  Dialog } from 'quasar'
import { config } from './config'

export default class DEMO {
  constructor() {
    const app = createApp(App)
    const pinia = createPinia()
    useHttp(app, pinia)
    app.use(pinia)
    app.use(router)
    app.use(Quasar, {
      components: {
        QMenu,
        QList,
        QItem,
        QItemSection,
        QSeparator,
        QIcon,
        QDialog,
        QCard,
        QBar,
        QSpace,
        QBtn,
        QCardSection,
        QForm,
        QRadio,
        QCardActions
      },
      plugins: {
        Dialog
      }
    })
    app.mount('#app')
  }
}

new DEMO()