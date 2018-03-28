const {
  ipcRenderer
} = require('electron')
ipcRenderer.on('clientJoin', (event, args) => {
  document.getElementById('message').innerHTML = args;
})