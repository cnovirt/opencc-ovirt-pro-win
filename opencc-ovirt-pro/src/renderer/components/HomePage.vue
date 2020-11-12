<template>
  <el-container class="home-page">
    <el-header style="height: 55px;">
      <el-button
        @click="button_close_clicked"
        icon="el-icon-close"
        circle
      ></el-button>

      <el-button
        @click="button_mini_clicked"
        icon="el-icon-minus"
        circle
      ></el-button>

      <el-tooltip
        :content="loginusername"
        :open-delay="1000"
        :enterable="false"
        :hide-after="3000"
        placement="bottom"
        popper-class="tooltip-text"
        effect="light"
      >
        <el-button icon="el-icon-user" circle></el-button>
      </el-tooltip>

      <el-tooltip
        content="退出登录"
        :open-delay="1000"
        :enterable="false"
        :hide-after="3000"
        placement="bottom"
        popper-class="tooltip-text"
        effect="light"
      >
        <el-button
          icon="el-icon-back"
          circle
          @click="button_back_clicked"
        ></el-button>
      </el-tooltip>

      <el-tooltip
        content="刷新"
        :open-delay="1000"
        :enterable="false"
        :hide-after="3000"
        placement="bottom"
        popper-class="tooltip-text"
        effect="light"
      >
        <el-button
          icon="el-icon-refresh"
          circle
          :disabled="button_flush_disabled"
          @click="button_flush_clicked"
        ></el-button>
      </el-tooltip>
      <!-- <el-button class="btn-out el-icon-more-outline" @click="button_back_clicked" circle></el-button> -->
    </el-header>

    <el-main style="margin: 0px; padding: 0px;">
      <template>
        <el-carousel trigger="click" :autoplay="false">
          <el-carousel-item
            v-for="(vmsPage, index) in vmsinfo"
            autoplay="false"
            :key="index"
          >
            <el-container class="card-list">
              <v-card
                v-for="itemvm in vmsPage"
                :cardvm="itemvm"
                :key="itemvm.id"
              ></v-card>
            </el-container>

            <!-- <v-card v-for="itemvm in vmsPage" :cardvm="itemvm" ></v-card> -->
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import vCard from '@/components/CardPage/vCard'
const homepageipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'home-page',
  components: {
    vCard,
  },
  data() {
    return {
      vmsinfo: [],
      button_flush_disabled: false,
      loginusername: '',
    }
  },
  mounted() {
    // 登录页面传递用户名称
    this.loginusername = this.$route.query.userinfo.uname

    // 获取用户虚拟机列表
    let getallvminfofunc = (channel, args) => {
      this.flush_button_setenable(true) // 打开刷新按钮
      if (args.status === false) {
        if (!args.timerupdateinfo === true) {
          this.$message.error(args.error)
        }
      } else {
        if (!args.timerupdateinfo === true) {
          this.$message({
            type: 'success',
            message: '获取虚拟机信息成功',
          })
        }
        this.vmsinfo = []

        let tmpcount = 0
        let tmpdict = []
        for (let i = 0; i < args.data.length; i++) {
          let item_info = args.data[i]
          tmpcount = tmpcount + 1
          tmpdict.push(item_info)
          if (tmpcount >= 3) {
            this.vmsinfo.push(tmpdict)
            tmpdict = []
            tmpcount = 0
          }
          if (i === args.data.length - 1) {
            if (tmpdict.length === 0) {
            } else {
              this.vmsinfo.push(tmpdict)
            }
          }
        }
      }
    }

    // 退出列表界面
    let logoutfunc = (channel, args) => {
      this.$message({
        type: 'success',
        message: '成功退出',
        duration: 1000,
      })
      this.$router.push({ path: '/' })
    }

    //信号发送者 -top
    let argdict = {}
    homepageipc.send('getallvminfo', argdict) //开始获取所有虚拟机的信息
    homepageipc.on('homepagelogoutover', logoutfunc)
    homepageipc.on('getallvminfoover', getallvminfofunc)
    //信号发送者 -end

    //登录成功之后需要每隔一段时间就需要重新获取token 和刷新虚拟机列表 -top
    this.initHomeTimer = setInterval(() => {
      let argdict = { data: 'timerupdateinfo' }
      homepageipc.send('getallvminfo', argdict) //开始获取所有虚拟机的信息
    }, 3000)

    this.timerupdatetoken = setInterval(() => {
      let argdict = { data: 'timeupdatetoken' }
      homepageipc.send('timeupdatetoken', argdict) //开始获取所有虚拟机的信息
    }, 1000 * 60 * 20)
    //登录成功之后需要每隔一段时间就需要重新获取token 和刷新虚拟机列表 -end
  },
  destroyed() {
    homepageipc.removeAllListeners('homepagelogoutover')
    homepageipc.removeAllListeners('getallvminfoover')

    clearInterval(this.initHomeTimer)
    clearInterval(this.timerupdatetoken)
  },

  methods: {
    // 退出登录
    button_back_clicked() {
      this.$confirm('确认是否退出登录？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        let argdict = {}
        homepageipc.send('homepagelogout', argdict)
      })
    },
    // 更新按钮 - 更新按钮状态和信息
    flush_button_setenable(b) {
      if (b === false) {
        this.button_flush_disabled = true
      } else {
        this.button_flush_disabled = false
      }
    },
    //点击刷新按钮
    button_flush_clicked() {
      this.flush_button_setenable(false)
      let argdict = {}
      homepageipc.send('getallvminfo', argdict) //开始获取所有虚拟机的信息
    },
    // 最小化
    button_mini_clicked() {
      console.log('button_mini_clicked')
      homepageipc.send('client-mini')
    },
    // 关闭客户端
    button_close_clicked() {
      console.log('button_close_clicked')
      this.$confirm('确定关闭客户端?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 退出客户端信号
        homepageipc.send('client-close')
      })
    },
  },
}
</script>

<style scoped>
.home-page {
  width: 920px;
  height: 580px;

  background-image: url('../images/vmlist_background.jpg');
  background-repeat: no-repeat;
}
.el-header {
  -webkit-app-region: drag;
}
.el-header .el-button {
  padding: 6px;
  -webkit-app-region: no-drag;

  float: right;
  background-color: transparent;
  color: white;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 10px;
}

/* 走马灯样式 - top */
/* 滚动区域 */
.el-carousel {
  height: 525px;
}

/* 虚拟机卡片展示区域 */
.el-carousel__container div.el-carousel__item {
  height: 440px;
  /* background-color: rgba(204, 204, 204, 0.2); */
}
/* 虚拟机卡片 */
.card-list {
  float: left;
  padding-top: 80px;
}
.card-list .el-card {
  margin-left: 54px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.card-list .el-card:hover {
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* 虚拟机展示 : 左右导航按钮 */
.el-carousel >>> button.el-carousel__arrow {
  margin-top: 60px;
}

/* 虚拟机展示 : 下方导航条 */
.el-carousel >>> .el-carousel__indicators {
  margin-bottom: 30px;
}

/* 展示区域 : 奇偶页面 */
/* .el-carousel__item:nth-child(2n) {
  background-color: #3d4aff;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #38f08a;
} */

/* 走马灯样式 - end */

/* 文字提示 : popper-class="tooltip-text" : 显示样式设置 */
.tooltip-text {
  color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
