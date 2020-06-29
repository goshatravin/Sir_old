<template>
    <div class="idCard">
        <div class="idCard-title">
            <p>Смена пинкода</p>
        </div>
        <div class="idCard-wrapper" v-if="cardWrap">
            <p class="idCard-wrapper-text">
                Успешно!
            </p>
        </div>
        <div class="personal-info">
            <div>
                <div
                    class="form-group personal-info_change-pin"
                    :class="{ 'form-group--error': $v.password.$error }"
                    >
                    <label class="personal-info_text">Введите ваш новый пинкод</label>
                    <input
                    class="form__input personal-info_input"
                    placeholder="Пинкод"
                    maxlength="4"
                    minlength="4"
                    v-model.trim="$v.password.$model" 
                >
                </div>
                <div
                    class="form-group"
                    :class="{ 'form-group--error': $v.repeatPassword.$error }"
                    >
                    <input
                    class="form__input personal-info_input"
                    maxlength="4"
                    minlength="4"
                    placeholder="Повторите пинкод"
                    v-model.trim="$v.repeatPassword.$model" 
                >
                </div>
                <div
                    class="error"
                    v-if="!$v.repeatPassword.sameAsPassword"
                    />
                    <!-- <tree-view :data="$v" :options="{rootObjectKey: '$v', maxDepth: 2}"></tree-view> -->
                    <transition name="slide-fade">
                    <input
                    class="personal-info_btn"
                    v-if="$v.repeatPassword.sameAsPassword && this.password !='' && this.password.length > 3"
                    type="submit"
                    value="Отправить"
                    @click="changePas"
                >
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {
    required, sameAs, minLength, maxLength,
} from 'vuelidate/lib/validators'; // Бибилотека для проверки пароль в смене пинкода

export default {
    /**
     * @param {Array}  a  массив
     * @param {String} userId - id пользователя
     * @param {String} update - строка для базы данных показывающая обновление пинкода
     * @param {String} cardWrap - заглушка при успешной смены пароля
     */
    data() {
        return {
            a: [],
            apiUrl: this.$store.getters.apiUrl,
            userId: this.$store.getters.userId,
            // passwords: false,
            update: 'update',
            password: '', // пароль для плагина
            repeatPassword: '', // пароль для плагина
            cardWrap: false,
        };
    },
    components:{
    },
    validations: {
        password: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(5),
        },
        repeatPassword: {
            sameAsPassword: sameAs('password'),
        },
    },
    methods: {
        validate() {
            console.log(this.password.value === this.password2.value);
        },
        /**
         * changePas() - обращается к серверу и записывает новый пин-код пользователя в БД.
         * Ф-ия sirius.f_change_user_pincode. Данные можно посмотреть в таблице fregat.t_user
         */
        changePas(e) {
            let apiUrl = this.$store.getters.apiUrl
            console.log('This is userPin apiUrl: ', apiUrl)
            // console.log('This is userPin userId : ', this.$store.state.token.id_user)
            // console.log('This is userPin userId : ', this.$store.getters.userId)
            // TODO: Не отрабатывает обращение к this.userId. Необходимо обращаться только через геттерс.
            // Почему?
            axios({
                url: `${this.apiUrl}/api/user/changepincode`,
                withCredentials: true,
                data: {
                    sql_state: this.update,
                    id_user: this.$store.getters.userId,
                    pin_code: this.password
                },
                method: 'POST',
            })
                .then((response) => {
                    this.cardWrap = true;
                    this.$store.commit('pin_change', this.password);
                });
        },
    },
};

</script>

<style scoped>
.personal-info_text {
    padding-bottom: 0.5rem;
}
.idCard-title {
    border-bottom: 1px solid var(--grey);
    height: 3rem;
    display: flex;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
}
.idCard-wrapper {
    height: 84%;
    width: 100%;
    background: var(--white);
    position: absolute;
    opacity: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 1rem;
    color: var(--white);
}
.idCard-wrapper-text {
    color: var(--black);
}
.idCard {
    background: white;
    width: 20rem;
    box-shadow: var(--boxShadow);
    height: 18rem;
    position: relative;
    top: 0;
}
.personal-info {
    display: flex;
    justify-content: space-around;
    padding: 3rem var(--paddingleft);
    text-align: center;
}
.personal-info_change-pin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.personal-info_input {
    width: 9rem;
    margin: 0.5rem 0;
    padding: 0.4rem;
    background: none;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 4px;
    white-space: normal;
    font-size: 0.8rem;
    color: var(--black);
}
.personal-info_btn {
    background: var(--rageblue);
    color: var(--white);
    width: 5.5rem;
    height: 2rem;
    border-radius: 0.3125rem;
    border: none;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}
.slide-fade-enter-active {
    transition: all .3s ease;
}
.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}
</style>
