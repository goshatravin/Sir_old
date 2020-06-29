<template>
    <div class="wrap-part" v-if="this.$store.state.dinerBlockpin">
        <div class="wrap" />
        <div class="wrap-box">
            <div class="login-box-text">
                <p class="login-box__item"> Введите 4-значный пин-код</p>
            </div>
            <div class="warp-box_form">
                <input class="input_text" @input="pinCheck" maxlength="4" minlength="4" type="password">
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
            datainfo: [], // массив для проверки пинкода
            token: this.$store.getters.token // TODO: не используется. Зачем здесь?
        };
    },
    methods: {
        /**
         * pinCheck() - Проверяет пинкод на совпадения записывая введенные знаки в массив , 
         * если пинкод совпал снимает блокировку и меняет статус на (на месте)
         * Отправляет данные на сервер. Там происходит сверка пин-кода с пин-кодом из хранилища.
         * В случае совпадения пин-кодов, происходит разблокировка экрана.
         * @param {} type - не используется. TODO: удалить переменную, если не нужна
         * @param {String} target -  код статуса (на месте)
         */
        pinCheck({ type, target }) {
            console.log('This is awayStatus apiUrl: ', this.apiUrl)
            this.datainfo = (target.value);
            if(this.datainfo.length === 4) {
                axios({
                url: `${this.apiUrl}/api/user/pinapproved`,
                withCredentials: true,
                data: {
                    inputPin: this.datainfo,
                    idStatus: '392'
                },
                method: 'POST',
            })
                .then((resp) => {
                    if (resp.data.status === 'correct') {
                        // this.$store.commit('unblockScreen', '392')
                        this.$store.dispatch('unblockScreen', 392)
                    }
                    console.log('This is awayStatus response: ', resp);
                });
            }
        },
        pinStatus() {
            console.log('awayStatus')
        }
    },
};

</script>

<style scoped>
.wrap {
    position: absolute;
    height: 100vh;
    width: 100%;
    background: var(--lightgrey);
    opacity: 0.7;
    z-index: 1000;
    filter: blur(1px);
}
.warp-box_form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.login-box-text {
    background: var(--blue);
    border-radius: 5px 5px 0px 0px;
    padding: 1rem 2rem;
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

</style>
