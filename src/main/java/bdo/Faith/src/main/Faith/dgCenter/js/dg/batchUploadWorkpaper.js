/**
 * 批量上传底稿
 */
function BatchUploadWorkpaperPage(agrs) {
	let _data = agrs.data
		, _template = agrs.template || tplLoader('dgCenter/html/dg/batchUploadWorkpaper.html')
		, programStores;
	$(agrs.region).html(_template);
	let cnt = 0;
	let auditProgramSelect = '';
	let page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: agrs.region
		/**
		 * 绑定事件
		 */
		, events: {
			'#showBatchUploadModalBtn': 'click,onShowBatchUploadModal',
			'#uploadBatchDgBtn': 'click,uploadBatchDg'
		}
		/**
		 * 模板
		 */
		, _template: _template
		/**
		 * 节点信息
		 */
		, _data: agrs.data
		/**
		 * 初始化
		 */
		, init(options) {
			this.batchUploadWPForm = createForm(this.batchUploadWPFormCfg);
			BdoDataTable('batchWPtempTable', this.batchWPtempTableCfg);
			OneUI.initHelper('slimscroll');
			this.eventBind();
		}
		/**
		 * 上传文件modal
		 */
		, batchUploadWPFormCfg: {
			options: {
				propsData: {
					jsonData: {
						batchWorkpaper: [],
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
			id: 'batchUploadWPForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgWapper.batchUploadDgFile.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								$('#filePath').val(data.data[0].path);
								$('#batchUploadWPFormModal').modal('hide');
								$('#tmpDgModal').modal('show');
							} else {
								if(data.data && data.data[0] && data.data[0].extraLinkList){
									var displaytext = '上传的所有文件中，存在&nbsp;<font color="red">' + data.data[0].extraLinkList.length + '</font>&nbsp;处外部文件链接！';
									for(var rowData of data.data[0].extraLinkList){
										displaytext = displaytext + '<br>文件名：<font color="red">' + rowData.substring(0, rowData.indexOf(':')) + '</font>';
										displaytext = displaytext + '<br>sheet名称：<font color="red">' + rowData.substring(rowData.indexOf(':') + 1, rowData.lastIndexOf(':')) + '</font>';
										displaytext = displaytext + '&nbsp;&nbsp;单元格位置：<font color="red">' + rowData.substring(rowData.lastIndexOf(':') + 1) + '</font>';
									}
									bdoErrorBox('失败', displaytext);
								}else{
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						}
					}
				};
			},
			methods: {
				onBatchUploadWPBtn(event) {
					let file = $('#batchWorkpaper').fileinput('getFileStack');
					if (!file || file.length < 1) {
						bdoInfoBox('提示', '请选择导入文件');
						return;
					}
					let check = true;
					$.each(file, function(i, val) {
						if (!/.xlsx/.test(val.name)) {
							check = false;
						}
					});
					if (!check) {
						bdoInfoBox('提示', '不正确的文件扩展名.只支持\'xlsx\'的文件扩展名.');
						return;
					}
					this.jsonData.customerId = _data.extraOptions.customerId;
					this.jsonData.projectId = _data.extraOptions.projectId;
					this.uploadFile(true);
				}
			},
			buttons: [{
				id: 'batchUploadWPBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '上传',
				typeAttr: {
					'v-on:click': 'onBatchUploadWPBtn'
				}
			}, {
				id: 'cancelUploadModelBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'data-dismiss': 'modal'
				}
			}],
			items: [{
				id: 'batchWorkpaper',
				type: 'file',
				label: '底稿',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {}
				},
				show: true,
				typeAttr: {
					multiple: true
				},
				plugin: {
					name: 'fileinput',
					options: {
						uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
						allowedFileExtensions: ['xlsx'],//允许的文件类型]
						uploadExtraData() {
							return {};
						}
					}
				}
			}]
		}
		/**
		 * 临时文件列表
		 */
		, batchWPtempTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00070',
						param1: _data.extraOptions.customerId,
						param2: _data.extraOptions.projectId
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '150px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '100px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '底稿名称',
					name: 'tplFileName',
					data: 'tplFileName',
					width: '150px',
					render(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + data + '</a>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上传人',
					name: '__uuploadUser',
					data: '__uuploadUser',
					width: '150px',
					render(data) {
						if ($.isPlainObject(data)) {
							return data.userName;
						}
						return '';
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上传日期',
					name: 'uploadDate',
					data: 'uploadDate',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '状态',
					name: 'matchState',
					data: 'matchState',
					width: '50px',
					className: 'text-center',
					render(data, type, row, meta) {
						if (row.matchState == 1) {
							return '<i class="si si-check fa-2x" style="color: #07ea6d"></i>';
						} else {
							return '<i class="si si-close fa-2x" style="color: red"></i>';
						}
					}
				}, {
					targets: ++cnt,
					name: 'workpaperId',
					data: 'workpaperId',
					visible: false
				}]
			}
		}
		, onShowBatchUploadModal() {
			auditProgramSelect;
			if(auditProgramSelect != null && auditProgramSelect != ''){
				$('#batchUploadWPFormModal').modal('show');
			}else{
				bdoInfoBox('提示', '请先生成底稿！');
			}
		}
		, onMatchWPFormModal(event) {
			let table = $('#batchWPtempTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$('#matchWPFormModal').modal('show');
		}, uploadBatchDg() {
			var table = $('#dgMatchTable').dataTable();
			var nTrs = table.fnGetNodes();
			if(nTrs.length == 0){
				bdoInfoBox('提示','上传底稿为空！');
				return;
			}
			bdoInProcessingBox('批量上传中');
			var param = {};
			for (var i = 0; i < nTrs.length; i++) {
				var rowData = table.fnGetData(nTrs[i]);
				var fileName, value, label;
				if (rowData[2] != '') {
					fileName = rowData[1];
					label = rowData[2];
					value = rowData[3];
				} else {
					fileName = rowData[1];
					label = $(table.fnGetNodes(nTrs[i])).find('option:selected').text();
					value = $(table.fnGetNodes(nTrs[i])).find('option:selected').val();
				}
				param[i] = {
					fileName: fileName,
					label: label,
					value: value
				};
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.checkTagOrLinkExistence.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: _data.extraOptions.customerId,
					param2: _data.extraOptions.projectId,
					param3: $('#filePath').val(),
					param4: JSON.stringify(param)
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let doIt = () => {
							bdoInProcessingBox('批量上传中');
							var paramM = {
								menuId: window.sys_menuId,
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: _data.extraOptions.customerId,
								param2: _data.extraOptions.projectId,
								param3: data.data[0].filePath,
								param4: data.data[0].param,
								param5: JSON.stringify(data.data[0].keyListMap)
							};
							$.ajax({
								url: 'dgCenter/DgWapper.coverDgFile.json',
								type: 'post',
								data: paramM,
								dataType: 'json',
								success(data) {
									if (data.success) {
										$('#batchWPtempTable').DataTable().ajax.reload();
										$('#tmpDgModal').modal('hide');
										bdoSuccessBox('成功', data.resultInfo.statusText);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						};
						var dataListMap = data.data[0].dataListMap;
						if(dataListMap){
							var text = '<div>批量上传底稿文件对比原底稿文件相比,不存在以下单元格</div><br>';
							text += '<div style="height: 250px;overflow-y: auto"><font color="red">';
							for(var key in dataListMap){
								var value = dataListMap[key];
								if(key.indexOf('标签:') != -1){
									text += '标签:' + value + '<br>';
								} else {
									text += '单向链接:' + value + '<br>';
								}
							}
							text += '</font></div><br>是否确定上传？';
							bdoConfirmBox('提示', text, isConfirm => {
								doIt();
							});
						} else {
							doIt();
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}/*, uploadBatchDg() {
			var table = $('#dgMatchTable').dataTable();
			var nTrs = table.fnGetNodes();
			var param = {};
			for (var i = 0; i < nTrs.length; i++) {
				var rowData = table.fnGetData(nTrs[i]);
				var fileName, value, label;
				if (rowData[2] != '') {
					fileName = rowData[1];
					label = rowData[2];
					value = rowData[3];
				} else {
					fileName = rowData[1];
					label = $(table.fnGetNodes(nTrs[i])).find('option:selected').text();
					value = $(table.fnGetNodes(nTrs[i])).find('option:selected').val();
				}
				param[i] = {
					fileName: fileName,
					label: label,
					value: value
				};
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.coverDgFile.json',
				data: {
					param1: _data.extraOptions.customerId,
					param2: _data.extraOptions.projectId,
					param3: $('#filePath').val(),
					param4: JSON.stringify(param)
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#batchWPtempTable').DataTable().ajax.reload();
						$('#tmpDgModal').modal('hide');
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}*/
		, eventBind() {
			$('#batchWPtempTable').on('click', 'button.table-btn-operate[name="optMatchProgram"]', this.onMatchWPFormModal.bind(this));
			$('#tmpDgModal').on('show.bs.modal', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgWapper.matchDgFile.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: _data.extraOptions.customerId,
						param2: _data.extraOptions.projectId,
						param3: $('#filePath').val()
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							var dataSet = [];
							for (var dataList of data.data[0].data) {
								dataSet.push(['', dataList.fileName, dataList.auditProgramName, dataList.auditProgramId]);
							}
							$('#dgMatchTable').dataTable({
								'data': dataSet,
								'pageLength': 30,
								'ordering': false,
								'scrollX': true,
								'scrollY': '310px',
								'columns': [
									{
										'title': '序号',
										'class': 'text-center',
										'width': '60px',
										'render': function(data, type, row, meta) {
											return meta.settings._iDisplayStart + meta.row + 1;
										}
									},
									{'title': '上传文件名称', 'width': '220px'},
									{
										'title': '底稿文件名称',
										'width': '250px',
										'render': function(data, type, row, meta) {
											if (data != null && data != '') {
												return data;
											} else {
												return '<div class="form-material"><select class="js-select2 form-control">' + auditProgramSelect + '</select></div>';
											}
											// return meta.settings._iDisplayStart + meta.row + 1;
										}
									},
									{
										'title': '操作',
										'width': '60px',
										'render': function(data, type, row, meta) {
											return `<div>
														<button class="btn btn-xs btn-warning" type="button" name="delBtn" data-placement="top" title="删除" data-toggle="tooltip" data-row="` + meta.row + `">
															<i class="fa fa-close"></i>
														</button>
													</div>`;
										}
									},
									{ 'visible': false }
								]
							});
						}
					}
				});
			});
			$('#dgMatchTable').on('click', 'button[name="delBtn"]', function(event) {
				var rowIndex = $(this).parents('tr').index();
				$('#dgMatchTable').DataTable().row(rowIndex).remove().draw();
			});
			$('#batchWPtempTable tbody').on('click', 'td a', function() {
				// var colIndex = $(this).parents('td').index();
				var rowIndex = $(this).parents('tr').index();
				var rowData = $('#batchWPtempTable').DataTable().row(rowIndex).data();
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00078',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: rowData.workpaperId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							// 打开底稿
							var nodeData = {
								extraOptions: data.data[0],
								currentNode: {
									extraOptions: data.data[0]
								}
							};
							nodeData.autoId = nodeData.extraOptions.autoId;
							nodeData.workpaperId = nodeData.extraOptions.workpaperId;
							nodeData.menuId = window.sys_menuId;
							$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + rowData.indexId + '&projectId=' + rowData.projectId);
						}
					}
				});
			});
		}
	});
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00071',
			param1: _data.extraOptions.customerId,
			param2: _data.extraOptions.projectId,
			limit: -1,
			start: -1
		},
		dataType: 'json',
		success(data) {
			if (data.success) {
				for (let dataList of data.data) {
					auditProgramSelect = auditProgramSelect + '<option value="' + dataList.value + '" title="' + dataList.label + '">' + dataList.label + '</option>';
				}
			}
		}
	});
	return page;
}


