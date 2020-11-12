//此文件编写http请求客户端代码

const axios = require('axios')
const https = require('https')
const qs = require('qs')

request_api = (dict_args) => {
    let argdata = null
    if (typeof dict_args.data === "string"){
        argdata = dict_args.data
    }else{
        argdata = qs.stringify(dict_args.data)
    }

    let myAxiosConfig = {
        url: dict_args['url'],
        method: dict_args['method'],
        headers: dict_args['headers'],
        data: argdata,

        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
            keepAlive: true,
        }),
    }

    axios.defaults.timeout = 10000

    return axios.request(myAxiosConfig);
};


// dict_args = {
//     "method": "post",
//     "url": "https://192.168.16.230:443/ovirt-engine/sso/oauth/token",
//     "headers": {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': 'application/json'
//     },
//     "data": {
//         'grant_type': 'password',
//         'username': 'admin@internal',
//         'password': 'admin=12',
//         'scope': 'ovirt-app-api'
//     }
// };

// request_retu = request_api(dict_args);
// request_retu.then((res) => {
//     console.log(res)
// })
