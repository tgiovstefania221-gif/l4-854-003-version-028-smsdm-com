(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
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

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function filterCards(input) {
    var grid = input.closest(".section-wrap").querySelector(".movie-grid");
    if (!grid) {
      return;
    }
    var keyword = normalize(input.value);
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-search") || card.textContent);
      card.classList.toggle("is-hidden-by-search", keyword && haystack.indexOf(keyword) === -1);
    });
  }

  function setupFiltering() {
    var searchInput = document.querySelector("[data-search-query]");
    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      searchInput.value = query;
    }

    Array.prototype.slice.call(document.querySelectorAll(".movie-filter-input")).forEach(function (input) {
      input.addEventListener("input", function () {
        filterCards(input);
      });
      if (input.value) {
        filterCards(input);
      }
    });
  }

  function sortCards(select) {
    var grid = select.closest(".section-wrap").querySelector("[data-sortable]");
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var mode = select.value;
    cards.sort(function (a, b) {
      if (mode === "year-desc") {
        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
      }
      if (mode === "hot-desc") {
        return Number(b.getAttribute("data-hot")) - Number(a.getAttribute("data-hot"));
      }
      if (mode === "title-asc") {
        return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
      }
      return 0;
    });
    cards.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  function setupSorting() {
    Array.prototype.slice.call(document.querySelectorAll(".movie-sort-select")).forEach(function (select) {
      select.addEventListener("change", function () {
        sortCards(select);
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFiltering();
    setupSorting();
  });
})();
