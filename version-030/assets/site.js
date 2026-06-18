(function () {
  var normalize = function (value) {
    return String(value || "").toLowerCase().trim();
  };

  var body = document.body;
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      body.classList.toggle("mobile-open");
    });
  }

  document.querySelectorAll("[data-mobile-panel] a").forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("mobile-open");
    });
  });

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    var activate = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    var start = function () {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        activate(index + 1);
      }, 5600);
    };

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        activate(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        activate(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(index + 1);
        start();
      });
    }

    activate(0);
    start();
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-filter-input]");
    var yearSelect = scope.querySelector("[data-filter-year]");
    var regionSelect = scope.querySelector("[data-filter-region]");
    var reset = scope.querySelector("[data-filter-reset]");
    var empty = scope.querySelector("[data-empty-state]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-item"));

    if (input && query) {
      input.value = query;
    }

    var apply = function () {
      var keyword = normalize(input ? input.value : "");
      var year = yearSelect ? yearSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var cardYear = card.getAttribute("data-year") || "";
        var cardRegion = card.getAttribute("data-region") || "";
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (region && cardRegion !== region) {
          matched = false;
        }

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };

    [input, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (yearSelect) {
          yearSelect.value = "";
        }
        if (regionSelect) {
          regionSelect.value = "";
        }
        apply();
      });
    }

    apply();
  });
})();
