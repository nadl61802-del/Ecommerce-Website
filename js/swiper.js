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
    slidesPerView: 5,
    spaceBetween: 20,

    autoplay: {
        delay: 2500,
        pauseOnMouseEnter: true,
    },
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    },
    loop: false,
});