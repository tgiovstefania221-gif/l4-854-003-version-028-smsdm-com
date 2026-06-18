(function () {
    'use strict';

    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function initMobileMenu() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var thumbs = selectAll('[data-hero-thumb]', hero);
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function setSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
            thumbs.forEach(function (thumb, thumbIndex) {
                thumb.classList.toggle('active', thumbIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
                start();
            });
        });
        thumbs.forEach(function (thumb, index) {
            thumb.addEventListener('click', function () {
                setSlide(index);
                start();
            });
        });
        if (previous) {
            previous.addEventListener('click', function () {
                setSlide(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                setSlide(current + 1);
                start();
            });
        }
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initLocalFilters() {
        var input = document.querySelector('.js-local-search');
        var year = document.querySelector('.js-year-filter');
        var grid = document.querySelector('[data-card-grid]');
        var empty = document.querySelector('[data-empty-state]');
        if (!grid || (!input && !year)) {
            return;
        }
        var cards = selectAll('[data-card]', grid);

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region')
                ].join(' ').toLowerCase();
                var yearMatches = !selectedYear || card.getAttribute('data-year') === selectedYear;
                var keywordMatches = !keyword || text.indexOf(keyword) !== -1;
                var show = yearMatches && keywordMatches;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }
        if (year) {
            year.addEventListener('change', applyFilter);
        }
        applyFilter();
    }

    function initImageFallbacks() {
        selectAll('img.cover-image').forEach(function (image) {
            image.addEventListener('error', function () {
                var parent = image.parentElement;
                if (parent) {
                    parent.classList.add('image-missing');
                }
                image.style.opacity = '0';
            }, { once: true });
        });
    }

    function initPlayers() {
        selectAll('[data-player]').forEach(function (player) {
            var source = player.getAttribute('data-src');
            var video = player.querySelector('video');
            var button = player.querySelector('[data-player-button]');
            var hlsInstance = null;
            if (!source || !video || !button) {
                return;
            }

            function playVideo() {
                player.classList.add('playing');
                video.setAttribute('controls', 'controls');

                if (hlsInstance) {
                    video.play().catch(function () {});
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            hlsInstance.destroy();
                            hlsInstance = null;
                            video.src = source;
                            video.play().catch(function () {});
                        }
                    });
                    return;
                }

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    video.play().catch(function () {});
                    return;
                }

                video.src = source;
                video.play().catch(function () {});
            }

            button.addEventListener('click', playVideo);
            video.addEventListener('play', function () {
                player.classList.add('playing');
            });
        });
    }

    function initSearchPage() {
        var data = window.MOVIE_SEARCH_DATA;
        var input = document.getElementById('searchInput');
        var category = document.getElementById('searchCategory');
        var button = document.getElementById('searchButton');
        var results = document.getElementById('searchResults');
        var summary = document.getElementById('searchSummary');
        if (!data || !input || !category || !button || !results || !summary) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        input.value = params.get('q') || '';

        function card(movie) {
            var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');
            return [
                '<article class="movie-card">',
                '    <a class="movie-poster" href="' + escapeHtml(movie.href) + '">',
                '        <img class="cover-image" src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                '        <span class="play-badge">▶</span>',
                '        <span class="rating-badge">' + escapeHtml(movie.rating) + '</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <a class="movie-title" href="' + escapeHtml(movie.href) + '">' + escapeHtml(movie.title) + '</a>',
                '        <p>' + escapeHtml(movie.oneLine || movie.summary) + '</p>',
                '        <div class="movie-meta">',
                '            <span>' + escapeHtml(movie.year) + '</span>',
                '            <span>' + escapeHtml(movie.region) + '</span>',
                '            <span>' + escapeHtml(movie.type) + '</span>',
                '        </div>',
                '        <div class="tag-row">' + tags + '</div>',
                '    </div>',
                '</article>'
            ].join('');
        }

        function runSearch() {
            var keyword = input.value.trim().toLowerCase();
            var selectedCategory = category.value;
            var matched = data.filter(function (movie) {
                var text = [
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.category,
                    (movie.tags || []).join(' '),
                    movie.oneLine,
                    movie.summary
                ].join(' ').toLowerCase();
                var keywordMatches = !keyword || text.indexOf(keyword) !== -1;
                var categoryMatches = !selectedCategory || movie.category === selectedCategory;
                return keywordMatches && categoryMatches;
            });
            var limited = matched.slice(0, 120);
            results.innerHTML = limited.map(card).join('');
            initImageFallbacks();
            summary.textContent = '共找到 ' + matched.length + ' 条结果，当前显示 ' + limited.length + ' 条。';
        }

        button.addEventListener('click', runSearch);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                runSearch();
            }
        });
        category.addEventListener('change', runSearch);
        runSearch();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initLocalFilters();
        initPlayers();
        initSearchPage();
        initImageFallbacks();
    });
})();
