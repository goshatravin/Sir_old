
<template>
  <vue-particles
    id="particles-js"
    color="#dedede"
    :particle-opacity="0.7"
    :particles-number="80"
    shape-type="circle"
    :particle-size="4"
    lines-color="#6a92c4"
    :lines-width="1"
    :line-linked="true"
    :line-opacity="0.4"
    :lines-distance="150"
    :move-speed="3"
    :hover-effect="true"
    hover-mode="grab"
    :click-effect="false"
    click-mode="push"
  />
</template>
<script>
/**
* Отображение созвездий на экране входа
*/
export default {

};
</script>

<style scoped>
    #particles-js {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
