(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
      menuButton.textContent = mobilePanel.classList.contains('open') ? '×' : '☰';
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    const showSlide = (nextIndex) => {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const nextIndex = Number(dot.dataset.heroDot || 0);
        showSlide(nextIndex);
      });
    });

    window.setInterval(() => {
      showSlide(index + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-card-filter]').forEach((input) => {
    const section = input.closest('section');
    const list = section ? section.querySelector('[data-filter-list]') : null;
    const cards = list ? Array.from(list.querySelectorAll('[data-movie-card]')) : [];

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();

      cards.forEach((card) => {
        const haystack = [card.dataset.title, card.dataset.tags, card.dataset.region].join(' ').toLowerCase();
        card.style.display = !query || haystack.includes(query) ? '' : 'none';
      });
    });
  });
})();
