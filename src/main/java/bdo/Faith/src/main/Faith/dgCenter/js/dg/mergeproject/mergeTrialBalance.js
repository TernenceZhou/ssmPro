function MergeTrialBalance(args) {
	let _template
		, _data
		, mount
		, listener
		, uploadDataForm;
	_data = args.data;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeproject/mergeTrialBalance.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	$('#title_index').text('【' + _data.extraOptions.indexId + '】');

	let mergeProjectId = _data.extraOptions.subjectId; // 被合并项目的项目编号
	let year = window.CUR_PROJECT_ACC_YEAR - 0; // 合并项目的年度

	// 表格设定（校验项表格）
	let cnt = 1;
	let tableCheckCfg = {
		localParam: {
			data: [],
		},
		tableParam: {
			scrollX: true,
			scrollCollapse: true,
			pageLength: 1000,
			select: true,
			lengthChange: false,
			serverSide: true,
			ordering: false,
			dom: '<"row"<"col-sm-12"tr>>',
			paging: false,
			fixedThead: true,
			fixedHeight: '480px',
			columnDefs: [{
				targets: cnt++,
				className: 'text-left width-jyx',
				title: '校验项',
				name: 'checkCal',
				data: 'checkCal'
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '未审数',
				name: 'unAuditAmount',
				data: 'unAuditAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '审计调整数',
				name: 'adjustAmount',
				data: 'adjustAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '审定数',
				name: 'auditAmount',
				data: 'auditAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '未审数',
				name: 'preUnAuditAmount',
				data: 'preUnAuditAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '审计调整数',
				name: 'preAdjustAmount',
				data: 'preAdjustAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '审定数',
				name: 'preAuditAmount',
				data: 'preAuditAmount',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}]
		}
	};

	// 表格设定（试算平衡表）
	cnt = 0;
	let tableDetailCfg = {
		localParam: {
			data: [],
		},
		tableParam: {
			scrollX: true,
			scrollCollapse: true,
			pageLength: 1000,
			select: true,
			lengthChange: false,
			serverSide: true,
			ordering: false,
			dom: '<"row"<"col-sm-12"tr>>',
			paging: false,
			fixedThead: true,
			fixedHeight: '480px',
			columnDefs: [{
				targets: cnt++,
				className: 'text-center width-seq',
				title: '序号',
				visible: true,
				render: function(data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			}, {
				targets: cnt++,
				className: 'text-center width-subject-id',
				title: 'TB科目编号',
				name: 'subjectId',
				data: 'subjectId',
			}, {
				targets: cnt++,
				className: 'text-left width-subject-name',
				title: '科目名称',
				name: 'subjectName',
				data: 'subjectName',
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '未审数',
				name: 'unAuditAmount',
				data: 'unAuditAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '审计调整数',
				name: 'adjustAmount',
				data: 'adjustAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: year + '年<br>' + '审定数',
				name: 'auditAmount',
				data: 'auditAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '未审数',
				name: 'preUnAuditAmount',
				data: 'preUnAuditAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '审计调整数',
				name: 'preAdjustAmount',
				data: 'preAdjustAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: cnt++,
				className: 'text-right width-je',
				title: (year - 1) + '年<br>' + '审定数',
				name: 'preAuditAmount',
				data: 'preAuditAmount',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		}
	};

	function formatMoney (val) {
		if (isNaN(val)) {
			return val;
		}
		val = val + '';
		if (val == '') {
			return '';
		} else if (val > 0) {
			return '<span style="color:green;align=right;">' + formatMoney2(val, 1) + '</span>';
		} else if (val < 0) {
			return '<span style="color:green;">' + formatMoney2(val, 1) + '</span>';
		} else {
			return '0';
		}
	}
	function formatMoney2(s, type) {
		if (!$.isNumeric(s))
			return '0.00';
		s = formatCurrency(s);
		if (type == 0) {
			let a = s.split('.');
			if (a[1] == '00') {
				s = a[0];
			}
		}
		return s;
	}

	// 文件上传对话框配置
	const uploadDataFormCfg = {
		options: {
			propsData: {
				jsonData: {
					dataFile: [],
					customerId: '',
					projectId: ''
				}
			}
		},
		props: {
			jsonData: Object
		},
		display: 'tableform-one',
		column: 1,
		id: 'uploadDataForm',
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgMergeProject.uploadDataFile.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							// 上传成功后再次提交，进行导入处理
							fnImportDataFile(data.data[0]);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onUploadDataFileBtn() {
				let file = $('#dataFile').fileinput('getFileStack');
				if (!file || file.length < 1) {
					bdoInfoBox('提示', '请先选择文件');
					return;
				}
				this.uploadFile(true);
			}
		},
		buttons: [{
			id: 'uploadDataFileBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadDataFileBtn'
			}
		}, {
			id: 'cancelUploadBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id: 'dataFile',
			type: 'file',
			label: '数据文件',
			rowspan: 1,
			colspan: 2,
			validate: {
				rules: {}
			},
			show: true,
			typeAttr: {
				multiple: false
			},
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};

	// 导入文件（文件上传成功后调用）
	function fnImportDataFile(uploadFileInfo){
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeProjectTrialBalance.importTbByDataFile.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': mergeProjectId,       // 被合并项目编号
				'param2': uploadFileInfo.path,  // 临时文件路径
				'param3': uploadFileInfo.name,  // 临时文件名
			},
			dataType: 'json',
			success: function (data) {
				if (data.success){
					bdoSuccessBox("成功");
					$('#uploadDataModal').modal('hide'); // 关闭上传文件对话框
					loadTableData();
				}else{
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	}

	/**
	 * 事件绑定
	 */
	listener = () => {

		// 刷新
		$('#btnRefreshTables').click(function(){
			loadTableData();
		});

		// 导入
		$('#tb_upload').click(function() {
			$('#uploadDataModal').modal('show'); // 显示上传文件对话框
		});


	};

	/**
	 * 挂载
	 */
	mount = () => {
		uploadDataForm = createForm(uploadDataFormCfg); // 初始化文件上传对话框
		listener();
		loadTableData();
	};

	// 加载表格数据并显示
	function loadTableData(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeProjectTrialBalance.findHbTbData.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': window.CUR_PROJECTID,
				'param2': window.CUR_CUSTOMERID,
				'param3': mergeProjectId
			},
			dataType: 'json',
			success: function (data) {
				if ($('#tableCheck').hasClass('dataTable')) {
					$('#tableCheck').DataTable().clear();
					$('#tableCheck').DataTable().destroy();
					$('#tableCheck').empty();
				}
				if ($('#tableDetail').hasClass('dataTable')) {
					$('#tableDetail').DataTable().clear();
					$('#tableDetail').DataTable().destroy();
					$('#tableDetail').empty();
				}

				tableCheckCfg.localParam.data = data.data[0].tbChecklist; // 校验项
				tableDetailCfg.localParam.data = data.data[0].tblist; // 明细
				BdoDataTable('tableCheck', tableCheckCfg);
				BdoDataTable('tableDetail', tableDetailCfg);
			}
		});


	}

	// 显示
	mount();
}


