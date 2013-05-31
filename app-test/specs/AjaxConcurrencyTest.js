

describe('Getting rule object', function () {
	var conceptwiki_uri_mock = 'http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8';
	var utils, arron, ctrl;

	beforeEach (function () {
//    console.log("INIT beforeEach: "+LDA.helper.LDAConstants.LDA_ASSAY_OF_ACTIVITY);
		this.addMatchers({
			toBeSameClass: function (expected) {
				return typeof this.actual == typeof expected;
			}
		})

		toType = function(obj) {
			return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1]
		};

		//    console.log("EO beforeEach: "+TDGUI.util.LDAConstants.LDA_COMPOUND_PHARMACOLOGY_COUNT);
	}); // EO beforeEach


	describe ('Getting rule functions', function () {
		it ('makes a tautology test and definition for myApp TDGUI', function () {
			expect(true).toEqual(true);
			// expect(myApp).toBeDefined();
			expect(Application).toBeDefined();
			expect(HT).toBeDefined();

			expect(HT.lib.RuleFunctions).toBeDefined();

		});

		it ('should respond a static test from RuleFunctions.js', function () {
			var test = HT.lib.RuleFunctions.test();
			expect(test).not.toBeNull();
			expect(test.length).not.toBe(0);
		});


		it ('should make simultaneous ajax calls', function () {
			var accs = 'Q96BI1,Q9BX63,P38398,P42336,O60934,O96017,P51587,Q06609,O43542,P31749,Q86YC2';
			accs = "Q8N608,Q8N138,Q9BZ11,Q13093,Q8TAX7"; // asthma
			accs = 'Q8N608,Q13093,P36222,Q9BZ11,Q9Y616,Q8TAX7,Q6W5P4,Q8N138,Q13258,Q9UL17';

			var accs_arr = accs.split(',');
			var numReqs = accs_arr.length;
			var countReqs = 0;
			var data = [];
			var cmpdChemblId = 'CHEMBL786';
			cmpdChemblId = 'CHEMBL714'; // salbutamol

			// with the accessions for the disease and the compounds for each assay,
			// we have to see whether or not the compound is in the assays
			//
			var action = function () {
				// hold here the accessions found with assays for the compound
				var accessions4cmpd = [];
				Ext.each(data, function (compoundsAcc, index, dataItself) {
					if (compoundsAcc.compounds.indexOf(cmpdChemblId) != -1)
						accessions4cmpd.push({'acc': compoundsAcc.acc});
				})
				// it is suppossed that if accessions4cmpd is empty,
				// there is not connectin btw accessions and compound
				return accessions4cmpd;

				// actually should trigger an event to set the end of the operation
			}

			Ext.each(accs_arr, function (acc, index, accessions) {
				var url = 'http://lady-qu.cnio.es:3003/pharma/xxxx/bioactivities.jsonp';
				url = url.replace('xxxx', acc);
				// get activities for every accession
				Ext.data.JsonP.request({
					url: url,

					failure: function (resp, opts) {
						funcObj.result = -1;
					},

					success: function (resp, opts) {
						var jsonObj = resp;
						var ingredientsChembl = [];

						if (jsonObj != null) {
							Ext.each (jsonObj.activities, function (actv, index, activities) {
								ingredientsChembl.push(actv.ingredient_cmpd_chemblid);
							});
							data.push({'acc': jsonObj.accession, 'compounds': ingredientsChembl});
						}

						countReqs++;
						if (countReqs == numReqs)
							action();

						/*
						funcObj.result = result;
						var hypothesiseResult = result !== false;

						var edgeId = 'e' + edgeSrc.id + '-' + edgeTrg.id;
						console.log('Operation finished!!!: ' + funcObj.result + ' for ' + edgeId);

						me.fireEvent('operationComplete', {result: funcObj.result, hypothesis: hypothesiseResult, edgeId: edgeId});
						*/
					}

					// scope: me
				})

			})




		})

	});

});