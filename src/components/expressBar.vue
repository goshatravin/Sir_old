<template>
  <div class="express">
    <div
      class="overlay"
      @click="closeAll"
      v-if="overlay"
    />
    <!-- <div class="close" @click="closeAll" v-if="overlay">Закрыть</div> -->
    <iframe
      frameborder="0"
      id="frame"
      name="theFrame"
      v-if="frame"
    />
    <div class="comments">
      <div
        class="comments__title"
        @click="showContent"
      >
        <p class="comments__text">
          Комментарий
        </p>
        <img
          class="comments__arrow"
          id="arrow"
          src="../assets/express-img/arrow.svg"
          alt="стрелочка"
        >
      </div>
      <div
        class="express__block"
        v-for="item in data"
        :key="item.desc"
        v-if="showComments"
      >
        <div class="express__description">
          <!-- <p class="express__text title">Описание</p> -->
          <p class="express__content">
            {{ item.desc }}
          </p>
        </div> 
        <div class="express__file">
          <div
            class="express__files"
            @click="getFile(file.id_claim_file)"
            v-for="file in item.files"
            :key="file.size"
          > 
            <div class="file__img--flex">
              <p
                class="file__size file__img"
                :class="file.extention"
                :title="file.name_file"
              />
              <div class="file__size file__size--small">
                {{ file.size }}
              </div>
            </div>
            <div class="file__desc--flex">
              <p class="file__size file__type">
                {{ file.file_type }}
              </p>
              <p class="file__size file__name">
                {{ file.name_file }}
              </p>
              <p class="file__size file__desc">
                {{ file.file_desc }}
              </p>
            </div>
          </div>
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
            data: [],
            showComments: true,
            getData: '',
            frame: false,
            overlay: false
        };
    },
    mounted(){
        this.$root.$on(this.EVENT_LIST.SET_FILES, (arr) => {
            // vm.$set(vm.hint, 'Situation', arr);
            this.data = arr
        //   console.log([...this.data.files])
        });
    },
    methods:{
        showContent:function(){
            this.showComments =! this.showComments
            if( document.getElementById('arrow').classList.contains('rotated')) {
                document.getElementById('arrow').classList.remove('rotated')
            }else{
                document.getElementById('arrow').classList.add('rotated');            }
        },
        getFile:function(id){
            axios({
                url: 'http://quasar.accidentlaw.ru/sirius/get_file?id_claim_file='+id,
                // Если поставить это условие, то сервер Квазара начнет ругаться на CORS.
                // withCredentials: true,
                method: 'GET',
            })
                .then(resp =>{
                    console.log(resp.data);
                    if(resp.data){
                        this.frame = true
                        this.overlay = true
                    }else{
                        this.frame = false
                        this.overlay = false
                    }
                    setTimeout(lol,1000)
                    function lol(){
                        window.open(resp.data,"theFrame");
                    }
                    
                })
        },
        closeAll:function(){
            this.overlay = false;
            this.frame = false;
        }
    }
};

</script>

<style scoped>
.close{
    position: absolute;
    right: 2rem;
    top: 5rem;
    background: var(--rageblue);
    color: var(--white);
    width: 5rem;
    height: 2.1rem;
    border-radius: 0.3125rem;
    border: none;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.overlay{
    position: absolute;
    opacity: 1;
    background: var(--grey);
    width: 100%;
    height: 95%;
    left: 0;
    cursor: pointer;
}
.iframe-button{
    width: 10rem;
    height: 10rem;
    background: red;
}
#frame{
    position: absolute;
    top: 5%;
    left:10%;
    width: 80rem;
    height: 57.5rem;
}
#frame:after{
    content: "12312";
}
.rotated{
    transform: rotate(180deg);
}
.comments__title{
    cursor: pointer;
}
.comments__title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left:var(--paddingleft);
    padding-right: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
}
.comments{
    border-bottom: 1px solid var(--grey);
    padding-bottom: 1rem;
}
.file__img{
    /* background: url("../assets/documents-img/file__img.svg"); */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height: 4rem;
    width: 4rem;
    cursor: pointer;
    margin-right: 0.5rem; 
}
.jpg{
    background: url("../assets/documents-img/jp.svg");
}
.jpeg{
    background: url("../assets/documents-img/jp.svg");
}
.mp3{
    background: url("../assets/documents-img/mp.svg");
}
.png{
    background: url("../assets/documents-img/pn.svg");
}
.doc{
    background: url("../assets/documents-img/doc.svg");
}
.pdf{
    background: url("../assets/documents-img/pd.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height: 4rem;
    width: 4rem;
    cursor: pointer;
}
.express__file{
    display: flex;
    flex-wrap: wrap;
}

.file__size{
    font-size: 0.8rem;
}
.file__name{
    color: var(--normalgrey);
    font-weight: 500;
}
.file__type{
    color: var(--normalgrey);
    font-weight: 500;
    padding-bottom: 0.5rem;
    text-align: right;
}
.file__desc{
    /* color: var(--normalgrey); */
    font-weight: 400;
    padding-top: 0.2rem;
}
.express{
    width: 20%;
    box-shadow: var(--boxShadow);
    background: var(--white);
    overflow-y:scroll;
    height: 95vh;
}
.express__content{
    font-size: 0.8rem;
    /* line-height: 1.3rem; */
}
.express__description{
    padding: 0.5rem 0;
    padding-left: var(--paddingleft);
    padding-right: 1rem;
    width: 100%;
}
.express__files{
    padding-left: var(--paddingleft);
    padding-right: 1.5rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.express__text{
    padding-bottom: 1rem;
    color: var(--normalgrey);
}
.file__img--flex{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.file__size--small{
    font-size: 0.7rem;
    color: var(--normalgrey);
}
</style>
