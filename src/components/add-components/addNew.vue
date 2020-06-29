<template>
    <div class="input_task">
        <div class="input_task-title">
            <p>Формирование заявки</p>
        </div>
        <form class="input_task__field">
            <p class="field_code">Страховая компания</p>
            <p class="field_script">Добрый день! Балт Ассистанс, слушаю Вас. Просим сообщить название вашей страховой компании.</p>
            <v-select class="select-toggle" label="name_directory" name="id_partner"  :options="vSelectData['insCompany']" @input="createJSON('insCompany')" v-model="selectedData['id_partner']"/>
            <p class="field_code">Тип полиса</p>
            <p class="field_script">Назовите тип вашего полиса</p>
            <v-select class="select-toggle" label="name_directory"  :options="vSelectData['insPolicy']" @input="createJSON('insPolicy')" v-model="selectedData['id_policy_format']"/>
            <!-- <p class="field_code">Тип случая</p>
            <p class="field_script">Что у вас случилось</p>
            <v-select class="select-toggle" label="name_directory"  :options="vSelectData['typecase']" @input="createJSON('typecase')" v-model="selectedData['id_type_case']"/> -->
            <div v-for="(block, bl_index) in this.regField" :key="bl_index">
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
                                <div class="copy" :data_copy="rows.row.copy" alt="Скопировать" @click="doCopy(selectedData[rows.row.system_name])" v-show="ArrCopy['copy_' + rows.row.system_name]">
                                    <img class="copy__svg" src="../../assets/copy.svg" alt="copy">
                                </div>
                            </div>  <!-- Vselect  -->
                        </div>
                        <div v-else>
                            <div class="field_code">
                                <span class="field_code_small" /> {{ rows.row.field_name }}  
                            </div>
                            <vue-tel-input 
                            placeholder="Введите номер телефона"
                            v-bind="{name:rows.row.system_name, id:'cl_'+rows.row.system_name, defaultCountry: 'ru'}"
                            @onInput="throttledSavePhone"
                            @input="createJSON(rows.row.system_name)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="regcase-container">
        <button class="regcase" @click="RegCase"> Зарегистрировать</button>
        </div>
    </div>
</template>
<script>
/**
 * write a component's description
 */
