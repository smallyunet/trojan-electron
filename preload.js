// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

var fs = require('fs');

let loadConfig = function () {
  fs.readFile('/home/smallyu/apps/trojan/config.json', (err, data) => {
    // todo err handle

    // print on page
    document.getElementById("config").innerHTML = data

    parseFile(data)
  })
}

let parseFile = function (data) {
  let config = JSON.parse(data)
  console.log(config)

  let getset = {
    get: function() {
      console.log('get')
    },
    set: function() {
      console.log('set')
    }
  }
  Object.defineProperty(config, 'remote_addr', getset)

  config.remote_addr = '123'
}

window.addEventListener('DOMContentLoaded', () => {
  loadConfig()
})
