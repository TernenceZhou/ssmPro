/**
 * 批注汇总
 */
function PostilsPage(context) {
	let $postilsTitle = $('#postilsTitle');
	let $postilCount1 = $('#postilCount1', $postilsTitle);
	let $postilCount2 = $('#postilCount2', $postilsTitle);
	let $postilCount3 = $('#postilCount3', $postilsTitle);
	let $postilCount4 = $('#postilCount4', $postilsTitle);
	let $postilCount5 = $('#postilCount5', $postilsTitle);
	let $postilCount6 = $('#postilCount6', $postilsTitle);
	let $postilCount7 = $('#postilCount7', $postilsTitle);
	let $context = context ? $('#postilsPage') : $;
	let $tabContent = $('#navTabContent', $context);
	let $postilsTable = $('#postilsTable', $tabContent);

	/**
	 * 一览配置
	 */
	const postilsTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00140',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '480px',
			select: true,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			scrollCollapse: true,
			columnDefs: [
				{
					targets: 1,
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
						/*renderStr += '<button class="btn btn-xs btn-success table-btn-operate bdo-drop-btn" type="button" name="viewExcelBtn" data-placement="top" title="查看底稿" data-toggle="tooltip" data-row="'+meta.row+'">'
								  +'	<i class="fa fa-file-excel-o"></i>'
								  +'	</button>';*/
						return renderStr;
					}
				}, {
					targets: 2,
					title: '科目名称',
					name: 'userSubjectName',
					data: 'userSubjectName',
					width: '200px',
					render: function(data, type, row, meta) {
						let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 200px;">'+ data +'</p>';
						return renderStr;
					}
				}, {
					targets: 3,
					title: '节点名称',
					name: 'nodeName',
					data: 'nodeName',
					width: '200px',
					render: function(data, type, row, meta) {
						let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 200px;">'+ data +'</p>';
						return renderStr;
					}
				}, {
					targets: 4,
					title: '批注',
					name: 'postilContentText',
					data: 'postilContentText',
					width: '200px',
					render: function(data, type, row, meta) {
						let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 200px;">'+ data +'</p>';
						return renderStr;
					}
				}, {
					targets: 5,
					title: '位置',
					name: 'cellContent',
					data: 'cellContent',
					width: '100px'
				}, {
					targets: 6,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '150px',
					render: function(data, type, row, meta) {
						let renderStr = '<p style="word-wrap: break-word;word-break: normal;width: 150px;"><a name="gotoPosition" class="postil-list-username" style="cursor: pointer;" data-row="' + meta.row + '">'+ data +'</a></p>';
						return renderStr;
					}
				}, {
					targets: 7,
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
					targets: 8,
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
					targets: 9,
					title: '状态',
					className: 'text-center',
					name: 'ACTIVE_FLAG',
					data: 'ACTIVE_FLAG',
					renderer: 'getDicLabelByVal|批注状态',
					width: '50px',
					render(data) {
						return DicVal2Nm(data, '批注状态');//data == 1 ? '开启' : '关闭';
					}
				}, {
					targets: 10,
					title: '创建人',
					className: 'text-center',
					name: '__ucreateUserName',
					data: '__ucreateUserName',
					width: '60px'
				}, {
					targets: 11,
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

	/**
	 * 统计数据
	 */
	function countInfoInit() {
		$postilCount1.text('');
		$postilCount2.text('');
		$postilCount3.text('');
		$postilCount4.text('');
		$postilCount5.text('');
		$postilCount6.text('');
		$postilCount7.text('');
		$.ajax({
			url: 'dgCenter/DgPostil.countInfoInit.json',
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(data) {
			if (data.success) {
				let dataList = data.data[0];
				$postilCount1.text(dataList.postil1 + ' / ' + dataList.postilTotal1);
				$postilCount2.text(dataList.postil2 + ' / ' + dataList.postilTotal2);
				$postilCount3.text(dataList.postil3 + ' / ' + dataList.postilTotal3);
				$postilCount4.text(dataList.postil4 + ' / ' + dataList.postilTotal4);
				$postilCount5.text(dataList.postil5 + ' / ' + dataList.postilTotal5);
				$postilCount6.text(dataList.postil6 + ' / ' + dataList.postilTotal6);
				$postilCount7.text(dataList.postil7 + ' / ' + dataList.postilTotal7);
			}
		});
	}

	/**
	 * 绑定事件
	 */
	function eventBind() {
		(function(){
			if(window.CUR_CUSTOMERID != null && window.CUR_PROJECTID != null){
				var queryFilterArr = [];
				var filter = {
					field: 'activeFlag',
					sqlIndex: 'a.ACTIVE_FLAG',
					value: '1',
					type: 'string',
					operate: 'eq'
				};
				queryFilterArr.push(filter);
				var queryString = JSON.stringify(queryFilterArr);
				postilsTableCfg.localParam.urlparam.filter = queryString;
				BdoDataTable('postilsTable', postilsTableCfg);
			}
		})();
		$('#postilsTitle a').on('click', function() {
			var queryFilterArr = [];
			var filter = {
				field: 'auditState',
				sqlIndex: 'a.auditState',
				type: 'number',
				operate: 'eq'
			};
			if (this.getAttribute('data-result') == '1') {
				filter.value = 100;
			} else if (this.getAttribute('data-result') == '2') {
				filter.value = 200;
			} else if (this.getAttribute('data-result') == '3') {
				filter.value = 300;
			} else if (this.getAttribute('data-result') == '4') {
				filter.value = 400;
			} else if (this.getAttribute('data-result') == '5') {
				filter.value = 500;
			} else if (this.getAttribute('data-result') == '6') {
				filter.value = 600;
			} else if (this.getAttribute('data-result') == '7') {
				filter.value = 700;
			}
			$('#detail_auditState').val(filter.value);
			queryFilterArr.push(filter);
			var queryString = JSON.stringify(queryFilterArr);
			postilsTableCfg.localParam.urlparam.filter = queryString;
			BdoDataTable('postilsTable', postilsTableCfg);
		});
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
							filter.sqlIndex = 'a.ACTIVE_FLAG';
							filter.operate = 'eq';
							filter.type = 'number';
							break;
						case 'detail_postilLevel':
							filter.operate = 'eq';
							break;
						case 'detail_fileName':
							filter.sqlIndex = 'a.nodeName';
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
			postilsTableCfg.localParam.urlparam.filter = queryString;
			BdoDataTable('postilsTable', postilsTableCfg);
		});

		/** 重置按钮 */
		$('#btn_clear').click(function() {
			$('#detail_content').val('');
			$('#detail_indexId').val('');
			$('#detail_auditState').val('');
			$('#detail_postilLevel').val('');
			$('#detail_activeFlag').val('1');
		});

		$('#postilsTable').on('click', 'button.table-btn-operate[name="viewPostilBtn"]', event => {
			var rowNum = $(event.currentTarget).attr('data-row');
			$('#postilsTable_rownum').val(rowNum);
			var table = $('#postilsTable').dataTable();
			var rowData = table.fnGetData(rowNum);
			DgPostilPage({
				region: '#sideRegin',
				data: rowData,
				type: rowData.type,
				foreignId: rowData.foreignId,
				isSingle: true,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			});
			$('#postilmodal').modal('show');
		});
		$('#postilsTable ').on('click', 'a[name="gotoPosition"]', event =>{
			var rowNum = $(event.currentTarget).attr('data-row');
			$('#postilsTable_rownum').val(rowNum);
			var table = $('#postilsTable').dataTable();
			var rowData = table.fnGetData(rowNum);
			if (rowData.type.substring(0, 3) == 'DG-' ) {
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
			}else {
				window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + rowData.type);
			}
		});

		$('#postilsExportBtn').click(function(event) {
			downloadFile('dgCenter/ExportOtherDg.exportPostilExcel.json', {});
		});
	}

	/**
	 * 初始化页面
	 */
	function init() {
		$('#toggleBtn').click();
		countInfoInit();
		eventBind();
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(function() {
	new PostilsPage($('#postilsPage')).init();
});




