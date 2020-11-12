/*
  create by pbc for :
  添加中心功能的所有函数
 */

import my_ovirt_api from "./ovirtapi/my_ovirt_api";

const {ipcMain} = require('electron')
const fss = require('fs')
const g_common = require("./common/commoninfo")
import myconfigure from './common/myconfigure'

require("./common/commoninfo")
require("./common/globel_value")


//删除中心信息
ipcMain.on("delcenter", (data, args) => {
    let retuData = {"data": "", "status": false, "error": ""}

    let loginstatusdata = myconfigure.get_value("loginstatusdata") //获取到自动登录的中心信息,如果存在删除的情况则也需要删除

    let center_info = []
    let jv = myconfigure.get_value("centerinfo")
    if (jv === undefined) {
        center_info = []
    } else {
        center_info = jv
        //判断中心是否已经存在 -top
        for (let i = 0; i < center_info.length; i++) {
            let item = center_info[i]
            let centerip = item['centerip']
            if (args === centerip) {
                if (loginstatusdata['centerip'] === centerip) {
                    myconfigure.update_value("loginstatusdata", {})
                }
                center_info.splice(i, 1)
                break
            }
        }
        //判断中心是否已经存在 -end
    }

    myconfigure.update_value("centerinfo", center_info)
    retuData = {"data": center_info, "status": true, "error": ""}
    g_common.mainwindow.webContents.send("delcentervalueover", retuData);
})

//获取所有中心信息
ipcMain.on("settinggetallcentervalue", (data, args) => {
    let center_info = []
    let jv = myconfigure.get_value("centerinfo")
    if (jv === undefined) {
        center_info = []
    } else {
        center_info = jv
    }

    let retuData = {"data": center_info, "status": true, "error": ""}
    g_common.mainwindow.webContents.send("setting_getallcentervalueover", retuData);
})


//添加中心功能
ipcMain.on('addcentervalue', (data, args) => {
    let retuData = {"data": "", "status": false, "error": ""}

    let center_info = []
    let jv = myconfigure.get_value("centerinfo")
    if (jv === undefined) {
        center_info = []
    } else {
        center_info = jv

        //判断中心是否已经存在 -top
        for (let i = 0; i < center_info.length; i++) {
            let item = center_info[i]
            let centerip = item['centerip']
            if (args['centerip'] === centerip) {
                retuData['error'] = '该中心地址已经存在'
                g_common.mainwindow.webContents.send("addcentervalueover", retuData);
                return
            }
        }
        //判断中心是否已经存在 -end
    }


    //在此添加验证添加的中心是否是ovirt中心 -top

    let centaddr = args["centerip"] + ":" + args["centerport"]
    let request_retu = my_ovirt_api.CHECK_IS_OVIRT_ENGINE(centaddr)
    request_retu.catch((err) => {
        retuData['data'] = ''
        retuData['status'] = false
        retuData['error'] = '添加中心失败,该地址不是ovirt管理服务地址'
        g_common.mainwindow.webContents.send("addcentervalueover", retuData);
        return
    }).then((res) => {

        if (res.status === 200) {
            center_info.push(args)
            myconfigure.update_value("centerinfo", center_info)
            retuData['status'] = true
            retuData['error'] = ""
            g_common.mainwindow.webContents.send("addcentervalueover", retuData);
        } else {
            retuData['data'] = ''
            retuData['status'] = false
            retuData['error'] = '添加中心失败,中心地址认证错误'
            g_common.mainwindow.webContents.send("addcentervalueover", retuData);
        }
    })
    //在此添加验证添加的中心是否是ovirt中心 -end

})

