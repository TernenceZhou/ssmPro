//母公司单体试算平衡表
function MonomerTB(args) {
	var _template
		// , _data
		, mount
		, listener;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeTB.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);

	var tagsTable;
	let tbEditerId;
	tagsTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				return {
					menuId: window.sys_menuId,
					sqlId: 'DG00083',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				};
			})(),
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '170px',
			select: true,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '460px',
			columnDefs: [{
				targets: 1,
				orderable: true,
				title: '标签',
				name: 'autoId',
				data: 'autoId',
				width: '60px',
				render: function (data, type, row, meta) {
					let renderStr = '<a href=\"#\">' + 'p' + data + '</a>';
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: false,
				title: '标签名',
				name: 'tagName',
				data: 'tagName',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				title: '标签属性',
				className: 'text-center',
				name: 'tagProperty',
				data: 'tagProperty',
				renderer: 'getDicLabelByVal|标签属性',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签属性');
				}
			}, {
				targets: 4,
				orderable: true,
				title: '标签类型',
				className: 'text-center',
				name: 'tagType',
				data: 'tagType',
				renderer: 'getDicLabelByVal|标签类型',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签类型');
				}
			}, {
				targets: 5,
				orderable: true,
				title: '位置',
				name: 'otherPosition',
				data: 'otherPosition',
				width: '100px'
			}, {
				targets: 6,
				orderable: false,
				title: '详细位置',
				name: 'tagPosition',
				data: 'tagPosition',
				width: '100px'
			}, {
				targets: 7,
				orderable: false,
				className: 'text-right',
				title: '标签值',
				name: 'tagValue',
				data: 'tagValue',
				width: '80px',
				render: function (data, type, row, meta) {
					let renderStr = formatMoney(data);
					return renderStr;
				}
			}, {
				targets: 8,
				orderable: false,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '40px',
				render: function (data, type, row, meta) {
					let renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
					return renderStr;
				}
			}, {
				targets: 9,
				name: 'tagDgId',
				data: 'tagDgId',
				visible: false
			}, {
				targets: 10,
				name: 'tagInfo',
				data: 'tagInfo',
				visible: false
			}
			]
		}
	};
	var formulaTable;
	formulaTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00114',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: '',
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			scrollY: '270px',
			select: true,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '400px',
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px'
			}, {
				targets: 2,
				orderable: false,
				className: 'text-center',
				title: '科目名称',
				name: 'subjectName',
				data: 'subjectName',
				width: '60px',
				render: function (data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 3,
				orderable: false,
				title: '公式',
				name: 'formula',
				data: 'formula',
				width: '100px',
				render: function (data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 4,
				orderable: false,
				title: '公式信息',
				name: 'formulaText',
				data: 'formulaText',
				width: '100px',
				render: function (data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 5,
				orderable: false,
				title: '公式值',
				name: 'formulaValue',
				data: 'formulaValue',
				width: '100px',
				render: function (data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 6,
				orderable: false,
				className: 'text-center',
				title: '公式校验结果',
				name: 'formulaCalc',
				data: 'formulaCalc',
				width: '80px',
				render: function (data, type, row, meta) {
					if (data == 1) {
						var renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
						return renderStr;
					} else if (data == 0) {
						var renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
						return renderStr;
					}
				}
			}, {
				targets: 7,
				orderable: false,
				title: '校验时间',
				name: 'updateTime',
				data: 'updateTime',
				width: '100px',
				render(data) {
					return new Date(data).format('yyyy-MM-dd HH:mm:ss');
				}
			}, {
				targets: 8,
				orderable: false,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'autoId',
				width: '80px',
				render: function (data, type, row, meta) {
					let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\"><i class=\"fa fa-edit\"></i></button>';
					renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
					return renderStr;
				}
			}
			]
		}
	};
	let projectYear = '';

	/*	function setTbeEditerSelect() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.getProjectMember.json',
				//async : false,
				data: {
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let tbEditer = '<option value="" label="" />';
						data.data.map(item => {
							if (tbEditerId == item.id) {
								tbEditer += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" selected />';
							} else {
								tbEditer += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" />';
							}
							// return {id: item.id, text: item.name, value: item.name};
						});
						$('#tb_editer').append(tbEditer);
					} else {
						$('#tb_editer').val('');
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});
	}	*/

	function getTagValue(inputText) {
		let tagValue = 0;
		let tagId = inputText.replace('p', '');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: true,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00235',
				param1: tagId,
				param2: window.CUR_CUSTOMERID,
				param3: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					tagValue = data.data[0].tagValue;
				}
			}
		});
		return parseFloat(tagValue).toFixed(2);
	}

	uiBlocksApi(false, 'init');

	$('#search_customerId').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
	projectYear = window.CUR_PROJECT_ACC_YEAR;
	let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
	$('#title_index').text('【' + node.extraOptions.indexId + '】');
	$('#headtitle').empty().text(node.text);
	//$('#cus_select1').text('【' + CUR_PROJECTNAME+'   ' + projectYear + '-' + CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + CUR_PROJECT_END_MONTH + '】');
	$('#cus_select2').text('【' + window.CUR_PROJECTNAME + '   ' + projectYear + '-' + window.CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + window.CUR_PROJECT_END_MONTH + '】');

	OneUI.initHelper('slimscroll');
	var table = 'tb_tab';
	var tableCheck = 'tb_tbcheck';


	function createColumnCheck(startYear, endYear) {


		let tbColumns = {
			scrollY: false,
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: false,
			/*fixedThead: true,*/
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '校验项',
					orderable: false,
					name: 'colDisp',
					data: 'colDisp',
					width: '550px',
					/*render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
				}
			]
		};


		let colNum = 1;
		for (let i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets:++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			/*tbColumns.columnDefs.push({
				targets : colNum + 2,
				className : 'text-right',
				title : i + '年<br>重分类调整数',
				name : 'adjustCAmount'+i,
				data : 'adjustCAmount'+i,
				width : '100px',
				render: function(data, type, row, meta){
					if (data == 0){
						return '平';
					}else if (data != null){
						return formatMoney(data);
					}
				}
			});*/

			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

/*			if (i < endYear) {
				tbColumns.columnDefs.push({
					targets: colNum + 4,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '10px'
				});
			}*/


		}

		let last = startYear - 1;

		for (let i = last; i <= last; i++) {
			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});
			tbColumns.columnDefs.push({
				targets:++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right ',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				width: '180px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});


		}
		return tbColumns;
	}

	function createColumn(startYear, endYear) {

		var tbColumns = {
			scrollY: 450,
			scrollCollapse: true,
			fixedColumns: true,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			/*fixedThead: true,
			fixedHeight: '480px',*/
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center width-seq',
					title: '序号',
					//width: '60px',
					visible: true,
					render: function (data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 2,
					orderable: false,
					className: 'text-left width-subject-id',
					title: 'TB科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '120px'
				},
				{
					targets: 3,
					className: 'text-left width-subject-name',
					orderable: false,
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '220px',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return '&nbsp;&nbsp;&nbsp;&nbsp;' + data;
						}
					}
				}
			]
		};


		let colNum = 3;
		for (var i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets:++colNum,
				className: 'text-right width-je',
				orderable: false,
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						//+ row['adjustCAmount' + thisYear]
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="4">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			/*tbColumns.columnDefs.push({
				targets : colNum + 2,
				className : 'text-right',
				title : i + '年<br>客户调整数',
				name : 'adjustCAmount'+i,
				data : 'adjustCAmount'+i,
				width : '100px',
				render: function(data, type, row, meta){
					var html = formatMoney(data);
					if (row.adjustFlag == '1' || row.adjustFlag == '3') {
						html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + html + '</span>';
					}
					return html;
				}
			});*/
			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var html = formatMoney(val);
					if (row.colType == '1') {
						if (val != '0' && val != '--') {
							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
								'</label>';
							return html;
						}
					}


					/*if (row.adjustFlag == '2' || row.adjustFlag == '3') {
						html = '<label style="font-size: 10px;position: relative;top:5px;">' +
							'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
							'</label>';
						return html;
					}*/
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="5">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;left: 2px;top: 5px">' + html + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});

			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="6">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});

		}


		/**
		 *新增上期数据
		 */
		let last = startYear - 1;

		for (let i = last; i <= last; i++) {
			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					var val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						//+ row['adjustCAmount' + i]
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
                    var render = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="4">'
                        +'<i class="fa fa-edit"></i>'
                        +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">'+val+'</label>';
                    */
					var render = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return render;

				}
			});
			tbColumns.columnDefs.push({
				targets:++colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						// 负数无法正常显示
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var html = formatMoney(val);
					//审计调整没有上年
					// if (row.adjustFlag == '2' || row.adjustFlag == '3') {
					// 	html = '<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>';
					// }
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="5">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px">' + html + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});

			tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				//width: '180px',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="6">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
		}
		return tbColumns;
	}

	var tb_viewCheck = {
		localParam: {
			tabNum: false,
			data: [],
//			url : 'dgCenter/FTBSubjectContract.tbCheckResult.json',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			scrollY: false,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			rowReorder: {
				update: false
			},
			columnDefs: []
		}
	};
	var tb_view2 = {
		localParam: {
			tabNum: false,
			data: [],
			url: 'dgCenter/FTBSubjectContract.tbList.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			scrollY: false,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			rowReorder: {
				update: false
			},
			columnDefs: []
		}
	};

	function loadData() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeTb.monomerTbListAndCheck.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': window.CUR_CUSTOMERID,
				'param2': projectYear,
				'param3': projectYear,
				'param4': $('#showContract').val()
			},
			dataType: 'json',
			success: function (data) {
				if ($('#' + tableCheck).hasClass('dataTable')) {
					$('#' + tableCheck).DataTable().clear();
					$('#' + tableCheck).DataTable().destroy();
					$('#' + tableCheck).empty();
				}
				if ($('#' + table).hasClass('dataTable')) {
					$('#' + table).DataTable().clear();
					$('#' + table).DataTable().destroy();
					$('#' + table).empty();
				}
				if (data.success) {
					var data = data.data[0];
					tb_view2.localParam.data = data.tbList;
					tb_view2.tableParam = createColumn(projectYear, projectYear);
					BdoDataTable(table, tb_view2);
					tb_viewCheck.localParam.data = data.checkResult;
					tb_viewCheck.tableParam = createColumnCheck(projectYear, projectYear);
					BdoDataTable(tableCheck, tb_viewCheck);
				} else {
					if (data.data && data.data.length > 0) {
						bdoConfirmBox('提示', data.resultInfo.statusText, function () {
							bdoInProcessingBox('生成中');
							createTB();
						});
						return;
					}
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	}

	function createTB() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeTb.createTB.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID/*,
					param2 : $('#tb_startYear').val(),
					param3 : $('#tb_endYear').val()*/
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					bdoSuccessBox('操作成功', data.resultInfo.statusText);
					loadData();
				} else {
					var error = data.resultInfo.statusText.search('TB科目对照');
					if (error > 0) {
						bdoConfirmBox('操作失败', data.resultInfo.statusText, function () {
							$('a[href="#tab_tbContract"]').click();
						});
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			}
		});
	}

	function hidenOtherButton() {
		//生成试算平衡表按钮
		$('#tb_createReport').hide();
		//导出按钮
		$('#tb_export').hide();
		//tb编制人
		$('#tb_editer').parent().parent().parent().hide();
		//初始化模板文件按钮
		$('#tb-init-merge-template').hide();
		//导入抵消分录按钮
		$('#tb-import-offset').hide();
		//过滤按钮
		$('#showContract').hide();
		//删除按钮
		$('#tb_search').hide();
		$('#title_name').text("试算平衡表");
		// $('#title_index').parent().text('试算平衡表 '+text);
		$('#tab2 > a').text("试算平衡表")
		//本期、上期试算平衡表标签
		$('#tb_type').hide();
		// 抵消按钮
		$('#li_tb_offset').hide();
		//抵消页签
		$('#tab_tb_offset').hide();
	}

	var loadTBbData = function() {
		var init_table_view = {
			localParam: {
				tabNum: true,
				//fixedHeader : {header : true},
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'DG00057',
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
				dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
				serverSide: true,
				ordering: false,
				scrollX: true,
				fixedColumns: true,
				columnDefs: [{
					targets: 1,
					className: 'text-left width-subject-id',
					index: 1,
					title: '处理',
					data: null,
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="user_tb_edit" data-placement="top" title="修改 " data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>&nbsp;';

						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="user_tb_delete" data-placement="top" title="删除 " data-toggle="tooltip">'
							+ '<i class="fa fa-times"></i></button>&nbsp;';
						// 修改tb科目对照
						if (row.isSubject == 1) {
							renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="user_tb_reContract" data-placement="top" title="修改对照 " data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
						}
						renderStr += '<input name="autoId" value="' + row.autoId + '" hidden/>';
						return renderStr;
					}
				}, {
					targets: 2,
					index: 2,
					className: 'text-left width-subject-id',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
				}, {
					targets: 3,
					index: 3,
					className: 'text-left width-subject-name',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
				}, {
					targets: 4,
					index: 4,
					className: 'text-left width-subject-name',
					title: '报表科目编号',
					name: 'reportSubjectId',
					data: 'reportSubjectId',
				}, {
					targets: 5,
					index: 5,
					className: 'text-left width-subject-name',
					title: '报表科目名称',
					name: 'reportSubjectName',
					data: 'reportSubjectName',
				}, {
					targets: 6,
					index: 6,
					className: 'text-left width-calfun',
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					render: function(data, type, row, meta) {
						if (data != null) {
							if (data.length > 35) {
								var str = '<span title="' + data + '">';
								for (var i = 0; i < data.length / 35; i++) {
									str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
								}
								str += '</span>';
								return str;
								/*if(data[34] == '+'){
									return '<span title="'+data+'">'+data.substring(0,33)+'+....'+'</span>'
								}else{
									return '<span title="'+data+'">'+data.substring(0,34)+'+....'+'</span>'
								}*/
							} else {
								return '<span>' + data + '</span>';
							}
						} else {
							return '<span></span>';
						}
					}
				}, {
					targets: 7,
					index: 7,
					className: 'text-center width-subject-name',
					title: '是否科目',
					name: 'isSubject',
					data: 'isSubject',
					render: function(data, type, row, meta) {
						if (data) {
							return '是';
						} else {
							return '否';
						}
					}
				}, {
					targets: 8,
					index: 8,
					className: 'text-center width-seq',
					title: '排序号',
					name: 'sortNo',
					data: 'sortNo',
				}]
			}
		};
		BdoDataTable('user_tb_table', init_table_view);
	};

	listener = () => {
		//生成合并试算平衡表
		/*		$('#tb_createReport').click(function () {
					$('#tb_createReport').blur();
					bdoConfirmBox('系统提示', '确定要重新生成【' + CUR_CUSTOMERNAME + '】<br>'
						+ '试算平衡表吗？<span style="color: red; ">重新生成后原来的试算平衡表将被删除！</span>'
						, function () {
							bdoInProcessingBox('生成中');
							createTB();
						});


				});*/

		$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function (evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			switch (id) {
				case 'tagTab':
					$('#tagsTable').DataTable().ajax.reload();
					break;
				case 'formulaTab':
					var referredAutoId;
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: true,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00113',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: 'TB',
							param4: $('#formulaSubjectId').val(),
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									referredAutoId = data.data[0].infoFormula;
								}
							}
						}
					});
					if (referredAutoId == '') {
						referredAutoId = '0';
					}
					formulaTable.localParam.urlparam.param3 = referredAutoId;
					BdoDataTable('formulaTable', formulaTable);
					break;
				default:
					break;
			}
		});

		$('#formulaModal').on('show.bs.modal', function (e) {
			BdoDataTable('tagsTable', tagsTable);
			$('#tagGroup').html('');
			$('#tagsTable tbody').on('click', 'td button', function () {
				var cellAlias = this.lastElementChild.value;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.deleteTag.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: cellAlias,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#tagsTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '删除标签成功！');
						}
					}
				});
			});
			$('#tagsTable tbody').on('click', 'td a', function () {
				var colIndex = $(this).parents('td').index();
				if (colIndex === 1) {
					let length = $('#tagGroup .col-sm-1 input').length;
					let txt;
					if (length > 0) {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div><div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					} else {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					}
					$('#tagGroup').append(txt);
					$('#tagMainGroup .col-sm-1 input')[length].value = $(this).text();
					$('#tagMainGroup .col-sm-1 input')[length].title = $(this).parent().next().text();
				}
			});
		});

		$('#uodoTagBtn').click((event) => {
			var length1 = $('#tagGroup .col-sm-1 input').length;
			if (length1 > 0) {
				$('#tagGroup .col-sm-1')[length1 * 2 - 2].remove();
			}
			var length2 = $('#tagGroup .col-sm-1 select').length;
			if (length2 > 0) {
				$('#tagGroup .col-sm-1')[length2 * 2 - 1].remove();
			}
		});
		$('#formulaTable').on('click', 'button[name="editFormula"]', function () {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			$('#tagGroup').html('');
			var title = object.formulaText.split(/[\+\-\=]+/);
			var text = object.formula.split(/[\+\-\=]+/);
			var sign = object.formula.split(/[^\+\-\=]+/);
			var txt;
			for (var i = 0; i < text.length; i++) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + text[i] + '\" title=\"' + title[i] + '\" readonly=\"readonly\"></div></div>');
				$('#tagGroup').append(txt);
				if (i + 1 < sign.length - 1) {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div>');
					$('#tagGroup').append(txt);
					$('#tagGroup .col-sm-1 select')[i].value = sign[i + 1];
				}
			}
			$('#formulaModal [data-toggle="tabs"] a:first').tab('show');
		});
		$('#formulaTable').on('click', 'button[name="delFormula"]', function () {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.delFormula.json',
				async: true,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: object.autoId
				},
				dataType: 'json',
				success(data) {
					var referredAutoId;
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: true,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00113',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: 'TB',
							param4: $('#formulaSubjectId').val(),
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									referredAutoId = data.data[0].infoFormula;
								}
							}
						}
					});
					if (referredAutoId == '') {
						referredAutoId = '0';
					}
					formulaTable.localParam.urlparam.param3 = referredAutoId;
					$('#formulaTable').DataTable().ajax.reload();
					bdoSuccessBox('成功', '成功删除校验公式！');
				}
			});
		});
		$('#checkFormulaBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'TB',
					param4: $('#formulaSubjectId').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});

		$('#ensureProjectTagBtn').click((event) => {
			var length = $('#tagGroup .col-sm-1 select').length;
			if (length == 0) {
				bdoErrorBox('失败', '请正确设置公式！');
				$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
				return;
			}
			var formula = $('#tagGroup .col-sm-1 input')[0].value;
			var formulaText = $('#tagGroup .col-sm-1 input')[0].title;

			var inputFirstValue = $('#tagGroup .col-sm-1 input')[0].value;
			var formulaValue = getTagValue(inputFirstValue);
			for (var i = 0; i < length; i++) {
				var inputValue = $('#tagGroup .col-sm-1 input')[i + 1].value;
				var selectValue = $('#tagGroup .col-sm-1 select')[i].value;
				if (selectValue == '') {
					$('#tagGroup .col-sm-1 select')[i].focus();
					bdoErrorBox('失败', '请选择运算符号！');
					return;
				}
				formula = formula + selectValue + inputValue;
				formulaText = formulaText + selectValue + $('#tagGroup .col-sm-1 input')[i + 1].title;

				var value = getTagValue(inputValue);
				formulaValue = formulaValue + selectValue + value;
			}
			if (formula.indexOf('=') === -1 || formula.indexOf('=') !== formula.lastIndexOf('=')) {
				bdoErrorBox('失败', '请正确设置公式！');
				return;
			}
			// 等式左边值
			var formulaValueLeft = formulaValue.substring(0, formulaValue.indexOf('='));
			// 取得具体数值数组
			var formulaValueListLeft = formulaValueLeft.split(/[\+\-]+/);
			// 取得运算符号数组
			var signListLeft = formulaValueLeft.split(/[^\+\-]+/);
			let formulaCalcLeft = formulaValueListLeft[0] == '' ? 0 : formulaValueListLeft[0];
			var formulaValueLeftNew = formulaCalcLeft.toString();
			if (signListLeft.length > 1) {
				let startNumLeft = 1;
				if (signListLeft[0] == '-') {
					startNumLeft = 0;
				}
				for (let i = startNumLeft; i < signListLeft.length - 1; i++) {
					let signLeft = signListLeft[i];
					let signValueLeft = formulaValueListLeft[i + 1 - startNumLeft];
					if (signLeft === '+') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					} else if (signLeft === '-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '+-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '--') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					}
				}
			}
			// 等式右边值
			var formulaValueRight = formulaValue.substring(formulaValue.indexOf('=') + 1);
			// 取得具体数值数组
			var formulaValueListRight = formulaValueRight.split(/[\+\-]+/);
			// 取得运算符号数组
			var signListRight = formulaValueRight.split(/[^\+\-]+/);
			let formulaCalcRight = formulaValueListRight[0] == '' ? 0 : formulaValueListRight[0];
			if (signListRight.length > 1) {
				let startNumRight = 1;
				if (signListRight[0] == '-') {
					startNumRight = 0;
				}
				for (let i = startNumRight; i < signListRight.length - 1; i++) {
					let signRight = signListRight[i];
					let signValueRight = formulaValueListRight[i + 1 - startNumRight];
					if (signRight === '+') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
					if (signRight === '-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '+-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '--') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
				}
			}
			// 等式左边等于等式右边 1:计算结果正确
			if (parseFloat(formulaCalcLeft).toFixed(2) == parseFloat(formulaCalcRight).toFixed(2)) {
				var formulaCal = '1';
			} else {
				var formulaCal = '0';
			}
			let formulaAutoId = formula.replace(/p/g,'');
			let tagAllId = formulaAutoId.replace(/=/g,',').replace(/\+/g,',').replace(/-/g,',');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.setProjectFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: formula.replace(/\+/g, '%2B'),
					param4: formulaText.replace(/\+/g, '%2B'),
					param5: formulaValue.replace(/\+/g, '%2B'),
					param6: formulaCal,
					param7: formulaAutoId.replace(/\+/g, '%2B'),
					param8: $('#formulaSubjectId').val(),
					param9: $('#formulaSubjectName').val(),
					param10: tagAllId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', '设置校验数据公式成功！');
						$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
						$('#tagGroup .col-sm-1').remove();
					} else {
						bdoErrorBox('失败', '设置校验数据公式失败！');
					}
				}
			});
		});
		/*
				$('#tb_editer').change(function () {
					$.ajax({
						type: 'post',
						url: 'dgCenter/FTBSubjectContract.saveTbEditer.json',
						//async : false,
						data: {
							param2: '1',
							param3: $(this).val(),
							param4: $(this).find('option:selected').attr('label')
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox("保存TB编制人成功！");
								// $('#tb_editer').append(tbEditer);
							} else {
								bdoErrorBox(data.resultInfo.statusText);
							}
						}
					});

				});
		*/


		$('#tb_search').click(function () {
			$('#tb_search').blur();
			loadData();
		});

		//试算平衡表 显示下拉选 选中事件   全部、已对照、未对照
		$('#showContract').change(function () {
			loadData();
		});


		/*		//	抵消汇总导入
				$('#tb-import-offset').click(function () {

					$('#modal-import-offset').modal('show');

					var pluginOpt = {
						dropZoneEnabled: false,
						dropZoneTitle: '',
						dropZoneClickTitle: '',
						browseLabel: '选择文件',
						showCaption: true,
						showRemove: false,
						showUpload: false,
						showBrowse: true,
						showPreview: false,
						required: true,
						initialPreviewShowDelete: true,
						language: 'zh',
						browseOnZoneClick: true,
						showClose: false,
						showCancel: false,
						hideThumbnailContent: true,
						layoutTemplates: {
							actionUpload: '',
							actionZoom: ''
						},
						fileActionSettings: {
							removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
						},
						uploadAsync: true,
						uploadUrl: 'dgCenter/HbMergeTb.uploadOffsetFile.json',
						uploadExtraData: function () {
							return {
								param1: '',
								param2: ''
							}
						}
					};

					pluginOpt.uploadExtraData = function () {
						return {
							param1: $('#tbsubject_rule_model').val()
						}
					};
					var $el = $('#fileinput').fileinput(pluginOpt);

					//uploadAsync = true 时调用
					$el.on('fileuploaded', function (event, data) {
						if (data.response.success) {
							uploadFileSuccess(data);
							// bdoSuccessBox('导入成功');
						} else {
							bdoErrorBox('失败', data.response.resultInfo.statusText);
						}
					});

					//uploadAsync = true 时，后台返回数据data.error 非空是调用
					$el.on('fileuploaderror', function (event, data, msg) {
						bdoErrorBox('系统提示', msg);
						//uploadFileSuccess(data);
					});

					//文件上传成功/失败后，处理后台响应函数
					function uploadFileSuccess(data) {
						$.ajax({
								type: 'post',
								url: 'dgCenter/HbMergeTb.importOffset.json',
								data: {
									//文件id
									param1: data.response.data[0].id,
								},
								dataType: 'json',
								success: function (data) {
									if (data.success) {
										bdoSuccessBox('导入成功');
										$('#modal-import-offset').modal('hide');
										$('#fileinput').fileinput('clear');
										$('#fileinput').fileinput('enable');
										// loadData();
										// $('#rpt_search').click();
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								},
							}
						);
					}

					//建议文件上传成功之后再提交其他表单数据
					function uploadFile() {
						$el.fileinput('upload');
					}

					/!** 导入按钮 *!/
					$('#import_submit').click(function () {
						var fileUrl = $("#fileinput").val();
						// console.log(fileUrl);
						if (fileUrl == null || fileUrl == "") {
							bdoInfoBox('提示', '请选择导入文件');
							return;
						}
						uploadFile();
					});
				});*/
		/*
				$('#download-offset-template').click(function () {
					let params = {
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param4: 8,
					};
					exportExcelWithTemplate('./dgCenter/HbMergeTb.downloadOffsetTemplate.json', params);
				});*/
		/*

				$('#tb-init-merge-template').click(function () {
					$.ajax({
						type: 'post',
						url: 'dgCenter/HbMergeTb.initReportTemplate.json',
						//async : false,
						data: {},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox("初始化合并报表成功！");
							} else {
								bdoErrorBox(data.resultInfo.statusText);
							}
						}
					});
				});
		*/
		$('#tab3').on('click', function() {
			//进入页面
			loadTBbData();
			$('#tab_tbList').hide();
			$('#tab_tb_options').show();
		});
		$('#tab2').click(function () {
			$('#tab_tb_options').hide();
			$('#tab_tbList').show();
		});

	};
	mount = () => {
		$('#tab_tb_options').hide();
		$('#tab3').remove();
		// setTbeEditerSelect();
		hidenOtherButton();
		loadData();
		listener();
	};

	mount();
}



