//单个虚拟机操作
const fss = require('fs')
const os = require('os')

const { ipcMain } = require('electron')
const g_common = require('./common/commoninfo')
const myevents = require('events')
import ovirt_api from './ovirtapi/my_ovirt_api'
import commands from './common/commands'

const eventEmitter = new myevents.EventEmitter()
let remote_viewer_path = '.\\VirtViewer\\bin\\remote-viewer.exe'
if (os.platform() != 'win32') {
  remote_viewer_path = '/usr/bin/window'
}
let vminfo = {}

//虚拟机所有信息获取完毕
eventEmitter.on('have_allitem_info', (arg1) => {
  var fd2 = fss.openSync('./vv.pem', 'w')
  fss.writeSync(fd2, arg1.ca)
  fss.closeSync(fd2)

  let entervm_str = remote_viewer_path.concat(
    ' "spice://',
    arg1.host_domain,
    '/?tls-port=',
    arg1.port,
    '&password=',
    arg1.ticket,
    '" --spice-ca-file=./vv.pem'
    // ' --spice-debug=true',
    // ' -f'
  )

  let retuData = { status: true, data: '打开虚拟机已就绪', error: '' }
  let signal_channel = 'openvmspiceconnectover:' + arg1.id
  g_common.mainwindow.webContents.send(signal_channel, retuData)

  console.log('entervm_str', entervm_str)
  // commands.getstatusoutput(entervm_str)
  // console.log("entervm_strover")

  var exec = require('child_process').exec,
    last = exec(entervm_str)

  last.stdout.on('data', (data) => {
    console.log('标准输出：' + data)
  })

  last.on('exit', function(code) {
    console.log('虚拟机已关闭，退出代码:' + code)
    let signal_channel = 'openvmspiceconnectover:' + arg1.id
    if (code === 0) {
      retuData['status'] = true
      retuData['error'] = ''
      retuData['data'] = '虚拟机（' + arg1.name + '）' + '正常关闭'
    } else {
      retuData['status'] = false
      retuData['error'] =
        '虚拟机（' + arg1.name + '）' + '异常退出，退出码:' + code
      retuData['data'] = ''
    }
    g_common.mainwindow.webContents.send(signal_channel, retuData)
  })
})

//虚拟机开机了的情况 然后开始获取ticket 动态密钥
eventEmitter.on('signal_vm_isup', (arg1) => {
  vminfo['name'] = arg1.name
  vminfo['id'] = arg1.id
  vminfo['host_address'] = arg1.display.address
  vminfo['port'] = arg1.display.secure_port
  vminfo['ca'] = arg1.display.certificate.content
  vminfo['host_domain'] = arg1.display.certificate.subject.split('CN=')[1]

  let retuData = { status: false, data: '', error: '' }
  let getticket_retu = ovirt_api.GET_VM_TICKET(arg1.id)
  getticket_retu.then((res) => {
    if (res.status === 200) {
      vminfo['ticket'] = res.data.ticket.value
      eventEmitter.emit('have_allitem_info', vminfo)
    } else {
      retuData = { status: false, data: '', error: '获取虚拟机ticket失败' }
      let signal_channel = 'openvmspiceconnectover:' + args.vmid
      g_common.mainwindow.webContents.send(signal_channel, retuData)
    }
  })
})

ipcMain.on('openvmspiceconnect', (data, args) => {
  let retuData = { status: false, data: '', error: '' }

  //在此添加打开虚拟机的一系列操作

  let tmpi = 0

  let intervalFunc = () => {
    tmpi = tmpi + 1
    if (tmpi >= 30) {
      clearInterval(timergetitemvminfo)
      retuData = {
        status: false,
        data: '',
        error: '虚拟机(' + args.name + ')打开超时',
      }
      let signal_channel = 'openvmspiceconnectover:' + args.vmid
      g_common.mainwindow.webContents.send(signal_channel, retuData)
    }
    console.log('tmpitmpitmpitmpi', tmpi)
    let itemvminforetu = ovirt_api.GET_ITEM_VMINFO(args.vmid)
    itemvminforetu.then((res) => {
      if (res.status === 200) {
        if (res.data.status === 'down') {
          //需要开机
          if (tmpi >= 3) {
            clearInterval(timergetitemvminfo)
            retuData = {
              status: false,
              data: '',
              error: '虚拟机(' + args.name + ')开机失败',
            }
            let signal_channel = 'openvmspiceconnectover:' + args.vmid
            g_common.mainwindow.webContents.send(signal_channel, retuData)
          }
          ovirt_api.ACTION_VM(args.vmid, 'start')
        } else if (
          res.data.status === 'up' ||
          res.data.status === 'powering_up'
        ) {
          clearInterval(timergetitemvminfo)
          retuData = { status: true, data: res.data, error: '' }
          eventEmitter.emit('signal_vm_isup', res.data)
        }
      } else {
        clearInterval(timergetitemvminfo)
        retuData = { status: false, data: '', error: res.data }
        let signal_channel = 'openvmspiceconnectover:' + args.vmid
        g_common.mainwindow.webContents.send(signal_channel, retuData)
      }
    })
  }

  let for_time = 3000
  let timergetitemvminfo = setInterval(intervalFunc, for_time)
  intervalFunc()
})

//用户操作虚拟机
ipcMain.on('actionvm', (data, args) => {
  let retuData = { status: false, data: '', error: '' }

  let request_retu = ovirt_api.ACTION_VM(args.vmid, args.action)
  request_retu
    .then((res) => {
      if (res.status === 200) {
        retuData['status'] = true
        retuData['error'] = ''
        if (args.action === 'start') {
          retuData['data'] = args['name'] + '开机成功'
        } else if (args.action === 'stop') {
          retuData['data'] = args['name'] + '断电成功'
        } else if (args.action === 'reboot') {
          retuData['data'] = args['name'] + '重启成功'
        } else if (args.action === 'shutdown') {
          retuData['data'] = args['name'] + '关机成功'
        }
      } else {
        retuData['status'] = false
        retuData['error'] =
          args['name'] + '操作失败,(status code:' + res.status + ')'
      }
      let signal_channel = 'actionvmover:' + args.vmid
      g_common.mainwindow.webContents.send(signal_channel, retuData)
    })
    .catch((err) => {
      retuData['status'] = false
      retuData['error'] = args['name'] + '操作失败(' + err.toString() + ')'
      let signal_channel = 'actionvmover:' + args.vmid
      g_common.mainwindow.webContents.send(signal_channel, retuData)
    })
})
