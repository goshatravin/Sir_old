<template>
    <div class="idCard">
        <div class="idCard-title">
            <p>Карточка</p>
        </div>
        <div class="personal-info">
            <div class="photo-info">
                <img :src="'data:image/png;base64,' + photoToken" class="img-q" alt="">
            </div>
            <div class="text-info">
                <p class="info_text"> Имя: <span>{{ userArray.full_name }}</span> </p>
                <p class="info_text"> Должность: <span>{{ userArray.name_position }}</span> </p>
                <p class="info_text"> Дата рождения: <span>{{ userArray.dob }}</span> </p>
                <p class="info_text"> Рейтинг: <span>{{ userArray.rang }}</span> </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl,
            userArray: [],
            photoToken: this.$store.getters.photoToken || '', 
            userId: this.$store.state.token.id_user,
            passwords: false,
            update: 'update',
        };
    },
    // beforeMount(){ 
    created() { 
        /**
         * Отправляем на сервер id  пользователя в ответе получает массив с данными по пользователю
         * @param {Array} userArray - массив с данными по пользователю
         * @param {String} id_user -  id пользователя
         */
        // TODO: Не использую на сервере data, приходящий с клиента. Беру ID пользователя из локального хранилища сессии (res.locals).
        // Если возникнут проблемы с некорректным отображением данных по пользователю, поискать в этом направлении.
        axios({
            url: `${this.apiUrl}/api/user/info`,
            withCredentials: true,
            data: {
                data: this.$store.getters.userId,
            },
            method: 'POST',
        })
            .then((resp) => {
                const idCard_data = resp.data;
                this.userArray = idCard_data;
                this.photoToken = this.$store.getters.photoToken;
                console.log(idCard_data);
            });
    },
};

</script>

<style scoped>
.idCard-title {
    border-bottom: 1px solid var(--grey);
    height: 3rem;
    display: flex;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
}

.idCard {
    background: white;
    width: 30rem;
    box-shadow: var(--boxShadow);
}
.img-q {
    max-width: 8rem;
    max-height: 8rem;
    border-radius: 5rem;
    margin-right: 1rem;
}

.personal-info {
    display: flex;
    justify-content: space-around;
    padding: 3rem var(--paddingleft);
}

.info_text {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.3rem;
}

.info_text span {
    padding-left: 2rem;
    font-weight: 600;
    text-align: right;
}

</style>
