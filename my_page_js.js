document.addEventListener('DOMContentLoaded', (event) => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.add('active');

    const sweetWrapper = document.getElementById("SweetScrollWrapper");
    if (sweetWrapper) {
        const originalContent = sweetWrapper.innerHTML;
        sweetWrapper.innerHTML = originalContent + originalContent;
    }

    const lightbox = document.getElementById("imageLightbox");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentImgIndex = 0;
    let allImages = [];

    const cakeWrapper = document.getElementById("SweetScrollWrapper");
    const gameWrapper = document.getElementById("GameScrollWrapper");

    function setupLightboxForWrapper(targetWrapper) {
        if (targetWrapper && lightbox) {
            targetWrapper.addEventListener("click", (e) => {
                if (e.target.tagName === "IMG") {
                    allImages = Array.from(targetWrapper.querySelectorAll("img"));
                    currentImgIndex = allImages.indexOf(e.target);
                    updateLightboxImage();
                    lightbox.style.display = "flex";
                }
            });
        }
    }
    setupLightboxForWrapper(cakeWrapper);
    setupLightboxForWrapper(gameWrapper);

    function updateLightboxImage() {
        const currentImg = allImages[currentImgIndex];
        const lightboxTitle = document.getElementById("lightboxTitle");
        const lightboxDesc = document.getElementById("lightboxDesc");
        const lightboxTextBox = document.getElementById("lightboxTextBox");

        if (currentImg) {
            const currentImgTag = document.getElementById("lightboxImg");
            const currentVideoTag = document.getElementById("lightboxVideo");
            const imgContainer = currentImgTag ? currentImgTag.parentElement : (currentVideoTag ? currentVideoTag.parentElement : null);

            if (imgContainer) {
                const isGameSection = currentImg.closest("#GameScrollWrapper") !== null;
                const videoId = currentImg.getAttribute("data-video");

                if (isGameSection && videoId) {

                    imgContainer.innerHTML = `
                        <iframe id="lightboxVideo" width="100%" height="100%" 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                                frameborder="0" 
                                allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen 
                                style="display: block; width: 100%; height: 100%; border: none;">
                        </iframe>
                    `;
                } else {

                    imgContainer.innerHTML = '<img id="lightboxImg" src="" style="width: 100%; height: 100%; object-fit: contain;">';
                    document.getElementById("lightboxImg").src = currentImg.src;
                }
            }


            const titleText = currentImg.getAttribute("data-title") || "";
            let descText = currentImg.getAttribute("data-desc") || "";

            if (lightboxTitle && lightboxDesc && lightboxTextBox) {
                if (titleText || descText) {
                    lightboxTitle.innerHTML = titleText;


                    descText = descText.replace(/(https?:\/\/itch\.io[^\s]*|https?:\/\/[^\s]*itch\.io[^\s]*)/g, '<a href="$1" target="_blank" style="color: #64b5f6; text-decoration: underline; font-weight: bold;">$1</a>');
                    lightboxDesc.innerHTML = descText;

                    lightboxTextBox.style.display = "flex";
                } else {
                    lightboxTitle.innerHTML = "";
                    lightboxDesc.innerHTML = "";
                    lightboxTextBox.style.display = "none";
                }
            }
        }
    }

    function showNextImage() {
        currentImgIndex++;
        if (currentImgIndex >= allImages.length) {
            currentImgIndex = 0;
        }
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImgIndex--;
        if (currentImgIndex < 0) {
            currentImgIndex = allImages.length - 1;
        }
        updateLightboxImage();
    }

    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNextImage(); });
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrevImage(); });


    if (closeBtn && lightbox) {
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";

            const videoElement = document.getElementById("lightboxVideo");
            if (videoElement) videoElement.parentElement.innerHTML = '<img id="lightboxImg" src="">';
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";

                const videoElement = document.getElementById("lightboxVideo");
                if (videoElement) videoElement.parentElement.innerHTML = '<img id="lightboxImg" src="">';
            }
        });
    }

    function createImgDanmaku(nextSlideElement, direction) {
        if (!nextSlideElement) return;

        const oldContainer = document.querySelector('.danmaku-container');
        if (oldContainer) {
            oldContainer.remove();
        }

        const subFolderName = nextSlideElement.getAttribute('data-bullet-folder');
        const maxImages = parseInt(nextSlideElement.getAttribute('data-bullet-count'), 10);

        if (!subFolderName || !maxImages || isNaN(maxImages)) return;

        const container = document.createElement('div');
        container.className = 'danmaku-container';
        document.body.appendChild(container);

        for (let i = 0; i < 1000; i++) {
            const imgItem = document.createElement('img');

            if (direction === 'down') {
                imgItem.className = 'danmaku-item go-down';
            } else {
                imgItem.className = 'danmaku-item go-up';
            }

            const randomImgNumber = Math.floor(Math.random() * maxImages) + 1;
            imgItem.src = `phto/Bullet screen img/${subFolderName}/${randomImgNumber}.png`;

            imgItem.style.left = Math.random() * 92 + 'vw';
            imgItem.style.bottom = Math.random() * 100 + 'vh';

            const randomSize = Math.floor(Math.random() * 30 + 35);
            imgItem.style.width = randomSize + 'px';
            imgItem.style.height = 'auto';

            const randomRotate = Math.floor(Math.random() * 50 - 25);
            imgItem.style.transform = `rotate(${randomRotate}deg)`;

            imgItem.style.animationDuration = (Math.random() * 1 + 1) + 's';
            container.appendChild(imgItem);

            setTimeout(() => { container.remove(); }, 2500);
        }
    }

    function showSlide(index, direction) {
        if (index < 0 || index >= slides.length) return;

        const nextSlideElement = slides[index];

        createImgDanmaku(nextSlideElement, direction);

        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let isScrolling = false;

    window.addEventListener('wheel', (event) => {
        if (event.target.closest('nav')) return;
        const lightboxCheck = document.getElementById("imageLightbox");
        if (lightboxCheck && lightboxCheck.style.display === "flex") {
            event.preventDefault();
            return;
        }

        if (isScrolling) {
        event.preventDefault();
        return;
        }

        if (window.matchMedia("(max-width: 768px)").matches) {
        return; 
        }

        isScrolling = true;

        event.preventDefault();

        if (event.deltaY > 0) {
            showSlide(currentSlide + 1, 'up');
        } else if (event.deltaY < 0) {
            showSlide(currentSlide - 1, 'down');
        }
        setTimeout(() => { isScrolling = false; }, 800);
    }, {
        passive: false
    });

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSlide = document.querySelector(targetId);
                if (targetSlide) {
                    const targetIndex = Array.from(slides).indexOf(targetSlide);
                    if (targetIndex !== -1) {
                        const direction = targetIndex < currentSlide ? 'down' : 'up';
                        showSlide(targetIndex, direction);
                    }
                }
            }
        });
    });
});

    const isMobile = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window);
    
    if (isMobile) {
        window.addEventListener('touchstart', function(e) {
            if (e.target.closest('.slide')) {
                e.stopPropagation(); 
            }
        }, { passive: true });

        window.addEventListener('touchmove', function(e) {
            if (e.target.closest('.slide')) {
                e.stopPropagation();
            }
        }, { passive: true });

        const mobileSlides = document.querySelectorAll('.slide');
        mobileSlides.forEach(slide => {
            slide.style.height = 'auto';
            slide.style.minHeight = '100vh';
            slide.style.overflowY = 'auto';
            slide.style.webkitOverflowScrolling = 'touch';
        });
    }
}

document.addEventListener('DOMContentLoaded', unlockMobileScrolling);
window.addEventListener('resize', unlockMobileScrolling);
