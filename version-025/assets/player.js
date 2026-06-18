var SitePlayer = (function () {
  function init(sourceUrl) {
    var video = document.getElementById("videoPlayer");
    var overlay = document.querySelector(".play-overlay");
    if (!video || !sourceUrl) {
      return;
    }

    var loaded = false;
    var hls = null;

    function load() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = sourceUrl;
    }

    function start() {
      load();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  return {
    init: init
  };
})();
