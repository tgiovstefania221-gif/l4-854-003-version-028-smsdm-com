(function () {
  const menuButton = document.querySelector(".menu-toggle");
  if (menuButton) {
    menuButton.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  const carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    const search = scope.querySelector("[data-card-search]");
    const year = scope.querySelector("[data-year-filter]");
    const type = scope.querySelector("[data-type-filter]");
    const category = scope.querySelector("[data-category-filter]");
    const area = scope.parentElement || document;
    const cards = Array.from(area.querySelectorAll(".movie-card"));

    function filterCards() {
      const query = normalize(search ? search.value : "");
      const yearValue = normalize(year ? year.value : "");
      const typeValue = normalize(type ? type.value : "");
      const categoryValue = normalize(category ? category.value : "");

      cards.forEach(function (card) {
        const text = normalize(card.textContent + " " + card.dataset.title + " " + card.dataset.region + " " + card.dataset.type + " " + card.dataset.category);
        const matchesText = !query || text.indexOf(query) !== -1;
        const matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
        const matchesType = !typeValue || normalize(card.dataset.type) === typeValue;
        const matchesCategory = !categoryValue || normalize(card.dataset.category) === categoryValue;
        card.classList.toggle("is-hidden", !(matchesText && matchesYear && matchesType && matchesCategory));
      });
    }

    [search, year, type, category].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && search) {
      search.value = q;
      filterCards();
    }
  });
})();
