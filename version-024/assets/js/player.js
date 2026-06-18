(() => {
  const video = document.querySelector('[data-stream]');
  const trigger = document.querySelector('[data-play-trigger]');

  if (!video) {
    return;
  }

  const stream = video.dataset.stream;
  let loaded = false;
  let hls = null;

  const attachStream = () => {
    if (loaded || !stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    loaded = true;
  };

  const start = async () => {
    attachStream();

    if (trigger) {
      trigger.classList.add('hidden');
    }

    try {
      await video.play();
    } catch (error) {
      if (trigger) {
        trigger.classList.remove('hidden');
      }
    }
  };

  if (trigger) {
    trigger.addEventListener('click', start);
  }

  video.addEventListener('play', () => {
    attachStream();

    if (trigger) {
      trigger.classList.add('hidden');
    }
  });

  video.addEventListener('click', () => {
    if (!loaded) {
      start();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
})();
