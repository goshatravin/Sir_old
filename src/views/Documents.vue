<template>
    <div class="about">
        <header>
            <!-- <div class="header-wrapp" v-if="this.$store.state.saveComplete">
                <div class="wrap-box">
                    <div class="login-box-text">
                        <p class="login-box__item" />
                    </div>
                    <div class="warp-box_form">
                        <p class="wrap-box_from-text">
                            Дело №{{ this.$store.state.refidNumber }} успешно <br> изменено!
                        </p>
                        <img class="svg" src="../assets/complete/complete-arrow.svg" alt="">
                    </div>
                </div>
            </div> -->
        <navigation /> <!-- модуль навигации -->
        <main>
            <topPanel title="Список дел" /> <!-- верхняя панель пользователя -->
            <div class="components-box">
                <documentList />
                <expressBar />
            </div>
            <!-- <div class="case-box">
                <caseShow />
                <events />
                <provSelect />
            </div> -->
        </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios'
import navigation from '../components/navigation.vue'
import topPanel from '../components/topPanel.vue'
import documentList from '../components/document-components/documentList.vue'
import expressBar from '../components/expressBar.vue'
import { mapState } from 'vuex';

// import caseShow  from '../components/add-components/case.vue'
// import events from '../components/add-components/events.vue'
// import provSelect from '../components/add-components/provSelect.vue';

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
        documentList,
        expressBar,
        // caseShow,
        // events,
        // provSelect
    },
    computed: mapState({
        userId: state => state.token.id_user,
    }),
    created: function () {
        this.sendData()           
    },
    mounted: function () {
        document.title = "Список дел";
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
            console.log('documents userId: ',this.userId)
            let data = { page: 'documents', userId: this.userId }
            this.socket.emit('authorize', data, () => {
                console.log('documents authorize here.')
            })
        },
        /**
         * sendData() - отправляет post-запрос на страницу /documents
         * Принимает данные токена
         */
        sendData() {
            let data = { page: 'documents' }
            console.log('This is Documents apiUrl: ', this.apiUrl)
            axios({
                url:`${this.apiUrl}/api/user/documents`,
                withCredentials: true,
                method: 'post',
                data: data.page
            })  
                .then((resp) => {
                    if (resp.data.error) {
                        return this.$router.push('/login') 
                    }
                    console.log('Documents answer: ', resp.data)
                    // this.$store.dispatch('save_token', resp.data.id_user)
                    this.$store.dispatch('save_token', resp.data)
                })
                .then(() => {
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is Documents error: ', error)
                })
        }
    }
};

</script>

<style scoped>
.about{
    overflow: hidden;
    height: 100vh;
}
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
    justify-content: flex-start;
    max-width: 100%;
    flex-direction: row;
}
.case-box{
    max-width: 100%;
    padding: 2rem; 
    display: flex;
    justify-content: space-between;
    max-width: 80rem;

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
.svg{
    max-width: 5rem;
    transition: all 0.3s;
}

</style>
