<template>
  <div style="padding-top:20px ;padding-left:40px">
    <div class="about-text">产品名称 : OpenCC</div>
    <br />
    <div class="about-text">版 本 号 : {{ editionNum }}</div>
    <br />
    <div class="about-text">描 述：开源oVirt云桌面客户端</div>
    <br />
    <div class="about-text">支 持：oVirt中文社区（www.cnovirt.com）</div>
    <br />
    <div class="about-text">授权协议：MIT</div>
  </div>
</template>

<script>
export default {
  name: 'seting-about-page',
  data() {
    return {
      editionNum: 'V2.0.1.20201118',
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
