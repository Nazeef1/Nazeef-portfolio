document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Background State & Mobile Menu ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple hamburger animation could be added here
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animations ---
    const revealSettings = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealElements = document.querySelectorAll('.section-title, .glass-panel, .tech-stack, .project-card, .timeline-item');
    revealElements.forEach(el => el.classList.add('reveal'));

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealSettings);

    revealElements.forEach(el => sectionObserver.observe(el));

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    // Using words based on Nazeef's skills and ML background
    const texts = [
        "Crafting intelligent Machine Learning models.",
        "Developing automated data-driven applications.",
        "Exploring the frontiers of Deep Learning.",
        "Transforming structured data into predictable solutions."
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 50;
    let eraseDelay = 40;
    let newTextDelay = 1500;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="typewriter-cursor"></span>';
            charIndex--;
        } else {
            typewriterElement.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="typewriter-cursor"></span>';
            charIndex++;
        }

        let typeSpeed = isDeleting ? eraseDelay : typingDelay;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = newTextDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = typingDelay;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect after page load animations
    setTimeout(type, 1500);

    // --- 3D Hover Tilt Effect for Cards ---
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation angle
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // remove transition for smooth tracking
        });
    });

    // --- Blast Off Button ---
    const blastBtn = document.getElementById('blast-off-btn');
    if (blastBtn) {
        blastBtn.addEventListener('click', (e) => {
            e.preventDefault();
            blastBtn.classList.add('launching');
            setTimeout(() => {
                document.querySelector('#skills').scrollIntoView({ behavior: 'smooth' });
            }, 500); 
            
            setTimeout(() => {
                blastBtn.classList.remove('launching');
            }, 1500);
        });
    }
});
