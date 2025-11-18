// shared interactions for all pages
(function(){
  // year
  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // reveal elements on scroll
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
            // animate bars inside
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

    // animation toggle button
    const animBtn = document.getElementById('anim-toggle') || document.getElementById('anim-toggle-js');
    if (animBtn) {
      animBtn.addEventListener('click', () => {
        const disabled = document.body.classList.toggle('no-anim');
        animBtn.textContent = disabled ? 'Enable animations' : 'Disable animations';
        if (disabled) {
          document.querySelectorAll('.bar-fill').forEach(el => el.style.width = el.style.getPropertyValue('--fill'));
          document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        } else {
          // reset bars for re-animation
          document.querySelectorAll('.bar-fill').forEach(el => el.style.width = '0');
          // re-trigger reveals by scrolling slightly
          window.scrollBy(0,1); window.scrollBy(0,-1);
        }
      });
    }

    // page link transitions - smooth fade then navigate
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        // normal same page link, ignore
        if (!href || href.startsWith('#') || href === window.location.pathname.split('/').pop()) return;
        e.preventDefault();
        // show overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);
        requestAnimationFrame(()=> overlay.style.opacity = 1);
        setTimeout(()=> {
          window.location.href = href;
        }, 300);
      });
    });

    // reveal phone with simple confirmation (no server)
    const revealBtn = document.getElementById('reveal-phone');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        // simple confirmation dialog
        const ok = confirm('Reveal phone number? Only share with trusted contacts.');
        if (!ok) return;
        const mask = document.getElementById('phone-mask');
        // replace with the phone text. Phone kept in JS to avoid indexing in HTML.
        const phone = '+91-XXXXXXXXXX'; // replace Xs with actual digits if you want to reveal
        mask.textContent = phone;
        revealBtn.style.display = 'none';
      });
    }

    // mark active nav link by matching href
    (function markActive(){
      const path = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        const filename = href.split('/').pop();
        if (filename === path) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    })();
  });
})();
