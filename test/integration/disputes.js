module('Disputes', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDisputes();

		// Pause tests for 10000ms for disputes
		// to be fully created
		Testing.pause(10000);
	},
	teardown: function() {}
});

test('exist on the activity page', function(assert) {
	var DISPUTES_ROUTE = Testing.MARKETPLACE_ROUTE + '/activity/disputes';
	var activityDisputesPage = {
		'table.disputes tbody tr:eq(0) td.date.initiated': 1,
		'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
		'table.disputes tbody tr:eq(0) td.type': 'Pending',
		'table.disputes tbody tr:eq(0) td.account': 1,
		'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
		'table.disputes tbody tr:eq(0) td.amount': '$100.00',
		'table.disputes tfoot td:eq(0)': 1
	};

	visit(DISPUTES_ROUTE)
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 1, 'Correct # of Rows');

			// Manually check the disputes uri is correct
			var activityController = Balanced.__container__.lookup('controller:activity');
			assert.equal(activityController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(activityController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes Sort is correct');
		})
		.waitFor(function() {
			var result = $('table.disputes tfoot td:eq(0)').length >= 1;

			if (!result) {
				// Reolad the page
				visit(DISPUTES_ROUTE);
				wait();
			}

			return result;
		}, 'has "Load More" disputes')
		.checkElements(activityDisputesPage, assert)
		.click('table.disputes tfoot td.load-more-results a')
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 3, 'has more disputes');
		});
});

test('can visit page', function(assert) {
	var disputePage = {
		'#content h1': 'Dispute',
		'#dispute > .main-header .title': 1, // 'Brand New Electric Guitar Rosewood Fingerboard Sunset Red',
		'#dispute .customer-info .main-header .title': 1, // 'William Henry Cavendish III (whc@example.org)',
		'#dispute .transaction-details .dispute .tt-title': 'Pending: $100.00',
		'#dispute .transaction-details .debit .tt-title': 1 // 'Succeeded: $13.30'
	};

	visit(Testing.DISPUTE_ROUTE)
		.checkElements(disputePage, assert);
});
