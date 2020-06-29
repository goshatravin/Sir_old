<template>
  <div class="top-panel" id="v-step-top-0">
    <div class="top-panel__page-info" id="v-step-top-1">
      <p class="top-panel__text">{{title }}
      </p>
      <!--Титульник страницы -->
    </div>
    <!-- <v-tour v-if="this.$store.state.topTour"  class="tour" name="myTourTop" :steps="steps" :options="myOptions" :callbacks="myCallbacks"></v-tour> -->
    <div class="top-panel-content">
      <div class="top-panel-content__user-info">
        <router-link to="personal">
          <p class="top-panel-content__text" id="v-step-top-2">{{ userNameToken }}</p>
        </router-link>
        <p class="top-panel-content__item">
          <!-- <select
            class="top-panel__select"
            :value="this.$store.state.selected"
            @change="blockScreen"
            id="v-step-top-3"
          > -->
          <select class="top-panel__select" @change="blockScreen" :value='this.$store.getters.selected'>
            <option 
            v-for="(option,index) in this.arrayStatuses" 
            :key="index" 
            :value="option.id_ref_catalog" 
            >
              <!--Статусы -->
              <!-- TODO: выводить в  {{ option.rus_name_catalog }} данные статуса -->
              {{ option.rus_name_catalog }}
            </option>
          </select>
        </p>
      </div>
      <!--  -->
      <div class="top-panel__img" @click="moreList">
        <div
          class="img-after"
          v-bind:class="{active: this.$store.getters.isActive, 'dinner': this.$store.getters.isDinner, 'away': this.$store.getters.isAway}"
        >
          <img
            class="top-panel__img-item"
            :src="'data:image/jpeg;base64,' + photoToken"
            alt="Фотография"
            id="v-step-top-4"
          />
          <!--Фотография юзера -->
        </div>
        <div class="top-panel-content__more">
          <div class="more__list" id="moreDots" v-if="moreShow">
            <!--Выпадающее меню  -->
            <span v-if="isLoggedIn">
              <a @click="logout">
                <p class="more__list-item">Выход</p>
              </a>
            </span>
            <router-link to="personal">
              <p class="more__list-item">Личный кабинет</p>
            </router-link>
            <router-link to="about">
              <p class="more__list-item">О программе</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      arrayStatuses: [
          {id_ref_catalog: 392, rus_name_catalog: 'Присутствую'}, 
          {id_ref_catalog: 393, rus_name_catalog: 'На обеде'}, 
          {id_ref_catalog: 394, rus_name_catalog: 'Перерыв'}
      ],
      checking: "Присутствую",
      awayStatus: 394,
      userNameToken: this.$store.getters.userName, //  токен с данными для отображения имени
      photoToken: this.$store.getters.photoToken || '', // токен с данными для отображения  фотографии 
    //   selectedStatus: this.$store.getters.selected,
      apiUrl: this.$store.getters.apiUrl,
      moreShow: false,
      isActive: this.$store.state.isActive,
      isDinner: this.$store.state.isDinner,
      isAway: this.$store.state.isAway,
      myOptions: {
        labels: {
          buttonSkip: "Выключить",
          buttonPrevious: "Назад",
          buttonNext: "Далее",
          buttonStop: "Завершить"
        }
      },
      myCallbacks: {
        onStop: this.onStop
      },
      steps: [
        {
          target: "#v-step-top-0", // We're using document.querySelector() under the hood
          content: `Верхняя рабочая панель которая будет преследоваь вас от страницы к странице содержит в себе наименование страницы на который вы находитесь  , инфомрацию о вас а именно фамилию имя и отчество  , статусы которые не надо забывать менять и конечно же аватарку`
        },
        {
          target: "#v-step-top-1", // We're using document.querySelector() under the hood
          content: `Тут находится  информация о странице на который вы находитесь `
        },
        {
          target: "#v-step-top-2", // We're using document.querySelector() under the hood
          content: `Здесь вы можете видеть кратнкую информацию о том под чьим аккаунтом вы сейчас зашли в систему `
        },
        {
          target: "#v-step-top-3", // We're using document.querySelector() under the hood
          content: `Статусы , сколько боли в этом слове , ваш текущий статус "Присутствую" что означает что вы находитесь на рабочем месте и готовы совершать героические поступки , перед тем как уйти на обед вы должны поставить статус "на обеде" либо "перерыв". При изменении статуса ваш экран заблокируется и для того что бы вернутся к работе требуется ввести пинкод - 1234`
        },
        {
          target: "#v-step-top-4", // We're using document.querySelector() under the hood
          content: `Ваше лицо идентификатором состояния. По клику на свое лицо попадете в личный кабинет`
        }
      ]
    };
  },
  mounted: function() {
    if (this.$store.state.topTour == true) {
    }
  },
    // computed: {
    //     selectedWatch: { // HACK
    //         handler() {
    //             console.log('This is topPanel handler')
    //         }
    //     }
    // },
  // TODO Не работает объявление функции в created(){} через this.getPhoto()
  // Выдает ошибку getPhoto() is not a function
  created() {
    console.log("This is topPanel apiUrl: ", this.apiUrl);
    axios({
      url: `${this.apiUrl}/api/user/toppanel`,
      withCredentials: true,
      method: "POST"
    })
      .then(resolve => {
        if (resolve.data.blocked && resolve.data.blocked === 1) {
          console.log("This is topPanel data", resolve.data);
          this.$store.dispatch("save_token", resolve.data.user);
          this.$store.dispatch('updateStatus', resolve.data.user.statuses)
        //   this.$store.commit("blockScreen", resolve.data.status);
          this.$store.dispatch("block__Screen", resolve.data.status);
        //   this.$store.dispatch("updateSelected", resolve.data.status);
          this.photoToken = this.$store.getters.photoToken;
          this.userNameToken = this.$store.getters.userName;
          console.log("This is topPanel status: ", resolve.data.status);
          console.log("Statuses: ", resolve.data.user.statuses);
        } else {
          const token = resolve.data.token;
          this.$store.dispatch("save_token", resolve.data); // Is neccessary,
          // otherwise an Exit button doesn't show
          this.$store.dispatch("updateStatus", resolve.data.statuses);
          this.$store.dispatch("updateSelected", 392);
          this.userNameToken = this.$store.getters.userName;
          this.photoToken = this.$store.getters.photoToken;
          console.log("Statuses: ", resolve.data.statuses);
        }
      })
      .catch(e => {
        console.log("This is topPanel Error: ", e);
      });
  },
  methods: {
    // getPhoto() {
    //     console.log('topPanel theme: ')
    //     let apiUrl = this.$store.getters.apiUrl
    //     axios({
    //             // url: 'http://docker.accidentlaw.ru:8081/api/user/login',
    //             // url: 'http://10.80.108.130:8081/api/user/login',
    //             // url: 'http://10.80.101.254:8081/api/user/login',
    //             // url: `${apiTest}/api/user/login`,
    //             url: `${apiUrl}/api/user/top_panel`,
    //             withCredentials: true,
    //             method: 'POST',
    //         })
    //         .then((resolve) => {
    //             const token = resp.data
    //             return token
    //             // const decoded = jwtDecode(token);
    //             // return this.photoToken = decoded.photo
    //         })
    //         .catch((e) => {
    //             console.log('This is topPanel Error: ', e)
    //         })
    // }
  },
  /**
   * Смотри за бездействием пользователя  и блокирует экран после  n миллисекунд
   *
   * @param {String} awayData  берем статус на перерыве а это 394
   *  если пользователь бездействует n миллисекунд вызываем функцию colorCahnge  которая находится в store.js передаваю в нее 394 статус
   *  после этого отправляет на сервер статус конкретного полтзователя и его id
   * @param {String} id_user - id пользователя
   * @param {String} id_status - статус пользователя
   */
  onIdle() {
    console.log("This is topPanel apiUrl: ", this.apiUrl);

    if (this.$store.state.dinerBlockpin == false) {
      console.log("This is topPanel awayStatus: ", this.awayStatus);
      this.$store.commit("blockScreen", this.awayStatus);
      axios({
        url: `${this.apiUrl}/api/user/changestatus`,
        withCredentials: true,
        data: {
          id_status: this.awayStatus,
          blocked: 1
        },
        method: "POST",
        withCredentials: true
      }).then(resp => {
        // if (resp.data.status === 'correct') {
        //     this.$store.commit('unblockScreen', '392');
        // }
        console.log("This is awayStatus response: ", resp);
      });
    }
  },

  /**
   * Смотрит за изменениями статусов
   */
  computed: {
    selectedWatch() {
      // HACK
      return this.$store.state.selected;
      return this.$store.state.isAway;
      return this.$store.state.isActive;
      return this.$store.state.topTour;
      if (this.$store.state.topTour == true) {
        this.$tours["myTourTop"].start();
        console.log("312321");
      }
    },
    /**
     * Если пользователь залогинился и имеет токен , появляется кнопка выхода и удалении такена
     */
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },

  /**
   * Отображение титульника страницы
   */
  props: {
    title: String
  },
  methods: {
    /**
     * Смена статусов при клике на панель всего 3 статуса  (Присутствую, на обеде, перерыв)
     *
     * @param {String} data  собирает данные по клику на статус
     *  по клику вызывает мутацию blockScreen  передавая туда собранные данные
     *  передает на сервер выбранный статус пользователя и id полтзователя
     * @param {String} id_user - id пользователя
     * @param {String} id_status - статус пользователя
     */
    blockScreen(e, target) {
        console.log("This is topPanel apiUrl2: ", this.apiUrl);
        if (e.target.value == "393" || e.target.value == "394") {
            this.$store.commit("blockScreen", e.target.value);
            console.log('This is topPanel e.target.value', e.target.value);
        }
        axios({
            url: `${this.apiUrl}/api/user/changestatus`,
            withCredentials: true,
            data: {
                idStatus: e.target.value,
                blocked: 1
            },
            method: "POST"
        }).then(resp => {
            if (resp.blocked === 1) {
                this.$store.commit("blockScreen", resp.status);
            }
            console.log("This is topPanel changeStatus data: ", resp);
        });
    },
    /**
     * Выход из системы
     */
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    /**
     * По клику на аватарку пользователя вызывает выпадающием меню.
     * @param {Boolean} moreShow - отображение панельки
     */
    moreList(e) {
      // const dropMenu = [...document.getElementsByClassName('top-panel__img')];
      this.moreShow = !this.moreShow;
    },
    onStop() {
      this.$store.commit("topTour", false);
      console.log("КОНЕЦ  ТОП");
    }
  }
};
</script>

