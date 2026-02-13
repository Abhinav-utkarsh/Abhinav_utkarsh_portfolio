document.addEventListener('DOMContentLoaded', () => {

    // --- 5. PARTICLES.JS INITIALIZATION (THEME-AWARE) ---
    function initParticles(theme) {
        const isLightTheme = theme === 'light';
        // Use professional blue for light mode, neon accent for dark mode
        const particleColor = isLightTheme ? '#007bff' : '#64ffda'; 
        // Use a dark color for lines in light mode for visibility
        const lineColor = isLightTheme ? '#333333' : '#ffffff';
        const lineOpacity = isLightTheme ? 0.2 : 0.1;

        if (document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": particleColor },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": false },
                    "size": { "value": 3, "random": true },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": lineColor,
                        "opacity": lineOpacity,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "repulse" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    }
                },
                "retina_detect": true
            });
        }
    }

    // --- 1. THEME (LIGHT/DARK MODE) TOGGLER ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme on body and particles
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    }
    initParticles(currentTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            themeToggle.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
            currentTheme = 'light';
        } else {
            themeToggle.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
            currentTheme = 'dark';
        }

        // Re-initialize particles and skill sphere with the new theme colors
        initParticles(currentTheme);
    });

    // --- 2. MOBILE NAVIGATION (HAMBURGER MENU) ---
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('fa-xmark');
    });

    // Close mobile nav when a link is clicked
    navbar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navbar.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
        }
    });

    // --- 3. TYPED.JS INITIALIZATION FOR HERO SECTION ---
    if (document.querySelector('.typed-text')) {
        const typed = new Typed('.typed-text', {
            strings: ['Automation Engineer', 'Web Developer', 'Generative AI Enthusiast', 'Agentic AI Enthusiast'],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }

    // --- 4. SCROLL-BASED ACTIONS & NAVIGATION HIGHLIGHTING ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Reveal sections on scroll (works on all pages)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // Navigation link highlighting logic
    if (document.querySelector('#hero')) { // Check if on the home page
        // For the home page, use scroll-spying
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelector('.navbar a.active')?.classList.remove('active');
                    
                    let targetLink = document.querySelector(`.navbar a[href*="#${id}"]`);
                    if (id === 'hero') {
                        targetLink = document.querySelector('.navbar a[href="index.html"]');
                    }

                    if (targetLink) {
                        targetLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: "-40% 0px -60% 0px" }); // Triggers when a section is in the middle of the viewport
        
        document.querySelectorAll('main section[id]').forEach(section => scrollSpyObserver.observe(section));
    } else {
        // For other pages (certifications.html, projects.html), just highlight the corresponding nav link
        document.querySelector('.navbar a.active')?.classList.remove('active');
        const activeLink = document.querySelector(`.navbar a[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // --- ENHANCED: SKILLS PROGRESS BAR ANIMATION ---
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillCards = document.querySelectorAll('.skill-card');

        // Observer for the initial fade-in animation of the cards
        const entranceObserver = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, index * 150); // Stagger the entrance
                });
                observer.unobserve(skillsSection); // Stop observing after animation
            }
        }, { threshold: 0.2 });

        entranceObserver.observe(skillsSection);

        // Add click listeners for the flip and progress animation
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                const innerCard = card.querySelector('.skill-card-inner');
                innerCard.classList.toggle('is-flipped');

                // Animate progress only the first time the card is flipped
                if (innerCard.classList.contains('is-flipped') && !card.hasAttribute('data-animated')) {
                    const progressCircle = card.querySelector('.progress-circle');
                    const progressValue = card.querySelector('.progress-value');
                    const targetPercentage = parseInt(progressCircle.getAttribute('data-p'));

                    progressCircle.style.setProperty('--p', targetPercentage);

                    let startValue = 0;
                    let speed = 2500 / targetPercentage;

                    let counter = setInterval(() => {
                        startValue += 1;
                        progressValue.textContent = `${startValue}%`;
                        if (startValue >= targetPercentage) {
                            clearInterval(counter);
                        }
                    }, speed);

                    card.setAttribute('data-animated', 'true');
                }
            });
        });
    }

    // --- 6. LIGHTBOX FUNCTIONALITY FOR CERTIFICATIONS PAGE ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const certificateImages = document.querySelectorAll('.cert-item img');
        const closeBtn = document.querySelector('.lightbox-close');

        certificateImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
        }

        // Close lightbox when clicking the close button or the background
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- NEW: CERTIFICATION FILTERING ---
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select__trigger');
        const options = customSelect.querySelectorAll('.custom-option');
        const certItems = document.querySelectorAll('.certificate-gallery .cert-item');

        trigger.addEventListener('click', () => {
            customSelect.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Update trigger text
                trigger.querySelector('span').textContent = option.textContent;
                customSelect.classList.remove('open');

                // Handle 'selected' class
                customSelect.querySelector('.custom-option.selected').classList.remove('selected');
                option.classList.add('selected');

                // Filter logic
                const filterValue = option.getAttribute('data-value');
                certItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // --- 7. SMOOTH SCROLL FOR "BACK TO TOP" ---
    const backToTopLink = document.querySelector('.footer-icon-top a');
    if (backToTopLink) {
        backToTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 8. FUNCTIONAL CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);
            
            formStatus.innerHTML = "Sending...";
            formStatus.classList.remove('success', 'error');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                formStatus.innerHTML = jsonResponse.message;
                formStatus.classList.toggle('success', response.ok);
                formStatus.classList.toggle('error', !response.ok);
            })
            .catch(error => {
                console.log(error);
                formStatus.innerHTML = "Something went wrong!";
                formStatus.classList.add('error');
            })
            .finally(() => {
                contactForm.reset();
                setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
            });
        });
    }
});