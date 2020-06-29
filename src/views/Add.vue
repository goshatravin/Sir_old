<template>
    <div class="personal">
        <header>
            <div class="header-wrapp" v-if="this.$store.state.addComplete">
                <div class="wrap-box">
                    <div class="login-box-text">
                        <p class="login-box__item" />
                    </div>
                    <div class="warp-box_form">
                        <p class="wrap-box_from-text">
                            Дело №{{ this.$store.state.refidNumber }} успешно <br> зарегистрировано!
                        </p>
                        <!-- svg -complete -->
                        <img class="svg" src="../assets/complete/complete-arrow.svg" alt="">
                        <!--  -->
                    </div>
                </div>
            </div>
            <!--  -->
            <navigation /> <!-- модуль навигации -->
            <main>
                <topPanel title="Регистрация нового дела" /> <!-- верхняя панель пользователя -->
                <div class="components-box">
                <addNew />  <!--Панель регистрации нового дела -->
                <events /> <!-- Панель отслеживания событий об ошибках и событиях по новому делу -->
                <provSelect /> <!-- Панель Выбора провайдера -->
                </div>
            </main>
        </header>
    </div>
</template>
<script>
import axios from 'axios';
import navigation from '../components/navigation.vue';
import topPanel from '../components/topPanel.vue';
import addNew from '../components/add-components/addNew.vue';
import events from '../components/add-components/events.vue';
import provSelect from '../components/add-components/provSelect.vue';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl, // Ссылка на URL сервера NodeJS
            socket: this.$store.getters.socketUrl, // Ссылка на URL сервера веб-сокетов               
        }
    },
    components: {
        navigation,
        topPanel,
        addNew,
        events,
        provSelect,
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    created: function () {
        this.sendData()
    },
    mounted: function () {
        document.title = "Регистрация нового дела";
         // toLogin - после нажатия на кнопку "Выйти из других окон" переводит предыдущее
        // окно, где работал польз-ль на страницу логина
        this.socket.on('toLogin', () => {
            this.$router.push('/login')
        })
        // kick - срабатывает при дублировании вкладки
        this.socket.on('kick', (message) => {
            this.$router.push('/login')
            this.$store.state.loginBtn = false;
            this.$store.state.sessionQuest = true;
            return this.$store.state.status = message.text
        })
    },
    methods: {
        sockets() {
            console.log('add userId: ',this.userId)
            let data = { page: 'add', userId: this.userId }
            this.socket.emit('authorize', data, () => {
                console.log('add authorize here.')
            })
        },
        /**
         * sendData() - отправляет post-запрос на страницу /add
         * Принимает данные токена
         */
        sendData() {
            let data = { page: 'add' }
            console.log('This is Add apiUrl: ', this.apiUrl)
            axios({
                url:`${this.apiUrl}/api/user/add`,
                withCredentials: true,
                method: 'post',
                data: data.page
            })  
                .then((resp) => {
                    if (resp.data.error) {
                        return this.$router.push('/login') 
                    }
                    console.log('Add answer: ', resp.data)
                    // Запись токена в store.js
                    // Почему-то я записывал не весь токен в store, а только id_user, из-за чего
                    // получил ошибку в файле addNew - не отрабатывала регистрация дела, 
                    // т.к. из геттерсов не было возможности извлечь id_user пользователя
                    // для завершения регистрации
                    this.$store.dispatch('save_token', resp.data)
                })
                .then(() => {
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is Add error: ', error)
                })
        }
    }
};

</script>

<style scoped>
    header {
        display: flex;
    }

    main {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .components-box {
        padding: 2rem;
        display: flex;
        justify-content: space-between;
        max-width: 80rem;
    }

    .header-wrapp {
        position: absolute;
        height: 100%;
        width: 100%;
        background: var(--lightgrey);
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .compleate-box {
        width: 20rem;
        height: 20rem;
        background: red;
    }
    .warp-box_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 60%;
        width: 100%;
        padding-top: 1rem;

    }
    .login-box-text {
        background: var(--blue);
        border-radius: 5px 5px 0px 0px;
        padding: 1.5rem 2rem;
        text-align: left;
    }
    .wrap-box {
        position: absolute;
        top: 40%;
        left: 40%;
        z-index: 100000;
        box-shadow: var(--boxShadow);
        height: 12rem;
        width: 20rem;
        background: white;
        border-radius: 5px 5px 0px 0px;
        text-align: center;
    }
    .input_text {
        width: 7rem;
        padding: 0.8rem 2rem;
        margin-bottom: 0.5rem;
        margin-top: 2.5rem;
        border: none;
        color: var(--black);
        background-color: var(--lightgrey);
        font-size: 1rem;
    }
    .wrap-box_from-text{
        line-height: 1.5rem;

    }
    .svg{
        max-width: 5rem;
        transition: all 0.3s;
    }
    /* svg path {
        -webkit-animation: londing 6s linear 0s;
        -o-animation: londing 6s linear 0s;
        animation: londing 6s linear 0s;
    }
    @keyframes londing {
        0% {
            opacity: 0;
            stroke-dashoffset: -900;
        }

        50% {
            stroke-dashoffset: 0;
        }

        100% {
            opacity: 1;
            stroke-dashoffset: 900;
        }
    } */

</style>
