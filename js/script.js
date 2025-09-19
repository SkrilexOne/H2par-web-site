function initContactButtons() {
    // Элементы
    const contactBtn = document.querySelector('.contact-btn');
    const floatingBtn = document.querySelector('.floating-contact-btn');
    const contactModal = document.getElementById('contactModal');
    const requestModal = document.getElementById('requestModal');
    const requestBtn = document.querySelector('.request-btn');
    const closeBtns = document.querySelectorAll('.close');
    const requestForm = document.getElementById('requestForm');
    
    // Открытие модального окна контактов
    function openContactModal() {
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Открытие модального окна заявки
    function openRequestModal() {
        contactModal.style.display = 'none';
        requestModal.style.display = 'block';
    }
    
    // Закрытие модальных окон
    function closeModals() {
        contactModal.style.display = 'none';
        requestModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Обработчики событий
    if (contactBtn) {
        contactBtn.addEventListener('click', openContactModal);
    }
    
    if (floatingBtn) {
        floatingBtn.addEventListener('click', openContactModal);
    }
    
    if (requestBtn) {
        requestBtn.addEventListener('click', openRequestModal);
    }
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Обработка формы
if (requestForm) {
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Показываем индикатор загрузки
        const submitBtn = requestForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            date: document.getElementById('date').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Валидация телефона (добавьте этот блок)
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('Пожалуйста, введите корректный номер телефона в формате +7XXXXXXXXXX (10 цифр после +7)');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            return;
        }
        
        // URL вашего Google Apps Script веб-приложения
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzB98XH33Cw4i9sam4pD_SUoa9l7SX-P5yadEDtVvwh3DnqszS3KFTBfcSFPC7T02KQ/exec';
        
        // Отправляем данные
        fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Добавляем режим no-cors
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // В режиме no-cors мы не можем прочитать ответ, поэтому просто показываем успех
            alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModals();
            requestForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами другим способом.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
}
    
    // Показывать/скрывать плавающую кнопку при прокрутке
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > lastScroll && currentScroll > 200) {
            // Прокрутка вниз
            floatingBtn.style.transform = 'translateY(100px)';
        } else {
            // Прокрутка вверх или вверху страницы
            floatingBtn.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

function initPriceCarousel() {
    const track = document.querySelector('.price-track');
    if (!track) return;
    
    const slides = document.querySelectorAll('.price-slide');
    const dots = document.querySelectorAll('.price-dot');
    const prevBtn = document.querySelector('.price-arrow.prev');
    const nextBtn = document.querySelector('.price-arrow.next');
    
    // Добавьте эти проверки
    if (!slides.length || !dots.length || !prevBtn || !nextBtn) {
        console.error('Не найдены элементы карусели цен');
        return;
    }
    
    let currentIndex = 0;
    let clickTimer = null;
    const totalSlides = slides.length; // Добавлено определение totalSlides

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex === totalSlides - 1;
            nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
        }
    }
    
    // Функция для открытия изображения в полноэкранном режиме
    function openFullscreen(imgSrc) {
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.className = 'fullscreen-price';
        fullscreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;
        
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = imgSrc;
        fullscreenImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;
        
        fullscreenDiv.appendChild(fullscreenImg);
        document.body.appendChild(fullscreenDiv);
        document.body.style.overflow = 'hidden';
        
        // Закрытие при клике
        fullscreenDiv.addEventListener('click', () => {
            document.body.removeChild(fullscreenDiv);
            document.body.style.overflow = '';
        });
        
        // Закрытие при нажатии ESC
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(fullscreenDiv);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }
    
    // Обработчик для двойного клика
    slides.forEach((slide) => {
        const img = slide.querySelector('img');
        if (!img) return;
        
        img.addEventListener('click', function(e) {
            if (clickTimer === null) {
                // Первый клик - запускаем таймер
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                }, 300);
            } else {
                // Второй клик - открываем полноэкранный режим
                clearTimeout(clickTimer);
                clickTimer = null;
                e.preventDefault();
                e.stopPropagation();
                openFullscreen(this.src);
            }
        });
        
        // Отключаем перетаскивание изображения
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1;
            }
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        });
    }
    
    // Инициализация
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карусели отзывов
    initReviewsCarousel();
    
    // Инициализация галереи
    initGallery();
    initPriceCarousel();
    // Инициализация других компонентов
    initSmoothScroll();
    initFixedHeader();
    initBurgerMenu();
    initContactButtons();
});
const bigBtn = document.querySelector('.big-btn');
if (bigBtn) {
    bigBtn.addEventListener('click', function() {
        // Здесь код для открытия модального окна записи
        // Например:
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
}
function initReviewsCarousel() {
    const carousel = document.querySelector('.reviews-track');
    if (!carousel) return;
    
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const reviews = document.querySelectorAll('.review-card');
    const totalReviews = reviews.length;
    
    let currentIndex = 0;
    let autoScrollInterval;
    const scrollDelay = 8000;
    const transitionSpeed = 500;

    // Рассчитываем ширину одной карточки с учетом margin
    function getCardWidth() {
        if (reviews.length === 0) return 0;
        const style = window.getComputedStyle(reviews[0]);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        return reviews[0].offsetWidth + marginLeft + marginRight;
    }

    carousel.style.transition = `transform ${transitionSpeed}ms ease-in-out`;

    function updateCarousel() {
        const cardWidth = getCardWidth();
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex === totalReviews - 1;
            nextBtn.style.opacity = currentIndex === totalReviews - 1 ? '0.5' : '1';
        }
    }

    function safeTransition(action) {
        carousel.style.transition = 'none';
        action();
        setTimeout(() => {
            carousel.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
        }, 10);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            safeTransition(() => {
                currentIndex = index;
                updateCarousel();
                resetAutoScroll();
            });
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                safeTransition(() => {
                    currentIndex--;
                    updateCarousel();
                    resetAutoScroll();
                });
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalReviews - 1) {
                safeTransition(() => {
                    currentIndex++;
                    updateCarousel();
                    resetAutoScroll();
                });
            }
        });
    }
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            safeTransition(() => {
                if (currentIndex < totalReviews - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            });
        }, scrollDelay);
    }
    
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }
    
    const carouselContainer = document.querySelector('.reviews-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
            carousel.style.transition = 'none';
        });
        carouselContainer.addEventListener('mouseleave', () => {
            carousel.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
            startAutoScroll();
        });
    }
    
    // Инициализация
    updateCarousel();
    startAutoScroll();
    window.addEventListener('resize', updateCarousel);
}

