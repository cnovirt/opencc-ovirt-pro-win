//虚拟机列表的功能js代码

const { ipcMain } = require('electron')
const g_common = require('./common/commoninfo')
import myconfigure from './common/myconfigure'
import ovirt_api from './ovirtapi/my_ovirt_api'

//更新token

ipcMain.on('timeupdatetoken', (data, args) => {
  let retuData = { data: '', status: false, error: '' }

  let request_retu = ovirt_api.GET_TOKEN(false, {})
  request_retu.then((res) => {
    if (typeof res === 'object') {
      let tmpdata = res['data']
      if (typeof tmpdata === 'object') {
        g_common.TOKEN = 'Bearer ' + tmpdata['access_token']
      }
    }
  })
})

//获取所有虚拟机信息到页面
ipcMain.on('getallvminfo', (data, args) => {
  let retuData = { data: '', error: '', status: false }
  let request_retu = ovirt_api.GET_VMS_INFO()
  request_retu
    .then((res) => {
      if (res.status === 200) {
        let vmsinfo = []
        let json_value = res.data
        let vmList = json_value['vm']

        for (let i = 0; i < vmList.length; i++) {
          let tmp_vminfo = {}
          tmp_vminfo['id'] = vmList[i]['id']
          tmp_vminfo['name'] = vmList[i]['name']
          tmp_vminfo['status'] = vmList[i]['status']
          tmp_vminfo['description'] = vmList[i]['description']
          tmp_vminfo['os'] = vmList[i]['os']['type']
          tmp_vminfo['run_time'] = '0分钟'

          if (tmp_vminfo['status'] == 'up') {
            if (vmList[i]['start_time'] > 0) {
              let time_diff = new Date() - vmList[i]['start_time']
              tmp_vminfo['run_time'] = timeDiff(time_diff)
            }
          }
          vmsinfo.push(tmp_vminfo)
        }

        retuData['status'] = true
        retuData['error'] = ''
        retuData['data'] = vmsinfo
        if (args.data === 'timerupdateinfo') {
          retuData['timerupdateinfo'] = true
          g_common.mainwindow.webContents.send('getallvminfoover', retuData)
        } else {
          retuData['timerupdateinfo'] = false
          g_common.mainwindow.webContents.send('getallvminfoover', retuData)
        }
      } else {
        retuData['status'] = false
        retuData['error'] =
          '请求虚拟机列表错误错误代码:' +
          res.status +
          '\n' +
          res.request.toString()
        g_common.mainwindow.webContents.send('getallvminfoover', retuData)
      }
    })
    .catch((err) => {
      retuData['status'] = false
      retuData['error'] = err.toString()
      g_common.mainwindow.webContents.send('getallvminfoover', retuData)
    })
})

//主界面注销功能
ipcMain.on('homepagelogout', (data, args) => {
  let loginstatusdata = myconfigure.get_value('loginstatusdata')

  if (loginstatusdata.autologin === true) {
    loginstatusdata.autologin = false
    myconfigure.update_value('loginstatusdata', loginstatusdata)
  }
  let retuData = { status: true, error: '', data: '' }
  g_common.mainwindow.webContents.send('homepagelogoutover', retuData)
  g_common.USERINFO = {}
  g_common.TOKEN = ''
})

// 计算时间差
function timeDiff(time_diff) {
  let days = Math.floor(time_diff / (24 * 3600 * 1000))
  //计算出小时数
  let leave1 = time_diff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000)

  let runTime = '0分钟'

  if (days > 0) {
    runTime = days.toString().concat('天', hours, '小时', minutes, '分钟')
  } else if (hours > 0) {
    runTime = hours.toString().concat('小时', minutes, '分钟')
  } else {
    runTime = minutes.toString().concat('分钟')
  }
  return runTime
}
