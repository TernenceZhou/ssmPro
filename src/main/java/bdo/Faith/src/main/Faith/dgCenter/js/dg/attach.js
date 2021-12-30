/**
 * 附件
 */
var AttachPage = (agrs) => {
	var _template
		, attachTable
		, dgTable
		, mount
		, listener
		, batchUploadWPAttachForm;
	_template = agrs.template || tplLoader('dgCenter/html/dg/attach.html');

	let autoId = agrs.data.extraOptions.autoId; // 科目树所点击节点的autoId
	let dgList; // 科目树所点击节点相关的底稿

	// 文件上传对话框配置
	const batchUploadWPAttachFormCfg = {
		options: {
			propsData: {
				jsonData: {
					batchWPattach: [],
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
		id: 'batchUploadWPAttachForm',
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/BatchUploadDgAttach.batchUploadTempFiles.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#batchUploadWPAttachFormModal').modal('hide');

							let dataSet = data.data;
							$('#batchWPAttachTable').dataTable({
								'data': dataSet,
								'paging': false,
								'ordering': false,
								'scrollX': true,
								'scrollY': '300px',
								'columns': [
									{
										'title': '序号',
										'class': 'text-center',
										'width': '60px',
										'render': function(data, type, row, meta) {
											return meta.settings._iDisplayStart + meta.row + 1;
										}
									},
									{
										'title': '上传文件名称',
										'width': '300px',
										'render': function(data, type, row, meta) {
											return `<div class="form-material">${row.name}</div>`;
										}
									},
									{
										'title': '底稿文件名称',
										'width': '300px',
										'render': function(data, type, row, meta) {
											return `<div class="form-material"><input class="js-match-dg-attach" row="${meta.settings._iDisplayStart + meta.row + 1}" attach-name="${row.name}" attach-path="${row.path}"></div>`;
										}
									},
									{
										'title': '操作',
										'width': '60px',
										'render': function(data, type, row, meta) {
											return `<div>
														<button class="btn btn-xs btn-warning js-match-dg-attach-del" type="button" data-placement="top" title="删除" data-toggle="tooltip" data-row="${meta.row}">
															<i class="fa fa-close"></i>
														</button>
													</div>`;
										}
									},
									{'visible': false}
								]
							});

							if (dgList.length == 1) {
								// 只有一个底稿时，直接赋值
								let $dgs = $('.js-match-dg-attach');
								$dgs.attr('dg-id', dgList[0].data);
								$dgs.attr('dg-name', dgList[0].value);
								$dgs.val(dgList[0].value);
							}

							// 自动完成
							$('.js-match-dg-attach').devbridgeAutocomplete({
								noCache: true,
								minChars: 0,
								autoSelectFirst: true,
								orientation: 'auto',
								maxHeight: 270,
								lookup: dgList, 		// 底稿
								onSelect: function(suggestion) {
									let $this = $(this);
									$this.attr('dg-id', suggestion.data);
									$this.attr('dg-name', suggestion.value);
								}
							});

							$('#tmpDgAttachModal').modal('show');

							$('#tmpDgAttachModal .js-match-dg-attach-del').click(function() {
								// 点击删除按钮删除本行
								let rowIndex = $(this).parents('tr').index();
								$('#batchWPAttachTable').DataTable().row(rowIndex).remove().draw();
							});

						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onBatchUploadWPBtn(event) {
				let file = $('#batchWPattach').fileinput('getFileStack');
				if (!file || file.length < 1) {
					bdoInfoBox('提示', '请先选择文件');
					return;
				}
				this.uploadFile(true);
			}
		},
		buttons: [{
			id: 'batchUploadWPAttachBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onBatchUploadWPBtn'
			}
		}, {
			id: 'cancelUploadWPAttachModelBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id: 'batchWPattach',
			type: 'file',
			label: '底稿附件',
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
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};

	agrs.template = _template;
	_data = agrs.data;
	listener = () => {
		/** 搜索按钮 */
		$('#btn_search').click(function() {
			var queryFilterArr = [];
			for (var i = 0; i < $("#search-condition .form-material").length; i++) {
				var value = $('#search-condition .form-material')[i].children[0].value;
				if (value && value != '') {
					var id = $('#search-condition .form-material')[i].children[0].id;
					var filter = {
						field: id.substring(id.indexOf('_') + 1),
						sqlIndex: 'a.' + id.substring(id.indexOf('_') + 1),
						type: 'string',
						value: value,
						operate: 'like'
					};
					if (id == 'detail_tbSubject') {
						filter = {
							field: 'tbSubject',
							sqlIndex: 'CONCAT(c.tbSubjectId,\'-\',c.tbSubjectName )',
							type: 'string',
							value: value,
							operate: 'like'
						};
					}
					if (id == 'detail_dgName') {
						filter = {
							field: 'dgName',
							sqlIndex: 'b.fileName',
							type: 'string',
							value: value,
							operate: 'like'
						};
					}
					if (id == 'detail_isReferred') {
						filter = {
							field: 'referredFlg',
							sqlIndex: 'a.isReferred',
							type: 'string',
							value: value,
							operate: 'eq'
						};
					}
					queryFilterArr.push(filter);
				}
			}
			var queryString = JSON.stringify(queryFilterArr);
			attachTable.localParam.urlparam.filter = queryString;
			BdoDataTable('attachTable', attachTable);
		});

		/** 重置按钮 */
		$('#btn_clear').click(function() {
			$('#detail_tbSubject').val('');
			$('#detail_fileIndexId').val('');
			$('#detail_dgName').val('');
			$('#detail_fileName').val('');
		});
		// 下载附件
		$('#attachTable').on('click', 'button.table-btn-operate[name="downloadDgAttach"]', event => {
			var table = $('#attachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			downloadFile('dgCenter/DgDownload.downloadAttach.json', {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: rowData.autoId,
				param2: rowData.customerId
			});
		});
		// 在线预览
		$('#attachTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
			var table = $('#attachTable').dataTable();
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
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.fileName, rowData.fileName, 'location=no');
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
				}
			});
		});
		// 查看所有被关联的底稿
		$('#attachTable').on('click', 'button.table-btn-operate[name="viewReferredDgBtn"]', event => {
			var table = $('#attachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$('#attachAutoId').val(rowData.autoId);
			$('#referredDgId').val(rowData.referredDgId);
			$('#dgModal').modal('show');
		});
		$('#dgModal').on('show.bs.modal', function() {
			dgTable.localParam.urlparam.param3 = $('#referredDgId').val();
			BdoDataTable('dgTable', dgTable);
		});
		$('#dgTable').on('click', 'button.table-btn-operate[name="viewWorkpaperBtn"]', event => {
			var table = $('#dgTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			var workpaperId = rowData.autoId;
			var node = getExcelnode(workpaperId);
			$.sessionStorage('subjecttreeNode', JSON.stringify(node));
			window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + node.extraOptions.indexId + '&projectId=' + node.extraOptions.projectId);
		});
		$('#dgTable').on('click', 'tbody td a', event => {
			var colIndex = $(event.currentTarget).parents('td').index();
			var rowIndex = $(event.currentTarget).parents('tr').index();
			var table = $('#dgTable').dataTable();
			var rowData = $('#dgTable').DataTable().row(rowIndex).data();

			var formula = event.currentTarget.text;
			var workpaperId = rowData.autoId;
			var node = getExcelnode(workpaperId);
			$.sessionStorage('subjecttreeNode', JSON.stringify(node));
			$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(formula));
			window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + node.extraOptions.indexId + '&projectId=' + node.extraOptions.projectId);
		});

		function getExcelnode(workPaperId) {
			var nodeData;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00078',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: workPaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// 打开底稿
						nodeData = {
							extraOptions: data.data[0],
							currentNode: {
								extraOptions: data.data[0]
							}
						};
						nodeData.autoId = nodeData.extraOptions.autoId;
						nodeData.workpaperId = nodeData.extraOptions.workpaperId;
						nodeData.menuId = window.sys_menuId;
					}
				}
			});
			return nodeData;
		}

		$('#batchUploadAttachBtn').click(function() {
			// 点击‘批量上传底稿附件’
			dgList = [];
			let isErr = false;
			$.ajax({
				type: 'post',
				async: false,
				url: 'dgCenter/BatchUploadDgAttach.getWorkpaperList.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: autoId
				},
				dataType: 'json',
				success(data) {
					if (!data.success) {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}

					dgList = data.data;
					$('#batchUploadWPAttachFormModal').modal('show');
				},
				error(err){
					bdoErrorBox('失败', "底稿查找失败");
				}
			});

		});
	};

	mount = () => {
		$(agrs.region).empty().append(_template);
		$('#toggleBtn').click();
		if (_data.extraOptions.tbSubjectCode != '') {
			attachTable.localParam.urlparam.param3 = _data.extraOptions.tbSubjectCode;
		}
		if (_data.extraOptions.userSubjectId != '') {
			attachTable.localParam.urlparam.param4 = _data.extraOptions.userSubjectId;
		}
		BdoDataTable('attachTable', attachTable);
		batchUploadWPAttachForm = createForm(batchUploadWPAttachFormCfg);
		listener();

		bindDgAttachMatchAllBtn();
	};

	attachTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00116',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: _data.extraOptions.tbSubjectCode,
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			scrollY: '205px',
			select: false,
			ordering: false,
			order: [3, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '400px',
			pageLength: 30,
			scrollCollapse: true,
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '处理',
				data: null,
				width: '100px',
				render: function(data, type, row, meta) {
					var fileType = data.suffix.toLowerCase();
					var renderStr = '';
					renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="downloadDgAttach" data-placement="top" title="下载" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-download"></i>'
						+ '</button>';
					if (fileType == 'pdf' || fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'xlsx') {
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="onlinepreview" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-eye"></i>'
							+ '</button>';
					}
					var isReferred = data.referredFlg;
					if (isReferred == 1) {
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="viewReferredDgBtn" data-placement="top" title="查看所有被关联的底稿" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-file-excel-o"></i>'
							+ '</button>';
					}
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: true,
				className: 'text-center',
				title: 'TB科目',
				name: 'tbSubject',
				data: 'tbSubject',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				className: 'text-center',
				title: '索引号',
				name: 'fileIndexId',
				data: 'fileIndexId',
				width: '150px'
			}, {
				targets: 4,
				orderable: true,
				className: 'text-center',
				title: '底稿名称',
				name: 'dgName',
				data: 'dgName',
				width: '250px'
			}, {
				targets: 5,
				orderable: true,
				className: 'text-center',
				title: '文件名称',
				name: 'fileName',
				data: 'fileName',
				width: '150px'
			}, {
				targets: 6,
				orderable: true,
				className: 'text-center',
				title: '是否被关联',
				name: 'referredFlg',
				data: 'referredFlg',
				width: '100px',
				render: function(data, type, row, meta) {
					var renderStr = data == 1 ? '是' : '否';
					return renderStr;
				}
			}, {
				targets: 7,
				orderable: true,
				className: 'text-center',
				title: '上传时间',
				name: 'uploadDate',
				data: 'uploadDate',
				width: '120px',
				render: function(data, type, row, meta) {
					return formatSimDate(new Date(data));
				}
			}, {
				targets: 8,
				orderable: true,
				className: 'text-center',
				title: '上传人',
				name: '__uuploadUserName',
				data: '__uuploadUserName',
				width: '60px'
			}, {
				targets: 9,
				name: 'referredDgId',
				data: 'referredDgId',
				visible: false
			}, {
				targets: 10,
				name: 'autoId',
				data: 'autoId',
				visible: false
			}]
		}
	};
	dgTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00154',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: $('#referredDgId').val(),
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			scrollY: '285px',
			select: true,
			ordering: false,
			order: [3, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '400px',
			pageLength: 30,
			columnDefs: [{
				targets: 1,
				className: 'text-center',
				title: '处理',
				data: null,
				width: '50px',
				render: function(data, type, row, meta) {
					var renderStr = '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="viewWorkpaperBtn" data-placement="top" title="查看底稿" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-eye"></i>'
						+ '</button>';
					return renderStr;
				}
			}, {
				targets: 2,
				className: 'text-center',
				title: 'TB科目',
				name: 'subjectId',
				data: null,
				width: '100px',
				render: function(data, type, row, meta) {
					var renderStr = data.subjectId + '-' + data.subjectName;
					return renderStr;
				}
			}, {
				targets: 3,
				className: 'text-center',
				title: '底稿名称',
				name: 'fileName',
				data: 'fileName',
				width: '250px'
			}, {
				targets: 4,
				className: 'text-left',
				title: '单元格位置',
				name: 'customizeStyle',
				data: 'customizeStyle',
				width: '200px',
				render: function(data, type, row, meta) {
					var mapJson = JSON.parse(data).ShowSingleLinkCacheMap;
					if (mapJson === undefined) {
						return '';
					}
					var strMap = new Map();
					// json转换为map
					for (let k of Object.keys(mapJson)) {
						strMap.set(k, mapJson[k]);
					}
					var renderStr = '';
					var arr = [];
					for (var map of strMap) {
						for (var list of map[1]) {
							if (list.attachmentLink) {
								var attachId = list.attachmentLink.substring(0, list.attachmentLink.indexOf(':'));
								if (attachId == $('#attachAutoId').val()) {
									arr.push(list.cellPosition);
								}
							}
						}
					}
					var hash = [];
					for (var i = 0; i < arr.length; i++) {
						if (hash.indexOf(arr[i]) == -1) {
							hash.push(arr[i]);
						}
					}
					for (var i = 0; i < hash.length; i++) {
						renderStr += '<a href=\"#\">' + hash[i] + '</a><br>';
					}
					return renderStr;
				}
			}, {
				targets: 5,
				name: 'subjectTreeId',
				data: 'subjectTreeId',
				visible: false
			}]
		}
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

	function bindDgAttachMatchAllBtn() {
		$('#dgAttachMatchAllBtn').click(function(e) {
			let $attachs = $('.js-match-dg-attach');

			let objMatch = {};
			for (let i = 0, $el; i < $attachs.length; i++) {
				$el = $($attachs[i]);
				let row = $el.attr('row');
				let attachName = $el.attr('attach-name');
				let attachPath = $el.attr('attach-path');
				let dgId = $el.attr('dg-id');
				let dgName = $el.attr('dg-name');
				let value = $el.val();

				if (!dgId || (dgName != value)) {
					bdoInfoBox('提示', `第 ${row} 行尚未匹配，请先全部匹配完`);
					return;
				}

				objMatch[i + ''] = {attachName, attachPath, dgId, dgName};
			}

			let jsonStr = JSON.stringify(objMatch);
			if (jsonStr === '{}') {
				$('#tmpDgAttachModal').modal('hide');
				return;
			}

			$.ajax({
				type: 'post',
				url: 'dgCenter/BatchUploadDgAttach.matchDgAttachFiles.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: jsonStr
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#tmpDgAttachModal').modal('hide');
						bdoSuccessBox('成功');
						$('#attachTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', "批量上传底稿附件失败");
					}
				}
			});

		});

	}

	mount();

};