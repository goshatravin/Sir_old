<template>
    <div class="about">
        <header>
            <navigation /> <!-- модуль навигации -->
            <main>
                <topPanel title="Чат" /> <!-- верхняя панель пользователя -->
                <div class="components-box">
                    <chat />
                </div>
            </main>
        </header>
    </div>
</template>

<script>
import axios from 'axios'
import navigation from '../components/navigation.vue'
import topPanel from '../components/topPanel.vue'
import chat from '../components/chat.vue'

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl, // Ссылка на URL сервера NodeJS
            socket: this.$store.getters.socketUrl,
            userId: this.$store.getters.userId,
        }
    },
    components: {
        navigation,
        topPanel,
        chat
    },
    
}
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