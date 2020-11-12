<template>
  <div style="padding-top:20px ;padding-left:40px">
    <div class="about-text">产品名称 : 开源OVIRT客户端</div>
    <br>
    <div class="about-text">版 本 号 : {{ editionNum }}</div>
  </div>
</template>

<script>
export default {
  name: 'seting-about-page',
  data() {
    return {
      editionNum: 'V1.0.0.20200604',
    }
  },
}
</script>

<style scoped>
.about-text {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.7);
}
</style>
