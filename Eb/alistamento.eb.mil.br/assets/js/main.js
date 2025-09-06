/*------------------------------------------
  IE DETECTION
  ------------------------------------------*/
(function(){
	/* returns version of IE or false, if browser is not Internet Explorer */
	function detectIE() {
	    var ua = window.navigator.userAgent;

	    var msie = ua.indexOf('MSIE ');
	    if (msie > 0) {
	        // IE 10 or older => return version number
	        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	    }

	    var trident = ua.indexOf('Trident/');
	    if (trident > 0) {
	        // IE 11 => return version number
	        var rv = ua.indexOf('rv:');
	        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	    }

	    var edge = ua.indexOf('Edge/');
	    if (edge > 0) {
	       // IE 12 => return version number
	       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	    }

	    // other browser
	    return false;
	}

	if(detectIE()){
		$('body').addClass("ie");
	}

})();


/*------------------------------------------
  FixedTop Navigation
  ------------------------------------------*/
(function(){
	var $nav = $('#fixedTopNav');

    function navbarAnimation() {
        if ($(window).scrollTop() > 0) {
        	$nav.addClass('navbar-solid');
        	return;
        }
        $nav.removeClass('navbar-solid');
        $(".navbar-nav > li > a").blur();
    }

    navbarAnimation();

    $(window).scroll(function() {
		navbarAnimation();
	});

})();

/*------------------------------------------
  On-page navigation smooth scroll
  ------------------------------------------*/
$(document).ready(function(){
    $('.main-navigation a[href*=\\#]:not([href=\\#]), .onPageNav').click(function() {
        if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
				$(".navbar-collapse.collapse.in").removeClass("in");
                $('html,body').animate({scrollTop: target.offset().top - 55}, 1000, function(){});
                return false;
            }
        }
    });
    //fixed bootstrap scroll spy
    $('#main-nav-collapse').on('activate.bs.scrollspy', function () {
  		$(".navbar-nav > li[class='active'] > a").focus();
	});
});

/*------------------------------------------
  Preloader
  ------------------------------------------*/
$(window).on('load', function (){
  imagesLoaded('body', function (){
    $(".page-loader div").fadeOut();
    $(".page-loader").delay(200).fadeOut("slow");
  });
});

var navbar = $('.main-navigation'),
	width  = Math.max($(window).width(), window.innerWidth),
	mobileTest;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	mobileTest = true;
}

/* ----------------------------------------------
   Navbar submenu
   ---------------------------------------------- */
function navbarSubmenu(width) {
	if (width > 767) {
		$('.main-navigation .navbar-nav > li.dropdown').hover(function() {
			var MenuLeftOffset  = $(this).offset().left;
			var Menu1LevelWidth = $('.dropdown-menu', $(this)).width();
			if (width - MenuLeftOffset < Menu1LevelWidth * 2) {
				$(this).children('.dropdown-menu').addClass('leftauto');
			} else {
				$(this).children('.dropdown-menu').removeClass('leftauto');
			}
			if ($('.dropdown-menu', $(this)).length > 0) {
				var Menu2LevelWidth = $('.dropdown-menu', $(this)).width();
				if (width - MenuLeftOffset - Menu1LevelWidth < Menu2LevelWidth) {
					$(this).children('.dropdown-menu').addClass('left-side');
				} else {
					$(this).children('.dropdown-menu').removeClass('left-side');
				}
			}
		});
	}
}

/* ----------------------------------------------
   Navbar hover dropdown on desktop
   ---------------------------------------------- */
function hoverDropdown(width, mobileTest) {
	if ((width > 767) && (mobileTest !== true)) {
		$('.main-navigation .navbar-nav > li.dropdown, .main-navigation li.dropdown > ul > li.dropdown').removeClass('open');
		var delay = 0;
		var setTimeoutConst;
		$('.main-navigation .navbar-nav > li.dropdown, .main-navigation li.dropdown > ul > li.dropdown').hover(function() {
				var $this = $(this);
				setTimeoutConst = setTimeout(function() {
					$this.addClass('open');
					$this.find('.dropdown-toggle').addClass('disabled');
				}, delay);
			},
			function() {
				clearTimeout(setTimeoutConst);
				$(this).removeClass('open');
				$(this).find('.dropdown-toggle').removeClass('disabled');
			});
	} else {
		$('.main-navigation .navbar-nav > li.dropdown, .main-navigation li.dropdown > ul > li.dropdown').unbind('mouseenter mouseleave');
		$('.main-navigation [data-toggle=dropdown]').not('.binded').addClass('binded').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().siblings().find('[data-toggle=dropdown]').parent().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	}
}

/* ----------------------------------------------
   Scroll Window to top
   ---------------------------------------------- */
$(window).scroll(function() {
	var $toTop = $('#totop');
	if ($(this).scrollTop() > 100) {
		$toTop.fadeIn();
	} else {
		$toTop.fadeOut();
	}
});

$("a[href='#totop']").click(function() {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	return false;
});
