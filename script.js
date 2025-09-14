/**
 * Sophisticated Fluid Wave Animation System
 * 
 * A high-performance, GPU-accelerated wave animation system that creates
 * organic, flowing wave patterns with mouse interaction and dynamic color shifts.
 * 
 * Features:
 * - Multiple layered sine waves for organic movement
 * - Mouse interaction with smooth influence zones
 * - Dynamic color generation with HSL color space
 * - Gradient fills with transparency
 * - Reduced motion accessibility support
 * - Mobile performance optimizations
 * - Configurable parameters for customization
 * 
 * Usage:
 * const waveSystem = new FluidWaveSystem();
 * 
 * Configuration:
 * waveSystem.updateConfig({
 *   waveCount: 4,        // Number of wave layers (1-6)
 *   waveSpeed: 0.03,     // Animation speed (0.005-0.05)
 *   waveAmplitude: 0.4,  // Wave height (0.1-0.8)
 *   opacity: 0.5         // Overall opacity (0.1-0.8)
 * });
 * 
 * @class FluidWaveSystem
 */
class FluidWaveSystem {
    constructor() {
        this.canvas = document.getElementById('fluid-waves');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.time = 0;
        this.mouse = { x: 0, y: 0 };
        this.config = {
            waveCount: 3,
            waveSpeed: 0.02,
            waveAmplitude: 0.3,
            waveFrequency: 0.02,
            colorShift: 0.01,
            mouseInfluence: 0.3,
            opacity: 0.4,
            scrollIntensity: 0
        };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createWaves();
    }
    
    createWaves() {
        this.waves = [];
        
        for (let i = 0; i < this.config.waveCount; i++) {
            this.waves.push({
                phase: (i / this.config.waveCount) * Math.PI * 2,
                speed: this.config.waveSpeed * (0.8 + Math.random() * 0.4),
                amplitude: this.config.waveAmplitude * (0.7 + Math.random() * 0.6),
                frequency: this.config.waveFrequency * (0.8 + Math.random() * 0.4),
                color: this.generateWaveColor(i),
                points: [],
                opacity: this.config.opacity * (0.6 + Math.random() * 0.8)
            });
        }
    }
    
    generateWaveColor(index) {
        const baseHue = 220 + index * 30; // Blue to purple range
        const saturation = 60 + Math.random() * 20;
        const lightness = 50 + Math.random() * 20;
        return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    }
    
    updateWavePoints(wave) {
        const points = [];
        const segments = Math.floor(this.canvas.width / 2);
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * this.canvas.width;
            const normalizedX = x / this.canvas.width;
            
            // Base wave calculation
            let y = this.canvas.height * 0.5;
            
            // Add multiple sine waves for organic movement
            const scrollIntensity = this.config.scrollIntensity || 0;
            const totalAmplitude = wave.amplitude * (1 + scrollIntensity);
            
            y += Math.sin(normalizedX * Math.PI * 2 * wave.frequency + this.time * wave.speed + wave.phase) * totalAmplitude * this.canvas.height;
            y += Math.sin(normalizedX * Math.PI * 4 * wave.frequency + this.time * wave.speed * 1.3 + wave.phase) * totalAmplitude * 0.3 * this.canvas.height;
            y += Math.sin(normalizedX * Math.PI * 8 * wave.frequency + this.time * wave.speed * 0.7 + wave.phase) * totalAmplitude * 0.1 * this.canvas.height;
            
            // Mouse influence
            const mouseDistance = Math.sqrt(
                Math.pow((x - this.mouse.x * this.canvas.width) / this.canvas.width, 2) +
                Math.pow((y - this.mouse.y * this.canvas.height) / this.canvas.height, 2)
            );
            
            if (mouseDistance < 0.3) {
                const influence = (0.3 - mouseDistance) / 0.3;
                y += (this.mouse.y * this.canvas.height - y) * influence * this.config.mouseInfluence;
            }
            
            points.push({ x, y });
        }
        
        wave.points = points;
    }
    
    drawWave(wave) {
        if (wave.points.length < 2) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(wave.points[0].x, wave.points[0].y);
        
        // Create smooth curves using quadratic curves
        for (let i = 1; i < wave.points.length - 1; i++) {
            const current = wave.points[i];
            const next = wave.points[i + 1];
            const controlX = (current.x + next.x) / 2;
            const controlY = (current.y + next.y) / 2;
            this.ctx.quadraticCurveTo(current.x, current.y, controlX, controlY);
        }
        
        // Complete the wave to the bottom of the canvas
        const lastPoint = wave.points[wave.points.length - 1];
        this.ctx.lineTo(lastPoint.x, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        const color = this.parseColor(wave.color);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    parseColor(colorString) {
        const temp = document.createElement('div');
        temp.style.color = colorString;
        document.body.appendChild(temp);
        const computed = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        
        const rgb = computed.match(/\d+/g);
        return {
            r: parseInt(rgb[0]),
            g: parseInt(rgb[1]),
            b: parseInt(rgb[2])
        };
    }
    
    animate() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.time += 0.016; // ~60fps
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw waves
        this.waves.forEach(wave => {
            this.updateWavePoints(wave);
            this.drawWave(wave);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / window.innerWidth;
            this.mouse.y = event.clientY / window.innerHeight;
        });
        
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Add scroll-based wave intensity
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            this.config.scrollIntensity = Math.min(scrollPercent * 0.5, 0.3);
        });
        
        // Handle reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', () => {
            if (mediaQuery.matches) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Public methods for configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createWaves();
    }
    
    setWaveCount(count) {
        this.config.waveCount = count;
        this.createWaves();
    }
    
    setOpacity(opacity) {
        this.config.opacity = opacity;
        this.waves.forEach(wave => {
            wave.opacity = opacity * (0.6 + Math.random() * 0.8);
        });
    }
}

