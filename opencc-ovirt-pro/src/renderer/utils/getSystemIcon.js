/*

 根据系统类型获取应该显示哪张系统图片

 return  [centos.png,red.png,suse.png,ubuntu.png,win7.png,win10.png,xp.png]

 */

const get_system_icon = (osType, off = false, imageType = 'png') => {
  let ostype = osType.toLowerCase()
  if (ostype.indexOf('ubuntu') >= 0) {
    // ubuntu
    if (off) {
      return require('@/static/system_icon/ubuntu_off.' + imageType)
    } else {
      return require('@/static/system_icon/ubuntu.' + imageType)
    }
  } else if (ostype.indexOf('centos') >= 0) {
    // centos
    if (off) {
      return require('@/static/system_icon/centos_off.' + imageType)
    } else {
      return require('@/static/system_icon/centos.' + imageType)
    }
  } else if (ostype.indexOf('suse') >= 0) {
    // suse
    if (off) {
      return require('@/static/system_icon/suse_off.' + imageType)
    } else {
      return require('@/static/system_icon/suse.' + imageType)
    }
  } else if (ostype.indexOf('rhel') >= 0 || ostype.indexOf('red') >= 0) {
    // rhel
    if (off) {
      return require('@/static/system_icon/red_off.' + imageType)
    } else {
      return require('@/static/system_icon/red.' + imageType)
    }
  } else if (ostype.indexOf('debian') >= 0) {
    // debian
    if (off) {
      return require('@/static/system_icon/debian_off.' + imageType)
    } else {
      return require('@/static/system_icon/debian.' + imageType)
    }
  } else if (ostype.indexOf('linux') >= 0) {
    // linux
    if (off) {
      return require('@/static/system_icon/linux_off.' + imageType)
    } else {
      return require('@/static/system_icon/linux.' + imageType)
    }
  } else if (ostype.indexOf('other') >= 0) {
    // other
    if (off) {
      return require('@/static/system_icon/os_off.' + imageType)
    } else {
      return require('@/static/system_icon/os.' + imageType)
    }
  } else if (ostype.indexOf('freebsd') >= 0) {
    // freebsd
    if (off) {
      return require('@/static/system_icon/freebsd_off.' + imageType)
    } else {
      return require('@/static/system_icon/freebsd.' + imageType)
    }
  } else if (ostype.indexOf('windows') >= 0) {
    // windows
    if (ostype.indexOf('xp') >= 0) {
      if (off) {
        return require('@/static/system_icon/xp_off.' + imageType)
      } else {
        return require('@/static/system_icon/xp.' + imageType)
      }
    } else if (ostype.indexOf('2003') >= 0) {
      if (off) {
        return require('@/static/system_icon/xp_off.' + imageType)
      } else {
        return require('@/static/system_icon/xp.' + imageType)
      }
    } else if (ostype.indexOf('7') >= 0) {
      if (off) {
        return require('@/static/system_icon/win7_off.' + imageType)
      } else {
        return require('@/static/system_icon/win7.' + imageType)
      }
    } else if (ostype.indexOf('2008') >= 0) {
      if (off) {
        return require('@/static/system_icon/win7_off.' + imageType)
      } else {
        return require('@/static/system_icon/win7.' + imageType)
      }
    } else if (ostype.indexOf('10') >= 0) {
      if (off) {
        return require('@/static/system_icon/win10_off.' + imageType)
      } else {
        return require('@/static/system_icon/win10.' + imageType)
      }
    } else if (
      ostype.indexOf('2018') >= 0 ||
      ostype.indexOf('2012') >= 0 ||
      ostype.indexOf('2016') >= 0
    ) {
      // WIN8 WIN10 WINSERVER2016 WINSERVER2018 WINSERVER2012
      if (off) {
        return require('@/static/system_icon/win10_off.' + imageType)
      } else {
        return require('@/static/system_icon/win10.' + imageType)
      }
    } else if (ostype.indexOf('8') >= 0 && ostype.indexOf('2008') < 0) {
      // 此判断是为了给win8
      if (off) {
        return require('@/static/system_icon/win10_off.' + imageType)
      } else {
        return require('@/static/system_icon/win10.' + imageType)
      }
    }
  } else {
    // 不知道什么系统, 默认返回的值
    if (off) {
      return require('@/static/system_icon/os_off.' + imageType)
    } else {
      return require('@/static/system_icon/os.' + imageType)
    }
  }
}

module.exports = {
  get_system_icon,
}
// export default get_system_icon
