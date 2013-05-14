

describe('Testing stores', function () {
	var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';
	var utils, arron, ctrl;

	beforeEach (function () {
//    console.log("INIT beforeEach: "+LDA.helper.LDAConstants.LDA_ASSAY_OF_ACTIVITY);
		this.addMatchers({
			toBeSameClass: function (expected) {
				return typeof this.actual == typeof expected;
			}
		})


		/**
		 * Return the type of the passed parameter, String, Array, Object, Function,...
		 * @param obj
		 * @returns {String} the name of the javascript type
		 */
		toType = function(obj) {
			return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1]
		};

		//    console.log("EO beforeEach: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
	}); // EO beforeEach


	describe ('Getting CWEntries result', function () {
		it ('makes a query for "breast" term for targets', function () {
			expect(true).toEqual(true);
			// expect(myApp).toBeDefined();
			expect(Application).toBeDefined();
			expect(APP).toBeDefined();

			expect(APP.store.CWEntries).toBeDefined();
			var store = Ext.create('APP.store.CWEntries');
			store.proxy.extraParams = {
				'query': 'breast'
			};
			store.proxy.api.read = 'http://localhost:3003/ops_wiki_api_calls/protein_lookup.jsonp';
/*
			store.load(function (recs, op, success) {
				console.log('store loaded: '+success);

				expect(recs).toBeDefined();
				expect(recs.length).toBeGreaterThan(0);
				expect(toType(recs)).toBe('Array');
				var sndItem = recs[1];
				expect(toType(sndItem)).toBe('Object');
				expect(sndItem.uuid).not.toBeNull();

				console.log('recs.length: '+recs.length);
			})
*/
			runs(function () {
				store.load();
			}, 'asynchronous store loading');

			waitsFor(function () {
				return store.isLoading() != true

			}, 'Store loading timeout', 5000);

			runs(function () {
				var recs = store.data;

				expect(recs).toBeDefined();
				expect(recs.length).toBeGreaterThan(0);
				expect(toType(recs)).toBe('Object');
				var sndItem = recs.getAt(1);
				expect(toType(sndItem)).toBe('Object');
				expect(sndItem.uuid).not.toBeNull();

				console.log('store: recs.length: '+recs.length);

			})
		});
	});

})