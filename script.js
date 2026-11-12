// ==========================================
// SCRIPT.JS - ROLLER VIBES MX LA PAZ
// ==========================================

// 1. MENÚ MÓVIL (Hamburguesa)
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// 2. ANIMACIONES AL HACER SCROLL (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target); // Solo animar una vez
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.card, .schedule-card, .level-card, .discipline-card, .requirements-card, .app-container, .contact-info, .contact-map');

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Inyectar estilo para la animación
const style = document.createElement('style');
style.innerHTML = `
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


// 3. FORMULARIO DE CONTACTO CON FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ⚠️ REEMPLAZA ESTOS DATOS CON LOS DE TU PROYECTO DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCC3ZOCevEhUtDw2sF2-kAeMbSSme-1QDI",
    authDomain: "roller-vibes-web.firebaseapp.com",
    projectId: "roller-vibes-web",
    storageBucket: "roller-vibes-web.firebasestorage.app",
    messagingSenderId: "786372913017",
    appId: "1:786372913017:web:4e5a134a8ca1d9998831a8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            categoria: document.getElementById('categoria').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: serverTimestamp()
        };

        try {
            await addDoc(collection(db, "contactos"), formData);
            
            // Éxito
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        } catch (error) {
            console.error("Error al enviar el mensaje: ", error);
            alert('Hubo un error al enviar el mensaje. Por favor, contáctanos directamente por WhatsApp.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}