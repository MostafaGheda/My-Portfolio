// ─── MOBILE NAV TOGGLE ───────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ─── SCROLL FADE-IN ANIMATION ────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── IMAGE SLIDER HELPERS ─────────────────────────────────────────────────────
/**
 * Get the slider container from any child element inside it.
 */
function getSlider(el) {
  return el.closest('.project-img-slider');
}

/**
 * Return all slide images inside a slider.
 */
function getSlides(slider) {
  return [...slider.querySelectorAll('.slider-img')];
}

/**
 * Return all dots inside a slider.
 */
function getDots(slider) {
  return [...slider.querySelectorAll('.dot')];
}

/**
 * Move to a specific slide index within a slider.
 */
function activateSlide(slider, index) {
  const slides = getSlides(slider);
  const dots   = getDots(slider);
  const count  = slides.length;

  // wrap around
  if (index < 0)     index = count - 1;
  if (index >= count) index = 0;

  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i)   => d.classList.toggle('active', i === index));

  slider.dataset.current = index;
}

/**
 * Called by prev/next buttons. direction: -1 or +1.
 */
function slideImg(btn, direction) {
  const slider  = getSlider(btn);
  const current = parseInt(slider.dataset.current || '0', 10);
  activateSlide(slider, current + direction);
}

/**
 * Called by dot clicks. index: 0-based target slide.
 */
function goToSlide(dot, index) {
  const slider = getSlider(dot);
  activateSlide(slider, index);
}

/**
 * Opens the lightbox showing the currently active slide image.
 */
function openLightboxFromSlider(btn) {
  const slider  = getSlider(btn);
  const current = parseInt(slider.dataset.current || '0', 10);
  const active  = getSlides(slider)[current];
  if (active && active.src) openLightbox(active.src);
}

// Initialise data-current on all sliders
document.querySelectorAll('.project-img-slider').forEach(slider => {
  slider.dataset.current = '0';
});

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightboxBtn() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightbox(e) {
  if (e.target === document.getElementById('lightbox')) closeLightboxBtn();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightboxBtn();
});
