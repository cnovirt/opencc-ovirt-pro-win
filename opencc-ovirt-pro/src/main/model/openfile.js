const fs = require('fs')

const printMsg = () => {
}

const readFile = (filePath = '/home/wangdu/git_pro/client/ovirt-client-windows/electron-vue-nodejs/src/renderer/model/aaa.txt') => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
  })
}

module.exports = {
  printMsg: printMsg,
  readFile: readFile
}
