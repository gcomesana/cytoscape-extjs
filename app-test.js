Ext.Loader.setConfig({
	enabled:true,
	disableCaching:false
});

Ext.require('Ext.app.Application');

var Application = null;

Ext.onReady(function() {
	Application = Ext.create('Ext.app.Application', {
		name: 'HT',
		paths: {
			'HT': 'app'
		},
		requires: ['HT.lib.HypothesisRunner', 'HT.lib.Util',
			'HT.lib.EdgeRule', 'HT.lib.EdgeRuleFactory', 'HT.lib.operation.RuleOperation',
			'HT.lib.RuleFunctions', 'HT.store.CWEntries'],

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