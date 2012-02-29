$.Model('Usablog.Session', {
	 
});

$.Model('Usablog.LogEntry', 
//static
{
	indexUrl: "",
	createUrl: "",
	
	load: function (sessionId) {
		
	}
}, 
// prototype
{

});

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
		
		if(options.startedAt) {
			this.start(options.startedAt);
		}
	},
	
	start: function (startTime) {
		if(startTime) {
			this.startedAt = startTime;
			this.startBroadcasting();
		}
	},
	
	startBroadcasting: function() {
		if(!this.broadcasting) {
			this.broadcasting = true;
			
			var timer = this;
			var triggerFunc = function() {
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
		return (hours ? hours+":" : "") + mins + ":" + secs;
	}
});

$.Controller('Usablog.SessionController', {
	
	init: function(raw_el, opts) {
		this.logEntries = new $.Observe.List();

		var self = this;
		this.logEntries.bind("add", function(ev, newItems) {
			for(var i in newItems)
				self.logEntryAdded(newItems[i]);
		});
		
		this.log = $("<ol></ol>").addClass("log");
		this.entryArea = $("<div></div>");
		this.element.append(this.log);
		this.element.append(this.entryArea);

		var controller = this;
		$.View("//scripts/usablog/sessionentryform.tmpl", {}, function (result) {
			controller.entryArea.append(result);
		});
	},

	logEntryAdded: function(item) {
		var controller = this;
		$.View("//scripts/usablog/logentry.tmpl", item, function (result) {
			controller.log.append(result);
		});
	},

	addLogEntry: function(value, timeStamp) {
		var entry = new LogEntry({ value: value, timeStamp:timeStamp});
		
		this.logEntries.push(entry);
	},

	"input[name=logEntry] keyup": function (el, ev) {
		this.entryTimeStamp = this.entryTimeStamp || new Date();
		this.entry = $(ev.currentTarget).val();
	},

	"form submit": function (el, ev) {
		ev.preventDefault();
		if(!this.entry)
			return;
		
		this.addLogEntry(this.entry, this.entryTimeStamp);

		this.entryTimeStamp = null;
		this.entry = null;
	}
});