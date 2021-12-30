/**
 * 报告
 */
function DgReportPage(context) {
	let $context = context ? $('#dgReportPage') : $;
	let $tabContent = $('#navTabContent', $context);
	let $dgReportTable = $('#dgReportTable', $tabContent);
	let $createReportBtn = $('#createReportBtn', $tabContent);
	let $refershReportBtn = $('#refershReportBtn', $tabContent);
	let $modalEnsureBtn = $('#modal_ensure', $context);
	let $uploadTplFormModal = $('#uploadTplFormModal', $context);
	let $templateModal = $('#modal-select', $context);
	let $everUsedTemplate = $('#everUsedTemplate', $context);
	let dgReportUploadForm;

	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
		$(this).draggable({
			handle: '.block-title',
			cursor: 'move'
		});
		$(this).css('overflow', 'hidden');
	});*/

	/**
	 * 一览配置
	 */
	const dgReportTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00105',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			scrollX: true,
			pageLength: 30,
			//lengthChange : false,
			ordering: true,
			order: [2, 'desc'],
			serverSide: true,
			// dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			columnDefs: [
			 	{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '操作',
					name: 'opt',
					width: '50px',
					render(data, tyep, row, meta) {
						/*<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="previewReportBtn" data-action="previewReportBtn" data-placement="top" title="查看" data-toggle="tooltip" data-row="` + meta.row + `">
							<i class="fa fa-eye"></i>
						</button>*/
						let resultStr = `<div>
											<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="downloadReportBtn" data-action="downloadReportBtn" data-placement="top" title="下载" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-download"></i>
											</button>
										</div>`;
						return resultStr;
					}
				},
				{
					targets: 2,
					orderable: true,
					title: '报告名称',
					name: 'reportName',
					data: 'reportName',
					width: '150px'
				}, {
					targets: 3,
					orderable: true,
					className: 'text-right',
					title: '开始生成时间',
					name: 'startTime',
					data: 'startTime',
					width: '150px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-right',
					title: '完成时间',
					name: 'completeTime',
					data: 'completeTime',
					width: '150px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '报告状态',
					name: 'reportStatus',
					data: 'reportStatus',
					width: '60px',
					render(data, tyep, row, meta) {
						if (data == 2) {
							return `<span class="label label-danger"><i class="fa fa-exclamation-triangle"></i>&nbsp;生成失败</span>`;
						} else if (data == 1) {
							return `<span class="label label-success"><i class="fa fa-check"></i>&nbsp;已生成</span>`;
						} else if (data == 0) {
							return `<span class="label label-danger"><i class="fa fa-spinner fa-pulse"></i>&nbsp;生成中</span>`;
						}
					}
				}, {
					targets: 6,
					orderable: true,
					title: '报告生成信息',
					name: 'reportMessage',
					data: 'reportMessage',
					width: '100px'
				}
			]
		}
	};

	const dgReportUploadFiltComponet = {
		id: 'uploadTplForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					customerName: window.CUR_CUSTOMERNAME
				}
			}
		},
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgReport.uploadReport.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							var paramMap = data.data[0].paramMap;
							$.ajax({
								url: 'dgCenter/DgReport.generateReport.json',
								type: 'post',
								data: {
									menuId: window.sys_menuId,
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: JSON.stringify(paramMap)
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										swal({
											title: '正在生成报告...',
											html: '请稍后查看!',
											type: 'info',
											allowOutsideClick: false,
											allowEscapeKey: false,
											timer: 2000
										}).catch(swal.noop);
										$uploadTplFormModal.modal('hide');
										$dgReportTable.DataTable().ajax.reload();
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onCreateReportClick() {
				let file = $('#workpager').fileinput('getFileStack');
				if (!file || file.length < 1) {
					bdoInfoBox('提示', '请先选择文件');
					return;
				}
				bdoInProcessingBox('上传生成中...');
				this.uploadFile(true);
			},
			onCancelClick() {
				$uploadTplFormModal.modal('hide');
			}
		},
		buttons: [{
			id: 'createReportClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onCreateReportClick'
			}
		}, {
			id: 'cancelCreateReportClickBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelClick'
			}
		}],
		items: [{
			id: 'workpager',
			type: 'file',
			label: '上传报告模板',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false
			},
			validate: {
				rules: {}
			},
			plugin: {
				name: 'fileinput',
				options: {
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					allowedFileExtensions: ['docx'],//允许的文件类型]
					maxFilesNum: 1,
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};

	/**
	 * 绑定事件
	 */
	function eventBind() {
		$modalEnsureBtn.click(function() {
			var type = $('input[type=radio][name=report_use]:checked').attr('data-result');
			if (type == '1') {
				if ($everUsedTemplate.html() != '无') {
					bdoInProcessingBox('生成中...');
					$.ajax({
						type: 'POST',
						url: 'dgCenter/DgReport.createInitReport.json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								swal({
									title: '正在生成报告...',
									html: '请稍后查看!',
									type: 'info',
									allowOutsideClick: false,
									allowEscapeKey: false,
									timer: 2000
								}).catch(swal.noop);
								$templateModal.modal('hide');
								$dgReportTable.DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				} else {
					$templateModal.modal('hide');
					$uploadTplFormModal.modal('show');
				}
			} else if (type == '2') {
				$templateModal.modal('hide');
				$uploadTplFormModal.modal('show');
			}
		});
		$createReportBtn.click(function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00157',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data.length > 0) {
							$everUsedTemplate.html(data.data[0].templateName);
						} else {
							$everUsedTemplate.html('无');
						}
						$templateModal.modal('show');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		/**
		 * 刷新报告按钮事件
		 */
		/*$refershReportBtn.click(function() {
			$dgReportTable.DataTable().ajax.reload();
		});*/
		/**
		 * 编辑按钮
		 */
		$dgReportTable.on('click', '.table-btn-operate', function(event) {
			let $target = $(event.currentTarget);
			let rowNum = $target.attr('data-row');
			let table = $dgReportTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let action = $target.attr('data-action');
			switch (action) {
				case 'previewReportBtn':
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgReport.isReportComplete.json',
						data: {
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							param2: window.CUR_CUSTOMERID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								window.open('dgCenter/DgReport.previewReport.json?param1=' + rowData.autoId + '&param2=' + window.CUR_CUSTOMERID, rowData.fileName, 'location=no');
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
					break;
				case 'downloadReportBtn':
					/*var isManager = true;
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async : false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00197',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(sys_userId != data.data[0].manager){
									isManager = false;
								}
							}
						}
					});
					if(!isManager){
						bdoInfoBox('提示', '非项目负责人无权限下载报告！');
						return;
					}*/
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgReport.isReportComplete.json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							menuId: window.sys_menuId,
							param1: rowData.autoId,
							param2: window.CUR_CUSTOMERID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								downloadFile('dgCenter/DgReport.downloadReport.json', {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: rowData.autoId,
									param2: window.CUR_CUSTOMERID
								});
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
					break;
			}
		});
	}

	/**
	 * 初始化页面
	 */
	function init() {
		let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
		$('#dgReportIndex').text('【' + node.extraOptions.indexId + '】');
		BdoDataTable('dgReportTable', dgReportTableCfg);
		dgReportUploadForm = createForm(dgReportUploadFiltComponet);
		eventBind();
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(function() {
	new DgReportPage($('#dgReportPage')).init();
});
