<template>
    <header> 
        <navigation /> <!-- модуль навигации -->
        <topPanel title="Стартовая страница" />   <!-- верхняя панель пользователя -->
    </header>
</template>
<script>
import axios from 'axios';
import navigation from '../components/navigation.vue';
import topPanel from '../components/topPanel.vue';
import { mapState } from 'vuex'

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl, // Ссылка на URL сервера NodeJS
            status: this.$store.getters.selected,
            socket: this.$store.getters.socketUrl,
        }
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    components: {
        navigation,
        topPanel,
    },
    
    created: function () {
        document.title = "Основная страница";
        console.log('main created')
        this.sendData()
    },
    mounted: function() {
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
            let data = { page: 'main', userId: this.userId }
            console.log('main data: ', data)
            // TODO: убрать error, потому что он всегда возвращает true с 
            // callback-а
            this.socket.emit('authorize', data, () => {
                console.log('Main authorize here.')
            })
        },
        /**
         * sendData() - отправляет post-запрос на страницу /main
         * Принимает данные токена
         */
        sendData() {
            console.log('This is Main apiUrl: ', this.apiUrl)
            let data = { page: 'main' }
            axios({
                url:`${this.apiUrl}/api/user/main`,
                withCredentials: true,
                method: 'post',
                data: data.page
            })  
                .then((resp) => {
                    if (resp.data.error) {
                        return this.$router.push('/login') 
                    }
                    // Необходимо, чтобы писать данные в токен после блокировки пользователя
                    this.$store.dispatch('save_token', resp.data.user)
                })
                .then(() => {
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is Main error: ', error)
                })
        },
    }
};
</script>

<style scoped>
header {
    display: flex;
}
</style>
