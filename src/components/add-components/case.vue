<template>
    <div class="open__case">
        <div class="input_task-title">
            <p>Редактируемая заявка</p>
        </div>
        <form class="input_task__field" >
                <input  class="select-toggle" disabled type="text"   v-model="partner" />
                <input class="select-toggle"  disabled type="text"    v-model="polic"/>
        <div v-for="(block, bl_index) in this.myField" :key="bl_index">
                <div class="block-num">
                    {{ JSON.parse(block.json_block).block_num }}.
                    {{ JSON.parse(block.json_block).block_name }}
                </div>
                <div class="pb1" v-for="(rows, row_index) in JSON.parse(block.json_field)" :key="row_index">
                    <div v-show="(!rows.row.system_name.match('_number_country_code'))">
                        <div v-if="!(!!rows.row.system_name.match('_number') && rows.row.field_type == 'number')">
                            <div class="field_code">
                                <span class="field_code_small" /> {{ rows.row.field_name }}  
                            </div>
                            <div class="field_script">
                                {{ rows.row.script }}
                            </div>
                            <div class="field_input" v-show="!rows.row.control_source">
                                <input
                                :type="rows.row.field_type"
                                :placeholder="rows.row.field_placeholder"
                                :name="rows.row.system_name" 
                                :readonly="rows.row.block"
                                :data-not_null="rows.row.not_null"
                                :data_directory="rows.row.control_source" 
                                :group="rows.row.id_group"
                                @input="throttledSave"
                                v-model="selectedData[rows.row.system_name]"
                                >
                            </div>
                            <div class="copy-box" v-show="!!rows.row.control_source">
                                <v-select
                                class="select-toggle"
                                max-height="250px"
                                label="name_directory"
                                :multiple="rows.row.multiselect"
                                :data-multiple="rows.row.multiselect"
                                :copy="rows.row.copy"
                                :placeholder="rows.row.field_placeholder"
                                :options="referenceList[rows.row.control_source]"
                                :data_directory="rows.row.control_source"
                                :name="rows.row.system_name"
                                @input="createJSON(rows.row.system_name)"
                                v-model="selectedData[rows.row.system_name]"
                                />
                            </div>  <!-- Vselect  -->
                        </div>
                        <div v-else>
                            <div class="field_code">
                                <span class="field_code_small" /> {{ rows.row.field_name }}  
                            </div>
                            <vue-tel-input 
                            placeholder="Введите номер телефона"
                            v-model="selectedData[rows.row.system_name]"
                            @onInput="onInput"
                            @input="createJSON(rows.row.system_name)"
                            v-bind="{name:rows.row.system_name, id:'cl_'+rows.row.system_name, defaultCountry: 'ru'}"
                            />
                        </div>
                    </div>
                </div>
                </div>
                </form>
                <div class="regcase-container">
                    <button class="regcase regcase_secondary" @click="backTodocuments">К списку дел</button>
                    <button class="regcase" @click="RegCase">Сохранить изменения</button>
                </div>
        </div>
</template>
<script>
import { async } from 'q';
import VueTelInput from 'vue-tel-input';
import vSelect from 'vue-select';
import Axios from 'axios';
import VueLodash from 'vue-lodash'

