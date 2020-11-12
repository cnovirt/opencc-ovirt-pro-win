# opencc-ovirt-pro-win

## 介绍

面向企业用户的 oVirt 开源云桌面客户端 windows 版本，拥有企业级交互 UI 设计。

## 软件架构

软件架构说明

## 安装教程

环境准备 :

1. 官网下载安装 nodejs <http://nodejs.cn/>
2. 官网下载安装 git <https://git-scm.com/>
3. windows 下使用管理员权限打开 cmd.exe

```bash
# 克隆代码并进入项目目录
git clone https://gitee.com/cnovirt/opencc-ovirt-pro-win.git

cd opencc-ovirt-pro-win/opencc-ovirt-pro

# 安装依赖
# 可以使用淘宝公共库
npm config set registry https://registry.npm.taobao.org

npm install

# 代码运行
npm run dev

# 将 VirtViewer 文件夹拷贝到 opencc-ovirt-pro 工程文件夹内, 可以打开 oVirt 虚拟机
```

## 打包教程
```bash
# 安装依赖
# 可以使用淘宝公共库
npm config set registry https://registry.npm.taobao.org

npm install

# 编译代码
npm run build:win32

# 运行成功后, 在 ./build 目录下生成打包的工程
# 将 VirtViewer 文件夹拷贝到打包出来的工程文件夹中, 使用管理权限运行客户端
```

## 特技

1.  使用 Readme_XXX.md 来支持不同的语言，例如 Readme_en.md, Readme_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
