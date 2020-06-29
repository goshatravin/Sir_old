import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // декодирование токена
import io from 'socket.io-client'

import { STATUS_CODES } from 'http';
import { stat } from 'fs';

Vue.use(Vuex);

export default new Vuex.Store({
    /**
     * Vuex Хранилище
     *
     * @param {String} status  Статус состояния аутентификации пользователя. 
     * Выводится на странице входа
     * @param {Array} token - Токен пользователя
     * @param {Array} statusOptions - Массив со всеми статусами пользователя
     * @param {String} selected - Выбранное состояние пользователя: одно из Присутствую, На обеде, Перерыв
     * @param {Boolean} dinerBlockpin - Вызов экрана блокировки при смене статуса     * 
     * @param {String} apiUrl - URL сервера NodeJS
     * @param {String} name - ////
     * @param {Array} a - ////
     * @param {Array} autouse - ////
     */
    state: {
        status: '',
        token: '',
        statusOptions: [],
        selected: '',
        dinerBlockpin: false,
        // Production:
        apiUrl: 'http://docker.accidentlaw.ru:8081',
        socketUrl: io('http://docker.accidentlaw.ru:8085'),

        // Develop:
        // apiUrl: 'http://docker.accidentlaw.ru:8083',
        // socketUrl: io('http://docker.accidentlaw.ru:8084'),

        // Local
        // apiUrl: 'http://10.80.108.130:8083', 
        // socketUrl: io('http://10.80.108.130:8084'),
        // apiUrl: 'http://localhost:8083', 
        // socketUrl: io('http://localhost:8084'),
        name: 'store',
        a: [],
        autouse: [],
        pin: '',
        sessionExpire: true,
        // 
        isActive: true,
        isDinner: false,
        isAway: false,
        // 
        navTour: true,
        topTour: false,
        //
        addComplete: false,
        saveComplete: false,
        //
        refidNumber: '',
        dttmcr: '',
        new_case: {},
        loginBtn: true,
        // Всплывающее окно при дополнительных SessionID пользователя
        sessionQuest: false,
        idUserSessionDuplicate: ''
    },


    mutations: {
        set_case(state,payload){
            console.log('store.js new_case before: ', state.new_case)
            state.new_case = {}
            console.log('store.js new_case after: ', state.new_case)
            state.new_case = payload
        },
        /**
         * set_token() - Устанавливает токен пользователя в state.
         * @param {String} token - JSON с данными по пользователю
         * Токен берется из сессии
         */
        set_token: (state, token) => {
            state.token = token;
            console.log('This is TOKYAN!: ', state.token.id_user )
        },
        /**
         * Запрос на вход в систему
         * @param {String} state.status Статус состояния аутентификации пользователя
         */
        auth_request(state) {
            state.status = 'Загрузка';
        },

        selected_change: (state, payload) => {
            console.log('This is selected_change payload: ', payload )
            state.selected = payload
        },
        /**
         * Успешный запрос на вход в систему , получает декодированный токен
         * @param {String} state.status Статус состояния аутентификации пользователя
         * @param {Array} decoded декодированный токен
         */
        auth_success(state, decoded) {
            console.log('This is auth_success Token: ', state.token.id_user )
            state.status = 'Успешно';
            state.token = decoded;
            state.pin = decoded.pin_code;
            state.isActive = true;
            state.isAway = false;
        },
        pin_change(state,payload){
            state.pin = payload
            console.log('This is store state.pin: ', state.pin)
        },
        /**
         * Потраченый запрос на вход в систему
         * @param {String} state.status Статус состояния аутентификации пользователя
         */
        auth_error(state) {
            state.status = 'Ошибка входа';
        },
        /**
         * duplicate_login - выводит кнопку Сбросить сессию в случае, если 
         * для пользователя появляется несколько sessionID
         * @param {*} state 
         * @param {*} payload 
         */
        duplicate_login(state, payload){
            state.status = payload;
            state.loginBtn = false;
            state.sessionQuest = true;
        },
        /**
         * duplicate_login_clear - очищает массив, где хранится несколько ID сессий
         * пользователя
         * @param {*} state 
         * @param {*} payload 
         */
        duplicate_login_clear(state){
            state.loginBtn = true;
            state.sessionQuest = false;
        },
        /**
         * Выход из системы , очистка статуса и токена пользователя
         * @param {String}state.status Статус состояния аутентификации пользователя
         * @param {Array}state.token Статус состояния аутентификации пользователя
         */
        logout(state) {
            state.status = '';
            state.token = '';
        },

        /**
         * Смена статуса пользователя , вызов блокиратора экрана
         * @param {Boolean} state.dinerBlockpin  вызывает блок экрана
         * @param {String} data передает выбранный статус
         */
        blockScreen(state, payload) {
            console.log('This is store blockScreen payload: ', payload)
            state.dinerBlockpin = true;
            state.selected = payload;
            state.isActive = false;
            state.isAway = true;
            console.log('store topPanel blockScreen: ', state.selected)
        },

        /**
         * Снятие блокировки и смена статуса
         * @param {Boolean} state.dinerBlockpin  вызывает блок экрана
         * @param {String} data передает выбранный статус я
         */
        unblockScreen(state, payload) {
            state.dinerBlockpin = false;
            state.selected = payload;
            state.isActive = true;
            state.isAway = false;
            console.log('This is unblockScreen: ', state.selected)
        },
        update (state, payload) {
            state.statusOptions = payload
            console.log('This is state.statusOptions:', state.statusOptions)
        },
        navTour(state,payload){
            state.navTour = payload
        },
        topTour(state,payload){
            state.topTour = payload
        },
        addComplete(state,payload){
            state.addComplete = payload
        },
        saveComplete(state,payload){
            state.saveComplete = payload
            console.log(this.state.saveComplete)
        },
        refid_number(state,payload){
            state.refidNumber = payload
        },
        set_url(state, payload){
            console.log('This is set_url payload: ', payload)
            state.apiTest = payload
        },
    },
    // plugins: [createPersistedState()],
    actions: {
        open_case: ({ commit }, caseq) => {
            console.log('store.js open_case: ', caseq)
            commit('set_case', caseq)
        },
        save_token: ({ commit }, token) => {
            console.log('This is save_token token: ', token)
            commit('set_token', token)
        },
        /**
         * Функция аутентификации пользователя отправляет данные введенные пользователем на сервер получает в ответе JSON token
         * декодирует его и передеает в vuex , так же получает статусы пользователя
         * @param {Array}  data логин и пароль пользователя
         * @param {Array} token  ответ сервера со всеми данными (закодироваными) по пользователю
         * @param {Array} decoded  раскодированные данные по пользователю
         * @param {Array} statusOptions   Статус пользователя
         */
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                let apiUrl = this.state.apiUrl
                console.log('This is store apiTest: ', this.state.apiUrl)
                axios({
                    url: `${apiUrl}/api/user/login`,
                    withCredentials: true,
                    data: user,
                    method: 'POST',
                })
                    .then((resp) => {
                        // console.log('197 Line. This is login resp: ' , resp.data)
                        if (resp.data.error) {
                            this.$router.push('/login')
                        } else if (!resp.data) {
                            this.$router.push('/login')
                        } else {           
                            const token = resp.data;
                            // Установка статуса в 392 при входе. Это Присутствую
                            commit('selected_change', 392)
                            // TODO: хера ли здесь устанавливается токен?!
                            const decoded = jwtDecode(token)
                            // Устанавливаем токен
                            commit('set_token', token)
                            /***********************SOCKET.IO***************************/
                            let data = { userId: decoded.id_user, page: 'login' }
                            this.state.socketUrl.emit('authorize', data, (flag) => {
                                console.log('Main authorize here.')
                                console.log('This is store token id:', decoded.id_user)
                                if (decoded.status == 0) {
                                    commit('auth_success', decoded)
                                    console.log('This is store flag: ', flag)
                                    // Если от сокетов приходит callback === true, то польз-ль может зайти в приложение
                                    if (flag) {
                                        resolve(resp)
                                        console.log('This is decoded: ', decoded.statuses[0])
                                        axios({
                                            url: `${apiUrl}/api/user/presencestatus`,
                                            method: 'POST',
                                            withCredentials: true
                                        })
                                            .then((resp) => {
                                                console.log('This is presencestatus data:', resp.data)
                                                // Установка JSON со всеми статусами из БД в state.statusOptions
                                                commit('update',resp.data)
                                                commit('navTour', true)
                                            })
                                    } else {
                                        commit('auth_error')
                                    }
                                } else {
                                    commit('auth_error')
                                    console.log('store Error status: ', this.state.status)
                                }
                            })
                            this.state.socketUrl.on('kick', (message) => {
                                console.log('store.js socket: ', message)
                                commit('duplicate_login', message.text)
                            })
                            this.state.socketUrl.on('message', () => {
                                commit('auth_error')
                            })
                            /***********************SOCKET.IO***************************/
                        }
                    })
                    .catch((err) => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        /**
         * Функция выхода из сиcтемы,  удаляет токен и очищяет заголовки
         */
        logout() {
            let apiUrl = this.state.apiUrl
            console.log('Logout userId: ', this.state.token.id_user)
            console.log('store logout(): ', this.state.apiUrl)
            console.log('store socketUrl: ', this.state.socketUrl)
            this.state.socketUrl.emit('disconnectUser', { userId: this.state.token.id_user })   
            axios({
                url: `${apiUrl}/api/user/logout`,
                withCredentials: true,
                method: 'POST',
                data: {
                    userId: this.state.token.id_user
                }
            })
                .then((resp) => {
                    console.log('', resp.data)
                });
        },
        /**
         * logoutEverywhere() - вызывается из Login.vue.
         * На экран окна входа выводит кнопку "Выйти из других окон".
         * В случае, если авторизация пользователя успешна, отправляет на 
         * сервер веб-сокетов ID пользователя и по этому ID затираются веб-сокеты
         * для конкретного пользователя
         */
        logoutEverywhere({ commit }, user) {
            let apiUrl = this.state.apiUrl
            return new Promise((resolve, reject) => {
                axios({
                    url: `${apiUrl}/api/user/login`,
                    withCredentials: true,
                    data: user,
                    method: 'POST',
                })
                    .then((resp) => {
                        const token = resp.data;
                        const decoded = jwtDecode(token)
                        if (decoded.status == 0) {
                            resolve(decoded.id_user)
                        } else {
                            commit('auth_error');
                            commit('duplicate_login_clear')
                        }
                    })
                    .catch(e => {
                        console.log('store logoutEverywhere error: ', e)
                    })
            })
        },
        /**
         * duplicateLogin() - вызывает коммит, к-ый 
         * вызывает кнопку "Выйти из других окон" на экран для входа в систему.
         */
        duplicateLogin({ commit }){
            commit('duplicate_login')
        },
        /**
         * duplicateLoginClear() - вызывает коммит, к-ый 
         * возвращает на экран кнопку Войти для входа в систему.
         */
        duplicateLoginClear({ commit }){
            commit('duplicate_login_clear')
        },
        // add part
        sendMessage(context, message) {
            console.log(JSON.stringify(message));
            Vue.prototype.$socket.send(JSON.stringify(message));
        },
        /**
         * updateStatus() - передает статусы при перезагрузке страницы
         * @param {*} param0 
         * @param {*} payload - JSON со всеми статусами для поля state.statusOptions
         */
        updateStatus({ commit }, payload) {
            console.log('This is store updateStatus payload: ', payload)
            commit('update', payload)
        },
        /**
         * updateSelected() - устанавливает статус пользователя при перезагрузке страницы
         * @param {*} param0 
         * @param {*} payload - статус для поля state.selected
         */
        updateSelected({ commit }, payload){ 
            console.log('This is store updateSelected payload: ', payload)
            commit('selected_change', payload)
        },
        /**
         * unblockScreen() - вызывает коммит unblockScreen
         * @param {*} param0 
         * @param {integer} payload - передается ID статуса Присутствую (392)
         */
        unblockScreen( {commit}, payload) {
            console.log('store action unblockScreen: ', payload)
            commit('unblockScreen', payload)
        },

        block__Screen({commit}, payload) {
            console.log('store topPanel selected: ', payload)
            commit('blockScreen', payload)
        },        
    },
    getters: {
        apiUrl: state => state.apiUrl,
        socketUrl: state => state.socketUrl,
        token: state => state.token,
        userId: state => state.token.id_user,
        userName: state => state.token.full_name,
        photoToken: state => state.token.photo,
        statusOptions: state => state.statusOptions,
        selected: state => state.selected,
        isLoggedIn: state => { return !!state.token; },
        authStatus: state => state.status,
        isActive: state => state.isActive,
        isDinner: state => state.isDinner,
        isAway: state => state.isAway,
        getWsMessage: state => () => state.socket.message,
    },

});
