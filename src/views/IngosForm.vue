<template>
    <div class="about">
        <header>
        <!-- <navigation /> --> <!-- модуль навигации -->
        <main>
            <!-- <topPanel title="Форма Ингосстрах" /> --> <!-- верхняя панель пользователя -->
            <div class="components-box">
            <div class="ingos__block">
            <ingos />
            </div>
            <!-- <expressBar /> -->
            </div>
        </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios'
// import navigation from '../components/navigation.vue';
// import topPanel from '../components/topPanel.vue';
// import expressBar from '../components/expressBar.vue'
import ingos from '../components/ingos.vue'

export default {
    created () {
            document.title = "Ингосстрах";
    },
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl, // Ссылка на URL сервера NodeJS
            socket: this.$store.getters.socketUrl, // Ссылка на URL сервера веб-сокетов       

        }
    },
    components: {
        // navigation,
        // topPanel,
        // expressBar,
        ingos,
    },
    mounted() {
        this.sendData()
    },
    methods: {
        sendData() {
            let data = { page: 'ingos' }
            console.log('This is Ingos apiUrl: ', this.apiUrl)
            axios({
                url: `${this.apiUrl}/api/user/ingosform`,
                withCredentials: true,
                method: 'post',
                data: data
            })  
            .then((resp) => {
                    console.log('Ingos_form answer: ', resp.data)
                    if (resp.data.error) {
                        this.$router.push('/login') 
                    }
                    this.$store.dispatch('save_token', resp.data)
                })
                .catch((error) => {
                    console.log('This is Ingos_form error: ', error)
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