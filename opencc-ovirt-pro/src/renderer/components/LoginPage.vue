<template>
  <el-container>
    <el-header>
      <!-- <el-button @click="button_seting_clicked">设置</el-button> -->
      <!-- <el-button @click="button_help_clicked">帮助</el-button> -->
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

      <!-- <el-tooltip
        content="帮助手册"
        :open-delay="500"
        :enterable="false"
        :hide-after="2000"
        placement="bottom"
        effect="light"
      >
        <el-button
          @click="button_help_clicked"
          icon="el-icon-question"
          circle
        ></el-button>
      </el-tooltip> -->

      <el-tooltip
        content="设置"
        :open-delay="1000"
        :enterable="false"
        :hide-after="2500"
        placement="bottom"
        popper-class="tooltip-text"
        effect="light"
      >
        <el-button
          @click="button_seting_clicked"
          icon="el-icon-setting"
          circle
        ></el-button>
      </el-tooltip>
    </el-header>

    <el-main>
      <img :src="loginLogo" alt="客户端logo" style="float:left" />

      <el-form ref="form" :model="form" label-width="0" style="float:left">
        <el-form-item>
          <div class="client-title"></div>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.uname" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="form.passwd"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="form.centerip" placeholder="请选择中心">
            <el-option
              v-for="item in centerinfo"
              :label="item.centerip"
              :value="item.centeripport"
              :key="item.centerip"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-checkbox-group v-model="form.func">
            <el-checkbox
              :checked="rembpasswd"
              class="el-checkbox-left"
              label="记住密码"
              name="rembpasswd"
              @change="checkbox_rembpasswd"
            ></el-checkbox>
            <el-checkbox
              :checked="autologin"
              class="el-checkbox-right"
              label="自动登录"
              name="autologin"
              @change="checkbox_autologin"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="commitBtnDisable"
            class="el-btn-commit"
            type="primary"
            @click="button_commit_clicked"
            >{{ loginbutton_text }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
const loginipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'login-page',
  data() {
    return {
      loginLogo: require('@/images/company_logo.png'),
      form: {
        uname: '',
        passwd: '',
        domain: 'internal',
        centerip: '',
        func: [],
      },
      loginbutton_text: '登 录',
      commitBtnDisable: false, // 登录按钮是否禁用
      rembpasswd: false, // 记住密码状态
      autologin: false, // 自动登录状态
      centerinfo: [], // 选择中心
    }
  },

  methods: {
    // 打开设置界面
    button_seting_clicked() {
      this.$router.push({ path: '/seting/center' })
    },
    // 帮助手册
    button_help_clicked: function() {
      console.log('button_help_clicked')
      // alert('打开帮助手册')
    },
    // 最小化
    button_mini_clicked() {
      console.log('button_mini_clicked')
      loginipc.send('client-mini')
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
        loginipc.send('client-close')
      })
    },
    // 登录提交按钮
    button_commit_clicked() {
      if (this.form.uname === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.form.passwd === '') {
        this.$message.error('密码不能为空')
        return
      }
      if (this.form.centerip === '') {
        this.$message.error('中心不能为空')
        return
      }

      this.loginbutton_text = '登录中...'
      this.commitBtnDisable = true
      let loginDate = {
        username: this.form.uname,
        password: this.form.passwd,
        centerip: this.form.centerip,
      }
      loginipc.send('loginvalidate', loginDate)
    },
    // ----------------------- 添加选择框交互事件 : top ---------------------------
    // 选择框 - 记住密码
    checkbox_rembpasswd() {
      if (this.rembpasswd) {
        this.rembpasswd = false
        this.autologin = false
        this.form.func = []
      } else {
        this.rembpasswd = true
        this.autologin = false
        this.form.func = ['记住密码']
      }
    },
    // 选择框 - 自动登录
    checkbox_autologin() {
      if (this.autologin) {
        this.autologin = false
        this.rembpasswd = false
        this.form.func = []
      } else {
        this.autologin = !this.autologin
        this.rembpasswd = true
        this.form.func = ['记住密码', '自动登录']
      }
    },
    // ----------------------- 添加选择框交互事件 : end ---------------------------
  },

  mounted() {
    let tmpargs = {}
    loginipc.send('getallcentervalue', tmpargs) //首先要获取到后台所有中心的数据
    loginipc.send('getloginstatusdata', tmpargs) //其次先要获取到上次登录的信息反馈到界面进行初四花

    //得到上次登录的状态信息初始化到界面来决定客户端是否自动登录记住密码等操作
    let initloginstatus = (channel, args) => {
      if (args.data.autologin) {
        //如果选择自动登录
        this.form.uname = args.data.username
        this.form.passwd = args.data.password
        this.form.centerip = args.data.centerip
        this.autologin = true
        this.rembpasswd = true
        this.form.func = ['记住密码', '自动登录']
        this.button_commit_clicked()
      } else if (args.data.rembpasswd && !args.data.autologin) {
        //如果记住密码
        this.form.uname = args.data.username
        this.form.passwd = args.data.password
        this.form.centerip = args.data.centerip
        this.rembpasswd = true
        this.autologin = false
        this.form.func = ['记住密码']
      } else {
        this.form.uname = ''
        this.form.passwd = ''
        this.form.centerip = ''
        this.rembpasswd = false
        this.autologin = false
        this.form.func = []
      }
    }

    //得到中心所有的信息然后初始化到界面
    let initcentercallback = (channel, args) => {
      let tmpData = []
      for (let i = 0; i < args['data'].length; i++) {
        let tmpdict = {}
        tmpdict['centerip'] = args['data'][i]['centerip']
        tmpdict['centerport'] = args['data'][i]['centerport']
        tmpdict['centerdomain'] = args['data'][i]['centerdomain']
        tmpdict['centeripport'] =
          args['data'][i]['centerip'] + ':' + args['data'][i]['centerport']
        tmpData.push(tmpdict)
      }
      this.centerinfo = tmpData
    }

    //登录认证成功之后的处理函数
    let loginvalidatefunc = (channel, args) => {
      this.loginbutton_text = '登 录'
      this.commitBtnDisable = false

      if (args['status'] === false) {
        if (args['error'] === 'forceclose') {
          return
        }
        this.$message.error(args['error'])
      } else {
        this.$message({
          message: '登录认证成功',
          type: 'success',
        })
        this.$router.push({ path: '/home', query: { userinfo: this.form } })
        //在此添加保存登录的信息到本地配置文件 -top
        let loginStatusDate = {
          username: this.form.uname,
          password: this.form.passwd,
          centerip: this.form.centerip,
          domain: this.form.domain,
          rembpasswd: this.rembpasswd,
          autologin: this.autologin,
        }
        loginipc.send('loginstatusdata', loginStatusDate)
        //在此添加保存登录的信息到本地配置文件 -end
      }
    }

    loginipc.on('loginvalidateover', loginvalidatefunc)
    loginipc.on('getallcentervalueover', initcentercallback)
    loginipc.on('getloginstatusdataover', initloginstatus)
  },
  destroyed() {
    loginipc.removeAllListeners('loginvalidateover')
    loginipc.removeAllListeners('getallcentervalueover')
    loginipc.removeAllListeners('getloginstatusdataover')
  },
}
</script>

<style scoped>
.el-container {
  width: 920px;
  height: 580px;
}
.el-main {
  margin: 0;
  padding: 0;
  text-align: center;
}

.el-header {
  /* 使区域可以拖动 */
  -webkit-app-region: drag;
}
.el-header button {
  -webkit-app-region: no-drag;

  float: right;
  margin-top: 10px;
  margin-left: 10px;

  /* 修改按钮大小 */
  padding: 6px;
}

.el-main img {
  margin-top: 90px;
  margin-left: 60px;
}

.el-form {
  width: 350px;
  margin: 0;
  padding: 0;
  margin-top: 40px;
  margin-left: 100px;
}
div.client-title {
  background-image: url('../images/client_logo.png');
  width: 178px;
  height: 43px;

  margin: 0 auto;
}
.el-select {
  width: 100%;
}
.el-checkbox-group {
  width: 100%;
}
.el-checkbox-left {
  float: left;
}
.el-checkbox-right {
  float: right;
}
.el-btn-commit {
  width: 100%;
}

/* 文字提示 : popper-class="tooltip-text" : 显示样式设置 */
.tooltip-text {
  color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
