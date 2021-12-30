BbReport = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/bbReport.html');
	agrs.template = _template;
	let projectYear = agrs.data.projectYear;
	let bbEditerId;
	let bbReportId = '';
	let checkNum = 0;
	var initbbTable = function() {
		let bb_table_view = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'DG20001',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				order: [2, 'ASC'],
				pageLength: 30,
				ordering: false,
				serverSide: true,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-center',
						title: '处理',
						width: '60px',
						render: function(data, type, row, meta) {
							var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
							//renderStr += '<button class="btn btn-xs btn-warning" type="button" name="templateUpload" data-placement="top" title="上传报备单模版" data-toggle="tooltip"><i class="fa fa-check"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateEdit" id="templateEdit" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateDownload" id="templateDelete" data-placement="top" title="下载" data-toggle="tooltip"><i class="si si-cloud-download"></i></button>&nbsp;';
							return renderStr;
						}
					}, {
						targets: 2,
						className: 'text-center',
						title: '模板类型',
						name: 'ruleTypeName',
						data: 'ruleTypeName',
						width: '50px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '模板名称',
						name: 'ruleName',
						data: 'ruleName',
						width: '80px'
					}, {
						targets: 4,
						className: 'text-center',
						title: '描述',
						name: 'remark',
						data: 'remark',
						width: '100px'
					}, {
						targets: 5,
						className: 'text-center',
						title: '是否必须',
						name: 'must',
						data: 'must',
						width: '40px'
					}, {
						targets: 6,
						className: 'text-center',
						title: '校验不通过数',
						name: 'checkNum',
						data: 'checkNum',
						width: '60px'
					}, {
						targets: 7,
						className: 'text-center',
						title: '报告类型',
						name: 'reportType',
						data: 'reportType',
						width: '50px'
					}, {
						targets: 8,
						className: 'text-center',
						title: '报备单模版',
						name: 'fileName',
						data: 'fileName',
						width: '80px'
					}
				]
			}
		};
		BdoDataTable('bb_table', bb_table_view);
	};

	mount = () => {
		$(agrs.region).empty().append(_template);
		// listener();
		//initFunc();
		initbbTable();
		setTbeEditerSelect();
		//$('#reviewIndex').text('【' + agrs.type + '】');//添加索引号
		// AuditProgramPagePlan({region: '#subjectPlanPageTab', data: agrs.data});
		//EditProgramPage({region: '#editProgramPageTab', data: agrs.data});
		OneUI.initHelper('slimscroll');
	};

	mount();
	
	function setTbeEditerSelect(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getProjectMember.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let tbEditer = '<option value="" label="" />';
					data.data.map(item => {
						if (bbEditerId ==  item.id) {
							tbEditer+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" selected />';
						}else {
							tbEditer+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" />';
						}
						// return {id: item.id, text: item.name, value: item.name};
					});
					$('#bb_editer').append(tbEditer);
				}else {
					$('#bb_editer').val('');
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}
	$('#bb_editer').change(function () {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgBBReport.saveBbEditer.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param2: '1',
				param3: $(this).val(),
				param4: $(this).find('option:selected').attr('label')
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox("保存报备编制人成功！");
					// $('#tb_editer').append(tbEditer);
				}else {
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	});
	//查询报备报表
	$('#bb_table').on('click', 'button[name="templateEdit"]', function() {
		var object = $('#bb_table').DataTable().data()[$(this).closest('tr').index()];
		initBbReport(object.autoId,"1");
		bbReportId = object.autoId;
		bbReportTabDetail.click();
		//$('#bbReport_modal').modal('show');
	});
	//查询报备报表
	var initBbReport = function(autoId,type) {
		if(autoId == null || autoId == ''){
			bdoInfoBox('提示', '请先选择模板');
			return;
		}
		bdoInProcessingBox('处理中');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgBBReport.queryBbReport.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: autoId,
				param2: type
			},
			dataType: 'json',
			success(data) {
				if (data && data.success) {
					bdoSuccessBox('成功');
					if(data.data != null){
						destroyTable('zc_bbreport_table');
						destroyTable('lr_bbreport_table');
						destroyTable('xj_bbreport_table');
						destroyTable('qy1_bbreport_table');
						destroyTable('qy2_bbreport_table');
						destroyTable('zc_bbcheck_table');
						destroyTable('lr_bbcheck_table');
						destroyTable('xj_bbcheck_table');
						destroyTable('qy1_bbcheck_table');
						destroyTable('qy2_bbcheck_table');
						destroyTable('hbzc_bbreport_table');
						destroyTable('hblr_bbreport_table');
						destroyTable('hbxj_bbreport_table');
						destroyTable('hbqy1_bbreport_table');
						destroyTable('hbqy2_bbreport_table');
						destroyTable('hbzc_bbcheck_table');
						destroyTable('hblr_bbcheck_table');
						destroyTable('hbxj_bbcheck_table');
						destroyTable('hbqy1_bbcheck_table');
						destroyTable('hbqy2_bbcheck_table');
						var mergeType = '0';
						if(data.data.length > 0){
							mergeType = data.data[0].mergeType;
						}
						if(mergeType == '1'){
							$(".hbShow").css('display', 'block');
						}else{
							$(".hbShow").css('display', 'none');
						}
						checkNum = 0;
						setCheckColumnDefs(data.data[i],bbCheckTableCfg,1);
						bbCheckTableCfg.localParam.urlparam.param1 = autoId;
						BdoDataTable('bbcheck_table', bbCheckTableCfg);
						for(var i = 0;i < data.data.length;i++){
							if(data.data[i]['tableType'] == '1'){
								bbReportZcTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportZcTableCfg,3);
								bbReportZcTableCfg.localParam.urlparam.param3 = autoId;
								bbReportZcTableCfg.localParam.urlparam.param4 = '1';
								BdoDataTable('zc_bbreport_table', bbReportZcTableCfg);
								/*bbCheckZcTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckZcTableCfg,1);
								bbCheckZcTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckZcTableCfg.localParam.urlparam.param2 = '1';
								BdoDataTable('zc_bbcheck_table', bbCheckZcTableCfg);*/
							}else if(data.data[i]['tableType'] == '3'){
								bbReportLrTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportLrTableCfg,3);
								bbReportLrTableCfg.localParam.urlparam.param3 = autoId;
								bbReportLrTableCfg.localParam.urlparam.param4 = '3';
								BdoDataTable('lr_bbreport_table', bbReportLrTableCfg);
								/*bbCheckLrTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckLrTableCfg,1);
								bbCheckLrTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckLrTableCfg.localParam.urlparam.param2 = '3';
								BdoDataTable('lr_bbcheck_table', bbCheckLrTableCfg);*/
							}else if(data.data[i]['tableType'] == '4'){
								bbReportXjTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportXjTableCfg,3);
								bbReportXjTableCfg.localParam.urlparam.param3 = autoId;
								bbReportXjTableCfg.localParam.urlparam.param4 = '4';
								BdoDataTable('xj_bbreport_table', bbReportXjTableCfg);
								/*bbCheckXjTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckXjTableCfg,1);
								bbCheckXjTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckXjTableCfg.localParam.urlparam.param2 = '4';
								BdoDataTable('xj_bbcheck_table', bbCheckXjTableCfg);*/
							}else if(data.data[i]['tableType'] == '5'){
								bbReportQy1TableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportQy1TableCfg,2);
								bbReportQy1TableCfg.localParam.urlparam.param3 = autoId;
								bbReportQy1TableCfg.localParam.urlparam.param4 = '5';
								//bbReportQy1TableCfg.tableParam.fixedColumns = {leftColumns: 3};
								BdoDataTable('qy1_bbreport_table', bbReportQy1TableCfg);
								/*bbCheckQy1TableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckQy1TableCfg,1);
								bbCheckQy1TableCfg.localParam.urlparam.param1 = autoId;
								bbCheckQy1TableCfg.localParam.urlparam.param2 = '5';
								BdoDataTable('qy1_bbcheck_table', bbCheckQy1TableCfg);*/
							}else if(data.data[i]['tableType'] == '6'){
								bbReportQy2TableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportQy2TableCfg,2);
								bbReportQy2TableCfg.localParam.urlparam.param3 = autoId;
								bbReportQy2TableCfg.localParam.urlparam.param4 = '6';
								//bbReportQy2TableCfg.tableParam.fixedColumns = {leftColumns: 3};
								BdoDataTable('qy2_bbreport_table', bbReportQy2TableCfg);
								/*bbCheckQy2TableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckQy2TableCfg,1);
								bbCheckQy2TableCfg.localParam.urlparam.param1 = autoId;
								bbCheckQy2TableCfg.localParam.urlparam.param2 = '6';
								BdoDataTable('qy2_bbcheck_table', bbCheckQy2TableCfg);*/
							}else if(data.data[i]['tableType'] == '7'){
								bbReportHbZcTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportHbZcTableCfg,3);
								bbReportHbZcTableCfg.localParam.urlparam.param3 = autoId;
								bbReportHbZcTableCfg.localParam.urlparam.param4 = '7';
								BdoDataTable('hbzc_bbreport_table', bbReportHbZcTableCfg);
								/*bbCheckHbZcTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckHbZcTableCfg,1);
								bbCheckHbZcTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckHbZcTableCfg.localParam.urlparam.param2 = '7';
								BdoDataTable('hbzc_bbcheck_table', bbCheckHbZcTableCfg);*/
							}else if(data.data[i]['tableType'] == '9'){
								bbReportHbLrTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportHbLrTableCfg,3);
								bbReportHbLrTableCfg.localParam.urlparam.param3 = autoId;
								bbReportHbLrTableCfg.localParam.urlparam.param4 = '9';
								BdoDataTable('hblr_bbreport_table', bbReportHbLrTableCfg);
								/*bbCheckHbLrTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckHbLrTableCfg,1);
								bbCheckHbLrTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckHbLrTableCfg.localParam.urlparam.param2 = '9';
								BdoDataTable('hblr_bbcheck_table', bbCheckHbLrTableCfg);*/
							}else if(data.data[i]['tableType'] == '10'){
								bbReportHbXjTableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportHbXjTableCfg,3);
								bbReportHbXjTableCfg.localParam.urlparam.param3 = autoId;
								bbReportHbXjTableCfg.localParam.urlparam.param4 = '10';
								BdoDataTable('hbxj_bbreport_table', bbReportHbXjTableCfg);
								/*bbCheckHbXjTableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckHbXjTableCfg,1);
								bbCheckHbXjTableCfg.localParam.urlparam.param1 = autoId;
								bbCheckHbXjTableCfg.localParam.urlparam.param2 = '10';
								BdoDataTable('hbxj_bbcheck_table', bbCheckHbXjTableCfg);*/
							}else if(data.data[i]['tableType'] == '11'){
								bbReportHbQy1TableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportHbQy1TableCfg,2);
								bbReportHbQy1TableCfg.localParam.urlparam.param3 = autoId;
								bbReportHbQy1TableCfg.localParam.urlparam.param4 = '11';
								//bbReportHbQy1TableCfg.tableParam.fixedColumns = {leftColumns: 3};
								BdoDataTable('hbqy1_bbreport_table', bbReportHbQy1TableCfg);
								/*bbCheckHbQy1TableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckHbQy1TableCfg,1);
								bbCheckHbQy1TableCfg.localParam.urlparam.param1 = autoId;
								bbCheckHbQy1TableCfg.localParam.urlparam.param2 = '11';
								BdoDataTable('hbqy1_bbcheck_table', bbCheckHbQy1TableCfg);*/
							}else if(data.data[i]['tableType'] == '12'){
								bbReportHbQy2TableCfg = $.extend(true, {}, bbReportTableCfg);
								setColumnDefs(data.data[i],bbReportHbQy2TableCfg,2);
								bbReportHbQy2TableCfg.localParam.urlparam.param3 = autoId;
								bbReportHbQy2TableCfg.localParam.urlparam.param4 = '12';
								//bbReportHbQy2TableCfg.tableParam.fixedColumns = {leftColumns: 3};
								BdoDataTable('hbqy2_bbreport_table', bbReportHbQy2TableCfg);
								/*bbCheckHbQy2TableCfg = $.extend(true, {}, bbCheckTableCfg);
								setCheckColumnDefs(data.data[i],bbCheckHbQy2TableCfg,1);
								bbCheckHbQy2TableCfg.localParam.urlparam.param1 = autoId;
								bbCheckHbQy2TableCfg.localParam.urlparam.param2 = '12';
								BdoDataTable('hbqy2_bbcheck_table', bbCheckHbQy2TableCfg);*/
							}
						}
					}
					
				}else {
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}
	var bbReportZcTableCfg = {};
	var bbReportLrTableCfg = {};
	var bbReportXjTableCfg = {};
	var bbReportQy1TableCfg = {};
	var bbReportQy2TableCfg = {};
	var bbReportHbZcTableCfg = {};
	var bbReportHbLrTableCfg = {};
	var bbReportHbXjTableCfg = {};
	var bbReportHbQy1TableCfg = {};
	var bbReportHbQy2TableCfg = {};
	var bbReportTableCfg = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG20003',
				start: -1,
				limit: -1,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: '',
				param4: ''

			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',//
			ordering: false,
			serverSide: true,
			scrollY: true,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				for(var i = 3;i < 18;i++){
					$(row).find('td:eq('+i+')').addClass('bg-success-light');
				}
				/*$(row).find('td:eq(2)').addClass('bg-success-light');
				$(row).find('td:eq(3)').addClass('bg-success-light');*/
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '科目代码',
					name: 'bbSubjectId',
					data: 'bbSubjectId',
					width: '100px'
				}, {
					targets: 2,
					orderable: true,
					className: 'text-left',
					title: '科目名称',
					name: 'bbSubjectNameDisp',
					data: 'bbSubjectNameDisp',
					width: '400px',
					render: function(data, type, row, meta){
						if (data != null){
							if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
								return '<b>' + data + '</b>';
							}else{
								return data.replace(' ','&nbsp;&nbsp;');
							}
						}
					}
				}/*, {
					targets: 3,
					orderable: false,
					className: 'text-right',
					title: '本期',
					name: 'column1',
					data: 'column1',
					width: '100px'

				}, {
					targets: 4,
					orderable: false,
					className: 'text-right',
					title: '上期',
					name: 'column2',
					data: 'column2',
					width: '100px'

				}*/
			]
		}
	};
	var bbCheckZcTableCfg = {};
	var bbCheckLrTableCfg = {};
	var bbCheckXjTableCfg = {};
	var bbCheckQy1TableCfg = {};
	var bbCheckQy2TableCfg = {};
	var bbCheckHbZcTableCfg = {};
	var bbCheckHbLrTableCfg = {};
	var bbCheckHbXjTableCfg = {};
	var bbCheckHbQy1TableCfg = {};
	var bbCheckHbQy2TableCfg = {};
	var bbCheckTableCfg = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/DgBBReport.queryBbReportCheck.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: '',
				param2: '',
			}
		},
		tableParam: {
			select: true,
			//lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',//
			ordering: true,
			serverSide: true,
			//scrollX: true,
			scrollY: false,
			createdRow(row, data, dataIndex) {
				if(data.column1 == 0 && data.column2 == 0){
					
				}else{
					checkNum = checkNum + 1;
				}
			},
			infoCallback(settings) {
				$('#checkNum').html('不通过数量：' + checkNum);
			},
			columnDefs: [
				/*{
					targets: 1,
					orderable: false,
					className: 'text-left width-je',
					title: '校验公式',
					name: 'checkCalFun',
					data: 'checkCalFun',
					width: '100px'
				}*/
			]
		}
	};
	/** 设置table */
	function setColumnDefs(data,table_view,count){
		table_view.tableParam.columnDefs.push({
			targets: count,
			orderable: false,
			className: 'text-center width-je',
			title: '附注',
			name: 'note',
			data: 'note'
		});
		for (var j = 1; j < 16; j++) {
			if(data['columnDesc' + j] != null){
				table_view.tableParam.columnDefs.push({
					targets: j + count,
					orderable: false,
					className: 'text-right width-je',
					title: data['columnDesc' + j],
					name: 'column' + j,
					data: 'column' + j,
					render: function (data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}else{
							return data;
						}
					}
				});
			}
		}
	}
	/** 设置table */
	function setCheckColumnDefs(data,table_view,count){
		table_view.tableParam.columnDefs.push({
			targets: 1,
			orderable: false,
			className: 'text-left width-line-break',
			title: '校验公式',
			name: 'bbCheckFunName',
			data: 'bbCheckFunName',
			width: '500px'
		});
		table_view.tableParam.columnDefs.push({
			targets: 2,
			orderable: false,
			className: 'text-right',
			title: '本期',
			name: 'column1',
			data: 'column1',
			width: '120px',
			render: function(data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		table_view.tableParam.columnDefs.push({
			targets: 3,
			orderable: false,
			className: 'text-right',
			title: '上期',
			name: 'column2',
			data: 'column2',
			width: '120px',
			render: function(data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		/*for (var j = 1; j < 16; j++) {
			if(data['columnDesc' + j] != null){
				table_view.tableParam.columnDefs.push({
					targets: j + count,
					orderable: false,
					className: 'text-right',
					title: data['columnDesc' + j],
					name: 'column' + j,
					data: 'column' + j,
					width: '120px',
					render: function(data, type, row, meta) {
						if (data == 0) {
							return '<div width="100%" style="text-align: center">平<div>';
						} else if (data != null) {
							return formatMoney(data);
						}
					}
				});
			}
		}*/
	}
	
	/** 单元格双击事件 */
	$('#tab_bbReport').on('dblclick', 'table tbody tr.edit-able td', function() {

		var colType = '';
		if ($(this).hasClass('bg-success-light')) {
			colType = 1;
		} else if ($(this).hasClass('bg-gray-light')) {
			colType = 2;
		} else if ($(this).hasClass('bg-gray-lighter')) {
			colType = 3;
		} else {
			return;
		}

		var td = $(this).closest('td');
		var key = td.parent().index();
		var $table = td.closest('table');
		//if ($table.attr('id').indexOf('qy_report') >= 0) return;
		var trL = $table.find('tr').length;
		//var index = checkTab($table);
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		var dif = td.next();
		var dfAm = dif.text();
		var dl = td.prev();
		var dlAm = dl.text();
		for (var i = 0; i < dlAm.length / 3; i++) {
			dlAm = dlAm.replace(',', '');
		}
		for (var i = 0; i < dfAm.length / 3; i++) {
			dfAm = dfAm.replace(',', '');
		}

		if (colType == 3 || colType == 1) {
			/** 双击客户报表数字列可编辑 */
			if (th.name.indexOf('column') >= 0 || th.name.indexOf('note') >= 0) {

				var oldVal = data[th.name];
				td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
				var input = $(this).find('input');
				//if (oldVal != 0) {
					input.val(oldVal);
				//}
				input.focus();
				input.on('keydown', function(e) {
					if (e.keyCode == 13) {
						//console.log(e);
						input.blur();
					}
				});
				input.on('blur', function() {
					var newVal = $(this).val().toString().replace(/,/g, '');

					function cvs(num) {
						var num = num.toFixed(2);
						var int = num.split('.')[0];
						var float = num.split('.')[1];
						var _number = int.toString().replace(/,/g, '');        // 数字转成字符串
						var result = '';            // 转换后的字符串
						var counter = '';
						for (var i = _number.length - 1; i >= 0; i--) {
							counter++;
							result = _number.charAt(i) + result;
							if (!(counter % 3) && i != 0) {
								result = ',' + result;
							}
						}
						if (int > 0) {
							return '-' + result + '.' + float;
						} else {
							var result = result.replace('-', '');
							if (result[0] == ',') {
								result = result.replace(',', '');
							}
							return result + '.' + float;
						}
					}

					if (newVal === '') {
						td.html('');
					} else if (isNaN(newVal)) {
						if(th.name.indexOf('note') >= 0){
							td.html(newVal);
						}else{
							td.html(oldVal);
						}
					} else {
						var num = newVal * 1;
						td.html(num.toFixed(2));
					}
					if (td.html() !== data[th.name]) {
						data[th.name] = td.html();
						// 修改标记
						data['isEdit'] = 1;
						if(th.name.indexOf('note') >= 0){
							bbReport_save();
						}else{
							let updateSubjectId = [];
							updateSubjectId.push(data['bbSubjectId']);
							var count = 0;
							do {
								let temp1 = [];
								for(var i=0;i<updateSubjectId.length;i++){
									let temp2 = calTable($table,updateSubjectId[i],th.name,td.index());
									temp1.push.apply(temp1,temp2);
								}
								updateSubjectId = temp1;
								count ++;
							}
							while(updateSubjectId.length >= 0 && count < 5){
								bbReport_save();
							}
						}
					}
				});

			}
		}

	});
	//保存
	//$('#bbReport_save').on('click', function() {
	function bbReport_save() {
		if(bbReportId == null || bbReportId == ''){
			bdoInfoBox('提示', '请先选择模板');
			return;
		}
		var object1 = [];
		if ($('#zc_bbreport_table').hasClass('dataTable')) {
			var len1 = $('#zc_bbreport_table').DataTable().data().length;
			for(var i=0;i<len1;i++){
				let obj = $('#zc_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#zc_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#lr_bbreport_table').hasClass('dataTable')) {
			var len2 = $('#lr_bbreport_table').DataTable().data().length;
			for(var i=0;i<len2;i++){
				let obj = $('#lr_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#lr_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#xj_bbreport_table').hasClass('dataTable')) {
			var len3 = $('#xj_bbreport_table').DataTable().data().length;
			for(var i=0;i<len3;i++){
				let obj = $('#xj_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#xj_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#qy1_bbreport_table').hasClass('dataTable')) {
			var len4 = $('#qy1_bbreport_table').DataTable().data().length;
			for(var i=0;i<len4;i++){
				let obj = $('#qy1_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#qy1_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#qy2_bbreport_table').hasClass('dataTable')) {
			var len5 = $('#qy2_bbreport_table').DataTable().data().length;
			for(var i=0;i<len5;i++){
				let obj = $('#qy2_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#qy2_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#hbzc_bbreport_table').hasClass('dataTable')) {
			var len6 = $('#hbzc_bbreport_table').DataTable().data().length;
			for(var i=0;i<len6;i++){
				let obj = $('#hbzc_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#hbzc_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#hblr_bbreport_table').hasClass('dataTable')) {
			var len7 = $('#hblr_bbreport_table').DataTable().data().length;
			for(var i=0;i<len7;i++){
				let obj = $('#hblr_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#hblr_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#hbxj_bbreport_table').hasClass('dataTable')) {
			var len8 = $('#hbxj_bbreport_table').DataTable().data().length;
			for(var i=0;i<len8;i++){
				let obj = $('#hbxj_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#hbxj_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#hbqy1_bbreport_table').hasClass('dataTable')) {
			var len9 = $('#hbqy1_bbreport_table').DataTable().data().length;
			for(var i=0;i<len9;i++){
				let obj = $('#hbqy1_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#hbqy1_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		if ($('#hbqy2_bbreport_table').hasClass('dataTable')) {
			var len10 = $('#hbqy2_bbreport_table').DataTable().data().length;
			for(var i=0;i<len10;i++){
				let obj = $('#hbqy2_bbreport_table').DataTable().data()[i];
				if(obj.isEdit && obj.isEdit == 1){
					object1.push($('#hbqy2_bbreport_table').DataTable().data()[i]);
				}
			}
		}
		var jsonData1 = JSON.stringify(object1);
		
		var param = {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: jsonData1
			};
		//bdoConfirmBox('保存', '确认保存？', function() {
			//bdoInProcessingBox('处理中');
			$.ajax({
				url: 'dgCenter/DgBBReport.saveBbReport.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						initBbReport(bbReportId,"1");
						//$('#bbReport_modal').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	}
	//刷新
	$('#bbReport_refresh').on('click', function() {
		bdoConfirmBox('保存', '重置数据会清空当前所有数据，确认重置数据？', function() {
			initBbReport(bbReportId,"2");
		});
	});
	// 销毁表
	var destroyTable = function(table) {
		if ($('#' + table).hasClass('dataTable')) {
			$('#' + table).DataTable().clear();
			$('#' + table).DataTable().destroy();
			$('#' + table).empty();
		}
	}
	//生成报备单
	$('#bb_table').on('click', 'button[name="templateDownload"]', function() {
		var object = $('#bb_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('保存', '确认下载？', function() {
			//bdoInProcessingBox('处理中');
			downloadFile('dgCenter/DgBBReport.createBbReportFile.json', {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: object.autoId
			});
			/*$.ajax({
				url: 'dgCenter/DgBBReport.createBbReportFile.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#bbReport_modal').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});*/
		});
	});
	// 合计计算
	var calTable = function(table,subjectId,columnName,index) {
		let updateSubjectId = [];
		var len1 = table.DataTable().data().length;
		for(var i=0;i<len1;i++){
			let obj = table.DataTable().data()[i];
			if(obj.bbCalFun != null && obj.bbCalFun != ''){
				let calItems = parseCalFunItems(obj.bbCalFun);
				for (let j = 0; j < calItems.length; j++) {
					if (subjectId === calItems[j]) {
						//计算
						let rpnQueue = parseCalFunAmount(table,calItems,obj.bbCalFun,columnName);
						let calResult= eval(rpnQueue);
						obj[columnName] = calResult.toFixed(2);
						table.find("tr").eq(i+1).find("td").eq(index).html(calResult.toFixed(2));
						obj['isEdit'] = 1;
						//记录需要同步计算的科目
						updateSubjectId.push(obj.bbSubjectId);
						break;
					}
				}
			}
		}
		return updateSubjectId;
	};
	//公式替换
	function parseCalFunAmount(table,calItems,bbCalFun,columnName) {
		var len1 = table.DataTable().data().length;
		for(var i=0;i<len1;i++){
			let obj = table.DataTable().data()[i];
			for (let j = 0; j < calItems.length; j++) {
				if (obj.bbSubjectId === calItems[j]) {
					//替换
					var amount = 0;
					if(obj[columnName] != null && obj[columnName] != ''){
						amount = obj[columnName];
					}
					bbCalFun = bbCalFun.replace(calItems[j],amount);
				}
			}
		}
		return bbCalFun;
	}
	//公式拆分
	function parseCalFunItems(calFun) {
		if (!calFun) {
			return [];
		}
		let tmp = calFun.replace(/[-+*\/()]/g, ' ');
		return tmp.split(/\s+/).filter(v => v.replace(/\d/g, '') && v.replace(/\d+\.\d+/g, ''));
	}
	//报备页面
	let bbReportPage = new Page({
		container: '#modal_bbReport',
		events: {
		},
		/**
		 * 初始化
		 */
		init(options) {
		}
		
	});
	//查询报备列表
	$('#bb_search').on('click', function() {
		initbbTable();
	});
	//核对完成
	$('#bbReport_end').on('click', function () {
		if(bbReportId == null || bbReportId == ''){
			bdoInfoBox('提示', '请先选择模板');
			return;
		}
		if(checkNum != 0){
			bdoInfoBox('提示', '报表校验不通过，不能完成。');
			return;
		}
		$('#bbReport_end').blur();
		bdoAjaxBox('系统提示', '确定完成报备吗？', function () {
			$.ajax({
				url: 'dgCenter/FUnAuditReport.checkBbReport.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: ''
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		});

	});
};
