$.Model("Usablog.Finding", 
// static
{
	indexUrl: "",
	detailsUrl: ""
}, 
//prototype
{
	
});

$.Observe.List("Usablog.FindingCollection", {
	
	init:function (jsonData) {
		for(var i in jsonData) {
			var json = jsonData[i];
			var finding = new Usablog.Finding(json);
			this.push(finding);
		}
	}
});

$.Controller("Usablog.SessionFindingsController", {
	
	init: function (raw_el, opts) {

		var controller = this;
		$.ajax({
			url:Usablog.Finding.indexUrl,
			type: 'GET',
			dataType: 'json',
			cache:false,
			success: function (data) {
				controller.findings = new Usablog.FindingCollection(data);
				controller.render();
			}
		});
	},
	
	render: function () {
		var controller = this;
		$.View("//scripts/usablog/sessionFindings.tmpl", { findings:controller.findings }, function (result) {
			controller.element.html(result);
		});
	},
	
	".finding-name click" : function (el, ev) {
		var element = $(el);

		var rawId = element.data("finding-id");
		id = rawId.replace("-", "/");
		$.ajax({
			url:Usablog.Finding.detailsUrl,
			data: {id:id},
			type: 'GET',
			dataType: 'json',
			cache:false,
			success: function (data) {
				var entriesElement = $("#" + rawId);
				
				$.View("//scripts/usablog/sessionFindingEntries.tmpl", { entries:data }, function (result) {
					entriesElement.html(result);
					entriesElement.collapse('show');
				});
			}
		});

	}
});