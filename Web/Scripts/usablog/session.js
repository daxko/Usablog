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

	logEntryAdded: function(item) {
		var controller = this;
		$.View("//scripts/usablog/logentry.tmpl", item, function (result) {
			controller.log.append(result);
		});
	},

	addLogEntry: function(value, timeStamp) {
		var entry = new LogEntry({ value: value, timeStamp:timeStamp});
		
		this.logEntries.push(entry);
	}
});

$.Controller('Usablog.EntryInputController', {
	
	init:function (raw_el, opts) {

		this.model = opts.model;
		var controller = this;
		$.View("//scripts/usablog/sessionentryform.tmpl", {}, function (result) {
			controller.element.append(result);
		});
	},
	
	addLogEntry: function(value, timeStamp) {
		var entry = new Usablog.LogEntry({ value: value, timeStamp:timeStamp});
		this.model.push(entry);
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

		$(el).find("input[name=logEntry]")
			.val("")
			.focus();
	}
});