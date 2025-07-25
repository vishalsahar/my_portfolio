// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeScrollToTop();
    initializeAnimations();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        html.classList.remove('dark');
        themeIcon.className = 'fas fa-moon';
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// Navigation Management
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            if (document.documentElement.classList.contains('dark')) {
                navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.documentElement.classList.contains('dark')) {
                navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            }
        }
    });
    
    // Active nav link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initializeScrollEffects() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Management
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                submitForm(formObject);
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const { name, email, subject, message } = data;
    
    // Reset previous error styles
    clearFormErrors();
    
    let isValid = true;
    
    // Name validation
    if (!name || name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!subject || subject.trim().length < 3) {
        showFieldError('subject', 'Please enter a subject');
        isValid = false;
    }
    
    // Message validation
    if (!message || message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    field.style.borderColor = '#e91e63';
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#e91e63';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
}

// Clear form errors
function clearFormErrors() {
    const fields = document.querySelectorAll('#contact-form input, #contact-form textarea');
    const errorMessages = document.querySelectorAll('.error-message');
    
    fields.forEach(field => {
        field.style.borderColor = '';
    });
    
    errorMessages.forEach(error => {
        error.remove();
    });
}

// Submit form (static version - shows success message without backend)
function submitForm(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission delay
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showSuccessMessage('Thank you! Your message has been received. This is a demo version.');
        
        // Reset form
        document.getElementById('contact-form').reset();
    }, 1500);
}

// Show success message
function showSuccessMessage(message = 'Thank you! Your message has been sent successfully.') {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(successElement, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message = 'Sorry, there was an error sending your message. Please try again.') {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message-alert';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(errorElement, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Back to Top Button
function initializeScrollToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.reveal, .section-header, .about-text, .about-image, .skill-category, .service-card, .project-card, .contact-info, .contact-form-container, .internship-card');
    
    animateElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Utility function to create elements with classes
function createElement(tag, className, textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Typing effect for dynamic text (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize particles background (optional enhancement)
function initializeParticles() {
    // This would be where you could add a particles.js or similar effect
    // For now, we'll keep it simple without external dependencies
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler for better performance
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);