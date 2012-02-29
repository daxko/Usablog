$.Model('Session', {
	 
});

$.Controller('SessionController', {
	init: function(raw_el, opts) {

		this.model = new Session(opts.modelJson);
		this.logEntries = new $.Observe.List();

		var self = this;
		this.logEntries.bind("add", function(ev, newItems) {
			for(var i in newItems)
				self.itemAdded(newItems[i]);
		});
	},

	itemAdded: function(item) {

		var controller = this;
		$.View("//scripts/usablog/session.tmpl", item, function (result) {
			controller.element.append(result);
		});
		
//		var html = $("<div/>");
//		html.html(item.value);
//		this.element.append(html);
	},

	addItem: function() {
		this.logEntries.push({ value: 'foo'});
	}
});