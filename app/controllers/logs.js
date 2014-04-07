Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	results_type: 'Balanced.Log',
	type: null,
	_limit: 20,
	endpoint: null,
	status_rollup: null,

	baseClassSelector: '#logs',

	currentEndpointFilter: null,
	statusRollupFilterSucceeded: true,
	statusRollupFilterFailed: true,

	actions: {
		setEndPointFilter: function(endpoint) {
			if (endpoint) {
				this.set('currentEndpointFilter', Balanced.Utils.toTitleCase(endpoint));
				this.set('endpoint', endpoint);
			} else {
				this.set('currentEndpointFilter', null);
				this.set('endpoint', null);
			}
		}
	},

	results_base_uri: function() {
		return Balanced.Log.create().get('uri');
	}.property(),

	extra_filtering_params: function() {
		var params = {
			'method[in]': 'post,put,delete'
		};

		var endpoint = this.get('endpoint');
		if (endpoint) {
			params.endpoint = endpoint;
		}

		var succeeded = this.get('statusRollupFilterSucceeded'),
			failed = this.get('statusRollupFilterFailed'),
			statusFilters = [];

		if (this.get('model.id') !== null) {
			params['resource_id'] = this.get('model.id');
			/*
				statusRollupFilterSucceeded and statusRollupFilterFailed
				checkboxes are not available if this log index is embedded
				in other resource page, so we need to set them to true here
			*/
			succeeded = true;
			failed = true;
		}

		if (succeeded && !failed) {
			statusFilters.push('2xx');
		}
		if (failed && !succeeded) {
			statusFilters.push('3xx', '4xx', '5xx');
		}
		if (statusFilters.length > 0) {
			params['status_rollup[in]'] = statusFilters;
		}

		return params;
	}.property('endpoint', 'statusRollupFilterSucceeded', 'statusRollupFilterFailed', 'model'),

	limit: function() {
		return this.get('is_object_log') ? 5 : this.get('_limit');
	}.property('is_object_log'),

	/*
		Whether is this log index embedded under an object controller, such as
		DebitsController
	*/
	is_object_log: function() {
		return this.get('model') !== null;
	}.property('model')
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});
