<template>
    <div class="container">
        <div class="container__title">
            <p class="title__text">Журнал изменений проекта</p>
        </div>
        <div class="container__info">
            <div class="info__block" v-for="(item,index) in log" :key="index">
                <div class="info__marker">
                    <div class="marker__box" :name="item.task_type" :class="{'active_blue': item.task_type ==='Задача', 'active_red': item.task_type ==='Баг'}">
                        <div class="market__box_insider" :name="item.task_type" :class="{'active_blue_insider': item.task_type ==='Задача', 'active_red_insider': item.task_type ==='Баг'}"></div>
                    </div>
                </div>
                <div class="info__text">
                    <p class="info__module info__module_padding"><span class="info__module_bold">Модуль</span> - {{item.module_name}}</p>
                    <p class="info__version info__module_padding"><span class="info__module_bold">Версия</span> - {{item.app_version}}</p>
                    <p class="info__task info__module_padding"><span class="info__module_bold">Задача</span> - {{item.issue_num}}</p>
                    <p class="info__description">{{item.done_work_description}}</p>
                </div>
            </div>
                
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl ,// Ссылка на URL сервера NodeJS
            log:[]

        }
    },
    created() {
        this.sendData()
    },
    methods: {
            sendData() {
                console.log('This is About apiUrl: ', this.apiUrl)
                const data = { page: 'aboutversion'}
                axios({
                    url: `${this.apiUrl}/api/user/about`,
                    withCredentials: true,
                    method: 'POST',
                    data: data
                })  
                    .then((resp) => {
                        console.log('About answer: ', resp.data)
                        this.log = resp.data.aboutInfo.reverse();
                        console.log(this.log)
                        // document.getElementsByName('Задача').forEach(element => {
                        //     element.classList.add('status_blue')
                        // });
                        // console.log(document.getElementsByName('Задача'))
                        this.log = resp.data.aboutInfo
                        console.log('About answer log: ', this.log)
                        if (resp.data.error) {
                            return this.$router.push('/login') 
                        }
                        console.log('About answer: ', resp.data)
                        // Запись токена в store.js
                        this.$store.dispatch('save_token', resp.data.user)
                    })
                    .catch((error) => {
                        console.log('This is About error: ', error)
                    })
            }
        }
};

</script>

<style scoped>
.container{
    width: 30rem;
    height: 45rem;
    background: var(--white);
    border-radius: 1rem;
    padding: 3.125rem ;
    box-shadow: var(--boxShadow)
}
.container__title{
    margin-bottom: 3rem;
}
.title__text{
    font-weight: 500;
}
.container__info{
    overflow: scroll;
    height: 85%;
}
.info__block{
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
}
.info__marker{
    padding-left: 0.4rem;
}
.info__description{
    padding-top: 0.5rem;
}
.marker__box{
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.market__box_insider{
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 1rem;
    
    
}
.active_blue{
    background: var(--blue);
    animation: pulse_blue 2s infinite;
}
.active_red{
    background: #FAB5A5;
    animation: pulse_red 2s infinite;
    
}
.active_red_insider{
    background: var(--red)
}
.active_blue_insider{
    background: var(--rageblue);
}
.info__module_bold{
    font-weight: 500;
}
.info__module_padding{
    padding-bottom: 0.4rem;
}
@keyframes pulse_blue {
    0% {
        -moz-box-shadow: 0 0 0 0 rgba(184, 218, 250, 0.52);
        box-shadow: 0 0 0 0 rgba(184, 218, 250, 0.52);
    }
    70% {
        -moz-box-shadow: 0 0 0 7px rgba(184, 218, 250, 0.52);
        box-shadow: 0 0 0 7px  rgba(184, 218, 250, 0.52);
    }
    100% {
        -moz-box-shadow: 0 0 0 0  rgba(184, 218, 250, 0.52);
        box-shadow: 0 0 0 0  rgba(184, 218, 250, 0.52);
    }
}
@keyframes pulse_red {
    0% {
        -moz-box-shadow: 0 0 0 0 var(--lightred);
        box-shadow: 0 0 0 0 var(--lightred);
    }
    70% {
        -moz-box-shadow: 0 0 0 7px var(--lightred);
        box-shadow: 0 0 0 7px  var(--lightred);
    }
    100% {
        -moz-box-shadow: 0 0 0 0  var(--lightred);
        box-shadow: 0 0 0 0 var(--lightred);
    }
}
/* .idCard-title {
    border-bottom: 1px solid var(--grey);
    height: 3rem;
    display: flex;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
}

.sV {
    margin-bottom: 1rem;
    text-align: center;
    text-transform: uppercase;
    font-weight: 200;
    color: var(--rageblue);
}
.module{
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: center;
    color: var(--black);
    font-weight: 500;

}
.status{
    text-align: center;
    padding-top: 1rem;
    font-weight: 100;
}
.status--new{
    color: var(--rageblue);
}
.status--bugfix{
    color: var(--red);
}
.idCard {
    background: white;
    width: 30rem;
    box-shadow: var(--boxShadow);
}
.item--span{
    font-weight: 700;
}
.item--feature{
    color: var(--rageblue);
}
.item--bugfix{
    color: var(--red);
}
.about-version {
    margin: 1rem auto;
}

.about-version_list-item {
    padding-bottom: 1rem;
    padding-right: 0.1rem;
    text-align: left;
}

.personal-info_img {
    max-width: 6rem;
    margin: 1rem auto;
}

.personal-info {
    display: flex;
    justify-content: space-around;
    padding: 3rem var(--paddingleft);
    flex-direction: column;
}
.about-version_list{
    height: 30rem;
    overflow: scroll;
} */
</style>
