function MergeNoteInfo(args) {
	let _template
		, _data
		, mount
		, listener
		, uploadDataForm;
	_data = args.data;
	let isParentCompany = args.isParentCompany;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeproject/mergeNoteInfo.html');
	args.template = _template;
	$(args.region).html(_template);
	let $dgNoteTable = $('#dgNoteTable');
	$('#headtitle').empty().text(args.data.text);
	let customerId = window.CUR_CUSTOMERID;
	let projectId = window.CUR_PROJECTID;
	let mergeProjectId = '';
	let mergeCustomerId = '';
	function getParentCompany(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			dataType: 'json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'HB00015',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			success: function(data) {
				if (data.success) {
					mergeCustomerId = data.data[0].mergeCustomerId;
					mergeProjectId = data.data[0].mergeProjectId;
					if (isParentCompany){
						customerId = mergeCustomerId;
						projectId = mergeProjectId;
					}
				}
			}
		});
		return 1;
	}
	let eventBind;
	!eventBind && (eventBind = getParentCompany());
	// 获取所有不等于零的审定数的科目
	let colList = [];
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		dataType: 'json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00198',
			param1: customerId,
			param2: projectId,
			param3: window.CUR_PROJECT_ACC_YEAR,
			start: -1,
			limit: -1
		},
		success: function(data) {
			if (data.success) {
				colList = data.data;
			}
		}
	});

	// 表格设定(附注)
	let cnt = 0;
	let tableDataCfg = {
		localParam: {
			url: 'dgCenter/HbMergeProjectNoteInfo.queryMergeNoteInfo.json',
			urlparam: {
				/*menuId: window.sys_menuId,
				sqlId: 'DG00090',*/
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: customerId,
				param2: projectId,
				limit: -1,
				start: -1
			},
			tabNum: false
		},
		tableParam: {
			scrollX: false,
			// scrollCollapse: true,
			pageLength: 1000,
			select: false,
			// lengthChange: false,
			// serverSide: true,
			ordering: true,
			dom: '<"row"<"col-sm-12"tr>>',
			// order: ['2', 'desc'],
			// paging: false,
			// fixedThead: true,
			fixedHeight: '480px',
			columnDefs: [{
				targets: 0,
				visible: true,
				orderable: true,
				className: 'text-center width-seq',
				title: '序号',
				render: function (data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			},
				{
					targets: 1,
					title: '操作',
					className: "text-center",
					orderable: false,
					// name: 'opt',
					width: '30px',
					render(data, tyep, row, meta) {
						let resultStr = `<div>
											<button class="btn btn-xs btn-success table-btn-operate" type="button" name="editNoteFileBtn" data-action="editNoteFileBtn" data-placement="top" title="查看文件" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-file-excel-o"></i>
											</button>
										`;
						/*					if (row.knoteId != null) {
												resultStr += `<button class="btn btn-xs btn-success table-btn-operate" type="button" name="resetNoteFileBtn" data-action="resetNoteFileBtn" data-placement="top" title="重置文件" data-toggle="tooltip" data-row="` + meta.row + `">
																		<i class="fa fa-repeat"></i>
																	</button>`;
											} else {
												resultStr += `<button class="btn btn-xs btn-success table-btn-operate" type="button" name="delNoteFileBtn" data-action="delNoteFileBtn" data-placement="top" title="删除文件" data-toggle="tooltip" data-row="` + meta.row + `">
																		<i class="fa fa-close"></i>
																	</button>`;
											}*/
						resultStr += `</div>`;
						return resultStr;
					}
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center width-subject-id',
					title: '附注编号',
					name: 'noteNo',
					data: 'noteNo',
					width: '50px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left width-subject-name',
					title: '附注名称',
					name: 'noteName',
					data: 'noteName',
					width: '120px'
				}, {
					targets: 4,
					orderable: false,
					title: '报表科目',
					name: 'colName',
					data: 'colName',
					width: '100px',
					render: function (data, type, row, meta) {
						if (data != null && data != '') {
							return data;
						}
						return '---';
					}
				}, {
					targets: 5,
					orderable: false,
					title: '审定数',
					name: 'auditedAmount',
					data: 'auditedAmount',
					width: '60px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data == null) {
							return '';
						}
						return formatMoney(data);
					}
				}, {
					targets: 6,
					orderable: false,
					title: '年初数',
					name: 'preAuditAmount',
					data: 'preAuditAmount',
					width: '60px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data == null) {
							return '';
						}
						return formatMoney(data);
					}
				},

				{
					targets: 7,
					orderable: false,
					title: '本期校验',
					name: 'curCheck',
					data: 'curCheck',
					width: '60px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data != null) {
							let value = parseFloat(data).toFixed(2);
							if (value == 0) {
								return `<span>&nbsp;` + thousandSeparator(data) + `</span>`;
							} else {
								return `<span style="color: red;">&nbsp;` + thousandSeparator(data) + `</span>`;
							}
						}
						return '---';
					}
				},
				{
					targets: 8,
					orderable: false,
					title: '上期校验',
					name: 'preCheck',
					data: 'preCheck',
					width: '60px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data != null) {
							let value = parseFloat(data).toFixed(2);
							if (value == 0) {
								return `<span>&nbsp;` + thousandSeparator(data) + `</span>`;
							} else {
								return `<span style="color: red;">&nbsp;` + thousandSeparator(data) + `</span>`;
							}
						}
						return '---';
					}
				},

				{
					targets: 8,
					orderable: false,
					title: '状态',
					renderer: 'getDicLabelByVal|boolean',
					name: 'isCompleteNow',
					data: 'isCompleteNow',
					width: '50px',
					className: 'text-center',
					render: function (data, type, row, meta) {
						if (data == 1) {
							return `<span class="label label-success"><i class="fa fa-check"></i>&nbsp;加载完成</span>`;
						} else if (data == 0) {
							return `<span class="label label-danger"><i class="fa fa-spinner fa-pulse"></i>&nbsp;加载中</span>`;
						}
					}
				},
				{
					targets: 9,
					orderable: false,
					title: '禁用',
					renderer: 'getDicLabelByVal|boolean',
					name: 'isForbid',
					data: 'isForbid',
					width: '30px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let checked = data == 1 ? 'checked' : '';
						let disabledStyle = 'css-input-disabled';
						return `<label class="css-input css-checkbox control-label css-checkbox-danger ` + disabledStyle + `"><input type="checkbox" class="note-table-isForbid" data-row="` + meta.row + `" name="isForbid" ` + checked + ` disabled> <span></span></label>`;
					}
				}, {
					targets: 10,
					orderable: false,
					title: '已编辑',
					renderer: 'getDicLabelByVal|boolean',
					name: 'isEdited',
					data: 'isEdited',
					width: '40px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let disabledStyle = 'css-input-disabled';
						let checked = data == 1 ? 'checked' : '';
						return `<label class="css-input css-checkbox control-label css-checkbox-primary ` + disabledStyle + `"><input type="checkbox" class="note-table-isEdited" data-row="` + meta.row + `" name="isEdited" ` + checked + ` disabled> <span></span></label>`;
					}
				}, {
					targets: 11,
					orderable: false,
					title: '已完成',
					renderer: 'getDicLabelByVal|boolean',
					name: 'isFinished',
					data: 'isFinished',
					width: '40px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let disabledStyle = 'css-input-disabled';
						let checked = data == 1 ? 'checked' : '';
						return `<label class="css-input css-checkbox control-label css-checkbox-success ` + disabledStyle + `"><input type="checkbox" class="note-table-isFinished" data-row="` + meta.row + `" name="isFinished" ` + checked + ` disabled> <span></span></label>`;
					}
				}, {
					targets: 12,
					orderable: false,
					title: '更新人',
					name: '__ulastUpdatedUserName',
					data: '__ulastUpdatedUserName',
					width: '50px',
					className: 'text-center'
				}, {
					targets: 13,
					orderable: false,
					title: '更新时间',
					name: 'lastUpdateDate',
					data: 'lastUpdateDate',
					width: '120px',
					className: 'text-right'
				}
			]
		}
	};
	function thousandSeparator(num) {
		return num && (num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2) {
				return $2 + ",";
			}) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($1, $2) {
				return $2 + ",";
			})
		);
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

	/**
	 * 事件绑定
 	 */
	listener = () => {
		// 查询
		$('#btn_search').click(function() {
			fnCondQuery();
		});

		// 重置
		$('#btn_clear').click(function() {
			fnClear();
		});

/*		// 导入
		$('#uploadNodeBtn').click(function() {
			$('#uploadDataModal').modal('show'); // 显示上传文件对话框
		});*/

/*		// 导出
		$('#exportNodeBtn').click(function () {
			fnExportData();
		});*/

		$('#dgNoteTable').on('click', 'tbody > tr > td > div > button[name="mergeNoteInfoBtn"]', function () {
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeProjectNoteInfo.mergeNoteInfo.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					'menuId': window.sys_menuId,
					'param1': customerId,
					'param2': projectId,
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox("成功", "合并成功！")
					} else {
						bdoErrorBox("失败", data.resultInfo.statusText)
					}
				}
			});
		});
		//刷新
		$('#note_refresh').click(function () {
			loadTableData();

		});

		$dgNoteTable.on('click', '.table-btn-operate', function(event) {
			let $target = $(event.currentTarget);
			let rowNum = $target.attr('data-row');
			let table = $dgNoteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let action = $target.attr('data-action');
			if (action === 'editNoteFileBtn') {
				openDgNoteFile.call(this, event);
			}
		});


	};

	function openDgNoteFile(event) {
		let $target = $(event.currentTarget);
		let rowNum = $target.attr('data-row');
		let table = $dgNoteTable.dataTable();
		let rowData = table.fnGetData(rowNum);
		if (rowData.isCompleteNow == 0) {
			bdoInfoBox('提示', '附注尚未加载完成，请稍后查看！', 1500);
			return;
		}
		let nodeData = {
			extraOptions: rowData,
			currentNode: {
				extraOptions: rowData
			},
		};
		nodeData.autoId = nodeData.extraOptions.autoId;
		nodeData.type = 2;
		$.sessionStorage('excelnode', JSON.stringify(nodeData));
		window.open('/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + nodeData.extraOptions.noteNo);
	}

	/**
	 * 挂载
	 */
	mount = () => {
		uploadDataForm = createForm(uploadDataFormCfg); // 初始化文件上传对话框
		listener();
		loadTableData();
	};

	// 导入文件（文件上传成功后调用）
	function fnImportDataFile(uploadFileInfo) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeProjectNoteInfo.importTbByDataFile.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': mergeProjectId,       // 被合并项目编号
				'param2': uploadFileInfo.path,  // 临时文件路径
				'param3': uploadFileInfo.name  // 临时文件名
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功');
					$('#uploadDataModal').modal('hide'); // 关闭上传文件对话框
					loadTableData();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	}

	// 查询
	function fnCondQuery() {
		loadTableData();
	}

	// 重置
	function fnClear() {
		for (var i = 0; i < $("#search-condition .form-material").length; i++) {
			$($('#search-condition .form-material')[i].children[0]).val('');
		}
	}

	// 加载表格数据并显示
	function loadTableData() {
		// $('#dgNoteTable').DataTable().ajax.reload();
		//
		// return;
		let url = 'dgCenter/HbMergeProjectNoteInfo.queryMergeNoteInfo.json';
		let paramData = {};

		if (isParentCompany){
			url = 'dgCenter/DgNote.getAllNoteInfo.json';
			paramData = {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': customerId,
				'param2': projectId,
				'param3': mergeProjectId,
				'param4': $('#note_noteNo').val(),
				'param5': $('#note_noteName').val(),
				'param6': $('#note_colName').val(),
				'param7': $('#note_isForbid').val(),
				'param8': $('#note_isEdited').val(),
				'param9': $('#note_isFinished').val(),
				start: -1,
				limit:-1,
			};
		}else {
			mergeProjectId = window.CUR_PROJECTID;
			let json = {
				customerId: customerId,
				mergeProjectId: mergeProjectId,
				projectId: projectId
			};
			paramData = {
				'jsonData': JSON.stringify(json)
			};
		}
		$.ajax({
			type: 'post',
			url: url,
			data: paramData,
			dataType: 'json',
			success: function(data) {
				if ($('#dgNoteTable').hasClass('dataTable')) {
					$('#dgNoteTable').DataTable().clear();
					$('#dgNoteTable').DataTable().destroy();
					$('#dgNoteTable').empty();
				}

				tableDataCfg.localParam.data = data.data; //附注数据
				BdoDataTable('dgNoteTable', tableDataCfg);
			}
		});

}

	// 导出
	function fnExportData(){
		return BdoFaithUtil.saveAs('dgCenter/HbMergeProjectNoteInfo.downloadDgNote.json', '附注', {
			requestData: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': mergeProjectId
			},
			method: 'POST'
		});
	}

	/**
	 *  显示
	 */
	mount();
}


