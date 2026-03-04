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
    ctx.fillStyle = "rgba(200,200,200,0.9)";
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
  ctx.fillStyle = "#ffffff";
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
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
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

function changeSlide(name, direction) {
  const s = slideshows[name];
  if (!s) return;
  s.currentIndex += direction;
  if (s.currentIndex > s.total) s.currentIndex = 1;
  if (s.currentIndex < 1) s.currentIndex = s.total;
  showSlide(name, s.currentIndex);
}

function currentSlide(name, n) {
  if (!slideshows[name]) return;
  slideshows[name].currentIndex = n;
  showSlide(name, n);
}

function showSlide(name, n) {
  const img = document.getElementById('slideshow-image-' + name);
  const dots = document.querySelectorAll('.dot-' + name);
  const s = slideshows[name];
  if (!s || !img || !s.images[n - 1]) return;

  img.src = s.images[n - 1];
  dots.forEach((dot, i) => dot.classList.toggle('active', i === n - 1));
}

function openSlideshowModal(name) {
  const modal = document.getElementById('slideshowModal');
  const modalImg = document.getElementById('slideshowModalImage');
  const currentImg = document.getElementById('slideshow-image-' + name);
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

initParticles(100);
animate();