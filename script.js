// shared interactions for all pages (PDF modal + reveals + phone reveal + nav transitions)
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // set year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // reveal on scroll (same logic as before)
    const reveals = document.querySelectorAll('[data-reveal]');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      reveals.forEach(el => el.classList.add('revealed'));
      document.querySelectorAll('.bar-fill').forEach(el=>{
        el.style.width = el.style.getPropertyValue('--fill');
      });
    } else {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.querySelectorAll('.bar-fill').forEach(el=>{
              const v = el.style.getPropertyValue('--fill') || '60%';
              setTimeout(()=> el.style.width = v, 100);
            });
            o.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});
      reveals.forEach(r => obs.observe(r));
    }

    // animation toggle (same)
    const animBtn = document.getElementById('anim-toggle');
    if (animBtn) {
      animBtn.addEventListener('click', () => {
        const disabled = document.body.classList.toggle('no-anim');
        animBtn.textContent = disabled ? 'Enable animations' : 'Disable animations';
        if (disabled) {
          document.querySelectorAll('.bar-fill').forEach(el => el.style.width = el.style.getPropertyValue('--fill'));
          document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        } else {
          document.querySelectorAll('.bar-fill').forEach(el => el.style.width = '0');
          window.scrollBy(0,1); window.scrollBy(0,-1);
        }
      });
    }

    // page nav transition
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href === window.location.pathname.split('/').pop()) return;
        e.preventDefault();
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);
        requestAnimationFrame(()=> overlay.style.opacity = 1);
        setTimeout(()=> { window.location.href = href; }, 300);
      });
    });

    // phone reveal
    const revealBtn = document.getElementById('reveal-phone');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        const ok = confirm('Reveal phone number? Only share with trusted contacts.');
        if (!ok) return;
        const mask = document.getElementById('phone-mask');
        const phone = '+91-XXXXXXXXXX'; // keep masked here; replace with number if you want visible by default
        mask.textContent = phone;
        revealBtn.style.display = 'none';
      });
    }

    // PDF preview modal handlers - support multiple preview buttons across pages
    const openPdfButtons = [
      document.getElementById('preview-cv'),
      document.getElementById('preview-cv-exp'),
      document.getElementById('preview-cv-proj'),
      document.getElementById('preview-cv-contact')
    ].filter(Boolean);

    const pdfModal = document.getElementById('pdf-modal');
    const pdfBackdrop = document.getElementById('pdf-backdrop');
    const pdfClose = document.getElementById('pdf-close');
    const pdfFrame = document.getElementById('pdf-frame');

    function openPdfModal(){
      if (!pdfModal) return;
      pdfModal.setAttribute('aria-hidden', 'false');
      pdfModal.style.display = 'block';
      // slight delay to allow CSS transitions if used
      requestAnimationFrame(()=> pdfModal.classList.add('open'));
      // ensure iframe src is set (in case some browsers block loading before interaction)
      if (pdfFrame && !pdfFrame.getAttribute('src')) pdfFrame.setAttribute('src','Satya.pdf');
      // trap focus to close button for basic accessibility
      if (pdfClose) pdfClose.focus();
    }

    function closePdfModal(){
      if (!pdfModal) return;
      pdfModal.classList.remove('open');
      pdfModal.setAttribute('aria-hidden', 'true');
      setTimeout(()=> { pdfModal.style.display = 'none'; }, 180);
    }

    openPdfButtons.forEach(btn => btn.addEventListener('click', openPdfModal));
    if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePdfModal);
    if (pdfClose) pdfClose.addEventListener('click', closePdfModal);

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePdfModal();
    });

    // mark active nav link
    (function markActive(){
      const path = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        const filename = href.split('/').pop();
        if (filename === path) a.classList.add('active'); else a.classList.remove('active');
      });
    })();
  });
})();
