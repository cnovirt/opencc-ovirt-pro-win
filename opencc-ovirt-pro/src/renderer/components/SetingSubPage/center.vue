<template>
  <el-container>
    <el-header>
      <!-- "((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)" -->
      <!-- :value="inputRegIp" -->

      <span> IP</span>
      <el-input
        class="center-ip"
        v-model="center.ip"
        placeholder="中心地址"
        @keydown.enter.native="enterAddCenter"
        :disabled="commitIPDisable"
      ></el-input>
      <span>端口</span>
      <el-input
        class="center-port"
        v-model="center.port"
        placeholder="端口号"
        @keydown.enter.native="enterAddCenter"
        :disabled="commitPortDisable"
      ></el-input>
      <el-button
        class="center-btn"
        :disabled="commitBtnDisable"
        type="primary"
        @click="button_add_center"
        >{{ btnAddMsg }}</el-button
      >
    </el-header>

    <el-main>
      <!-- <v-center-table></v-center-table> -->
      <el-table
        @row-dblclick="modifyDomain"
        height="380"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="num" label="序号" width="100"> </el-table-column>
        <el-table-column prop="addr" label="IP地址" width="150">
        </el-table-column>
        <el-table-column prop="port" label="端口" width="150">
        </el-table-column>

        <el-table-column prop="domain" label="域控" width="150">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-input
                v-if="scope.row.isInput"
                v-model="scope.row.domain"
              ></el-input>
              <span v-else>{{ scope.row.domain }} </span>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.$index, tableData)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
// import vCenterTable from './vCenterTable'

const centeripc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'seting-center-page',
  components: {
    // vCenterTable
  },
  data() {
    return {
      tableData: [
        {
          num: '1',
          addr: '192.168.8.111',
          port: '443',
          domain: 'internal',
          isInput: false,
        },
      ],

      center: {
        ip: '',
        port: '443',
      },
      btnAddMsg: '添加中心',
      commitBtnDisable: false, // 禁用添加中心按钮
      commitIPDisable: false, // 禁用IP输入框
      commitPortDisable: false, // 禁用Port输入框
    }
  },

  computed: {},

  // add by pbc -top

  // add by pbc -top
  mounted() {
    let tmpargs = {}
    centeripc.send('settinggetallcentervalue', tmpargs) //首先要获取到后台所有中心的数据

    let addcentercallback = (channel, args) => {
      if (args['status'] === false) {
        this.$message.error(args['error'])
        this.addbuttonEnable()
        return
      } else {
        centeripc.send('settinggetallcentervalue', tmpargs)
        this.$message({
          message: '添加中心成功',
          type: 'success',
        })
      }
      this.addbuttonEnable()
    }

    let settinginitcentercallback = (channel, args) => {
      this.tableData = []
      for (let i = 0; i < args['data'].length; i++) {
        let addr = args['data'][i]['centerip']
        let port = args['data'][i]['centerport']
        let domain = args['data'][i]['centerdomain']
        this.tableData.length
        this.tableData.push({
          num: this.tableData.length + 1,
          addr: addr,
          port: port,
          domain: domain,
          isInput: false,
        })
      }
    }

    let delcentercallback = (channel, args) => {
      this.tableData = []
      for (let i = 0; i < args['data'].length; i++) {
        let addr = args['data'][i]['centerip']
        let port = args['data'][i]['centerport']
        let domain = args['data'][i]['centerdomain']
        this.tableData.length
        this.tableData.push({
          num: this.tableData.length + 1,
          addr: addr,
          port: port,
          domain: domain,
          isInput: false,
        })
      }
    }

    centeripc.on('delcentervalueover', delcentercallback)
    centeripc.on('addcentervalueover', addcentercallback)
    centeripc.on('setting_getallcentervalueover', settinginitcentercallback)
  },

  destroyed() {
    centeripc.removeAllListeners('delcentervalueover')
    centeripc.removeAllListeners('addcentervalueover')
    centeripc.removeAllListeners('setting_getallcentervalueover')
  },

  // add by pbc -end
  methods: {
    //添加按钮不可点击函数
    addbuttonDisable() {
      this.btnAddMsg = '添加中...'
      this.commitBtnDisable = true
      this.commitIPDisable = true
      this.commitPortDisable = true
    },

    //添加按钮可点击函数
    addbuttonEnable() {
      this.btnAddMsg = '添加中心'
      this.commitBtnDisable = false
      this.commitIPDisable = false
      this.commitPortDisable = false
    },

    // 检验输入函数
    checkInput() {
      if (this.center.ip == '') {
        this.$message.error('IP地址不能为空')
        return false
      }
      if (this.center.port == '') {
        this.$message.error('端口号不能为空')
        return false
      }

      // 检验 - IP地址
      const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      let retu_ip = reg_ip.test(this.center.ip)
      if (retu_ip) {
        // this.$message.success('正确IP地址')
      } else {
        this.$message.error('错误IP地址')
        this.center.ip = ''
        return false
      }

      // 检验 - 端口号
      const reg_port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      let retu_port = reg_port.test(this.center.port)
      if (retu_port) {
        // this.$message.success('正确端口号')
      } else {
        this.$message.error('错误端口号')
        this.center.port = ''
        return false
      }
      return true
    },

    // 表格添加一行
    button_add_center: function() {
      this.addbuttonDisable()
      // 检验输入信息
      if (!this.checkInput()) {
        this.addbuttonEnable()
        return false
      }

      // add by pbc -top
      let centervalue = {
        centerip: this.center.ip,
        centerport: this.center.port,
        centerdomain: 'internal',
      }

      centeripc.send('addcentervalue', centervalue)
      // add by pbc -end
    },

    // 删除表格行
    deleteRow(index, rows) {
      // rows.splice(index, 1)
      this.$confirm('确认是否删除该条记录？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        let delip = this.tableData[index]['addr']
        centeripc.send('delcenter', delip)
      })
    },

    // 修改域控的值
    modifyDomain(row, event, column) {
      row.isInput = !row.isInput
    },

    // 回车事件 - IP输入框, 端口输入框
    enterAddCenter() {
      this.button_add_center()
    },
  },
}
</script>

<style scoped>
/* .el-table{
  border: 1px solid pink;
} */
.el-header {
  padding-top: 20px;
}
.el-header > span {
  /* font-size: 10px; */
  color: rgba(0, 0, 0, 0.7);
  margin-left: 10px;
}
.el-header .el-input {
  margin: 0 10px;
}

.center-ip {
  width: 200px;
}
.center-port {
  width: 100px;
}
</style>
