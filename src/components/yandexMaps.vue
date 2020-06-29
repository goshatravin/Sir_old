<template>
  <div>
    <div id="map" />
    <button
      text="asd"
      value="asd"
      @click="EMMIT()"
    >
      КНОПКА
    </button>
  </div>
</template>
<script>
import json from '../components/tmp_data.json'
export default {
    components: {
    },
    data() {
        return {
            myMap: '',
            yandexMapLoad:'',
            countRequestAPI:0,
            centerMap: [54.70649, 20.51095], 
            mapDestroy: true
        }
    },
    mounted() {
        this.$root.$on('createMap', (arr) => {
            this.countRequestAPI = 0
            //console.log(json)
            for(let type_create in arr){
                switch (type_create) {
                case 'createMap': 
                    this.buildMap(type_create, arr[type_create])
                    this.countRequestAPI++
                    break;
                case 'createRoad': 
                    this.buildMap(type_create, arr[type_create])
                    this.countRequestAPI++
                    break;
                case 'createPoint': 
                    this.buildMap(type_create, arr[type_create])
                    this.countRequestAPI = this.countRequestAPI + arr[type_create].length
                    break;
                }
            }
            //console.log(this.countRequestAPI)
        });

        const vm = this
        if (document.getElementById('yandexMap')) return; // was already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=93424a51-f8a1-4a0e-9232-5db12cde0ba4';
        scriptTag.id = 'yandexMap';
        scriptTag.onload = function() {
        
            ymaps.ready(function () {
                vm.yandexMapLoad = ymaps;
            });
        }
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
        this.apiSrv = this.$store.state.apiServer;
    },
    methods:{
        EMMIT(){
            const l = (Math.random()*100).toFixed(6);
            const lr = (Math.random()*100).toFixed(6);
            const points = [];
            for (let index = 0; index < 5; index++) {
                const point_l = (Math.random()*100).toFixed(6);
                const point_lr = (Math.random()*100).toFixed(6);
                const point_nm =  Math.random().toString(36).substring(2, 10) + ' ' +  Math.random().toString(36).substring(2, 10)
                points.push({lat:point_l, lon: point_lr, point_name:point_nm})
            }
            
            const MapParam = 
                {
                    createMap: {lat: l, lon: lr},
                    createRoad: {from:'Россия Калининград Минусинская 20', to:'Россия Калининград Кошевого 66'},
                    createPoint: points
                }
            this.$root.$emit('createMap',  MapParam)
        },
        buildMap(type, data){
            //console.log(type + ' ' + data)
            // Если просто строю карту по координатам
            if (type == 'createMap'){
                if (this.myMap != '') {
                    console.log("!")
                    this.mapDestroy = true
                }
                if (data.lat !=='' && data.lon !== ''){
                    this.centerMap = [parseFloat(data.lat), parseFloat(data.lon)]
                }
                if (this.mapDestroy && this.myMap != ''){
                    this.myMap.destroy()
                }
                this.myMap = new this.yandexMapLoad.Map('map', {
                    center: this.centerMap,
                    zoom: 10,
                    controls: [],
                });
            }
            // Если строю маршрут
            if (type == 'createRoad'){
                this.myMap.controls.add('routePanelControl', {
                    maxWidth: 300,
                    visible: false,
                });
                //this.$store.state.token.id_user --  id юзера
                const control = this.myMap.controls.get('routePanelControl');
                control.routePanel.state.set({
                    from: data.from,
                    to: data.to,
                });

                var cntr = this.myMap.controls.get('routePanelControl');
                var multiRoutePromise = cntr.routePanel.getRouteAsync();
                multiRoutePromise.then(function(multiRoute) {
                    //https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/router/routePanel-docpage/
                    multiRoute.model.events.add('requestsuccess', function() {
                        var wayPoints = multiRoute.getWayPoints(); 
                        wayPoints.each(function (point) {   
                            console.log(point.properties._data.address + ' - ' + point.properties._data.coordinates[1] + ':' + point.properties._data.coordinates[0])
                        });  
                        var activeRoute = multiRoute.getActiveRoute();
                        
                        if (activeRoute) {
                            console.log("Длина: " + activeRoute.properties.get("distance").text);
                            console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
                        }
                    });
                }, function (err) {console.log(err);});   // ** Получение расстояния и времени ** //
            }

            if (type == 'createPoint'){
                const objectManager = new this.yandexMapLoad.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32,
                    clusterDisableClickZoom: true
                });
                objectManager.objects.options.set('preset', 'islands#greenDotIcon');
                objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
                
                this.myMap.geoObjects.add(objectManager);
                objectManager.add(json)
                console.log()
            }
            //console.log(this.myMap)
        },
        createMap(param){
            if (this.myMap == '') {
                this.myMap = new this.yandexMapLoad.Map('map', {
                    center: [param[1], param[1]],
                    zoom: 10,
                    controls: [],
                });
            }
            this.myMap.controls.add('routePanelControl', {
                maxWidth: 300,
                visible: false,
            });
            //this.$store.state.token.id_user --  id юзера
            const control = this.myMap.controls.get('routePanelControl');
            control.routePanel.state.set({
                from: param[2],
                to: param[3],
            });
        }
    }
};
</script>

<style scoped>
</style>