export default {
    components: {
        vSelect,
        VueTelInput
    },
    data() {
        return {
            partner: '',
            polic: '',
            event: '',
            EVENT_LIST: this.$root._data.EVENT_LIST, 
            TMP_finalJSON: {},
            referenceList: [], // Справочники для полей 
            selectedData: [], // Значение полей , выбранные пользователем
            myField: [], // Поля формы регистрации
            tmpRef: [], // Функции БД
            myData: [], // Обьект с данными из базы данных , нужен для получение спровочников 
            address: [],
            simptoms: [],
            newData: {},
            questions: [], // Массив для вопросов медблока
            // id_claim: '2281488',
            id_claim: '',
            id_claim_case: '',
            apiSrv: '',
            apiUrl: this.$store.getters.apiUrl,
            phone: {                                    // Массив для хранения информации о проверки номера телефона
                number: '',                             // Номер теоефона
                isValid: false,                         // Текущее значение валидации номер телефона
                country: undefined,                     // Страна определенная по коду телефона
                elem: '',                               // Имя поля которое проверяется
            },
        };
    },
    mounted() {
        console.log('This is add-components/case apiUrl: ', this.apiUrl)
        const vm = this;
        
        this.$root.$on(this.EVENT_LIST.OPEN_CASE,  (arr) => {
            console.log('case: ', arr)
            if(this.checkIsNull(arr) != false){
                this.questions =  arr.json_sirius_test.questions
                this.$root.$emit(this.EVENT_LIST.SHOW_QUESTION, this.questions)
                this.id_claim =  arr.id_claim
                this.id_claim_case =  arr.id_claim_case
                this.myData =  arr.json_sirius_test  // Обьект с данными из базы данных , нужен для получение спровочников 
                this.selectedData =  arr.json_sirius_test.selectDataSnapShot   //  Обьект с данными где хранятся и id и значение , нужен для проставление выбранных полей пользователем
                this.partner = arr.json_sirius_test.selectDataSnapShot.id_partner.name_directory
                this.polic = arr.json_sirius_test.selectDataSnapShot.id_policy_format.name_directory
                this.myField =  arr.json_sirius_test.fieldSnapShot  // Массив данных для постороения всех полелей 
                this.tmpRef  =  arr.json_sirius_test.fieldSnapShot[0].json_dir  // Массив данных с названием функций базы данных , нужны для запроса поулчения справочниковs
                if(this.selectedData.city && this.selectedData.country){
                    this.address =  {
                        'city': this.selectedData.city.name_directory ,
                        'country': this.selectedData.country.name_directory ,
                        'address': this.selectedData.address ,
                        'point': this.selectedData.point
                    }
                }
                this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
            }else{
                this.$router.push('/documents')
            }
            Axios({
                method: 'post',
                // url: 'http://docker.accidentlaw.ru:8081/api/directory/refs',
                url:`${this.apiUrl}/api/directory/refs`,
                withCredentials: true,
                data: {
                    ref: this.tmpRef,
                    param: this.myData,
                },
            }).then((resRef) => {
                console.log(resRef)
                // Занесения данных пос правочниками в отдельный массив с ключем-именем функции из которой этот справочник получен
                resRef.data.forEach((element) => {
                    this.$set(this.referenceList, element.directory, element.directory_value);
                });
            }).catch(err => {
                console.log(err)
            })
            
        })
        this.$root.$on(this.EVENT_LIST.SET_SELECTED_PROVIDER, (prov_string) => {
            this.$set(this.newData, 'id_provider', prov_string);
            this.$set(this.myData, 'id_provider', prov_string);
            // this.$set(this.selectedData, 'provider' , )
        });
        this.$root.$on(this.EVENT_LIST.MED_SET_QUESTIONS_ANSWER, (answer) => {
            // Устанавливает данные по отвеченным вопросам в объект finalJSON
            this.$set(this.newData, 'questions', answer);
            this.$set(this.myData, 'questions', answer);
            // Вызывает метод из компонента events.vue для получения новых вопросов
            this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.newData);
            // Перезагружает справочник с предварительными диагнозами
            this.uploadRef('simptoms');
        });
        this.$root.$on(this.EVENT_LIST.SET_BORDERO_TO_SHADOW_DOM, (arr) => {
            console.log(arr)
            vm.setDataShadowDom(arr.fild, arr.value)
        });
    },
    methods:{
        throttledSave: _.debounce(function(e) {
                this.setDataFinalJSON(e)
        }, 2000),
        RegCase(e) {
            console.log('This is a  add-components/case apiUrl: ', this.apiUrl)

            this.$store.commit('refid_number', this.myData["refid_number"])
            this.$set(this.newData, 'id_claim', this.id_claim)
            this.$set(this.newData, 'id_claim_case', this.id_claim_case)
            console.log(this.newData)
            console.log(this.myData)
            // this.$set(this.finalJSON, 'fieldSnapShot', this.regField)
            // this.$set(this.finalJSON, 'selectDataSnapShot', this.selectedData)
            e.preventDefault();
            Axios({
                // url: this.apiSrv + '/api/case/case_save_change', 
                url: `${this.apiUrl}/api/case/case_save_change`,
                withCredentials: true,
                method: 'post',
                data:{
                    'updatedData': JSON.stringify(this.newData),
                    'updatedFullJson': JSON.stringify(this.myData)
                }
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(this.newData)
            })
            this.$store.commit('saveComplete', true)
            console.log(this.$store.state.saveComplete)
            if(this.$store.state.saveComplete == true){
                console.log('3123')
                const  vm = this;
                setTimeout(close , 3000)
                function close(){
                    vm.$store.commit('saveComplete', false)
                    vm.$router.push('/')
                }
            }
            // // Закрытие окна регистрации по нажатию кнопки 
            // // HACK
            // this.$store.commit('refid_number', this.finalJSON["refid_number"])
            // this.$store.commit('addComplete', true)
            // if(this.$store.state.addComplete == true){
            //     const  vm = this;
            //     setTimeout(close , 3000)
            //     function close(){
            //         vm.$router.push('/')
            //     }
            // }
            // console.log(this.address)
            // console.log(this.finalJSON)
        },
        backTodocuments(){
            this.$router.push('documents')
        },
        uploadRef(name_ref) {
            // console.log(name_ref)
            // console.log(this.myData)
            console.log('This is case apiUrl: ', this.apiUrl)
            console.log('This is a  add-components/case apiUrl: ', this.apiUrl)
            Axios({
                // url: `${this.apiSrv}/api/directory/ref`,
                url: `${this.apiUrl}/api/directory/ref`,
                withCredentials: true,
                method: 'post',
                data: {
                    ref: name_ref,
                    param: this.myData,
                },
            }).then((res) => {
                // console.log(res)
                let arrayIndex;
                switch (name_ref) {
                case 'country':
                    arrayIndex = 'f_return_city';
                    break;
                case 'hotel':
                    arrayIndex = 'f_return_hotel';
                    break;
                case 'simptoms':
                    arrayIndex = 'f_return_possible_diagnos';
                    break;
                }
                if (name_ref == 'diagnosis') {
                    this.$root.$emit(this.EVENT_LIST.PROVIDER_CHOOPSE, res.data);
                    this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                } else {
                    // console.log(res.data)
                    this.$set(this.referenceList, arrayIndex, res.data);
                }
            }).catch(err => {
                console.log(err)
            });
        },
        checkIsNull(val){
            if (typeof(val) == 'undefined'){
                return false;
            }
            if (val == null){
                return false;
            }
            if (val.length == 0){
                return false;
            }
            return true;
        },
        setDataShadowDom(fld, val) {
            // console.log( fld + val)
            const tmpg = {target: {type: 'text', name:fld, value:val}}
            this.setDataFinalJSON(tmpg)
            this.$set(this.selectedData, fld, val)
        },
        onInput({ number, isValid, country}) {
            this.phone.number = number;
            this.phone.isValid = isValid;
            this.phone.country = country && country.name;
            this.phone.iso2 = country.iso2;
            this.$set(this.myData, this.phone.elem, this.phone.number);
            this.$set(this.myData, this.phone.elem + '_country', this.phone.iso2);
            if(!this.phone.isValid){
                document.getElementById('cl_' + this.phone.elem).classList.add('red')
            }else{
                document.getElementById('cl_' + this.phone.elem).classList.remove('red')
            }
        },
        setDataFinalJSON(e) {
            switch (e.target.type) {
            case 'text':
            case 'date':
            case 'number':
                if (e.target.name == 'address') {
                    this.address.address = e.target.value;
                    this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                }
                this.$set(this.myData, e.target.name, e.target.value);
                this.$set(this.newData, e.target.name, e.target.value);
                break;
            case 'checkbox':
                this.$set(this.myData, e.target.name, +e.target.checked);
                this.$set(this.newData, e.target.name, +e.target.checked);
                break;
            }
        },
        createJSON(event) {
            this.event = event 
            // console.log(event,'ТУТ')
            // console.log('СТАРОЕ ЗНАЧЕНИЕ',this.myData[event])
            //HACK
            const phoneArray = ['foreign_number', 'home_number'];
            // Проверяет что событие вызвано одним из полей для ввода телефона
            if(phoneArray.indexOf(event) >= 0){
                this.phone.elem = event
            }
            // Поле выбора города
            if (event == 'city') {
                if (this.checkIsNull(this.selectedData[event])){
                    // console.log(this.selectedData[event])
                    this.address.point = this.selectedData[event].map_point;                    // Установка точки центра города для YandexMapx
                    this.address.id_ref_catalog = this.selectedData[event].id_ref_directory;    // Установка id города
                }
            }
            // Перебирает массив хранения данных из v-model всех полей
            for (const key in this.selectedData) {
                if (this.selectedData[key] !== null) {
                    /**
                     * Поле формирующее мультиселек является массивом массивов
                     * Его необходимо перебрать и вытащить ID
                     */
                    if (key == 'simptoms') {
                        this.simptoms = []; // Создаю новый массив для хранения полученых ID
                        // Перебираю весь массив
                        for (const key_sm in this.selectedData[key]) {
                            //Добавляю ID в массив симптомов
                            this.simptoms.push(this.selectedData[key][key_sm].id_ref_directory);
                        }
                        // Добавляю массив ID симптомов 
                        this.$set(this.myData, key, this.simptoms);
                    }
                    // Проверяю на пустоту
                    if (this.checkIsNull(this.selectedData[key].id_ref_directory)) {
                        // Занашу не пустые данные в финальный массив
                        this.$set(this.myData, key, this.selectedData[key].id_ref_directory);
                    }
                }
                else{
                    this.$set(this.myData, key, '');
                }
            }
            switch (event) {
            // Изменение страны -> перезагрузка городов
            case 'country':
                if (this.selectedData.country !== null){
                    // console.log(this.selectedData)
                    // console.log(this.address)
                    this.address.country = this.selectedData.country.name_directory;
                }
                this.selectedData["city"] = null;
                this.myData["city"] = "";
                this.uploadRef('country');
                // console.log(this.selectedData)
                break;
                // Изменение города -> перезагрузка отелей
            case 'city':
                if (this.checkIsNull(this.selectedData.city)){
                    this.address.city = this.selectedData.city.name_directory;
                    this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                    this.uploadRef('hotel');
                }else{
                    this.$set(this.referenceList, 'hotel', []);
                }
                break;
                // Изменение отеля -> запись установка данных об адресе отеля
            case 'hotel':
                this.address['address'] = this.selectedData['hotel'].address;
                this.$set(this.selectedData, 'address', this.address['address'])
                this.$set(this.myData, 'address', this.address['address'])
                this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                break;
                // Изменение сиптомов -> запрос вопросов по симптомам
            case 'simptoms':
                this.uploadRef('simptoms');
                // отправка финального json  для получения вопросов
                this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.myData);
                this.$set(this.selectedData, 'diagnosis', '')
                this.$set(this.myData, 'diagnosis', '')
                this.$set(this.myData, 'questions', [])
                break;
                case 'diagnosis':
                this.uploadRef('diagnosis');
                this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.myData);
                break;
            }
            // // this.newData['event'] = this.newData['event']
            // console.log(this.myData['event'])
        },
    },
    watch: {
        myData: {
            /**
             * @description Следит за изменениями в обьекте finalJSON
             * @param {any} val
             * @param {any} oldVal
             */
            handler(val, oldVal) {
                console.log('This is add-components/case apiUrl3: ', this.apiUrl)
                console.log(this.selectedData)
                // console.log('НОВОЕ ЗНАЧЕНИЕ',this.myData[this.event])
                if(this.event){
                    this.$set(this.newData, this.event, this.myData[this.event]);
                }
                
                
                // console.log('старое значение',val)
                // console.log('новое значение', oldVal)
                //Установка коротких наименований для обьектов
                const tFJ = this.TMP_finalJSON
                const FJ = this.myData
                
                // console.log(tFJ)
                // console.log(FJ)
                if (this.checkIsNull(FJ["dob"])){
                    // проверка для того чтобы перерасчет возраста работал только в том случае если изменилась дата рождения 
                    if (this.TMP_finalJSON["dob"] != this.myData["dob"]){
                        // Получение необходмимого формата даты регистрации случая
                        const date_reg = this.myData["dttmcr"].split(' ')
                        const el_data = date_reg[0].split('.')
                        const reg_date = new Date(el_data[2], el_data[1] -1, el_data[0])
                        // Получение необходимого формата даты рождения
                        const date_dob = this.myData["dob"].split('-')
                        const dob_date = new Date(date_dob[0], date_dob[1]-1, date_dob[2])
                        //Разница между датами
                        var timeDiff = Math.abs(reg_date.getTime() - dob_date.getTime()); // считаю разницу через секунды
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // возвращаю секунды в дни
                        this.setDataShadowDom('age', parseInt(diffDays/365))
                    }
                    // Устанавливаю в переменную текуще значение даты рождения
                    this.TMP_finalJSON["dob"] = this.myData["dob"];
                }
               // Проверяет есть ли значени в объекты полей 'memo_number' (памятка), 'policy_number' (номер полиса) и поле 'dob' дата рождения
                if((this.checkIsNull(FJ["memo_number"]) || this.checkIsNull(FJ["policy_number"])) || this.checkIsNull(FJ["dob"]) || this.checkIsNull(FJ["fullname_insured"])){
                    console.log('Первый этап бордеро')
                    console.log('старый',tFJ)
                    console.log('новый',FJ)
                    if ((tFJ["memo_number"] != FJ["memo_number"]) || (tFJ["policy_number"] != FJ["policy_number"]) || (tFJ["dob"] != FJ["dob"]) || (tFJ["fullname_insured"] != FJ["fullname_insured"])){
                    console.log('Второй этап бордеро')
                    Axios({
                            method: 'post',
                            url: `${this.apiUrl}/api/case/findbordero`,
                            withCredentials: true,
                            data: {
                                'data': JSON.stringify(this.myData)
                            }
                        })
                            .then(res => {
                                console.log('Выполнился поиск по бордеро', res)
                            // Вызывает событие из списка EVENT_LIST с индексом LOAD_BORDERO
                                this.$root.$emit(this.EVENT_LIST.LOAD_BORDERO, res.data);
                            })
                    }
                    tFJ["memo_number"] = FJ["memo_number"];
                    tFJ["policy_number"] = FJ["policy_number"];
                    tFJ["dob"] = FJ["dob"];
                    tFJ["fullname_insured"] = FJ["fullname_insured"];
                }else{
                    this.$root.$emit(this.EVENT_LIST.LOAD_BORDERO, []);
                }
                // После любых изменение отправляет finalJSON на базовую проверку
                Axios({
                    // url: `${this.apiSrv}/api/hint/basic`,
                    url: `${this.apiUrl}/api/hint/basic`,
                    withCredentials: true,
                    method: 'post',
                    data: {
                        data: JSON.stringify(this.myData),
                    },
                })
                    .then((res) => {
                        this.$root.$emit(this.EVENT_LIST.HITS_BASIC, res.data);
                    });
                // Отправляет объект finalJSON на проверку по ситуациям
                Axios({
                    // url: this.apiSrv + '/api/hint/basicsituation',
                    url: `${this.apiUrl}/api/hint/basicsituation`,
                    withCredentials: true,
                    method: 'post',
                    data:{
                        'data': JSON.stringify(this.myData)
                    }
                })
                    .then(res => {
                        this.$root.$emit(this.EVENT_LIST.HITS_SITUATION, res.data);
                    })
                //Работа подбора провайдера 
                //Проверка что необходимые поля заполнены
                    if(this.checkIsNull(FJ["country"]) || this.checkIsNull(FJ["simptoms"]) || this.checkIsNull(FJ["diagnosis"])){
                        // console.log('Я ТУТ первый')
                    // if (this.checkIsNull(FJ["country"]) && this.checkIsNull(FJ["simptoms"]) && this.checkIsNull(FJ["diagnosis"])){
                        if (this.checkIsNull(FJ["country"])  && this.checkIsNull(FJ["diagnosis"])){
                            // console.log('Я ТУТ второй')
                        //Проверка на что необходимые поля изменились с последним изменением
                        if ((tFJ["country"] != FJ["country"]) || (tFJ["simptoms"] != FJ["simptoms"]) || (tFJ["diagnosis"] != FJ["diagnosis"]) || (tFJ["city"] != FJ["city"])){
                            this.uploadRef('diagnosis');
                            // console.log('Я ТУТ третий')
                        }
                        // Установка последных данных для отслеживания изменений
                        tFJ["country"] = FJ["country"];
                        tFJ["simptoms"] = FJ["simptoms"];
                        tFJ["diagnosis"] = FJ["diagnosis"];
                        tFJ["city"] = FJ["city"];
                    }else{
                        //Если необходимые поля не заполнены то очистить список провайдеров
                        this.$root.$emit(this.EVENT_LIST.PROVIDER_CHOOPSE, []);
                        // console.log('Очищает список')
                    }

                }
            },
            deep: true,
        },
    },
    beforeMount() {
        this.apiSrv = this.$store.state.apiServer
        // this.apiSrv = 'http://10.80.108.80:8081'
    },
}
</script>
<style scoped>
.open__case{
    background: var(--white);
    width: 25rem;
}
.select-toggle {
    width: 20rem;
    cursor: pointer;
    font-size: 0.8rem;
    flex: 1;
}
.copy-box{
    display: flex;
    position: relative;
}
.copy{
    width: 1.5rem;
    height: 1.5rem;
    /* background: var(--blue); */
    margin-left: 0.7rem;
    align-self: center;
    margin-bottom: 0.5rem;
    position: relative;
    
}
.copy__svg{
    max-width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    transition: 1s all;
}
.copy__svg:hover{
    transform: scale(1.2);
}
.copy-done{
    display: none;
}
.copy-done:after{
    width: 2rem;
    height: 1rem;
    content: 'Готово';
    font-size: 0.6rem;
    border: 1px solid  var(--grey);
    padding: 0.3rem;
    position: absolute;
    bottom: 2rem;
    left: -0.7rem;

}
.vue-tel-input{
    max-width: 20rem;
    margin: 0.7rem 0;
}
.cl_foreign_number{
    margin: 1rem 0;
}
input[type="date"]{
    font-size: 1.05rem;
}
input[type="checkbox"]{
    cursor:pointer;
    width: 1.5rem;
    height:1.5rem;
    /* zoom: 0.1; */
}
.red {
    border: 1px solid var(--red)!important;
}
.regcase-container {
    /* border: 1px solid black; */
    position: absolute;
    right: 0;
}
.regcase {
    background: var(--rageblue);
    color: var(--white);
    width: 10rem;
    height: 2.5rem;
    border-radius: 0.3125rem;
    border: none;
    font-size: 0.8rem;
    margin: 1rem 1rem 0rem 1rem;
    position: relative;
    right: 1rem;
    cursor: pointer;
    outline: none;

}
.regcase_secondary{
    background: var(--blue);
    color: var(--black);
    border: none;
}
.vs--searchable .vs__dropdown-toggle {
    cursor: pointer;
}
.block-num {
    margin: 1.5rem 0;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--grey);
    font-weight: 200;
}
[name=refid_number] {
    pointer-events: none;
}
.pb1 {
    padding: 1rem 0;
}
/* .field_code{
float: left;
} */
.select-toggle {
    max-width: 20rem;
    cursor: pointer;
    font-size: 0.8rem;
    flex: 1;
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
    background: var(--white);
    width: 25rem;
}
input {
    width: 20rem;
    padding: 0.4rem;
    background: none;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 4px;
    white-space: normal;
    font-size: 0.8rem;
    color: var(--black);
}
.input_task__field {
    padding-left: var(--paddingleft);
    padding-top: 1rem;
    box-shadow: 0px 0px 10px rgba(177, 181, 193, 0.3);
    overflow: auto;
    height: 80vh;
    text-align: left;
}
.input_task-f_group {
 max-width: 20rem;
}
.input_text {
    width: 20rem;
    padding: 0.5rem 0.8rem;
    margin-bottom: 1rem;
    border: none;
    background-color: #EDF2F6;
    color: var(--black);
}
.field_script {
    font-size: 0.8rem;
    opacity: 1;
    max-width: 20rem;
    padding-top: 0.5rem;
    padding-bottom: 0.3rem;
    color: #1d6180;
}
.field_code {
    max-width: 20rem;
    font-weight: 400;
}
.input_task-j_part {
    padding-top: 1rem;
}
.select-toggle {
    margin-bottom: 0.5rem;
}
.warning {
    border: 1px solid #fcc600;
}
.active{
    border: 1px solid var(--rageblue);
    background: var(--rageblue);
    opacity: 0.6;
    color: white;
}
</style>


