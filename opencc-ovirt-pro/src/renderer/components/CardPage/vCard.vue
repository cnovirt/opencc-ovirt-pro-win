<template>
  <el-card
    :body-style="{ padding: '0px' }"
    shadow="hover"
    @click.native="cardOpen()"
    v-loading="if_v_loading"
    element-loading-color="red"
    element-loading-text="正在打开虚拟机"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255,255,255,0.8)"
  >
    <div class="show-img">
      <img v-bind:src="vminfo.systemIcon" class="image" />
    </div>
    <div style="padding: 14px;">
      <div class="system-text">
        {{ vminfo.systemName }}
        <el-tag :type="vminfo.systemType">{{ vminfo.systemStatus }}</el-tag>
      </div>

      <div>{{ vminfo.vmName }}</div>

      <div class="vm-bottom">
        <div class="time">运行时间 : {{ vminfo.runTime }}</div>
        <el-tooltip
          :content="vminfo.description"
          :open-delay="1000"
          :enterable="false"
          placement="bottom"
          effect="light"
          popper-class="tooltip-text"
        >
          <div class="discript">{{ vminfo.description }}</div>
        </el-tooltip>
      </div>
      <!-- 虚拟机操作按钮 -->
      <el-row>
        <el-tooltip
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
          content="开机 / 关机"
          placement="bottom"
          popper-class="tooltip-text"
          effect="light"
        >
          <el-button
            type="primary"
            icon="el-icon-switch-button"
            @click="handleVMCommand($event, 'updownvm')"
            :disabled="action_button_disabled"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
          content="断电"
          placement="bottom"
          popper-class="tooltip-text"
          effect="light"
        >
          <el-button
            type="primary"
            icon="el-icon-close"
            @click="handleVMCommand($event, 'stopvm')"
            :disabled="action_button_disabled"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
          content="重启"
          placement="bottom"
          popper-class="tooltip-text"
          effect="light"
        >
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="handleVMCommand($event, 'reboot')"
            :disabled="action_button_disabled"
            circle
          ></el-button>
        </el-tooltip>
      </el-row>
    </div>
  </el-card>
</template>

<script>
const itemvmipc = require('electron').ipcRenderer // 定义信号与槽函数接收者
const osIcon = require('@/utils/getSystemIcon')

