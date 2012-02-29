(function ($) {
	$(function () {
		$("button.btn-link[href]").click(function () {
			window.location = $(this).attr("href");
		});

		$("[href=#]").click(function(ev) {
			return false;
		});
	});

	var tmplConfig = {
		suffix: "tmpl",
		plugin: "jquery/view/tmpl",
		renderer: function (id, text) {
			return function (data) {
				return $.tmpl(text, data);
			};
		},
		script: function (id, text) {
			var tmpl = $.tmpl(text).toString();
			return "function(data){return (" +
				tmpl +
					").call(jQuery, jQuery, data); }";
		}
	};


	// $.View.register(tmplConfig); // no-op function in micro jmvc :(
	$.View.types[".tmpl"] = tmplConfig;

})(jQuery);

