var swiper = new Swiper(".slide-swp", {
    pagination: {
        el: ".swiper-pagination",
        dynamicBullests: true,
        clickable: true,
    },
    autoplay: {
        delay: 2500,
    },
    loop: true,
});



// swiper slide

var swiper = new Swiper(".slide_product",{
    slidesPerView: 4,
    spaceBetween: 20,

    autoplay: {
        delay: 2500,
        pauseOnMouseEnter: true,
    },
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    },
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        520: {
            slidesPerView: 2,
            spaceBetween: 14,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 18,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
    },
});
