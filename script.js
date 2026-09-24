(function () {
  'use strict';

  var PHOTO_COUNT = 50;
  var PHOTO_EXT = 'webp';
  var PHOTO_SKIP = { 23: true };
  var STRIPE_HEIGHT = 268;
  var SONG_START_SECONDS = 4;
  var FALLBACK_SRC =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  var background = document.getElementById('filmBackground');

  function photoSources() {
    var srcs = [];
    for (var i = 1; i <= PHOTO_COUNT; i++) {
      if (PHOTO_SKIP[i]) continue;
      var name = String(i).padStart(2, '0');
      srcs.push('photos/' + name + '.' + PHOTO_EXT);
    }
    return srcs;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildFrames(srcs) {
    var frag = document.createDocumentFragment();
    srcs.forEach(function (src) {
      var frame = document.createElement('div');
      frame.className = 'frame';

      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.onerror = function () {
        this.src = FALLBACK_SRC;
      };

      frame.appendChild(img);
      frag.appendChild(frame);
    });
    return frag;
  }

  function createStrip(options) {
    var strip = document.createElement('div');
    strip.className = 'film-strip ' + (options.extraClass || '');

    var content = document.createElement('div');
    content.className = 'strip-content';

    var order = shuffle(photoSources());
    content.appendChild(buildFrames(order));
    content.appendChild(buildFrames(order.slice()));

    content.style.animationDuration = (options.duration || 400) + 's';
    if (options.reverse) {
      content.style.animationDirection = 'reverse';
    }
    if (options.top !== undefined) strip.style.top = options.top + 'px';

    strip.appendChild(content);
    background.appendChild(strip);
  }

  function bandPlan(isMobile, innerHeight) {
    if (isMobile) {
      return { rows: 4, step: 280 };
    }
    var step = Math.round(STRIPE_HEIGHT * 0.68);
    var rows = Math.max(6, Math.ceil((innerHeight + STRIPE_HEIGHT) / step));
    rows = Math.min(rows, 8);
    return { rows: rows, step: step };
  }

  var isMobile = window.innerWidth < 640;
  var plan = bandPlan(isMobile, window.innerHeight);

  var r;
  for (r = 0; r < plan.rows; r++) {
    var narrow = r % 2 === 1;
    createStrip({
      top: r * plan.step,
      duration: rand(320, 480),
      reverse: narrow,
      extraClass: 'h' + (narrow ? ' narrow' : '')
    });
  }

  if (isMobile) {
    createStrip({
      top: Math.round(window.innerHeight * 0.55),
      duration: rand(500, 660),
      reverse: true,
      extraClass: 'diagonal tilt-a'
    });
  } else {
    createStrip({
      top: -STRIPE_HEIGHT * 1.3,
      duration: rand(520, 680),
      reverse: true,
      extraClass: 'diagonal tilt-a'
    });

    createStrip({
      top: STRIPE_HEIGHT * 2.5,
      duration: rand(560, 720),
      reverse: false,
      extraClass: 'diagonal tilt-b'
    });
  }

  var card = document.querySelector('.message-card');
  document.addEventListener('click', function () {
    card.classList.toggle('is-hidden');
  });

  var music = document.getElementById('music');
  var musicToggle = document.getElementById('musicToggle');
  var iconPlay = document.getElementById('iconPlay');
  var iconPause = document.getElementById('iconPause');

  function setMusicState(playing) {
    iconPlay.style.display = playing ? 'none' : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
    musicToggle.setAttribute('aria-pressed', String(playing));
  }

  music.addEventListener('play', function () { setMusicState(true); });
  music.addEventListener('pause', function () { setMusicState(false); });

  function tryPlay() {
    var promise = music.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  }

  var audioStarted = false;

  function applyStartTime() {
    if (SONG_START_SECONDS > 0 && isFinite(music.duration)) {
      music.currentTime = Math.min(SONG_START_SECONDS, music.duration);
    }
  }

  function startPlayback() {
    if (audioStarted) return;
    audioStarted = true;
    applyStartTime();
    tryPlay();
  }

  function tryAutoplay() {
    var promise = music.play();
    if (promise && promise.then) {
      promise.then(function () {
        if (!audioStarted) {
          audioStarted = true;
          applyStartTime();
        }
      }).catch(function () {
        music.muted = true;
        if (music.readyState >= 1) applyStartTime();
        tryPlay();
      });
    }
  }

  function resumeOnGesture() {
    if (music.muted) music.muted = false;
    if (music.paused) {
      startPlayback();
    }
    document.removeEventListener('pointerdown', resumeOnGesture);
    document.removeEventListener('touchstart', resumeOnGesture);
    document.removeEventListener('keydown', resumeOnGesture);
  }

  musicToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    if (music.paused) {
      tryPlay();
    } else {
      music.pause();
    }
  });

  if (music.readyState >= 1) {
    tryAutoplay();
  } else {
    music.addEventListener('loadedmetadata', tryAutoplay, { once: true });
  }
  document.addEventListener('pointerdown', resumeOnGesture);
  document.addEventListener('touchstart', resumeOnGesture);
  document.addEventListener('keydown', resumeOnGesture);
})();
