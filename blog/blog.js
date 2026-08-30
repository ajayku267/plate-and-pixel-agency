/* ============================================================
   PLATES & PIXELS — BLOG.JS
   Blog system: TOC, reading progress, search, FAQ, sidebar sync
   ============================================================ */

(function () {
  'use strict';

  /* ── READING PROGRESS ─────────────────────────────────── */
  const progressBar = document.querySelector('.reading-progress');
  function updateProgress() {
    if (!progressBar) return;
    const docEl = document.documentElement;
    const scrolled = docEl.scrollTop || document.body.scrollTop;
    const totalHeight = docEl.scrollHeight - docEl.clientHeight;
    const progress = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── AUTO TABLE OF CONTENTS ───────────────────────────── */
  function buildTOC() {
    const body = document.querySelector('.article-body');
    const tocList = document.querySelector('.toc__list');
    const sidebarToc = document.querySelector('.sidebar-toc');
    if (!body || !tocList) return;

    const headings = body.querySelectorAll('h2');
    if (headings.length < 3) {
      const tocEl = document.querySelector('.toc');
      if (tocEl) tocEl.style.display = 'none';
      return;
    }

    headings.forEach((h, i) => {
      if (!h.id) h.id = 'section-' + i;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);

      if (sidebarToc) {
        const li2 = document.createElement('li');
        const a2 = document.createElement('a');
        a2.href = '#' + h.id;
        a2.textContent = h.textContent;
        li2.appendChild(a2);
        sidebarToc.appendChild(li2);
      }
    });
  }

  /* ── ACTIVE TOC HIGHLIGHT ON SCROLL ──────────────────── */
  function initActiveTOC() {
    const links = document.querySelectorAll('.toc__list a, .sidebar-toc a');
    if (!links.length) return;

    const headings = Array.from(document.querySelectorAll('.article-body h2'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          links.forEach(l => {
            if (l.getAttribute('href') === '#' + entry.target.id) {
              l.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  /* ── FAQ ACCORDION ────────────────────────────────────── */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const q = item.querySelector('.faq-item__q');
      if (!q) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Open this if was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── BLOG SEARCH ──────────────────────────────────────── */
  function initSearch() {
    const searchInput = document.getElementById('blog-search');
    const cards = document.querySelectorAll('.blog-card-v2');
    const noResults = document.querySelector('.no-results');
    if (!searchInput || !cards.length) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const cat = (card.dataset.category || '').toLowerCase();
        const keywords = (card.dataset.keywords || '').toLowerCase();
        const match = !query || title.includes(query) || cat.includes(query) || keywords.includes(query);
        card.dataset.hidden = match ? 'false' : 'true';
        if (match) visible++;
      });

      if (noResults) {
        noResults.classList.toggle('show', visible === 0);
      }
    });
  }

  /* ── CATEGORY FILTER ──────────────────────────────────── */
  function initCategoryFilter() {
    const btns = document.querySelectorAll('.cat-btn');
    const cards = document.querySelectorAll('.blog-card-v2');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;

        cards.forEach(card => {
          if (cat === 'all' || (card.dataset.category || '').toLowerCase() === cat) {
            card.dataset.hidden = 'false';
          } else {
            card.dataset.hidden = 'true';
          }
        });

        const noResults = document.querySelector('.no-results');
        const visible = Array.from(cards).filter(c => c.dataset.hidden !== 'true').length;
        if (noResults) noResults.classList.toggle('show', visible === 0);
      });
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ─────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = 72;
          const offset = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── INIT ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildTOC();
    initActiveTOC();
    initFAQ();
    initSearch();
    initCategoryFilter();
    initSmoothScroll();
  });

})();
