Ext.define('APP.controller.Panels', {
	extend:'Ext.app.Controller',
	requires: ['APP.lib.CytoscapeActions'],

//	stores:['Articles'],
//	models:['Article'],
//	views:['article.Grid', 'article.Preview'],
	views: ['panels.ImageList', 'panels.MainCenter', 'panels.SouthPanel',
					'panels.CytoPanel'],

	refs:[
		{
			ref:'imagelist',
			selector:'imglist'
		},
		{
			ref:'main',
			selector:'maincenter'
		},
		{
			ref:'south',
			selector:'southpanel'
		}, {
			ref: 'cytoscape',
			selector: 'cytopanel > cytoscape'
		}
	],

	init: function () {
		this.control({
			'imglist':{
				render: this.onRenderImg
			},
			'maincenter': {
				render: this.onRenderMain
			},
			'southpanel': {
				render: this.onRenderSouth
			},
			// 'cytopanel > container > container > container > button': { // buttons from entity-lookup components
			/*'cytopanel > container > entity-lookup > textbox-btn > button': {  // much better than above
				click: this.onClickButton
			},*/
			'cytopanel > container > entity-lookup > combo-lookup-btn': { // textbox-btn': {
				click: this.onClickTextbox
			},
//			'cytopanel > container > container > container > button': {
			'button#btnEnact': {
				click: this.onRunGraph
			},
			'button#btnEnactSel': {
				click: this.onRunGraph
			},
			'cytopanel > container > textbox-btn#txtBtnDisease > button': {
				click: this.onDiseaseBtnClick
			}

		});
	},

	/**
	 * Callback for the event when clicking a button in a textbox-btn component
	 * contained in a entity-lookup widget
	 * @param comp, a textbox-btn widget
	 * @param evOpts the event options
	 */
	onClickTextbox: function (comp, evOpts) {
		console.log('Panels.onClickTextBox: got value '+evOpts.value+' for '+evOpts.meta);

		var cytoscape = this.getCytoscape();
		var vis = cytoscape.vis;
		var entityWidget = comp.up();
		var shape = entityWidget.getShape().type;

		var newId = vis.nodes().length+1;
		var i = 1;
		var existsNode = vis.node(newId);
		while (existsNode != null) {
			i++;
			newId = vis.nodes().length+i;
			existsNode = vis.node(newId);
		}

		// OUR NODE definition!!!
		var nodeLabel = '';
		if (evOpts.meta == 'gene') {
			var startIndex = evOpts.label.indexOf('(');
			var endIndex = evOpts.label.indexOf(')');
			nodeLabel = evOpts.label.substring(startIndex+1, endIndex);
			var labelArray = nodeLabel.split(' ');
			nodeLabel = labelArray.join(', ');
		}
		else if (evOpts.meta == 'protein')
			nodeLabel = evOpts.label;

		var nodeOpts = {
			id: newId.toString(),
			label: nodeLabel,
			// entity: APP.lib.CytoscapeActions.shape2entity[shape], // this is a Number
			// entity: entityWidget.shape2entity[shape],
			entity: evOpts.meta,
			payloadValue: evOpts.value
		};


		var theUrl = '';
		if (evOpts.meta == "protein")
// Get Uniprot accession from label
			theUrl = "http://lady-qu.cnio.es:3003/api/target/byname/"+evOpts.label+".jsonp";

		else if (evOpts.meta == 'gene') {
			theUrl = "http://lady-qu.cnio.es:3003/api/target/by_gene.jsonp?genename=";
			var genename = nodeLabel.split(',')[0].trim();
			theUrl += genename;
		}

		else
			// APP.lib.CytoscapeActions.createNode(cytoscape.vis, nodeOpts);
			theUrl = "http://lady-qu.cnio.es:3003/api/target/byname/"+evOpts.label+".jsonp";

		Ext.data.JsonP.request({
			url: theUrl,

			callback: function (opts, resp) {
				console.log('ajax callback for uniprot info');
			},

			failure: function (resp, opts) {
				return false;
			},

			success: function (resp, opts) {
				var jsonObj = resp;
				var uniprotUrl = jsonObj.accessions[0];
				var initIdx = uniprotUrl.indexOf('>');
				var endIdx = uniprotUrl.indexOf('<', initIdx);
				var acc = uniprotUrl.substring(initIdx+1, endIdx);

				var payload = {
					uuid: evOpts.value, // when gene, here will be literal -> acc|gene id list
					acc: acc
				}
				nodeOpts.payloadValue = payload;
				APP.lib.CytoscapeActions.createNode(cytoscape.vis, nodeOpts);
			}
		}) // EO JSONP req



//		vis.addNode(20, 20, nodeOpts);
	},


	onRunGraph: function (comp, evOpts) {
		console.log('Panels.onRunGraph: got value '+evOpts.value+' for '+evOpts.meta);
		var btnId = comp.getId();
		var cytoscape = this.getCytoscape();
		var vis = cytoscape.vis;
		var edges, nodes;

		if (btnId == 'btnEnact') { // for the whole graph
			var nm = vis.networkModel();
			edges = nm.data.edges; // should be an array
			nodes = nm.data.nodes;
		}
		else if (btnId == 'btnEnactSel') { // only for selected nodes (a subgraph)
			var selNodeModel, selEdgeModel;
			selNodeModel = Ext.Array.map(cytoscape.nodesSelectionModel, function (item) {
				return item.data;
			});

			selEdgeModel = Ext.Array.map(cytoscape.edgesSelectionModel, function (edge) {
				return edge.data;
			});

			var nm = vis.networkModel();
			nodes = selNodeModel;
			edges = selEdgeModel; // nm.data.edges;
		}
		// functionEvent = APP.lib.RuleFunctions.getFunctionFromAlias(alias)
		// functionEvent.addListener('operationComplete', this.onOperationComplete, this)
		APP.lib.CytoscapeActions.runGraph(vis, nodes, edges);
	},



	onDiseaseBtnClick: function (c, ev) {
		var container = c.ownerCt;
		var textbox = container.down('textfield');
		var disease = textbox.getValue();

		var cytoscape = this.getCytoscape();
		APP.lib.CytoscapeActions.createNode(cytoscape.vis, disease);
	},

	onRenderImg: function (c) {
	},

	onRenderMain: function (c) {
	},

	onRenderSouth: function (c) {
	}
})
