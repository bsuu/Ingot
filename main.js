const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const net = require('net')
const ytinfo = require('ytdl-core')
const {
  StringDecoder
} = require('string_decoder')
const decoder = new StringDecoder('utf8')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    frame: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  net.createServer((socket) => {
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', function(data) {
      var string = data.toString('utf8');
      console.log(string);
      var temp = JSON.parse(string);
      console.log(temp);
      checkInfo(temp.id, (data) => {
        mainWindow.webContents.send('onevid', data);
      });

    });

    socket.on('close', function(data) {
      console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
    });
  }).listen(1234);
}
app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('load', function(data) {

});

function checkInfo(id, callback) {
  var quality = {
    audio: [],
    video: []
  }
  if (!id)
    callback(null);

  ytinfo.getInfo(id, (err, info) => {
    if (err)
      callback(null);
    for (var obj of info.formats) {
      if (obj.type.indexOf('audio/') >= 0) {
        quality.audio.push({
          src: decoder.write(Buffer.from(obj.url)),
          type: obj.type,
          bitrate: obj.audioBitrate
        });
      } else if ((obj.container === 'webm' || obj.container === 'mp4') && (obj.audioBitrate == null) || obj.audioBitrate == '') {
        quality.video.push({
          src: decoder.write(Buffer.from(obj.url)),
          resolution: obj.resolution,
          type: obj.type
        });
      }
    }
    callback(quality);
  });
}