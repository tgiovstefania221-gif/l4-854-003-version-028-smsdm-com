(function () {
  function init(videoId, coverId, buttonId, url) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    var prepared = false;

    if (!video || !cover || !button || !url) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hls = hls;
        return;
      }

      video.src = url;
    }

    function start() {
      prepare();
      cover.classList.add("is-hidden");
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    prepare();
    cover.addEventListener("click", start);
    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  }

  window.MoviePlayer = {
    init: init
  };
})();
