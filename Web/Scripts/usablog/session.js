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