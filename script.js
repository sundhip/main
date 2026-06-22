document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STARFIELD BACKGROUND (CANVAS)
    // ==========================================
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let shootingStars = [];
    const maxStars = 150;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    
    class Star {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random();
            this.alphaSpeed = Math.random() * 0.015 + 0.005;
            this.direction = Math.random() > 0.5 ? 1 : -1;
        }
        
        update() {
            this.alpha += this.alphaSpeed * this.direction;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.direction = -1;
            } else if (this.alpha <= 0.1) {
                this.alpha = 0.1;
                this.direction = 1;
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(219, 234, 254, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width * 0.8;
            this.y = Math.random() * canvas.height * 0.4;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 10 + 6;
            this.angle = (Math.PI / 4) + (Math.random() * 0.1 - 0.05); // ~45 degrees
            this.opacity = 1;
            this.active = false;
        }
        
        trigger() {
            this.reset();
            this.active = true;
        }
        
        update() {
            if (!this.active) return;
            
            // Move along 45 degree angle down and right
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.015;
            
            if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
                this.active = false;
            }
        }
        
        draw() {
            if (!this.active) return;
            
            ctx.strokeStyle = `rgba(96, 165, 250, ${this.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.stroke();
        }
    }
    
    function initStars() {
        stars = [];
        for (let i = 0; i < maxStars; i++) {
            stars.push(new Star());
        }
        
        shootingStars = [new ShootingStar(), new ShootingStar()];
    }
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw starry sky background glow
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, '#1E293B');
        gradient.addColorStop(1, '#0F172A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Render & update normal stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        // Randomly trigger shooting stars
        if (Math.random() < 0.003) {
            const inactiveStar = shootingStars.find(s => !s.active);
            if (inactiveStar) inactiveStar.trigger();
        }
        
        // Render & update shooting stars
        shootingStars.forEach(s => {
            s.update();
            s.draw();
        });
        
        requestAnimationFrame(animateStars);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateStars();

    // ==========================================
    // 2. LOADING SCREEN CONTROL
    // ==========================================
    const loadingScreen = document.getElementById('loading-screen');
    
    // Smooth loader screen transitions
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800); // match css transition
    }, 4500); // Show full text sequences comfortably (2-3 seconds as blueprint)

    // ==========================================
    // 3. SCROLL-IN SECTION FADE (INTERSECTION OBSERVER)
    // ==========================================
    const sections = document.querySelectorAll('.scroll-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // trigger when 15% visible
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Begin Journey Scroll Button
    const btnBegin = document.getElementById('btn-begin');
    const ourStorySection = document.getElementById('our-story');
    
    btnBegin.addEventListener('click', () => {
        ourStorySection.scrollIntoView({ behavior: 'smooth' });
    });

    // ==========================================
    // 4. SPECIAL TRAITS MODALS (SECTION 5)
    // ==========================================
    const traitCards = document.querySelectorAll('.trait-card');
    const modal = document.getElementById('trait-modal');
    const modalClose = document.getElementById('btn-close-modal');
    const modalIcon = document.getElementById('modal-trait-icon');
    const modalTitle = document.getElementById('modal-trait-title');
    const modalText = document.getElementById('modal-trait-text');
    
    const traitNotes = {
        kind: {
            icon: "💙",
            title: "Kind",
            text: "Your kindness is something I've felt in every conversation. You always look for the best in people and speak gently. It makes everyone around you feel valued and safe. Thank you for showing me what true empathy looks like. 💙"
        },
        understanding: {
            icon: "✨",
            title: "Understanding",
            text: "You have this rare gift of listening without judging. Even when things were complicated, you understood my perspective and gave me room to express myself. Having a friend who truly 'gets it' is priceless. ✨"
        },
        smart: {
            icon: "📚",
            title: "Smart",
            text: "Whether we are studying, discussing college topics, or talking about random ideas, your sharp mind and thoughtful insights always inspire me. You're brilliant, but what makes it special is how humble you are with it. 📚"
        },
        caring: {
            icon: "🌸",
            title: "Caring",
            text: "You check in on others, you care about the small details, and you always make sure your friends are doing okay. The way you care about people's happiness is beautiful. You are a constant comfort in my life. 🌸"
        }
    };
    
    traitCards.forEach(card => {
        card.addEventListener('click', () => {
            const trait = card.getAttribute('data-trait');
            const note = traitNotes[trait];
            if (note) {
                modalIcon.textContent = note.icon;
                modalTitle.textContent = note.title;
                modalText.textContent = note.text;
                modal.classList.add('open');
            }
        });
    });
    
    function closeModal() {
        modal.classList.remove('open');
    }
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ==========================================
    // 5. BIRTHDAY LETTER ENVELOPE (SECTION 9)
    // ==========================================
    const envelopeWrapper = document.getElementById('envelope-interactive');
    const btnOpenLetter = document.getElementById('btn-open-letter');
    const flapBtn = document.getElementById('envelope-flap-btn');
    
    function toggleLetter() {
        const isOpen = envelopeWrapper.classList.contains('open');
        if (isOpen) {
            envelopeWrapper.classList.remove('open');
            btnOpenLetter.textContent = "Open Letter 💌";
        } else {
            envelopeWrapper.classList.add('open');
            btnOpenLetter.textContent = "Close Letter ✉️";
        }
    }
    
    btnOpenLetter.addEventListener('click', toggleLetter);
    flapBtn.addEventListener('click', toggleLetter);

    // ==========================================
    // 6. FINAL SURPRISE & CONFETTI ENGINE (SECTION 10)
    // ==========================================
    const btnSurprise = document.getElementById('btn-final-surprise');
    const finalCard = document.getElementById('final-card');
    
    // Setup another canvas specifically overlaying the viewport for Confetti
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.zIndex = '999';
    confettiCanvas.style.pointerEvents = 'none';
    document.body.appendChild(confettiCanvas);
    
    const cCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let confettiActive = false;
    
    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();
    
    const colors = [
        '#60A5FA', // Sky Blue
        '#2563EB', // Royal Blue
        '#F472B6', // Pink
        '#10B981', // Emerald Green
        '#FBBF24', // Amber Yellow
        '#8B5CF6', // Purple
        '#DBEAFE'  // Soft Blue
    ];
    
    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height - 20;
            this.size = Math.random() * 8 + 6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.shape = Math.random() > 0.5 ? 'circle' : 'rectangle';
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.5;
            this.rotation += this.rotationSpeed;
            
            // Loop confetti back to top
            if (this.y > confettiCanvas.height) {
                this.y = -20;
                this.x = Math.random() * confettiCanvas.width;
                this.speedY = Math.random() * 3 + 2;
            }
        }
        
        draw() {
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate(this.rotation * Math.PI / 180);
            cCtx.fillStyle = this.color;
            
            if (this.shape === 'circle') {
                cCtx.beginPath();
                cCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                cCtx.fill();
            } else {
                cCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            }
            cCtx.restore();
        }
    }
    
    // Sparkle burst emitter class
    class SparkleBurst {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 8 - 4;
            this.speedY = Math.random() * 8 - 4;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;
        }
        
        draw() {
            cCtx.save();
            cCtx.globalAlpha = this.alpha;
            cCtx.fillStyle = this.color;
            cCtx.shadowBlur = 10;
            cCtx.shadowColor = this.color;
            cCtx.beginPath();
            cCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            cCtx.fill();
            cCtx.restore();
        }
    }
    
    let bursts = [];
    
    function triggerBurst(x, y) {
        for (let i = 0; i < 40; i++) {
            bursts.push(new SparkleBurst(x, y));
        }
    }
    
    function initConfetti() {
        confettiParticles = [];
        for (let i = 0; i < 150; i++) {
            confettiParticles.push(new ConfettiParticle());
        }
    }
    
    function animateConfetti() {
        if (!confettiActive) return;
        
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // Render confetti
        confettiParticles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Render bursts
        bursts.forEach((b, index) => {
            b.update();
            b.draw();
            if (b.alpha <= 0) {
                bursts.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animateConfetti);
    }
    
    btnSurprise.addEventListener('click', () => {
        // Explode sparkles from the button click coordinate
        const btnRect = btnSurprise.getBoundingClientRect();
        const startX = btnRect.left + (btnRect.width / 2);
        const startY = btnRect.top + (btnRect.height / 2);
        
        // Trigger initial bursts
        triggerBurst(startX, startY);
        setTimeout(() => triggerBurst(startX - 200, startY - 100), 400);
        setTimeout(() => triggerBurst(startX + 200, startY - 100), 800);
        
        // Start continuous falling confetti
        if (!confettiActive) {
            initConfetti();
            confettiActive = true;
            animateConfetti();
        }
        
        // Toggle card presentation
        btnSurprise.style.transform = 'scale(0.9)';
        btnSurprise.style.opacity = '0';
        
        setTimeout(() => {
            btnSurprise.style.display = 'none';
            finalCard.classList.remove('hidden');
            
            // Smooth reveal
            setTimeout(() => {
                finalCard.classList.add('show');
                finalCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        }, 400);
    });

    // Hero Slideshow Cycle
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 3000);
    }

});
