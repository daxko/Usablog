﻿$.Model("Usablog.Finding", 
// static
{
	indexUrl: "",
	detailsUrl: "",
	createUrl: "",
	addEntryUrl: ""
}, 
//prototype
{
	save:function () {
		var finding = this;
		$.ajax({
			url:this.Class.createUrl,
			type:'POST',
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(this.serialize()),
			error: function (jqXHR, textStatus, errorThrown){},
			success: function (data, textStatus, jqXHR) {
				finding.init(data);
			}
		});
	}
});

$.Controller("Usablog.SessionFindingsController", {
	
	init: function (raw_el, opts) {

		this.studyId = opts.studyId;
		this.selectedEntries = opts.selectedEntries;
		
		var controller = this;
		$.ajax({
			url:Usablog.Finding.indexUrl,
			type: 'GET',
			dataType: 'json',
			cache:false,
			success: function (data) {
				controller.findings = new $.Observe.List();
				
				controller.findings.bind("add", function (ev, newItems) {
					for (var i in newItems)
						controller.findingAdded(newItems[i]);
				});

				controller.render(data);
			}
		});
	},
	
	findingAdded: function(finding) {
		var findingElement = $("<div></div>");

		this.element.append(findingElement);
		new Usablog.SessionFindingController(findingElement, { model: finding, selectedEntries: this.selectedEntries });
	},
	
	render: function (data) {
		var controller = this;
		$.View("//scripts/usablog/sessionFindings.tmpl", { findings:controller.findings }, function (result) {
			controller.element.html(result);
			
			for(var i in data) {
				var json = data[i];
				var finding = new Usablog.Finding(json);
				controller.findings.push(finding);
			}
		});
	},
	
	"form submit": function (el, ev) {
		ev.preventDefault();
		var input = $("input[name=findingEntry]", $(el));
		var name = input.val();
		var studyId = this.studyId;

		var finding = new Usablog.Finding({name:name, studyId:studyId });
		finding.save();

		this.findings.push(finding);

		input.val("");
	}
});

$.Controller("Usablog.SessionFindingController", {
	init:function (raw_el, opts) {

		this.model = opts.model;
		this.selectedEntries = opts.selectedEntries;
		
		var controller = this;
		this.element.addClass("accordion-group");
		$.View("//scripts/usablog/sessionFinding.tmpl", this.model, function (result) {
			controller.element.html(result);
		});
	},
	
	".add-selected-entries click": function (el, ev) {
		ev.preventDefault();
		
		for(var i in this.selectedEntries) {
			var entry = this.selectedEntries[i];
			
			// add to the finding on the server
			$.ajax({
				url:Usablog.Finding.addEntryUrl,
				type:'POST',
				dataType:'json',
				contentType:'application/json',
				data: JSON.stringify({id:this.model.id, logEntryId: entry.id}),
				error: function (jqXHR, textStatus, errorThrown){},
				success: function (data, textStatus, jqXHR) {
					
				}
			});
			
			// add to the DOM (show me)
			
		}
	},
	
	".finding-name click" : function (el, ev) {
		var controller = this;
		var element = $(el);
		var entriesElement = $(".finding-entries", this.element);

		if(controller.shown) {
			entriesElement.collapse('hide');
			controller.shown = false;
			return;
		}
		
		id = this.model.id;
		$.ajax({
			url:Usablog.Finding.detailsUrl,
			data: {id:id},
			type: 'GET',
			dataType: 'json',
			cache:false,
			success: function (data) {
				
				$.View("//scripts/usablog/sessionFindingEntries.tmpl", { entries:data }, function (result) {
					entriesElement.html(result);
					entriesElement.collapse('show');
					controller.shown = true;
				});
			}
		});
	}
});