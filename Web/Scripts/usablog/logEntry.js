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
	save:function () {
		$.ajax({
			url:this.Class.createUrl,
			type:'POST',
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(this.serialize()),
			error: function (jqXHR, textStatus, errorThrown){},
			success: function (data, textStatus, jqXHR){}
		});
	}
});

$.Controller('Usablog.LogEntryController', {
	init:function (raw_el, opts) {
		this.model = opts.model;
		
		var controller = this;
		$.View("//scripts/usablog/logentry.tmpl", this.model, function (result) {
			controller.element.html(result);
		});
	}
});

$.Controller('Usablog.EntryInputController', {
	
	init:function (raw_el, opts) {

		this.model = opts.model;
		var controller = this;
		$.View("//scripts/usablog/sessionentryform.tmpl", {}, function (result) {
			controller.element.append(result);
		});

		$("body").bind("keypress", function (event) {
			controller.keyPressed(event);
		});
	},
	
	addLogEntry: function(content, timeStamp) {
		var entry = new Usablog.LogEntry({ content: content, elapsedMillisecondsSinceSessionStart:timeStamp});
		entry.save();
		this.model.push(entry);
	},
	
	keyPressed:function (event) {
		if((event.which && (event.which == 13 || event.which == 47))) { //Enter key
			var input = $(this.element).find("input[name=logEntry]");
			if(input != $(event.target)) {
				this.timeStamp = window.timer.elapsed();
				input.focus();
			}
		}
		
		return true;
	},

	"form submit": function (el, ev) {
		ev.preventDefault();
		var input = $(el).find("input[name=logEntry]");
		var value = input.val();
		if(value == "")
			return;
		this.addLogEntry(value, this.timeStamp);

		this.entryTimeStamp = null;
		this.entry = null;

		input.val("").focus();
	}
});