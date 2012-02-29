$.Class('Usablog.Timer',
//static
{
defaults: {
	broadcastInterval: 100
}
},
//ptototype
{
init: function (options) {
	if (options instanceof Date) {
		options = {
			startedAt: options
		};
	}
	options = $.extend(true, {}, this.Class.defaults, options);

	this.broadcastInterval = options.broadcastInterval;

	if (options.startedAt) {
		this.start(options.startedAt);
	}
},

start: function (startTime) {
	if (startTime) {
		this.startedAt = startTime;
		this.startBroadcasting();
	}
},

startBroadcasting: function () {
	if (!this.broadcasting) {
		this.broadcasting = true;

		var timer = this;
		var triggerFunc = function () {
			setTimeout(triggerFunc, timer.broadcastInterval);
			$(timer).trigger("tick");
		};
		triggerFunc();
	}
},

elapsedMs: function () {
	return new Date().getTime() - this.startedAt;
},

elapsedFriendly: function () {
	var totalMs = this.elapsedMs();
	var ms = totalMs % 1000;
	var totalSecs = (totalMs - ms) / 1000;
	var secs = totalSecs % 60;
	var totalMins = (totalSecs - secs) / 60;
	var mins = totalMins % 60;
	var hours = (totalMins - mins) / 60;
	return (hours ? hours + ":" : "") + mins + ":" + secs;
}
});