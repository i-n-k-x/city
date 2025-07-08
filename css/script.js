// Função para scroll suave até os produtos
function scrollToProducts(event) {
    event.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// SISTEMA DE POP-UP DE VÍDEO - CORRIGIDO
class VideoPopup {
    constructor() {
        this.helpButton = document.getElementById('helpButton');
        this.videoPopup = document.getElementById('videoPopup');
        this.closePopup = document.getElementById('closePopup');
        this.popupVideo = document.getElementById('popupVideo');

        // Link do vídeo do Vimeo configurado
        this.videoUrl = 'https://player.vimeo.com/video/1098854357?autoplay=1&title=0&byline=0&portrait=0&controls=1';

        this.init();
    }

    init() {
        console.log('Inicializando VideoPopup...');
        console.log('Help Button:', this.helpButton);
        console.log('Video Popup:', this.videoPopup);
        console.log('Close Popup:', this.closePopup);
        console.log('Popup Video:', this.popupVideo);

        if (!this.helpButton) {
            console.error('Botão de ajuda não encontrado! ID: helpButton');
            return;
        }
        
        if (!this.videoPopup) {
            console.error('Overlay do pop-up não encontrado! ID: videoPopup');
            return;
        }
        
        if (!this.closePopup) {
            console.error('Botão de fechar não encontrado! ID: closePopup');
            return;
        }
        
        if (!this.popupVideo) {
            console.error('Iframe do vídeo não encontrado! ID: popupVideo');
            return;
        }

        this.bindEvents();
        console.log('VideoPopup inicializado com sucesso!');
    }

    bindEvents() {
        // Abrir pop-up
        this.helpButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão "Como Comprar" clicado!');
            this.openPopup();
        });

        // Fechar pop-up
        this.closePopup.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Botão fechar clicado!');
            this.closePopupHandler();
        });

        // Fechar clicando no overlay
        this.videoPopup.addEventListener('click', (e) => {
            if (e.target === this.videoPopup) {
                console.log('Clicou no overlay - fechando pop-up');
                this.closePopupHandler();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoPopup.classList.contains('active')) {
                console.log('ESC pressionado - fechando pop-up');
                this.closePopupHandler();
            }
        });
    }

    openPopup() {
        console.log('Abrindo pop-up...');
        
        // Carrega o vídeo apenas quando abrir
        this.popupVideo.src = this.videoUrl;
        this.videoPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll do fundo
        
        console.log('Pop-up aberto!');
        console.log('Classe active adicionada:', this.videoPopup.classList.contains('active'));
        console.log('URL do vídeo:', this.popupVideo.src);
    }

    closePopupHandler() {
        console.log('Fechando pop-up...');
        
        this.videoPopup.classList.remove('active');
        this.popupVideo.src = ''; // Para o vídeo ao fechar
        document.body.style.overflow = ''; // Restaura scroll do fundo
        
        console.log('Pop-up fechado!');
    }
}

// Carousel functionality
class ImageCarousel {
    constructor() {
        this.carouselTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.carouselIndicators = document.getElementById('carouselIndicators');

        // Verifica se os elementos existem antes de inicializar
        if (!this.carouselTrack || !this.prevBtn || !this.nextBtn || !this.carouselIndicators) {
            console.warn('Elementos do carrossel não encontrados. Carrossel não será inicializado.');
            return;
        }

        this.slides = Array.from(this.carouselTrack.children);
        this.slideWidth = this.slides[0].offsetWidth; // Initial width
        this.currentIndex = 0;
        this.intervalTime = 4000; // 4 seconds
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.createIndicators();
        this.updateIndicators();
        this.setupEventListeners();
        this.startAutoSlide();
        this.adjustSlideWidth(); // Adjust width initially
        window.addEventListener('resize', this.adjustSlideWidth.bind(this));
    }

    adjustSlideWidth() {
        // Recalculate slide width on resize
        this.slideWidth = this.slides[0].offsetWidth;
        this.moveToSlide(this.currentIndex, false); // Reposition without animation
    }

    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                this.moveToSlide(index);
                this.resetAutoSlide();
            });
            this.carouselIndicators.appendChild(indicator);
        });
    }

    updateIndicators() {
        Array.from(this.carouselIndicators.children).forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    moveToSlide(index, animate = true) {
        if (index < 0) {
            this.currentIndex = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }

        const offset = -this.currentIndex * this.slideWidth;
        this.carouselTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        this.carouselTrack.style.transform = `translateX(${offset}px)`;
        this.updateIndicators();
    }

    nextSlide() {
        this.moveToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.moveToSlide(this.currentIndex - 1);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }

    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoSlide();
        });

        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoSlide();
        });

        // Pause auto-slide on hover
        this.carouselTrack.addEventListener('mouseenter', () => clearInterval(this.autoSlideInterval));
        this.carouselTrack.addEventListener('mouseleave', () => this.startAutoSlide());
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - inicializando componentes...');
    
    // Inicializa o pop-up de vídeo
    const videoPopup = new VideoPopup();
    
    // Inicializa o carrossel (apenas se os elementos existirem)
    const carousel = new ImageCarousel();
    
    console.log('Todos os componentes inicializados!');
});

// Função para navegação suave (pode ser usada em outras páginas)
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para voltar à página anterior
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// Função para detectar se é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para otimizar performance em dispositivos móveis
function optimizeForMobile() {
    if (isMobile()) {
        // Reduz animações em dispositivos móveis
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Desabilita hover em dispositivos touch
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .carousel-item:hover,
                .cta-button:hover,
                .whatsapp-button:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Otimizações de performance
window.addEventListener('load', () => {
    optimizeForMobile();
    
    // Preload de imagens críticas
    const criticalImages = [
        'https://i.ibb.co/5fx7ydb/OC.png',
        'https://i.ibb.co/y3wvPbx/OCT.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Lazy loading para imagens do carrossel
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);