function initGallery() {
    const modal = document.getElementById('galleryModal');
    const galleryContainer = document.getElementById('galleryImages');
    const galleryBtn = document.getElementById('gallery-btn');
    const closeBtn = document.querySelector('.close-gallery'); // Изменено на close-gallery

    if (!modal || !galleryContainer || !galleryBtn || !closeBtn) {
        console.error('Не найдены необходимые элементы галереи');
        return;
    }

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        loadGalleryImages();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    galleryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    function loadGalleryImages() {
        galleryContainer.innerHTML = '';
    
    const imageLinks = [
        'https://i.ibb.co/JRG6vb81/akvazona1.jpg',
        'https://i.ibb.co/HpL6Hh67/akvazona2.jpg',
        'https://i.ibb.co/5gcz7FxC/akvazona3.jpg',
        'https://i.ibb.co/fGtyKkYB/akvazona4.jpg',
        'https://i.ibb.co/rG4GcmdD/akvazona5.jpg',
        'https://i.ibb.co/4nR6Z9xr/akvazona6.jpg',
        'https://i.ibb.co/dT52SZR/akvazona7.jpg',
        'https://i.ibb.co/XxssPQBF/akvazona8.jpg',
        'https://i.ibb.co/twdzp711/akvazona9.jpg',
        'https://i.ibb.co/sdbzX8gQ/akvazona10.jpg',
        'https://i.ibb.co/Dfy7Z5QW/akvazona11.jpg',
        'https://i.ibb.co/gZzWCJvW/akvazona12.jpg',
        'https://i.ibb.co/sx5vyJp/akvazona13.jpg',
        'https://i.ibb.co/PGJgyNKk/akvazona14.jpg',
        'https://i.ibb.co/7dHsN7Kj/akvazona15.jpg',
        'https://i.ibb.co/0wPRSXK/akvazona16.jpg',
        'https://i.ibb.co/ycXCbKd6/akvazona17.jpg',
        'https://i.ibb.co/6RJR1xqR/akvazona18.jpg',
        'https://i.ibb.co/Nn2M8hy1/akvazona19.jpg',
        'https://i.ibb.co/nXmY5ZQ/akvazona20.jpg',
        'https://i.ibb.co/8g856wvc/akvazona21.jpg',
        'https://i.ibb.co/zVq8BCBJ/akvazona22.jpg',
        'https://i.ibb.co/2Yj021pz/akvazona23.jpg',
        'https://i.ibb.co/LDMVbV68/akvazona24.jpg',
        'https://i.ibb.co/QFB37PG9/akvazona25.jpg',
        'https://i.ibb.co/N2QMc7BX/akvazona26.jpg',
        'https://i.ibb.co/yCPZTnt/akvazona27.jpg',
        'https://i.ibb.co/RGPLyMrs/akvazona28.jpg',
        'https://i.ibb.co/gFDQLykf/akvazona29.jpg',
        'https://i.ibb.co/20Js9K1W/akvazona30.jpg',
        'https://i.ibb.co/8nt6rPc7/akvazona31.jpg',
        'https://i.ibb.co/xK4tYPCm/akvazona32.jpg',
        'https://i.ibb.co/Z1kRBFxr/akvazona33.jpg',
        'https://i.ibb.co/k2Zhsxhj/akvazona34.jpg',
        'https://i.ibb.co/Pvs5R0zm/akvazona35.jpg',
        'https://i.ibb.co/sd4KZJ3D/akvazona36.jpg',
        'https://i.ibb.co/wHD9D4w/akvazona37.jpg',
        'https://i.ibb.co/yBFsSPfN/akvazona38.jpg',
        'https://i.ibb.co/7mKmVJG/akvazona39.jpg',
        'https://i.ibb.co/bMmspVwt/akvazona40.jpg',
        'https://i.ibb.co/tnwxpSq/akvazona41.jpg',
        'https://i.ibb.co/j9gMxgkS/akvazona42.jpg',
        'https://i.ibb.co/cXXJZ6GB/akvazona43.jpg',
        'https://i.ibb.co/VpmsbD5W/akvazona44.jpg'
    ];

     imageLinks.forEach(imgUrl => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'gallery-img';
            img.loading = 'lazy';
            
            img.onerror = function() {
                imgWrapper.innerHTML = `
                    <div class="image-error">
                        <i class="fas fa-image"></i>
                        <p>Изображение не загружено</p>
                    </div>
                `;
            };
            
            img.addEventListener('click', function() {
                openFullscreenImage(this.src, this.alt);
            });
            
            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);
        });
    }

    function openFullscreenImage(src, alt) {
        const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
        let currentIndex = galleryImages.findIndex(img => img.src === src);
        
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-content">
                <span class="close-fullscreen">&times;</span>
                <div class="nav-arrows">
                    <span class="arrow prev-arrow">&#10094;</span>
                    <span class="arrow next-arrow">&#10095;</span>
                </div>
                <img src="${src}" alt="${alt}">
                <p>${alt}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        const imgElement = overlay.querySelector('img');
        const prevArrow = overlay.querySelector('.prev-arrow');
        const nextArrow = overlay.querySelector('.next-arrow');
        const description = overlay.querySelector('p');
        
        function loadImage(newIndex) {
            if (newIndex >= 0 && newIndex < galleryImages.length) {
                currentIndex = newIndex;
                const newImg = galleryImages[currentIndex];
                imgElement.src = newImg.src;
                imgElement.alt = newImg.alt;
                description.textContent = newImg.alt;
                
                prevArrow.style.opacity = currentIndex > 0 ? '1' : '0.3';
                nextArrow.style.opacity = currentIndex < galleryImages.length - 1 ? '1' : '0.3';
            }
        }
        
        loadImage(currentIndex);
        
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) loadImage(currentIndex - 1);
        });
        
        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex < galleryImages.length - 1) loadImage(currentIndex + 1);
        });
        
        const closeBtn = overlay.querySelector('.close-fullscreen');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.style.overflow = 'auto';
        });
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.body.style.overflow = 'auto';
            }
        });
        
        function handleKeyPress(e) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                loadImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) {
                loadImage(currentIndex + 1);
            } else if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleKeyPress);
            }
        }
        
        document.addEventListener('keydown', handleKeyPress);
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') !== '#') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

function initFixedHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            header.style.padding = '20px 0';
            header.style.background = 'rgba(0, 96, 148, 0.95)';
            
            if (currentScroll > lastScroll) {
                header.style.top = '-100px';
            } else {
                header.style.top = '0';
            }
        } else {
            header.style.padding = '20px 0';
            header.style.background = '#006094';
            header.style.top = '0';
        }
        
        lastScroll = currentScroll;
    });
}

function initBurgerMenu() {
    const burgerBtn = document.querySelector('.burger-btn');
    const nav = document.getElementById('main-nav');
    
    if (!burgerBtn || !nav) return;
    
    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
}
