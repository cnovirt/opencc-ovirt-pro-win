const fss = require('fs')
const GLOBEL_CONFIG_PATH = "./configure.json"

const init_configure = () => {
    if (!fss.existsSync(GLOBEL_CONFIG_PATH)) {
        var fd1 = fss.openSync(GLOBEL_CONFIG_PATH, 'w');
        fss.writeSync(fd1, JSON.stringify({}));
        fss.closeSync(fd1);
    }
}

const get_value = (keysv) => {
    let json_value = JSON.parse(fss.readFileSync(GLOBEL_CONFIG_PATH));
    return json_value[keysv];
}


const update_value = (keysv, value) => {
    let json_value = JSON.parse(fss.readFileSync(GLOBEL_CONFIG_PATH));
    json_value[keysv] = value
    let str_value = JSON.stringify(json_value)
    var fd2 = fss.openSync(GLOBEL_CONFIG_PATH, 'w');
    fss.writeSync(fd2, str_value);
    fss.closeSync(fd2);
}


export default ({
    init_configure,
    get_value,
    update_value,
})

