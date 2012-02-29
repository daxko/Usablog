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
		this.startBroadcasting();
	},

	stop: function () {
		this.stopBroadcasting();
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

$.Controller('Usablog.TimerController',
	{
		startTimerUrl: ""
	},
	{
		init: function (raw_el, opts) {
			this.timer = opts.timer || new Usablog.Timer();

			var self = this;
			$(this.timer).bind("tick", function () { self.onTick(); });

			this.render();
		},

		"button.start-timer click": function () {
			var controller = this;
			var timer = this.timer;
			$.ajax({
				url: Usablog.Timer.startTimerUrl,
				type: 'POST',
				dataType: 'json',
				success: function () {
					timer.start();
					controller.render();
				}
			});
		},

		"button.stop-timer click": function () {
			var controller = this;
			var timer = this.timer;
			$.ajax({
				url: Usablog.Timer.stopTimerUrl,
				type: 'POST',
				dataType: 'json',
				success: function () {
					timer.stop();
					controller.render();
				}
			});
		},

		onTick: function () {
			if (this.timeElement) {
				this.timeElement.html(this.timer.elapsedFriendly());
			}
		},

		render: function () {
			var controller = this;
			$.View("//scripts/usablog/timer.tmpl", { timer: this.timer }, function (result) {
				controller.element.html(result);
				controller.timeElement = $(controller.element).find('.current-time');
			});
		}
	});

})(jQuery);

