(function () {
  'use strict';

  var PHOTO_COUNT = 50;
  var PHOTO_EXT = 'jpeg';

  var background = document.getElementById('filmBackground');

  function photoSources() {
    var srcs = [];
    for (var i = 1; i <= PHOTO_COUNT; i++) {
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
      img.loading = 'lazy';
      img.decoding = 'async';

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

    var srcs = shuffle(photoSources());
    content.appendChild(buildFrames(srcs));
    content.appendChild(buildFrames(shuffle(srcs.slice())));

    var duration = options.duration || 400;
    var isDiagonal = /diagonal/.test(options.extraClass || '');
    content.style.animationDuration = isDiagonal
      ? duration + 's, 11s'
      : duration + 's';
    if (options.reverse) {
      content.style.animationDirection = 'reverse';
    }
    if (options.top !== undefined) strip.style.top = options.top + 'px';

    strip.appendChild(content);
    background.appendChild(strip);
  }

  var stripeHeight = 221;

  createStrip({
    top: 0,
    duration: rand(340, 460),
    reverse: false
  });

  createStrip({
    top: stripeHeight - 70,
    duration: rand(400, 520),
    reverse: true,
    extraClass: 'h narrow'
  });

  createStrip({
    top: stripeHeight * 2 - 140,
    duration: rand(360, 480),
    reverse: false,
    extraClass: 'h narrow'
  });

  createStrip({
    top: stripeHeight * 3 - 210,
    duration: rand(320, 440),
    reverse: true
  });

  createStrip({
    top: stripeHeight * 4 - 280,
    duration: rand(380, 500),
    reverse: false,
    extraClass: 'h narrow'
  });

  createStrip({
    top: stripeHeight * 5 - 350,
    duration: rand(340, 460),
    reverse: true
  });

  createStrip({
    top: -stripeHeight * 1.3,
    duration: rand(520, 680),
    reverse: true,
    extraClass: 'diagonal tilt-a'
  });

  createStrip({
    top: stripeHeight * 2.5,
    duration: rand(560, 720),
    reverse: false,
    extraClass: 'diagonal tilt-b'
  });
})();