# opencc-client

> 面向企业用户的oVirt开源云桌面客户端windows版本，拥有企业级交互UI设计。

#### 安装运行

```bash
# 可以选用功能 npm 公共库, 或使用 yarn 安装
npm config set registry https://registry.npm.taobao.org

# 安装依赖
npm install

# 运行
npm run dev

```

#### 打包

```bash
# 清除打包文件
npm run build:clean

# 打包
# windows 版本
npm run build:win32

# ubuntu 版本
npm run build:linux

```
