$.Model('Session', {
	 
});

$.Controller('SessionController', {
	init: function (raw_el, opts) {

		this.model = new Session(opts.modelJson);
	}
});