document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // reveal animation for sections and animate skill bars
  const reveals = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('.bar-fill').forEach(el=>{
          const v = el.style.getPropertyValue('--fill') || '60%';
          setTimeout(()=> el.style.width = v, 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => observer.observe(r));

  // animations toggle (reduce motion)
  const btn = document.getElementById('toggle-anim');
  btn.addEventListener('click', () => {
    const disabled = document.body.classList.toggle('no-anim');
    btn.textContent = disabled ? 'Enable animations' : 'Disable animations';

    if (disabled) {
      document.querySelectorAll('.bar-fill').forEach(el => el.style.width = el.style.getPropertyValue('--fill'));
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    } else {
      // reset bars for re-animation
      document.querySelectorAll('.bar-fill').forEach(el => el.style.width = '0');
      // re-observe elements to animate when in view
      document.querySelectorAll('[data-reveal]').forEach(el => {
        if (!el.classList.contains('revealed')) observer.observe(el);
      });
    }
  });

  // respect user reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('no-anim');
    document.querySelectorAll('.bar-fill').forEach(el => el.style.width = el.style.getPropertyValue('--fill'));
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    btn.style.display = 'none';
  }
});
