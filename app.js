// ============================================================
// SHARED APP SCRIPT — used by every page (nav, pagination, animations)
// ============================================================

const PAGES = [
  { file: 'index.html',      label: 'ปกหน้า' },
  { file: 'toc.html',        label: 'สารบัญ' },
  { file: 'profile.html',    label: 'ประวัติส่วนตัว' },
  { file: 'education.html',  label: 'ประวัติการศึกษา' },
  { file: 'skills.html',     label: 'ความสามารถ / ทักษะ' },
  { file: 'activities.html', label: 'กิจกรรมและประสบการณ์' },
  { file: 'project-1.html',  label: 'ผลงานที่ 1' },
  { file: 'project-2.html',  label: 'ผลงานที่ 2' },
  { file: 'project-3.html',  label: 'ผลงานที่ 3' },
  { file: 'project-4.html',  label: 'ผลงานที่ 4' },
  { file: 'awards.html',     label: 'รางวัลและเกียรติบัตร' },
  { file: 'contact.html',    label: 'ปกหลัง / ติดต่อ' },
];

document.addEventListener('DOMContentLoaded', () => {

  const currentFile = (location.pathname.split('/').pop() || 'index.html');
  const currentIndex = Math.max(0, PAGES.findIndex(p => p.file === currentFile));
  const isDark = document.body.classList.contains('dark-page');

  /* ---------- Build top nav ---------- */
  const navHost = document.getElementById('site-nav');
  if (navHost) {
    navHost.innerHTML = `
      <header class="site-nav ${isDark ? 'on-dark' : ''}">
        <a class="nav-logo" href="index.html">PORTFOLIO</a>
        <div class="nav-right">
          <span class="nav-page-count">${pad(currentIndex + 1)} / ${pad(PAGES.length)}</span>
          <button class="menu-btn" id="menuBtn" aria-label="เปิดเมนู"><span></span><span></span><span></span></button>
        </div>
      </header>
      <div class="menu-overlay" id="menuOverlay">
        <ul class="menu-list">
          ${PAGES.map((p, i) => `
            <li class="${i === currentIndex ? 'current' : ''}">
              <a href="${p.file}"><span class="idx">${pad(i + 1)}</span>${p.label}</a>
            </li>`).join('')}
        </ul>
      </div>
    `;
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.classList.remove('open'); overlay.classList.remove('open');
    }));
  }

  /* ---------- Build footer pagination ---------- */
  const footerHost = document.getElementById('page-footer');
  if (footerHost) {
    const prev = PAGES[currentIndex - 1];
    const next = PAGES[currentIndex + 1];
    footerHost.innerHTML = `
      <footer class="page-footer">
        ${prev ? `<a href="${prev.file}">‹ ${prev.label}</a>` : `<span class="disabled">‹</span>`}
        <span class="pf-count">${pad(currentIndex + 1)} / ${pad(PAGES.length)}</span>
        ${next ? `<a href="${next.file}">${next.label} ›</a>` : `<span class="disabled">›</span>`}
      </footer>
    `;
  }

  function pad(n){ return n.toString().padStart(2, '0'); }

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Hero scroll-scale effect (Apple-style) ---------- */
  const heroScaleEl = document.querySelector('.hero-scale');
  if (heroScaleEl) {
    const heroSection = heroScaleEl.closest('.hero');
    function updateHero(){
      const rect = heroSection.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height * 0.9), 0), 1);
      const scale = 1 - progress * 0.12;
      const opacity = 1 - progress * 1.1;
      heroScaleEl.style.transform = `scale(${scale})`;
      heroScaleEl.style.opacity = Math.max(opacity, 0);
      requestAnimationFrame(tick);
    }
    let ticking = false;
    function tick(){ if(!ticking){ ticking = true; requestAnimationFrame(()=>{ updateHero(); ticking = false; }); } }
    window.addEventListener('scroll', tick, { passive: true });
    updateHero();
  }

  /* ---------- Skill bar fill + counters ---------- */
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        const value = parseInt(row.dataset.value, 10) || 0;
        row.querySelector('.s-fill').style.width = value + '%';
        animateCount(row.querySelector('.s-pct'), value, '%');
        skillObserver.unobserve(row);
      }
    });
  }, { threshold: 0.4 });
  skillRows.forEach(r => skillObserver.observe(r));

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, parseInt(entry.target.dataset.count, 10) || 0, '');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statNums.forEach(n => statObserver.observe(n));

  function animateCount(el, target, suffix){
    const duration = 900, start = performance.now();
    function step(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Keyboard arrow navigation between pages ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && PAGES[currentIndex + 1]) location.href = PAGES[currentIndex + 1].file;
    if (e.key === 'ArrowLeft' && PAGES[currentIndex - 1]) location.href = PAGES[currentIndex - 1].file;
  });

});