$(document).ready(function() {
	//pageRightTitle(pageTitleArr);
	$($('main .content')[1]).css('min-height', 480 + 'px');
	uiBlocksApi(false, 'init');
	var formId = 'regist_form';
	var table = 'subjectEntry';
	//穿透的切换
	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
		e.preventDefault();
		$(this).tab('show');
	});*/
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/


	$('#font_size').change(function() {
		$('#subjectEntry td').addClass('transform_font_size');
		$('th').addClass('transform_font_size');
		$('#subjectEntry td').css('font-size', $(this).val() + 'px');
		$('th').css('font-size', $(this).val() + 'px');
	});


	//获取客户下拉
	// 客户
	getUserCustomers('detail_customerId');

	// 日期
	//getUserYear('detail_startyyyy');
	//getUserYear('detail_endyyyy');
	/*getUserLocalYear('detail_startyyyy');
	getUserLocalYear('detail_endyyyy');*/
	$('#detail_startyyyy,#detail_endyyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});

	$('#detail_startyyyy').change(function() {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
	});
	$('#detail_endyyyy').change(function() {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
	});

	/** 下拉框 获取字典 */

	//月份
//	$('#detail_startmonth').html(ComboDicOption(false, 'month'));
	$('#detail_startmonth').html(ComboLocalDicOption(false, 'month'));

//	$('#detail_endmonth').html(ComboDicOption(false, 'month'));
	$('#detail_endmonth').html(ComboLocalDicOption(false, 'month'));

	$('#detail_endmonth').val('12');

	let startyear = window.CUR_PROJECT_START_YEAR;    //2018
	let startmonth = window.CUR_PROJECT_START_MONTH;    //1
	let endmonth = window.CUR_PROJECT_END_MONTH;    //12
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	if (!startmonth || startmonth == '') {
		startmonth = '01';
	}
	if (!endmonth || endmonth == '') {
		endmonth = '12';
	}
	if (startmonth < 10) {
		startmonth = '0' + parseInt(startmonth);
	}
	if (endmonth < 10) {
		endtmonth = '0' + parseInt(endmonth);
	}
	$('#detail_startmonth').val('01');
	$('#detail_endmonth').val('12');
	$('#detail_startyyyy').val(startyear);
	$('#detail_endyyyy').val(startyear);


//	$('#detail_subjectid').focus(function(){
//		if($('#detail_customerId').val() == ''){
//			$('#detail_customerId').focus();
//			bdoErrorBox('错误', '请选择客户');
//			return;
//		}
//		if($('#detail_startyyyy').val() == ''){
//			$('#detail_startyyyy').focus();
//			bdoErrorBox('错误', '请选择账套年份');
//			return;
//		}
//		$('#modal_subjectid').modal('show');
//	    if($('#accmulsubject_tree').hasClass("treeview")){
//	        return;
//	    }
//	    $('#accmulsubject_tree').tree({
//	        url : 'cpBase/TreeCommon.findAccSubjectType.json',
//	        params : {
//	            param9: $('#detail_customerId').val(),
//	            param10 : $('#detail_endyyyy').val(),
//				searchInputId : "searchInput2"
//	        },
//			lazyLoad : false,
//	        view : {
//	            leafIcon: 'fa fa-building text-flat',
//	            nodeIcon: 'fa fa-bank text-primary-light',
//	            folderSelectable: false,
//	            multiSelect: false,
//	            showCheckbox: true,
//	            selectedColor: '',
//	            selectedBackColor: ''
//	        }
//	    });
//	});


//	});

	$('#modal_subjectid').on('shown.bs.modal', function() {
		/* if($('#subject_tree').hasClass("treeview")){
			 return;
		 }*/
		$('#subject_tree').tree({
			url: 'cpBase/TreeCommon.findAccSubjectType.json',
			params: {
				param9: $('#detail_customerId').val(),
				param10: $('#detail_endyyyy').val(),
				searchInputId: 'searchInput2'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});

	//选择科目
	$('#detail_subjectid').focus(function() {
		if ($('#detail_customerId').val() == '') {
			$('#detail_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#detail_endyyyy').val() == '') {
			$('#detail_endyyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');

	});


//	$('#detail_subjectid').treecombo({
//        url: 'cpBase/TreeCommon.findAccSubjectType.json',
//        params: {
//        	 param9: $('#detail_customerId').val(),
//	         param10 : $('#detail_endyyyy').val(),
//	         searchInputId : "searchInput2"
//        },
//        view: {
//            leafIcon: 'fa fa-building text-flat',
//            nodeIcon: 'fa fa-bank text-primary-light',
//            folderSelectable: true,
//            multiSelect: false
//        }
//    });


	$('#modal_accmulsubjectid_sure').click(function() {
		if ($('#subject_tree').treeview(true).getChecked()[0].length == 0) {
			$('#detail_subjectid').val('');
		} else {
			$('#detail_subjectid').val($('#subject_tree').treeview(true).getChecked()[0].id);
		}
		$('#modal_subjectid').modal('hide');
	});

	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});


	/**检索条件设置 */
	var queryFilter = function() {
		var summary = '(';
		var summary_type = '';
		var summary1 = '';
		var summary2 = '';
		var summary3 = '';
		if ($('#summary_type').val() == '&&') {
			summary_type = ' and ';
		} else if ($('#summary_type').val() == '||') {
			summary_type = ' or ';
		} else if ($('#summary_type').val() == 'not') {
			summary_type = 'not';
		} else {
			summary_type = '';
		}
		if (summary_type != null && summary_type != '') {
			if ($('#summary1').val() != null && $.trim($('#summary1').val()) != '') {
				summary1 = $.trim($('#summary1').val());
				if (summary_type != 'not') {
					summary += 'summary LIKE "%25' + $('#summary1').val() + '%25"';
				} else if (summary_type == 'not') {
					summary += 'summary NOT LIKE "%25' + $('#summary1').val() + '%25"';
				}
			}
			if ($('#summary2').val() != null && $.trim($('#summary2').val()) != '') {
				summary2 = $.trim($('#summary2').val());
				if (summary != '(' && summary_type != 'not') {
					summary += summary_type;
				}
				if (summary_type != 'not') {
					summary += ' summary LIKE "%25' + $('#summary2').val() + '%25"';
				} else if (summary_type == 'not') {
					summary += ' AND summary NOT LIKE "%25' + $('#summary2').val() + '%25"';
				}
			}
			if ($('#summary3').val() != null && $.trim($('#summary3').val()) != '') {
				summary3 = $.trim($('#summary3').val());
				if (summary != '(' && summary_type != 'not') {
					summary += summary_type;
				}
				if (summary_type != 'not') {
					summary += ' summary LIKE "%25' + $('#summary3').val() + '%25"';
				} else if (summary_type == 'not') {
					summary += ' AND summary NOT LIKE "%25' + $('#summary3').val() + '%25"';
				}

			}

		}
		if (summary != '(') {
			summary += ')';
		} else {
			summary = '';
		}
		/** table */
		var queryFilterArr = {
//			'customerId': $('#detail_customerId').val(),
			'startyyyy': $('#detail_startyyyy').val(),
			'startmonth': $('#detail_startmonth').val(),
			'endyyyy': $('#detail_endyyyy').val(),
			'endmonth': $('#detail_endmonth').val(),
			'subjectid': $('#detail_subjectid').val(),
			'voucherFillUser': $('#detail_voucherFillUser').val(),
			'voucherAuditUser': $('#detail_voucherAuditUser').val(),
			'vouchartype': $('#detail_vouchartype').val(),
			'summary': summary,
			'subjectType': $('#subject_type').val(),
			'summaryType': $('#summary_type').val(),
			'summary1': summary1,
			'summary2': summary2,
			'summary3': summary3
		};
		return JSON.stringify(queryFilterArr);
	};

	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/SubjectEntry.getSubjectEntryView3.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: '',
				param1: '',
				param2: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			//fixedHeader: true,
			fixedThead: true,
			fixedHeight: '500px',
			ordering: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: false,
//			deferRender: true,去掉序号就正确
			scroller: true,

			//order : [2, 'asc'],
			rowReorder: false,
			//fixedHeader: true,
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 25

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: 85
//				render : function(data, type, row, meta) {
//					var renderStr = '';
//					//renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看 " data-toggle="tooltip">'
//					//		+ '<i class="fa fa-eye"></i></button>';
//					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowRelation" data-placement="top" title="对照 " data-toggle="tooltip">'
//						+ '<i class="fa fa-edit"></i></button>';
//					return renderStr;
//				}	
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: 30

				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: 30

				}, {
					targets: 5,
					orderable: true,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '对方科目',
					name: 'subjectFullName1',
					data: 'subjectFullName1',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: 7,
					className: 'text-center',
					title: '币种',
					name: 'currency',
					data: 'currency'
				}, {
					targets: 8,
					orderable: true,
					className: 'text-right',
					title: '借方发生额<br>外币',
					name: 'debitCurr',
					data: 'debitCurr',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 9,
					orderable: true,
					className: 'text-right',
					title: '借方发生额<br>本位币',
					name: 'debit',
					data: 'debit',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 10,
					orderable: true,
					className: 'text-right',
					title: '贷方发生额<br>外币',
					name: 'creditCurr',
					data: 'creditCurr',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 11,
					orderable: true,
					className: 'text-right',
					title: '贷方发生额<br>本位币',
					name: 'credit',
					data: 'credit',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 12,
					orderable: true,
					title: '方向',
					className: 'text-right',
					name: 'direction',
					data: 'direction'

				}, {
					targets: 13,
					orderable: true,
					title: '余额',
					className: 'text-right',
					name: 'debitRemain',
					data: 'debitRemain',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	var formatSubjectFullName = function(val) {

		var count = val.length;

		if (count > 20) {
			return val.substring(0, 16) + '......';
		}
		return val;

	};


	var showRowData = function(event) {
		//$('form').find('input, select, textarea').attr('disabled','disabled');
		//setModalData(formId,table,this);
		//$('form table table button').attr('disabled', 'disabled');
		//$('form table table input').attr('disabled', 'disabled');
		//formdataSet($('#chanceInfo').DataTable().data()[$(this).closest('tr').index()]);
		//$('#modal_form').modal('show');


	};


	/** 行按钮 查看 */
	$('#' + table).on('click', 'button[name="rowView"]', showRowData);

	$('#' + table).on('click', 'button[name="rowRelation"]', function() {
		var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];
		$('#relation_autoId').val(object.autoId);
		$('#relation_userSubjectId').val(object.userSubjectId + '-' + object.userSubjectName);

		if (object.stanSubjectId != null && object.stanSubjectId != '' && object.stanSubjectName != null && object.stanSubjectName != '') {
			$('#relation_stanSubjectId').val(object.stanSubjectId + '-' + object.stanSubjectName);
		} else {
			$('#relation_stanSubjectId').val('');
		}

		if (object.reportSubjectId != null && object.reportSubjectId != '' && object.reportSubjectName != null && object.reportSubjectName != '') {
			$('#relation_reportSubjectId').val(object.reportSubjectId + '-' + object.reportSubjectName);
		} else {
			$('#relation_reportSubjectId').val('');
		}
		$('#modal-setRelation').modal('show');
	});
	//数据加载
	$('#btn_import').click(function() {
		if ($('#detail_customerId').val() == null || $('#detail_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		if ($('#detail_startyyyy').val() == null || $('#detail_startyyyy').val() == '') {
			bdoInfoBox('提示', '请选择开始年份');
			return;
		}
		if ($('#detail_endyyyy').val() == null || $('#detail_endyyyy').val() == '') {
			bdoInfoBox('提示', '请选择结束年份');
			return;
		}
		if ($('#detail_startyyyy').val() > $('#detail_endyyyy').val()) {
			$('#detail_startyyyy').focus();
			bdoInfoBox('提示', '结束年份不能小于开始年份');
			return;
		}
		$.ajax({
			type: 'post',
			url: 'finCenter/SubjectEntry.dataLoading.json',
			data: {
				'menuId': window.sys_menuId,
				'lockProjectId': $('#detail_customerId').val(),
//				'param1': $('#detail_customerId').val(),
				'param2': $('#detail_startyyyy').val(),
				'param3': $('#detail_endyyyy').val()
			},
			dataType: 'json',
			success: function(data) {
				bdoInfoBox('提示', '索引生成中,请稍后查询');
			}
		});
	});

	/** 搜索按钮 */
	$('#btn_search').click(function() {

		if ($('#detail_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		if ($('#detail_startyyyy').val() == '') {
			$('#detail_startyyyy').focus();
			bdoInfoBox('提示', '请选择开始年份');
			return;
		}
		if ($('#detail_endyyyy').val() == '') {
			$('#detail_endyyyy').focus();
			bdoInfoBox('提示', '请选择结束年份');
			return;
		}
		if ($('#detail_startyyyy').val() > $('#detail_endyyyy').val()) {
			$('#detail_startyyyy').focus();
			bdoInfoBox('提示', '结束年份不能小于开始年份');
			return;
		}
		if ($('#detail_startyyyy').val() == $('#detail_endyyyy').val()) {
			var detail_startmonth = $('#detail_startmonth').val();
			var detail_endmonth = $('#detail_endmonth').val();
			if (detail_endmonth < detail_startmonth) {
				$('#detail_startmonth').focus();
				bdoInfoBox('提示', '在同一年里结束月份不能小于开始月份');
				return;
			}
		}
		if ($('#detail_subjectid').val() == '') {
			bdoInfoBox('提示', '请输入科目编号');
			return;
		}

		if ($('#detail_subjectid').val().length == 1) {
			bdoInfoBox('提示', '请选择子级科目');
			return;
		}
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#detail_customerId option:selected').text() + '】');
		var array = $('#detail_subjectid').val().split(',');


		var subjectid = '';
		for (var i = 0; i < array.length; i++) {

			subjectid += '\'' + array[i] + '\'';
			if (i != array.length - 1) {
				subjectid += ',';
			}
		}

		accdetail_view.tableParam.param1 = 'jsq';
		accdetail_view.localParam.urlparam.jsonData = queryFilter();
		accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
//		tbsubject_view.localParam.urlparam.param1=queryFilter();
		jsq(accdetail_view.tableParam, table);
		BdoDataTable(table, accdetail_view);
		$('#subjectEntry').on('xhr.dt', function(e, settings, json, xhr) {
			/*if(json.recordsTotal>2000){
				swal({
					title : '系统提示',
					text : "数据量过大，只显示2000条，请缩小精度再次查询",
					type: 'warning',
					confirmButtonText : '确定',
					allowEscapeKey: true,
					allowOutsideClick: true
				})
			}*/

		});


		$('#subjectEntry tbody').on('click', 'td', function() {
//			alert($(this).html());
		});

		/** 行双击 */
		$('#subjectEntry tbody').on('dblclick', 'tr', function() {
			//var object = $('#subjectEntry').DataTable().data()[$(this).closest('tr').index()];
			var object = $('#subjectEntry').DataTable().row(this).data();
			if (object.voucherId == '') {
				return;
			}
			voucherTab('tab_detailaccount', $('#detail_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});

	/** 单元格点击事件 */
	$('#subjectEntry').on('click', 'td', function() {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_subjectEntry').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subjectEntry').val('(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(data);
			}
			$('#jieguo_subjectEntry').val(data);
		} else {
			value = $('#suanshi_subjectEntry').val();
			jieguo = $('#jieguo_subjectEntry').val();
			if (jieguo.indexOf(',') >= 0) {
				numjieguo = parseFloat(jieguo.split(',').join(''));
			} else {
				numjieguo = parseFloat(jieguo);
			}
			if (data.indexOf(',') >= 0) {
				numdata = parseFloat(data.split(',').join(''));
			} else {
				numdata = parseFloat(data);
			}
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subjectEntry').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(value + '+' + data);
			}
			$('#jieguo_subjectEntry').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
//计算器重置
	$('#jsq_clear_subjectEntry').on('click', function() {

		$('#suanshi_subjectEntry').val('');
		$('#jieguo_subjectEntry').val('');
	});


	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#detail_customerId').val('').trigger('change');
		//getUserYear('detail_startyyyy');
		getUserLocalYear('detail_startyyyy');
		$('#detail_subjectid').val('');
		//getUserYear('detail_endyyyy');
		getUserLocalYear('detail_endyyyy');
		//$('#detail_startmonth').html(ComboDicOption(false, 'month'));
		$('#detail_startmonth').html(ComboLocalDicOption(false, 'month'));
		//$('#detail_endmonth').html(ComboDicOption(false, 'month'));
		$('#detail_endmonth').html(ComboLocalDicOption(false, 'month'));
		$('#detail_voucherFillUser').val('');
		$('#detail_voucherAuditUser').val('');
		$('#detail_vouchartype').val('-1');
		$('#summary_type').val('&&');
		$('#summary1').val('');
		$('#summary2').val('');
		$('#summary3').val('');
		//$('#'+table).dataTable().fnClearTable();
		//$('#'+table).dataTable().fnDestroy();

	});


	/**
	 * 模态框数据 加载
	 */
	var setModalData = function(formId, table, me) {

	};


});
//全屏滚动事件
$('.block').on('mousewheel', function(e) {
	//向上滚动
	var sctop = $('.active .dataTables_scrollBody').scrollTop();
	if (e.deltaY == 1) {
		if (sctop <= 0) {
			return;
		}
		sctop -= 80;
		$('.active .dataTables_scrollBody').scrollTop(sctop);
		//向下滚动
	} else if (e.deltaY == -1) {
		if ($('.active .dataTables_scrollBody')[1]) {
			if ($('.active .dataTables_scrollBody')[1].scrollHeight - 500 <= sctop) {
				return;
			}
		} else if ($('.active .dataTables_scrollBody').scrollHeight - 500 <= sctop) {
			return;
		}
		sctop += 80;
		$('.active .dataTables_scrollBody').scrollTop(sctop);
	}
});


