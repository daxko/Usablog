$.Model('Usablog.LogEntry', 
//static
{
	indexUrl: "",
	createUrl: "",
	
	tagsConfig: {},
	
	load: function (sessionId) {
		
	},
	
	fromInput: function (value, timeStamp) {
		
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
		
		if(content == "")
			content = tag;
		
		if(!Usablog.LogEntry.tagIsValid(tag)) {
			tag = null;
			content = value;
		}
		
		return new Usablog.LogEntry({ content:content, tag:tag, elapsedMillisecondsSinceSessionStart: timeStamp });
	},
	
	tagIsValid:function (tag) {
		return Usablog.LogEntry.tagsConfig[tag];
	},
	
	formatTag: function (tag) {
		if(tag && tag != "") {

			var info = Usablog.LogEntry.tagsConfig[tag];
			if(info)
				return info.name;
		}
		return "";
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

			controller.element.bind("selected", function (event) {
				controller.selected(event);
			});
		});
	},
	
	selected: function (event) {
		this.element.trigger("wasselected", this.model);
	}
	
});

$.Controller('Usablog.EntryInputController', {

	init: function (raw_el, opts) {

		this.model = opts.model;
		this.timer = opts.session.timer;
		this.timeStamp = opts.session.timer.elapsed();
		var controller = this;
		$.View("//scripts/usablog/sessionentryform.tmpl", {}, function (result) {
			controller.element.html(result);
			controller.inputEl = $(controller.element).find("input[name=logEntry]");
			controller.inputEl.focus();
		});
		

		this.bodyKeypressBinding = $("body").bind("keypress", function (event) {
			controller.keyPressed(event);
		});
	},

	"input[name=logEntry] keyup": function (el, ev) {
		if(this.timeStamp == null) {
			if($(el).val() != "") {
				this.timeStamp = this.timer.elapsed();
			}
		}
		
		if (!event.which)
			return true;
		if (event.which == 27) {
			this.timeStamp = null;
			this.element.trigger("inputCancelled");
		}
	},

	keyPressed: function (event) {
		if (!event.which)
			return true;
		
		if (event.which == 13 || event.which == 47) {
			this.ensureFocusAndCaptureTimeStamp(event.target);
		}

		return true;
	},

	ensureFocusAndCaptureTimeStamp: function (eventTarget) {
		var input = this.inputEl;
		if (input != $(eventTarget)) {
			this.timeStamp = this.timeStamp || this.timer.elapsed();
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
		
		if(value == "/?" || value == "?") {
			this.showTagHelp();
			return;
		}

		this.addLogEntry(value, this.timeStamp);

		this.timeStamp = null;

		input.val("").focus();
	},

	addLogEntry: function (value, timeStamp) {
		
		var entry = Usablog.LogEntry.fromInput(value, timeStamp);
		entry.save();
		this.model.push(entry);
	},
	
	showTagHelp:function () {

		$.View("//scripts/usablog/taghelp.tmpl", {config: Usablog.LogEntry.tagsConfig}, function (result) {
			var modal = $(result);

			var options = {
				hidden:function () {
					modal.remove();
				}
			};
			modal.modal(options);
		});
	}
});