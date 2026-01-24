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
  if (modal) {
    modal.style.display = "none";
  }
}

// Slideshow functionality
let currentSlideIndex = 1;
const totalSlides = 9;
const slideImages = [
    './Projects/Loan Defaulter/Screenshot_0.png',
    './Projects/Loan Defaulter/Screenshot_1.png',
    './Projects/Loan Defaulter/Screenshot_2.png',
    './Projects/Loan Defaulter/Screenshot_3.png',
    './Projects/Loan Defaulter/Screenshot_4.png',
    './Projects/Loan Defaulter/Screenshot_5.png',
    './Projects/Loan Defaulter/Screenshot_6.png',
    './Projects/Loan Defaulter/Screenshot_7.png',
    './Projects/Loan Defaulter/Screenshot_8.png'
];

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex > totalSlides) {
        currentSlideIndex = 1;
    }
    if (currentSlideIndex < 1) {
        currentSlideIndex = totalSlides;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(n) {
    currentSlideIndex = n;
    showSlide(currentSlideIndex);
}

function showSlide(n) {
    const img = document.getElementById('slideshow-image');
    const dots = document.getElementsByClassName('dot');
    
    if (img && slideImages[n - 1]) {
        img.src = slideImages[n - 1];
        
        // Update active dot
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        if (dots[n - 1]) {
            dots[n - 1].classList.add('active');
        }
    }
}

function openSlideshowModal() {
    const modal = document.getElementById('slideshowModal');
    const modalImg = document.getElementById('slideshowModalImage');
    const currentImg = document.getElementById('slideshow-image');
    
    if (modal && modalImg && currentImg) {
        modal.style.display = 'block';
        modalImg.src = currentImg.src;
    }
}

function closeSlideshowModal() {
    const modal = document.getElementById('slideshowModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modals when clicking outside - Handle both modals
window.addEventListener('click', function(event) {
    // Handle certModal (for project images)
    const certModal = document.getElementById("certModal");
    if (certModal && event.target === certModal) {
        closeProjectModal();
    }
    
    // Handle slideshowModal (for slideshow)
    const slideshowModal = document.getElementById('slideshowModal');
    if (slideshowModal && event.target === slideshowModal) {
        closeSlideshowModal();
    }
});

// Keyboard navigation for slideshow
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('slideshowModal');
    if (modal && modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeSlideshowModal();
        }
    } else {
        // Only navigate slideshow with arrows if modal is not open
        const slideImg = document.getElementById('slideshow-image');
        if (slideImg) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        }
    }
});

// Streamlit Slideshow functionality
let currentStreamlitSlideIndex = 1;
const totalStreamlitSlides = 3;
const streamlitSlideImages = [
    './Projects/Loan Defaulter/Streamlit_1.png',
    './Projects/Loan Defaulter/Streamlit_2.png',
    './Projects/Loan Defaulter/Streamlit_3.png'
];

function changeStreamlitSlide(direction) {
    currentStreamlitSlideIndex += direction;
    
    if (currentStreamlitSlideIndex > totalStreamlitSlides) {
        currentStreamlitSlideIndex = 1;
    }
    if (currentStreamlitSlideIndex < 1) {
        currentStreamlitSlideIndex = totalStreamlitSlides;
    }
    
    showStreamlitSlide(currentStreamlitSlideIndex);
}

function currentStreamlitSlide(n) {
    currentStreamlitSlideIndex = n;
    showStreamlitSlide(currentStreamlitSlideIndex);
}

function showStreamlitSlide(n) {
    const img = document.getElementById('streamlit-slideshow-image');
    const dots = document.getElementsByClassName('streamlit-dot');
    
    if (img && streamlitSlideImages[n - 1]) {
        img.src = streamlitSlideImages[n - 1];
        
        // Update active dot
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        if (dots[n - 1]) {
            dots[n - 1].classList.add('active');
        }
    }
}

function openStreamlitModal() {
    const modal = document.getElementById('streamlitModal');
    const modalImg = document.getElementById('streamlitModalImage');
    const currentImg = document.getElementById('streamlit-slideshow-image');
    
    if (modal && modalImg && currentImg) {
        modal.style.display = 'block';
        modalImg.src = currentImg.src;
    }
}

function closeStreamlitModal() {
    const modal = document.getElementById('streamlitModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update the window click event listener to handle all modals
window.addEventListener('click', function(event) {
    // Handle certModal (for project images)
    const certModal = document.getElementById("certModal");
    if (certModal && event.target === certModal) {
        closeProjectModal();
    }
    
    // Handle slideshowModal (for EDA slideshow)
    const slideshowModal = document.getElementById('slideshowModal');
    if (slideshowModal && event.target === slideshowModal) {
        closeSlideshowModal();
    }
    
    // Handle streamlitModal (for Streamlit slideshow)
    const streamlitModal = document.getElementById('streamlitModal');
    if (streamlitModal && event.target === streamlitModal) {
        closeStreamlitModal();
    }
});

initParticles(100);
animate();