// Wave Animation Configuration Panel (for development/testing)
class WaveConfigPanel {
    constructor(waveSystem) {
        this.waveSystem = waveSystem;
        this.panel = null;
        this.createPanel();
    }
    
    createPanel() {
        // Only create in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.panel = document.createElement('div');
            this.panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            this.panel.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #60a5fa;">Wave Config</h4>
                <div style="margin-bottom: 8px;">
                    <label>Wave Count: <span id="wave-count-value">3</span></label><br>
                    <input type="range" id="wave-count" min="1" max="6" value="3" style="width: 100px;">
                </div>
                <div style="margin-bottom: 8px;">
                    <label>Speed: <span id="speed-value">0.02</span></label><br>
                    <input type="range" id="speed" min="0.005" max="0.05" step="0.005" value="0.02" style="width: 100px;">
                </div>
                <div style="margin-bottom: 8px;">
                    <label>Amplitude: <span id="amplitude-value">0.3</span></label><br>
                    <input type="range" id="amplitude" min="0.1" max="0.8" step="0.05" value="0.3" style="width: 100px;">
                </div>
                <div style="margin-bottom: 8px;">
                    <label>Opacity: <span id="opacity-value">0.4</span></label><br>
                    <input type="range" id="opacity" min="0.1" max="0.8" step="0.05" value="0.4" style="width: 100px;">
                </div>
                <button id="reset-waves" style="background: #60a5fa; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Reset</button>
            `;
            
            document.body.appendChild(this.panel);
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        if (!this.panel) return;
        
        const waveCountSlider = this.panel.querySelector('#wave-count');
        const speedSlider = this.panel.querySelector('#speed');
        const amplitudeSlider = this.panel.querySelector('#amplitude');
        const opacitySlider = this.panel.querySelector('#opacity');
        const resetButton = this.panel.querySelector('#reset-waves');
        
        waveCountSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.panel.querySelector('#wave-count-value').textContent = value;
            this.waveSystem.setWaveCount(value);
        });
        
        speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.panel.querySelector('#speed-value').textContent = value;
            this.waveSystem.updateConfig({ waveSpeed: value });
        });
        
        amplitudeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.panel.querySelector('#amplitude-value').textContent = value;
            this.waveSystem.updateConfig({ waveAmplitude: value });
        });
        
        opacitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.panel.querySelector('#opacity-value').textContent = value;
            this.waveSystem.setOpacity(value);
        });
        
        resetButton.addEventListener('click', () => {
            this.waveSystem.updateConfig({
                waveCount: 3,
                waveSpeed: 0.02,
                waveAmplitude: 0.3,
                opacity: 0.4
            });
            
            waveCountSlider.value = 3;
            speedSlider.value = 0.02;
            amplitudeSlider.value = 0.3;
            opacitySlider.value = 0.4;
            
            this.panel.querySelector('#wave-count-value').textContent = '3';
            this.panel.querySelector('#speed-value').textContent = '0.02';
            this.panel.querySelector('#amplitude-value').textContent = '0.3';
            this.panel.querySelector('#opacity-value').textContent = '0.4';
        });
    }
}

// Enhanced UI Interactions
class EnhancedInteractions {
    constructor() {
        this.initRippleEffects();
        this.initGlowEffects();
        this.initSmoothScrolling();
        this.initParallaxEffects();
        this.initAccessibilityFeatures();
    }
    
    initRippleEffects() {
        const buttons = document.querySelectorAll('.btn, .nav-link, .solution-link');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(96, 165, 250, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    initGlowEffects() {
        const cards = document.querySelectorAll('.value-card, .feature-card, .solution-card, .floating-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = `var(--glass-shadow), 0 0 40px var(--shadow-glow)`;
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = 'var(--glass-shadow)';
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    initSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: { y: offsetTop, autoKill: false },
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }
    
    initParallaxEffects() {
        // Enhanced parallax with GSAP
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                
                gsap.to(element, {
                    duration: 0.3,
                    y: yPos,
                    ease: "power2.out"
                });
            });
        });
    }
    
    initAccessibilityFeatures() {
        // Reduced motion support
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-smooth', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }
        
        // Keyboard navigation enhancements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Focus management
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-blue-bright)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }
}

// Smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navBackdrop.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on backdrop
    navBackdrop.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navBackdrop.classList.remove('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navBackdrop.classList.remove('active');
        });
        
        // Add enhanced mobile button interactions
        link.addEventListener('touchstart', function() {
            this.classList.add('mobile-active');
        });
        
        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('mobile-active');
            }, 150);
        });
        
        // Prevent text selection on mobile
        link.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    });
    
    // Navbar scroll effect - DISABLED to maintain fixed blue color
    // const navbar = document.getElementById('navbar');
    // let lastScrollTop = 0;
    
    // window.addEventListener('scroll', function() {
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
    //     if (scrollTop > 100) {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    //         navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    //     } else {
    //         navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    //         navbar.style.boxShadow = 'none';
    //     }
        
    //     lastScrollTop = scrollTop;
    // });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.value-card, .feature-card, .solution-card, .step');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroTitle) {
        heroTitle.classList.add('fade-in');
        observer.observe(heroTitle);
    }
    
    if (heroSubtitle) {
        heroSubtitle.classList.add('fade-in');
        heroSubtitle.style.animationDelay = '0.2s';
        observer.observe(heroSubtitle);
    }
    
    if (heroButtons) {
        heroButtons.classList.add('fade-in');
        heroButtons.style.animationDelay = '0.4s';
        observer.observe(heroButtons);
    }
    
    if (heroStats) {
        heroStats.classList.add('fade-in');
        heroStats.style.animationDelay = '0.6s';
        observer.observe(heroStats);
    }
    
    // Section titles animation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('fade-in');
        observer.observe(title);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Counter animation for hero stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        updateCounter();
    }
    
    // Trigger counter animation when hero stats come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                if (text.includes('10,000+')) {
                    animateCounter(entry.target, 10000);
                } else if (text.includes('99.9%')) {
                    entry.target.textContent = '99.9%';
                } else if (text.includes('500+')) {
                    animateCounter(entry.target, 500);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Parallax effect for floating cards
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.value-card, .feature-card, .solution-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Improved typing effect for hero title
    function typeWriter(element, originalHTML, speed = 60) {
        // Parse the original HTML to understand the structure
        const textParts = [];
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        
        // Extract text parts and their styling
        function extractTextParts(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                textParts.push({
                    text: node.textContent,
                    isGradient: false
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains('gradient-text')) {
                    textParts.push({
                        text: node.textContent,
                        isGradient: true
                    });
                } else {
                    // Recursively process child nodes
                    Array.from(node.childNodes).forEach(extractTextParts);
                }
            }
        }
        
        extractTextParts(tempDiv);
        
        // Flatten all text into one string for typing
        const fullText = textParts.map(part => part.text).join('');
        let currentIndex = 0;
        
        function type() {
            if (currentIndex < fullText.length) {
                currentIndex++;
                const currentText = fullText.substring(0, currentIndex);
                
                // Rebuild the HTML with current progress
                let html = '';
                let textIndex = 0;
                
                for (const part of textParts) {
                    const partEnd = textIndex + part.text.length;
                    const partStart = textIndex;
                    
                    if (currentIndex > partStart) {
                        const visibleLength = Math.min(currentIndex - partStart, part.text.length);
                        const visibleText = part.text.substring(0, visibleLength);
                        
                        if (part.isGradient) {
                            html += `<span class="gradient-text">${visibleText}</span>`;
                        } else {
                            html += visibleText;
                        }
                    }
                    
                    textIndex = partEnd;
                }
                
                element.innerHTML = html;
                setTimeout(type, speed);
            } else {
                // Typing complete - remove cursor
                element.classList.add('typing-complete');
            }
        }
        
        type();
    }
    
    // Initialize typing effect when page loads
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Get the original content from data attribute
            const originalContent = heroTitle.getAttribute('data-text');
            
            // Ensure content is empty initially
            heroTitle.innerHTML = '';
            
            // Show the title container before starting typing
            heroTitle.classList.add('typing-started');
            
            // Start typing effect
            typeWriter(heroTitle, originalContent, 50);
        }
    }, 1000);
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Initialize Fluid Wave background
        const waveSystem = new FluidWaveSystem();
        
        // Initialize configuration panel (development only)
        new WaveConfigPanel(waveSystem);
        
        // Initialize enhanced interactions
        new EnhancedInteractions();
    });
    
    // Add CSS for loading animation
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent-blue-bright) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(loadingStyle);
    
    // Form validation (if forms are added later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Add smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Add CSS for section reveal
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        section.section-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(sectionStyle);
    
    // Performance optimization: Debounce scroll events
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
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Scroll-based animations and effects
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navBackdrop.classList.remove('active');
        }
    });
    
    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #2563eb';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Utility functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for potential use in other scripts
window.EclipseAI = {
    isElementInViewport,
    throttle
};
