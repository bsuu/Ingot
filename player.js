function Inply(id) {
  this.init(id);
}

var playerDiv = null,
  playerElements = null,
  state = {
    video: false,
    audio: false,
    current: 'PLAYING',
    quality: null
  };

Inply.prototype = {
  init: function(id) {
    playerDiv = document.getElementById(id);
    playerDiv.innerHTML = '<div class="controller"> <div class="buttons"> <div id="timer" class="timer">00:00:00</div><div id="quality" class="quality"> 480p </div><div class="box" id="qualityBox"> <span>waiting</span> </div><div id="mute" class="mute">mute</div></div><div class="progressbar"> <div id="progressDot" class="dot"></div><div id="buffor" class="loaded"></div><div id="progress" class="progress"></div></div></div><div class="tv"> <video id="videoplayer" class="video" autoplay muted> </video> <audio id="audioplayer" class="audio" autoplay></audio></div>';

    playerElements = {
      timer: document.getElementById('timer'),
      quality: document.getElementById('quality'),
      mute: document.getElementById('mute'),
      dot: document.getElementById('progressDot'),
      buffor: document.getElementById('buffor'),
      progress: document.getElementById('progress'),
      qualityBox: document.getElementById('qualityBox'),
      video: document.getElementById('videoplayer'),
      audio: document.getElementById('audioplayer')
    }

    this.on('timeupdate', this.playerUpdate);
    quality.addEventListener('click', function() {
      qualityBox.style.display = (qualityBox.style.display === 'none' || qualityBox.style.display == '') ? 'block' : 'none';
    });
  },
  sync: function() {
    if (!playerElements)
      throw 'err';
    playerElements.audio.currentTime = playerElements.video.currentTime;
  },
  on: function(event, callback) {
    playerElements.video.addEventListener(event, callback);
  },
  play: function() {
    if (state.video)
      playerElements.video.play();
    if (state.audio) {
      playerElements.audio.play();
      this.sync();
    }
    //QUALITY SRC

  },
  src: function(data) {
    state.video = false;
    state.audio = false;
    state.quality = null;
    if (!data.video)
      throw 'novid';
    playerElements.video.src = data.video;
    state.video = true;
    if (data.audio) {
      playerElements.audio.src = data.audio;
      state.audio = true;
    }
  },
  bufferedPercent: function() {
    return;
  },
  playerUpdate: function() {
    if (!playerElements)
      return;

    var duration = playerElements.video.duration;
    var current = playerElements.video.currentTime;
    var bar = (current * 100) / duration;
    playerElements.progress.style.width = bar + '%';
    playerElements.dot.style.left = bar - .5 + '%';
    playerElements.timer.innerHTML = formatSeconds(current);
    var buffor = playerElements.video.duration > 0 && playerElements.video.buffered.length > 0 ? playerElements.video.buffered.end(0) / playerElements.video.duration * 100 : 0;
    playerElements.buffor.style.width = buffor + '%';
  },
  qualitySrc: function(data) {
    var webms = false,
      video, temp = {
        video: [],
        audio: null
      };
    for (video of data.video) {
      if (video.type.includes('video/webm')) {
        webms = true;
        break;
      }
    }
    for (video of data.video) {
      if (webms) {
        if (video.type.includes('video/webm')) {
          temp.video.push(video);
        }
      } else {
        if (video.type.includes('video/mp4')) {
          temp.video.push(video);
        }
      }
    }
    temp.audio = data.audio;
    playerElements.video.src = temp.video[0].src;
    playerElements.audio.src = temp.audio[0].src;
    state.audio = true;
    state.video = true;
    data = null;
    state.quality = temp;
    qualityUpdate(state.quality);
  },
  mute: function() {
    if (!playerElements)
      return;
    if (state.audio) {
      playerElements.audio.muted = !playerElements.audio.muted;
    } else {
      playerElements.video.muted = !playerElements.video.muted;
    }

  }
}

function qualityUpdate(quality) {
  while (qualityBox.firstChild) {
    qualityBox.removeChild(qualityBox.firstChild);
  }
  for (var oo of quality.video) {
    var temp = document.createElement('span');
    temp.setAttribute('video-src', oo.src);
    // temp.setAttribute('video-type', oo.type);
    temp.setAttribute('class', 'qspan');
    temp.innerHTML = oo.resolution;
    qualityBox.appendChild(temp);
    temp.addEventListener('click', function(e) {
      qualityChange(e.target);
    })
  }
}

function qualityChange(ele) {
  var src = ele.getAttribute('video-src');
  if (!src)
    return;
  quality.innerHTML = ele.innerHTML;
  playerElements.audio.pause();
  playerElements.video.src = src;
  playerElements.video.currentTime = playerElements.audio.currentTime;
}

function formatSeconds(sec) {
  var sec_num = parseInt(sec, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}