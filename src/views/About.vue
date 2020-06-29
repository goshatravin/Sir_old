<template>
    <div class="about">
        <header>
            <navigation /> <!-- модуль навигации -->
            <main>
                <topPanel title="О программе" /> <!-- верхняя панель пользователя -->
                <div class="components-box" id="component-box">
                    <aboutVersion />  <!-- Блок с информацией о версии программы -->
                </div>
            </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios';
import navigation from '../components/navigation.vue';
import topPanel from '../components/topPanel.vue';
import aboutVersion from '../components/aboutVersion.vue';
import { Socket } from 'dgram';
import { async } from 'q';
import { mapState } from 'vuex'

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
        aboutVersion,
        userData: [],
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    created: function () {
        this.sendData()
    },
    mounted: function () {
        document.title = "О программе";
        // После нажатия на кнопку "Выйти из других окон" переводит предыдущее
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
            let data = { page: 'about', userId: this.userId }
            this.socket.emit('authorize', data, () => {
                console.log('About authorize here.')
            })
        },
        sendData() {
            console.log('This is About apiUrl: ', this.apiUrl)
            let data = { page: 'about' }
            axios({
                url: `${this.apiUrl}/api/user/about`,
                withCredentials: true,
                method: 'POST',
                data: data
            })  
                .then((resp) => {
                    if (resp.data.error) {
                        return this.$router.push('/login') 
                    }
                    console.log('About answer: ', resp.data)
                    // Запись токена в store.js
                    this.$store.dispatch('save_token', resp.data.user)
                })
                .then(() => {
                    // Необходимо, чтобы отрабатывали сокеты, как только придут 
                    // данные из БД
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is About error: ', error)
                })
        }
    },
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
    overflow: hidden;
}
.components-box {
    padding: 2rem;
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
}
</style>
