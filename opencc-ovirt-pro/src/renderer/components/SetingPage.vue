<template>
  <el-container class="set-page">
    <el-header style="height:50px">
      <span>设置</span>
      <el-button
        icon="el-icon-back"
        circle
        @click="button_back_clicked"
      ></el-button>
      <!-- <el-button @click="button_help_clicked">帮助</el-button> -->
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/seting/center">
            <i class="el-icon-menu"></i>
            <span slot="title">中心</span>
          </el-menu-item>

          <el-menu-item index="/seting/sethosts">
            <i class="el-icon-edit"></i>
            <span slot="title">域名</span>
          </el-menu-item>

          <el-menu-item index="/seting/about">
            <i class="el-icon-setting"></i>
            <span slot="title">关于</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding:15px 0;">
        <!-- 设置页面子页面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'seting-page',
  methods: {
    button_back_clicked: function() {
      this.$router.push({ path: '/' })
    },
    // button_help_clicked: function(){
    // },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
  },
}
</script>

<style scoped>
.set-page {
  width: 920px;
  height: 580px;
}

.el-header {
  height: 20px;
  background-color: #00294c;

  -webkit-app-region: drag;
}

.el-header span {
  font-size: 13pt;
  color: white;
  float: left;
  margin-top: 10px;
}

.el-header .el-button {
  float: right;
  padding: 6px;
  margin-top: 10px;
  -webkit-app-region: no-drag;
}

.el-aside {
  /* width: 150px; */
  /* height: 100%; */
  background-color: #eaedef;
}
.el-aside .el-menu {
  background-color: transparent;
}
</style>
