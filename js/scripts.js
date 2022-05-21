jQuery(document).foundation();
/*
These functions make sure WordPress
and Foundation play nice together.
*/
jQuery(document).ready(function() {
//Search
jQuery('a[href="#search"]').on('click', function(event) {
	event.preventDefault();
	jQuery('#search').addClass('open');
	jQuery('#search > form > input[type="search"]').focus();
});
jQuery('#search, #search .close').on('click keyup', function(event) {
	if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
		jQuery(this).removeClass('open');
	}
});
var $logo_search_column = jQuery('#logo-search-column');
var $logo_search_input = jQuery('.search-header-2 input#s');
//Search bar resize
function resize_search_bar(){
	var logo_search_column = $logo_search_column.width();
	var search_button_width = jQuery('.search-header-2 .input-group-button').outerWidth(true);
	if(jQuery(window).width() > 640){
		var logo_width = jQuery('#logo').outerWidth(true);
		jQuery($logo_search_input.outerWidth(logo_search_column - logo_width - search_button_width - 30));
	}else{
		jQuery($logo_search_input.outerWidth(logo_search_column - search_button_width - 15));
	}
}
var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
jQuery("#filters li a").each(function(){
	jQuery(this).removeClass("active");
	if(jQuery(this).attr("href") == pgurl || jQuery(this).attr("href") == '' ) {
		jQuery(this).addClass("active");
	}
});

// Remove empty P tags created by WP inside of Accordion and Orbit
jQuery('.accordion p:empty, .orbit p:empty').remove();

// Makes sure last grid item floats left
jQuery('.archive-grid .columns').last().addClass( 'end' );
jQuery('.widget_categories .cat-item a').addClass('label');
jQuery('.commentlist .comment-reply-link').addClass('label');

//Main thumbs
main_setThumbsHeight();
resize_search_bar();

jQuery( window ).resize(function() {
	resize_search_bar();
	main_setThumbsHeight();
});
function main_setThumbsHeight(){
	var eltWidthMain = jQuery('.featured-image:first-child').width();
	jQuery('.featured-image img').height( eltWidthMain * 10 / 16 );
	jQuery('.no-thumb').height( eltWidthMain * 10 / 16 );
}
jQuery('#sidebar .video-list').removeClass().addClass('video-list row small-up-1 medium-up-1 large-up-2 margin-top-2');
jQuery('#footer .video-list').removeClass().addClass('video-list row small-up-1 medium-up-2 large-up-2 margin-top-2');
jQuery('#sidebar .video-list .see-all span').replaceWith('');
jQuery('#footer .video-list .see-all span').replaceWith('');
//Sidebar thumbs
sidebar_setThumbsHeight();

jQuery( window ).resize(function() {
	sidebar_setThumbsHeight();
});
function sidebar_setThumbsHeight(){
	var eltWidthSidebar = jQuery('#sidebar .featured-image:first-child').width();
	jQuery('#sidebar .featured-image img').height( eltWidthSidebar * 10 / 16 );
	jQuery('#sidebar .no-thumb').height( eltWidthSidebar * 10 / 16 );
}
//Footer thumbs
footer_setThumbsHeight();

jQuery( window ).resize(function() {
	footer_setThumbsHeight();
});
function footer_setThumbsHeight(){
	var eltWidthFooter = jQuery('#footer .featured-image:first-child').width();
	jQuery('#footer .featured-image img').height( eltWidthFooter * 10 / 16 );
	jQuery('#footer .no-thumb').height( eltWidthFooter * 10 / 16 );
}
//Multithumbs
var changeThumb = null;
var stopped = false;
jQuery('body').on('mouseenter', '.featured-image', function(e){

	var $this = jQuery(this);
	stopped = false;
	if( $this.data('thumbs') != undefined ){
		var dataThumbs = $this.data('thumbs');
		var thumbs = dataThumbs.split(',');
		var nbThumbs = thumbs.length;
		var i = 1;
		changeThumb = null;
		clearTimeout(changeThumb);
		changeThumb = function() {
			if( stopped == false ){
				$this.find('img').attr('srcset', thumbs[i]);
				if (i <= nbThumbs) {
					if( i == nbThumbs ){
						i = 0;
					}
					setTimeout(changeThumb, 700);
					i++;
				}
			}
		};
		changeThumb();
	}
}).on('mouseleave', '.featured-image', function(e){
	stopped = true;
	changeThumb = null;
	var highestTimeoutId = setTimeout(";");
	for (var i = 0 ; i < highestTimeoutId ; i++) {
		clearTimeout(i);
	}
	var $blockImg = jQuery(this).find('img');
	var defaultThumb = $blockImg.attr('src');
	$blockImg.attr('srcset', defaultThumb);
});
//Sticky Sidebar
var stickySidebar = jQuery('.sticky');
if (stickySidebar.length > 0) {
	var stickyHeight = stickySidebar.height(),
	sidebarTop = stickySidebar.offset().top;
}
// on scroll move the sidebar
jQuery(window).scroll(function () {
	if (stickySidebar.length > 0) {
		var scrollTop = jQuery(window).scrollTop();
		var mainHeight = jQuery('#main').height();
		var currentWindowHeight = jQuery(window).height();
		var stickyStop = jQuery('#main').offset().top + jQuery('#main').height();
		var sidebarBottom2 = scrollTop + stickyHeight;
		if ( ( sidebarTop < ( scrollTop + 20 ) ) && ( mainHeight >= stickyHeight ) && ( stickyStop > sidebarBottom2 ) ) {
			stickySidebar.css('top', scrollTop - sidebarTop + 20);
		}else {
//stickySidebar.css('top', '0');
}
}
});
jQuery(window).resize(function () {
	if (stickySidebar.length > 0) {
		stickyHeight = stickySidebar.height();
	}
});
//Show more description
/*jQuery("#video-description .show-more").click(function () {
if(jQuery(".text").hasClass("show-more-height")) {
jQuery(this).html("<i class='fa fa-minus-square'></i>");
} else {
jQuery(this).html("<i class='fa fa-plus-square'></i>");
}
jQuery(".text").toggleClass("show-more-height");
});
if(jQuery("#video-description .text p").height() < 30) {
jQuery("#video-description .show-more").hide();
}*/
/** Post like **/
jQuery(".post-like a").on('click', function(e){
	e.preventDefault();

	var heart = jQuery(this);
	var post_id = heart.data("post_id");
	var post_like = heart.data("post_like");

	jQuery.ajax({
		type: "post",
		url: ajax_var.url,
		dataType   : "json",
		data: "action=post-like&nonce=" + ajax_var.nonce + "&post_like=" + post_like + "&post_id=" + post_id,
		success    : function(data, textStatus, jqXHR){
			if(data.already !== true) {
				jQuery("#about .note-bar").removeClass("not-rated-yet");
				jQuery("#about .rating").text(Math.floor(data.pourcentage) + "%");
				jQuery("#about .rating").show();

				jQuery("#about .percent").text(Math.floor(data.pourcentage) + "%");
				jQuery("#about .percent").show();

				jQuery("#about .likes_count").text(data.likes);
				jQuery("#about .dislikes_count").text(data.dislikes);

				jQuery(".post-like").text(data.bouton);

				if( data.nbvotes > 0 ){
					jQuery("#about .progress-meter").animate({
						width: data.barre + "%",
					}, "fast", function() {
// Animation complete.
});
				}
			}
		}
	});
	return false;
});
//Scroll to top
if (jQuery('#back-to-top').length) {
var scrollTrigger = 100, // px
backToTop = function () {
	var scrollTop = jQuery(window).scrollTop();
	if (scrollTop > scrollTrigger) {
		jQuery('#back-to-top').addClass('show');
	} else {
		jQuery('#back-to-top').removeClass('show');
	}
};
backToTop();
jQuery(window).on('scroll', function () {
	backToTop();
});
jQuery('#back-to-top').on('click', function (e) {
	e.preventDefault();
	jQuery('html,body').animate({
		scrollTop: 0
	}, 500);
});
}
jQuery("#clickme").click(function(){
	var textToCopy = jQuery('#copyme').val();
	jQuery('#temptext').val(textToCopy);
	jQuery('#temptext').select();
	document.execCommand('copy');
	jQuery('#clickme i').replaceWith('<i class="fa fa-check"></i>');
});

});