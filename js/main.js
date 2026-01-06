/**
 * 主要 JavaScript 檔案
 * 使用模組化架構組織程式碼
 */

// ==========================================
// 應用程式主控制器
// ==========================================
const App = {
    /**
     * 初始化應用程式
     */
    init() {
        console.log('應用程式初始化中...');

        // 初始化各個模組
        Navigation.init();
        CarouselModule.init();
        FlipCardModule.init();
        ContactForm.init();
        ScrollAnimations.init();

        console.log('應用程式初始化完成');
    }
};

// ==========================================
// 導覽列模組
// ==========================================
const Navigation = {
    /**
     * 初始化導覽列功能
     */
    init() {
        console.log('導覽列模組已載入');
        this.initSmoothScroll();
        this.initActiveNavLink();
        this.initNavbarCollapse();
    },

    /**
     * 初始化平滑滾動效果
     */
    initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // 忽略空的錨點
                if (targetId === '#' || targetId === '') {
                    return;
                }

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // 計算導覽列高度
                    navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    // 平滑滾動到目標位置
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 在手機版點擊後關閉導覽列
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
    },

    /**
     * 初始化當前區塊高亮
     */
    initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const highlightNavLink = () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // 初始呼叫
    },

    /**
     * 初始化導覽列收合功能
     */
    initNavbarCollapse() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            // 點擊導覽連結後自動關閉（在手機版）
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }
    }
};

// ==========================================
// 圖片輪播模組
// ==========================================
const CarouselModule = {
    carousel: null,

    /**
     * 初始化圖片輪播功能
     */
    init() {
        console.log('圖片輪播模組已載入');

        const carouselElement = document.getElementById('mainCarousel');
        if (carouselElement) {
            // 初始化 Bootstrap Carousel
            this.carousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000,     // 5秒自動切換
                wrap: true,         // 循環播放
                keyboard: true,     // 支援鍵盤控制
                pause: 'hover',     // 滑鼠懸停時暫停
                ride: 'carousel'    // 自動播放
            });

            this.addKeyboardSupport();
            this.addTouchSupport();
        }
    },

    /**
     * 新增鍵盤支援
     */
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.carousel.prev();
            } else if (e.key === 'ArrowRight') {
                this.carousel.next();
            }
        });
    },

    /**
     * 新增觸控支援（滑動手勢）
     */
    addTouchSupport() {
        const carouselElement = document.getElementById('mainCarousel');
        if (!carouselElement) return;

        let touchStartX = 0;
        let touchEndX = 0;

        carouselElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑動 -> 下一張
                    this.carousel.next();
                } else {
                    // 向右滑動 -> 上一張
                    this.carousel.prev();
                }
            }
        };
    }
};

// ==========================================
// 翻牌卡片模組
// ==========================================
const FlipCardModule = {
    /**
     * 初始化翻牌卡片功能
     */
    init() {
        console.log('翻牌卡片模組已載入');
        this.initFlipCards();
    },

    /**
     * 初始化翻牌卡片互動
     */
    initFlipCards() {
        const flipCards = document.querySelectorAll('.flip-card');

        flipCards.forEach(card => {
            // 點擊翻轉功能（主要用於行動裝置）
            card.addEventListener('click', (e) => {
                // 檢查是否點擊的是連結或按鈕
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }

                // 切換翻轉狀態
                card.classList.toggle('flipped');
            });

            // 鍵盤支援
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('flipped');
                }
            });

            // 觸控裝置優化：防止雙擊縮放
            card.addEventListener('touchstart', (e) => {
                // 不預設行為，由 click 事件處理
            }, { passive: true });
        });

        // 點擊卡片外部時收合所有卡片（可選）
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.flip-card')) {
                // 可以選擇是否要自動收合
                // flipCards.forEach(card => card.classList.remove('flipped'));
            }
        });
    }
};

// ==========================================
// 聯絡表單模組
// ==========================================
const ContactForm = {
    /**
     * 初始化聯絡表單功能
     */
    init() {
        console.log('聯絡表單模組已載入');
        this.initFormValidation();
        this.initFormSubmit();
    },

    /**
     * 初始化表單驗證
     */
    initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // 使用 Bootstrap 的表單驗證
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    },

    /**
     * 初始化表單送出處理
     */
    initFormSubmit() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 檢查表單是否有效
            if (!form.checkValidity()) {
                return;
            }

            // 取得表單資料
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // 顯示成功訊息
            this.showSuccessMessage();

            // 重置表單
            form.reset();
            form.classList.remove('was-validated');

            console.log('表單資料：', formData);
        });
    },

    /**
     * 顯示成功訊息
     */
    showSuccessMessage() {
        // 建立提示訊息
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            <strong><i class="bi bi-check-circle-fill"></i> 送出成功！</strong>
            <p class="mb-0">我們會盡快回覆您的訊息。</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        // 3秒後自動關閉
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 3000);
    }
};

// ==========================================
// 滾動動畫模組
// ==========================================
const ScrollAnimations = {
    /**
     * 初始化滾動動畫功能
     */
    init() {
        console.log('滾動動畫模組已載入');
        this.initScrollAnimations();
        this.initParallaxEffect();
    },

    /**
     * 初始化元素滾動進入動畫
     */
    initScrollAnimations() {
        // 為所有區塊加入動畫類別
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        // 使用 Intersection Observer API
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    },

    /**
     * 初始化視差效果（Hero 區塊）
     */
    initParallaxEffect() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
};

// ==========================================
// 工具函式
// ==========================================
const Utils = {
    /**
     * 節流函式
     */
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 防抖函式
     */
    debounce(func, wait) {
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
};

// ==========================================
// 應用程式啟動
// ==========================================
// 確保 DOM 載入完成後執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    // DOM 已經載入完成
    App.init();
}
