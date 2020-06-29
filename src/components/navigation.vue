<template> 
  <nav>
    <router-link
      to="/"
      id="v-step-0"
    >
      <svg
        id="logo"
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="33"
        viewBox="0 0 48.19 48.16"
      >
        <defs />
        <title>Логотип</title>
        <path
          class="logo-cls-1"
          d="M37.1,36.87"
          transform="translate(-7.92 -7.88)"
        />
        <polygon
          class="logo-cls-1"
          points="0 20.12 12 20.12 12 36.16 28.12 36.16 28.12 48.16 0 48.16 0 20.12"
        />
        <polygon
          class="logo-cls-1"
          points="48.19 28.04 36.19 28.04 36.19 12 20.07 12 20.07 0 48.19 0 48.19 28.04"
        />
        <path
          class="logo-cls-1"
          d="M41,27.22"
          transform="translate(-7.92 -7.88)"
        />
      </svg>
    </router-link>    <!--  SVG логотипа-->
    <!--  Группировка для центральный элементов-->
    <div class="nav-group">
      <router-link
        to="/add"
        id="v-step-1"
      >
        <svg
          id="add"
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 56 56"
        >
          <defs />
          <title>Регистрация нового дела</title>
          <rect
            id="second-line"
            class="add-cls-1"
            x="24"
            width="10"
            height="56"
          />
          <rect
            id="first-line"
            class="add-cls-1"
            x="28"
            y="4"
            width="10"
            height="56"
            transform="translate(60 -4) rotate(90)"
          />
        </svg>
      </router-link>  <!--  SVG кнопки добавить дело-->
      <!--  -->
      <router-link
        to="/documents"
       
        id="v-step-3"
      >
        <svg
          id="list"
          xmlns="http://www.w3.org/2000/svg"
          width="25.04"
          height="35.05"
          viewBox="0 0 24.04 32.05"
        >
          <defs />
          <title>Список дел</title>
          <polygon
            id="list-box"
            class="list-cls-1"
            points="24 8.04 24 32.05 0 32.05 0 0.05 16.05 0.05 24 8.04"
          />
          <rect
            id="line"
            class="list-cls-2"
            x="3.92"
            y="12.06"
            width="16.06"
            height="2"
          />
          <rect
            id="line-2"
            data-name="line"
            class="list-cls-2"
            x="3.92"
            y="16.06"
            width="16.06"
            height="2"
          />
          <rect
            id="line-3"
            data-name="line"
            class="list-cls-2"
            x="3.92"
            y="20.06"
            width="16.06"
            height="2"
          />
          <polygon
            id="angel"
            class="list-cls-3"
            points="24.04 8.08 16 8.08 16 0 16.05 0.05 24 8.04 24.04 8.08"
          />
        </svg>
      </router-link>  <!--  SVG кнопки список -->
      <router-link
        to="/mail"
        class="icon-disable"
        id="v-step-2"
      >
        <svg
          id="mail"
          xmlns="http://www.w3.org/2000/svg"
          width="33.66"
          height="35.25"
          viewBox="0 0 33.66 25.25"
        >
          <defs />
          <title>Почта</title>
          <rect
            id="letter"
            class="mail-cls-1"
            x="0.83"
            y="0.7"
            width="32"
            height="24"
          />
          <polyline
            id="top-line"
            class="mail-cls-2"
            points="0.83 0.7 16.83 17.16 32.83 0.7"
          />
          <line
            class="mail-cls-2"
            x1="32.83"
            y1="24.7"
            x2="23.35"
            y2="10.46"
          />
          <line
            class="mail-cls-2"
            x1="10.32"
            y1="10.47"
            x2="0.83"
            y2="24.7"
          />
        </svg>  <!--  SVG кнопки почта-->
      </router-link>
      <!--  -->
      <v-tour
        class="tour"
        name="myTour"
        :steps="steps"
        :options="myOptions"
        :callbacks="myCallbacks"
      />
    </div>
    <!--  Группировка для кнопки 'другие значки'-->
    <div class="nav-more">
      <router-link
        to="/tools"
        id="v-step-4"
      >
        <svg
          id="more-tools"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="33"
          viewBox="0 0 48.01 40.06"
        >
          <defs />
          <title>Все инструменты</title>
          <path
            class="tools-cls-1"
            d="M37.1,40.87"
            transform="translate(-8 -12)"
          />
          <path
            class="tools-cls-1"
            d="M41,31.22"
            transform="translate(-8 -12)"
          />
          <rect
            class="tools-cls-1"
            x="0.01"
            width="48"
            height="8"
          />
          <rect
            class="tools-cls-1"
            y="16"
            width="48"
            height="8"
          />
          <rect
            class="tools-cls-1"
            y="32.06"
            width="48"
            height="8"
          />
        </svg>
      </router-link>  <!--  SVG кнопки все инсутрументы -->
    </div>
     
    <router-view />
  </nav>
