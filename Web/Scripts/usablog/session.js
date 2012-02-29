$.Model('Session', {
	 
});

$.Model('LogEntry', {
	 
});

$.Controller('SessionController', {
	
	init: function(raw_el, opts) {

		this.model = new Session(opts.modelJson);
		this.logEntries = new $.Observe.List();

		var self = this;
		this.logEntries.bind("add", function(ev, newItems) {
			for(var i in newItems)
				self.logEntryAdded(newItems[i]);
		});
		
		this.log = $("<ol></ol>").addClass("log");
		this.element.append(this.log);
		
	},

	logEntryAdded: function(item) {
		var controller = this;
		$.View("//scripts/usablog/logentry.tmpl", item, function (result) {
			controller.log.append(result);
		});
	},

	addLogEntry: function(value) {
		var entry = new LogEntry({ value: value, timeStamp:new Date()});
		
		this.logEntries.push(entry);
	}
});