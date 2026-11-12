/* ==========================================================================
   NIRAKAR — site script
   Renders pages from content/projects.js and runs the motion:
   Lenis smooth scroll + GSAP ScrollTrigger.
   ========================================================================== */
(() => {
  'use strict';

  const DATA = window.NIRAKAR;
  const SITE = DATA.site;
  const PROJECTS = DATA.projects;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const page = document.body.dataset.page;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const img = (slug, name, small) => `media/${slug}/${name}${small ? '-sm' : ''}.webp`;
  const file = (slug, name) => `media/${slug}/${name}`;
  const projectUrl = p => `project.html?p=${encodeURIComponent(p.slug)}`;
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  // Always start a page at the top, so its intro animation is seen (anchors are handled below).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1.2 });

  // ---------------------------------------------------------------- shared bits
  $$('[data-year]').forEach(el => (el.textContent = SITE.year));
  $$('[data-location]').forEach(el => (el.textContent = SITE.location));
  $$('[data-disciplines]').forEach(el => (el.textContent = SITE.disciplines.join(' · ')));

  // Smooth scroll
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToTarget = (target, immediate) => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, immediate: !!immediate, duration: 1.6 });
    else target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  };

  // Refresh trigger positions when late content (images, fonts) changes the layout
  let refreshTimer;
  const queueRefresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150); };
  if (document.fonts) document.fonts.ready.then(queueRefresh);
  window.addEventListener('load', queueRefresh);

  // ---------------------------------------------------------------- page transitions
  const curtain = $('.curtain');
  const entering = store.get('nk-transit') === '1';
  store.del('nk-transit');
  if (entering && !reduce) {
    gsap.set(curtain, { yPercent: 0 });
    gsap.to(curtain, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', delay: 0.1 });
  } else {
    gsap.set(curtain, { yPercent: 100 });
  }
  window.addEventListener('pageshow', e => { if (e.persisted) gsap.set(curtain, { yPercent: 100 }); });

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href) return;
    // In-page anchor
    if (href.startsWith('#')) {
      const t = href.length > 1 && $(href);
      if (t) { e.preventDefault(); scrollToTarget(t); history.replaceState(null, '', href); }
      return;
    }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /^(mailto|tel):/.test(href)) return;
    const samePage = url.pathname === location.pathname && url.search === location.search;
    if (samePage && url.hash) { e.preventDefault(); scrollToTarget($(url.hash)); return; }
    if (reduce) return;
    e.preventDefault();
    store.set('nk-transit', '1');
    gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut', onComplete: () => (location.href = a.href) });
  });

  // ---------------------------------------------------------------- cursor
  const cursor = $('.cursor');
  if (cursor && finePointer && !reduce) {
    root.classList.add('has-cursor');
    const ring = $('.cursor__ring', cursor);
    const dot = $('.cursor__dot', cursor);
    const label = $('.cursor__label', cursor);
    gsap.set([ring, dot], { x: innerWidth / 2, y: innerHeight / 2 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    window.addEventListener('pointermove', e => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      cursor.classList.remove('is-link', 'is-label');
      if (!t) return;
      if (t.dataset.cursor) { label.textContent = t.dataset.cursor; cursor.classList.add('is-label'); }
      else cursor.classList.add('is-link');
    });
    document.addEventListener('pointerleave', () => gsap.to(cursor, { autoAlpha: 0, duration: 0.3 }));
    document.addEventListener('pointerenter', () => gsap.to(cursor, { autoAlpha: 1, duration: 0.3 }));
  }

  // ---------------------------------------------------------------- reusable reveals
  // Split a heading into masked lines (split on <br>) and slide them up.
  function revealTitle(el, opts = {}) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(p => `<span class="line-mask"><span>${p}</span></span>`).join('');
    const lines = $$('.line-mask > span', el);
    if (reduce) return;
    gsap.from(lines, {
      yPercent: 110, rotate: 2, stagger: 0.08, duration: 1.3, delay: opts.delay || 0,
      scrollTrigger: opts.immediate ? undefined : { trigger: el, start: 'top 88%' },
    });
  }

  // Words that light up one by one as you scroll through them.
  function scrubWords(el, text) {
    el.innerHTML = text.split(/(\s+)/).map(w => {
      if (/^\s+$/.test(w)) return w;
      const deva = /[ऀ-ॿ]/.test(w);
      return `<span class="w${deva ? ' deva' : ''}">${esc(w)}</span>`;
    }).join('');
    if (reduce) return;
    gsap.to($$('.w', el), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  }

  // Media that wipes open from the bottom and settles.
  function revealMedia(el) {
    if (reduce) return;
    const inner = el.querySelector('img, video');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
    if (inner) tl.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
  }

  function parallax(el, amount = 12) {
    if (reduce) return;
    gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  function fadeUp(els, trigger) {
    if (reduce || !els.length) return;
    gsap.from(els, {
      y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.2, clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: trigger || els[0], start: 'top 92%', once: true },
    });
  }

  // Autoplay muted loops only while they are on screen (saves battery and bandwidth).
  const loopObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (target.preload === 'none') target.preload = 'auto';
        target.play().then(() => target.closest('.card')?.classList.add('is-playing')).catch(() => {});
      } else target.pause();
    });
  }, { threshold: 0.2 });

  $$('img').forEach(i => !i.complete && i.addEventListener('load', queueRefresh, { once: true }));

  // ==========================================================================
  // HOME
  // ==========================================================================
  if (page === 'home') {
    const featured = PROJECTS.filter(p => p.featured !== false);

    // ---- Showcase cards
    const track = $('[data-showcase]');
    track.innerHTML = featured.map((p, i) => `
      <a class="card" href="${projectUrl(p)}" data-cursor="View">
        <div class="card__media">
          <img src="${img(p.slug, p.cover)}" alt="${esc(p.title)}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">
          ${p.coverVideo ? `<video src="${file(p.slug, p.coverVideo)}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ''}
        </div>
        <span class="card__num mono">${pad(i + 1)} / ${pad(featured.length)}</span>
        <span class="card__status badge">${esc(p.status)}</span>
        <div class="card__info">
          <h3 class="card__title display">${esc(p.title)}</h3>
          <span class="mono dim">${esc(p.disciplines[0])}</span>
        </div>
      </a>`).join('');
    $$('video', track).forEach(v => loopObserver.observe(v));

    const showcase = $('.showcase');
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 821px)', narrow: '(max-width: 820px)' }, ctx => {
      if (ctx.conditions.narrow || reduce) { showcase.classList.add('is-static'); return () => showcase.classList.remove('is-static'); }
      const distance = () => track.scrollWidth - innerWidth;
      gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: '.showcase__pin', pin: true, scrub: 1, start: 'top top',
          end: () => '+=' + distance(), invalidateOnRefresh: true,
          onUpdate: self => gsap.set('.showcase__progress i', { scaleX: self.progress }),
        },
      });
      // Cards drift in at slightly different speeds for depth
      $$('.card', track).forEach((c, i) => gsap.from(c, {
        y: 80 + (i % 2) * 60, autoAlpha: 0, duration: 1.4,
        scrollTrigger: { trigger: showcase, start: 'top 70%' }, delay: i * 0.08,
      }));
    });

    // ---- Disciplines (counts) + index filters
    const counts = Object.fromEntries(SITE.disciplines.map(d => [d, PROJECTS.filter(p => p.disciplines.includes(d)).length]));
    $('[data-disc-list]').innerHTML = SITE.disciplines.map((d, i) => `
      <li><a class="disc" href="#index" data-filter-link="${esc(d)}" data-cursor="Filter">
        <span class="disc__fill"></span>
        <span class="mono">${pad(i + 1)}</span>
        <span class="disc__name display">${esc(d)}</span>
        <span class="disc__count mono">${counts[d] ? `${pad(counts[d])} work${counts[d] > 1 ? 's' : ''}` : 'Soon'}</span>
      </a></li>`).join('');
    fadeUp($$('.disc'), $('.disc-list'));

    const filters = $('[data-filters]');
    const used = ['All', ...SITE.disciplines.filter(d => counts[d])];
    filters.innerHTML = used.map(d => `<button class="chip${d === 'All' ? ' is-on' : ''}" type="button" data-filter="${esc(d)}">${esc(d)}${d === 'All' ? ` · ${PROJECTS.length}` : ` · ${counts[d]}`}</button>`).join('');
    $('[data-count]').textContent = pad(PROJECTS.length);

    const rows = $('[data-rows]');
    rows.innerHTML = PROJECTS.map((p, i) => `
      <a class="row" href="${projectUrl(p)}" data-slug="${p.slug}" data-disc="${esc(p.disciplines.join('|'))}" data-cursor="Open">
        <span class="row__num mono dim">${pad(i + 1)}</span>
        <img class="row__thumb" src="${img(p.slug, p.cover, true)}" alt="" loading="lazy">
        <span class="row__title display">${esc(p.title)}</span>
        <span class="row__disc mono dim">${esc(p.disciplines.join(' · '))}</span>
        <span class="row__status"><span class="badge">${esc(p.status)}</span></span>
      </a>`).join('');

    const applyFilter = d => {
      $$('.chip', filters).forEach(c => c.classList.toggle('is-on', c.dataset.filter === d));
      const shown = $$('.row', rows).filter(r => {
        const hit = d === 'All' || r.dataset.disc.split('|').includes(d);
        r.classList.toggle('is-hidden', !hit);
        return hit;
      });
      if (!reduce) gsap.fromTo(shown, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.8, overwrite: true, clearProps: 'opacity,visibility,transform' });
      queueRefresh();
    };
    filters.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) applyFilter(c.dataset.filter); });
    $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.filterLink)));
    fadeUp($$('.row'), rows);

    // Floating preview that follows the cursor over the index
    const preview = $('.hover-preview');
    if (finePointer && !reduce) {
      const pimg = $('img', preview);
      const px = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' });
      const py = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' });
      rows.addEventListener('pointermove', e => { px(e.clientX + 30); py(e.clientY - 120); });
      rows.addEventListener('pointerover', e => {
        const r = e.target.closest('.row'); if (!r) return;
        const p = PROJECTS.find(x => x.slug === r.dataset.slug);
        const src = img(p.slug, p.cover, true);
        if (!pimg.src.endsWith(src)) pimg.src = src;
        gsap.to(preview, { autoAlpha: 1, scale: 1, rotate: gsap.utils.random(-4, 4), duration: 0.6 });
      });
      rows.addEventListener('pointerleave', () => gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.5 }));
    }

    // ---- Manifesto, titles, studio
    scrubWords($('[data-manifesto]'), SITE.manifesto);
    $$('[data-reveal-title]').forEach(el => revealTitle(el));
    $$('[data-reveal-media]').forEach(revealMedia);
    $$('[data-parallax]').forEach(el => parallax(el, 14));
    fadeUp($$('.studio p'), $('.studio'));

    // ---- Contact
    const contactHref = SITE.email ? `mailto:${SITE.email}` : SITE.instagram;
    const contactLink = $('[data-contact-link]');
    contactLink.href = contactHref;
    contactLink.dataset.cursor = 'Summon';
    if (!SITE.email) { contactLink.target = '_blank'; contactLink.rel = 'noopener'; }
    $('[data-contact-buttons]').innerHTML = [
      SITE.email ? `<a class="btn" href="mailto:${esc(SITE.email)}">${esc(SITE.email)} ↗</a>` : '',
      `<a class="btn" href="${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram ${esc(SITE.instagramHandle)} ↗</a>`,
    ].join('');
    if (!reduce) gsap.from('.summon__big a', { yPercent: 40, autoAlpha: 0, duration: 1.6, scrollTrigger: { trigger: '.summon', start: 'top 75%' } });

    // ---- Footer marquee (speeds up with scroll velocity)
    const marquee = $('[data-marquee]');
    const words = [...SITE.disciplines, SITE.tagline.replace('.', '')];
    marquee.innerHTML = [...words, ...words].map(w => `<span>${esc(w)}</span>`).join('');
    if (!reduce) {
      const loop = gsap.to(marquee, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });
      if (lenis) lenis.on('scroll', ({ velocity }) => {
        gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(velocity) / 6, 5), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2 });
      });
    }

    // ---- Hero particles: drifting embers / petals out of the void
    initEmbers($('.hero__canvas'));

    // ---- Hero intro + scroll-out
    const heroIn = () => {
      if (reduce) return;
      const tl = gsap.timeline();
      tl.from('.hero__logo', { scale: 1.18, autoAlpha: 0, filter: 'blur(18px)', duration: 2.2, ease: 'expo.out' })
        .from('.hero__glow', { scale: 0.4, autoAlpha: 0, duration: 2.4 }, 0)
        .add(() => revealTitle($('.hero__tag'), { immediate: true }), 0.5)
        .from('.hero__foot > *', { y: 20, autoAlpha: 0, stagger: 0.1, duration: 1 }, 0.9)
        .from('.nav', { y: -30, autoAlpha: 0, duration: 1 }, 0.9);

      gsap.to('.hero__center', {
        yPercent: 30, scale: 0.92, autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      if (finePointer) {
        const lx = gsap.quickTo('.hero__logo', 'x', { duration: 1.2, ease: 'power3' });
        const ly = gsap.quickTo('.hero__logo', 'y', { duration: 1.2, ease: 'power3' });
        $('.hero').addEventListener('pointermove', e => {
          lx((e.clientX / innerWidth - 0.5) * -24);
          ly((e.clientY / innerHeight - 0.5) * -18);
        });
      }
    };

    // ---- Loader (first visit in a session only)
    const loader = $('.loader');
    const afterLoad = () => {
      store.set('nk-seen', '1');
      heroIn();
      if (location.hash) scrollToTarget($(location.hash), true);
    };
    if (root.classList.contains('no-loader') || reduce) {
      if (loader) loader.remove();
      afterLoad();
    } else {
      lenis && lenis.stop();
      const count = { v: 0 };
      const num = $('.loader__count');
      gsap.timeline({ onComplete: () => { loader.remove(); lenis && lenis.start(); } })
        .to('.loader__logo', { autoAlpha: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' }, 0)
        .to(count, { v: 100, duration: 1.9, ease: 'power3.inOut', onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, '0')) }, 0)
        .to('.loader__bar', { scaleX: 1, duration: 1.9, ease: 'power3.inOut' }, 0)
        .to('.loader__logo', { scale: 0.92, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 2.0)
        .to('.loader__count, .loader__note', { yPercent: 60, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 2.0)
        .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 2.35)
        .add(afterLoad, 2.55);
    }
  }

  // ==========================================================================
  // PROJECT
  // ==========================================================================
  if (page === 'project') {
    const slug = new URLSearchParams(location.search).get('p');
    const idx = PROJECTS.findIndex(p => p.slug === slug);
    const main = $('[data-project-root]');

    if (idx < 0) {
      document.title = 'Nirakar — Lost in the void';
      main.innerHTML = `<section class="lost"><p class="mono dim">404 · nothing here</p><h1 class="display">Formless</h1><p class="serif-i dim">This work hasn’t taken shape yet.</p><p><a class="btn" href="index.html#index">Back to all work</a></p></section>`;
    } else {
      const p = PROJECTS[idx];
      const next = PROJECTS[(idx + 1) % PROJECTS.length];
      document.title = `${p.title} — Nirakar`;
      const metaDesc = document.createElement('meta');
      metaDesc.name = 'description'; metaDesc.content = p.summary;
      document.head.appendChild(metaDesc);

      const chars = t => [...t].map(c => c === ' ' ? ' ' : `<span class="ch">${esc(c)}</span>`).join('');
      const figure = (name, caption, cls = '') => `
        <figure>
          <div class="reveal-media zoomable ${cls}" data-reveal-media data-full="${img(p.slug, name)}" data-cursor="Zoom">
            <img src="${img(p.slug, name)}" alt="${esc(caption || p.title)}" loading="lazy" decoding="async">
          </div>
          ${caption ? `<figcaption class="mono"><span>◯</span><span>${esc(caption)}</span></figcaption>` : ''}
        </figure>`;
      const videoFrame = (src, poster, label, autoplay) => autoplay ? `
        <div class="b-video is-playing">
          <div class="b-video__frame reveal-media" data-reveal-media>
            <video src="${file(p.slug, src)}" poster="${img(p.slug, poster)}" muted loop playsinline controls preload="none" data-autoloop aria-label="${esc(label || 'gameplay')}"></video>
          </div>
        </div>` : `
        <div class="b-video" data-video>
          <div class="b-video__frame reveal-media" data-reveal-media>
            <video src="${file(p.slug, src)}" poster="${img(p.slug, poster)}" playsinline preload="none"></video>
            <button class="b-video__play" type="button" data-cursor="Play" aria-label="Play ${esc(label || 'video')}"><span>Play</span></button>
          </div>
        </div>`;

      // Website screenshots inside a browser window / phone you can scroll (data-lenis-prevent keeps smooth scroll out of them)
      const browserFrame = (src, url, small) => `
        <div class="bw${small ? ' bw--small' : ''}" data-reveal-media>
          <div class="bw__bar"><i></i><i></i><i></i><span class="mono">${esc(url || '')}</span></div>
          <div class="bw__view" data-lenis-prevent data-cursor="Scroll" tabindex="0" aria-label="Screenshot of ${esc(url || p.title)}, scrollable">
            <img src="${img(p.slug, src)}" alt="Full-page screenshot of ${esc(url || p.title)}" loading="lazy" decoding="async">
          </div>
        </div>`;
      const phoneFrame = src => `
        <div class="ph" data-reveal-media>
          <div class="ph__view" data-lenis-prevent data-cursor="Scroll" tabindex="0" aria-label="Phone screenshot, scrollable">
            <img src="${img(p.slug, src)}" alt="Phone layout of ${esc(p.title)}" loading="lazy" decoding="async">
          </div>
        </div>`;

      const blocks = (p.story || []).map(b => {
        switch (b.type) {
          case 'text':
            return `<section class="b-text" data-fade><h3 class="display" data-reveal-title>${esc(b.title || '')}</h3><div>${(b.body || []).map(t => `<p>${esc(t)}</p>`).join('')}</div></section>`;
          case 'image':
            return `<section class="b-image size-${b.size || 'wide'}">${figure(b.src, b.caption)}</section>`;
          case 'gallery':
            return `<section class="b-gallery"><div class="b-gallery__grid" style="--cols:${b.cols || 2}">${b.items.map(n => figure(n)).join('')}</div>${b.caption ? `<figcaption class="mono"><span>◯</span><span>${esc(b.caption)}</span></figcaption>` : ''}</section>`;
          case 'video':
            return `<section class="b-video-wrap"><figure>${videoFrame(b.src, b.poster, b.caption, b.autoplay)}${b.caption ? `<figcaption class="mono"><span>◯</span><span>${esc(b.caption)}</span></figcaption>` : ''}</figure></section>`;
          case 'reels':
            return `<section class="b-reels"><div class="b-reels__row">${b.items.map(r => `<figure>${videoFrame(r.src, r.poster, r.label)}<figcaption class="mono"><span>◯</span><span>${esc(r.label)}</span></figcaption></figure>`).join('')}</div></section>`;
          case 'facts':
            return `<dl class="b-facts" data-fade>${b.items.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
          case 'site':
            return `<section class="b-site"><div class="b-site__row">${browserFrame(b.desktop, b.url)}${b.mobile ? phoneFrame(b.mobile) : ''}</div>${b.caption ? `<figcaption class="mono"><span>◯</span><span>${esc(b.caption)}</span></figcaption>` : ''}</section>`;
          case 'browsers':
            return `<section class="b-browsers"><div class="b-gallery__grid" style="--cols:${b.cols || 2}">${b.items.map(([src, url]) => browserFrame(src, url, true)).join('')}</div>${b.caption ? `<figcaption class="mono"><span>◯</span><span>${esc(b.caption)}</span></figcaption>` : ''}</section>`;
          case 'quote':
            return `<blockquote class="b-quote" data-fade>${esc(b.text)}</blockquote>`;
          default:
            return '';
        }
      }).join('');

      main.innerHTML = `
        <section class="p-hero">
          <div class="p-hero__top">
            <a class="mono dim" href="index.html#index">← All work</a>
            <span class="p-hero__right">
              ${p.link ? `<a class="btn btn--small" href="${esc(p.link)}" target="_blank" rel="noopener">Visit site ↗</a>` : ''}
              <span class="badge">${esc(p.status)}</span>
            </span>
          </div>
          <h1 class="p-hero__title display"><span class="line-mask"><span>${chars(p.title)}</span></span></h1>
          <p class="p-hero__kicker serif-i">${esc(p.kicker)}</p>
          <dl class="p-meta">
            <div><dt class="mono">Role</dt><dd>${esc(p.role)}</dd></div>
            <div><dt class="mono">Crafts</dt><dd>${esc(p.disciplines.join(', '))}</dd></div>
            <div><dt class="mono">Tools</dt><dd>${esc((p.tools || []).join(', '))}</dd></div>
            <div><dt class="mono">${p.client ? 'Client' : 'Year'}</dt><dd>${esc(p.client || p.year)}</dd></div>
          </dl>
        </section>
        <div class="p-cover">
          ${p.coverVideo
            ? `<video src="${file(p.slug, p.coverVideo)}" poster="${img(p.slug, p.cover)}" muted loop playsinline autoplay preload="auto" aria-hidden="true"></video>`
            : `<img src="${img(p.slug, p.cover)}" alt="${esc(p.title)}">`}
        </div>
        <section class="p-summary"><p data-summary></p></section>
        <div class="story">${blocks}</div>
        <a class="next" href="${projectUrl(next)}" data-cursor="Next">
          <div class="next__bg"><img src="${img(next.slug, next.cover, true)}" alt="" loading="lazy"></div>
          <span class="mono dim">Next rite</span>
          <h2 class="next__title display">${esc(next.title)}</h2>
          <span class="mono dim">${esc(next.disciplines.join(' · '))}</span>
        </a>`;

      // Videos: click to play with controls; only one plays at a time
      $$('[data-video]').forEach(w => {
        const v = $('video', w);
        $('.b-video__play', w).addEventListener('click', () => {
          $$('[data-video] video').forEach(o => o !== v && o.pause());
          v.controls = true; v.play(); w.classList.add('is-playing');
        });
        v.addEventListener('play', () => $$('[data-video] video').forEach(o => o !== v && o.pause()));
      });
      const coverVid = $('.p-cover video');
      if (coverVid) loopObserver.observe(coverVid);
      $$('[data-autoloop]', main).forEach(v => loopObserver.observe(v));

      // Lightbox
      const lb = $('.lightbox');
      const lbImg = $('img', lb);
      const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); };
      main.addEventListener('click', e => {
        const z = e.target.closest('.zoomable'); if (!z) return;
        lbImg.src = z.dataset.full; lbImg.alt = $('img', z).alt;
        lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lenis && lenis.stop();
      });
      lb.addEventListener('click', closeLb);
      document.addEventListener('keydown', e => e.key === 'Escape' && closeLb());

      // Motion
      $$('img', main).forEach(i => !i.complete && i.addEventListener('load', queueRefresh, { once: true }));
      scrubWords($('[data-summary]'), p.summary);
      $$('[data-reveal-title]', main).forEach(el => revealTitle(el));
      $$('[data-reveal-media]', main).forEach(revealMedia);
      $$('[data-fade]', main).forEach(el => fadeUp([el]));
      $$('.b-text p', main).forEach(el => fadeUp([el]));
      if (!reduce) {
        const tl = gsap.timeline({ delay: entering ? 0.55 : 0.1 });
        tl.from('.p-hero__title .ch', { yPercent: 115, rotate: 6, stagger: 0.035, duration: 1.4 })
          .from('.p-hero__top > *', { y: 16, autoAlpha: 0, stagger: 0.1, duration: 1 }, 0.2)
          .from('.p-hero__kicker', { y: 30, autoAlpha: 0, duration: 1.2 }, 0.45)
          .from('.p-meta > div', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1 }, 0.6)
          .from('.p-cover', { y: 120, autoAlpha: 0, duration: 1.6 }, 0.7);
        gsap.to('.p-cover', {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: '.p-cover', start: 'top 85%', end: 'top 10%', scrub: true },
        });
        parallax($('.p-cover > *'), 14);
        gsap.from('.next__title', { yPercent: 50, autoAlpha: 0, duration: 1.4, scrollTrigger: { trigger: '.next', start: 'top 80%' } });
      }
    }
  }

  // ==========================================================================
  // Ember / petal field for the hero
  // ==========================================================================
  function initEmbers(canvas) {
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts = [], visible = true, mouse = { x: -9999, y: -9999 };
    const COLORS = ['236,228,214', '236,228,214', '236,228,214', '192,40,62', '170,120,150'];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(160, (w * h) / 9000));
      parts = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = anywhere => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.3,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      sway: Math.random() * Math.PI * 2,
      a: Math.random() * 0.6 + 0.15,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    });
    const tick = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.sway += 0.01;
        p.x += p.vx + Math.sin(p.sway) * 0.2;
        p.y += p.vy;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { const f = (14000 - d2) / 14000; p.x += (dx / 60) * f; p.y += (dy / 60) * f; }
        if (p.y < -10) Object.assign(p, spawn(false));
        const fade = Math.min(1, p.y / (h * 0.25));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a * fade})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    resize();
    window.addEventListener('resize', () => { clearTimeout(canvas._t); canvas._t = setTimeout(resize, 200); });
    canvas.parentElement.addEventListener('pointermove', e => { const b = canvas.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    canvas.parentElement.addEventListener('pointerleave', () => (mouse.x = mouse.y = -9999));
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    gsap.ticker.add(tick);
  }
})();
