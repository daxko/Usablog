$.Model("Usablog.Finding", 
// static
{
	indexUrl: ""
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
				console.log(controller.findings);
				$.View("//scripts/usablog/sessionFindings.tmpl", { findings:controller.findings }, function (result) {
					console.log(result);
					controller.element.html(result);
				});
			}
		});
	}
});