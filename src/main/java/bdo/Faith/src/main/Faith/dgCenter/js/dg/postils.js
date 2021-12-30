/**
 * 批注汇总表
 */
var PostilsPage = (agrs) => {
	let _template
		, _data
		, postilsTable
		, mount
		, listener
		, cnt = 0;
	_template = agrs.template || tplLoader('dgCenter/html/dg/postils.html');
	agrs.template = _template;
	_data = agrs.data;
	listener = () => {
		/*(function() {
			$('#postilsTable_wrapper .dataTables_scrollBody')[0].style.cssText = "height: 440px;";
		})();*/
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
					switch (id) {
						case 'detail_auditState':
							filter.operate = 'eq';
							filter.type = 'number';
							break;
						case 'detail_activeFlag':
							filter.sqlIndex = 'a.activeFlag';
							filter.operate = 'eq';
							break;
						case 'detail_fileName':
							filter.sqlIndex = 'a.fileName';
							break;
						case 'detail_subjectName':
							filter.sqlIndex = 'a.userSubjectName';
							break;
						default:
							filter.operate = 'like';
					}
					queryFilterArr.push(filter);
				}
			}
			var queryString = JSON.stringify(queryFilterArr);
			postilsTable.localParam.urlparam.filter = queryString;
			BdoDataTable('postilsTable', postilsTable);
		});

		/** 重置按钮 */
		$('#btn_clear').click(function() {
			$('#detail_fileName').val('');
			$('#detail_content').val('');
			$('#detail_indexId').val('');
			$('#detail_auditState').val('');
			$('#detail_activeFlag').val('');
		});

		$('#postilsTable').on('click', 'button.table-btn-operate[name="viewPostilBtn"]', event => {
			var table = $('#postilsTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			DgPostilPage({
				region: '#sideRegin',
				data: rowData,
				type: rowData.type,
				foreignId: rowData.foreignId,
				isSingle: true,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			});
		});
		$('#postilsTable ').on('click', 'a[name="gotoPosition"]', event =>{
			var rowNum = $(event.currentTarget).attr('data-row');
			$('#postilsTable_rownum').val(rowNum);
			var table = $('#postilsTable').dataTable();
			var rowData = table.fnGetData(rowNum);
			if (rowData.type.substring(0, 3) == 'DG-') {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00143',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: rowData.foreignId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								bdoErrorBox('失败', '批注索引号关联的文件不存在。');
								return;
							}
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
							$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(rowData.cellContent));
							window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
						}
					}
				});
			}else  if(rowData.type.substring(0, 5) == 'QYXJ-'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgPostil.queryWorkpaper.json',
					async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.foreignId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								bdoErrorBox('失败', '批注索引号关联的文件不存在。');
								return;
							}
							// 打开底稿
							var nodeData = {
								extraOptions: data.data[0],
								currentNode: {
									extraOptions: data.data[0]
								}
							};
							//nodeData.autoId = nodeData.extraOptions.autoId;
							nodeData.extraOptions.workpaperId = nodeData.extraOptions.autoId;
							nodeData.menuId = window.sys_menuId;
							$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
							$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(rowData.cellContent));
							window.open('/Faith/dgcenter.do?m=openQYXJFile&customerId='+window.CUR_CUSTOMERID+'&projectId='+window.CUR_PROJECTID+'&fileType=2');
						}
					}
				});
			}else if(rowData.type.substring(0, 2) == 'HB'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergePostil.getUrlByIndexId.json',
					async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.type
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							// 打开底稿
							var url =data.data[0].url;
							var type=data.data[0].type;
							if(url !=undefined && url !=""){
								let _obj={
									curCustomerName:window.CUR_CUSTOMERID+'-'+window.CUR_CUSTOMERNAME,
									curProjectName:window.CUR_PROJECTNAME,
									curYear:window.CUR_PROJECT_ACC_YEAR,
									curCustomerId:window.CUR_CUSTOMERID,
									curProjectId:window.CUR_PROJECTID,
									departmentIdr:departIdrSession,
									userId:sys_userId
								};
								let _projectobj={
									curYear:window.CUR_PROJECT_ACC_YEAR,
									customerId:window.CUR_CUSTOMERID,
									mergeCustomerId:rowData.mergeCustomerId,
									mergeCustomerName:rowData.mergeCustomerName,
									projectId:rowData.mergeProjectId+'-'+rowData.mergeProjectName,
									type:type
								};
								sessionStorage.setItem('curCustomerData',JSON.stringify(_obj));
								sessionStorage.setItem('projectItem',JSON.stringify(_projectobj));
								sessionStorage.setItem('menuID',rowData.type);
								window.open('/Faith/merge/index.html#/'+url);
							} else{
								window.open('/Faith/merge/index.html');
							}
						}
					}
				});

			}else if(rowData.type.substring(0, 4) == 'NOTE'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00092',
						param1:  rowData.foreignId,
						param2: rowData.customerId,
						param3: rowData.projectId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success ) {
							if(data.data.length == 0){
								bdoErrorBox('失败', '批注索引号关联的文件不存在。');
								return;
							}
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

			}else if(rowData.type.substring(0, 10) == 'MERGENOTE2'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00310',
						param1:  rowData.foreignId,
						param2: rowData.customerId,
						param3: rowData.projectId,
						param4: rowData.mergeProjectId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								bdoErrorBox('失败', '批注索引号关联的文件不存在。');
								return;
							}
							var nodeData = {
								extraOptions: data.data[0],
								currentNode: {
									extraOptions: data.data[0]
								}
							};
							nodeData.autoId = nodeData.extraOptions.autoId;
							nodeData.menuId = window.sys_menuId;
							nodeData.type = 2;
							$.sessionStorage('excelnode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + nodeData.extraOptions.noteNo);
						}
					}
				});

			} else if(rowData.type.substring(0, 9) == 'MERGENOTE'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00310',
						param1:  rowData.foreignId,
						param2: rowData.customerId,
						param3: rowData.projectId,
						param4: rowData.mergeProjectId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								bdoErrorBox('失败', '批注索引号关联的文件不存在。');
								return;
							}
							var nodeData = {
								extraOptions: data.data[0],
								currentNode: {
									extraOptions: data.data[0]
								}
							};
							nodeData.autoId = nodeData.extraOptions.autoId;
							nodeData.menuId = window.sys_menuId;
							sessionStorage.setItem('mergeNoteInfoNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=openMergeNoteInfo&noteNo=' + nodeData.extraOptions.noteNo);
						}
					}
				});
			} else {
				window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + rowData.type);
			}
		});
		$('#postilsTable').on('click', 'button.table-btn-operate[name="viewExcelBtn"]', event => {
			var table = $('#postilsTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				//async : false,
				data: {
					sqlId: 'DG00031',
					param1: rowData.autoId,
					param2: rowData.foreignId,
					param3: rowData.type,
					param4: _data.extraOptions.customerId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						var nodeData = {
							text: data.data[0].nodeName,
							nodeType: data.data[0].nodeType,
							extraOptions: data.data[0],
							currentNode: {
								text: data.data[0].nodeName,
								nodeType: data.data[0].nodeType,
								extraOptions: data.data[0]
							}
						};
						nodeData.workpagerId = nodeData.extraOptions.workpagerId;
						nodeData.menuId = window.sys_menuId;
						$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$('#postilsExportBtn').click(function(event) {
			downloadFile('dgCenter/ExportOtherDg.exportPostilExcel.json', {});
		});
	};
	init = () => {
		if(_data.type == 'PROJECT') {
			$('#postilsExportBtn').show();
		}else {
			$('#postilsExportBtn').hide();
		}
	};
	mount = () => {
		$(agrs.region).empty().append(_template);
		$('#toggleBtn').click();
		BdoDataTable('postilsTable', postilsTable);
		listener();
		init();
	};
	postilsTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1,
					sort: JSON.stringify([{"property":"createDate","direction":"desc"}])
				};
				if (_data.type == 'SUBJECT') {
					param.sqlId = 'DG00144';
					param.param3 = _data.extraOptions.subjectId;
				}
				if (_data.type == 'TBSUBJECT') {
					param.sqlId = 'DG00145';
					param.param3 = window.CUR_PROJECT_ACC_YEAR;
					param.param4 = _data.extraOptions.tbSubjectCode;
				}
				if (_data.type == 'PROJECT') {
					param.sqlId = 'DG00146';
				}
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '490px',
			select: true,
			ordering: false,
			order: [11, 'desc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '290px',
			scrollCollapse: true,
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center',
				title: '处理',
				data: null,
				width: '70px',
				render(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate bdo-drop-btn" type="button" name="viewPostilBtn" data-placement="top" title="详细" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-eye"></i>'
						+ '	</button>';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '科目名称',
				className: 'text-center',
				name: 'userSubjectName',
				data: 'userSubjectName',
				width: '100px'
			}, {
				targets: ++cnt,
				orderable: true,
				title: '节点名称',
				name: 'fileName',
				data: 'fileName',
				width: '220px',
				render: function(data, type, row, meta) {
					let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 220px;">'+ data +'</p>';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '批注',
				name: 'postilContentText',
				data: 'postilContentText',
				width: '200px',
				render: function(data, type, row, meta) {
					let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 200px;">'+ data +'</p>';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				title: '位置',
				name: 'cellContent',
				data: 'cellContent',
				width: '100px'
			}, {
				targets: ++cnt,
				orderable: true,
				title: '索引号',
				name: 'indexId',
				data: 'indexId',
				width: '180px',
				render: function(data, type, row, meta) {
					let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 150px;"><a name="gotoPosition" class="postil-list-username" style="cursor: pointer;" data-row="' + meta.row + '">'+ data +'</a></p>';
					return renderStr;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '质控阶段',
				className: 'text-center',
				name: 'auditState',
				data: 'auditState',
				renderer: 'getDicLabelByVal|审计阶段',
				width: '70px',
				render(data) {
					return DicVal2Nm(data, '审计阶段');//data == 100 ? '一审' : (data == 200 ? '二审' : '三审');
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '优先级',
				className: 'text-center',
				name: 'postilLevel',
				data: 'postilLevel',
				renderer: 'getDicLabelByVal|优先级',
				width: '70px',
				render(data) {
					return DicVal2Nm(data, '优先级');//data == 0 ? '高' : (data == 1 ? '中' : '低');
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '状态',
				className: 'text-center',
				name: 'activeFlag',
				data: 'activeFlag',
				renderer: 'getDicLabelByVal|批注状态',
				width: '50px',
				render(data) {
					return DicVal2Nm(data, '批注状态');//data == 1 ? '开启' : '关闭';
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '创建人',
				className: 'text-center',
				name: '__ucreateUserName',
				data: '__ucreateUserName',
				width: '60px'
			}, {
				targets: ++cnt,
				orderable: true,
				title: '创建时间',
				name: 'createDate',
				data: 'createDate',
				width: '120px',
				render(data) {
					return new Date(data).format('yyyy-MM-dd HH:mm:ss');
				}
			}
			]
		}
	};
	mount();
};