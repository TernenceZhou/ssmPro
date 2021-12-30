$(document).ready(function() {
	uiBlocksApi(false, 'init');

	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	//$('#benford_startDate').val(accyear - 3);
	//$('#benford_endDate').val(accyear - 1);
	var examId = 0;
	var userType = 1;
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 0,
		minViewMode: 0,
		minuteStep:1,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd' //日期显示格式
	});
	//时间毫秒数转时间
	function getMyDate(str) {
		if (str != null && str != '') {
			var oDate = new Date(str),
				oYear = oDate.getFullYear(),
				oMonth = oDate.getMonth() + 1,
				oDay = oDate.getDate(),
				oHour = oDate.getHours(),
				oMin = oDate.getMinutes(),
				oSen = oDate.getSeconds(),
				oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
			return oTime;
		} else {
			return '';
		}
	}
	
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}

	/** table 属性 */
	var exam_view_count = 1;
	var exam_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00006',
				menuId: window.sys_menuId,
				param1: $('#exam_name').val(),
				param2: '',
				param3: window.CUR_USERID,
				param9: '1', //查询未关闭的
				param10: '1' //教学考试
			}
		},
		tableParam: {
			select: false,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examEditBtn" data-placement="top" title="考试" data-toggle="tooltip"><i class="fa fa-file-excel-o"></i></button>';
						return renderStr;
					}
				}, {
					targets: exam_view_count++,
					orderable: true,
					className: 'text-center',
					title: '考试名称',
					name: 'examName',
					data: 'examName',
					width: '100px'
				}/*, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}*/, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试结束时间',
					name: 'endDate',
					data: 'endDate',
					width: '60px',
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}

				}, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试状态',
					name: 'examStatusName',
					data: 'examStatusName',
					width: '50px'
				}/*, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '审核人',
					name: '__uauditUserName',
					data: '__uauditUserName',
					width: '60px'
				}*/, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '审核状态',
					name: 'auditStatusName',
					data: 'auditStatusName',
					width: '50px'
				}
			]
		}
	};

	/** 搜索按钮 */
	$('#btn_exam_search').click(function() {
		exam_view.localParam.urlparam.param1 = $('#exam_name').val();
		//exam_view.localParam.urlparam.param2 = $('#subject_name').val();
		BdoDataTable('examTable', exam_view);
	});
	$('#btn_exam_search').click();
	//编辑
	$('#examTable').on('click', 'button[name="examEditBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		$.ajax({
			type: 'post',
			url: 'tote/ToteExam.compareEndTimeExam.json',
			data: {
				menuId: window.sys_menuId,
				param1: object.examId
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(data.data[0].result || object.examStatus == 3){
						var nodeData = {
							extraOptions: object,
							currentNode: {
								extraOptions: object
							}
						};
						nodeData.examId = object.examId;
						$.sessionStorage('fileViewNode', JSON.stringify(nodeData));
						window.open('/Faith/bdotote.do?m=openToteExamFileView');
					}else{
						bdoInfoBox('考试已结束，正在批阅中...');
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});
