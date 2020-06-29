import Vue from 'vue';
import Axios from 'axios';
import vSelect from 'vue-select';
import Vuelidate from 'vuelidate';
import IdleVue from 'idle-vue';
import Konami from 'konami';
import store from './store';
import router from './router';
import App from './App.vue';
import VueTour from 'vue-tour'
import VueClipboard from 'vue-clipboard2'
import { VueSpinners } from '@saeris/vue-spinners'
import VueLodash from 'vue-lodash'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// require('vue-tour/dist/vue-tour.css')
// Vue.config.errorHandler = function(err, vm, info) {
//     console.log(`Error: ${err.toString()}\nInfo: ${info}`);
//   }
Vue.use(VueSweetalert2);
Vue.use(VueClipboard)
Vue.use(VueSpinners)
Vue.use(VueTour)
Vue.use(Konami);
const eventsHub = new Vue();
Vue.use(VueLodash)
Vue.use(IdleVue, {
    eventEmitter: eventsHub,
    // Время задержки перед выводом окна pin-кода (5 минут)
    idleTime: 1000 * 60 * 5,
    // idleTime: 1000 * 3,
    // idleTime: 3000,

});
Vue.use(Vuelidate);
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    Axios,
    /**
         * Перечисление событий emit 
         */
    data: {
        EVENT_LIST: {
            HITS_BASIC: 'HITS_BASIC', // Базовые подсказки
            HITS_SITUATION: 'HITS_SITUATION', // Подсказки по ситуациям
            HITS_FIELD: 'HITS_FIELD', // Базовые подсказки
            HITS_VALUE: 'HITS_VALUE', // Подсказки по ситуациям
            PROVIDER_CHOOPSE: 'PROVIDER_CHOOPSE', // Загрузка подобранных провайдеров
            SET_ADDRESS: 'SET_ADDRESS', // установка местоположения ЗЛ для карта
            SET_SELECTED_PROVIDER: 'SET_SELECTED_PROVIDER', // Сохраняем выбранного провайдера 
            SET_SELECTED_NAME_PROVIDER: 'SET_SELECTED_NAME_PROVIDER', // Сохраняем выбранного провайдера  в selecteddata
            LOAD_BORDERO: 'LOAD_BORDERO', // Поиск по бордеро
            SET_BORDERO_TO_SHADOW_DOM: 'SET_BORDERO_TO_SHADOW_DOM',
            SET_FILES: 'SET_FILES',
            MED_QUESTIONS: 'MED_QUESTIONS',
            MED_SET_QUESTIONS_ANSWER: 'MED_SET_QUESTIONS_ANSWER',
            OPEN_CASE: 'OPEN_CASE',
            SET_DATA_TO_CASE: 'SET_DATA_TO_CASE',
            TRIGGER: 'TRIGGER', // ТРИГЕР ГОРОДА
            SHOW_QUESTION: 'SHOW_QUESTION',
        },
    },
    watch: {
        $route(route) {
            console.log('This is route name: ', route.name);
        },
    },
    render: h => h(App),
}).$mount('#app');
