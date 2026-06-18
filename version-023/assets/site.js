(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.opacity = "0";
    });
  });

  var filterRoot = document.querySelector("[data-filter-root]");

  if (filterRoot) {
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
    var keywordInput = document.querySelector("[data-filter-keyword]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var categorySelect = document.querySelector("[data-filter-category]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var empty = document.querySelector("[data-filter-empty]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var category = normalize(categorySelect && categorySelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute("data-keywords"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardCategory = normalize(card.getAttribute("data-category"));
        var cardType = normalize(card.getAttribute("data-type"));
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }

        if (year && cardYear.indexOf(year) === -1) {
          matched = false;
        }

        if (category && cardCategory !== category) {
          matched = false;
        }

        if (type && cardType.indexOf(type) === -1) {
          matched = false;
        }

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    [keywordInput, yearSelect, categorySelect, typeSelect].forEach(function (element) {
      if (element) {
        element.addEventListener("input", applyFilters);
        element.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  }

  var searchForm = document.querySelector("[data-search-form]");
  var searchResults = document.querySelector("[data-search-results]");

  if (searchForm && searchResults && Array.isArray(window.MOVIES)) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    var input = searchForm.querySelector("input[name='q']");
    var category = searchForm.querySelector("select[name='category']");
    var year = searchForm.querySelector("select[name='year']");

    if (input) {
      input.value = initialQuery;
    }

    function makeCard(movie) {
      var tags = movie.tags.slice(0, 3).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");

      return "<article class=\"movie-card\">" +
        "<a class=\"poster\" href=\"" + movie.url + "\">" +
        "<img src=\"" + movie.image + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
        "<span class=\"poster-badge\">" + escapeHtml(movie.year) + "</span>" +
        "</a>" +
        "<div class=\"movie-info\">" +
        "<a class=\"movie-title\" href=\"" + movie.url + "\">" + escapeHtml(movie.title) + "</a>" +
        "<p class=\"movie-desc\">" + escapeHtml(movie.description) + "</p>" +
        "<p class=\"movie-meta\">" + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</p>" +
        "<p class=\"movie-genre\">" + escapeHtml(movie.genre) + "</p>" +
        "<div class=\"tag-row\">" + tags + "</div>" +
        "<a class=\"category-pill\" href=\"" + movie.categoryUrl + "\">" + escapeHtml(movie.category) + "</a>" +
        "</div>" +
        "</article>";
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderSearch() {
      var q = String(input && input.value || "").toLowerCase().trim();
      var cat = String(category && category.value || "").trim();
      var y = String(year && year.value || "").trim();

      var results = window.MOVIES.filter(function (movie) {
        var text = [movie.title, movie.description, movie.genre, movie.tags.join(" "), movie.region, movie.type].join(" ").toLowerCase();
        var ok = true;

        if (q && text.indexOf(q) === -1) {
          ok = false;
        }

        if (cat && movie.category !== cat) {
          ok = false;
        }

        if (y && movie.year !== y) {
          ok = false;
        }

        return ok;
      }).slice(0, 160);

      if (!results.length) {
        searchResults.innerHTML = "<div class=\"empty-results\">暂无匹配内容</div>";
        return;
      }

      searchResults.innerHTML = results.map(makeCard).join("");
    }

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      renderSearch();
    });

    [input, category, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", renderSearch);
        element.addEventListener("change", renderSearch);
      }
    });

    renderSearch();
  }
}());
