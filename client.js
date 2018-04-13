var net = require('net');
var PORT = 1234;

var client = new net.Socket();
client.connect(PORT, function() {

  console.log('CONNECTED TO: ' + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  writeMessage({
    type: 'YT',
    id: 'y0OmkdDPGAM'
  });
  client.destroy();
});

function writeMessage(obj) {
  var buffer = Buffer.from(JSON.stringify(obj));
  client.write(buffer);
}

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

  console.log('DATA: ' + data);
  // Close the client socket completely


});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});

//https://r5---sn-u2oxu-3ufs.googlevideo.com/videoplayback?pcm2cms=yes&expire=1522889702&lmt=1522846603341951&mt=1522868028&ei=hh_FWsLsEs_sgAegrLhw&c=WEB&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&key=yt6&clen=13673628&requiressl=yes&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2cms%2Cpl%2Crequiressl%2Csource%2Cexpire&keepalive=yes&ip=46.134.9.76&pl=19&id=o-ALyNo41pvqlrJpbBs7iVaNxm6UCQIjVEoc6RQMOZKS0h&initcwndbps=716250&fvip=5&dur=189.989&signature=BC4627AC6FAA939681AECE3D72F7B5090E9CFC4A.9607C82208C976D4679E7F39C69A1771A5A4E63B&ms=au%2Crdu&mime=video%2Fmp4&mv=m&source=youtube&mn=sn-u2oxu-3ufs%2Csn-hgn7rn7r&ipbits=0&mm=31%2C29&itag=137&ratebypass=yes