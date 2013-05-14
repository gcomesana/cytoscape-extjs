Ext.Loader.setConfig({
	enabled:true,
	disableCaching:false
});

Ext.require('Ext.app.Application');

var Application = null;

Ext.onReady(function() {
	Application = Ext.create('Ext.app.Application', {
		name: 'APP',
		paths: {
			'APP': 'app'
		},
		requires: ['APP.lib.HypothesisRunner', 'APP.lib.Util',
			'APP.lib.EdgeRule', 'APP.lib.EdgeRuleFactory', 'APP.lib.RuleOperation',
			'APP.lib.RuleFunctions', 'APP.store.CWEntries'],

		controllers: [
			'Panels'
		],

		launch: function() {
			//include the tests in the test.html head
			jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
			jasmine.getEnv().execute();
		}
	});
});