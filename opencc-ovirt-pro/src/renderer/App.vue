<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ovirt-client',
}
</script>

<style>
html,
body {
  margin: 0;
}
* {
  /* 禁用鼠标框选 */
  user-select: none;
}
#app{
  width:920px;
  height:580px;
}
</style>
