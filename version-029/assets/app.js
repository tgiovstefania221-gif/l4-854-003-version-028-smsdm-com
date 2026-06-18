(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
            return;
        }
        document.addEventListener('DOMContentLoaded', callback);
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
            button.textContent = panel.classList.contains('is-open') ? '×' : '☰';
        });
    }

    function initSearchRedirects() {
        var forms = document.querySelectorAll('[data-site-search]');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                var url = './search.html';
                if (query) {
                    url += '?q=' + encodeURIComponent(query);
                }
                window.location.href = url;
            });
        });
    }

    function initFilters() {
        var input = document.querySelector('[data-filter-input]');
        var region = document.querySelector('[data-filter-region]');
        var year = document.querySelector('[data-filter-year]');
        var category = document.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
        if (!cards.length || (!input && !region && !year && !category)) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }
        function applyFilter() {
            var queryValue = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var yearValue = normalize(year && year.value);
            var categoryValue = normalize(category && category.value);
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardCategory = normalize(card.getAttribute('data-category'));
                var matched = true;
                if (queryValue && haystack.indexOf(queryValue) === -1) {
                    matched = false;
                }
                if (regionValue && cardRegion.indexOf(regionValue) === -1) {
                    matched = false;
                }
                if (yearValue && cardYear.indexOf(yearValue) === -1) {
                    matched = false;
                }
                if (categoryValue && cardCategory !== categoryValue) {
                    matched = false;
                }
                card.classList.toggle('is-hidden', !matched);
            });
        }
        [input, region, year, category].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener('input', applyFilter);
            control.addEventListener('change', applyFilter);
        });
        applyFilter();
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var nextIndex = Number(dot.getAttribute('data-hero-dot'));
                show(nextIndex);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initPlayers() {
        var boxes = document.querySelectorAll('[data-player-box]');
        boxes.forEach(function (box) {
            var video = box.querySelector('[data-player]');
            var overlay = box.querySelector('[data-play-trigger]');
            if (!video) {
                return;
            }
            var url = video.getAttribute('data-m3u8');
            var loaded = false;
            var hlsInstance = null;
            function loadVideo() {
                if (loaded || !url) {
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(url);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = url;
                }
                loaded = true;
            }
            function playVideo() {
                loadVideo();
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {
                        video.setAttribute('controls', 'controls');
                    });
                }
            }
            if (overlay) {
                overlay.addEventListener('click', playVideo);
            }
            video.addEventListener('click', function () {
                if (!loaded) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }

    ready(function () {
        initMenu();
        initSearchRedirects();
        initFilters();
        initHero();
        initPlayers();
    });
})();
