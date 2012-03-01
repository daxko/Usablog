$.Observe.List('Usablog.LogEntryCollection', {
	init: function () {
		
	},
	
	addLogEntry: function (newEntry) {

		var insertPoint = this.length;
		for(var i = 0; i < this.length; i++) {
			var entry = this[i];
			if(newEntry.elapsedMillisecondsSinceSessionStart < entry.elapsedMillisecondsSinceSessionStart) {
				insertPoint = i;
				break;
			}
		}

		this.splice(insertPoint, 0, newEntry);
		
	},
	
	otherEntries: function (data) {
		for(var i in data) {
			var json = data[i];
			var entry = new Usablog.LogEntry(json);
			this.addLogEntry(entry);
		}
	},
	
	sortOldestToNewest: function (a, b) {
		if(a.elapsedMillisecondsSinceSessionStart && b.elapsedMillisecondsSinceSessionStart) {
			return a.elapsedMillisecondsSinceSessionStart - b.elapsedMillisecondsSinceSessionStart;
		}

		return 0;
	}
});