<template>
    <div class="personal">
        <header>
            <navigation /> <!-- модуль навигации -->
            <main>
                <topPanel title="Личный кабинет" /> <!-- верхняя панель пользователя -->
                <div class="components-box">
                    <userCard />
                    <userPin />
                    <achivment />
                </div>
            </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios';
import navigation from '../components/navigation.vue';
import topPanel from '../components/topPanel.vue';
import userCard from '../components/personal-components/userCard.vue';
import userPin from '../components/personal-components/userPin.vue';
import achivment from '../components/personal-components/achievement.vue';
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
        userCard,
        userPin,
        achivment,
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    created: function () {
        this.sendData()
    },
    mounted: function () {
        document.title = "Личный кабинет";
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
            console.log('personal userId: ',this.userId)
            let data = { page: 'personal', userId: this.userId }
            this.socket.emit('authorize', data, () => {
                console.log('personal authorize here.')
            })
        },
        /**
         * sendData() - отправляет post-запрос на страницу /personal
         * Принимает данные токена
         */
        sendData() {
            let data = { page: 'personal' }
            console.log('userId: this.$store.getters.userId authorize here.', this.$store.getters.userId)
            axios({
                url: `${this.apiUrl}/api/user/personal`,
                withCredentials: true,
                method: 'post',
                data: data.page
            })  
            .then((res) => {
                if (res.data.error) {
                    return this.$router.push('/login') 
                }
                console.log('Personal answer: ', res.data)
                console.log(res.data)
                this.$store.dispatch('save_token', res.data)
            })
            .then(() => {
                this.sockets()
            })
            .catch((error) => {
                console.log('This is Personal error: ', error)
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
    max-width: 90rem;
}

</style>
