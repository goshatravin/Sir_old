<template>
    <div class="about">
        <header>
        <navigation /> <!-- модуль навигации -->
        <main>
            <topPanel title="Список инструментов" /> <!-- верхняя панель пользователя -->
            <div class="components-box">
                <toolsList/>
            </div>
        </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios'
import navigation from '../components/navigation.vue'
import topPanel from '../components/topPanel.vue'
import toolsList from '../components/tools-components/toolsList.vue'
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
        toolsList
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    created: function () {
        this.sendData()
    },
    mounted: function () {
        document.title = "Список инструментов";
        // toLogin - после нажатия на кнопку "Выйти из других окон" переводит предыдущее
        // окно, где работал польз-ль на страницу логина
        this.socket.on('toLogin', () => {
            this.$router.push('/login')
        })
        // kick - срабатывает при дублировании вкладки
        this.socket.on('kick', (message) => {
            this.$router.push('/login')
            return this.$store.dispatch('duplicate_login', message.text)
            // this.$store.state.loginBtn = false;
            // this.$store.state.sessionQuest = true;
            // return this.$store.state.status = message.text
        })
    },
    methods: {
        sockets() {
            console.log('tools userId: ',this.userId)
            let data = { page: 'tools', userId: this.userId }
            this.socket.emit('authorize', data, () => {
                console.log('tools authorize here.')
            })
        },
        /**
         * sendData() - отправляет post-запрос на страницу /tools
         * 
         */
        sendData() {
            let data = { page: 'tools' }
            axios({
                url: `${this.apiUrl}/api/user/tools`,
                withCredentials: true,
                method: 'post',
                data: data.page
            })  
                .then((resp) => {
                    console.log('Tools answer: ', resp)
                    if (resp.data.error) {
                        this.$router.push('/login') 
                    }
                    this.$store.dispatch('save_token', resp.data)

                    let data = { page: 'Tools', userId: this.$store.getters.userId }
                })
                .then(() => {
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is Tools error: ', error)
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
    overflow: hidden;
}
.components-box {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    flex-direction: row;
}
.ingos__block{
    padding: 2rem;
}
</style>