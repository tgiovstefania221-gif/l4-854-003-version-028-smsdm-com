(function() {
  var menuButton = document.querySelector(".mobile-menu-button");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function() {
      var open = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".js-search-form").forEach(function(form) {
    form.addEventListener("submit", function(event) {
      var input = form.querySelector("input[name='q']");
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = "./search.html";
      }
    });
  });

  var slider = document.querySelector(".js-hero-slider");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var prev = slider.querySelector(".hero-prev");
    var next = slider.querySelector(".hero-next");
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === active);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function() {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        show(active + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    start();
  }

  var filterInput = document.querySelector(".js-card-filter");
  var grid = document.querySelector(".js-card-grid");

  if (filterInput && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    filterInput.addEventListener("input", function() {
      var value = filterInput.value.trim().toLowerCase();
      cards.forEach(function(card) {
        var text = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.category
        ].join(" ").toLowerCase();
        card.style.display = !value || text.indexOf(value) !== -1 ? "" : "none";
      });
    });

    var sortYear = document.querySelector(".js-sort-year");
    var sortTitle = document.querySelector(".js-sort-title");

    function applySort(fn) {
      cards.sort(fn).forEach(function(card) {
        grid.appendChild(card);
      });
    }

    if (sortYear) {
      sortYear.addEventListener("click", function() {
        applySort(function(a, b) {
          return String(b.dataset.year).localeCompare(String(a.dataset.year), "zh-Hans-CN");
        });
      });
    }

    if (sortTitle) {
      sortTitle.addEventListener("click", function() {
        applySort(function(a, b) {
          return String(a.dataset.title).localeCompare(String(b.dataset.title), "zh-Hans-CN");
        });
      });
    }
  }
}());
