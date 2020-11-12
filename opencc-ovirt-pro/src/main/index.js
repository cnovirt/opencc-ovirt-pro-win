const { app, BrowserWindow, Menu, ipcMain } = require('electron')

// add by pbc for reg signal slot banders -top
//此区间代码需要对需要electron 信号与槽函数有绑定的文件引用,因为需要通过mainwindow发送事件相应信号
import './model/login'
import './model/set_center'
import './model/set_hosts'
import './model/home_page'
import './model/itemvm'
import g_mainwindow from './model/common/commoninfo' //保存全局electron声明周期钩子

// add by pbc for reg signal slot banders -end
import myconfigure from './model/common/myconfigure'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

global.client_w = 920
global.client_h = 580
function createWindow() {
  /**
   * Initial window options
   */

  myconfigure.init_configure()
  Menu.setApplicationMenu(null) // 隐藏菜单栏
  const mainWindow = new BrowserWindow({
    width: global.client_w,
    height: global.client_h,
    useContentSize: true,
    frame: false, // 取消客户端边框
    webPreferences: {
      nodeIntegration: true,
    },
  })
  //   mainWindow.setMenu(null) // 隐藏菜单栏
  g_mainwindow.mainwindow = mainWindow
  g_mainwindow.mainwindow.setMaximumSize(global.client_w, global.client_h)
  g_mainwindow.mainwindow.setMinimumSize(global.client_w, global.client_h)
  g_mainwindow.mainwindow.loadURL(winURL)

  // 使用全局变量保存窗体对象
  global.mainWindow = mainWindow
}

app.on('ready', createWindow)
