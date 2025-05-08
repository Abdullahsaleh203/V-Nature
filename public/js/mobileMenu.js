/* eslint-disable */
document.addEventListener('DOMContentLoaded', function () {
  // Create mobile menu button element
  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.className = 'mobile-nav-toggle';
  mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
  mobileMenuButton.setAttribute('aria-label', 'Toggle menu');
  
  // Get the header element
  const header = document.querySelector('.header');
  
  // Insert button before the nav element in header
  if (header) {
    const nav = header.querySelector('.nav');
    if (nav) {
      header.insertBefore(mobileMenuButton, nav);
    }
  }
  
  // Toggle mobile menu when button is clicked
  mobileMenuButton.addEventListener('click', function() {
    document.body.classList.toggle('mobile-nav-active');
    mobileMenuButton.classList.toggle('active');
    
    // Toggle accessibility attributes
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
  });
  
  // Close menu when a nav link is clicked
  const navLinks = document.querySelectorAll('.nav__el');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        document.body.classList.remove('mobile-nav-active');
        mobileMenuButton.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // Close menu when clicking outside navigation
  document.addEventListener('click', function(event) {
    const isClickInsideNav = event.target.closest('.nav');
    const isClickOnButton = event.target.closest('.mobile-nav-toggle');
    
    if (!isClickInsideNav && !isClickOnButton && document.body.classList.contains('mobile-nav-active')) {
      document.body.classList.remove('mobile-nav-active');
      mobileMenuButton.classList.remove('active');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  });
});