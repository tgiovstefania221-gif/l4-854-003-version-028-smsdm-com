(() => {
  const movies = window.siteMovieIndex || [];
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const status = document.querySelector('[data-search-status]');
  const chips = document.querySelector('[data-search-chips]');

  if (!form || !input || !results || !status) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const renderCard = (movie) => `
    <article class="movie-card" data-movie-card>
      <a class="movie-thumb" href="${escapeHtml(movie.file)}" aria-label="观看${escapeHtml(movie.title)}">
        <img src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy">
        <span class="thumb-mask"><span class="thumb-play">▶</span></span>
      </a>
      <div class="movie-body">
        <a class="movie-title" href="${escapeHtml(movie.file)}">${escapeHtml(movie.title)}</a>
        <div class="movie-meta">${escapeHtml(movie.year)} · ${escapeHtml(movie.region)} · ${escapeHtml(movie.type)}</div>
        <p>${escapeHtml(movie.oneLine)}</p>
        <div class="movie-tags">
          ${movie.terms.slice(0, 3).map((term) => `<span>${escapeHtml(term)}</span>`).join('')}
        </div>
      </div>
    </article>
  `;

  const search = (query) => {
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (!keywords.length) {
      const picks = movies.slice(0, 24);
      status.textContent = '推荐浏览';
      results.innerHTML = picks.map(renderCard).join('');
      return;
    }

    const matched = movies.filter((movie) => {
      const haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(' ').toLowerCase();

      return keywords.every((word) => haystack.includes(word));
    }).slice(0, 120);

    status.textContent = matched.length ? `找到 ${matched.length} 条相关内容` : '暂无匹配内容';
    results.innerHTML = matched.map(renderCard).join('');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const url = new URL(window.location.href);

    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState(null, '', url.toString());
    search(query);
  });

  input.addEventListener('input', () => {
    search(input.value);
  });

  if (chips) {
    chips.addEventListener('click', (event) => {
      const button = event.target.closest('button');

      if (!button) {
        return;
      }

      input.value = button.textContent.trim();
      search(input.value);
    });
  }

  search(input.value);
})();