export default {
  props: ['cardvm'],
  mounted() {
    // add by pbc -top

    // 操作虚拟机
    let action_vm_over = (channel, args) => {
      this.action_button_style('虚拟机操作', false)

      if (args.status == true) {
        this.$message({
          message: args.data,
          type: 'success',
        })
      } else {
        this.$message.error(args.error)
      }
    }

    let listener_openvm_func = (channel, args) => {
      this.disabled_card(false)
      if (args.status === false) {
        this.$message.error(args.error)
      } else {
        this.$message({
          message: args.data,
          type: 'success',
        })
      }
    }

    this.listener_channel = 'actionvmover:' + this.cardvm.id
    this.listener_openvm = 'openvmspiceconnectover:' + this.cardvm.id
    itemvmipc.on(this.listener_channel, action_vm_over)
    itemvmipc.on(this.listener_openvm, listener_openvm_func)
    // add by pbc -end

    // 数据初始化 - 将父组件传递的信息进行处理和加载
    const initVmInfo = () => {
      // console.log('initVmInfo')
      // console.log(this.cardvm)
      this.vminfo.id = this.cardvm.id
      // 获取虚拟机系统类型,返回对应的系统图标对象
      this.vminfo.systemIcon = osIcon.get_system_icon(
        this.cardvm.os,
        'down' === this.cardvm.status ? true : false
      )
      this.vminfo.systemName = this.cardvm.name
      if ('up' === this.cardvm.status) {
        this.vminfo.systemStatus = '开机'
        this.vminfo.systemType = 'success'
      } else if ('down' === this.cardvm.status) {
        this.vminfo.systemStatus = '关机'
        this.vminfo.systemType = 'info'
      } else if ('powering_down' === this.cardvm.status) {
        this.vminfo.systemStatus = '关机中'
        this.vminfo.systemType = 'success'
      } else if ('powering_up' === this.cardvm.status) {
        this.vminfo.systemStatus = '启动中'
        this.vminfo.systemType = 'success'
      } else if ('wait_for_launch' === this.cardvm.status) {
        this.vminfo.systemStatus = '准备中'
        this.vminfo.systemType = 'success'
      } else if ('reboot_in_progress' === this.cardvm.status) {
        this.vminfo.systemStatus = '重启中'
        this.vminfo.systemType = 'success'
      } else {
        this.vminfo.systemStatus = '故障'
        this.vminfo.systemType = 'danger'
      }
      this.vminfo.vmName = this.cardvm.os
      this.vminfo.runTime = this.cardvm.run_time
      this.vminfo.description = this.cardvm.description
        ? this.cardvm.description
        : '此虚拟机没有描述信息'
      this.vminfo.hostIp = this.cardvm.hostIp
      this.vminfo.spicePort = this.cardvm.spicePort
    }
    initVmInfo() // 初次先加载数据, 后将方法放入定时任务
    this.initCardTimer = setInterval(() => {
      initVmInfo()
    }, 3000)
  },
  destroyed() {
    clearInterval(this.initCardTimer)
    itemvmipc.removeAllListeners(this.listener_channel)
    itemvmipc.removeAllListeners(this.listener_openvm)
  },
  data() {
    return {
      if_v_loading: false,
      vminfo: {
        id: '',
        systemIcon: require('@/static/system_icon/os.png'),
        systemName: 'os',
        systemStatus: '开机',
        systemType: 'success',
        vmName: '测试系统',
        runTime: new Date().getTime(),
        description: '此虚拟机没有描述信息',
        hostIp: '',
        spicePort: '',
      },

      // action_button_text: '虚拟机操作',
      action_button_disabled: false, // 虚拟机操作按钮是否禁用
      listener_channel: '',
      listener_openvm: '',
      // button_action_disabled: false

      // 父组件传递来的虚拟机信息
      // itemvm: {
      //   id: '3753f931-e16b-4f05-bffe-8c1556c4be3c',
      //   name: 'win7',
      //   status: 'up',
      //   description: 'win7描述',
      //   os: 'windows_7x64',
      //   spicePort: '5901',
      //   hostIp: '192.168.8.223',
      //   runtime: '1小时',
      // },
    }
  },
  methods: {
    disabled_card(b) {
      if (b === true) {
        this.if_v_loading = true
      } else {
        this.if_v_loading = false
      }
    },

    // 卡片点击事件
    cardOpen() {
      this.disabled_card(true)
      console.log('cardOpen...')
      let argdict = {
        vmid: this.vminfo.id,
        name: this.vminfo.systemName,
        action: 'start',
      }
      itemvmipc.send('openvmspiceconnect', argdict) //开始获取所有虚拟机的信息
    },
    // 虚拟机操作按钮 - 禁用卡片点击事件
    // deleteNotice(event) {
    //   event.stopPropagation()
    // },
    // 虚拟机操作按钮 - 修改按钮状态
    action_button_style(b_text, disabled) {
      this.action_button_text = b_text
      this.action_button_disabled = disabled
    },

    // 虚拟机操作按钮 - 响应事件
    handleVMCommand(event, command) {
      // this.$message('click on item ' + command)
      // console.log('handleVMCommand...', command)
      event.stopPropagation() // 阻止 card 组件点击响应事件

      if ('updownvm' === command) {
        if ('down' === this.cardvm.status) {
          // 只有关机状态下,才能开机
          let argdict = {
            vmid: this.vminfo.id,
            name: this.vminfo.systemName,
            action: 'start',
          }
          itemvmipc.send('actionvm', argdict) //开始获取所有虚拟机的信息
          this.action_button_style('开机中...', true)
        } else if (
          // 只有在虚拟机开机或启动中,才能关机
          'up' === this.cardvm.status ||
          'powering_up' === this.cardvm.status
        ) {
          let argdict = {
            vmid: this.vminfo.id,
            name: this.vminfo.systemName,
            action: 'shutdown',
          }
          itemvmipc.send('actionvm', argdict) //开始获取所有虚拟机的信息
          this.action_button_style('关机中...', true)
        } else {
          // 其他状态不支持操作虚拟机
          this.$message.error('错误操作虚拟机')
        }
      } else if ('stopvm' === command) {
        this.$confirm(
          '确定要切断虚拟机电源吗?' + '切断电源将导致未保存的工作丢失!',
          '确认信息',
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          }
        ).then(() => {
          let argdict = {
            vmid: this.vminfo.id,
            name: this.vminfo.systemName,
            action: 'stop',
          }
          itemvmipc.send('actionvm', argdict) //开始获取所有虚拟机的信息
          this.action_button_style('断电中...', true)
        })
      } else if ('reboot' === command) {
        let argdict = {
          vmid: this.vminfo.id,
          name: this.vminfo.systemName,
          action: 'reboot',
        }
        itemvmipc.send('actionvm', argdict) //开始获取所有虚拟机的信息
        this.action_button_style('重启中...', true)
      } else {
        this.$message({
          message: '错误操作',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style>
.el-card {
  width: 235px;
  height: 290px;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  border: 0;
  background-color: #fafafa;
}
/* 系统图标 */
.show-img {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  margin-top: 35px;
  background-color: white;
  border-radius: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.show-img img {
  margin-top: 5px;
}

/* 系统信息 */
div.system-text {
  margin-bottom: 8px;
}

div.system-text .el-tag {
  height: 50%;
  font-size: 12px;
  line-height: 15px;
  padding: 5px;
}

.vm-bottom {
  margin-top: 10px;
  line-height: 20px;
}
/* 虚拟机运行时间 */
.vm-bottom .time {
  width: 200px;
  height: 20px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
}

/* 虚拟机描述信息 */
.vm-bottom .discript {
  width: 200px;
  height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
}

/* 虚拟机操作按钮 */
.el-row {
  margin-top: 15px;
}
.el-row .el-button {
  padding: 6px;
  font-weight: bold;
  font-size: 12pt;
}

/* 文字提示 : popper-class="tooltip-text" : 显示样式设置 */
.tooltip-text {
  color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
