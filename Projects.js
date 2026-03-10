const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.radius = 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(168,130,255,0.7)";
    ctx.fill();
  }
}

function initParticles(num) {
  particles = [];
  for (let i = 0; i < num; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.fillStyle = "#1a1625";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(168,130,255,0.15)";
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

// ── Modal for single project images ──────────────────────────────────────────
function openProjectImage(imgSrc) {
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certImage");
  if (modal && modalImg) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
  }
}

function closeProjectModal() {
  const modal = document.getElementById("certModal");
  if (modal) modal.style.display = "none";
}

// ── Generic named slideshow system ───────────────────────────────────────────
const slideshows = {};

function initSlideshow(name, images) {
  slideshows[name] = {
    currentIndex: 1,
    images: images,
    total: images.length
  };
}

function changeSlide(nameOrDir, direction) {
  // Support legacy single-arg: changeSlide(-1) uses 'default' slideshow
  if (typeof nameOrDir === 'number') {
    direction = nameOrDir;
    nameOrDir = 'default';
  }
  const s = slideshows[nameOrDir];
  if (!s) return;
  s.currentIndex += direction;
  if (s.currentIndex > s.total) s.currentIndex = 1;
  if (s.currentIndex < 1) s.currentIndex = s.total;
  showSlide(nameOrDir, s.currentIndex);
}

function currentSlide(nameOrN, n) {
  // Support legacy single-arg: currentSlide(3) uses 'default' slideshow
  if (typeof n === 'undefined') {
    n = nameOrN;
    nameOrN = 'default';
  }
  if (!slideshows[nameOrN]) return;
  slideshows[nameOrN].currentIndex = n;
  showSlide(nameOrN, n);
}

function showSlide(name, n) {
  // 'default' maps to the legacy element id 'slideshow-image'
  const imgId = (name === 'default') ? 'slideshow-image' : 'slideshow-image-' + name;
  const dotClass = (name === 'default') ? 'dot' : 'dot-' + name;
  const img = document.getElementById(imgId);
  const dots = document.querySelectorAll('.' + dotClass);
  const s = slideshows[name];
  if (!s || !img || !s.images[n - 1]) return;

  img.src = s.images[n - 1];
  dots.forEach((dot, i) => dot.classList.toggle('active', i === n - 1));
}

function openSlideshowModal(name) {
  const modal = document.getElementById('slideshowModal');
  const modalImg = document.getElementById('slideshowModalImage');
  const imgId = (!name || name === 'default') ? 'slideshow-image' : 'slideshow-image-' + name;
  const currentImg = document.getElementById(imgId);
  if (modal && modalImg && currentImg) {
    modal.style.display = 'block';
    modalImg.src = currentImg.src;
  }
}

function closeSlideshowModal() {
  const modal = document.getElementById('slideshowModal');
  if (modal) modal.style.display = 'none';
}

// ── Streamlit slideshow (Loan Defaulter page only) ────────────────────────────
function initStreamlitSlideshow(images) {
  initSlideshow('streamlit', images);
}

function changeStreamlitSlide(direction) {
  changeSlide('streamlit', direction);
}

function currentStreamlitSlide(n) {
  currentSlide('streamlit', n);
}

function openStreamlitModal() {
  const modal = document.getElementById('streamlitModal');
  const modalImg = document.getElementById('streamlitModalImage');
  const currentImg = document.getElementById('slideshow-image-streamlit');
  if (modal && modalImg && currentImg) {
    modal.style.display = 'block';
    modalImg.src = currentImg.src;
  }
}

function closeStreamlitModal() {
  const modal = document.getElementById('streamlitModal');
  if (modal) modal.style.display = 'none';
}

// ── Close modals on outside click ────────────────────────────────────────────
window.addEventListener('click', function(event) {
  const certModal = document.getElementById("certModal");
  if (certModal && event.target === certModal) closeProjectModal();

  const slideshowModal = document.getElementById('slideshowModal');
  if (slideshowModal && event.target === slideshowModal) closeSlideshowModal();

  const streamlitModal = document.getElementById('streamlitModal');
  if (streamlitModal && event.target === streamlitModal) closeStreamlitModal();
});

// ── Keyboard navigation ───────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById('slideshowModal');
  if (modal && modal.style.display === 'block') {
    if (e.key === 'Escape') closeSlideshowModal();
  }
});

// ── Tab switching (index.html) ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const tabBtns      = document.querySelectorAll('.tab-btn');
  const projectGrids = document.querySelectorAll('.projects-grid');

  const viewMoreMap = {
    all:      document.getElementById('view-more-all'),
    analysis: document.getElementById('view-more-analysis'),
    ml:       null,
    dl:       null,
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      projectGrids.forEach(g => g.classList.remove('active'));

      // Hide all view-more wrappers
      Object.values(viewMoreMap).forEach(el => { if (el) el.style.display = 'none'; });

      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelector(`[data-tab-content="${tab}"]`).classList.add('active');

      // Show correct view-more if that tab has one
      if (viewMoreMap[tab]) viewMoreMap[tab].style.display = 'block';

      // Reset hidden items when switching tabs
      document.querySelectorAll('.hidden-project').forEach(el => {
        el.classList.remove('visible');
        el.style.display = 'none';
      });

      // Reset button text
      if (viewMoreMap[tab]) {
        viewMoreMap[tab].querySelector('.view-more-btn').textContent = 'View More';
        projectExpanded[tab] = false;
      }
    });
  });
});

// ── Toggle projects View More / View Less ─────────────────────────────────────
const projectExpanded = { all: false, analysis: false };

function toggleProjects(tab) {
  const grid   = document.querySelector(`[data-tab-content="${tab}"]`);
  const hidden = grid.querySelectorAll('.hidden-project');
  const btn    = document.getElementById(`view-more-${tab}`).querySelector('.view-more-btn');
  const isOpen = projectExpanded[tab];

  if (!isOpen) {
    hidden.forEach((el, i) => {
      el.style.display = 'block';
      // Small delay so display:block registers before transition
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
    btn.textContent = 'View Less';
    projectExpanded[tab] = true;
  } else {
    hidden.forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => { el.style.display = 'none'; }, 400);
    });
    btn.textContent = 'View More';
    projectExpanded[tab] = false;
  }
}

// ── Toggle certificates View More / View Less ─────────────────────────────────
let certsExpanded = false;

function toggleCertificates() {
  const hidden = document.querySelectorAll('.hidden-cert');
  const btn    = document.getElementById('view-more-certs').querySelector('.view-more-btn');

  if (!certsExpanded) {
    hidden.forEach((el, i) => {
      el.style.display = 'block';
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
    btn.textContent = 'View Less';
    certsExpanded = true;
  } else {
    hidden.forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => { el.style.display = 'none'; }, 400);
    });
    btn.textContent = 'View More';
    certsExpanded = false;
  }
}

initParticles(100);
animate();

// ── Auto-init legacy slideshow from inline globals ───────────────────────────
window.addEventListener('DOMContentLoaded', function() {
  if (typeof slideImages !== 'undefined' && typeof totalSlides !== 'undefined') {
    initSlideshow('default', slideImages);
  }
});