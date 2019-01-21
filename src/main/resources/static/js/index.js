(function($) {
	window.index = $.fn.index = {
		
	}
	
})(jQuery);

$(document).ready(function($){
	//swiper插件方法
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    });
})