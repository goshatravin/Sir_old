import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Main from './views/Main.vue';
import Personal from './views/Personal.vue';
import About from './views/About.vue';
import Add from './views/Add.vue';
import Recase from './views/Re_case.vue';
import Documents from './views/Documents.vue'
import IngosForm from './views/IngosForm.vue'
import Tools from './views/Tools.vue'
import Chat from './views/Chat.vue'
import store from './store.js';
import axios from 'axios';
Vue.use(Router);
// Vue.http.options.credentials = true;

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'main',
            component: Main,
            meta: {
                requiresAuth: true,
                // requiresAuth: false,

            },
        },
        {
            path: '/personal',
            name: 'personal',
            component: Personal,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/add',
            name: 'add',
            component: Add,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/recase',
            name: 'recase',
            component: Recase,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/documents',
            name: 'documents',
            component: Documents,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/ingos',
            name: 'ingos',
            component: IngosForm,
        },
        {
            path: '/tools',
            name: 'tools',
            component: Tools,
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

// Предотвращает закрытие страницы add или обновления 
router.beforeEach((to, from, next) => {
    if(to.name === 'login' || store.getters.token.length !== 0){
        let apiUrl = store.getters.apiUrl
        window.onpopstate = event => {
            axios({
                url:`${apiUrl}/api/user/routing`,
                method: 'POST',
                withCredentials: true
            })  
                .then((res) => {
                    next('/')
                    if (res.data.error) {
                        next('/login')
                    }
                    next();
                    return;
                })
                .catch((error) => {
                    console.log('This is beforeEach error: ', error)
                })
        }
    }
    
    // if(from.name == 'add' || from.name =='recase'){
    //     // Для пунктов меню Регистрация дела и Список дел выводятся
    //     // разные тексты завершения работы
    //     let answer = ''

    //     if (from.name === 'add'){
    //         answer = window.confirm('Завершить регистрацию?')
    //     } else if (from.name === 'recase') {
    //         answer = window.confirm('Завершить изменение дела?')
    //     } else {
    //         answer = window.confirm('Завершить?')
    //     }

    //     if (answer) {
    //         next()
    //     } else {
    //         return 
    //     }
    // }
    
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let apiUrl = store.getters.apiUrl
        console.log('This is router apiUrl: ', apiUrl)
        // Запрос, что данные пользователя есть
        axios({
            url:`${apiUrl}/api/user/routing`,
            method: 'POST',
            withCredentials: true
        })  
            .then((res) => {
                if (res.data.error) {
                    next('/login'); 
                }
                next();
                return;
            })
            .catch((error) => {
                console.log('This is beforeEach error: ', error)
            })
        console.log('This is IsLoggedIn Boolean: ', store.getters.isLoggedIn)
        console.log('Router. Before next.')
    } else {
        next();
    }
});
router.afterEach((to,from,next) =>{
    if(from.name == "add"){
        console.log("312312")
        store.commit('addComplete', false)
    }
})
export default router;