<style scoped>
.tour {
  z-index: 1000;
}

.img-after {
  position: relative;
}

.active:after {
  width: 0.7rem;
  height: 0.7rem;
  background: var(--gren);
  content: " ";
  position: absolute;
  border-radius: 50%;
  bottom: 0.3rem;
  right: 0.3rem;
}

.dinner:after {
  width: 0.7rem;
  height: 0.7rem;
  background: var(--yellow);
  content: " ";
  position: absolute;
  border-radius: 50%;
  bottom: 0.3rem;
  right: 0.3rem;
}

.away:after {
  width: 0.7rem;
  height: 0.7rem;
  background: var(--yellow);
  content: " ";
  position: absolute;
  border-radius: 50%;
  bottom: 0.3rem;
  right: 0.3rem;
}

.top-panel-content__item {
  text-align: right;
}

.top-panel {
  background: var(--white);
  height: 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1rem 0rem 3.75rem;
  position: relative;
  box-shadow: var(--boxShadow);
  z-index: 10;
}

.top-panel-content__user-info {
  text-align: left;
}

.top-panel-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-panel__img-item {
  max-width: 2.8rem;
  max-height: 2.8rem;
  border-radius: 2rem;
  /* padding-top: 0.3rem; */
  margin-right: 0.4rem;
  margin-top: 0.3rem;
  border: 2px solid var(--blue);
  cursor: pointer;
}

/* .img-after{
    position: relative;
}
.img-after:after{ 
    content: " ";
    width:  0.7rem;
    height: 0.7rem;
    background: var(--red);
    border-radius: 50%;
    position: absolute;
    right: 0.5rem;
    bottom: 0.2rem;
} */
.top-panel-content__text {
  color: var(--black);
}

.top-panel-content__user-info {
  font-size: 0.8rem;
  padding: 0 1rem;
}

.top-panel-content__more {
  color: var(--rageblue);
  transition: 1s all;
  cursor: pointer;
  position: absolute;
  bottom: -7.6rem;
  right: 0;
  width: 12rem;
  background: var(--white);
  color: var(--black);
  box-shadow: var(--boxShadow);
}

.top-panel__select {
  border: none;
  max-width: 5.2rem;
  color: var(--black);
  border-radius: 0;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  background: none;
}

.more__list-item {
  padding: 0.7rem 0;
  transition: 0.5s all;
  text-align: left;
  padding-left: var(--paddingleft);
}

.more__list-item:hover {
  background: var(--grey);
  transition: 0.5s all;
}
</style>
