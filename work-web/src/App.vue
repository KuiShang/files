<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import './assets/styles/common';
body, html {
	 background: #F1F1F1;
   overflow-y: hidden;
   overflow-x: auto;
   height: 100%;
   min-width:1024px;
   font-family: 'Microsoft Yahei','微软雅黑','Avenir', Helvetica, Arial, sans-serif;
}
#app {
   -webkit-font-smoothing: antialiased;
   -moz-osx-: grayscale;
   text-align: center;
   color: #2c3e50;
   height: 100%;
}
</style>
