// 登录认证函数

import {app, ipcMain} from 'electron'
const g_common = require("./common/commoninfo")
import ovirt_api from './ovirtapi/my_ovirt_api'

import myconfigure from './common/myconfigure'

//获取登录的信息到界面
ipcMain.on('getloginstatusdata', (data, args) => {
    let loginstatusdata = myconfigure.get_value("loginstatusdata")

    let retuData = {
        "data": loginstatusdata,
        "status": true,
        "error": ""
    }

    g_common.mainwindow.webContents.send("getloginstatusdataover", retuData);
})


//登录成功后吧登录的配置信息保存到本地
ipcMain.on('loginstatusdata', (data, args) => {
    myconfigure.update_value("loginstatusdata", args)
    g_common.USERINFO = args //登录成功之后保存用户的登录信息到全局变量
})

//获取所有中心信息
ipcMain.on("getallcentervalue", (data, args) => {
    let center_info = []
    let jv = myconfigure.get_value("centerinfo")
    if (jv === undefined) {
        center_info = []
    } else {
        center_info = jv
    }

    let retuData = {"data": center_info, "status": true, "error": ""}
    g_common.mainwindow.webContents.send("getallcentervalueover", retuData);
})


//登录认证功能
ipcMain.on('loginvalidate', (data, args) => {
    let retuData = {"data": "", "status": false, "error": ""}

    let request_retu = ovirt_api.GET_TOKEN(true,args)
    request_retu.catch((err) => {
        retuData['error'] = err.toString()
        try {
            retuData['error'] = err.response.data.error
        } catch (e) {

        }

        retuData['data'] = ''
        retuData['status'] = false
        g_common.mainwindow.webContents.send("loginvalidateover", retuData);
        return
    }).then((res) => {
        if (typeof (res) === "object") {
            let tmpdata = res["data"]
            if (typeof (tmpdata) === "object") {
                retuData['error'] = ''
                retuData['data'] = {'token': 'Bearer ' + tmpdata['access_token']}
                retuData['status'] = true
                g_common.TOKEN = 'Bearer ' + tmpdata['access_token']
                g_common.mainwindow.webContents.send("loginvalidateover", retuData);
            } else {
                retuData['error'] = '登录认证错误!'
                retuData['data'] = ''
                retuData['status'] = false
                g_common.mainwindow.webContents.send("loginvalidateover", retuData);
            }
        } else {
            retuData['status'] = false
            retuData['error'] = 'forceclose'
            g_common.mainwindow.webContents.send("loginvalidateover", retuData);
        }
    })
});


ipcMain.on('client-mini', (event, data)=>{
    global.mainWindow.minimize()
})


ipcMain.on('client-close', (event, data)=>{
    app.quit()
})

