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
		var entry = this;
		$.ajax({
			url:this.Class.createUrl,
			type:'POST',
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(this.serialize()),
			error: function (jqXHR, textStatus, errorThrown){},
			success: function (data, textStatus, jqXHR) {
				entry.init(data);
			}
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

	init: function (raw_el, opts) {

		this.model = opts.model;
		var controller = this;
		$.View("//scripts/usablog/sessionentryform.tmpl", {}, function (result) {
			controller.element.append(result);
			controller.inputEl = $(controller.element).find("input[name=logEntry]");
		});

		$("body").bind("keypress", function (event) {
			controller.keyPressed(event);
		});
	},

	addLogEntry: function (content, timeStamp, tag) {

		var entry = new Usablog.LogEntry({ content: content, tag: tag, elapsedMillisecondsSinceSessionStart: timeStamp });
		entry.save();
		this.model.push(entry);
	},

	keyPressed: function (event) {
		if (!event.which)
			return true;

		if (event.which == 13 || event.which == 47) {
			this.ensureFocusAndCaptureTimeStamp(event.target);
			if (event.which == 47) {
				this.inputEl.val('/');
			}
		}

		return true;
	},

	"input[name=logEntry] keyup": function (el, ev) {
		if (!event.which)
			return true;
		if (event.which == 27) {
			this.timeStamp = null;
			$(el).val("").blur();
		}
	},

	ensureFocusAndCaptureTimeStamp: function (eventTarget) {
		var input = this.inputEl;
		if (input != $(eventTarget)) {
			this.timeStamp = this.timeStamp || window.timer.elapsed();
			input.focus();
		}
	},

	"form submit": function (el, ev) {
		ev.preventDefault();
		var input = this.inputEl;
		var value = input.val();
		if (value == "") {
			return;
		}

		var content = value;
		var tag = null;
		if (value[0] == "/") {
			var endOfTag = value.indexOf(" ");
			if (endOfTag < 0) {
				tag = value.substring(1, value.length);
				content = "";
			} else {
				tag = value.substring(1, endOfTag);
				content = value.substring(endOfTag + 1, value.length);
			}
		}

		if (content == "")
			return;

		this.addLogEntry(content, this.timeStamp, tag);

		this.timeStamp = null;

		input.val("").focus();
	}
});