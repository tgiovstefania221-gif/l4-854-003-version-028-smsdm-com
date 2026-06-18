(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-main-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var slider = document.querySelector("[data-hero-slider]");

        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var current = 0;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });

            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        document.querySelectorAll(".site-search-form").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";

                if (!value) {
                    event.preventDefault();
                }
            });
        });

        var liveInput = document.querySelector("[data-live-search]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var selects = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        if (liveInput && query) {
            liveInput.value = query;
        }

        function applyFilters() {
            var keyword = normalize(liveInput ? liveInput.value : "");
            var activeFilters = {};

            selects.forEach(function (select) {
                activeFilters[select.getAttribute("data-filter")] = normalize(select.value);
            });

            cards.forEach(function (card) {
                var text = normalize((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || ""));
                var matched = !keyword || text.indexOf(keyword) !== -1;

                Object.keys(activeFilters).forEach(function (key) {
                    var value = activeFilters[key];
                    if (value && normalize(card.getAttribute("data-" + key)).indexOf(value) === -1) {
                        matched = false;
                    }
                });

                card.classList.toggle("is-hidden", !matched);
            });
        }

        if (liveInput) {
            liveInput.addEventListener("input", applyFilters);
            applyFilters();
        }

        selects.forEach(function (select) {
            select.addEventListener("change", applyFilters);
        });
    });
})();

function startMoviePlayer(streamUrl) {
    var video = document.getElementById("video-player");
    var overlay = document.getElementById("play-overlay");

    if (!video || !overlay || !streamUrl) {
        return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
    } else {
        video.src = streamUrl;
    }

    function play() {
        overlay.classList.add("is-hidden");
        video.controls = true;
        var result = video.play();

        if (result && typeof result.catch === "function") {
            result.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (overlay && !overlay.classList.contains("is-hidden")) {
            play();
        }
    });
}
