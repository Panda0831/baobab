// Simple JavaScript for Baobab startup showcase

// Mobile menu toggle (if needed)
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    // Hide navbar on scroll down
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Show navbar on scroll up
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Mobile menu button
const createMobileMenu = () => {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  
  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-btn';
  menuBtn.innerHTML = '<span></span><span></span><span></span>';
  menuBtn.style.display = 'none';
  menuBtn.style.cursor = 'pointer';
  menuBtn.style.width = '30px';
  menuBtn.style.height = '21px';
  
  const container = document.querySelector('.navbar .container');
  if (container) {
    container.appendChild(menuBtn);
    
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
};

// Add responsive menu button for mobile
if (window.innerWidth <= 768) {
  createMobileMenu();
}