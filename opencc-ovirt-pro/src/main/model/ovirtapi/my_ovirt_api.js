//二次封装ovirt api
require("../ovirtapi/api_requests")

//获取虚拟机详细信息
const GET_ITEM_VMINFO = async (vmid) => {
    let g_common = require("../common/commoninfo")
    let request_dict_args = {
        "method": "get",
        "url": "https://" + g_common.USERINFO.centerip + "/ovirt-engine/api/vms/" + vmid,
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': g_common.TOKEN
        },
        "data": {}
    }

    const api_retu = await request_api(request_dict_args)
    return api_retu
}


//获取虚拟机ticket
const GET_VM_TICKET = async (vmid) => {
    let g_common = require("../common/commoninfo")
    var dict_args = {
        "method": "post",
        "url": "https://" + g_common.USERINFO.centerip + "/ovirt-engine/api/vms/" + vmid + "/ticket",
        "headers": {
            'Content-Type': 'application/xml',
            'Accept': 'application/json',
            'Authorization': g_common.TOKEN
        },
        data: "<action><ticket></ticket></action>"
    }

    const api_retu = await request_api(dict_args)
    return api_retu
}


//操作虚拟机开机关机等
const ACTION_VM = async (vmid, action) => {
    let g_common = require("../common/commoninfo")
    var dict_args = {
        "method": "post",
        "url": "https://" + g_common.USERINFO.centerip + "/ovirt-engine/api/vms/" + vmid + "/" + action,
        "headers": {
            'Content-Type': 'application/xml',
            'Accept': 'application/json',
            'Authorization': g_common.TOKEN
        },
        data: "<action/>"
    }

    const api_retu = await request_api(dict_args)
    return api_retu
}


//获取token
const GET_TOKEN = async (isfirst, arg1) => {
    console.log("arg1arg1arg1:", arg1)
    let username = ""
    let password = ""
    let centerip = ""
    if (isfirst === true) {
        username = arg1.username
        password = arg1.password
        centerip = arg1.centerip
    } else {
        let g_common = require("../common/commoninfo")
        username = g_common.USERINFO.username
        password = g_common.USERINFO.password
        centerip = g_common.USERINFO.centerip
    }

    var dict_args = {
        "method": "post",
        "url": "https://" + centerip + "/ovirt-engine/sso/oauth/token",
        "headers": {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        data: {
            'grant_type': 'password',
            'username': username + '@internal',
            'password': password,
            'scope': 'ovirt-app-api'
        }
    }

    const api_retu = await request_api(dict_args)
    return api_retu
}


//获取所有虚拟机信息
const GET_VMS_INFO = async () => {
    let g_common = require("../common/commoninfo")
    let dict_args = {
        "method": "get",
        "url": "https://" + g_common.USERINFO.centerip + "/ovirt-engine/api/vms",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': g_common.TOKEN
        },
        "data": {}
    };

    const api_retu = await request_api(dict_args)
    return api_retu
}

//检查是否是ovirt引擎
const CHECK_IS_OVIRT_ENGINE = async (centaddr) => {
    var dict_args = {
        "method": "get",
        "url": "https://" + centaddr + "/ovirt-engine/services/health"
    }
    const api_retu = await request_api(dict_args)
    return api_retu
}


export default ({
    GET_ITEM_VMINFO,
    ACTION_VM,
    GET_VM_TICKET,
    GET_TOKEN,
    GET_VMS_INFO,
    CHECK_IS_OVIRT_ENGINE,
})
