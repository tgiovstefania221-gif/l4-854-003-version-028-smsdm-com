import { H as Hls } from "./hls-vendor.js";

function attachPlayer(root) {
  var video = root.querySelector("video");
  var button = root.querySelector("[data-play-button]");
  var cover = root.querySelector("[data-play-cover]");
  var source = video ? video.getAttribute("data-play-url") : "";
  var hls = null;
  var started = false;

  function start() {
    if (!video || !source) {
      return;
    }

    if (!started) {
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    if (cover) {
      cover.classList.add("hidden");
    }

    video.controls = true;
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (cover) {
          cover.classList.remove("hidden");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", start);
  }

  if (cover) {
    cover.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (!started) {
      start();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.querySelectorAll("[data-player]").forEach(attachPlayer);
