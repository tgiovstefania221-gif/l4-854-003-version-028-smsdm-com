(function() {
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var title = document.getElementById("search-title");
  var params = new URLSearchParams(window.location.search);
  var initial = params.get("q") || "";

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function(ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[ch];
    });
  }

  function card(item) {
    return [
      '<a class="movie-card" href="./' + escapeHtml(item.url) + '">',
      '<span class="movie-poster">',
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="poster-gradient"></span>',
      '<span class="movie-badge">' + escapeHtml(item.category) + '</span>',
      '<span class="movie-play">▶</span>',
      '</span>',
      '<span class="movie-info">',
      '<strong>' + escapeHtml(item.title) + '</strong>',
      '<em>' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</em>',
      '<span class="movie-desc">' + escapeHtml(item.desc) + '</span>',
      '<span class="movie-tags"><span>' + escapeHtml(item.genre) + '</span></span>',
      '</span>',
      '</a>'
    ].join("");
  }

  function render(query) {
    var q = String(query || "").trim().toLowerCase();
    if (!q) {
      title.textContent = "精选推荐";
      return;
    }
    var words = q.split(/\s+/).filter(Boolean);
    var matched = (window.SEARCH_INDEX || []).filter(function(item) {
      return words.every(function(word) {
        return item.text.indexOf(word) !== -1;
      });
    }).slice(0, 80);
    title.textContent = "搜索：" + query;
    results.innerHTML = matched.length ? matched.map(card).join("") : '<div class="story-section"><h2>没有找到匹配内容</h2><p>可以尝试更换片名、题材、地区或年份继续搜索。</p></div>';
  }

  if (input) {
    input.value = initial;
    render(initial);
    input.addEventListener("input", function() {
      render(input.value);
    });
  }

  document.querySelectorAll(".quick-keywords button").forEach(function(button) {
    button.addEventListener("click", function() {
      input.value = button.dataset.keyword || "";
      render(input.value);
    });
  });
}());
