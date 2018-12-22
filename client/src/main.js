import Vue from "vue"
import VeeValidate from "vee-validate"
import App from "./App"
import router from "./router"
import Quasar from "quasar-framework/dist/quasar.mat.esm"
import "quasar-framework/dist/umd/quasar.mat.css"
import "quasar-extras/material-icons/material-icons.css"
import "quasar-extras/roboto-font"
import "quasar-extras/animate"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { store } from "./store/store.js"

import {
  faBars,
  faPause,
  faPlay,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faBookmark,
  faSearch
} from "@fortawesome/free-solid-svg-icons"

import {
  faBookmark as faBookmarkO
} from "@fortawesome/free-regular-svg-icons"

import {
  faTwitter,
  faFacebookF,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons"

library.add(
  faBars,
  faTwitter,
  faFacebookF,
  faGoogle,
  faPause,
  faPlay,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faBookmark,
  faBookmarkO,
  faSearch
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Quasar)
Vue.use(VeeValidate)
Vue.config.productionTip = false

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
