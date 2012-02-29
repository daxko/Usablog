$.Model('Usablog.Session', {
	 
});

$.Controller('Usablog.SessionController', {
	
	init: function(raw_el, opts) {
		this.logEntries = new $.Observe.List();

		var self = this;
		this.logEntries.bind("add", function(ev, newItems) {
			for (var i in newItems)
				self.logEntryAdded(newItems[i]);
		});

		this.log = $("<ol></ol>").addClass("log");
		this.element.append(this.log);
		this.entryArea = $("<div></div>");
		this.element.append(this.entryArea);

		new Usablog.EntryInputController(this.entryArea, {model: this.logEntries});
	},

	logEntryAdded: function(entry) {
		var controller = this;
		var listItem = $("<li></li>");
		this.log.append(listItem);
		new Usablog.LogEntryController(listItem, {model:entry});
	},
	
	otherEntries: function (data) {
		for(var i in data) {
			var json = data[i];
			var entry = new Usablog.LogEntry(json);
			this.logEntries.push(entry);
		}
	}
});