(function ($) {
	$(function () {
		$("button.btn-link[href]").click(function () {
			var url = $(this).attr("href");
			window.location = url;
		});
	});
})(jQuery);

