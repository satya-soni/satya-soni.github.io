// simple dynamic behaviors and reveal animations

document.addEventListener('DOMContentLoaded', () => {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // intersection reveal
  const reveals = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // animate internal bars
        entry.target.querySelectorAll('.bar-fill').forEach(el=>{
          const v = el.style.getPropertyValue('--fill') || '60%';
          // ensure small delay for visual effect
          setTimeout(()=> el.style.width = v, 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});

  reveals.forEach(el => observer.observe(el));

  // toggle animations: reduces motion by toggling a class on body
  const toggleBtn = document.getElementById('toggle-theme');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('no-anim');
    // give quick visual feedback
    toggleBtn.textContent = document.body.classList.contains('no-anim') ? 'Enable animation' : 'Toggle animation';
  });

  // graceful fallback: if user prefers reduced motion, disable animations
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.body.classList.add('no-anim');
    document.querySelectorAll('.bar-fill').forEach(el => el.style.width = el.style.getPropertyValue('--fill'));
  }
});
