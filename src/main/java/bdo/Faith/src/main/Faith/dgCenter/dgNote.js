/**
 * 附注
 */
function DgNotePage(context) {
	let $context = context ? $('#dgNotePage') : $;
	let $tabUL = $('#navTabUl', $context);
	let $tabContent = $('#navTabContent', $context);
	let $searchBtn = $('#btn_search', $context);
	let $clearBtn = $('#btn_clear', $context);
	let $initNodeBtn = $('#initNodeBtn', $tabContent);
	let $exportNodeBtn = $('#exportNodeBtn', $tabContent);
	let $addNodeBtn = $('#addNodeBtn', $tabContent);
	let $finishBatchBtn = $('#finishBatchBtn', $tabContent);
	let $dgNoteTable = $('#dgNoteTable', $tabContent);
	let $dgNoteEditModal = $('#dgNoteEditModal', $context);
	let $dgNoteUploadModal = $('#dgNoteUploadModal', $context);
	let $editPageTitle = $('#dgNoteEditModal', $dgNoteEditModal);
	let $dgNoteEditForm = $('#dgNoteEditForm', $dgNoteEditModal);
	let $downloadAllNoteBtn = $('#downloadAllNoteBtn', $tabContent);
	let $uploadAllNoteBtn = $('#uploadAllNoteBtn', $tabContent);
	let $dgNoteUploadAllModal = $('#dgNoteUploadAllModal', $context);
	let dgNoteEditForm;
	let dgNoteUploadForm;
	let dgNoteUploadAllForm;
	/**
	 * 一览配置
	 * @type {number}
	 */
	let cnt = 0;
	/**
	 * 一览配置
	 * @type {{localParam: {url: string, urlparam: {menuId: string, sqlId: string, param1: string, param2: string, limit: number, start: number}, tabNum: boolean}, tableParam: {select: boolean, lengthChange: boolean, ordering: boolean, order: Array, serverSide: boolean, dom: string, columnDefs: *[]}}}
	 */
	const dgNoteTableCfg = {
		localParam: {
			url: 'dgCenter/DgNote.getAllNoteInfo.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			// pageLength: 30,
			lengthChange: false,
			paging: false,
			scrollX: true,
			scrollY: '420px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '460px',
			/*language:{
				"info": "第_PAGE_ 页/共 _PAGES_页  当前显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条",
				'lengthMenu': '每页显示 _MENU_ 记录',
				'zeroRecords': '没有数据 - 抱歉',
				'infoEmpty': '没有符合条件的记录',
				'search': '搜索',
				'infoFiltered': '(从  _MAX_ 条记录中过滤)',
				"paginate": {
					"first": "首页",
					"last": "尾页",
					"next": "下一页",
					"previous": "上一页"
				}
			},*/
			columnDefs: [
				{
					targets: ++cnt,
					orderable: false,
					title: '附注编号',
					name: 'noteNo',
					data: 'noteNo',
					width: '50px'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '附注名称',
					name: 'noteName',
					data: 'noteName',
					width: '120px'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '报表科目',
					name: 'colName',
					data: 'colName',
					width: '100px',
					render: function(data, type, row, meta) {
						if(data != null && data != ''){
							return data;
						}
						return '---';
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '审定数',
					name: 'auditedAmount',
					data: 'auditedAmount',
					width: '60px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '年初数',
					name: 'auditedRemain',
					data: 'auditedRemain',
					width: '60px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '本期校验',
					name: 'curCheck',
					data: 'curCheck',
					width: '60px',
					className: 'text-right',
					render(data, tyep, row, meta) {
						var colCode = row.colCode;
						if(colCode != null && colCode != ''){
							if(row.curCheck != null){
								var value = parseFloat(row.curCheck).toFixed(2);
								if(value == 0){
									return `<span>&nbsp;` + thousandSeparator(value) + `</span>`;
								} else {
									return `<span style="color: red;">&nbsp;` + thousandSeparator(value) + `</span>`;
								}
							}
							return '---';
						}
						return '---';
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '上期校验',
					name: 'preCheck',
					data: 'preCheck',
					width: '60px',
					className: 'text-right',
					render(data, tyep, row, meta) {
						var colCode = row.colCode;
						if(colCode != null && colCode != ''){
							if(row.preCheck != null){
								var value = parseFloat(row.preCheck).toFixed(2);
								if(value == 0){
									return `<span>&nbsp;` + thousandSeparator(value) + `</span>`;
								} else {
									return `<span style="color: red;"></i>&nbsp;` + thousandSeparator(value) + `</span>`;
								}
							}
							return '---';
						}
						return '---';
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '状态',
					renderer : 'getDicLabelByVal|boolean',
					name: 'isCompleteNow',
					data: 'isCompleteNow',
					width: '50px',
					className: 'text-center',
					render: function(data, type, row, meta) {
						if (data == 1) {
							return `<span class="label label-success"><i class="fa fa-check"></i>&nbsp;加载完成</span>`;
						} else if (data == 0) {
							return `<span class="label label-danger"><i class="fa fa-spinner fa-pulse"></i>&nbsp;加载中</span>`;
						}
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '操作',
					name: 'opt',
					width: '180px',
					// className: 'text-center',
					render(data, tyep, row, meta) {
						let resultStr = `<div>
											<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="editNoteBtn" data-action="editNoteBtn" data-placement="top" title="编辑" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-edit"></i>
											</button>
											<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="uploadNoteFileBtn" data-action="uploadNoteFileBtn" data-placement="top" title="上传" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-upload"></i>
											</button>
											`;
						if(row.fullPath != ''){
							resultStr += `<button class="btn btn-xs btn-success table-btn-operate" type="button" name="downloadNoteFileBtn" data-action="downloadNoteFileBtn" data-placement="top" title="下载" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-download"></i>
											</button>
											<button class="btn btn-xs btn-success table-btn-operate" type="button" name="editNoteFileBtn" data-action="editNoteFileBtn" data-placement="top" title="编辑文件" data-toggle="tooltip" data-row="` + meta.row + `">
											<i class="fa fa-file-excel-o"></i>
										</button>`;
						}
						if(row.knoteId != null){
							resultStr += `<button class="btn btn-xs btn-success table-btn-operate" type="button" name="resetNoteFileBtn" data-action="resetNoteFileBtn" data-placement="top" title="重置文件" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-repeat"></i>
											</button>`;
						}else{
							resultStr += `<button class="btn btn-xs btn-success table-btn-operate" type="button" name="delNoteFileBtn" data-action="delNoteFileBtn" data-placement="top" title="删除文件" data-toggle="tooltip" data-row="` + meta.row + `">
												<i class="fa fa-close"></i>
											</button>`;
						}
						resultStr += `</div>`;
						return resultStr;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '禁用',
					renderer : 'getDicLabelByVal|boolean',
					name: 'isForbid',
					data: 'isForbid',
					width: '30px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let checked = data == 1 ? 'checked' : '';
						return `<label class="css-input css-checkbox control-label css-checkbox-danger"><input type="checkbox" class="note-table-isForbid" data-row="` + meta.row + `" name="isForbid" ` + checked + `> <span></span></label>`;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '已编辑',
					renderer : 'getDicLabelByVal|boolean',
					name: 'isEdited',
					data: 'isEdited',
					width: '40px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let disabledStyle = row.isForbid == 1 ? 'css-input-disabled' : '';
						let checked = data == 1 ? 'checked' : '';
						return `<label class="css-input css-checkbox control-label css-checkbox-primary ` + disabledStyle + `"><input type="checkbox" class="note-table-isEdited" data-row="` + meta.row + `" name="isEdited" ` + checked + ` disabled> <span></span></label>`;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '已完成',
					renderer : 'getDicLabelByVal|boolean',
					name: 'isFinished',
					data: 'isFinished',
					width: '40px',
					className: 'text-center',
					render(data, tyep, row, meta) {
						let disabledStyle = row.isForbid == 1 ? 'css-input-disabled' : '';
						let disabled = row.isForbid == 1 ? 'disabled' : '';
						let checked = data == 1 ? 'checked' : '';
						return `<label class="css-input css-checkbox control-label css-checkbox-success ` + disabledStyle + `"><input type="checkbox" class="note-table-isFinished" data-row="` + meta.row + `" name="isFinished" ` + checked + ` ` + disabled + `> <span></span></label>`;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '更新人',
					name: '__urevisorName',
					data: '__urevisorName',
					width: '50px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '更新时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '120px',
					className: 'text-right'
				}
			]
		}
	};

	const batchUpdateNoteFinishedTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00092',
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					param4: '0',
					param5: '0'
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			select: false,
			ordering: false,
			//order : [2, 'asc'],
			serverSide: true,
			autoWidth: false,
			fixedThead: true,
			// pageLength:30,
			// lengthChange:false,
			// paging:true,
			fixedHeight: '480px',
			columnDefs: [{
				targets:1,
				orderable: false,
				className: 'text-center',
				width:'50px',
				title:'<label class="css-input css-checkbox css-checkbox-primary">'+
					'<input type="checkbox" name="checkFinishedAll"/>' +
					'<span></span>'+
					'</label>',
				render(data, type, row, meta) {
					let checked = row.isFinished == 1 ? 'checked' : '';
					let renderStr = '<label class="css-input css-checkbox css-checkbox-primary">' +
							'<input type="checkbox" name="checkFinished" value="' + row.autoId + '"' + checked + '/>' +
							'<span></span>' +
						'</label>';
					return renderStr;
				}
			} ,{
				targets: 2,
				title: '附注编号',
				name: 'noteNo',
				data: 'noteNo',
				className: 'text-left',
				width:'100px'
			}, {
				targets: 3,
				title: '附注名称',
				name: 'noteName',
				data: 'noteName',
				className: 'text-left',
				width:'120px'
			}]
		}
	};

	/**
	 * 编辑附注名称
	 * @type {{id: string, display: string, column: number, props: {jsonData: ObjectConstructor}, options: {propsData: {jsonData: {autoId: null, customerId: string, projectId: string, noteName: string}}}, buttons: *[], items: {id: string, type: string, label: string, rowspan: number, colspan: number, typeAttr: {readonly: boolean}, validate: {rules: {required: boolean, maxlength: number}}}[]}}
	 */
	const dgNoteEditComponent = {
		id: 'dgNoteEditForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					autoId: null,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					noteName: ''
				}
			}
		},
		data() {
			return {
				/*ajaxConfig: {
					type : 'POST',
					url : 'dgCenter/DgNote.updateDgNote.json',
					dataType : 'json',
					success(data) {
						if(data.success){
							$dgNoteEditModal.modal('hide');
							$dgNoteTable.DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				},*/
				channel: ''
			};
		},
		methods: {
			onSaveDgNoteEditClick() {
				if ($('#noteName').valid() !== true) {
					return;
				}
				updateDgNote(this.channel, this.jsonData).done(function(data) {
					if (data.success) {
						$dgNoteEditModal.modal('hide');
						$dgNoteTable.DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				});
				/*this.submit(true, {param1: this.channel});*/
			},
			onCancelClick() {
				$dgNoteEditModal.modal('hide');
			}
		},
		buttons: [{
			id: 'saveDgNoteEditClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '保存',
			typeAttr: {
				'v-on:click': 'onSaveDgNoteEditClick'
			}
		}, {
			id: 'cancelDgNoteEditClicktBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelClick'
			}
		}],
		items: [{
			id: 'noteName',
			type: 'input',
			label: '附注名称',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false
			},
			validate: {
				rules: {
					required: true,
					maxlength: 200
				}
			}
		}]
	};

	const dgNoteUploadFiltComponet = {
		id: 'dgNoteUploadFiltForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					autoId: null,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				}
			}
		},
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgNote.uploadDgNoteFile.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							let autoId = data.data[0].autoId;
							let storageId = 'BDONOTE' + autoId;
							let storageStatus = 'BDONOTE' + autoId + 'Status';
							window.localStorage.removeItem(storageId);
							window.localStorage.removeItem(storageStatus);
							$dgNoteUploadModal.modal('hide');
							$dgNoteTable.DataTable().draw(false);
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onUploadDgNoteClick() {
				this.uploadFile(true);
			},
			onCancelClick() {
				$dgNoteUploadModal.modal('hide');
			}
		},
		buttons: [{
			id: 'uploadDgNoteEditClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadDgNoteClick'
			}
		}, {
			id: 'cancelDgNoteEditClicktBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelClick'
			}
		}],
		items: [{
			id: 'dgNoteFile',
			type: 'file',
			label: '附注模板',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false
			},
			validate: {
				rules: {
					required: true
				}
			},
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xlsx'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};
	const dgNoteUploadAllFileComponet = {
		id: 'dgNoteUploadAllFileForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				}
			}
		},
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgNote.uploadDgNoteAllFile.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							$dgNoteUploadAllModal.modal('hide');
							$dgNoteTable.DataTable().draw(false);
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onUploadAllDgNoteClick() {
				var fileCount = $('#dgNoteFileAll').fileinput('getFilesCount');
				if (fileCount <= 0) {
					bdoErrorBox('失败', '当前无任何文件！');
					return;
				}
				bdoInProcessingBox('上传中');
				this.uploadFile(true);
			},
			onCancelAllClick() {
				$dgNoteUploadAllModal.modal('hide');
			}
		},
		buttons: [{
			id: 'uploadAllDgNoteEditClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadAllDgNoteClick'
			}
		}, {
			id: 'cancelAllDgNoteEditClicktBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelAllClick'
			}
		}],
		items: [{
			id: 'dgNoteFileAll',
			type: 'file',
			label: '附注模板',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false,
				multiple: true
			},
			validate: {
				rules: {
				}
			},
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xlsx'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};
	/**
	 *
	 */
	function initEditJsonData() {
		return {
			autoId: null,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			noteName: ''
		};
	}

	/**
	 * 更新
	 * @param channel
	 * @param param
	 * @returns {*}
	 */
	function updateDgNote(channel, param) {
		return $.ajax({
			url: 'dgCenter/DgNote.updateDgNote.json',
			type: 'post',
			dataType: 'json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				jsonData: JSON.stringify(param),
				param1: channel
			},
			success(data) {
				if(param.rowNum){
					$dgNoteTable.DataTable().draw(false);
					if (data.success){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			}
		});
	}

	/**
	 * 打开文件
	 * @param event
	 */
	function openDgNoteFile(event) {
		let $target = $(event.currentTarget);
		let rowNum = $target.attr('data-row');
		let table = $dgNoteTable.dataTable();
		let rowData = table.fnGetData(rowNum);
		if (rowData.isCompleteNow == 0) {
			bdoInfoBox('提示', '附注尚未加载完成，请稍后查看！', 1500);
			return;
		}
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00092',
				param1: rowData.autoId,
				param2: rowData.customerId,
				param3: rowData.projectId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					var nodeData = {
						extraOptions: data.data[0],
						currentNode: {
							extraOptions: data.data[0]
						}
					};
					nodeData.autoId = nodeData.extraOptions.autoId;
					nodeData.menuId = window.sys_menuId;
					$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
					window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}

	/**
	 * 删除文件
	 * @param event
	 */
	function delNoteFile(event) {

		bdoConfirmBox('提示','确认删除当前添加的附注吗？',isConfirm=>{
			let $target = $(event.currentTarget);
			let rowNum = $target.attr('data-row');
			let table = $dgNoteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			$.ajax({
				url: 'dgCenter/DgNote.delNoteFile.json',
				type: 'post',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					jsonData: JSON.stringify(rowData)
				},
				success(data) {
					if (data.success) {
						$dgNoteTable.DataTable().row(rowNum).remove().draw();
						bdoSuccessBox('成功', '删除成功');
						// $dgNoteTable.DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		})
	}

	/**
	 * 重置文件
	 * @param event
	 */
	function resetNoteFile(event) {
		bdoConfirmBox('提示', '确定要重置该文件吗？', function(isConfirm) {
			let $target = $(event.currentTarget);
			let rowNum = $target.attr('data-row');
			let table = $dgNoteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			$.ajax({
				url: 'dgCenter/DgNote.resetNoteFile.json',
				type: 'post',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					jsonData: JSON.stringify(rowData)
				},
				success(data) {
					if (data.success) {
						bdoInfoBox('提示', '正在加载...', 1500);
						$dgNoteTable.DataTable().draw(false);
						// $dgNoteTable.DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});

	}

	/**
	 * 绑定事件
	 */
	function eventBind() {
		// 刷新
		$('#refreshBtn').click(function() {
			$dgNoteTable.DataTable().ajax.reload();
		});
		/**
		 * 添加附注按钮事件
		 */
		$addNodeBtn.click(function() {
			$editPageTitle.text('新增');
			dgNoteEditForm.channel = 'insert';
			$dgNoteEditModal.modal('show');
		});
		/**
		 * 批量完成按钮事件
		 */
		$finishBatchBtn.click(function() {
			$('#batchUpdateNoteFinishedModal').modal('show');
			BdoDataTable('batchUpdateNoteFinishedTable', batchUpdateNoteFinishedTableCfg);
			$('input[name="checkFinishedAll"]').off('click');
			$('input[name="checkFinishedAll"]').on('click', function(event) {
				if ($('input[name="checkFinishedAll"]').is(":checked")==true){
					$("input[name='checkFinished']").each(function () {
						this.checked = true;
					});
				}else {
					$('input[name="checkFinishedAll"]').prop("checked", false);
					$("input[name='checkFinished']").each(function () {
						this.checked = false;
					});
				}
			});
		});
		$('#checkFinishedBtn').on('click', function(event) {
			bdoConfirmBox('提示', '校验公式未通过的附注不能设置已完成<br>确定是否更新设置附注已完成？', (isConfirm) => {
				var params = [];
				$.each($('input[name="checkFinished"]:checkbox'),function(){
					var param = {};
					if(this.checked){
						param = {
							autoId: $(this).val(),
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							isFinished: '1'
						};
					}else{
						param = {
							autoId: $(this).val(),
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							isFinished: '0'
						};
					}
					params.push(param);
				});
				bdoInProcessingBox('设置中');
				$.ajax({
					type: 'post',
					url : 'dgCenter/DgNote.batchUpdateNoteFinished.json',
					dataType: 'json',
					// async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						menuId: window.sys_menuId,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: JSON.stringify(params),
						start: -1,
						limit: -1
					},
					success: function(data) {
						if (data.success) {
							$('#batchUpdateNoteFinishedModal').modal('hide');
							bdoSuccessBox('设置完成', data.resultInfo.statusText);
							$dgNoteTable.DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		/**
		 * 查询
		 */
		$searchBtn.click(function() {
			var queryFilterArr = [];
			for (var i = 0; i < $("#search-condition .form-material").length; i++) {
				var value = $('#search-condition .form-material')[i].children[0].value;
				if (value && value != '') {
					var id = $('#search-condition .form-material')[i].children[0].id;
					var filter = {
						field: id.substring(id.indexOf('_') + 1),
						sqlIndex: 'a.' + id.substring(id.indexOf('_') + 1),
						type: '',
						value: value,
						operate: ''
					};
					switch (id) {
						case 'note_noteName':
							filter.type = 'string';
							filter.operate = 'like';
							break;
						case 'note_colName':
							filter.type = 'string';
							filter.operate = 'like';
							break;
						case 'note_isForbid':
							filter.type = 'number';
							filter.operate = 'eq';
							break;
						case 'note_isEdited':
							filter.type = 'number';
							filter.operate = 'eq';
							break;
						case 'note_isFinished':
							filter.type = 'number';
							filter.operate = 'eq';
							break;
						case 'note_checkResult':
							filter.type = 'string';
							filter.operate = 'eq';
							break;
						default:
							filter.operate = 'like';
					}
					queryFilterArr.push(filter);
				}
			}
			var queryString = JSON.stringify(queryFilterArr);
			dgNoteTableCfg.localParam.urlparam.filter = queryString;
			$dgNoteTable.DataTable().ajax.reload();
		});
		/**
		 * 重置
		 */
		$clearBtn.click(function() {
			for (var i = 0; i < $("#search-condition .form-material").length; i++) {
				$($('#search-condition .form-material')[i].children[0]).val('');
			}
		});
		/**
		 * 初始化附注按钮事件
		 */
		$initNodeBtn.click(function() {
			var text = '<div style="height: 150px;overflow-y: auto"><font color="red">';
			text += '1.删除所有附注<br>';
			text += '2.删除所有附注取值链接<br>';
			text += '3.删除所有附注标签<br>';
			text += '4.删除所有附注涉及到的校验公式<br>';
			text += '5.重新生成标准附注<br>';
			text += '6.重新设置标准附注取值链接</font></div>';
			text = '初始化所有附注将会执行以下操作 <br>' + text + '<br>确定是否初始化所有附注？';
			bdoConfirmBox('提示', text, function() {
				bdoInProcessingBox('初始化中...');
				$.ajax({
					url: 'dgCenter/DgNote.initDgNote.json',
					type: 'post',
					dataType: 'json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID
					},
					success: function(data) {
						if (data.success) {
							// $dgNoteTable.DataTable().ajax.reload();
							setTimeout(()=>{
								$dgNoteTable.DataTable().ajax.reload();
								bdoSuccessBox('成功', data.resultInfo.statusText);
							}, 1000);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		/**
		 * 更新几个状态
		 */
		$dgNoteTable.on('change', '[class^=note-table-]', function(event) {
			let elName = event.currentTarget.name;
			elName;
			// 编辑文件
			let $target = $(event.currentTarget);
			let fieldName = $target.attr('name');
			let rowNum = $target.attr('data-row');
			let table = $dgNoteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let action = $target.attr('name');
			action = action.substring(2).toLowerCase();
			rowData[fieldName] = $target[0].checked === true ? 1 : 0;
			rowData.rowNum = rowNum;
			updateDgNote(action, rowData);
		});

		/**
		 * 编辑按钮
		 */
		$dgNoteTable.on('click', '.table-btn-operate', function(event) {
			let $target = $(event.currentTarget);
			let rowNum = $target.attr('data-row');
			let table = $dgNoteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let action = $target.attr('data-action');
			switch (action) {
				case 'editNoteBtn':
					// 编辑文件
					$editPageTitle.text('编辑');
					dgNoteEditForm.channel = 'update';
					Object.assign(dgNoteEditForm.jsonData, rowData);
					$dgNoteEditModal.modal('show');
					break;
				case 'uploadNoteFileBtn':
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						// async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00092',
							param1: rowData.autoId,
							param2: rowData.customerId,
							param3: rowData.projectId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(data.data[0].isFinished == '1'){
									bdoErrorBox('失败', '已完成的附注不能再上传');
								}else{
									// 上传文件
									Object.assign(dgNoteUploadForm.jsonData, rowData);
									$dgNoteUploadModal.modal('show');
								}
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
					break;
				case 'downloadNoteFileBtn':
					downloadFile('dgCenter/DgNote.downloadDgNote.json', {
						param1: rowData.autoId,
						param2: rowData.customerId,
						param3: rowData.projectId
					});
					break;
				case 'editNoteFileBtn':
					openDgNoteFile.call(this, event);
					break;
				case 'resetNoteFileBtn':
					resetNoteFile.call(this, event);
					break;
				case 'delNoteFileBtn':
					delNoteFile.call(this, event);
					break;
			}
		});
		/**
		 * 导出附注按钮事件
		 */
		$exportNodeBtn.click(function() {
			if (!$dgNoteTable.hasClass('dataTable')) {
				bdoErrorBox('错误！', '附注一览没有初始化！');
			}
			let tableConfig = $dgNoteTable.dataTable().fnGetBdoConfig();
			let columnInfo = BdoFaithUtil.getColumnsInfo(tableConfig.tableParam.columnDefs);
			let myParams = $.extend({}, tableConfig.localParam.urlparam); // applyIf({},table_view.localParam.urlparam);
			myParams.sort && delete  myParams.sort;
			myParams.page = '';
			myParams.start = '';
			myParams.limit = '';
			myParams.queryUrl = tableConfig.localParam.url;
			myParams.columnMap = columnInfo;
			return BdoFaithUtil.saveAs('dgCenter/DgNote.exportExcel.json', '' + '.xlsx', {
				requestData: {
					myParams: JSON2.stringify(myParams),
					title: encodeURI('附注一览')
				},
				method: 'POST'
			});
		});
		$dgNoteEditModal.on('hidden.bs.modal', function() {
			var jsonData = {
				autoId: null,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				noteName: ''
			};
			dgNoteEditForm.jsonData = jsonData;
			Object.assign(dgNoteEditForm.jsonData, initEditJsonData());
		});
		$dgNoteUploadModal.on('hidden.bs.modal', function() {
			dgNoteUploadForm.resetUploadComponent();
		});
		$dgNoteUploadModal.on('show.bs.modal', function() {
			dgNoteUploadForm.resetUploadComponent();
		});
		$dgNoteUploadAllModal.on('hidden.bs.modal', function() {
			dgNoteUploadAllForm.resetUploadComponent();
		});
		$dgNoteUploadAllModal.on('show.bs.modal', function() {
			dgNoteUploadAllForm.resetUploadComponent();
		});
		/**
		 * 批量下载附注按钮
		 */
		$downloadAllNoteBtn.click(function() {
			bdoConfirmBox('提示', "确定是否下载所有附注？", function() {
				downloadFile('dgCenter/DgNote.downloadAllDgNote.json', {
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				});
			});
		});
		/**
		 * 批量上传附注按钮
		 */
		$uploadAllNoteBtn.click(function() {
			// 上传文件
			var jsonData = {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID
			};
			Object.assign(dgNoteUploadAllForm.jsonData, jsonData);
			$dgNoteUploadAllModal.modal('show');
		});

	}

	function thousandSeparator(num) {
		return num && (num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2) {
			return $2 + ",";
		}) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($1, $2) {
			return $2 + ",";
		})
		);
	}

	/**
	 * 初始化页面
	 */
	function init() {
		let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
		$('#remarkIndex').text('【' + node.extraOptions.indexId + '】');
		BdoDataTable('dgNoteTable', dgNoteTableCfg);
		dgNoteEditForm = createForm(dgNoteEditComponent);
		dgNoteUploadForm = createForm(dgNoteUploadFiltComponet);
		dgNoteUploadAllForm = createForm(dgNoteUploadAllFileComponet);
		$('#toggleBtn').click();
		eventBind();
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(function() {
	new DgNotePage($('#dgNotePage')).init();
});
