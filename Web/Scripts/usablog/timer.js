(function ($) {
	function pad(number, length) {

		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}

		return str;

	}

	$.Class('Usablog.Timer',
	//static
	{
	defaults: {
		broadcastInterval: 100
	},

	formatElapsed: function (elapsedMs) {
		var ms = elapsedMs % 1000;
		var totalSecs = (elapsedMs - ms) / 1000;
		var secs = totalSecs % 60;
		var totalMins = (totalSecs - secs) / 60;
		var mins = totalMins % 60;
		var hours = (totalMins - mins) / 60;
		return (hours ? hours + ":" + pad(mins, 2) : mins) + ":" + pad(secs, 2);
	}
},
//prototype
	{
	init: function (options) {
		if (options instanceof Date) {
			options = { startedAt: options };
		}
		options = $.extend(true, {}, this.Class.defaults, options);

		this.broadcastInterval = options.broadcastInterval;

		if (options.startedAt) {
			this.start(options.startedAt);
		}
	},

	start: function (startTime) {
		this.startedAt = startTime || (new Date()).getTime();
		$(this).trigger("started");
		this.startBroadcasting();
	},

	stop: function () {
		this.stopBroadcasting();
		$(this).trigger("stopped");
	},

	startBroadcasting: function () {
		if (!this.broadcasting) {
			this.broadcasting = true;

			var timer = this;
			var triggerFunc = function () {
				if (timer.broadcasting) {
					setTimeout(triggerFunc, timer.broadcastInterval);
				}
				$(timer).trigger("tick", [timer.elapsed(), timer.elapsedFriendly()]);
			};
			triggerFunc();
		}
	},

	stopBroadcasting: function () {
		if (this.broadcasting) {
			this.broadcasting = false;
		}
	},

	elapsed: function () {
		return this.startedAt ? new Date().getTime() - this.startedAt : 0;
	},

	elapsedFriendly: function () {
		return this.Class.formatElapsed(this.elapsed());
	}
});

$.Controller('Usablog.SessionTimerController',
	{
		startTimerUrl: ""
	},
	{
		init: function (raw_el, opts) {
			this.model = opts.model;
			var self = this;

			this.tickHandler = function () { self.onTick(); };
			$(this.model.timer).bind("tick", this.tickHandler);

			this.render();
		},

		destroy: function () {
			$(this.model.timer).unbind("tick", this.tickHandler);
		},

		"button.start-session click": function () {
			this.model.start();
		},

		"button.finish-logging click": function () {
			this.model.end();
		},

		onTick: function () {
			if (this.timeElement) {
				this.timeElement.html(this.model.timer.elapsedFriendly());
			}
		},

		render: function () {
			var controller = this;
			$.View("//scripts/usablog/timer.tmpl", { timer: this.model.timer, status: this.model.attr("status") }, function (result) {
				controller.element.html(result);
				controller.timeElement = $(controller.element).find('.current-time');
			});
		}
	});

})(jQuery);

