// ─── MOBILE NAV TOGGLE ───────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ─── SCROLL FADE-IN ──────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── SLIDER STATE ─────────────────────────────────────────────────────────────
// Each .project-img-slider gets data-current initialised to 0
document.querySelectorAll('.project-img-slider').forEach(slider => {
  slider.dataset.current = '0';
});

function getSlider(el)   { return el.closest('.project-img-slider'); }
function getSlides(s)    { return [...s.querySelectorAll('.slider-img')]; }
function getCardDots(s)  { return [...s.querySelectorAll('.dot')]; }

function activateSlide(slider, index) {
  const slides = getSlides(slider);
  const dots   = getCardDots(slider);
  const count  = slides.length;
  index = ((index % count) + count) % count; // safe wrap

  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i)   => d.classList.toggle('active', i === index));
  slider.dataset.current = index;
}

// Called by card prev/next buttons
function slideImg(btn, direction) {
  const slider  = getSlider(btn);
  const current = parseInt(slider.dataset.current || '0', 10);
  activateSlide(slider, current + direction);
}

// Called by card dot clicks
function goToSlide(dot, index) {
  activateSlide(getSlider(dot), index);
}

// ─── LIGHTBOX STATE ───────────────────────────────────────────────────────────
let lbImages  = [];   // array of src strings for the current lightbox session
let lbIndex   = 0;    // which image is showing
let lbSlider  = null; // the card slider this lightbox belongs to (so we sync back)

const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxDots = document.getElementById('lightboxDots');

function buildLightboxDots(count) {
  lightboxDots.innerHTML = '';
  // Hide dots row if only one image
  lightboxDots.style.display = count > 1 ? 'flex' : 'none';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => lightboxGoTo(i));
    lightboxDots.appendChild(d);
  }
}

function updateLightbox() {
  lightboxImg.src = lbImages[lbIndex];

  // sync lightbox dots
  [...lightboxDots.querySelectorAll('.dot')].forEach((d, i) =>
    d.classList.toggle('active', i === lbIndex)
  );

  // hide nav arrows when only one image
  const showNav = lbImages.length > 1;
  document.querySelector('.lightbox-nav--prev').style.display = showNav ? '' : 'none';
  document.querySelector('.lightbox-nav--next').style.display = showNav ? '' : 'none';

  // sync the originating card slider (if any)
  if (lbSlider) activateSlide(lbSlider, lbIndex);
}

function lightboxGoTo(index) {
  const count = lbImages.length;
  lbIndex = ((index % count) + count) % count;
  updateLightbox();
}

// Called by lightbox prev/next buttons
function lightboxNav(direction) {
  lightboxGoTo(lbIndex + direction);
}

// Called when clicking the image area of a card slider
function openLightboxFromSlider(track) {
  const slider   = track.closest('.project-img-slider');
  const slides   = getSlides(slider);
  const startIdx = parseInt(slider.dataset.current || '0', 10);

  lbSlider = slider;
  lbImages = slides.map(s => s.src).filter(Boolean);
  lbIndex  = startIdx;

  buildLightboxDots(lbImages.length);
  updateLightbox();

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightboxBtn() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbSlider = null;
}

function closeLightbox(e) {
  // close only if clicking the dark backdrop, not inner elements
  if (e.target === lightbox) closeLightboxBtn();
}

// Keyboard: Escape closes, arrow keys navigate
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightboxBtn();
  if (e.key === 'ArrowLeft')   lightboxNav(-1);
  if (e.key === 'ArrowRight')  lightboxNav(1);
});
