/**
 * 底稿附件
 */
var DgAttachPage = (agrs) => {
	var _template
		, _data
		, mount
		, cnt
		, uploadAttachCfg
		, uploadAttachForm
		, listener
		, dgAttachTable;
	_template = agrs.template || tplLoader('dgCenter/html/dg/dgAttach.html');
	agrs.template = _template;
	_data = agrs.data;
	$('#dgtitle').empty().text(agrs.data.nodeName);
	/**
	 * 事件绑定写在这里
	 */
	listener = () => {
		// 上传文件
		$('#uploadDgAttachBtn').click(event => {
			uploadAttachForm.jsonData.subjecttreeId = _data.extraOptions.autoId;
			//审计程序ID
			uploadAttachForm.jsonData.autoId = _data.programInfo.autoId;
			//项目编号
			uploadAttachForm.jsonData.projectId = _data.programInfo.projectId;
			//客户编号
			uploadAttachForm.jsonData.customerId = _data.programInfo.customerId;
			//底稿文件ID
			uploadAttachForm.jsonData.workpaperId = _data.programInfo.workpaperId;
			uploadAttachForm.jsonData.subjectId = _data.programInfo.subjectId;
			uploadAttachForm.jsonData.subjectName = _data.programInfo.subjectName;
			uploadAttachForm.jsonData.indexId = _data.programInfo.indexId;
			uploadAttachForm.jsonData.dgAttachAutoId = null;
			uploadAttachForm.uploadMode = 'STD';

			$('#uploadAttachFormModal').modal('show');
		});
		// 刷新Table
		$('#refreshDgAttachTableBtn').click(event => {
			$('#dgAttachTable').DataTable().ajax.reload();
		});

		// 重新上传附件
		$('#dgAttachTable').on('click', 'button.table-btn-operate[name="reUploadFile"]', event => {
			let table = $('#dgAttachTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));

			uploadAttachForm.jsonData.subjecttreeId = _data.extraOptions.autoId;
			//审计程序ID
			uploadAttachForm.jsonData.autoId = _data.programInfo.autoId;
			//项目编号
			uploadAttachForm.jsonData.projectId = _data.programInfo.projectId;
			//客户编号
			uploadAttachForm.jsonData.customerId = _data.programInfo.customerId;
			//底稿文件ID
			uploadAttachForm.jsonData.workpaperId = _data.programInfo.workpaperId;
			uploadAttachForm.jsonData.subjectId = _data.programInfo.subjectId;
			uploadAttachForm.jsonData.subjectName = _data.programInfo.subjectName;
			uploadAttachForm.jsonData.indexId = _data.programInfo.indexId;

			uploadAttachForm.jsonData.dgAttachAutoId = rowData.autoId;
			uploadAttachForm.uploadMode = 'RE';
			$('#uploadAttachFormModal').modal('show');
		});

		// 下载附件
		$('#dgAttachTable').on('click', 'button.table-btn-operate[name="downloadDgAttach"]', event => {
			_data.parent.dgAttachSider.autoHide = false;
			var table = $('#dgAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			downloadFile('dgCenter/DgDownload.downloadAttach.json', {
				param1: rowData.autoId,
				param2: rowData.customerId
			});
			_data.parent.dgAttachSider.autoHide = true;

		});
		// 在线预览
		$('#dgAttachTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
			_data.parent.dgAttachSider.autoHide = false;
			var table = $('#dgAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$.ajax({
				url: 'dgCenter/DgMain.queryAttachFileExistence.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: rowData.autoId,
					param2: rowData.customerId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var fileSuffix = rowData.fileName.substring(rowData.fileName.lastIndexOf(".") + 1).toLowerCase();
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.fileName , rowData.fileName ,'location=no');
						} else if (fileSuffix === "xlsx"){
							rowData.pageType = 1;
							var nodeData = {
								extraOptions: rowData,
								currentNode: {
									extraOptions: rowData
								}
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=previewFile');
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					_data.parent.dgAttachSider.autoHide = true;
				}
			});
		});
		// 删除附件
		$('#dgAttachTable').on('click', 'button.table-btn-operate[name="delDgAttach"]', event => {
			_data.parent.dgAttachSider.autoHide = false;
			var table = $('#dgAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '确认删除底稿附件【' + rowData.fileName + '】?', function() {
				_data.parent.dgAttachSider.autoHide = false;
				$.ajax({
					url: 'dgCenter/DgMain.deleteAttach.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.autoId,
						param2: rowData.customerId,
						param3: rowData.auditprogramId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							$('#dgAttachTable').DataTable().ajax.reload();
							_data.parent.dgAttachSider.show();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
							_data.parent.dgAttachSider.show();
						}
						_data.parent.dgAttachSider.autoHide = true;
					}
				});
			});
			//_data.parent.dgAttachSider.autoHide = true;
		});

		$('#uploadAttachFormModal').on('show.bs.modal', e => {
			_data.parent.dgAttachSider.autoHide = false;
		});

		$('#uploadAttachFormModal').on('hidden.bs.modal', e => {
			_data.parent.dgAttachSider.autoHide = true;
		});
	};
	/**
	 * 初始化写在这里
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		uploadAttachForm = createForm(uploadAttachCfg);
		BdoDataTable('dgAttachTable', dgAttachTable);
		listener();
	};
	dgAttachTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00012',
				param1: _data.programInfo.autoId,
				param2: _data.programInfo.customerId
			},
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			scrollY : '250px',
			scrollCollapse: true,
			pageLength: 30,
			select: true,
//			ordering : true,
//			order : [2, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '480px',
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center',
				title: '处理',
				data: null,
				width: '100px',
				render: function(data, type, row, meta) {
					var fileType = data.suffix.toLowerCase();
					var renderStr = '';
					// renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="reUploadFile" data-placement="top" title="重新上传" data-toggle="tooltip" data-row="' + meta.row + '">'
					// 	+ '	<i class="fa fa-upload"></i>'
					// 	+ '</button>';
					renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="downloadDgAttach" data-placement="top" title="下载" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-download"></i>'
						+ '</button>';
					if (fileType == 'pdf' || fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'xlsx') {
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="onlinepreview" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-eye"></i>'
							+ '</button>';
					}
					renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="delDgAttach" data-placement="top" title="删除" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-times-circle-o"></i>'
						+ '</button>';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '索引号',
				name: 'fileIndexId',
				data: 'fileIndexId',
				width: '100px'
			}, {
				targets: ++cnt,
				orderable: true,
				title: '底稿名称',
				name: 'dgName',
				data: 'dgName',
				width: '150px'
			}, {
				targets: ++cnt,
				orderable: true,
				title: '文件名称',
				name: 'fileName',
				data: 'fileName',
				width: '150px'
			}, {
				targets: ++cnt,
				orderable: true,
				className: 'text-center',
				title: '是否被关联',
				name: 'referredFlg',
				data: 'referredFlg',
				width: '80px',
				render: function(data, type, row, meta) {
					var renderStr = data == 1 ? '是' : '否';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '上传时间',
				name: 'uploadDate',
				data: 'uploadDate',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatSimDate(new Date(data));
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '上传人',
				name: '__uuploadUserName',
				data: '__uuploadUserName',
				width: '150px'
			}]
		}
	};

	uploadAttachCfg = {
		options: {
			propsData: {
				jsonData: {
					attach: [],
					autoId: null,
					projectId: null,
					customerId: null,
					workpaperId: null,
					subjecttreeId: null,
					subjectId: null,
					subjectName: null,
					indexId: null,
					dgAttachAutoId: null
				}
			}
		},
		props: {
			jsonData: Object
		},
		display: 'tableform-one',
		column: 1,
		id: 'uploadAttachForm',
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgDownload.uploadAttach.json',
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#uploadAttachFormModal').modal('hide');
							//_data.parent.dgAttachSider.show();
							$('#dgAttachTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				},
				uploadMode: 'STD'
			};
		},
		methods: {
			onUploadAttachFileClick(event) {
				var fileCount = $('#attach').fileinput('getFilesCount');
				if (fileCount <= 0) {
					bdoErrorBox('失败', '当前无任何文件！');
					return;
				}
				this.uploadFile(true);
			},
			resetFileClick(event) {
				$('#attach').fileinput('refresh');
				$('#attach').fileinput('clear');
				$('#attach').fileinput('reset');
			}
		},
		buttons: [{
			id: 'resetFileBtn',
			icon: 'fa fa-refresh',
			style: 'btn-primary',
			text: '重置',
			typeAttr: {
				'v-on:click': 'resetFileClick'
			}
		}, {
			id: 'uploadAttachFileBtn',
			icon: 'fa fa-upload',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadAttachFileClick'
			}
		}, {
			id: 'cancelUploadAttachFileBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id: 'attach',
			type: 'file',
			label: '附件',
			rowspan: 1,
			colspan: 2,
			validate: {
				rules: {}
			},
			typeAttr: {
				multiple: true
			},
			show: true,
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData: function() {
						return {};
					}
				}
			}
		}]
	};

	function formatSimDate(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		month = month < 10 ? ('0' + month) : month;
		var date = now.getDate();
		date = date < 10 ? ('0' + date) : date;
		var hour = now.getHours();
		hour = hour < 10 ? ('0' + hour) : hour;
		var minute = now.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		var second = now.getSeconds();
		second = second < 10 ? ('0' + second) : second;
		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
	}

	mount();
};