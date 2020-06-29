<template>
    <div class="container">
        <div class="container__form">
            <div class="container__title">
                <div class="title__text">
                    <p></p>
                </div>
            </div>
            <div class="container__body">
                <div class="body__text">
                    <div class="body__wrap">
                            <p>Введите данные</p>
                    </div>
                </div>
                <form @submit.prevent="sendData" class="body__from">
                    <p class="from__text">Введите номер полиса (ID договора)</p>
                    <input type="text" class="form__input" v-model="policyNumber"  placeholder="3300xx-x">

                    <p class="from__text">Введите ФИО застрахованного</p>
                    <input type="text" class="form__input" v-model="insuredName"  placeholder="SMIRNOV">

                    <p class="from__text">Введите дату рождения застрахованного</p>
                    <input type="date" class="form__input" v-model="insuredDate"  placeholder="01/08/2019">

                    <p class="from__text">Введите дату поиска полиса</p>
                    <input type="date" class="form__input" v-model="policyDate"  placeholder="xx/xx/xxxx">

                    <div class='loader'>
                    <ClipLoader class="custom-class" :loading="loading" color='#0892d0' :size='5' sizeUnit='1px' />
                    <input type="submit" class="form__btn" v-if="btnVisible" value="Отправить запрос">
                    </div>
                </form>
            </div>
            <div class="lol" v-for="(data,index) in error" :key="index">
                        {{data.text_status}}
            </div>
            
        </div>
        <div class="container__output_short">
            <div class="output__box_short" v-for="(data,index) in risk" :key="index">
                <div class="output__title_short">
                    <p class="output__text_short">Тип Продукта</p>
                </div>
                <div class="output__data_short">
                    <p class="output__text_short">{{data.name_directory}}</p>
                </div>
            </div>
        </div>
        <div class="container__output">
            <div class="output__box" v-for="(data, index) in outPut" :key="index">
            <!-- <div class="output__box"> -->
                <div class="output__title">
                    <p class="output__text">Полис</p>
                    <p class="output__text">ФИО</p>
                    <p class="output__text">Дата рождения</p>
                    <p class="output__text">Начало поездки</p>
                    <p class="output__text">Конец поездки</p>
                    <p class="output__text">Количество дней</p>
                </div>
                <div class="output__data">
                    <p class="output__text">{{data.policy_id}}</p>
                    <p class="output__text">{{data.fullname}}</p>
                    <p class="output__text">{{data.dob}}</p>
                    <p class="output__text">{{data.date_beg}}</p>
                    <p class="output__text">{{data.date_end}}</p>
                    <p class="output__text">{{data.duration}}</p>
                </div>
                <div class="output__additional-data hidden" :name="index">
                    <p class="output__aditional-text">Дата оформления полиса - <span class="output__aditional-text_span">{{data.date_of_issue}}</span></p>
                    <p class="output__aditional-text">Страхователь - <span class="output__aditional-text_span">{{data.insurer}}</span></p>
                    <p class="output__aditional-text">Наименование основного риска - <span class="output__aditional-text_span">
                        {{data.ins_med_program}}, 
                        {{data.ins_bag_program}}, 
                        {{data.ins_civliab_program}}, 
                        {{data.ins_accident_program}}, 
                        {{data.ins_legal_help_program}}, 
                        {{data.ins_tech_assist_on_road_program}}, 
                        {{data.ins_primary_med_accident_program}}, 
                        {{data.ins_primary_med_emergency_program}},
                        {{data.ins_specialized_med_emergency_program}},
                        {{data.ins_stom_program}},
                        {{data.ins_postmortem_repatriation_program}},
                        {{data.ins_cancel_program}},
                        {{data.ins_primary_specialized_med_emergency_program}}
                        </span></p>
                    <p class="output__aditional-text">Валюта - <span class="output__aditional-text_span">{{data.currency}}</span></p>
                    <p class="output__aditional-text">VIP клиент - <span class="output__aditional-text_span">{{data.vip}}</span></p>
                    <p class="output__aditional-text">Мобильный телефон страхователя - <span class="output__aditional-text_span">{{data.phone_number}}</span></p>
                    <p class="output__aditional-text">Страховая сумма - <span class="output__aditional-text_span">
                        {{data.ins_med_sum}}, 
                        {{data.ins_bag_sum}}, 
                        {{data.ins_civliab_sum}},
                        {{data.ins_accident_sum}}, 
                        {{data.ins_legal_help_sum}}, 
                        {{data.ins_tech_assist_on_road_sum}}, 
                        {{data.ins_primary_med_accident_sum}}, 
                        {{data.ins_primary_med_emergency_sum}},
                        {{data.ins_specialized_med_emergency_sum}},
                        {{data.ins_stom_sum}},
                        {{data.ins_postmortem_repatriation_sum}},
                        {{data.ins_cancel_sum}},
                        {{data.ins_primary_specialized_med_emergency_sum}}
                        </span></p>
                    <p class="output__aditional-text">Валюта страховой суммы - <span class="output__aditional-text_span">
                        {{data.ins_med_sum_currency_code}}, 
                        {{data.ins_bag_sum_currency_code}}, 
                        {{data.ins_civliab_sum_currency_code}}, 
                        {{data.ins_accident_sum_currency_code}}, 
                        {{data.ins_legal_help_sum_currency_code}}, 
                        {{data.ins_tech_assist_on_road_sum_currency_code}},
                        {{data.ins_primary_med_accident_sum_currency_code}}, 
                        {{data.ins_primary_med_emergency_sum_currency_code}},
                        {{data.ins_specialized_med_emergency_sum_currency_code}},
                        {{data.ins_stom_sum_currency_code}},
                        {{data.ins_postmortem_repatriation_sum_currency_code}},
                        {{data.ins_cancel_sum_currency_code}},
                        {{data.ins_primary_specialized_med_emergency_sum_currency_code}}
                        </span></p>
                    <p class="output__aditional-text">Франшиза по риску - <span class="output__aditional-text_span">
                        {{data.ins_med_deduct}}, 
                        {{data.ins_bag_deduct}}, 
                        {{data.ins_civliab_deduct}}, 
                        {{data.ins_accident_deduct}}, 
                        {{data.ins_legal_help_deduct}}, 
                        {{data.ins_tech_assist_on_road_deduct}},
                        {{data.ins_primary_med_accident_deduct}},
                        {{data.ins_primary_med_emergency_deduct}},
                        {{data.ins_specialized_med_emergency_deduct}},
                        {{data.ins_stom_deduct}},
                        {{data.ins_postmortem_repatriation_deduct}},
                        {{data.ins_cancel_deduct}},
                        {{data.ins_primary_specialized_med_emergency_deduct}}
                        </span></p>
                    <p class="output__aditional-text">Валюта франшизы- <span class="output__aditional-text_span">
                        {{data.ins_med_deduct_currency_code}}, 
                        {{data.ins_bag_deduct_currency_code}}, 
                        {{data.ins_civliab_deduct_currency_code}}, 
                        {{data.ins_accident_deduct_currency_code}}, 
                        {{data.ins_legal_help_deduct_currency_code}}, 
                        {{data.ins_tech_assist_on_road_deduct_currency_code}},
                        {{data.ins_primary_med_accident_deduct_currency_code}},
                        {{data.ins_primary_med_emergency_deduct_currency_code}},
                        {{data.ins_specialized_med_emergency_deduct_currency_code}},
                        {{data.ins_stom_deduct_currency_code}},
                        {{data.ins_postmortem_repatriation_deduct_currency_code}},
                        {{data.ins_cancel_deduct_currency_code}},
                        {{data.ins_primary_specialized_med_emergency_deduct_currency_code}}
                        </span></p>
                    <p class="output__aditional-text">Территория страхования - <span class="output__aditional-text_span">{{data.territory}}</span></p>
                    <p class="output__aditional-text">Дополнительные риски - <span class="output__aditional-text_span">{{data.ins_special_condition}}</span></p>
                    <p class="output__aditional-text">Статус полиса (В-выпущен; С-оформление; А-аннулирован; Д-прекращён страхователем; Щ-прекращён страховщиком) - <span class="output__aditional-text_span">{{data.status}}</span></p>
                </div>
                <div class="output__btn">
                    <input class="btn__item btn__item_more" :id="index"  v-on:click="toggleOpen" type="submit" value="Подробнее">
                    <input class="btn__item btn__item_save" :name="index"  v-on:click="toggleSave" type="submit" value="Записать">
                    <!-- <div class='loaderSave' >
                    <ClipLoader class="custom-class"   color='#0892d0' :size='3' sizeUnit='1px' />
                    </div> -->
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
            id_user: this.$store.state.token.id_user,
            apiUrl: this.$store.getters.apiUrl,
            policyNumber: '',
            insuredName: '',
            insuredDate: '',
            policyDate: '',
            outPut: [],
            loading: false,
            btnVisible: true,
            error: '',
            risk: [], // Риски
        };
    },
    methods: {
        /**
         * sendData() - отправляет post-запрос на страницу /api/ingos/getIngos
         * Принимает данные по договору страхования
         */
        sendData(){
            const data = {
                "policyNumber": this.policyNumber.trim(),
                "insuredName": this.insuredName.trim(),
                "insuredDate": this.insuredDate.trim(),
                "policyDate": this.policyDate.trim(),
            }
            this.error = ''
            this.outPut = ''
            this.loading = true
            this.btnVisible = false
            axios({
                url: `${this.apiUrl}/api/ingos/riskreturn`,
                withCredentials: true,
                method: 'POST',
                data: data
            })
                .then((resp) => {
                    console.log('This is ingos resp.data: ', resp)
                    this.risk = resp.data
                })
            axios({
                url: `${this.apiUrl}/api/ingos/getIngos`,
                withCredentials: true,
                method: 'POST',
                data: data
            })
                .then((resp) => {
                    console.log(resp)
                    // console.log(Object.values(resp)[0].error)
                    if(Object.values(resp)[0].error){
                        this.error = resp.data
                        this.loading = false
                        this.btnVisible = true
                    }
                    else{
                        console.log('This is ingos respData: ', resp.data)
                        this.outPut = resp.data
                        this.loading = false
                        this.btnVisible = true
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.btnVisible = true
                    this.loading = false
                })
        },
        toggleOpen(e,target){
            if([...document.getElementsByName(e.target.id)][0].classList.contains('hidden')){
                [...document.getElementsByName(e.target.id)][0].classList.remove('hidden')
            }else{
                [...document.getElementsByName(e.target.id)][0].classList.add('hidden')
            }
        },
        /**
         * sendData() - отправляет данные договора страхования на сервер, 
         * после чего данные заносятся в БД fregat.t_bordero_detail
         * Принимает от сервера ответ, что данные внесены
         */
        // TODO: id_user отрабатывает только, если в него писать геттерс напрямую.
        // Запись формата id_user: this.id_user не отрабатывает. Необходимо понять, почему.
        toggleSave(e,target){
            console.log(this.outPut[e.target.name])
            axios({
                url: `${this.apiUrl}/api/ingos/policy`,
                method: 'POST',
                withCredentials: true,
                data: {
                    policy: this.outPut[e.target.name],
                    id_user: this.$store.getters.userId
                }
            })
                .then((resp) => {
                    console.log(resp)
                    e.target.value = "ГОТОВО"
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
}
</script>
<style scoped>
.compleat{
    background: var(--gren);
}
.lol{
    background: var(--red);
    padding: 2rem  1rem;
    margin: 1.2rem;
    color: white;
    border-radius: 0.3rem;
    position: relative;
}
.lol:after{
    content: '!';
    right: -0.5rem;
    position: absolute;
    top: -2rem;
    font-size: 2.5rem;
    color: var(--black);
    background:  white;
    border-radius: 50px;
    padding: 0 1.1rem;
    border: 2px solid var(--normalgrey);
}
.container{
    display: flex;
}
.container__form{
    box-shadow: var(--boxShadow);
    width: 450px;
    height: 760px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 5px;
}
.container__title{
    height: 3rem;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
    width: 100%;
}
.container__body{
    background: var(--white);
}
.body__text{
    text-align: center;
}
.body__wrap{
    padding: 3rem 0;
}
.body__from{
    display: flex;
    flex-direction: column;
}
.form__input{
    width: 19rem;
    margin-bottom: 20px; 
    padding: 0.4rem;
    background: none;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 4px;
    white-space: normal;
    font-size: 0.9rem;
    color: var(--black);
}
.form__btn{
    background: var(--rageblue);
    color: var(--white);
    width: 9rem;
    height: 2.5rem;
    border-radius: 3px;
    border: none;
    font-size: 0.9rem;
    margin: 3rem auto;
    cursor: pointer;
}
.from__text{
    font-size: 0.9rem;
    padding-bottom: 10px;
}
/*  */
.container__output{
    margin-left: 2rem;
    overflow: scroll;
    height: 85vh;
    width: 55rem;
}
.container__output_short{
    margin-left: 2rem;
    overflow: scroll;
    width: 20rem;
}
.output__box{
    background: var(--white);
    margin-bottom: 4rem;
    border-radius: 5px;
    box-shadow: var(--boxShadow);
    /* height: 10rem; */
}
.output__box_short{
    background: var(--white);
    margin-bottom: 4rem;
    border-radius: 5px;
    box-shadow: var(--boxShadow);
    /* height: 10rem; */
}
.output__title{
    height: 3rem;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
    display: grid;
    grid-template-columns:  7rem 9rem 9rem 9rem 9rem 9rem;
}
.output__title_short{
    height: 3rem;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
    display: grid;
    grid-template-columns:  7rem 9rem 9rem 9rem 9rem 9rem;
}
.output__text{
    font-size: 0.9rem;
}
.output__text_short{
    font-size: 0.9rem;
}
.output__data{
    padding-left: var(--paddingleft);
    display: grid;
    grid-template-columns:  7rem 9rem 9rem 9rem 9rem 9rem;
    padding-top: 1.5rem;
    margin-bottom: 1rem;
}
.output__data_short{
    padding-left: var(--paddingleft);
    display: grid;
    grid-template-columns:  7rem 9rem 9rem 9rem 9rem 9rem;
    padding-top: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
}
.output__btn{
    display: flex;
    justify-content: center;
}
.btn__item{
    width: 7rem;
    height: 2rem;
    border-radius: 3px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    margin-bottom: 2.0rem;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-left: 1rem;
}
.btn__item_more{
    background: #426E9A;
    color: white;
}
.btn__item_save{
    background: #0892D0;
    color: white;
}
.output__additional-data{
    background: #426E9A;
    margin: 0 2rem;
    padding: 1.5rem;
}
.output__aditional-text{
    color: var(--white);
    padding-bottom: 0.5rem;
}
.output__aditional-text_span{
    border-bottom: 1px solid white;
}
.hidden{
    display: none;
}
.loader{
    margin: 0rem auto;
    height: 6rem;
    display: flex;
    align-items: center;
    /* border: 1px solid black; */
}
.loaderSave{
    padding-top: 1rem;
    padding-bottom: 1.9rem;
}
</style>


