var fs = require('fs');

let loadConfig = function () {
  fs.readFile('/home/smallyu/apps/trojan/config.json', (err, data) => {
    // todo err handle

    parseFile(data)
  })
}

let parseFile = function (data) {
  let config = JSON.parse(data)
  console.log(config)

  let properties = {
    'remote_addr': {
      get: function() {
        console.log('get')
      },
      set: function() {
        console.log('set')
      }
    }
  }
  Object.defineProperties(config, properties)

  config.remote_addr = '123'
}

window.addEventListener('DOMContentLoaded', () => {
  loadConfig()
})
