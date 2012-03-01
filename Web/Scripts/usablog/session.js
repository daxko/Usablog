$.Model('Usablog.Session',
{
	startUrl: "",
	endUrl: "",
	getSessionTimeUrl: ""
},

{
	init: function () {
		$.Model.prototype.init.apply(this, arguments);
		this.timer = new Usablog.Timer();

		if (this.attr("status") === "InProgress") {
			this.initializeTimerFromServer();
		}
	},
	start: function () {
		if (this.attr("status") === "NotStarted") {
			this.attr("status", "Starting");
			var model = this;
			$.ajax({
				url: this.Class.startUrl,
				type: 'POST',
				dataType: 'json',
				success: function () {
					model.attr("status", "InProgress");
					model.initializeTimerFromServer();
				},
				error: function () {
					alert("Unable to start session. Please try again.");
					model.attr("status", "NotStarted");
				}
			});
		}
	},
	end: function () {
		if (this.attr("status") === "InProgress") {
			this.attr("status", "Ending");
			var model = this;
			$.ajax({
				url: this.Class.endUrl,
				type: 'POST',
				dataType: 'json',
				success: function () {
					model.timer.stop();
					model.attr("status", "Ended");
				},
				error: function () {
					alert("Unable to end session. Please try again.");
					model.attr("status", "InProgress");
				}
			});
		}
	},
	initializeTimerFromServer: function () {
		var model = this;
		$.ajax({
			url: this.Class.getSessionTimeUrl,
			type: 'GET',
			dataType: 'json',
			success: function (msElapsedSinceStart) {
				model.timer.start((new Date()).getTime() - msElapsedSinceStart);
			},
			error: function () {
				if (model.attr("status") === "InProgress") {
					//try again in a sec... it was just up.
					setTimeout(function () { model.initializeTimerFromServer(); }, 3000);
				}
			}
		});
	}

});

$.Controller('Usablog.SessionController', {

	init: function (raw_el, opts) {
		this.model = opts.model;
		this.logEntries = new $.Observe.List();

		var self = this;
		this.logEntries.bind("add", function (ev, newItems) {
			for (var i in newItems)
				self.logEntryAdded(newItems[i]);
		});

		$.View("//scripts/usablog/session.tmpl", {}, function (result) {
			self.element.html(result);
			self.logEl = self.element.find("ol.log");
			self.entryAreaEl = self.element.find("div.entry-area");
			self.timerEl = self.element.find("div.timer");

			new Usablog.EntryInputController(self.entryAreaEl, { model: self.logEntries, session: self.model });

			self.renderPanel();
		});


		this.model.bind("change", function (ev,attr,how,newVal,oldVal) {
			if(attr === "status")
				self.renderPanel();
		});
	},

	renderPanel: function () {
		if (this.model.attr('status') === "Ended") {
			this.renderFindings();
		}
		else {
			this.renderTimer();
		}
	},

	renderTimer: function () {
		var timerDiv = $("<div/>");
		this.timerEl.html(timerDiv);
		new Usablog.SessionTimerController(timerDiv, { model: this.model });
	},

	renderFindings: function () {
		this.timerEl.html("<h2>Findings</h2> stuff happens here.");
	},

	logEntryAdded: function (entry) {
		var listItem = $("<li></li>");
		this.logEl.append(listItem);
		new Usablog.LogEntryController(listItem, { model: entry });
	},

	otherEntries: function (data) {
		for (var i in data) {
			var json = data[i];
			var entry = new Usablog.LogEntry(json);
			this.logEntries.push(entry);
		}
	}
});