import Vue from 'vue';
import vSelect from 'vue-select';
import VueTelInput from 'vue-tel-input';
import Axios from 'axios';
import 'vue-select/dist/vue-select.css';
import 'vue-tel-input/dist/vue-tel-input.css';
import { setTimeout } from 'timers';
import VueLodash from 'vue-lodash'
export default {
    components: {
        vSelect,
        VueTelInput,
    },
    methods: {
        /**
         * @description Импортируемый плагин Lodash , ждет 2 секунды после того как пользователь закончит печатать, после чего отправляет данные на сервер.
         */
        throttledSave: _.debounce(function(e) {
            this.setDataFinalJSON(e)
        }, 2000),
        /**
         * @description Функция для задержки проверки телефонных номеров
         */
        throttledSavePhone: _.debounce(function({ number, isValid, country}) {
            this.onInput({ number, isValid, country})
        }, 1000),
        /**
         * @description Функция копирования значений у полей с проставленным значением  copy = true
         */
        doCopy: function (e) {
            this.$copyText(e.name_directory).then(function (e) { }, function (e) { })
        },
        /**
         * @description За счет того что все поля на форме подключены через v-model данные занесенные в объект this.finalJSON сразу прорисовываются на форме
         * 
         * @param {Object} e объект с данными для занесения его в ShadowDom. 
         */
        setDataFinalJSON(e) {
            switch (e.target.type) {
            case 'text':
            case 'date':
            case 'number':
                if (e.target.name == 'address') {
                    this.address.address = e.target.value;
                    this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                }
                console.info('0 FINAL JSON: ', this.finalJSON)

                this.$set(this.finalJSON, e.target.name, e.target.value);
                break;
            case 'checkbox':
                console.info('0 FINAL JSON: ', this.finalJSON)
                this.$set(this.finalJSON, e.target.name, +e.target.checked);
                break;
            }
        },
        //HACK
        /**
         * @description Плагин vue-tel-input для валидации телефонных номером
         * @param {any} number 
         * @param {any} isValid
         * @param {any} country
         */
        onInput({ number, isValid, country}) {
            this.phone.number = number;
            this.phone.isValid = isValid;
            this.phone.country = country && country.name;
            this.phone.iso2 = country.iso2;

            this.$set(this.finalJSON, this.phone.elem, this.phone.number);
            this.$set(this.finalJSON, this.phone.elem + '_country', this.phone.iso2);
            this.$set(this.selectedData, this.phone.elem, this.phone.number);
            this.$set(this.selectedData, this.phone.elem + '_country', this.phone.iso2);
            
            if(!this.phone.isValid){
                document.getElementById('cl_' + this.phone.elem).classList.add('red')
            }else{
                document.getElementById('cl_' + this.phone.elem).classList.remove('red')
            }
        },
        /**
         * @description Регистрация страховго дела
         * @param {any} e стандартный аргумент при нажатии на кнопку
         */
        RegCase(e) {
            console.log('Зарегестрированное дело', this.finalJSON)
            this.$set(this.finalJSON, 'fieldSnapShot', this.regField)
            this.$set(this.finalJSON, 'selectDataSnapShot', this.selectedData)
            e.preventDefault();
            Axios({
                method: 'post',
                url: `${this.apiUrl}/api/case/case_registration`,
                withCredentials: true,
                data:{
                    'data': JSON.stringify(this.finalJSON)
                },
            }).then(resp => {
            }).catch(err => {
                console.error('Дело не зарегестрировалось', err)
            })
            // Закрытие окна регистрации по нажатию кнопки 
            // HACK
            this.$store.commit('refid_number', this.finalJSON["refid_number"])
            this.$store.commit('addComplete', true)
            if(this.$store.state.addComplete == true){
                const  vm = this;
                setTimeout(close , 3000)
                function close(){
                    vm.$router.push('/')
                }
            }
        },
        /**
         * @description Создание массива для хранения данных внесенных в форму регистрации
         * @param {any} event Имя элемента вызвавшего событие
         */
        createJSON(event) {
            // console.log('ּИмя поля – ', event)
            //HACK
            const a = [...document.querySelectorAll("div[copy='true']")]
            for (var t in a){
                if (event == a[t].getAttribute('name') && this.selectedData[event] != null){
                    this.$set(this.ArrCopy, "copy_" + a[t].getAttribute('name'), true)
                }
            }

            const phoneArray = ['foreign_number', 'home_number'];
            // Проверяет что событие вызвано одним из полей для ввода телефона
            if(phoneArray.indexOf(event) >= 0){
                this.phone.elem = event
            }

            //Проверяет что србытие вызвано полем для выбора страховой компании
            if (event == 'insCompany') {
                if (this.selectedData.id_partner == null) {
                    this.selectedData = {}; // Очищает массив с данными
                    this.$set(this.selectedData, 'id_partner', '') 
                    this.$set(this.selectedData, 'id_policy_format', '')
                }
                this.finalJSON = {}; // Очищает массив с данными
                this.regField = []; // Очищает массив с полями регистрации
            }
            // Поле для выбора типа договора
            if (event == 'insPolicy') {
                if (this.selectedData.id_policy_format == null) {
                    this.finalJSON = {};
                    this.regField = [];
                }
            }
            // Поле выбора города
            if (event == 'city') {
                if (this.checkIsNull(this.selectedData[event])){
                    this.address.point = this.selectedData[event].map_point;                  // Установка точки центра города для YandexMapx
                    this.$set(this.selectedData, 'point', this.address.point)                  // записываем координаты города в селект дата
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
                        this.$set(this.finalJSON, key, this.simptoms);
                    }
                    // Проверяю на пустоту
                    if (this.checkIsNull(this.selectedData[key].id_ref_directory)) {
                        // Занашу не пустые данные в финальный массив
                        this.$set(this.finalJSON, key, this.selectedData[key].id_ref_directory);
                    }
                }
                else{
                    this.$set(this.finalJSON, key, '');
                }
            }
            switch (event) {
            // Изменение СК -> перезагрузка типов договора
            case 'insCompany':
                this.uploadTypePolicy();
                break;
                // Изменение Типа логовора -> форма регистрации
            case 'insPolicy':
                this.uploadRegField();
                break;
                // Изменение страны -> перезагрузка городов
            case 'country':
                if (this.selectedData.country !== null){
                    this.address.country = this.selectedData.country.name_directory;
                }
                this.selectedData["city"] = null;
                this.finalJSON["city"] = "";
                this.uploadRef('country');
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
                this.$set(this.finalJSON, 'address', this.address['address'])
                this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                break;
                // Изменение сиптомов -> запрос вопросов по симптомам
            case 'simptoms':
                this.uploadRef('simptoms');
                // отправка финального json  для получения вопросов
                this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.finalJSON);
                // Очищаем поле диагноз при добавлении или измении симптомов
                this.$set(this.selectedData, 'diagnosis', '')
                this.$set(this.finalJSON, 'diagnosis', '')
                this.$set(this.finalJSON, 'questions', [])
                break;
            case 'diagnosis':
                this.uploadRef('diagnosis');
                this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.finalJSON);
                break;
            }
        },
        /**
         * @description загрузка полей для формы регистрации после выбора типа договора
         * @param {any} event JSON с данными о выбранно тип договора
         */
        uploadRegField(event) {
            const vm = this;
            Axios({
                method: 'post',
                url: `${this.apiUrl}/api/directory/getregfield`,
                withCredentials: true,
                data: {
                    data: JSON.stringify(this.finalJSON),
                }
            }).then((res) => {
                // console.log('Получены поля для формы регистрации', res)
                this.regField = res.data;
                if (res.data[0]) {
                    this.tmpRef = res.data[0].json_dir;
                    // Перебор перебор JSON для внесения ланных по пользователю который регистрирует дело
                    res.data.forEach((el) => {
                        if (JSON.stringify(el.json_def_val) != '[]') {
                            for (const i in el.json_def_val) {
                                const data = el.json_def_val[i];
                                for (const key in data) {
                                    vm.$set(vm.finalJSON, key, data[key]);
                                    vm.$set(vm.finalJSON, 'id_user', this.$store.getters.userId);
                                    vm.$set(vm.selectedData, key, data[key]);
                                }
                            }
                        }
                    });
                    // Загрузка необходимых справочников для заполнения формы регистрации
                    // console.log('tmpRef',this.tmpRef)
                    // console.log('finalJson', this.finalJSON)
                    Axios({
                        method: 'post',
                        url: `${this.apiUrl}/api/directory/refs`,
                        withCredentials: true,
                        data: {
                            ref: this.tmpRef,
                            param: this.finalJSON,
                        },
                    }).then((resRef) => {
                        // console.log('Получены справочники для заполнения формы регистрации',resRef)
                        // Занесения данных пос правочниками в отдельный массив с ключем-именем функции из которой этот справочник получен
                        resRef.data.forEach((element) => {
                            this.$set(this.referenceList, element.directory, element.directory_value);
                        });
                    }).catch((err) => {
                        console.error('Тут /api/directory/refs ', err)
                    });
                }
            }).catch((err) => {
                console.error('Ошибка при получении полей для формы регистрации', err)
            });
        },
        /**
         * @description Загрузка типов полиса для СК
         */
        uploadTypePolicy() {
            Axios({
                method: 'post',
                url: `${this.apiUrl}/api/directory/instypepolicy`,
                withCredentials: true,
                data: {
                    data: this.finalJSON.id_partner,
                },
            }).then((res) => {
                // console.log('Загрузились типы полисов для СК', res)
                this.$set(this.vSelectData, 'insPolicy', res.data);
            }).catch((err) => {
                console.error('Ошибка при загрузке полисов для СК', err)
            });
        },
        /**
         * @description Перезагрузка необходимого справочника
         * @param {any} name_ref
         */
        uploadRef(name_ref) {
            Axios({
                method: 'post',
                url: `${this.apiUrl}/api/directory/ref`,
                withCredentials: true,
                data: {
                    ref: name_ref,
                    param: this.finalJSON,
                },
            }).then((res) => {
                // console.log('Перезагрузка спровочника',res)
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
                } else {
                    this.$set(this.referenceList, arrayIndex, res.data);
                }
            }).catch((err) => {
                console.error('Ошибка при перезагрузке справочника', err)
            });
        },
        /**
         * @description Функции установки данных в ShadowDom
         * @param {any} fld наименование поле
         * @param {any} val значение
         */
        setDataShadowDom(fld, val){
            const tmpg = {target: {type: 'text', name:fld, value:val}}
            this.$set(this.selectedData, fld, val)
            this.setDataFinalJSON(tmpg)
        },
        /**
         * @description проверяет на пустоту входящий аргумент
         *              1. проверяет на совпадение с undefined
         *              2. проверяет на совпадение с null
         *              3. Проверяет на длину
         * @param {any} val
         * @returns {any} возвращает булево значение результата работы
         */
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
        }
    },
    watch: {
        finalJSON: {
            /**
             * @description Следит за изменениями в обьекте finalJSON
             * @param {any} val
             * @param {any} oldVal
             */
            handler(val, oldVal) {
                
                // console.log('ָФинальный json', this.finalJSON)
                //Установка коротких наименований для обьектов
                const tFJ = this.TMP_finalJSON
                const FJ = this.finalJSON
                //Проверка на уход со страницы без сохранения изменеий
                // if(FJ['refid_number']){
                //     this.$router.beforeEach((to, from, next) => {
                //         console.log('ЗАСТРЯЛ')
                //         if(from.name == 'add' && this.$store.state.addComplete === false ){
                //     this.$swal.fire({
                //         title: 'Вы действительно хотите выйти?',
                //         text: 'Весь не сохраненнй прогресс будет потерян!',
                //         // type: 'question',
                //         showCancelButton: true,
                //         allowOutsideClick: false,
                //         confirmButtonText: 'Выход',
                //         cancelButtonText: 'Отмена',
                //         customClass: {
                //             container: 'container-class',
                //             popup: 'popup-class',
                //             header: 'header-class',
                //             title: 'title-class',
                //             closeButton: 'close-button-class',
                //             icon: 'icon-class',
                //             image: 'image-class',
                //             content: 'content-class',
                //             input: 'input-class',
                //             actions: 'actions-class',
                //             confirmButton: 'confirm-button-class',
                //             cancelButton: 'cancel-button-class',
                //             footer: 'footer-class'
                //         }
                //     }).then((result) => {
                //         if(result.value){
                //             next()
                //         }
                //     })
                //         }
                //     })

                // }
                // Проверяет есть ли значени в объекты полей 'memo_number' (памятка), 'policy_number' (номер полиса) и поле 'dob' дата рождения
                if((this.checkIsNull(FJ["memo_number"]) || this.checkIsNull(FJ["policy_number"])) || this.checkIsNull(FJ["dob"]) || this.checkIsNull(FJ["fullname_insured"])){
                    // console.log('Первый этап бордеро')
                    if ((tFJ["memo_number"] != FJ["memo_number"]) || (tFJ["policy_number"] != FJ["policy_number"]) || (tFJ["dob"] != FJ["dob"]) || (tFJ["fullname_insured"] != FJ["fullname_insured"])){
                            // console.log('Второй этап бордеро')
                        Axios({
                            method: 'post',
                            url: `${this.apiUrl}/api/case/findbordero`,
                            withCredentials: true,
                            data: {
                                'data': JSON.stringify(this.finalJSON)
                            }
                        })
                            .then(res => {
                                // console.log('Выполнился поиск по бордеро', res)
                            // Вызывает событие из списка EVENT_LIST с индексом LOAD_BORDERO
                                this.$root.$emit(this.EVENT_LIST.LOAD_BORDERO, res.data);
                            }).catch((err) => {
                                console.error('Ошибка при поиске полиса бордеро', err)
                            })
                    }
                    tFJ["memo_number"] = FJ["memo_number"];
                    tFJ["policy_number"] = FJ["policy_number"];
                    tFJ["dob"] = FJ["dob"];
                    tFJ["fullname_insured"] = FJ["fullname_insured"];
                }else{
                    this.$root.$emit(this.EVENT_LIST.LOAD_BORDERO, []);
                }
                /**
                 * @description При выборе отеля простовляется адрес, но что бы его задействовать нужно зайти в поле и стригирить функцицию, данным решением мы тригирим адрес в момент выбора отеля
                 */
                // if(this.checkIsNull(FJ['hotel'])){
                //     console.log(this.address)
                //     this.$root.$emit(this.EVENT_LIST.SET_ADDRESS, this.address);
                // }
                // После любых изменение отправляет finalJSON на базовую проверку
                Axios({
                    method: 'post',
                    url: `${this.apiUrl}/api/hint/basic`,
                    withCredentials: true,
                    data: {
                        data: JSON.stringify(this.finalJSON),
                    },
                })
                    .then((res) => {
                        // console.log('Выполнилась базовая проверка', res)
                        this.$root.$emit(this.EVENT_LIST.HITS_BASIC, res.data);
                    }).catch((err) => {
                        console.error('Ошибка базовой проверки', err)
                    });
                // Отправляет объект finalJSON на проверку по ситуациям
                Axios({
                    method: 'post',
                    url: `${this.apiUrl}/api/hint/basicsituation`,
                    withCredentials: true,
                    data:{
                        'data': JSON.stringify(this.finalJSON)
                    }
                })
                    .then(res => {
                        // console.log('Выполнилась проверка по ситуациям', res)
                        this.$root.$emit(this.EVENT_LIST.HITS_SITUATION, res.data);
                    }).catch((err) => {
                        console.error('Ошибка проверки по ситуация', err)
                    })
                // Отправляет объект finalJSON на проверку по полям
                Axios({
                    method: 'post',
                    url: `${this.apiUrl}/api/hint/field`,
                    data:{
                        'data': JSON.stringify(this.finalJSON)
                    }
                })
                    .then(res => {
                        // console.log('Выполнилась проверка по полям', res);
                        this.$root.$emit(this.EVENT_LIST.HITS_FIELD, res.data);
                    }).catch((err) => {
                        console.error('Ошибка проверки по полям', err)
                    })
                // Отправляет объект finalJSON на проверку по значению
                Axios({
                    method: 'post',
                    url: `${this.apiUrl}/api/hint/value`,
                    data:{
                        'data': JSON.stringify(this.finalJSON)
                    }
                })
                    .then(res => {
                        // console.log('Выполнилась проверка по значению', res)
                        this.$root.$emit(this.EVENT_LIST.HITS_VALUE, res.data);
                    }).catch((err) => {
                        console.error('Ошибка проверки по значению', err)
                    })
                // Метод для расчета возраста
                if (this.checkIsNull(FJ["dob"])){
                    // проверка для того чтобы перерасчет возраста работал только в том случае если изменилась дата рождения 
                    if (this.TMP_finalJSON["dob"] != this.finalJSON["dob"]){
                        // Получение необходмимого формата даты регистрации случая
                        const date_reg = this.finalJSON["dttmcr"].split(' ')
                        const el_data = date_reg[0].split('.')
                        const reg_date = new Date(el_data[2], el_data[1] -1, el_data[0])
                        // Получение необходимого формата даты рождения
                        const date_dob = this.finalJSON["dob"].split('-')
                        const dob_date = new Date(date_dob[0], date_dob[1]-1, date_dob[2])
                        //Разница между датами
                        var timeDiff = Math.abs(reg_date.getTime() - dob_date.getTime()); // считаю разницу через секунды
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // возвращаю секунды в дни
                        this.setDataShadowDom('age', parseInt(diffDays/365))
                    }
                    // Устанавливаю в переменную текуще значение даты рождения
                    this.TMP_finalJSON["dob"] = this.finalJSON["dob"];
                }
                //Работа подбора провайдера 
                //Проверка что необходимые поля заполнены
                if(this.checkIsNull(FJ["country"]) || this.checkIsNull(FJ["simptoms"]) || this.checkIsNull(FJ["diagnosis"])){
                    // if (this.checkIsNull(FJ["country"]) && this.checkIsNull(FJ["simptoms"]) && this.checkIsNull(FJ["diagnosis"])){
                        if (this.checkIsNull(FJ["country"])  && this.checkIsNull(FJ["diagnosis"])){
                        //Проверка на что необходимые поля изменились с последним изменением
                        if ((tFJ["country"] != FJ["country"]) || (tFJ["simptoms"] != FJ["simptoms"]) || (tFJ["diagnosis"] != FJ["diagnosis"]) || (tFJ["city"] != FJ["city"])){
                            this.uploadRef('diagnosis');
                        }
                        // Установка последных данных для отслеживания изменений
                        tFJ["country"] = FJ["country"];
                        tFJ["simptoms"] = FJ["simptoms"];
                        tFJ["diagnosis"] = FJ["diagnosis"];
                        tFJ["city"] = FJ["city"];
                    }else{
                        //Если необходимые поля не заполнены то очистить список провайдеров
                        this.$root.$emit(this.EVENT_LIST.PROVIDER_CHOOPSE, []);
                    }

                }
            },
            deep: true,
        },
    },
    /**
     * @description метот отрабатывает перед отображением на странице
     */
    beforeMount() {
        const vm = this;
        // this.apiSrv = this.$store.state.apiServer,
        // Запрос справочника СК
        Axios({
            url: `${this.apiUrl}/api/directory/inscompanies`,
            withCredentials: true,
            method: 'get'
        })
            .then((res) => {
                this.$set(this.vSelectData, 'insCompany', res.data);
            }).catch((err) => {
                console.error('Ошибка при загрузке справочников для СК', err)
            });
        //Запрос справочника по типу случая
        Axios({
            url: `${this.apiUrl}/api/directory/typecase`,
            withCredentials: true,
            method: 'get'
        })
            .then((res) => {
                this.$set(this.vSelectData, 'typecase', res.data);
            }).catch((err) => {
                console.error('Ошибка загрузки справочника по типу случая', err)
            });
    },
    /**
     * @description Отрабатывает после того как компонент отобразился на странице
     */
    mounted(){
        const vm = this;
        // Устанавливает слушателя события SET_BORDERO_TO_SHADOW_DOM
        // Метод создан для возможности манипулирования данными на форме из другого компонента
        this.$root.$on(this.EVENT_LIST.SET_BORDERO_TO_SHADOW_DOM, (arr) => {
            vm.setDataShadowDom(arr.fild, arr.value)
        });
        // Устанавливает слушателя события SET_SELECTED_PROVIDER
        // Используется для записи выбранного провайдера в объект finalJSON
        this.$root.$on(this.EVENT_LIST.SET_SELECTED_PROVIDER, (prov_string) => {
            this.$set(this.finalJSON, 'id_provider', prov_string);
            // this.$set(this.selectedData, 'provider' , )
        });
        // ЗАПИЫВАЕМ ВЫБРАННЫЕ КООРДИНАТЫ В СПИСОК 
        // this.$root.$on(this.EVENT_LIST.SET_SELECTED_NAME_PROVIDER, (prov_string) => {
        //     this.$set(this.selectedData, 'provider', prov_string);
        // })
        // Устанавливает слушателя события MED_SET_QUESTIONS_ANSWER
        // Вызывается из компонента events.vue когда пользователь отвечаете на дополнительные вопросы
        this.$root.$on(this.EVENT_LIST.MED_SET_QUESTIONS_ANSWER, (answer) => {
            // Устанавливает данные по отвеченным вопросам в объект finalJSON
            this.$set(this.finalJSON, 'questions', answer);
            // Вызывает метод из компонента events.vue для получения новых вопросов
            this.$root.$emit(this.EVENT_LIST.MED_QUESTIONS, this.finalJSON);
            // Перезагружает справочник с предварительными диагнозами
            this.uploadRef('simptoms');
        });
    },
    /**
     * @description
     * @returns {any}
     */
    data() {
        return {
            lastInputTime: null,
            inputTimeout: 1000,
            LastJson: [],
            message: 'Copy These Text',
            EVENT_LIST: this.$root._data.EVENT_LIST,    // Лист возможных событий
            vSelectData: [],                            // Массив для хранения данных из справочников
            selectedData: {},                           // Массив для сохранения предварительных данных
            finalJSON: {},                              // обьект для хранения финальных данных из формы регистрации
            regField: [],                               // Массив для хранения полей формы регистрации
            apiSrv: '',                                 // Переменная хранения адреса API-сервера
            referenceList: [],                          // Массив загруженных справочников
            simptoms: [],                               // Массив ID симптомов
            address: [],                                // Массив для сохранения информации по выбранному городу (geopoint, имя, id)
            ArrCopy:[],                                 // HACK
            phone: {                                    // Массив для хранения информации о проверки номера телефона
                number: '',                             // Номер теоефона
                isValid: false,                         // Текущее значение валидации номер телефона
                country: undefined,                     // Страна определенная по коду телефона
                elem: '',                               // Имя поля которое проверяется
            },
            apiUrl: this.$store.getters.apiUrl,
            TMP_finalJSON:{} // Для хранение данных перед изменением
        };
    },
};

</script>

<style scoped>
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
.regcase {
    background: var(--rageblue);
    color: var(--white);
    width: 8rem;
    height: 2.5rem;
    border-radius: 0.3125rem;
    border: none;
    font-size: 0.8rem;
    margin: 1rem 1rem 0rem 1rem;
    position: absolute;
    right: 1rem;
    cursor: pointer;
    outline: none;

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
