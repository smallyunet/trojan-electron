var fs = require('fs');

let loadConfig = function () {
  fs.readFile('/home/smallyu/apps/trojan/config.json', (err, data) => {
    // todo err handle
    parseFile(data)
  })
}

let parseFile = function (data) {
  let config = JSON.parse(data)
  // console.log(config)

  let configEle = document.getElementById('config')
  configEle.innerHTML = `服务器地址：${config.remote_addr}`

  let remoteAddrEle = document.getElementById("remote_addr")
  remoteAddrEle.value = config.remote_addr
  let remoteAddrChange = function() {
    config.remote_addr = remoteAddrEle.value
    configEle.innerHTML = `服务器地址：${config.remote_addr}`
  }
  remoteAddrEle.addEventListener('keyup', remoteAddrChange)
}

window.addEventListener('DOMContentLoaded', () => {
  loadConfig()
})
