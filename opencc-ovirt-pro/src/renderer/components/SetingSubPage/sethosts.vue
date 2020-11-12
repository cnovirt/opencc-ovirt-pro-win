<template>
  <el-container>
    <el-header>
      <el-input
        class="hosts-ip"
        v-model="hosts.ip"
        placeholder="输入域名IP地址"
        @keydown.enter.native="enterAddHosts"
        :disabled="commitIPDisable"
      >
      </el-input>
      <el-input
        class="hosts-ip"
        v-model="hosts.hostsaddr"
        placeholder="输入域名"
        @keydown.enter.native="enterAddHosts"
        :disabled="commithostsaddrDisable"
      ></el-input>
      <el-button
        class="hosts-btn"
        :disabled="commitBtnDisable"
        type="primary"
        @click="button_add_hosts"
        >{{ btnAddMsg }}
      </el-button>
    </el-header>

    <el-main>
      <el-table
        @row-dblclick="modifyDomain"
        height="380"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="num" label="序号" width="100"></el-table-column>
        <el-table-column
          prop="addr"
          label="IP地址"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="hostsaddr"
          label="域名"
          width="200"
        ></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.$index, tableData)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
const hostsipc = require('electron').ipcRenderer // 定义信号与槽函数接收者
export default {
  name: 'seting-hosts-page',
  components: {},
  data() {
    return {
      tableData: [
        {
          // num: '1',
          // addr: '192.168.8.111',
          // hostsaddr: 'host.com',
        },
      ],

      hosts: {
        ip: '',
        hostsaddr: '',
      },
      btnAddMsg: '添加域名',
      commitBtnDisable: false, // 禁用添加中心按钮
      commitIPDisable: false, // 禁用IP输入框
      commithostsaddrDisable: false, // 禁用hostsaddr输入框
    }
  },

  computed: {},

  mounted() {
    let tmpargs = {}
    hostsipc.send('getallhostsvalue', tmpargs) //首先要获取到后台所有域名的数据

    let getallhostsvaluefunc = (channel, args) => {
      this.tableData = args.data
    }

    let addhostsvaluefunc = (channel, args) => {
      this.addbuttonEnable()
      if (args.status === true) {
        this.$message({
          message: '添加域名成功',
          type: 'success',
        })
        // 清除输入框数据
        this.hosts.ip = ''
        this.hosts.hostsaddr = ''

        hostsipc.send('getallhostsvalue', tmpargs) //成功之后重新获取一次数据
      } else {
        this.$message.error(args.error)
      }
    }

    let delhostsfunc = (channel, args) => {
      if (args.status === false) {
        this.$message.error(args.error)
      } else {
        let tmpargs = {}
        hostsipc.send('getallhostsvalue', tmpargs) //删除成功之后重新获取一下数据
        this.$message({
          message: '删除域名成功',
          type: 'success',
        })
      }
    }

    hostsipc.on('getallhostsvalueover', getallhostsvaluefunc)
    hostsipc.on('addhostsvalueover', addhostsvaluefunc)
    hostsipc.on('delhostsover', delhostsfunc)
  },

  destroyed() {
    hostsipc.removeAllListeners('getallhostsvalueover')
    hostsipc.removeAllListeners('addhostsvalueover')
    hostsipc.removeAllListeners('delhostsover')
  },

  // add by pbc -end
  methods: {
    //添加按钮不可点击函数
    addbuttonDisable() {
      this.btnAddMsg = '添加中...'
      this.commitBtnDisable = true
      this.commitIPDisable = true
      this.commithostsaddrDisable = true
    },

    //添加按钮可点击函数
    addbuttonEnable() {
      this.btnAddMsg = '添加域名'
      this.commitBtnDisable = false
      this.commitIPDisable = false
      this.commithostsaddrDisable = false
    },

    // 检验输入函数
    checkInput() {
      if (this.hosts.ip == '') {
        this.$message.error('IP地址不能为空')
        return false
      }
      if (this.hosts.hostsaddr == '') {
        this.$message.error('域名不能为空')
        return false
      }

      // 检验 - IP地址
      const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      let retu_ip = reg_ip.test(this.hosts.ip)
      if (retu_ip) {
        // this.$message.success('正确IP地址')
      } else {
        this.$message.error('IP地址格式不正确')
        this.hosts.ip = ''
        return false
      }

      return true
    },

    // 表格添加一行
    button_add_hosts: function() {
      // 检验输入信息
      if (!this.checkInput()) {
        this.addbuttonEnable()
        return false
      }

      // add by pbc -top
      let hostsvalue = {
        addr: this.hosts.ip,
        hostsaddr: this.hosts.hostsaddr,
      }
      hostsipc.send('addhostsvalue', hostsvalue)

      this.addbuttonDisable()
      // add by pbc -end
    },

    // 删除表格行
    deleteRow(index, rows) {
      this.$confirm('确认是否删除该条记录？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        let delip =
          this.tableData[index]['addr'] + this.tableData[index]['hostsaddr']
        hostsipc.send('delhosts', delip)
      })
    },

    // 修改域控的值
    modifyDomain(row, event, column) {
      row.isInput = !row.isInput
    },

    // 回车事件 - IP输入框, 端口输入框
    enterAddHosts() {
      this.button_add_hosts()
    },
  },
}
</script>

<style scoped>
.el-header {
  padding-top: 20px;
}
.el-header .el-input {
  margin: 0 10px;
}
.hosts-ip {
  width: 200px;
}
.hosts-hostsaddr {
  width: 100px;
}
</style>
