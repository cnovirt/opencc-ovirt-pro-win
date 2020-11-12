/*
  create by pbc for :
  添加中心功能的所有函数
 */
const os = require('os')
const fss = require('fs')

const { ipcMain } = require('electron')
const g_common = require('./common/commoninfo')

let HOST_PATH = ''
if (os.platform() == 'win32') {
  HOST_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
} else {
  HOST_PATH = '/etc/hosts'
}

//删除域名
ipcMain.on('delhosts', (data, args) => {
  let retuData = { status: true, data: '', error: '' }
  try {
    let tmpvalue = fss.readFileSync(HOST_PATH).toString()
    let tmpList = tmpvalue.split('\n')
    let all_v = ''
    for (let i = 0; i < tmpList.length; i++) {
      let item = tmpList[i]
      let reitem = item.replace(' ', '')
      if (reitem === args) {
        continue
      } else {
        all_v = all_v + item + '\n'
      }
    }
    var fd2 = fss.openSync(HOST_PATH, 'w')
    fss.writeSync(fd2, all_v)
    fss.closeSync(fd2)
  } catch (e) {
    retuData['status'] = false
    retuData['error'] = e.toString()
  }

  g_common.mainwindow.webContents.send('delhostsover', retuData)
})

//添加域名
let addhostsvalue = (args) => {
  let retuData = { status: true, data: '', error: '' }
  try {
    let allvalue = fss.readFileSync(HOST_PATH).toString()
    allvalue = allvalue + '\n' + args.addr + ' ' + args.hostsaddr
    var fd2 = fss.openSync(HOST_PATH, 'w')
    fss.writeSync(fd2, allvalue)
    fss.closeSync(fd2)
    return retuData
  } catch (e) {
    retuData['status'] = false
    retuData['error'] = e.toString()
    return retuData
  }
}

//获取所有域名信息
let getAllHosts = () => {
  let tmpvalue = fss.readFileSync(HOST_PATH).toString()
  let hostData = []
  let tmpList = tmpvalue.split('\n')
  let num = 1
  for (let i = 0; i < tmpList.length; i++) {
    let item = tmpList[i]
    item = item.trim().replace(/\s+/g, ' ')
    if (item.indexOf('::') >= 0) {
      continue
    } else if (item === '') {
      continue
    } else if (item.indexOf('#') >= 0) {
      continue
    } else {
      let item_v = {
        num: num,
        addr: item.split(' ')[0],
        hostsaddr: item.split(' ')[1],
      }
      hostData.push(item_v)
      num++
    }
  }
  let retuData = { status: true, data: hostData, error: '' }
  return retuData
}

// console.log(getAllHosts())

ipcMain.on('getallhostsvalue', (data, args) => {
  let retuData = getAllHosts()
  g_common.mainwindow.webContents.send('getallhostsvalueover', retuData)
})

ipcMain.on('addhostsvalue', (data, args) => {
  let retuData = { status: true, data: '', error: '' }
  // 检查IP地址/域名是否都存在
  let all_hosts = getAllHosts()
  if (all_hosts.status == true) {
    for (let i = 0; i < all_hosts.data.length; i++) {
      let item = all_hosts.data[i]
      if (item.addr == args.addr) {
        if (item.hostsaddr == args.hostsaddr) {
          retuData['status'] = false
          retuData['error'] = 'IP地址/域名已存在'
          g_common.mainwindow.webContents.send('addhostsvalueover', retuData)
          return 0
        }
      }
    }
  } else {
    retuData['status'] = false
    retuData['error'] = '读取hosts文件失败'
    g_common.mainwindow.webContents.send('addhostsvalueover', retuData)
    return 0
  }

  // 添加IP地址/域名
  retuData = addhostsvalue(args)
  g_common.mainwindow.webContents.send('addhostsvalueover', retuData)
})
