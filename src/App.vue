<template>
  <div id="app">
    <awayStatus />
    <router-view />
  </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
}
:root {
    /* default theme */
      /* --rageblue: #6CB2D9; */
    --white: #ffffff;
    --blue: #B7D6F5;
    --lightblue: rgb(226, 241, 255);
    --rageblue: #0892d0;
    --gren: #72D070;
    --lightgreen: #aae3b7;
    --black: #434F67;
    --grey: rgba(177, 181, 193, 0.4);
    --normalgrey: rgba(177, 181, 193);
    --lightgrey:  rgba(221, 222, 226, 0.4);
    --lightgrey:#EDF2F6;
    --red: #F5431A;
    --lightred: rgba(250, 212, 203, 0.52);
    --yellow: #fcc600;
     /* black theme */
    --paddingleft: 1.875rem;
    --boxShadow: 0px 0px 10px rgba(177, 181, 193, 0.3);
}
#app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: var(--black);
    background: linear-gradient( var(--rageblue), var(--white) 60%);
    /* background: #9CD3EC; */
}
a:visited {
    color: var(--black);
}
a:active {
    color: var(--black);
}
::-webkit-scrollbar { 
    display: none; 
}
.title-class,
.content-class{
    font-size: 1.3rem!important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.confirm-button-class{
    background: var(--rageblue)!important;
    font-weight: 400!important;
    font-size: 1rem!important;
    margin-top: 2rem!important;
}
.cancel-button-class{
    font-weight: 400!important;
    font-size: 1rem!important;
    margin-top: 2rem!important;
}
.popup-class{
    height: 18rem;
    padding: 2rem!important;
}

</style>

<script>
import awayStatus from '@/components/awayStatus.vue';

export default {
    components: {
        awayStatus,
    },
    created() {
        this.$http.interceptors.response.use(undefined, err => new Promise(function (resolve, reject) {
            if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
                this.$store.dispatch(logout);
            }
            throw err;
        }));

    },
};
</script>
