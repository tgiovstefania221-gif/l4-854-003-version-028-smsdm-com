(function () {
  var stages = document.querySelectorAll(".player-stage");

  stages.forEach(function (stage) {
    var video = stage.querySelector("video");
    var cover = stage.querySelector(".player-cover");
    var hlsInstance = null;
    var started = false;

    var begin = function () {
      if (!video) {
        return;
      }

      var stream = video.getAttribute("data-stream");
      if (!stream) {
        return;
      }

      if (cover) {
        cover.classList.add("is-hidden");
      }

      video.setAttribute("controls", "controls");

      if (!started) {
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          video.play().catch(function () {});
        } else {
          video.src = stream;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
    };

    if (cover) {
      cover.addEventListener("click", begin);
    }

    stage.addEventListener("click", function (event) {
      if (event.target === video && video.paused) {
        begin();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
