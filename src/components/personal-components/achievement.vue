<template>
    <div class="achivment">
        <div class="achivment-title">
            <p>Достижения</p>
        </div>
        <div class="achivment-block">
        <div class="achivment-item">
        <div class="item__fake lock">
        <div class="fake" />
        <p class="item__text">
            Протестируйте SIRIUS
        </p>
        </div>
        <div class="item__block">
            <img
            class="item__svg"
            src="../../assets/achivments/firstBlood.svg"
            alt=""
            title="Ты  один из первых, это достойно похвалы!"
            >
            <p class="item__text">
                О дивный новый мир
            </p>
        </div>
        </div>
        <div class="achivment-item" />
        <div class="achivment-item" />
        <div class="achivment-item" />
        <div class="achivment-item" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
        }
    },
};

</script>

<style scoped>
.achivment{
    background: white;
    width: 30rem;
    box-shadow: var(--boxShadow);
}
.achivment-title{
    border-bottom: 1px solid var(--grey);
    height: 3rem;
    display: flex;
    align-items: center;
    padding-left: var(--paddingleft);
    background: var(--blue);
}
.achivment-block{
    padding-top: 2rem;
}
.item__block{
    display: flex;
    flex-direction: column;
    text-align: center;
    max-width: 9rem;
    padding-top: 1rem;
    padding-left: var(--paddingleft);
    transition: 2s all;
    position: relative;
}
.fake{
    height: 5rem;
    width: 5rem;
    border: 3px dotted var(--black);
    opacity: 0.6;
    border-radius: 20px;
    margin-bottom: 0.5rem;
}
.item__fake{
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 9rem;
    padding-top: 1rem;
    padding-left: var(--paddingleft);
    transition: 2s all;
    position: relative;
    
}
.item__svg{
    height: 7rem;
    cursor: pointer;
}
/* .item__block:after{
    opacity:0;
    content: 'Получена: быть одним из первых пользователем SIRIUS';
    width: 6rem;
    height: 6rem;
    background: gold;
    position: absolute;
    top:1.5rem;
    left: 2.5rem;
    border-radius: 20px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    -webkit-transition: all 1s;
    transition: all 1s;

}
.item__block:hover:after{
   opacity: 1;
    -webkit-transition: all 1s;
    transition: all 1s;
} */
.item__text{
    font-size: 0.8rem;
    text-align: center;
}
.lock{
   display: none;
}
</style>
