const demoSwiper = new Swiper(".demoSwiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    autoplay: {
        delay: 2000,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    speed: 1000,
    loop: true,
    breakpoints: {
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 4,
            spaceBetween: 24,
        },
    },
});