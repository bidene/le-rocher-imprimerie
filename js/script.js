// Variables globales
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const scrollTop = document.getElementById('scroll-top');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const preloader = document.getElementById('preloader');

// Gestion du préchargement simple "Le Roche Imprimé"
if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
        }, 1200); // 1,2s de visibilité minimum
    });
}

// Menu mobile amélioré
const toggleMenu = () => {
    navMenu.classList.toggle('show');
    
    // Empêcher le défilement du corps lorsque le menu est ouvert
    if (navMenu.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
        // Ajouter une couche d'overlay
        if (!document.querySelector('.nav-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
            
            // Fermer le menu en cliquant sur l'overlay
            overlay.addEventListener('click', () => {
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
                overlay.remove();
            });
        }
    } else {
        document.body.style.overflow = '';
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.remove();
    }
};

// Gestionnaire du menu burger
if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
}

// Gestionnaire de fermeture du menu
if (navClose) {
    navClose.addEventListener('click', toggleMenu);
}

// Fermer le menu en cliquant sur un lien ou en tapant en dehors
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 968) { // Seulement sur mobile/tablette
            toggleMenu();
        }
    });
});

// Fermer le menu lors du redimensionnement si on passe en desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 968) {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
            const overlay = document.querySelector('.nav-overlay');
            if (overlay) overlay.remove();
        }
    }, 250);
});

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header au scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY >= 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Bouton retour en haut
window.addEventListener('scroll', () => {
    if (window.scrollY >= 400) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Carousel des témoignages
let currentSlide = 0;
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialBtns = document.querySelectorAll('.testimonial-btn');

function showSlide(index) {
    // Masquer tous les témoignages
    testimonialItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    testimonialBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher le témoignage sélectionné
    testimonialItems[index].classList.add('active');
    testimonialBtns[index].classList.add('active');
}

// Gestion des boutons du carousel
testimonialBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-play du carousel
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialItems.length;
    showSlide(currentSlide);
}, 5000);

// Lightbox pour le portfolio
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.portfolio-img');
        const overlay = item.querySelector('.portfolio-overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Fermer la lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Fermer la lightbox avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
    }
});

// Animation au scroll optimisée pour mobile
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Fonction pour activer/désactiver les animations en fonction du support
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !reduceMotion) {
            entry.target.classList.add('animate-in');
            // Désobserver après l'animation pour améliorer les performances
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments à animer avec gestion du délai pour mobile
function observeElements() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .value-item, .testimonial-item, .section-header, .about-content, .contact-content');
    
    // Délai progressif pour un effet d'animation en cascade
    elements.forEach((el, index) => {
        // Ajouter un délai progressif pour les appareils mobiles
        if (window.innerWidth <= 768) {
            el.style.animationDelay = `${index * 0.1}s`;
        }
        observer.observe(el);
    });
}

// Démarrer l'observation après le chargement de la page
document.addEventListener('DOMContentLoaded', observeElements);

// Réinitialiser les animations lors du rafraîchissement
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Validation et soumission du formulaire
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validation simple
    if (!data.name || !data.email || !data.service || !data.message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Construction du message WhatsApp avec les informations du formulaire
    const whatsappNumber = '22967146677';
    const whatsappMessage = `Bonjour, je souhaite une demande de devis.\n\n` +
        `Nom : ${data.name}\n` +
        `Email : ${data.email}\n` +
        `Téléphone : ${data.phone || 'Non renseigné'}\n` +
        `Service demandé : ${data.service}\n` +
        `Détails du projet :\n${data.message}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Ouverture de WhatsApp avec le message pré-rempli
    window.open(whatsappUrl, '_blank');
    
    // Réinitialisation du formulaire après ouverture de WhatsApp
    contactForm.reset();
});

// Effet de frappe pour le titre héro
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

// Animation de compteur
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Gestion des liens WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Ajouter un message par défaut si pas de message spécifié
        const href = link.getAttribute('href');
        if (!href.includes('text=')) {
            e.preventDefault();
            const message = encodeURIComponent('Bonjour, je souhaite obtenir des informations sur vos services d\'impression.');
            const newHref = href + '?text=' + message;
            window.open(newHref, '_blank');
        }
    });
});

// Lazy loading des images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Gestion des erreurs d'images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.log('Erreur de chargement d\'image:', this.src);
    });
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Animation d'entrée pour les éléments visibles
    const visibleElements = document.querySelectorAll('.hero-content, .section-header');
    visibleElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 200);
    });
    
    // Préchargement des images importantes
    const importantImages = [
        'images/fnHeWDyKtXm1.jpg',
        'images/64uE2mTyS1X8.jpg'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Performance: Debounce pour les événements de scroll
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

// Application du debounce aux événements de scroll
const debouncedScrollHandler = debounce(() => {
    // Logique de scroll optimisée
    const scrolled = window.pageYOffset;
    
    // Header background
    const header = document.querySelector('.header');
    if (scrolled >= 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    
    // Scroll to top button
    if (scrolled >= 400) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

 