</template>

<script>
export default {
    data(){
        return{
            myOptions: {
                labels: {
                    buttonSkip: 'Выключить',
                    buttonPrevious: 'Назад',
                    buttonNext: 'Далее',
                    buttonStop: 'Завершить'
                }
            },
            myCallbacks:{
                onStop: this.onStop
            },
            steps: [
                {
                    target: '#v-step-0',  // We're using document.querySelector() under the hood
                    content: `Логотип сириуса красив как никогда! Нажав на эту кнопку (логотип), вы перейдете на стартовую страницу`
                },
                {
                    target: '#v-step-1',  // We're using document.querySelector() under the hood
                    content: `Кнопка регистрация нового дела ! Кликнув по ней, вы перейдете на страницу, где сможете зарегистрировать новое дело.`
                },
                {
                    target: '#v-step-2',  // We're using document.querySelector() under the hood
                    content: `Как вы моежете заметить, данная кнопка еще не доступна , для того чтобы ее разблокировать отправьте короткое смс с текстом 'хайп' на номер 555-7777`
                },
                {
                    target: '#v-step-3',  // We're using document.querySelector() under the hood
                    content: `Кнопка "Список дел"  функционал которой находится в разработке по клику перейдете на страницу со всеми делалми , так по крайней мере планируется `
                },
                {
                    target: '#v-step-4',  // We're using document.querySelector() under the hood
                    content: `Кнопка "Все инструменты" перенес вас в место где будут все инструменты , звучит странно но это так!`
                },
            ]
        }
    },
    computed: {
        selectedWatch() { // HACK
            return this.$store.state.navTour
        }
    },
    mounted: function () {
        if(this.$store.state.navTour == true){
            // this.$tours['myTour'].start() 
        }
    },
    methods: {
        onStop () {
            this.$store.commit('navTour', false)
            // this.$store.commit('topTour', true)
        }
    }
}
</script>

<style scoped>
nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    width: 5rem;
    max-width: 3.125rem;
    background: var(--white);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding: 1rem 0;
    z-index: 10;
    text-align: center;
}
.nav-group svg{
    margin-bottom: 0.5rem;
}
/* Стили для иконки список дел  */
#list{
    transition: 1s all;
}
#list:hover{
    transform: scale(1.1);
    transition: 1s all;
}
#list:hover .list-cls-1{
    transition: 0.5s all;
    fill: var(--blue);

}
#list:hover .list-cls-3{
    transition: 0.5s all;
    fill: var(--grey);
}
.list-cls-1 {
    fill: #6dabcf;
}

.list-cls-2 {
    fill: #fff;
}

.list-cls-3 {
    fill: #4c7ca6;
}

.mail-cls-1 {
    fill: #6dabcf;
}
/* Стили для иконки  почта */
.mail-cls-2 {
    fill: none;
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 2px;
}
/* Стили для иконки  почта */
.tools-cls-1 {
    fill: var(--rageblue);
    transition: 0.5s all;
}

#more-tools:hover .tools-cls-1 {
    transition: 0.5s all;
    fill: var(--blue);
}

.icon-disable {
    opacity: 0.4;
    filter: blur(1px);
    pointer-events: none;
}

/* Стили для иконки  логотип  */
.logo-cls-1 {
    fill: var(--rageblue);
    transition: 1s all;
}

#logo:hover .logo-cls-1 {
    fill: var(--blue);
}
/* Стили для иконки  добавить новое дело  */
#add:hover {
    transform: scale(1.2);
    transition: 1s all;
}

#add:hover .add-cls-1 {
    fill: var(--blue)
}

#add {
    transition: 1s;
}

.add-cls-1 {
    fill: var(--rageblue);
    transition: 0.5s;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;
}

nav img {
    max-width: 2rem;
    cursor: pointer;
}

.nav-active {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.nav-icon {
    max-width: 3rem;
    padding: 0.5rem;
}

</style>
