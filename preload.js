var fs = require('fs');
const { exec } = require('child_process');

// let systemPassword = 'smallyu'
// let trojanPath = '/home/smallyu/apps/trojan'

let systemPassword = ''
let trojanPath = '.'

let config = {}

// -------------------------------------------------

let consoleLogEle = null

let loadConsoleLog = () => {
  consoleLogEle = document.getElementById('consoleLog')
}

let consoleLogPrint = (v) => {
  consoleLogEle.innerHTML += v + '<br/>'
}

let consoleLogClear = () => {
  consoleLogEle.innerHTML = ''
}

// -------------------------------------------------

let loadConfig = function () {
  fs.readFile(`${trojanPath}/config.json`, (err, data) => {
    parseFile(data)
  })
}

let parseFile = function (data) {
  config = JSON.parse(data)
  // console.log(config)

  // 配置信息回显
  let configEle = document.getElementById('config')
  configEle.innerHTML = `
    服务器地址：${config.remote_addr}
    <br/>
    密码：${config.password[0]}
    <br/>
    本地地址：${config.local_addr}
    <br/>
    本地端口：${config.remote_port}
    <br/>
    连接方式：socks5
  `

  // 处理输入框事件
  let remoteAddrEle = document.getElementById("remoteAddr")
  let passwordEle = document.getElementById("password")
  let sysPasswordEle = document.getElementById("sysPassword")

  remoteAddrEle.value = config.remote_addr
  passwordEle.value = config.password[0]

  let remoteAddrChange = () => {
    config.remote_addr = remoteAddrEle.value
    configEle.innerHTML = `
      服务器地址：${config.remote_addr}
      <br/>
      密码：${config.password[0]}
      <br/>
      本地地址：${config.local_addr}
      <br/>
      本地端口：${config.remote_port}
      <br/>
      连接方式：socks5
    `
  }
  let passwordChange = () => {
    config.password[0] = passwordEle.value
    configEle.innerHTML = `
      服务器地址：${config.remote_addr}
      <br/>
      密码：${config.password[0]}
      <br/>
      本地地址：${config.local_addr}
      <br/>
      本地端口：${config.remote_port}
      <br/>
      连接方式：socks5
    `
  }
  let sysPasswordhange = () => {
    systemPassword = sysPasswordEle.value
  }
  remoteAddrEle.addEventListener('keyup', remoteAddrChange)
  passwordEle.addEventListener('keyup', passwordChange)
  sysPasswordEle.addEventListener('keyup', sysPasswordhange)
}

// -------------------------------------------------

let saveConfig = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${trojanPath}/config.json`, JSON.stringify(config), err => {
      resolve(err==null)
    })
  })
}

let statusAction = () => {
  return new Promise((resolve, reject) => {
    exec(`ps -ef | grep trojan`, (err, stdout, stderr) => {
      // 查找进程
      let pids = []
      let iterator = stdout.matchAll(`(?=root).*(?=${trojanPath}/config.json)`)
      let next = iterator.next()
      while (next.value != undefined) {
        pids.push(`${next.value}`.replace(/\s+/g,',').split(',')[1])
        next = iterator.next()
      }
      resolve(pids.length!=0)
    })
  })
}

let startAction = () => {
  return new Promise((resolve, reject) => {
    let startCommand = `
      echo ${systemPassword} \
      | sudo -S ${trojanPath}/trojan -c ${trojanPath}/config.json
    `
    exec(startCommand, (err, stdout, stderr) => {
      resolve()
    })
  })
}

let stopAction = () => {
  return new Promise((resolve, reject) => {
    exec(`ps -ef | grep trojan`, (err, stdout, stderr) => {
      // 查找进程
      let pids = []
      let iterator = stdout.matchAll(`(?=root).*(?=${trojanPath}/config.json)`)
      let next = iterator.next()
      while (next.value != undefined) {
        pids.push(`${next.value}`.replace(/\s+/g,',').split(',')[1])
        next = iterator.next()
      }
      // kill进程
      pids.map(pid => {
        exec(`echo ${systemPassword} | sudo -S kill -9 ${pid}`, (err, stdout, stderr) => {})
      })
      setTimeout(() => {
        resolve(true)
      }, 300)
    })
  })
}

let loadButton = function() {
  let startEle = document.getElementById('start')
  let stopEle = document.getElementById('stop')
  let restartEle = document.getElementById('restart')
  let statusEle = document.getElementById('status')
  let clearEle = document.getElementById('clear')

  let startClick = () => {
    saveConfig().then(status => {
      consoleLogPrint(`写入配置文件：${status==true?'成功':'失败'}`)
    }).then(() => {
      startAction()
      setTimeout(() => {
        statusAction().then(status => {
          consoleLogPrint(`启动程序：${status==true?'成功':'失败'}`)
        })
      }, 3000)
    })
  }
  let stopClick = () => {
    stopAction().then(status => {
      consoleLogPrint(`停止程序：${status==true?'成功':'失败'}`)
    })
  }
  let restartClick = () => {
    saveConfig().then(status => {
      consoleLogPrint(`保存配置：${status==true?'成功':'失败'}`)
    }).then(() => {
      stopAction().then(status => {
        consoleLogPrint(`停止程序：${status==true?'成功':'失败'}`)
      }).then(startClick)
    })
  }
  let statusClick = () => {
    statusAction().then(status => {
      consoleLogPrint(`程序运行状态：${status==true?'运行中':'停止'}`)
    })
  }
  let clearClick = () => {
    consoleLogClear()
  }

  startEle.addEventListener('click', startClick)
  stopEle.addEventListener('click', stopClick)
  restartEle.addEventListener('click', restartClick)
  statusEle.addEventListener('click', statusClick)
  clearEle.addEventListener('click', clearClick)
}

// -------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  loadConsoleLog()
  loadConfig()
  loadButton()
})
