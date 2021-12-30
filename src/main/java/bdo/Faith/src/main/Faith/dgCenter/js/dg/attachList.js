function AttachListPage(agrs) {
	let _template = agrs.template || tplLoader('dgCenter/html/dg/attachList.html')
		, customerId = agrs.data.extraOptions.customerId
		, projectId = agrs.data.extraOptions.projectId
		, nodeType = agrs.data.nodeType;
	$(agrs.region).html(_template);
	$('#headtitle').empty().text(agrs.data.text);
	let sqlId = 'DG00062';
	let page = new Page({
		container: '#attachListPage',
		events: {
			'#refreshAttachTableBtn': 'click,onRrefreshAttachTable',
			'#upload': 'click,onUpload',
			'#customerProjectUpload': 'click,onCustomerProjectUpload'
			//'#attachTable tbody td.edit-indexid': 'dbclick,onIndexColDbclick'
		},
		/**
		 * 初始化
		 */
		init(options) {
			// 上传文件
			this.uploadWorkpagerPage = createForm(this.uploadWorkpagerPageCfg);
			BdoDataTable('attachTable', this.attachTableCfg);
			this.listener();
		}
		, uploadWorkpagerPageCfg: {
			options: {
				propsData: {
					jsonData: {
						workpager: [],
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						subjectTreeId: agrs.data.extraOptions.autoId,
						autoId: null
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'uploadFileForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.updateProjDgFile.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#uploadTplFormModal').modal('hide');
								$('#attachTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					},
					uploadMode: 'STD'
				};
			},
			methods: {
				onUploadDraftFileClick(event) {
					var fileCount = $('#workpager').fileinput('getFilesCount');
					if (fileCount <= 0) {
						bdoErrorBox('失败', '当前无任何文件！');
						return;
					}
					this.uploadFile(true, {param1: agrs.data.type});
				},
				resetFileClick(event) {
					$('#workpager').fileinput('refresh');
					$('#workpager').fileinput('clear');
					$('#workpager').fileinput('reset');
					/*this.uploadMode = 'STD';
					this.jsonData.autoId = */
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
				id: 'uploadDraftFileBtn',
				icon: 'fa fa-upload',
				style: 'btn-primary',
				text: '上传',
				typeAttr: {
					'v-on:click': 'onUploadDraftFileClick'
				}
			}, {
				id: 'cancelUploadDraftFileBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'data-dismiss': 'modal'
				}
			}],
			items: [{
				id: 'workpager',
				type: 'file',
				label: '文件',
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
						uploadExtraData() {
							return {};
						}
					}
				}
			}]
		}
		, uploadWorkpagerPage: null
		, attachTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: sqlId,
					param1: window.CUR_CUSTOMERID,
					param2: agrs.data.extraOptions.autoId
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				scrollCollapse: true,
				select: true,
				serverSide: true,
				lengthChange: true,
				drawCallback(settings) {
					let $table = this;
					if (!$table.isInitSortable) {
						$('tbody', this).sortable({
							helper(e, tr) {
								let $originals = tr.children();
								let $helper = tr.clone();
								$helper.children().each(function(index) {
									$(this).width($originals.eq(index).width());
								});
								return $helper;
							},
							stop() {
								let trs = $('tbody tr', $table);
								let datas = $table.fnGetData();
								let param = [];
								trs.each((index, tr) => {
									let $tr = $(tr);
									$tr.find('td:eq(0)').text(index + 1);
									let data = datas[index];
									if (data.sortNum != $tr.data('sortNum')) {
										data.sortNum = $tr.data('sortNum');
										$(tr).data('autoId', data.autoId);
										$(tr).data('sortNum', data.sortNum);
										param.push({
											autoId: data.autoId,
											customerId: data.customerId,
											sortNum: data.sortNum
										});
									}
								});
								if (param.length > 0) {
									$.ajax({
										url: 'dgCenter/DgMain.updateDgFileSort.json',
										type: 'post',
										//async: false,
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											jsonData: JSON.stringify(param)
										},
										dataType: 'json',
										success(data) {
											if (data.success) {

											} else {
												bdoErrorBox('排序失败', data.resultInfo.statusText);
											}
										}
									});
								}
							}
						});
					}
					$table.isInitSortable = true;
				},
				createdRow(row, data, dataIndex) {
					$(row).data('sortNum', data.sortNum);
					$(row).data('dataIndex', dataIndex);
				},
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '120px',
					render: function(data, type, row, meta) {
						//var fileType = data.suffix;
						var renderStr = '';
						renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="reUploadFile" data-placement="top" title="重新上传" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-upload"></i>'
							+ '</button>';
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="downloadFile" data-placement="top" title="下载" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-download"></i>'
							+ '</button>';
						if (/^.*?\.(jpg|jpeg|bmp|gif|png|pdf|xlsx)$/.test(data.fileName.toLowerCase())) {
							renderStr += '<button class="btn btn-xs table-btn-operate btn-success" type="button" name="onlinepreview" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="' + meta.row + '">'
								+ '	<i class="fa fa-eye"></i>'
								+ '</button>';
						}
						renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="delFile" data-placement="top" title="删除" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-times-circle-o"></i>'
							+ '</button>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					name: 'sortNum',
					data: 'sortNum',
					visible: false
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'edit-indexid',
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '150px',
					render(data) {
						return data;
					}
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
					title: '上传时间',
					name: 'uploadDate',
					data: 'uploadDate',
					width: '150px',
					render: function(data, type, row, meta) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
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
		}
		, onRrefreshAttachTable(event) {
			event.preventDefault();
			$('#attachTable').DataTable().ajax.reload();
		}
		, onUpload(event) {
			event.preventDefault();
			page.uploadWorkpagerPage.jsonData.autoId = null;
			page.uploadMode = 'STD';
			$('#uploadTplFormModal').modal('show');
		},onCustomerProjectUpload(event) {
			$('#uploadCpFileModal').modal('show');
			$('#selectFile').html('<iframe id="selectFile" height="600px" width="1000px" style="border: 1px solid #dcdcdc;"  frameborder="0" src="./transfer/index.html"></iframe>');
		}
		, updateFileIndexId(event, $this, $table, val) {
			let index = $table.dataTable().api(true).cell($this).data();
			if (index != val && val) {
				let rowData = $table.dataTable().api(true).cell($this).row().data();
				$.ajax({
					url: 'dgCenter/DgMain.updateDgIndexId.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						jsonData: JSON.stringify([{
							autoId: rowData.autoId,
							customerId: rowData.customerId,
							fileIndexId: val
						}])
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$this.css('padding', '6px 8px');
							$this.html(val);
							$table.dataTable().api(true).cell($this).data(val);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			} else if (index == val) {
				$this.css('padding', '6px 8px');
				$this.html(val);
				$table.dataTable().api(true).cell($this).data(val);
			} else {
				//$('input', $this).css();
			}
		}
		, onIndexColDbclick(event) {
			console.log('onIndexColDbclick');
			let $table = $('#attachTable').dataTable();
			let $this = $(this);
			let data = $table.api(true).cell(this).data();
			let $input = $('<input style="width: 60%; height: 80%;    max-height: 2em; margin-top: 1px;"/>');
			let $submitBtn = $('<button class="btn btn-success" style="font-size: 12px;width: 15%;height: 80%;max-height: 2em;margin-left: 5px;padding: 1px;margin-top: -4px;"><i class="fa fa-check"></i></button>');

			$this.css('padding', 0);
			$input.val(data);
			$this.html($input);
			$this.append($submitBtn);

			/*$input.blur(function(event) {
				page.updateFileIndexId(event, $this, $table, $input.val());
			});*/

			$submitBtn.click(function(event) {
				page.updateFileIndexId(event, $this, $table, $input.val());
			});

			$input.focus();
		}
		, listener() {
			let action = (param, callback) => {
				$.ajax({
					url: 'dgCenter/DgMain.queryProjDgFileExist.json',
					type: 'post',
					async: false,
					data: param,
					dataType: 'json',
					success(data) {
						if (data.success) {
							callback(data);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			};
			// 重新上传附件
			$('#attachTable').on('click', 'button.table-btn-operate[name="reUploadFile"]', event => {
				let table = $('#attachTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				page.uploadWorkpagerPage.jsonData.autoId = rowData.autoId;
				page.uploadWorkpagerPage.uploadMode = 'RE';
				$('#uploadTplFormModal').modal('show');
			});

			// 下载附件
			$('#attachTable').on('click', 'button.table-btn-operate[name="downloadFile"]', event => {
				let table = $('#attachTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				/*var isManager = true;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
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
							if (sys_userId != data.data[0].manager) {
								isManager = false;
							}
						}
					}
				});
				if (!isManager) {
					bdoInfoBox('提示', '只有项目负责人才能下载该文件附件！');
					return;
				}*/
				action({
					param1: rowData.autoId,
					param2: rowData.customerId
				}, (data) => {
					downloadFile('dgCenter/DgDownload.downloadProjDgFile.json', {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.autoId,
						param2: rowData.customerId
					});
				});
			});
			// 在线预览
			$('#attachTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
				var table = $('#attachTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				action({
					param1: rowData.autoId,
					param2: rowData.customerId
				}, (data) => {
					var fileSuffix = rowData.fileName.substring(rowData.fileName.lastIndexOf(".") + 1).toLowerCase();
					if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
						window.open('dgCenter/DgMain.previewProjDgFile.json?param1=' + rowData.autoId + '&param2=' + rowData.customerId, rowData.fileName, 'location=no');
					} else if(fileSuffix === "xlsx") {
						rowData.pageType = 3;
						var nodeData = {
							extraOptions: rowData,
							currentNode: {
								extraOptions: rowData
							}
						};
						$.sessionStorage('fileNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=previewFile');
					}
				});
			});
			// 删除附件
			$('#attachTable').on('click', 'button.table-btn-operate[name="delFile"]', event => {
				var table = $('#attachTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				bdoConfirmBox('提示', '确认删除文件【' + rowData.fileName + '】?', function() {
					$.ajax({
						url: 'dgCenter/DgMain.deleteProjDgFile.json',
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
								$('#attachTable').DataTable().ajax.reload();
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
			$('#attachTable').on('dblclick', 'tbody td.edit-indexid', this.onIndexColDbclick);
		}
	});
}