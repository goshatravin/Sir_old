<template>
    <div class="input_task">
        <div class="input_task-title">
            <p>События</p>
        </div>
        <div class="out-box">
            <div class="history">
                {{ question['History'] }}
            </div>
            <div class="med__wrap">
                <div class="med__additional" v-if="showMed" @click="medHide =!medHide">
                    <p class="addit__text"> История медицинского блока </p>
                    <div class="plus" />
                </div>
                <transition name="fade">
                    <div class="med__box" id="med__box" v-if="medHide">
                        <div class="med__done" v-for="done in q_answer" :key="done.question_text" >
                            <div class="done__text">
                                {{ done.question_text }}
                            </div> 
                            <div class="done__answer">
                                {{ done.q_answer }}
                            </div> 
                        </div>
                        <div class="med__question" v-for="item in question['Question']" :key="item.id_question">
                            <p class="med__id hide">
                                {{ item.id_question }}
                            </p>  
                            <p class="med__text">
                                {{ item.question_text }}
                            </p>
                            <div class="med__warp">
                                <div class="med__answer" :id="answer.id_answer" @click="sendQuestion(item.id_question,answer.id_answer,item.question_text,answer.option)" v-for="answer in item.question_answer" :key="answer.id_answer">
                                    <p class="answer__id hide">
                                        {{ answer.id_answer }}
                                    </p>
                                    <p class="answer__option">
                                        {{ answer.option }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <div v-for="item in hint['Basic']" :key="item.a" class="basic">
                <div class="hintBasic">
                    <div class="hintBasicHead">
                        <span class="hintone">{{ item.number }}.</span> <span class="hinttwo">
                            {{ item.hint_body }}
                        </span>
                    </div>
                    <div class="hintBasicBody" />
                </div>
            </div>

            <div v-for="item in hint['Situation']" :key="item.a" class="situation">
                <div class="situation-title">
                    <div class="situation-id">
                        {{ item.id_situation }}
                    </div>
                    <div class="situation-name">
                        {{ item.name_situation }}
                    </div> 
                </div>

                <div class="about hide ">
                    <div class="situation-script">
                        <div class="script-box">
                            {{ item.script_situation }}
                        </div>
                    </div>  
                    <div class="dat" v-for="data in item.items_situation" :key="data.key">
                        {{ data.doc_valid_through }}
                        {{ data.document_type }}
                        {{ data.item_nr_full }}
                        {{ data.item_text }}
                    </div>
                </div>
                <div class="situation-btn-box">
                    <input class="situation-btn" type="submit" value="Подробнее" @click="hide">
                </div>
            </div>
            <!-- Внесение изменений, 18.09.2019, Пастушенко П.Б. -->
            <!-- Парсинг подсказок по полю (например если введен Тур.оператор) -->
            <div v-for="item in hint['Field']" :key="item.a" class="situation">
                <div class="situation-title">
                    <div class="situation-id">
                        {{ item.id_situation }}
                    </div>
                    <div class="situation-name">
                        {{ item.name_situation }}
                    </div> 
                </div>
                
                <div class="about hide ">
                    <div class="situation-script">
                        <div class="script-box">
                            {{ item.script_situation }}
                        </div>
                    </div>  
                    <div class="dat" v-for="data in item.items_situation" :key="data.key">
                        {{ data.doc_valid_through }}
                        {{ data.document_type }}
                        {{ data.item_nr_full }}
                        {{ data.item_text }}
                    </div>
                </div>
                <div class="situation-btn-box">
                    <input class="situation-btn" type="submit" value="Подробнее" @click="hide">
                </div>
            </div>
            <!-- Парсинг подсказок по значению (например если введено основание для пребывания за границей) -->
            <div v-for="item in hint['Value']" :key="item.a" class="situation">
                <div class="situation-title">
                    <div class="situation-id">
                        {{ item.id_situation }}
                    </div>
                    <div class="situation-name">
                        {{ item.name_situation }}
                    </div> 
                </div>
                
                <div class="about hide ">
                    <div class="situation-script">
                        <div class="script-box">
                            {{ item.script_situation }}
                        </div>
                    </div>  
                    <div class="dat" v-for="data in item.items_situation" :key="data.key">
                        {{ data.doc_valid_through }}
                        {{ data.document_type }}
                        {{ data.item_nr_full }}
                        {{ data.item_text }}
                    </div>
                </div>
                <div class="situation-btn-box">
                    <input class="situation-btn" type="submit" value="Подробнее" @click="hide">
                </div>
            </div>
            <!-- Внесение изменений, 18.09.2019, Пастушенко П.Б. -->
            <div class="bordero">
                <div class="bordero-message">
                    {{ borderoMessage }} 
                </div>
                <div v-for="items in bordero" :key="items.a" class="bordero-list" @click="addBordero">
                    <div class="bordero-list-text">
                        <div class="bordero-list_item">
                            {{ items.fullname_insured }}
                        </div>
                        <div class="bordero-list_item">
                            {{ items.policy_number }}
                        </div>
                        <div class="bordero-list_item">
                            {{ items.date_beg }}  -  {{ items.date_end }}
                        </div>
                        <div style="display:none" class="jsonItems">
                            {{ items }}
                        </div>
                    </div>
                    <div class="bordero-use" /> 
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
            EVENT_LIST: this.$root._data.EVENT_LIST,
            // TODO: Не работает обращение к переменной через this.
            // Пашиму?
            // apiUrl: this.$store.getters.apiUrl,
            hint: {},
            destroyComponent: true, // уничтожение компонента в момент выхода из дела (изменение)
            borderoMessage: '',
            bordero: [],
            list: false,
            question: [],
            q_answer:[],
            medHide: true,
            showMed: false,
        };
    },
    mounted() {
        const vm = this;
        const apiUrl = this.$store.getters.apiUrl
        // this.$root.$on(this.EVENT_LIST.DESTROY, (arr) => {
        //     this.destroyComponent = arr;
        // })
        this.$root.$on(this.EVENT_LIST.SHOW_QUESTION, (arr) => {
            this.q_answer = arr
            vm.medHide = false;
            vm.showMed = true;
        })
        this.$root.$on(this.EVENT_LIST.HITS_BASIC, (arr) => {
            console.info('Пришли данные HITS_BASIC', arr)
            vm.$set(vm.hint, 'Basic', arr);
        })

        this.$root.$on(this.EVENT_LIST.HITS_SITUATION, (arr) => {
            console.info('Пришли данные HITS_SITUATION', arr)
            vm.$set(vm.hint, 'Situation', arr);
        })
        this.$root.$on(this.EVENT_LIST.HITS_FIELD, (arr) => {
            console.info('Пришли данные HITS_FIELD', arr)
            vm.$set(vm.hint, 'Field', arr);
        })

        this.$root.$on(this.EVENT_LIST.HITS_VALUE, (arr) => {
            console.info('Пришли данные HITS_VALUE', arr)
            vm.$set(vm.hint, 'Value', arr);
        })
        this.$root.$on(this.EVENT_LIST.LOAD_BORDERO, function (arr) {
            console.info('Пришли данные LOAD_BORDERO', arr)
            vm.borderoMessage = arr.message
            vm.bordero = arr.bordero
        })
        this.$root.$on(this.EVENT_LIST.MED_QUESTIONS, function(arr){
            console.info('Пришли симптомы для получение уточняющих вопросов: ', arr)
            axios({
                url: `${apiUrl}/api/directory/question`,
                withCredentials: true,
                data: {
                    data: arr 
                },
                method: 'POST',
            })
                .then(resp =>{
                    console.info('Пришли уточняющие вопросы', resp)
                    vm.medHide = true
                    if(resp.data == null && arr.simptoms.length != 0 ){
                        console.log(vm.medHide);
                        vm.medHide = false;
                        vm.showMed = true;
                    }
                    else if(arr.simptoms.length === 0){
                        vm.$set(vm.question, 'Question', []); // Очищаем блок с медецинскими вопросами
                        vm.q_answer = []  // Очищаем историю медецинских вопросов
                        vm.showMed = false; // Закрываем панельку с историей медецинских вопросов 
                    }
                    // пишем вопросы в масив с индексом  Question
                    vm.$set(vm.question, 'Question', resp.data);
                }).catch((err) => {
                    console.error('Ошибка при получении уточняющих вопросов /api/directory/question', err)
                })
        })
    },
    methods: {
        // this.setDataShadowDom('age', parseInt(diffDays/365))
        addBordero(e,target){
            let itemJson = [];
            const parent = e.target.parentNode;
            console.log(parent)
            if(e.target.parentNode.className  == 'bordero-list-text'){
                // console.log(parent.childNodes[3])
                itemJson = parent.childNodes[3]
                // console.log(itemJson)
            }
            var jsonItem = JSON.parse(itemJson.textContent)
            console.log('events.vue jsonItem: ', jsonItem)
            for (var key in jsonItem){
                // console.log(jsonItem[key])
                if(jsonItem[key] != null){
                    this.$root.$emit(this.EVENT_LIST.SET_BORDERO_TO_SHADOW_DOM, {
                        fild:key,
                        value: jsonItem[key]
                    });
                }
                    
            }
        },
        hide(e,target){
            e.target.parentNode.parentNode.childNodes[1].classList.toggle('hide');
            // console.log(e.target.parentNode.parentNode.childNodes[2].className)
        },
        sendQuestion(question,answer,text,options){
            // console.log(question+' '+answer)
            var quest_arr = {
                id_question: question,
                id_answer: answer,
                question_text: text,
                q_answer: options

            }
            console.log('куда закидываем',this.q_answer)
            console.log('Обьект с вопросом',quest_arr)
            // пушим id вопроса и id ответа 
            this.q_answer.push(quest_arr)
            // отправляем то что выбрали обратно в addNew
            this.$root.$emit(this.EVENT_LIST.MED_SET_QUESTIONS_ANSWER, this.q_answer);
            this.question['Question'] = [];
            // console.log(this.question['History'])
            // if(typeof(this.question['History']) == 'undefined'){
            //     console.log("31231")
            //     this.question['History'] = quest_arr;
            // }else{
            //     console.log("else")
            //     console.log(typeof(this.question['History']))
            //     this.question['History'].push(quest_arr);
            // }
            // console.log(document.getElementById('med__box'));
            //  if(this.question['Question'] == 'null'){
            //          this.medHide = !this.medHide;
            //          console.log(this.medHide);
            //      }
            

        }
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    * {
        box-sizing: content-box;
    }
    .hide{
        display: none;
    }
    .situation{
        overflow: hidden;
        font-size: 0.8rem;
        padding-bottom: 1rem;
        /* padding-top: 1rem; */
        /* border-bottom: 1px solid var(--grey);
        text-transform: lowercase; */
        text-align: left;
    }
    .hintSituation{
        display: flex;
        align-items: flex-start;
        text-align: left;
        flex-direction: column;

    }
    .hintSituationHead{
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
    }
    .scriptq{
        padding: 0.3rem 0;
    }

    .hintBasicHead {
        display: flex;
        padding: 0.5rem 1rem;
        align-items: center;
        border: 1px solid #EBEBEB;
        margin-bottom: 1rem;
    }
    .hinttwo {
        flex: 1;
        text-align: left;
        font-weight: 100;
        font-size: 0.8rem;
        
    }

    .hintone {
        margin-right: 1rem; 
        background: var(--red);
        border-radius: 2rem;
        padding: 0.5rem 0.7rem;
        color: var(--white);
        font-size: 0.8rem;
    }

    .hintBasicBody {
        margin-left: 5px;
    }

    .input_task-title {
        border-bottom: 1px solid var(--grey);
        height: 3rem;
        display: flex;
        align-items: center;
        padding-left: var(--paddingleft);
        background: var(--blue);
    }

    .input_task {
        background: white;
        width: 20rem;
        box-shadow: 0px 0px 10px rgba(177, 181, 193, 0.3);
        height: 85vh;
        overflow: auto;

    }

    .out-box {
        padding-left: var(--paddingleft);
        padding-top: 1rem;
        padding-right: 1rem;
    }
    /* bordero */
    .bordero{
        text-align: left;
    }
    .bordero-message{
        margin-bottom:0.5rem;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
        font-weight: 300;
        font-size: 1rem;
    }
    .bordero-list{
        margin-bottom: 1rem;
        color: var(--black);
        border-radius: 0.3rem;
        /* padding-top: 0.5rem;
        padding-bottom: 0.5rem; */
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: 1s all;
        border: 1px solid #EBEBEB;
        display: flex;
        justify-content: space-between;
    }
    .bordero-list:hover .bordero-use{
        opacity: 1;
        transition: 1s all;
    }
    .bordero-list_item{
        font-size: 0.8rem;
        padding: 0.2rem 0;
    }
    .bordero-use{
        flex-basis: 2rem;
        height: 4.9rem;
        background: var(--rageblue);
        opacity: 0.4;
        transition: 1s all;
    }
    .bordero-list-text{
        padding: 0.4rem 0;
        width: 100%;
        padding-left: var(--paddingleft);
    }
    .about{
        margin-top: 1rem;
    }
    .dat{
        padding-top: 1rem;
    }
    .situation-btn-box{
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }
    .situation-btn{
        background: var(--rageblue);
        color: var(--white);
        width: 4.5rem;
        height: 1rem;
        border-radius: 0.3rem;
        border: none;
        font-size: 0.7rem;
        cursor: pointer;
        outline: none;
        padding: 0.3rem;
        
    }
    .situation{
         border: 1px solid #EBEBEB;
         margin-bottom: 1rem;
         padding: 0.5rem 1rem;
    }
    .situation-title{
        display: flex;
        align-items: center;
        font-weight: 100;
    }
    .situation-id{
        padding: 0.5rem 0.7rem;
        background: #fcc600;
        border-radius: 2rem;
        margin-right: 1rem;
    }
    .situation-script{
        color: var(--black);
        padding-top: 1rem;
        font-weight: 600;
    }
    .med__warp{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .answer__option{
        background: var(--rageblue);
        color: var(--white);
        min-width: 6rem;
        height: 2rem;
        padding: 0 0.4rem;
        border-radius: 0.3125rem;
        border: none;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0.5rem 0;
    }
    .med__text{
        font-size: 0.9rem;
    }
    .med__done{
        margin-bottom: 2rem;
    }
    .med__done{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .done__text{
        align-self: flex-start;
        padding-bottom: 0.2rem;
        font-size: 0.8rem;
    }
    .done__answer{
        margin-top: 1rem;
        background: var(--blue);
        color: var(--white);
        min-width: 4rem;
        height: 1.5rem;
        padding: 0 0.4rem;
        border-radius: 0.3125rem;
        border: none;
        font-size: 0.65rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.5rem 0;
    }
    .done__text{
        color: var(--normalgrey);
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity .7s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
    }
    .med__additional{
        margin : 1rem 0;
        border: 1px solid #EBEBEB;
        padding: 1rem;
        font-size: 0.8rem;
        position: relative;
        cursor: pointer;
    }
    .plus{
        width: 1rem;
        height: 100%;
        background: var(--gren);
        position: absolute;
        right: 0;
        top: 0;
    }
    .addit__text{
        padding-right: 0.1rem;
    }
</style>
