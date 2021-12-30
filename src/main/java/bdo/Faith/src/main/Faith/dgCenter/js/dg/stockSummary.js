/**
 *
 */
var StockSummary = (agrs) => {
	let _template
		,_data
		, mount
		, listener
	_data = agrs.data;
	_template = agrs.template || tplLoader('dgCenter/html/dg/stockSummary.html');
	agrs.template = _template;
	$('#headtitle').empty().text(agrs.data.text);
	let initStockSummary = function() {
		var stockSummary_view_count = 1;
		var stockSummary_view = {
			localParam: {
				tabNum: false,
				url: 'dgCenter/DgPaper.getStockSummaryList.json',
				urlparam: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					sqlId: 'DG10012',
					param1: _data.extraOptions.customerId,
					param2: _data.extraOptions.projectId,
					param3: _data.extraOptions.parentId
				}
			},
			tableParam: {
				select: true,
				// pageLength: 30,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				ordering: false,
				serverSide: true,
				//fixedThead: true,
				//fixedHeight: '500px',
				columnDefs: [/*{
						targets: stockSummary_view_count++,
						className: 'text-left',
						title: '存货一级科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					},*/ {
						targets: stockSummary_view_count++,
						className: 'text-left',
						title: '存货一级科目名称',
						name: 'subjectName',
						data: 'subjectName',
						width: '100px'
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '借方发生额',
						name: 'debitOcc',
						data: 'debitOcc',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '贷方发生额',
						name: 'creditOcc',
						data: 'creditOcc',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '客户调整借',
						name: 'debitOccCus',
						data: 'debitOccCus',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '客户调整贷',
						name: 'creditOccCus',
						data: 'creditOccCus',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '审计调整借',
						name: 'debitOccAudit',
						data: 'debitOccAudit',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '审计调整贷',
						name: 'creditOccAudit',
						data: 'creditOccAudit',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: stockSummary_view_count++,
						className: 'text-right',
						title: '审定金额',
						name: 'auditAmount',
						data: 'auditAmount',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}
				]
			}
		};
		BdoDataTable('dgStockSummaryTable', stockSummary_view);
		// 一览列表导出
		$('#btn_dgStock_export').click(function() {
			exportExcel(this, '存货汇总表', stockSummary_view, 'dgStockSummaryTable');
		});
	};
	mount = () => {
		$(agrs.region).empty().append(_template);
		initStockSummary();
		OneUI.initHelper('slimscroll');
	};

	mount();

};