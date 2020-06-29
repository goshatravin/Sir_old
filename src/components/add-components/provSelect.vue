<template>
    <div class="input_task">
        <div class="input_task-title">
            <p>Выбор провайдера</p>
        </div>
        <div class="providers">
            <div v-for="(item,index) in provider" :id= "item.id_provider" :key="item.a" v-if="index <= 3" class="provider" @click="chooseProv" v-bind:class="{red: activeIndex == item.id_provider}"> 
                <div class="pr_name">
                    {{ item.provider_name }}
                </div>
                <div class="pr_adr">
                    <div class="img-box">
                        <img class="svg" src="../../assets/provider-img/location.svg" alt="">
                    </div>
                    {{ item.provider_address }}
                </div>

                <div class="pr_doc">
                    <div class="img-box">
                        <img class="svg" src="../../assets/provider-img/doc.svg" alt="">
                    </div>
                    {{ item.doctor }}
                </div>

                <div class="pr_data">
                    <div class="img-box">
                        <img class="svg" src="../../assets/provider-img/setting.svg" alt="">
                    </div>
                    {{ item.main_data }}
                </div>
                <div style="display:none" class="id_provider">
                    {{ item.id_provider }}
                </div>
            </div>
        </div>
            <div id="map" v-show="loa" />
        
    </div>
</template>
<script>
import axios from 'axios';
import { async } from 'q';

export default {
    data() {
        return {
            EVENT_LIST: this.$root._data.EVENT_LIST,
            provider: {},
            myMap: '',
            fullAddress: '',
            center: [],
            startCoord: '',
            apiSrv: '',
            pick: '',
            activeIndex: '',
            // selectedProvider: '',
            loa: true // скрыть карту 
        };
    },
    created() {
        const vm = this;
        // Тригер на вывод всех провайдеров
        this.$root.$on(this.EVENT_LIST.PROVIDER_CHOOPSE,  (arr) => {
            console.info('Пришел массив с провайдерами', arr)
            //TODO выбираем диагноз минуя симптомы , кликаем на любой провайдер и все провайдеры пропадают из-за того что arr приходязий оказывается пусто 
            if(!arr || arr.length === 0){
                vm.loa = false // скрыть карту 
                vm.provider = arr
            }else{
                vm.provider =  arr;
                vm.loa = true // показать карту
            }
            

        });
        // Вывод id провайдера
        this.$root.$on(this.EVENT_LIST.OPEN_CASE,  (arr) => {
            // this.$root.$emit(this.EVENT_LIST.TRIGGER, '312312')
            this.activeIndex = arr.json_sirius_test.id_provider
            // setTimeout(() => {
            //     console.log(document.getElementById(arr.json_sirius_test.id_provider).classList.add(''))
            // }, 2000);
            
        });
        //
        this.$root.$on(this.EVENT_LIST.SET_ADDRESS, (arr) => {
            this.fullAddress = arr.address
            vm.fullAddress = `${arr.country} ${arr.city} ${arr.address}`;
            console.log('Полный адрес для построения маршрута страна/город/улица',vm.fullAddress)
            if (typeof (arr.point) === 'object') {
                vm.startCoord = `${arr.country} ${arr.city}`;
                ymaps.geocode(vm.startCoord).then((res) => {
                    const firstGeoObject = res.geoObjects.get(0);
                    vm.center = firstGeoObject.geometry.getCoordinates();
                });
                // axios({
                //     method: 'post',
                //     url: `${vm.apiSrv}/api/directory/citypoint`,
                //     data: {
                //         id_ref_city: arr.id_ref_city,
                //         lat: vm.center[0],
                //         lon: vm.center[1],
                //     },
                // }).then((res) => {
                //     console.log('ЗАПИСАЛ')
                // });
            } else {
                vm.center = arr.point;
            }
        });
    },
    beforeMount() {
        if (document.getElementById('yandexMap')) return; // was already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=93424a51-f8a1-4a0e-9232-5db12cde0ba4';
        scriptTag.id = 'yandexMap';
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
        this.apiSrv = this.$store.state.apiServer;
    },
    methods: {
        chooseProv(e, target) {
            e.preventDefault();
            const parent = e.target.parentNode;
            console.log(parent)
            for (let i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i].className == 'pr_adr') {
                    this.pick = parent.childNodes[i].textContent;
                    // console.log(this.pick)
                    // this.$root.$emit(this.EVENT_LIST.SET_SELECTED_NAME_PROVIDER, this.pick);
                }
                if(parent.childNodes[i].className == 'id_provider') {
                    console.log(parent.childNodes[i].textContent)
                    this.activeIndex = parent.childNodes[i].textContent
                    this.$root.$emit(this.EVENT_LIST.SET_SELECTED_PROVIDER, Number(parent.childNodes[i].textContent)); // ПИШЕТ В ФИНАЙЛЬНЫЙ ФАЙЛ 
                }
            }

            const { controls } = this;
            if (this.myMap == '') {
                this.myMap = new ymaps.Map('map', {
                    center: this.center,
                    zoom: 10,
                    controls: [],
                });
            }
            this.myMap.controls.add('routePanelControl', {
                maxWidth: 300,
                visible: false,
            });
            const control = this.myMap.controls.get('routePanelControl');
            console.log(this.fullAddress)
            console.log(this.pick)
            control.routePanel.state.set({
                from: this.fullAddress, // ОТКУДА
                to: this.pick, // КУДА
            });

            // var cntr = this.myMap.controls.get('routePanelControl');
            // var multiRoutePromise = cntr.routePanel.getRouteAsync();
            // multiRoutePromise.then(function(multiRoute) {
            //     //https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/router/routePanel-docpage/
            //     multiRoute.model.events.add('requestsuccess', function() {
            //         var activeRoute = multiRoute.getActiveRoute();
            //         if (activeRoute) {
            //             console.log("Длина: " + activeRoute.properties.get("distance").text);
            //             console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
            //         }
            //     });
            // }, function (err) {console.log(err);});   // ** Получение расстояния и времени ** //
            //  let parent = e.target.parentNode
            // for(var i=0 ; i< parent.childNodes.length; i++){
            //    if(parent.childNodes[i].className == "pr_adr"){
            //     this.pick = parent.childNodes[i].textContent;
            //    }
            // }
        },
    },

};
</script>
<style scoped>
.img-box{
    max-width: 2rem;
    position: absolute;
    left: 1rem;
}
.svg{
    max-width: 100%;
    height: 1rem;
    transition: 1s all;
}
#map {
    max-width:  100%;
    height: 50%;
}
.providers {
    padding-left: 3rem;
    padding-top: 1rem;
    padding-right: 1rem;
    text-align: left;
    position: relative;
    cursor: pointer;
}

.provider {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--lightgrey);
    transition: 0.5s all;
}

.pr_name {
    font-size: 0.85rem;
    font-weight: 300;
}
.pr_adr {
    font-size: 0.9rem;
    padding: 0.5rem 0 ;
    font-weight: 400;
    display: flex;
    align-items: center;
}
.pr_doc {
    font-weight: 300;
    font-size: 0.85rem
}
.pr_data{
    font-weight: 300;
    font-size: 0.85rem;
    padding-top: 0.5rem;
    display: flex;
    align-items: center;
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
    width: 25rem;
    box-shadow: 0px 0px 10px rgba(177, 181, 193, 0.3);
    height: 85vh;
    overflow: auto;

}
.red{
    box-shadow: 0px 0px 5px rgba(177, 181, 193, 0.3);
    padding: 0.5rem;
    margin-bottom: 1rem;
}
</style>
