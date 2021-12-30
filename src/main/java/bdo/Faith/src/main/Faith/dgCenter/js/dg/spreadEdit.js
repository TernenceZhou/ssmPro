/**
 * 在线底稿
 */
var SpreadEditPage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
		, setHeight
		, getHeight
		, transition // 过度效果接口
		, getExcelData // 获取excel 文件数据接口
		, saveExcelServer // 保存excel 接口
		, storage = window.localStorage // 浏览器缓存接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, blobToDataURL // 文件数据类型转换接口
		, saveExcel // 保存 excel 文件接口
		, exportExcel // 导出 excel 文件接口
		, saveFileInStorage // 保存 excel 文件到浏览器缓存接口
		, getFileFromStorage // 从浏览器缓存中获取文件数据
		, workpaperId
		, customerId
		, projectId
		, storageId
		, storageStatus
		, storageTime
		, fileName
		, fullPath
		, fullName
		, batchUploadWPAttachFormCfg  // 底稿附件批量上传的配置
		, batchUploadWPAttachForm  // 底稿附件批量上传
		, dgparam
		, redirectList
		, params
		, designer;

	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/html/dg/spreadEdit.html');
	agrs.template = _template;

	workpaperId = _data.extraOptions.workpaperId;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	storageId = 'BDO' + workpaperId;
	storageStatus = 'BDO' + workpaperId + 'Status';
	storageTime = 'BDO' + workpaperId + 'Time';
	fileName = _data.extraOptions.nodeName;
	fullName = _data.extraOptions.tbSubjectName + '/' + _data.extraOptions.userSubjectName + '/' + fileName;
	if (height <= 0) {
		height = $('body').height() - 20;
	}

	/**
	 * begin
	 */
	// 底稿Table
	var dgTable;
	// 附注Table
	var noteTable;
	// 其他文件Table
	var otherTable;
	// 关联其他底稿Table
	var referredDgTable;
	// 被其他底稿关联Table
	var dgReferredTable;
	// 标签Table
	var tagsMainTable;
	// 公式Table
	var formulaTable;
	// 审计调整数据Table
	var adjustData_table_view;
	// 底稿附件Table
	var dgPageAttachTable;
	// 抽凭附件Table
	var samplingAttachTable;
	// 抽凭Table
	var dgSamplingInfo_view;
	// 替代测试table
	var dgSubstitute_view;
	// 替代测试计数table
	var dgSubstituteCount_view;
	// 凭证测试计数table
	var dgVoucherTestCount_view;
					
	function initData(){
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00330',
				param1: customerId,
				param2: projectId,
				param3: workpaperId
			},
			dataType: 'json',
			success: function(data){
				if(data.success){
					redirectList = data.data;
					if (data.data.length == 0) {
						return
					}
					var designerConfig = designer._config;
					designerConfig.commandMap = {};
					designer.generateOtherDg = {};
					for(var list of data.data){
						var commandName = 'generateOtherDg' + list.redirectId;
						designer.generateOtherDg[commandName] = list.redirectName;
						ribbonFileCommands[commandName] = {
							iconClass: 'ribbon-generateOtherDg',
							text: list.redirectName,
							title: list.redirectName,
							commandName: commandName,
							execute: function generateOtherDg(context) {
								var optionText = context.generateOtherDg[this.commandName];
								otherDgChioce(redirectList, optionText);
							}
						};
						Object.assign(designerConfig.commandMap, ribbonFileCommands);
						$.each(designerConfig.ribbon, function(i, ribbon){
							if(ribbon.id == 'bdo'){
								var isExist = false;
								for(var buttonGroups of ribbon.buttonGroups){
									if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-spreadsettings-' + designer.userSubjectId){
										isExist = true;
									}
								}
								if(isExist){
									$.each(ribbon.buttonGroups, function(index, buttonGroups){
										if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-spreadsettings-' + designer.userSubjectId){
											buttonGroups.commandGroup.children[0].commands.push(commandName);
										}
									});
								}else{
									var ribbonFileConfig = {
										'label': designer.userSubjectName,
										'thumbnailClass': 'ribbon-thumbnail-spreadsettings-' + designer.userSubjectId,
										'commandGroup': {
											'children': [{
												'direction': 'vertical',
												'commands': [commandName]
											}]
										}
									};
									ribbon.buttonGroups.push(ribbonFileConfig);
								}
							}
						});
					}
					designer.setConfig(designerConfig);
					// 删除菜单栏--文件
					$(designer._container).children('.ribbon').find('.fileButton').remove();
					designeReadied();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		
		dgTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00112',
						param1: customerId,
						param2: projectId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				searching: true,
				scrollX: true,
				scrollY: '290px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '50px'
				}, {
					targets: 2,
					orderable: true,
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: 3,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '80px'
				}, {
					targets: 4,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '200px'
				}, {
					targets: 5,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"openDgFile\" type=\"button\" title=\"打开底稿\"><i class=\"fa fa-eye\"></i></button>';
						return renderStr;
					}
				}, {
					targets: 6,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}
				]
			}
		};
		noteTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00090',
						param1: customerId,
						param2: projectId,
						param4: 1,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '290px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '附注编号',
					name: 'noteNo',
					data: 'noteNo',
					width: '100px'
				}, {
					targets: 2,
					orderable: true,
					title: '附注名称',
					name: 'noteName',
					data: 'noteName',
					width: '100px'
				}, {
					targets: 3,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"openNoteFile\" type=\"button\" title=\"打开附注\"><i class=\"fa fa-eye\"></i></button>';
						return renderStr;
					}
				}, {
					targets: 4,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}
				]
			}
		};
		otherTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00321',
						param1: customerId,
						param2: projectId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '290px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '80px'
				}, {
					targets: 2,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '200px'
				}, {
					targets: 3,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"openDgFile\" type=\"button\" title=\"打开底稿\"><i class=\"fa fa-eye\"></i></button>';
						return renderStr;
					}
				}, {
					targets: 4,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}
				]
			}
		};
		referredDgTable = {
			localParam: {
				url: 'dgCenter/DgPaper.getAllReferredDgInfo.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: workpaperId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '290px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '80px'
				},{
					targets: 2,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '120px'
				},{
					targets: 3,
					orderable: true,
					title: '文件类型',
					className: 'text-center',
					name: 'fileType',
					data: 'fileType',
					width: '80px',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, '文件类型');
					}
				}, {
					targets: 4,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" name="openFile" type="button" title="打开文件"><i class="fa fa-eye"></i></button>';
						return renderStr;
					}
				}]
			}
		};
		dgReferredTable = {
			localParam: {
				url: 'dgCenter/DgPaper.getAllDgReferredInfo.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: workpaperId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '290px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '80px'
				},{
					targets: 2,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '120px'
				},{
					targets: 3,
					orderable: true,
					title: '文件类型',
					className: 'text-center',
					name: 'fileType',
					data: 'fileType',
					width: '80px',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, '文件类型');
					}
				}, {
					targets: 4,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" name="openFile" type="button" title="打开文件"><i class="fa fa-eye"></i></button>';
						return renderStr;
					}
				}]
			}
		};
		tagsMainTable = {
			localParam: {
				// url: 'dgCenter/DgGeneral.query.json',
				url: 'dgCenter/DgWapper.getAllTags.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00083',
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param4: '',
						param5: workpaperId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '115px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '标签',
					name: 'autoId',
					data: 'autoId',
					width: '60px',
					render: function(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + 'p' + data + '</a>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					title: '标签名',
					name: 'tagName',
					data: 'tagName',
					width: '100px'
				}, {
					targets: 3,
					orderable: true,
					title: '标签属性',
					className: 'text-center',
					name: 'tagProperty',
					data: 'tagProperty',
					renderer: 'getDicLabelByVal|标签属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '标签属性');
					}
				}, {
					targets: 4,
					orderable: true,
					title: '标签类型',
					className: 'text-center',
					name: 'tagType',
					data: 'tagType',
					renderer: 'getDicLabelByVal|标签类型',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '标签类型');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '位置',
					name: 'otherPosition',
					data: 'otherPosition',
					width: '100px'
				}, {
					targets: 6,
					orderable: true,
					title: '详细位置',
					name: 'tagPosition',
					data: 'tagPosition',
					width: '100px'
				}, {
					targets: 7,
					orderable: true,
					className: 'text-right',
					title: '标签值',
					name: 'tagValue',
					data: 'tagValue',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.tagProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\" disabled><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						}
						return renderStr;
					}
				}, {
					targets: 9,
					name: 'tagDgId',
					data: 'tagDgId',
					visible: false
				}, {
					targets: 10,
					name: 'tagInfo',
					data: 'tagInfo',
					visible: false
				}
				]
			}
		};
		formulaTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00114',
						param1: customerId,
						param2: projectId,
						param3: '',
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '240px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '60px',
					render: function(data, type, row, meta) {
						if(data){
							renderStr = '<label>' + data + '</label>';
						}else{
							renderStr = '<label></label>';
						}
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '公式类型',
					name: 'formulaType',
					data: 'formulaType',
					renderer: 'getDicLabelByVal|校验公式类型',
					width: '100px',
					render(data) {
						return DicVal2Nm(data, '校验公式类型');
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式属性',
					name: 'formulaProperty',
					data: 'formulaProperty',
					renderer: 'getDicLabelByVal|校验公式属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '校验公式属性');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 6,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-center',
					title: '公式校验结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data == 1) {
							let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
							return renderStr;
						}
					}
				}, {
					targets: 9,
					orderable: true,
					title: '校验时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 10,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.formulaProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\" disabled><i class=\"fa fa-edit\"></i></button>';
							renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\" disabled><i class=\"fa fa-trash-o\"></i></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\"><i class=\"fa fa-edit\"></i></button>';
							renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
						}
						return renderStr;
					}
				}, {
					targets: 11,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}
				]
			}
		};
		adjustData_table_view = {
			localParam: {
				// url: 'dgCenter/DgGeneral.query.json',
				url: 'dgCenter/DgWapper.getAllAdjustData.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00189',
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: '',
						param4: designer.userSubjectId,
						param5: '',
						param7: workpaperId,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				autoWidth: false,
				scrollX: true,
				scrollY: '300px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '80px'
				}, {
					targets: 2,
					orderable: true,
					title: '科目名称',
					name: 'subjectname1',
					data: 'subjectname1',
					width: '100px'
				}, {
					targets: 3,
					orderable: true,
					title: '科目全路径',
					name: 'subjectFullName1',
					data: 'subjectFullName1',
					width: '120px'
				}, {
					targets: 4,
					orderable: true,
					title: '核算项编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '100px'
				}, {
					targets: 5,
					orderable: true,
					title: '核算项名称',
					name: 'assItemName',
					data: 'assItemName',
					width: '100px'
				}, {
					targets: 6,
					orderable: true,
					title: '调整数',
					className: 'text-right',
					name: 'adjust',
					data: 'adjust',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.adjust == null) {
							return '---';
						}
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					title: '调整数(借)',
					className: 'text-right',
					name: 'adjust1',
					data: 'adjust1',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.adjust1 == null) {
							return '---';
						}
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					title: '调整数(贷)',
					className: 'text-right',
					name: 'adjust2',
					data: 'adjust2',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.adjust2 == null) {
							return '---';
						}
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 9,
					orderable: true,
					title: '调整索引',
					className: 'text-center',
					name: 'indexId',
					data: 'indexId',
					width: '160px',
					render: function(data, type, row, meta) {
						if (row.indexId == null) {
							return '---';
						}
						return data;
					}
				}
				]
			}
		};
		dgPageAttachTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00242',
					param1: customerId,
					param2: workpaperId
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				scrollY : '320px',
				scrollCollapse: true,
				pageLength: 30,
				select: false,
				ordering : false,
				serverSide: true,
				fixedThead: true,
				fixedHeight: '480px',
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
					targets: 2,
					orderable: true,
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '120px'
				}, {
					targets: 3,
					orderable: true,
					title: '底稿名称',
					name: 'dgName',
					data: 'dgName',
					width: '150px'
				}, {
					targets: 4,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '150px'
				}, {
					targets: 5,
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
					targets: 6,
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
					targets: 7,
					orderable: true,
					className: 'text-center',
					title: '上传人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: '100px'
				}]
			}
		};
		samplingAttachTable = {
			localParam: {
				url: 'finCenter/Sampling.querySamplingFile.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00328',
					lockCustomerId: customerId,
					lockProjectId: projectId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param1: customerId,
					param2: projectId,
					param3: _data.extraOptions.userSubjectId,
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '300px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					className: 'text-left',
					title: '文件索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '80px'
				}, {
					targets: 2,
					className: 'text-left',
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '120px'
				}, {
					targets: 3,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class="btn btn-xs table-btn-operate btn-primary" name="openSamplingAttachFile" type="button" title="打开抽凭附件" data-row="' + meta.row + '"><i class="fa fa-eye"></i></button>';
						return renderStr;
					}
				}, {
					targets: 4,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}, {
					targets: 5,
					name: 'subjectentryId',
					data: 'subjectentryId',
					visible: false
				}, {
					targets: 6,
					name: 'suffix',
					data: 'suffix',
					visible: false
				}]
			}
		};
		dgSamplingInfo_view = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {

					sqlId: 'DG10002',
					menuId: window.sys_menuId,
					param1: projectId,
					param2: '',
					param3: '',
					param4: '',
					param5: $('#sampling_sampleMethod').val(),
					param6: '',
					param7: '',
					param11: $('#sampling_subjectid').val(),
					param12: '',
					param13: '',
					param14: '',
					param15: '',
					param16: $('#sampling_sampleName').val(),
					param17: '1',
					lockCustomerId: customerId
				}
			},
			tableParam: {
				select: true,
				scrollX: true,
				scrollY: false,
				//scrollCollapse: true,
				lengthChange: false,
				ordering: false,
				serverSide: true,
				autoWidth: false,
				//order: [1, 'asc'],
				pageLength: 30,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-left',
						title: '凭证编号',
						name: 'oldVoucherId',
						data: 'oldVoucherId',
						width: '60px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-left',
						title: '凭证日期',
						name: 'vchDate',
						data: 'vchDate',
						width: '100px'
					}, {
						targets: 3,
						orderable: true,
						className: 'text-left',
						title: '抽凭方式',
						name: 'sampleMethod',
						data: 'sampleMethod',
						width: '150px'
					}, {
						targets: 4,
						orderable: false,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '60px'
					}, {
						targets: 5,
						orderable: false,
						className: 'text-left',
						title: '科目名称',
						name: 'subjectname',
						data: 'subjectname',
						width: '150px'
					}, {
						targets: 6,
						className: 'text-left',
						title: '核算类型',
						name: 'assTotalName',
						data: 'assTotalName',
						width: '200px'
					}, {
						targets: 7,
						className: 'text-left',
						title: '对方科目',
						name: 'oppositeAccountLast',
						data: 'oppositeAccountLast',
						width: '200px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}, {
						targets: 8,
						className: 'text-right',
						title: '借方发生金额',
						name: 'debitValue',
						data: 'debitValue',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 9,
						className: 'text-right',
						title: '贷方发生金额',
						name: 'crebitValue',
						data: 'crebitValue',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 10,
						orderable: false,
						className: 'text-left',
						title: '审计结论',
						name: 'auditResultName',
						data: 'auditResultName',
						width: '200px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}, {
						targets: 11,
						orderable: false,
						className: 'text-left',
						title: '索引号',
						name: 'fileIndexId',
						data: 'fileIndexId',
						width: '200px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}, {
						targets: 12,
						orderable: true,
						className: 'text-left',
						title: '附件内容',
						name: 'content',
						data: 'content',
						width: '200px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}, {
						targets: 13,
						orderable: false,
						className: 'text-left',
						title: '备注',
						name: 'remark',
						data: 'remark',
						width: '200px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
							
					}, {
						targets: 14,
						orderable: true,
						className: 'text-left',
						title: '原始凭证内容完整',
						name: 'contentComplete',
						data: 'contentComplete',
						width: '110px'
					}, {
						targets: 15,
						orderable: true,
						className: 'text-left',
						title: '有授权批准',
						name: 'authorize',
						data: 'authorize',
						width: '100px'
					}, {
						targets: 16,
						orderable: true,
						className: 'text-left',
						title: '账务处理正确',
						name: 'handleCorrect',
						data: 'handleCorrect',
						width: '100px'
					}, {
						targets: 17,
						orderable: true,
						className: 'text-left',
						title: '账证的内容相符',
						name: 'contentMatch',
						data: 'contentMatch',
						width: '100px'
					}, {
						targets: 18,
						orderable: true,
						className: 'text-left',
						title: '账证的金额相符',
						name: 'amountMatch',
						data: 'amountMatch',
						width: '100px'
					}, {
						targets: 19,
						orderable: true,
						className: 'text-left',
						title: '截止测试正确',
						name: 'cutoffCorrect',
						data: 'cutoffCorrect',
						width: '100px'
					}, {
						targets: 20,
						orderable: true,
						className: 'text-left',
						title: '核对内容6',
						name: 'customizeResult1',
						data: 'customizeResult1',
						width: '100px'
					}, {
						targets: 21,
						orderable: true,
						className: 'text-left',
						title: '核对内容7',
						name: 'customizeResult2',
						data: 'customizeResult2',
						width: '100px'
					}, {
						targets: 22,
						orderable: true,
						className: 'text-left',
						title: '核对内容8',
						name: 'customizeResult3',
						data: 'customizeResult3',
						width: '100px'
					}, {
						targets: 23,
						orderable: true,
						className: 'text-left',
						title: '核对内容9',
						name: 'customizeResult4',
						data: 'customizeResult4',
						width: '100px'
					}, {
						targets: 24,
						orderable: true,
						className: 'text-left',
						title: '抽凭名称',
						name: 'sampleName',
						data: 'sampleName',
						width: '100px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}, {
						targets: 25,
						orderable: true,
						className: 'text-left',
						title: '关联抽凭名称',
						name: 'relateSampleName',
						data: 'relateSampleName',
						width: '100px',
						render(data, tyep, row, meta) {
							if(data != null){
								let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
								return resultStr;
							}else{
								return data;
							}
						}
					}
				]
			}
		};
		dgSubstitute_view = {
			localParam: {
				tabNum: true,
				url: '',
				urlparam: {
					sqlId: 'FINDG000005',
					menuId: window.sys_menuId,
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId,
					param1: '',
					param2: '',
					param3: '',
					param4: '',
					param5: '',
					param6: ''
				}
			},
			tableParam: {
				select: true,
				scrollX: true,
				scrollY: false,
				dom: '<"row"<"col-sm-12"tr>>',
				//scrollCollapse: true,
				lengthChange: false,
				ordering: false,
				serverSide: true,
				autoWidth: false,
				//pageLength: 30,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-left',
						title: '单位名称',
						name: 'assItemName',
						data: 'assItemName',
						width: '150px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 3,
						orderable: false,
						className: 'text-right',
						title: '本期增加',
						name: 'debitTotalOcc',
						data: 'debitTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == 1){
								return formatMoney(data);
							}else{
								return formatMoney(row.creditTotalOcc);
							}
						}
					}, {
						targets: 4,
						orderable: false,
						className: 'text-right',
						title: '本期减少',
						name: 'creditTotalOcc',
						data: 'creditTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == -1){
								return formatMoney(row.debitTotalOcc);
							}else{
								return formatMoney(data);
							}
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}
				]
			}
		};
		dgSubstituteCount_view = {
			localParam: {
				tabNum: true,
				url: 'dgCenter/DgWapper.getSubstituteAssitemData.json',
				urlparam: {
					sqlId: 'FINDG000005',
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId
				}
			},
			tableParam: {
				select: true,
				scrollX: false,
				scrollY: false,
				dom: '<"row"<"col-sm-12"tr>>',
				//scrollCollapse: true,
				lengthChange: true,
				ordering: false,
				serverSide: true,
				//autoWidth: false,
				//pageLength: 30,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-left',
						title: '单位名称',
						name: 'assItemName',
						data: 'assItemName',
						width: '150px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 3,
						orderable: false,
						className: 'text-right',
						title: '本期增加',
						name: 'debitTotalOcc',
						data: 'debitTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == 1){
								return formatMoney(data);
							}else{
								return formatMoney(row.creditTotalOcc);
							}
						}
					}, {
						targets: 4,
						orderable: false,
						className: 'text-right',
						title: '本期减少',
						name: 'creditTotalOcc',
						data: 'creditTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == -1){
								return formatMoney(row.debitTotalOcc);
							}else{
								return formatMoney(data);
							}
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}
				]
			}
		};
		dgVoucherTestCount_view = {
			localParam: {
				tabNum: true,
				url: 'dgCenter/DgWapper.getVoucherTestAssitemData.json',
				urlparam: {
					sqlId: 'FINDG000005',
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId
				}
			},
			tableParam: {
				select: true,
				scrollX: false,
				scrollY: false,
				dom: '<"row"<"col-sm-12"tr>>',
				//scrollCollapse: true,
				lengthChange: true,
				ordering: false,
				serverSide: true,
				//autoWidth: false,
				//pageLength: 30,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-left',
						title: '单位名称',
						name: 'assItemName',
						data: 'assItemName',
						width: '150px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 3,
						orderable: false,
						className: 'text-right',
						title: '本期增加',
						name: 'debitTotalOcc',
						data: 'debitTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == 1){
								return formatMoney(data);
							}else{
								return formatMoney(row.creditTotalOcc);
							}
						}
					}, {
						targets: 4,
						orderable: false,
						className: 'text-right',
						title: '本期减少',
						name: 'creditTotalOcc',
						data: 'creditTotalOcc',
						width: '100px',
						render: function(data, type, row, meta) {
							if(row.directionType == -1){
								return formatMoney(row.debitTotalOcc);
							}else{
								return formatMoney(data);
							}
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}
				]
			}
		};
	}

	var needSuspend;
	var tipWidth = 600;

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

	function getCustomizeStyle(isBox) {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00072',
				param1: customerId,
				param2: workpaperId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '')) {
						// 交叉索引
						designer.setShowMutualIndexCacheMap(JSON.parse(data.data[0].customizeStyle).ShowMutualIndexCacheMap);
						// 单向链接(左link)
						designer.setShowSingleLinkCacheMap(JSON.parse(data.data[0].customizeStyle).ShowSingleLinkCacheMap);
						// 抽凭附件链接(左link)
						designer.setShowAuditSamplingCacheMap(JSON.parse(data.data[0].customizeStyle).ShowAuditSamplingCacheMap);
					}
					if (data.data && data.data[0] && (data.data[0].dgValueInfo && data.data[0].dgValueInfo != '')) {
						// 底稿取值
						designer.setDgFetchCacheMap(JSON.parse(data.data[0].dgValueInfo).DgFetchCacheMap);
					}
					// 设置活动单元格
					if ($.sessionStorage('cellLinkFormula') != null || $.sessionStorage('cellLinkFormulaBySheetName') != null) {
						designer.setCellLink();
					}
					if(isBox){
						bdoSuccessBox('加载完成', data.resultInfo.statusText);
					}
				}
			}
		});
	}

	function checkAdjustData() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00189',
				param1: customerId,
				param2: projectId,
				param4: designer.userSubjectId,
				param5: 2,
				param6: workpaperId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					var isNull = false;
					if (data.data.length > 0) {
						isNull = true;
					}
					if (isNull) {
						$('#positionAdjustDataBtn').show();
						$('#adjust_warning_text').text('该底稿包含审计调整数据!');
					} else {
						$('#positionAdjustDataBtn').hide();
						$('#adjust_warning_text').empty();
					}
				}
			}
		});
	}

	function updateLayout() {
		var $spreadContainer = $('#spreadContainer');
		var $spreadWrapper = $('.spreadWrapper', $spreadContainer);
		$spreadContainer.css('position', 'relative');
		$spreadWrapper.css('height', (getHeight() - 255) + 'px');
		$spreadWrapper.css('position', 'relative');
		$('.ss.gc-no-user-select', $spreadWrapper).css('position', 'relative');
		$('.header').css('width', '100%');
		if ($('.ribbon-bar').data('gcui-gcuiribbon')) {
			$('.ribbon-bar').data('gcui-gcuiribbon').updateRibbonSize();
		}
		//designer.wrapper.reset();
		spread = designer.Spread;
		let refreshFlg = true;
		if (spread && spread.isPaintSuspended()) {
			spread.resumePaint();
			spread.refresh();
			needSuspend = true;
			refreshFlg = false;
		}
		if (refreshFlg && spread) {
			spread.refresh();
		}
	}

	var _windowResizeTimer = null;

	function _doWindowResize() {
		if (_windowResizeTimer) {
			window.clearTimeout(_windowResizeTimer);
		}
		_windowResizeTimer = window.setTimeout(function() {
			updateLayout();
			_windowResizeTimer = null;
			if (needSuspend) {
				needSuspend = false;
				window.setTimeout(function() {
					designer.Spread.suspendPaint();
				}, 300);
			}
		}, 100); //now delay 100ms to resize designer
	}

	function designeReadied() {
		$(window).unbind('resize.gcuiribbon');
		$('#verticalSplitter').show();
		updateLayout();
		
		designer.tagChanged = [];
		
		// 行变化事件
		designer.Spread.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
			var rowNum = info.count;
			if(info.propertyName == 'deleteRows'){
				rowNum = rowNum * -1;
			}
			var tagChangedInfo = {};
			tagChangedInfo.rowIndex = info.row;
			tagChangedInfo.sheetName = info.sheetName;
			tagChangedInfo.sheetIndex = designer.Spread.getActiveSheetIndex();
			tagChangedInfo.rowNum = rowNum;
			tagChangedInfo.type = 'rowChanged';
			designer.tagChanged.push(tagChangedInfo);
		});
		
		// 列变化事件
		designer.Spread.bind(GC.Spread.Sheets.Events.ColumnChanged, function (e, info) {
			var colNum = info.count;
			if(info.propertyName == 'deleteColumns'){
				colNum = colNum * -1;
			}
			var tagChangedInfo = {};
			tagChangedInfo.colIndex = info.col;
			tagChangedInfo.sheetName = info.sheetName;
			tagChangedInfo.sheetIndex = designer.Spread.getActiveSheetIndex();
			tagChangedInfo.colNum = colNum;
			tagChangedInfo.type = 'columnChanged';
			designer.tagChanged.push(tagChangedInfo);
		});
	}
	var ready = function() {
		designer = initDesignerDg(_data);
		DgAdjustPage({region: '#adjustment', data: _data}).mount();
		DgFunctionsPage({region: '#functionsment', data: _data});
		DgDesignerPage({region: '#designerment', data: _data});
		initData();
		checkAdjustData();
		
		designeReadied();
		window.$bdosnap.init();
		//designer.loader.loadContent($('#spreadContainerRoot'));
		$(window).resize(_doWindowResize);
		$(window).resize();

		$('#verticalSplitter').draggable({
			axis: 'y',
			containment: '#spreadContainer',
			scroll: false,
			zIndex: 100,
			stop: function(event, ui) {
				var $this = $(this), top = $this.offset().top, offset = top - $('.header').height(),
					$content = $('.ss', $('#spreadContainer'));

				// adjust size of related items
				var oldHeight = $('#formulaBarText').height();
				var newHeight = oldHeight + offset;
				var ORIGINAL_FORMULABARTEXT_HEIGHT = 20;
				if (newHeight < ORIGINAL_FORMULABARTEXT_HEIGHT) { // 20: original height of formulaBarText
					// reset to default
					$('#formulaBarText').css({height: ORIGINAL_FORMULABARTEXT_HEIGHT});
					top = top + ORIGINAL_FORMULABARTEXT_HEIGHT - newHeight;
				} else {
					$('#formulaBarText').css({height: newHeight});
				}
				$content.css({top: top + 10}); // 10: height of the space for verticalSplitter
				$content.parent().css({height: $content.height()});
				$('.header').css({height: top});
				$this.css({top: 0});
				designer.Spread.refresh();
			}
		});

		function disableDragDrop(dataTransfer) {
			if (dataTransfer) {
				dataTransfer.effectAllowed = 'none';
				dataTransfer.dropEffect = 'none';
			}
		}

		window.addEventListener('dragenter', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener('dragover', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener('drop', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
	};
	
	/**
	 * end
	 */
	var clickstatus = false;
	var lastX = 0;
	var lastY = 0;
	var lastcX = 0;
	var lastcY = 0;
	document.addEventListener('mousedown', mousedown);
	document.addEventListener('mousemove', mousemove);
	document.addEventListener('mouseup', mouseup);

	function mousedown(e) {
		if (e.target.id === 'modalTitleId') {
			clickstatus = true;
			var moveObject = document.getElementById('adjustDataDiv');
			lastX = moveObject.offsetLeft;
			lastY = moveObject.offsetTop;
			lastcX = e.clientX;
			lastcY = e.clientY;
		}
	}

	function mousemove(e) {
		var moveObject = document.getElementById('adjustDataDiv');
		if (clickstatus) {
			moveObject.style.left = lastX + (e.clientX - lastcX - 10) + 'px';
			moveObject.style.top = lastY + (e.clientY - lastcY - 10) + 'px';
		}
	}

	function mouseup(e) {
		clickstatus = false;
		lastX = 0;
		lastY = 0;
		lastcX = 0;
		lastcY = 0;
	}

	/**
	 * 事件绑定
	 */
	listener = () => {
		/*$('#subPageRight').on('resize', event => {

		});*/
		$('#saveExcelBtn').click((event) => {
			bdoInProcessingBox('保存中');
			var options = _data.extraOptions;
			// 删除底稿下所有单元格批注comments
			for (var i = 0; i < spread.getSheetCount(); i++) {
				var sheet = spread.getSheet(i);
				var comments = sheet.comments.all();
				for (var j = 0; j < comments.length; j++) {
					var rowIndex = comments[j].nT;
					var colIndex = comments[j].oT;
					if (rowIndex > -1 && colIndex > -1) {
						sheet.comments.remove(rowIndex, colIndex);
					}
				}
			}
			transition(() => {
				var json = spread.toJSON();
				saveExcel(json);
			});
		});

		$('#saveExcelStorageBtn').click((event) => {
			transition(() => {
				var json = spread.toJSON();
				saveFileInStorage(json);
			});
		});

		$('#exportExcelBtn').click((event) => {
			var options = _data.extraOptions;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.havePermission.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: options.customerId,
					param2: options.projectId,
					param3: options.workpaperId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						transition(() => {
							exportExcel();
						});
					} else {
						bdoInfoBox('提示', '只有项目负责人或程序控制表中设置的底稿编制人才能导出该底稿!');
					}
				}
			});
		});

		$('.progress-mark').on('toggle-progress', (event1, event2) => {
			switch (event2) {
				case 'show':
					$('#contentBlock').addClass('block-opt-cus-refresh');
					//$('#contentBlock').addClass('block-opt-refresh');
					break;
				case 'hide':
					$('#contentBlock').removeClass('block-opt-cus-refresh');
					//$('#contentBlock').removeClass('block-opt-refresh');
					break;
			}
		});

		// 打开底稿附件对话框
		$('#openDgAttachBtn').click(e => {
			$('#dgAttachModal').modal('show');
		});
		$('#dgAttachModal').on('show.bs.modal', function() {
			BdoDataTable('dgPageAttachTable', dgPageAttachTable);
		});
		// 上传文件按钮
		$('#uploadDgAttachBtn').click(function() {
			$('#batchUploadWPAttachFormModal').modal('show'); 
		});
		$('#transferDgAttachBtn').click(function() {
			var options = _data.extraOptions;
			let param = {
					index: options.indexId,
					userSubjectId: options.userSubjectId,
					userSubjectName: options.userSubjectName,
					nodeName: options.nodeName
			}
			let paramStr = JSON.stringify(param);
			// window.open("./transfer/index.html");
			$('#uploadCpFileModal').modal('show');
			$('#selectFile').html('<iframe id="selectFile" height="600px" width="1000px" style="border: 1px solid #dcdcdc;"  frameborder="0" src="./transfer/index.html?param=' + encodeURI(paramStr) + '"></iframe>');
			// $('#selectFile').contentWindow.location.reload(true);
			// $('#selectFile').attr("src", './transfer/index.html?param=' + encodeURI(paramStr));
		});
		// 底稿附件下载
		$('#dgPageAttachTable').on('click', 'button.table-btn-operate[name="downloadDgAttach"]', event => {
			var table = $('#dgPageAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			//下载底稿附件
			downloadFile('dgCenter/DgDownload.downloadAttach.json', {
				param1: rowData.autoId,
				param2: rowData.customerId
			});
		});
		// 底稿附件预览
		$('#dgPageAttachTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
			var table = $('#dgPageAttachTable').dataTable();
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
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.fileName ,rowData.fileName , 'location=no');
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
		// 底稿附件删除
		$('#dgPageAttachTable').on('click', 'button.table-btn-operate[name="delDgAttach"]', event => {
			var table = $('#dgPageAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '确认删除底稿附件【' + rowData.fileName + '】?', function() {
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
							$('#dgPageAttachTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 打开抽凭附件对话框
		$('#openSamplingAttachBtn').click(e => {
			$('#samplingAttachModal').modal('show');
		});
		$('#samplingAttachModal').on('show.bs.modal', function() {
			BdoDataTable('samplingAttachTable', samplingAttachTable);
		});
		// 抽凭附件预览
		$('#samplingAttachTable').on('click', 'button.table-btn-operate[name="openSamplingAttachFile"]', event => {
			var table = $('#samplingAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			// pdf、jpg、png、jpeg预览 xlsx打开
			// 其他文件格式提示下载
			var id = rowData.autoId;
			var fileSuffix = rowData.suffix.toLowerCase();
			if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" || fileSuffix === "xlsx") {
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00329',
						param1: customerId,
						param2: projectId,
						param3: id,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							if(data.data[0].num > 0){
								if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg") {
									window.open('dgCenter/DgPaper.previewFile.json?param1=' + id + '&param2=type2' + '&param3=' + rowData.fileName, rowData.fileName,'location=no');
								}else if(fileSuffix === "xlsx"){
									var param = {
										customerId: customerId,
										projectId: projectId,
										autoId: id,
										pageType: 2,
										fileName: rowData.fileName
									};
									var nodeData = {
										extraOptions: param,
										currentNode: {
											extraOptions: param
										}
									};
									$.sessionStorage('fileNode', JSON.stringify(nodeData));
									window.open('/Faith/dgcenter.do?m=previewFile');
								}
							}else{
								bdoErrorBox('失败', '抽凭附件不存在！');
							}
						}
					}
				});
			} else {
				downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: id, param2: customerId, param3: 'type2'});
			}
		});
		$('#coverBtn').click((event) => {
			if (!currentNode) {
				return;
			}
			storage.removeItem(storageId);
			storage.removeItem(storageStatus);
			storage.removeItem(storageTime);
			bdoInProcessingBox('加载中...');
			getExcelData({
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: workpaperId,
				param2: customerId
			});
		});

		$('#refreshDgCoverBtn').click((event) => {
			if (!currentNode) {
				return;
			}
			$.ajax({
				url: 'dgCenter/DgWapper.refreshDgCover.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						storage.removeItem(storageId);
						storage.removeItem(storageStatus);
						storage.removeItem(storageTime);
						bdoInProcessingBox('加载中...');
						getExcelData({
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: workpaperId,
							param2: customerId
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		
		$('#postilBtn').click((event) => {
			PostilPage({
				region: '#sideRegin',
				data: _data,
				type: 'DG-' + _data.extraOptions.indexId,
				foreignId: _data.extraOptions.autoId,
				customerId: _data.extraOptions.customerId,
				projectId: _data.extraOptions.projectId
			});
			$('#sideRegin').show();
		});

		$('#newWindowBtn').click(e => {
			e.preventDefault();
			_data.currentNode = $.extend(false, {}, currentNode);
			_data.currentNode.currentNode = null;
			_data.workpagerId = _data.extraOptions.workpagerId;
			$.sessionStorage('subjecttreeNode', JSON.stringify(_data));
			window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + _data.extraOptions.indexId + '&projectId=' + _data.extraOptions.projectId);
		});
		/*$('#dgModal [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/

		$('#dgModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'dgTab':
					$('#dgTable').DataTable().ajax.reload();
					break;
				case 'noteTab':
					$('#noteTable').DataTable().ajax.reload();
					break;
				case 'otherTable':
					$('#otherTable').DataTable().ajax.reload();
					break;
				case 'referredOtherDgTab':
					$('#referredDgTable').DataTable().ajax.reload();
					break;
				case 'otherDgReferredTab':
					$('#dgReferredTable').DataTable().ajax.reload();
					break;
				default:
					break;
			}
		});
		$('#openDgModalBtn').click(e => {
			$('#dgModal').modal('show');
		});
		$('#dgModal').on('show.bs.modal', function() {
			BdoDataTable('dgTable', dgTable);
			BdoDataTable('noteTable', noteTable);
			BdoDataTable('otherTable', otherTable);
			BdoDataTable('referredDgTable', referredDgTable);
			BdoDataTable('dgReferredTable', dgReferredTable);
			$("#dgTable_length").append('<div class="input-group pull-right"><input id="searchText1" type="text" class="form-control" placeholder="科目名称..." style="width: 120px;height: 30px;"><button id="search_dg" class="btn btn-default" type="button" title="科目名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_dg').on('click', function () {
				dgTable.localParam.urlparam.param3 = $('#searchText1').val();
				$('#dgTable').DataTable().ajax.reload();
			});
			$("#noteTable_length").append('<div class="input-group pull-right"><input id="searchText2" type="text" class="form-control" placeholder="附注名称..." style="width: 120px;height: 30px;"><button id="search_note" class="btn btn-default" type="button" title="附注名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_note').on('click', function () {
				noteTable.localParam.urlparam.param3 = $('#searchText2').val();
				$('#noteTable').DataTable().ajax.reload();
			});
			$("#otherTable_length").append('<div class="input-group pull-right"><input id="searchText3" type="text" class="form-control" placeholder="文件名称..." style="width: 120px;height: 30px;"><button id="search_other" class="btn btn-default" type="button" title="文件名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_other').on('click', function () {
				otherTable.localParam.urlparam.param3 = $('#searchText3').val();
				$('#otherTable').DataTable().ajax.reload();
			});
			$("#referredDgTable_length").append('<div class="input-group pull-right"><input id="searchText4" type="text" class="form-control" placeholder="文件名称..." style="width: 120px;height: 30px;"><button id="search_referredDg" class="btn btn-default" type="button" title="文件名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_referredDg').on('click', function () {
				referredDgTable.localParam.urlparam.param4 = $('#searchText4').val();
				$('#referredDgTable').DataTable().ajax.reload();
			});
			$("#dgReferredTable_length").append('<div class="input-group pull-right"><input id="searchText5" type="text" class="form-control" placeholder="文件名称..." style="width: 120px;height: 30px;"><button id="search_dgReferred" class="btn btn-default" type="button" title="文件名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_dgReferred').on('click', function () {
				dgReferredTable.localParam.urlparam.param4 = $('#searchText5').val();
				$('#dgReferredTable').DataTable().ajax.reload();
			});
		});
		$('#referredDgTable').on('click', 'button[name="openFile"]', function() {
			var object = $('#referredDgTable').DataTable().data()[$(this).closest('tr').index()];
			openFile(object);
		});
		$('#dgReferredTable').on('click', 'button[name="openFile"]', function() {
			var object = $('#dgReferredTable').DataTable().data()[$(this).closest('tr').index()];
			openFile(object);
		});
		function openFile(object){
			if(object.fileType == 'attach'){
				openDgAttach(object.autoId + ":", object.fileName);
			} else if (object.fileType == 'sampling'){
				openSamplingAttach(object.autoId, object.fileName);
			} else if (object.fileType == 'dg'){
				var dgFileId = object.autoId;
				if (workpaperId != dgFileId) {
					$('#dgFileTabs li', window.parent.document).removeClass('active');
					$('#dgFileTabContent div', window.parent.document).removeClass('active');
					if ($('#dg_' + dgFileId, window.parent.document).length == 0) {
						setExcelnode(dgFileId);
						var excelnode = designer.excelnode;
						$.sessionStorage('excelnode', JSON.stringify(excelnode));
						$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#dg_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
						var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">'
							+ '<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + object.indexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
							+ '</div>');
						$('#dgFileTabContent', window.parent.document).append($div);
						$('#dgFileTabs a:last', window.parent.document).tab('show');
						if ($('.aside-hide', window.parent.document).length !== 0) {
							$('body', window.parent.document).toggleClass('aside-hide');
							$(window).resize();
						}
					} else {
						$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
						$('#dg_' + dgFileId, window.parent.document).addClass('active');
					}
				}
			} else if (object.fileType == 'note'){
				var dgFileId = object.autoId;
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				if ($('#note_' + dgFileId, window.parent.document).length == 0) {
					setNoteNode(dgFileId);
					var excelnode = designer.excelnode;
					$.sessionStorage('excelnode', JSON.stringify(excelnode));
					$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#note_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
					var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">'
						+ '<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + object.indexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
						+ '</div>');
					$('#dgFileTabContent', window.parent.document).append($div);
					$('#dgFileTabs a:last', window.parent.document).tab('show');
					if ($('.aside-hide', window.parent.document).length !== 0) {
						$('body', window.parent.document).toggleClass('aside-hide');
						$(window).resize();
					}
				} else {
					$('[href="#note_' + dgFileId + '"]', window.parent.document).tab('show');
					$('#dg_' + dgFileId, window.parent.document).addClass('active');
				}
			}
		}
		$('#dgTable').on('click', 'button[name="openDgFile"]', function() {
			var object = $('#dgTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			var node = JSON.parse($.sessionStorage('subjecttreeNode'));
			if (node.extraOptions.workpaperId != dgFileId) {
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				if ($('#dg_' + dgFileId, window.parent.document).length == 0) {
					setExcelnode(dgFileId);
					var excelnode = designer.excelnode;
					$.sessionStorage('excelnode', JSON.stringify(excelnode));
					$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#dg_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
					var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">'
						+ '<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + object.indexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
						+ '</div>');
					$('#dgFileTabContent', window.parent.document).append($div);
					$('#dgFileTabs a:last', window.parent.document).tab('show');
					if ($('.aside-hide', window.parent.document).length !== 0) {
						$('body', window.parent.document).toggleClass('aside-hide');
						$(window).resize();
					}
				} else {
					$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
					$('#dg_' + dgFileId, window.parent.document).addClass('active');
				}
			}
		});
		$('#noteTable').on('click', 'button[name="openNoteFile"]', function() {
			var object = $('#noteTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			if ($('#note_' + dgFileId, window.parent.document).length == 0) {
				setNoteNode(dgFileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#note_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
				var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">'
					+ '<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + object.indexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
					+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if ($('.aside-hide', window.parent.document).length !== 0) {
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			} else {
				$('[href="#note_' + dgFileId + '"]', window.parent.document).tab('show');
				$('#dg_' + dgFileId, window.parent.document).addClass('active');
			}
		});
		$('#otherTable').on('click', 'button[name="openDgFile"]', function() {
			var object = $('#otherTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			var node = JSON.parse($.sessionStorage('subjecttreeNode'));
			if (node.extraOptions.workpaperId != dgFileId) {
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				if ($('#dg_' + dgFileId, window.parent.document).length == 0) {
					setOtherExcelnode(dgFileId);
					var excelnode = designer.excelnode;
					$.sessionStorage('excelnode', JSON.stringify(excelnode));
					$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#dg_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
					var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">'
						+ '<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + object.indexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
						+ '</div>');
					$('#dgFileTabContent', window.parent.document).append($div);
					$('#dgFileTabs a:last', window.parent.document).tab('show');
					if ($('.aside-hide', window.parent.document).length !== 0) {
						$('body', window.parent.document).toggleClass('aside-hide');
						$(window).resize();
					}
				} else {
					$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
					$('#dg_' + dgFileId, window.parent.document).addClass('active');
				}
			}
		});
		/*$('#formulaModal [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/
		$('#tagTypeMain').change((event) => {
			tagsMainTable.localParam.urlparam.param4 = $('#tagTypeMain').val();
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#tagSortMain').change((event) => {
			if($('#tagSortMain').val() == 'dg'){
				tagsMainTable.localParam.urlparam.param5 = workpaperId;
			} else if($('#tagSortMain').val() == 'subject'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00234',
						param1: customerId,
						param2: projectId,
						param3: workpaperId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0] != null) {
								var autoIdStr = '';
								for(var i = 0;i < data.data.length;i++){
									autoIdStr = autoIdStr + ',' + data.data[i].autoId;
								}
								tagsMainTable.localParam.urlparam.param5 = autoIdStr.substring(1);
							}
						}
					}
				});
			} else {
				tagsMainTable.localParam.urlparam.param5 = '';
			}
			$('#tagsMainTable').DataTable().ajax.reload();
		});
        $('#tagAccountAgeTypeMain').change((event) => {
            // tagsAccountAgeMainTable.localParam.urlparam.param4 = $('#tagAccountAgeTypeMain').val();
            // $('#tagsAccountAgeMainTable').DataTable().ajax.reload();
            loadData($('#tagAccountAgeTypeMain').val());
        });
/*
		$('#tagAccountAgeTypeSumMain').change((event) => {
			loadData($('#tagAccountAgeTypeSumMain').val());
		});*/
		$('#formulaTypeMain').change((event) => {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: customerId,
					param2: projectId,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumMain').html(data.data[0].totalNum);
							$('#rightNumMain').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaTable.localParam.urlparam.param4 = $('#formulaTypeMain').val();
			$('#formulaTable').DataTable().ajax.reload();
		});
		$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'tagMainTab':
					$('#tagsMainTable').DataTable().ajax.reload();
					break;
				case 'formulaMainTab':
					var referredAutoId;
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00113',
							param1: customerId,
							param2: projectId,
							param3: 'DG',
							param4: workpaperId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									referredAutoId = data.data[0].infoFormula;
								}
							}
						}
					});
					if (referredAutoId == '') {
						referredAutoId = '0';
					}
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00229',
							param1: customerId,
							param2: projectId,
							param3: referredAutoId,
							param4: $('#formulaTypeMain').val(),
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									$('#totalNumMain').html(data.data[0].totalNum);
									$('#rightNumMain').html(data.data[0].rightNum);
								}
							}
						}
					});
					formulaTable.localParam.urlparam.param3 = referredAutoId;
					BdoDataTable('formulaTable', formulaTable);
					break;
				default:
					break;
			}
		});
		$('#formulaMainTab').on('click', 'a[class="tableRefresh"]', function() {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: customerId,
					param2: projectId,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumMain').html(data.data[0].totalNum);
							$('#rightNumMain').html(data.data[0].rightNum);
						}
					}
				}
			});
		});
		
		// 科目项列、期初数列、调整数列、期末数列--设置列号
		$('#adjustDataDiv').on('click', 'button[name="modal_adjust_location"]', function() {
			var sheet = designer.Spread.getActiveSheet();
			var range = new GC.Spread.Sheets.Range(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			$(this).parent().children('input').val(rangeStr.replace(/[0-9]/ig, ''));
		});
		// 数据类型
		$('#adjustData_type').change(function() {
			adjustData_table_view.localParam.urlparam.param3 = $('#adjustData_type option:selected').attr('data-result');
			adjustData_table_view.localParam.urlparam.param5 = $('#adjustData_adjustType').val();
			$('#adjustData_table').DataTable().ajax.reload();
			fillColumn();
		});
		// 调整类型
		$('#adjustData_adjustType').change(function() {
			adjustData_table_view.localParam.urlparam.param3 = $('#adjustData_type option:selected').attr('data-result');
			adjustData_table_view.localParam.urlparam.param5 = $('#adjustData_adjustType').val();
			$('#adjustData_table').DataTable().ajax.reload();
			fillColumn();
		});
		// 设置已保存的选项列--科目项列、调整数列、调整数(借)列、调整数(贷)列、调整数(索引)列
		function fillColumn() {
			$('#adjustData_subjectIdP').parent().parent().css({'border': '0px'});
			$('#adjustData_subjectNameP').parent().parent().css({'border': '0px'});
			$('#adjustData_assItemIdP').parent().parent().css({'border': '0px'});
			$('#adjustData_assItemNameP').parent().parent().css({'border': '0px'});
			$('#adjustData_itemStartRow_index').parent().parent().css({'border': '0px'});
			$('#adjustData_itemEndRow_index').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_debit').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_credit').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_index').parent().parent().css({'border': '0px'});
			$.ajax({
				url: 'dgCenter/DgWapper.getAdjustColumnSetting.json',
				type: 'post',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
					param4: $('#adjustData_adjustType').val(),
					param5: $('#adjustData_type').val(),
					start: -1,
					limit: -1
				},
				success(data) {
					if (data.success) {
						if(data && data.data){
							$('#adjustData_subjectIdP').val(data.data[0].subjectIdLocation);
							$('#adjustData_subjectNameP').val(data.data[0].subjectNameLocation);
							$('#adjustData_assItemIdP').val(data.data[0].assItemIdLocation);
							$('#adjustData_assItemNameP').val(data.data[0].assItemNameLocation);
							$('#adjustData_itemStartRow_index').val(data.data[0].itemStartRow);
							$('#adjustData_itemEndRow_index').val(data.data[0].itemEndRow);
							$('#adjustData_adjustP').val(data.data[0].adjustLocation);
							$('#adjustData_adjustP_debit').val(data.data[0].debitLocation);
							$('#adjustData_adjustP_credit').val(data.data[0].creditLocation);
							$('#adjustData_adjustP_index').val(data.data[0].indexLocation);
						}else{
							$('#adjustData_subjectIdP').val('');
							$('#adjustData_subjectNameP').val('');
							$('#adjustData_assItemIdP').val('');
							$('#adjustData_assItemNameP').val('');
							$('#adjustData_itemStartRow_index').val('');
							$('#adjustData_itemEndRow_index').val('');
							$('#adjustData_adjustP').val('');
							$('#adjustData_adjustP_debit').val('');
							$('#adjustData_adjustP_credit').val('');
							$('#adjustData_adjustP_index').val('');
						}
						$('#adjustDataDiv').css('display', 'block');
					}
				}
			});
		}
        //获取账龄
        $('#accoutAge_range').focus(function() {
            $('#modal_age').modal('show');
            $('#assitem_tree_age').tree({
                url: 'dgCenter/DgAccountAge.getDgAccountAgeInfo.json',
                params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
                },
                view: {
                    leafIcon: 'fa fa-building text-flat',
                    nodeIcon: 'fa fa-bank text-primary-light',
                    folderSelectable: true,
                    multiSelect: true,
                    showCheckbox: true,
                    selectedColor: '',
                    selectedBackColor: ''
                }
            });
        });
        $('[name=\'accoutAge_type\']').change(function() {
            if ($(this).attr('data-result') == '1') {
                $('#accountAgeName').hide();
                $('#modal_set_age').hide();
                $('#modal_setall_age').show();
                $('#modal_set_adjustAge').hide();
                $('#modal_setall_adjustAge').show();
            } else {
                $('#accountAgeName').show();
                $('#modal_set_age').show();
                $('#modal_setall_age').hide();
                $('#modal_set_adjustAge').show();
                $('#modal_setall_adjustAge').hide();
            }
        });

        $('#modal_age_sure').click(function() {
            var data = {};
            //data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
            var dt = $('#assitem_tree_age').treeview(true).getChecked();
            var selectedLabel = '';
            var selectedValue = '';
            for(var list of dt){
                selectedLabel = selectedLabel + ',' + list.label;
                selectedValue = selectedValue + ',' + list.value;
            }
            $('#accoutAge_range').val(selectedLabel.substring(1));
            $('#accoutAge_range').attr('data-content', selectedLabel.substring(1));
            $('#accoutAge_range').attr('data-result', selectedValue.substring(1));
            $('#modal_age').modal('hide');
            $('#assitem_tree_age').tree('reset');
        });
        $('#modal_age_reset').click(function() {
            $('#modal_age').modal('hide');
            $('#assitem_tree_age').tree('reset');
        });
        //计算未审账龄
        $('#modal_cal_age').click(function() {
        	calAccountAge('0');
        });
        //计算审定账龄
        $('#modal_cal_adjustAge').click(function() {
        	calAccountAge('1');
        });
        var calAccountAge = function(ageType) {
        	//数据写入dg_ara
            //调用service
            var accountAgeRage = $('#accoutAge_range').attr('data-result');
            if ($('#accoutAge_range').val().length == 0){
                bdoErrorBox('失败', '请选择账龄');
                return;
			}else{
            	var cnt = (accountAgeRage.split(',')).length-1;
            	if (cnt >4) {
                    bdoErrorBox('失败', '最多只能选择5个区间');
                    return;
				}
			}
            bdoInProcessingBox('计算账龄中');
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgWapper.getAccountAgeData.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: window.CUR_PROJECT_ACC_YEAR,
                    param4: window.CUR_PROJECT_END_MONTH,
                    param5: designer.userSubjectId,
                    param6: accountAgeRage,
                    param7: workpaperId,
                    param8: designer.userSubjectName,
                    param9: $('#accoutAge_range').attr('data-content'),
                    param10: ageType,
                    start: -1,
                    limit: -1
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        bdoSuccessBox('加载完成', data.resultInfo.statusText);
                    }else{
                        bdoErrorBox('失败', data.resultInfo.statusText);
                    }
                }
            });
        }
        //账龄数据展示
        $('#modal_show_age').click(function() {
        	$("#accountAgeDataShow").modal('show');
        });
        $('#accountAgeDataShow').on('show.bs.modal', function() {
            // BdoDataTable('tagsAccountAgeMainTable', tagsAccountAgeMainTable);
			loadData($('#tagAccountAgeTypeMain').val());
        });
		/*$('#modal_show_age_sum').click(function() {
			$("#accountAgeDataSumShow").modal('show');
		});
		$('#accountAgeDataSumShow').on('show.bs.modal', function() {
			// BdoDataTable('tagsAccountAgeMainTable', tagsAccountAgeMainTable);
			loadDataSum('');
		});*/

        //设置账龄
        $('#modal_set_age').click(function () {
            var flag = checkAccountAgeColumn(1);
			var isCount=false;
            if (!flag) {
                return;
            }
			var name=designer.Spread.getActiveSheet().name();
			if( name== '封面'){
				bdoErrorBox('设置账龄失败', '不能在‘封面’工作表设置账龄数据！');
				return;
			}
			if(name.endWith('(按客户合并)')){
				isCount=true;
			}
            //获取数据
            var data = {};
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.getAccountAgeDataList.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: designer.userSubjectId,
                    param4: $("#accoutAge_name").val(),
                    param5: 1,
                    param6: isCount,
					start: -1,
                    limit: -1
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        data = data.data;
                        if (data.length == 0) {
                            bdoInfoBox('提示', '没有账龄数据可以设置！请点击计算账龄');
                            return;
                        }
                        var accountAgeRage = $('#accoutAge_range').attr('data-result');
                        var accountAgeRages = accountAgeRage.split(',');
                        var accountAgeRageCnt = accountAgeRages.length + 2;
                        var excelArr = getAccountAgeName($('#accoutAge_range').val().split(','));
                        var param = {
							accountAgeItemRowIndex: parseInt($('#accountAge_itemRow_index').val()),
							accoutAgeNameP: $('#accoutAge_nameP').val(),
							accountAgeItemColumnIndex: $('#accountAge_itemColumn_index').val(),
							titleIndex:parseInt($('#accountAge_title_index').val())
						};
						var sheet = designer.Spread.getActiveSheet();
						designer.Spread.suspendPaint();
						designer.Spread.suspendCalcService();
						//清除头部
                        reSetHeadBody(sheet, param, designer.userSubjectId );
                        refreshAccountAgeHead(sheet, excelArr, designer.userSubjectId, param);
						var rowMap=null;
                        if(isCount){
							 rowMap = getSubjectNameRow(sheet, param);
						}else{
							 rowMap = getSubjectNameRowForDetails(sheet, param);
						}

						let cnt = 0;
                        for (var arrayData of data) {
							//console.log('refreshAccountAgeData:'+cnt++);
                            refreshAccountAgeData(sheet, arrayData, accountAgeRageCnt, excelArr, param, rowMap,isCount);
                        }
						designer.Spread.resumeCalcService();
						designer.Spread.resumePaint();
						getCustomizeStyle(true);
                        //bdoSuccessBox('成功', '设置成功！');
                    }else{
                        bdoErrorBox('失败', '设置失败');
                    }
                }
            });
        });
        //设置所有账龄
        $('#modal_setall_age').click(function() {
            var flag = checkAccountAgeColumn(2);
			var isCount=false;
			if (!flag) {
				return;
			}
			var name=designer.Spread.getActiveSheet().name();
			if( name== '封面'){
				bdoErrorBox('设置账龄失败', '不能在‘封面’工作表设置账龄数据！');
				return;
			}
			if(name.endWith('(按客户合并)')){
				isCount=true;
			}
            //获取数据
            var data = {};
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.getAccountAgeDataList.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: designer.userSubjectId,
                    param4: '',
                    param5: 2,
					param6:isCount,
                    start: -1,
                    limit: -1
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        data = data.data;
                        if (data.length == 0) {
                            bdoInfoBox('提示', '没有账龄数据可以设置！请点击计算账龄');
                            return;
                        }
                        var accountAgeRage = $('#accoutAge_range').attr('data-result');
                        var accountAgeRages = accountAgeRage.split(',');
                        var accountAgeRageCnt = accountAgeRages.length + 2;
                        var excelArr = getAccountAgeName($('#accoutAge_range').val().split(','));
						var param = {
							accountAgeItemRowIndex: parseInt($('#accountAge_itemRow_index').val()),
							accoutAgeNameP: $('#accoutAge_nameP').val(),
							accountAgeItemColumnIndex: $('#accountAge_itemColumn_index').val(),
							titleIndex:parseInt($('#accountAge_title_index').val())
						};
						var sheet = designer.Spread.getActiveSheet();
						designer.Spread.suspendPaint();
						designer.Spread.suspendCalcService();
                        //清除头部
                        reSetHeadBody(sheet, param, designer.userSubjectId );
                        refreshAccountAgeHead(sheet, excelArr, designer.userSubjectId, param);
						var rowMap = null;
						if(isCount){
							rowMap = getSubjectNameRow(sheet, param);
						}else{
							rowMap = getSubjectNameRowForDetails(sheet, param);
						}
						let cnt = 0;
                        for (var arrayData of data) {
                        	//console.log('refreshAccountAgeData:'+cnt++);
                            refreshAccountAgeData(sheet, arrayData, accountAgeRageCnt, excelArr, param, rowMap,isCount);
                        }
						designer.Spread.resumeCalcService();
						designer.Spread.resumePaint();
						getCustomizeStyle(true);
                        //bdoSuccessBox('成功', '设置成功！');
                    }else{
                        bdoErrorBox('失败', '设置失败');
                    }
                }
            });
        });
        //设置单项审定账龄
        $('#modal_set_adjustAge').click(function () {
            var flag = checkAccountAgeColumn(3);
			var isCount=false;
            if (!flag) {
                return;
            }
			var name=designer.Spread.getActiveSheet().name();
			if( name== '封面'){
				bdoErrorBox('设置账龄失败', '不能在‘封面’工作表设置账龄数据！');
				return;
			}
			if(name.endWith('(按客户合并)')){
				isCount=true;
			}
            //获取数据
            var data = {};
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.getAccountAgeDataList.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: designer.userSubjectId,
                    param4: $("#accoutAge_name").val(),
                    param5: 1,
                    param6: isCount,
					start: -1,
                    limit: -1
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        data = data.data;
                        if (data.length == 0) {
                            bdoInfoBox('提示', '没有账龄数据可以设置！请点击计算账龄');
                            return;
                        }
                        var accountAgeRage = $('#accoutAge_range').attr('data-result');
                        var accountAgeRages = accountAgeRage.split(',');
                        var accountAgeRageCnt = accountAgeRages.length + 2;
                        var excelArr = getAccountAgeName($('#accoutAge_range').val().split(','));
                        var param = {
							accountAgeItemRowIndex: parseInt($('#accountAge_itemRow_index').val()),
							accoutAgeNameP: $('#accoutAge_nameP').val(),
							accountAgeItemColumnIndex: $('#accountAge_itemColumn_index').val(),
							accountAgeAdjustColumnIndex: $('#accountAge_adjustColumn_index').val(),
							titleIndex:parseInt($('#accountAge_title_index').val()),
							ageType:'1'
						};
						var sheet = designer.Spread.getActiveSheet();
						designer.Spread.suspendPaint();
						designer.Spread.suspendCalcService();
						//清除头部
                        reSetHeadBody(sheet, param, designer.userSubjectId);
                        refreshAccountAgeHead(sheet, excelArr, designer.userSubjectId, param);
						var rowMap=null;
                        if(isCount){
							 rowMap = getSubjectNameRow(sheet, param);
						}else{
							 rowMap = getSubjectNameRowForDetails(sheet, param);
						}

						let cnt = 0;
                        for (var arrayData of data) {
							//console.log('refreshAccountAgeData:'+cnt++);
                            refreshAccountAgeData(sheet, arrayData, accountAgeRageCnt, excelArr, param, rowMap,isCount);
                        }
						designer.Spread.resumeCalcService();
						designer.Spread.resumePaint();
						getCustomizeStyle(true);
                        //bdoSuccessBox('成功', '设置成功！');
                    }else{
                        bdoErrorBox('失败', '设置失败');
                    }
                }
            });
        });
        //设置审定账龄
        $('#modal_setall_adjustAge').click(function() {
            var flag = checkAccountAgeColumn(4);
			var isCount=false;
			if (!flag) {
				return;
			}
			var name=designer.Spread.getActiveSheet().name();
			if( name== '封面'){
				bdoErrorBox('设置账龄失败', '不能在‘封面’工作表设置账龄数据！');
				return;
			}
			if(name.endWith('(按客户合并)')){
				isCount=true;
			}
            //获取数据
            var data = {};
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.getAccountAgeDataList.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: designer.userSubjectId,
                    param4: '',
                    param5: 2,
					param6:isCount,
                    start: -1,
                    limit: -1
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        data = data.data;
                        if (data.length == 0) {
                            bdoInfoBox('提示', '没有账龄数据可以设置！请点击计算账龄');
                            return;
                        }
                        var accountAgeRage = $('#accoutAge_range').attr('data-result');
                        var accountAgeRages = accountAgeRage.split(',');
                        var accountAgeRageCnt = accountAgeRages.length + 2;
                        var excelArr = getAccountAgeName($('#accoutAge_range').val().split(','));
						var param = {
							accountAgeItemRowIndex: parseInt($('#accountAge_itemRow_index').val()),
							accoutAgeNameP: $('#accoutAge_nameP').val(),
							accountAgeItemColumnIndex: $('#accountAge_itemColumn_index').val(),
							accountAgeAdjustColumnIndex: $('#accountAge_adjustColumn_index').val(),
							titleIndex:parseInt($('#accountAge_title_index').val()),
							ageType:'1'
						};
						var sheet = designer.Spread.getActiveSheet();
						designer.Spread.suspendPaint();
						designer.Spread.suspendCalcService();
                        //清除头部
                        reSetHeadBody(sheet, param, designer.userSubjectId);
                        refreshAccountAgeHead(sheet, excelArr, designer.userSubjectId, param);
						var rowMap = null;
						if(isCount){
							rowMap = getSubjectNameRow(sheet, param);
						}else{
							rowMap = getSubjectNameRowForDetails(sheet, param);
						}
						let cnt = 0;
                        for (var arrayData of data) {
                        	//console.log('refreshAccountAgeData:'+cnt++);
                            refreshAccountAgeData(sheet, arrayData, accountAgeRageCnt, excelArr, param, rowMap,isCount);
                        }
						designer.Spread.resumeCalcService();
						designer.Spread.resumePaint();
						getCustomizeStyle(true);
                        //bdoSuccessBox('成功', '设置成功！');
                    }else{
                        bdoErrorBox('失败', '设置失败');
                    }
                }
            });
        });
        //保存账龄结果
        $('#modal_save_age').click(function() {
        	$('#accoutAgeSaveDiv').modal('show');
        	var name=designer.Spread.getActiveSheet().name();
        	if(name.endWith('(按客户合并)')){
        		if(designer.userSubjectName == '应收账款'){
            		$('#accoutAge_save_nameP').val('B');
            		$('#accountAge_save_itemColumn_index').val('N');
            		$('#accountAge_save_adjustColumn_index').val('AJ');
            		$('#accountAge_save_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '长期应付款'){
            		$('#accoutAge_save_nameP').val('B');
            		$('#accountAge_save_itemColumn_index').val('I');
            		$('#accountAge_save_adjustColumn_index').val('AA');
            		$('#accountAge_save_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '预收账款'){
            		$('#accoutAge_save_nameP').val('B');
            		$('#accountAge_save_itemColumn_index').val('P');
            		$('#accountAge_save_adjustColumn_index').val('AJ');
            		$('#accountAge_save_itemRow_index').val(7);
        		}else{
            		$('#accoutAge_save_nameP').val('B');
            		$('#accountAge_save_itemColumn_index').val('M');
            		$('#accountAge_save_adjustColumn_index').val('AG');
            		$('#accountAge_save_itemRow_index').val(5);
        		}
        	}else{
        		if(designer.userSubjectName == '应收账款'){
            		$('#accoutAge_save_nameP').val('D');
            		$('#accountAge_save_itemColumn_index').val('P');
            		$('#accountAge_save_adjustColumn_index').val('AL');
            		$('#accountAge_save_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '长期应付款'){
            		$('#accoutAge_save_nameP').val('D');
            		$('#accountAge_save_itemColumn_index').val('K');
            		$('#accountAge_save_adjustColumn_index').val('AC');
            		$('#accountAge_save_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '预收账款'){
            		$('#accoutAge_save_nameP').val('D');
            		$('#accountAge_save_itemColumn_index').val('R');
            		$('#accountAge_save_adjustColumn_index').val('AL');
            		$('#accountAge_save_itemRow_index').val(7);
        		}else{
            		$('#accoutAge_save_nameP').val('D');
            		$('#accountAge_save_itemColumn_index').val('O');
            		$('#accountAge_save_adjustColumn_index').val('AI');
            		$('#accountAge_save_itemRow_index').val(5);
        		}
        	}
        	$('#accoutAge_save_range').val($('#accoutAge_range').val());
            $('#accoutAge_save_range').attr('data-content', $('#accoutAge_range').attr('data-content'));
            $('#accoutAge_save_range').attr('data-result', $('#accoutAge_range').attr('data-result'));
        });
        //设置单项审定账龄
        $('#btn_save_age').click(function () {
            var flag = checkAccountAgeSaveColumn();
			var isCount='0';
            if (!flag) {
                return;
            }
			var name=designer.Spread.getActiveSheet().name();
			if( name== '封面'){
				bdoErrorBox('设置账龄失败', '不能在‘封面’工作表保存账龄数据！');
				return;
			}
			if(name.endWith('(按客户合并)')){
				isCount='1';
			}
            //获取数据
            var saveData = [];
            var startRow = parseInt($('#accountAge_save_itemRow_index').val());
            var endRow = parseInt($('#accountAge_save_endRow_index').val());
            var sheet = designer.Spread.getActiveSheet();
            var araIdRange = getRange(sheet, $('#accoutAge_save_nameP').val() + startRow);
            var unauditRange = getRange(sheet, $('#accountAge_save_itemColumn_index').val() + startRow);
            var adjustRange = getRange(sheet, $('#accountAge_save_adjustColumn_index').val() + startRow);
            for(var i = startRow;i <= endRow;i++){
                var tempData = {};
                tempData.customerId = customerId;
                tempData.projectId = projectId;
                tempData.araId = sheet.getValue(i - 1, araIdRange.col);
                tempData.araName = sheet.getValue(i - 1, araIdRange.col + 1);
                if(isCount == '1'){
                	tempData.subjectName = designer.userSubjectName;
                	tempData.subjectId = designer.userSubjectId;
                	tempData.isMerge = '1';
                }else{
                	tempData.subjectName = sheet.getValue(i - 1, araIdRange.col - 1);
                	tempData.subjectId = sheet.getValue(i - 1, araIdRange.col - 2);
                	tempData.isMerge = '0';
                }
                tempData.reason = sheet.getValue(i - 1, unauditRange.col);
                tempData.status = '0';
            	if(tempData.reason != null && tempData.reason != ''){
            		tempData.status = '1';
            	}
            	tempData.ara01 = sheet.getValue(i - 1, unauditRange.col + 1);
            	tempData.ara02 = sheet.getValue(i - 1, unauditRange.col + 2);
            	tempData.ara03 = sheet.getValue(i - 1, unauditRange.col + 3);
            	tempData.ara04 = sheet.getValue(i - 1, unauditRange.col + 4);
            	tempData.ara05 = sheet.getValue(i - 1, unauditRange.col + 5);
            	tempData.ara06 = sheet.getValue(i - 1, unauditRange.col + 6);
            	tempData.ara07 = sheet.getValue(i - 1, adjustRange.col);
            	tempData.ara08 = sheet.getValue(i - 1, adjustRange.col + 1);
            	tempData.ara09 = sheet.getValue(i - 1, adjustRange.col + 2);
            	tempData.ara10 = sheet.getValue(i - 1, adjustRange.col + 3);
            	tempData.ara11 = sheet.getValue(i - 1, adjustRange.col + 4);
            	tempData.ara12 = sheet.getValue(i - 1, adjustRange.col + 5);

                saveData.push(tempData);
            }
            bdoInProcessingBox('保存账龄中');
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.saveAccountAgeData.json',
                data: {
                    menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    param1: customerId,
                    param2: projectId,
                    param3: designer.userSubjectId,
                    param4: $("#accoutAge_save_range").attr('data-result'),
                    param5: $("#accoutAge_save_range").attr('data-content'),
                    param6: isCount,
                    jsonData: JSON.stringify(saveData)
                },
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        bdoSuccessBox('成功', data.resultInfo.statusText);
                        $('#accoutAgeSaveDiv').modal('hide');
                    }else{
                        bdoErrorBox('失败', data.resultInfo.statusText);
                    }
                }
            });
        });
        //获取账龄数据
        $('#accountAgeBtn').click(e => {
           $('#adjustDataDiv').css('display', 'none');
           if ($('[name=\'accoutAge_type\']:checked').attr('data-result') == '1') {
               $('#accountAgeName').hide();
               $('#modal_set_age').hide();
               $('#modal_setall_age').show();
               $('#modal_set_adjustAge').hide();
               $('#modal_setall_adjustAge').show();
           } else {
               $('#accountAgeName').show();
               $('#modal_set_age').show();
               $('#modal_setall_age').hide();
               $('#modal_set_adjustAge').show();
               $('#modal_setall_adjustAge').hide();
           }
           $('#accoutAgeDataDiv').modal('show');
           var name=designer.Spread.getActiveSheet().name();
	       	if(name.endWith('(按客户合并)')){
        		if(designer.userSubjectName == '应收账款'){
        	       	$('#accountAge_title_index').val(4);
            		$('#accoutAge_nameP').val('B');
            		$('#accountAge_itemColumn_index').val('N');
            		$('#accountAge_adjustColumn_index').val('AJ');
            		$('#accountAge_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '长期应付款'){
        	       	$('#accountAge_title_index').val(5);
            		$('#accoutAge_nameP').val('B');
            		$('#accountAge_itemColumn_index').val('I');
            		$('#accountAge_adjustColumn_index').val('AA');
            		$('#accountAge_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '预收账款'){
        	       	$('#accountAge_title_index').val(5);
            		$('#accoutAge_nameP').val('B');
            		$('#accountAge_itemColumn_index').val('P');
            		$('#accountAge_adjustColumn_index').val('AJ');
            		$('#accountAge_itemRow_index').val(7);
        		}else{
        	       	$('#accountAge_title_index').val(4);
            		$('#accoutAge_nameP').val('B');
            		$('#accountAge_itemColumn_index').val('M');
            		$('#accountAge_adjustColumn_index').val('AG');
            		$('#accountAge_itemRow_index').val(5);
        		}
        	}else{
        		if(designer.userSubjectName == '应收账款'){
        	       	$('#accountAge_title_index').val(4);
            		$('#accoutAge_nameP').val('D');
            		$('#accountAge_itemColumn_index').val('P');
            		$('#accountAge_adjustColumn_index').val('AL');
            		$('#accountAge_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '长期应付款'){
        	       	$('#accountAge_title_index').val(5);
            		$('#accoutAge_nameP').val('D');
            		$('#accountAge_itemColumn_index').val('K');
            		$('#accountAge_adjustColumn_index').val('AC');
            		$('#accountAge_itemRow_index').val(6);
        		}else if(designer.userSubjectName == '预收账款'){
        	       	$('#accountAge_title_index').val(4);
            		$('#accoutAge_nameP').val('D');
            		$('#accountAge_itemColumn_index').val('R');
            		$('#accountAge_adjustColumn_index').val('AL');
            		$('#accountAge_itemRow_index').val(7);
        		}else{
        	       	$('#accountAge_title_index').val(4);
            		$('#accoutAge_nameP').val('D');
            		$('#accountAge_itemColumn_index').val('O');
            		$('#accountAge_adjustColumn_index').val('AI');
            		$('#accountAge_itemRow_index').val(5);
        		}
        	}
            $.ajax({
                type: 'post',
                url: 'dgCenter/DgAccountAgeData.getAccountAgeDataInfo.json',
                data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
                    menuId: window.sys_menuId,
                    param1: customerId,
                    param2: projectId,
                    start: -1,
                    limit: -1
                },
                dataType: 'json',
                async:false,
                success(data) {
                    if (data.success) {
                        data = data.data;
                        for (var arrayData of data) {
                        	/*if(arrayData.accountAge==null || arrayData.accountAge==""){
								arrayData.accountAge="12 : 1年,24 : 2年,36 : 3年,48 : 4年,60 : 5年;12,24,36,48,60";
							}
                            let arrayStr = arrayData.accountAge.split(';');
                            $('#accoutAge_range').val(arrayStr[0]);
                            $('#accoutAge_range').attr('data-content', arrayStr[0]);
                            $('#accoutAge_range').attr('data-result', arrayStr[1]);*/
                        	$('#accoutAge_range').val('12 : 1年,24 : 2年,36 : 3年,48 : 4年,60 : 5年');
                            $('#accoutAge_range').attr('data-content', '12 : 1年,24 : 2年,36 : 3年,48 : 4年,60 : 5年');
                            $('#accoutAge_range').attr('data-result', '12,24,36,48,60');
                        	if(arrayData.accountAge != null && arrayData.accountAge != ''){
                        		var accountAgeJson = JSON.parse(arrayData.accountAge);
                        		if(accountAgeJson[designer.userSubjectId] != null){
                                	let arrayStr = accountAgeJson[designer.userSubjectId].split(';');
                                    $('#accoutAge_range').val(arrayStr[0]);
                                    $('#accoutAge_range').attr('data-content', arrayStr[0]);
                                    $('#accoutAge_range').attr('data-result', arrayStr[1]);
                                }else if(accountAgeJson['all'] != null){
                                	let arrayStr = accountAgeJson['all'].split(';');
                                    $('#accoutAge_range').val(arrayStr[0]);
                                    $('#accoutAge_range').attr('data-content', arrayStr[0]);
                                    $('#accoutAge_range').attr('data-result', arrayStr[1]);
                                }
                        	}
                        }
                    }
                }
            });
        });
		//关闭账龄数据页面
        $('#modal_accountAge_cancel').click(function() {
            $('#accoutAgeDataDiv').modal('hide');
        });
        // 获取账龄的汉字
        function getAccountAgeName(accountAgeArr){
        	var result = [];
            var accountArr = accountAgeArr[0].split(":");
            result.push(accountArr[1]+"以内");
			var tmp = accountArr[1];
            for (var i = 1; i < accountAgeArr.length; i++) {
				accountArr = accountAgeArr[i].split(":");
				result.push(tmp.replace('年','') + " -" + accountArr[1]);
				tmp = accountArr[1];
            }
            result.push(tmp+"以上");
            return result;
		}
        /** 加载数据 */
        function loadData(param) {
            accountAgePrepare.tableParam.columnDefs = accountAgePrepare.tableParam.columnDefs.splice(0,5);
            var accountAgeRage = $('#accoutAge_range').attr('data-result');
            var dataVal = $('#accoutAge_range').val();
            var dataArr = getAccountAgeName(dataVal.split(','));
            let k = 6;
            for (var i = 0;i < dataArr.length; i++) {
                accountAgePrepare.tableParam.columnDefs.push({
                    targets: k,
                    className: 'text-right',
                    title: '未审' + dataArr[i],
                    name: 'ara0' + (i+1),
                    data: 'ara0' + (i+1),
                    width: '100px',
                    render: function (data, type, row, meta) {
                        return formatMoney(data);
                    }
                });
                k++;
            }
            accountAgePrepare.tableParam.columnDefs.push({
                targets: k++,
                className: 'text-right',
                title: '未审账龄合计',
                name: 'unauditTotal',
                data: 'unauditTotal',
                width: '100px',
                render: function (data, type, row, meta) {
                    return formatMoney(data);
                }
            });
            for (var i = 0;i < dataArr.length; i++) {
                accountAgePrepare.tableParam.columnDefs.push({
                    targets: k++,
                    className: 'text-right',
                    title: '审定' + dataArr[i],
                    name: (i+7) > 9 ? 'ara' + (i+7) : 'ara0' + (i+7),
                    data: (i+7) > 9 ? 'ara' + (i+7) : 'ara0' + (i+7),
                    width: '100px',
                    render: function (data, type, row, meta) {
                        return formatMoney(data);
                    }
                });
            }
            accountAgePrepare.tableParam.columnDefs.push({
                targets: k++,
                className: 'text-right',
                title: '审定账龄合计',
                name: 'adjustTotal',
                data: 'adjustTotal',
                width: '100px',
                render: function (data, type, row, meta) {
                    return formatMoney(data);
                }
            });
			var name=designer.Spread.getActiveSheet().name();
            var accountTab = $.extend(true, {}, accountAgePrepare);
            accountTab.localParam.url = 'dgCenter/DgGeneral.query.json';
			if(name.endWith('(按客户合并)')){
				accountTab.localParam.urlparam.param5 = 1;
			}else{
				accountTab.localParam.urlparam.param5 = 0;
			}
			accountTab.localParam.urlparam.sqlId = 'DG00273';
            accountTab.localParam.urlparam.param1 = customerId;
            accountTab.localParam.urlparam.param2 = projectId;
            accountTab.localParam.urlparam.param3 = designer.userSubjectId;
            accountTab.localParam.urlparam.param4 = param;
            BdoDataTable('tagsAccountAgeMainTable', accountTab);
            /** 导出账龄数据 */
            $('#btn_accountAgeData_export').off('click');
        	$('#btn_accountAgeData_export').on('click', function(){
        		exportExcelFin(this, '账龄结果一览', accountTab, 'tagsAccountAgeMainTable');
        	});
        }
		/*function loadDataSum(param) {
			accountAgePrepare.tableParam.columnDefs = accountAgePrepare.tableParam.columnDefs.splice(0,4);
			var accountAgeRage = $('#accoutAge_range').attr('data-result');
			var dataVal = $('#accoutAge_range').val();
			var dataArr = getAccountAgeName(dataVal.split(','));
			let k = 5;
			for (var i = 0;i < dataArr.length; i++) {
				accountAgePrepare.tableParam.columnDefs.push({
					targets: k,
					className: 'text-right',
					title: dataArr[i],
					name: 'ara0' + (i+1),
					data: 'ara0' + (i+1),
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				});
				k++;
			}

			var accountTab = $.extend(true, {}, accountAgePrepare);
			accountTab.localParam.url = 'dgCenter/DgGeneral.query.json';
			accountTab.localParam.urlparam.sqlId = 'DG00294';
			accountTab.localParam.urlparam.param1 = customerId;
			accountTab.localParam.urlparam.param2 = projectId;
			accountTab.localParam.urlparam.param3 = designer.userSubjectId;
			accountTab.localParam.urlparam.param4 = param;
			BdoDataTable('tagsAccountAgeMainSumTable', accountTab);
		}*/
        var count = 0;
        var accountAgePrepare = {
            localParam: {
                tabNum : false,
                url : '',
                urlparam: {
                    menuId: window.sys_menuId,
                    start:-1,
                    limit:-1
                }
            } ,
            tableParam: {
                select: true,
                scrollX: true,
    			scrollY: '360px',
    			dom : '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i>>',
                serverSide:true,
                lengthChange:false,
                ordering:false,
                fixedThead : true,
                scrollCollapse: true,
    			// fixedHeight : '500px',
    			// autoWidth: false,
                createdRow(row, data, dataIndex)
                {
                    if (data.colType == '1') {
                        $(row).addClass('edit-able');
                        for (let i = 3; i < 14; i++) {
                            $(row).find('td').eq(i).addClass('bg-success-light');
                        }
                    }
                },
                columnDefs: [
                    {
                        targets: 1,
                        orderable: false,
                        className: 'text-center width-seq',
                        title: '序号',
                        width: '30px',
                        visible: true,
                        render: function (data, type, row, meta) {
                            return meta.settings._iDisplayStart + meta.row + 1;
                        }
                    },
					{
						targets: 2,
						orderable: false,
						className: 'text-left',
						title: '债务人编号',
						name: 'araId',
						data: 'araId',
						width: '80px'
					},
					{
                        targets: 3,
                        orderable: false,
                        className: 'text-left',
                        title: '债务人名称',
                        name: 'araName',
                        data: 'araName',
                        width: '100px'
                    }, {
                        targets: 4,
                        orderable: false,
                        className: 'text-left',
                        title: '数据插入状态',
                        name: 'status',
                        data: 'status',
                        width: '50px',
                        renderer: 'getDicLabelByVal|数据插入状态',
                        render(data) {
                            return DicVal2Nm(data, '数据插入状态');
                        }
                    }, {
                        targets: 5,
                        orderable: false,
                        className: 'text-left',
                        title: '原因',
                        width: '80px',
                        name: 'reason',
                        data: 'reason'
                    }
                ]
            }
        };
		// 设置或刷新财务账套数据
		function getAccountData(param5, param6){
			transition(() => {
				var json = spread.toJSON();
				if (!currentNode) {
					return;
				}
				excelIo.save(json, blob => {
					bdoInProcessingBox('加载中...');
					var param = {};
					param.fileName = fileName;
					param.workpaperId = workpaperId;
					param.customerId = customerId;
					param.projectId = projectId;
					param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();

					param = getDgParam(param);
					if(typeof(param) == "undefined"){
						bdoErrorBox('保存失败', "请再保存一次！");
						return;
					}
					var formData = new FormData();
					$.each(param, (key, val) => {
						formData.append(key, val);
					});
					formData.append('file', blob);
					$.ajax({
						url: 'dgCenter/DgWapper.uploadFile.json',
						type: 'POST',
						data: formData,
						contentType: false,
						processData: false,
						success(data) {
							if (data.success) {
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgWapper.getAccountData.json',
									data: {
										menuId: window.sys_menuId,
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: customerId,
										param2: projectId,
										param3: workpaperId,
										param4: designer.userSubjectId,
										param5: param5,
										param6: param6,
										start: -1,
										limit: -1
									},
									dataType: 'json',
									success(data) {
										if (data.success) {
											storage.removeItem(storageId);
											storage.removeItem(storageStatus);
											storage.removeItem(storageTime);
											getExcelData({
												menuId: window.sys_menuId,
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: workpaperId,
												param2: customerId
											});
											$('#accountDataParamModal').modal('hide');
										}else{
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				}, e => {
					bdoErrorBox('失败', e.errorMessage);
				});
			});
		}
		// 导入账龄弹窗
		$('#modal_import_last_year_age').on('click', function () {
			voucherAuthImportInit();
		});
		/** 下载模板按钮 */
		$('#account_age_downtemp').click(function (e) {
			downloadFile('dgCenter/DgWapper.downloadAccountAgeModal.json', {lockCustomerId:CUR_CUSTOMERID,lockProjectId:CUR_PROJECTID,lockYyyy:CUR_PROJECT_ACC_YEAR,param1:designer.userSubjectId});
		});
		function voucherAuthImportInit() {
			var accountAgeRage = $('#accoutAge_range').attr('data-result');
			if ($('#accoutAge_range').val().length == 0){
				bdoErrorBox('失败', '请选择账龄');
				return;
			}else{
				var cnt = (accountAgeRage.split(',')).length-1;
				if (cnt >4) {
					bdoErrorBox('失败', '最多只能选择5个区间');
					return;
				}
			}
			$('#modal_account_age_import').modal('show');
			var pluginOpt = {
				dropZoneEnabled: false,
				dropZoneTitle: '',
				dropZoneClickTitle: '',
				acceptedFiles: '.xlsx',
				allowedFileExtensions: ['xlsx'],
				browseLabel: '选择文件',
				showCaption: true,
				showRemove: false,
				showUpload: false,
				showBrowse: true,
				showPreview: false,
				showCancel: false,
				showClose: false,
				required: true,
				initialPreviewShowDelete: true,
				language: 'zh',
				browseOnZoneClick: true,
				uploadAsync: false,
				hideThumbnailContent: true,
				layoutTemplates: {
					actionUpload: '',
					actionZoom: ''
				},
				fileActionSettings: {
					removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
				},
				uploadUrl: 'dgCenter/DgWapper.importAccountAge.json',
				uploadExtraData: function () {
					return {
						lockCustomerId: '',
						lockYyyy: '',
						param1: ''
					};
				}
			};
			pluginOpt.uploadExtraData = function () {
				return {
					lockCustomerId: CUR_CUSTOMERID,
					lockProjectId: CUR_PROJECTID,
					lockYyyy: CUR_PROJECT_ACC_YEAR,
					param1: designer.userSubjectId,
					param5: designer.userSubjectId,
					param6: accountAgeRage,
					param9: $('#accoutAge_range').attr('data-content')
				};
			};
			var $el = $('#account_age_fileinput').fileinput(pluginOpt);
			$el.on('filebatchuploadsuccess', function (event, data) {
				if (!data.response.success) {
					bdoErrorBox('系统提示', data.response.resultInfo.statusText);
				} else {
					bdoSuccessBox('上传成功');
				}
				$('#modal_account_age_import').modal('hide');
				$('#account_age_fileinput').fileinput('clear');
				$('#account_age_fileinput').fileinput('enable');
			});
			$el.on('filebatchuploaderror', function (event, data, msg) {
				bdoErrorBox('系统提示', msg);
				$('#modal_account_age_import').modal('hide');
				$('#account_age_fileinput').fileinput('clear');
				$('#account_age_fileinput').fileinput('enable');
			});
			//建议文件上传成功之后再提交其他表单数据
			function uploadFile() {
				$el.fileinput('upload');
			}
			/** 导入按钮 */
			$('#account_age_submit').click(function () {
				var fileUrl = $('#account_age_fileinput').val();
				if (fileUrl == null || fileUrl == '') {
					bdoInfoBox('提示', '请选择导入文件');
					return;
				}
				var tip = '确认导入吗？';
				bdoConfirmBox('确认', tip, function () {
					bdoInProcessingBox('计算账龄中');
					uploadFile();
				});
			});
		}

		$('#otherDgConfirmBtn').click((event) => {
			
			var otherDgName = $('#otherDgName').val();
			
			if (!otherDgName) {
				bdoInfoBox('提示', '请选择需要生成的底稿。');
			}
			
			
			var redirectArr = redirectList.filter((item, i) => {
				return item.redirectName == otherDgName
			});
			
			if (redirectArr.length == 0) {
				bdoInfoBox('提示', '无动态底稿需要生成。');
				return
			}
			
			// 得到需要获取数据的列索引
			if (!redirectArr[0].dgColIndex1 
					&& !redirectArr[0].dgColIndex1Param1 
					&& !redirectArr[0].dgColIndex2 
					&& !redirectArr[0].dgColIndex3) {
				bdoErrorBox('失败', '未获取配置数据列！');
				return
			}
			
			// 获取数据
			var sheet = designer.Spread.getActiveSheet();
						
			var dataIndex  = redirectArr[0].dgColIndex1.split(",");
			var dataParam = redirectArr[0].dgColIndex1Param1.split(',');
			
			var dataArr = [];
			var rowCount = sheet.getRowCount();
			var colCount = sheet.getColumnCount();
			for (var i = 0; i < rowCount; i++) {
				var genAble = {};
				// 如果校验类为空，则属于不需要勾或者冻结质押判断
				if (!redirectArr[0].checColkIndex) {
					var checkName = sheet.getValue(i + redirectArr[0].paramColIndex3,redirectArr[0].paramColIndex2 - 1);
					if (!checkName || checkName == '合计') {
						break;
					}
					for (var j = 0; j < dataIndex.length; j++) {
						genAble[dataParam[j]] = sheet.getValue(i + redirectArr[0].paramColIndex3,dataIndex[j]);
					}
					dataArr.push(genAble);
				} else {
					var checkName = sheet.getValue(i,redirectArr[0].checColkIndex - 1);
					// 当dg校验列为勾， 或者 为冻结与质押的其中一种
					if (checkName == '√' || checkName == '冻结' || checkName == '质押') {
						for (var j = 0; j < dataIndex.length; j++) {
							genAble[dataParam[j]] = sheet.getValue(i,dataIndex[j]);
						}
						dataArr.push(genAble);
					}
				}
			}

			$('#showGenDgList').empty();
			// 页面modal显示可生成的底稿
			$.each(dataArr, function(j, item) {
				if (dataArr[j].val1) {
					let check = '<label style="color: green;">√</label><br/>';
					if (dataArr[j].val1.length > 5) {
						check = '<label style="color: red;">×</label><br/>';
					}
					let div = '<input type="checkbox" style="margin-right: 15px;" name="chioceBox" value="' + dataArr[j].val1 + '"/>'
							+ '<label>' + j + '、</label><label>' + dataArr[j].val1 + '</label>'
							+ check;
					$('#showGenDgList').append(div);
				}
			});
			$('#showGenDgModal').modal('show');
		});
		
		$('#controlCheckbox').click((event) => {
			$("input[name='chioceBox']").each(function () {
				this.checked = true;
			});
		});
		/** 仅显示有发生额余额 */
		$('#show_hasAmount').click(function() {
			var screenItem = $('#screenItem').val();
			var otherDgName = $('#otherDgNameText').val();
			var hasAmount = 0;
			if ($('#show_hasAmount').prop('checked')) {
				hasAmount = 1;
			}
			refreshOtherDgChioce (redirectList, otherDgName, screenItem, hasAmount);
		});
		$('#screenItem').blur(function(){
			var screenItem = $(this).val();
			var otherDgName = $('#otherDgNameText').val();
			var hasAmount = 0;
			if ($('#show_hasAmount').prop('checked')) {
				hasAmount = 1;
			}
			refreshOtherDgChioce (redirectList, otherDgName, screenItem, hasAmount);
		});
		$('#otherDgBatchGenBtn').click((event) => {
			
			// 注意，配置表中第一个数据字段一定要配置成 唯一的数据字段，用来作为sheet名字， 用来进行校验
			
			var otherDgName = $('#otherDgNameText').val();
			var redirectArr = redirectList.filter((item, i) => {
				return item.redirectName == otherDgName
			});
			
			if (redirectArr.length == 0) {
				bdoInfoBox('提示', '无动态底稿需要生成。');
				return
			}
			
			var item = redirectArr[0];
			// 得到需要获取数据的列索引
			if (!item.dgColIndex1 
					&& !item.dgColIndex1Param1 
					&& !item.dgColIndex2 
					&& !item.dgColIndex3) {
				bdoErrorBox('失败', '未获取配置数据列！');
				return
			}
			
			// 获取数据
			var sheet = designer.Spread.getActiveSheet();
						
			var dataIndex  = redirectArr[0].dgColIndex1.split(",");
			var dataParam = redirectArr[0].dgColIndex1Param1.split(',');
			
			let names = [];
			$.each($('input[name="chioceBox"]:checkbox'),function(){
				if(this.checked){
					names.push($(this).val());
				}
			});
			
			
			if (names.length == 0) {
				bdoInfoBox('提示', '请选择需要生成的数据。');
				return
			} else {
				for(let j = 0; j < names.length; j++) {
					// excel sheet名称的最大长度为30
					if (names[j].length > 30) {
						bdoInfoBox('提示', '勾选数据文字信息过长，内容为：'+ names[j] +'。<br/>请检查后重新勾选！');
						return
					}
				}
			}
			
			
			var activeColIndex = item.colIndex - 1;
			var activeSheetIndex = item.sheetIndex;
			var activeRowIndex = [];
			var rangeStrArr = [];
			var sheetNameArr = [];
			var dataArr = [];
			var rowCount = sheet.getRowCount();
			var colCount = sheet.getColumnCount();
			var rowDataStateArr = [];
			var rangeStrSrcArr = [];
			// 遍历页面底稿excel行
			var startActiveRow = 0;
			var checkFlag = item.paramColIndex2 && item.paramColIndex3;
			if (checkFlag) {
                startActiveRow = item.paramColIndex3
			}
			for (var i = startActiveRow; i < rowCount; i++) {
				// 遍历行对应的单元格
				for (var j = 0;j < colCount; j++) {
					// 获取当前单元格
					var activeCell = sheet.getValue(i,j);
					// 遍历勾选的数据数组
					for (var o = 0;o < names.length; o++) {
						// 如果当前单元格的数据 和 勾选的数组数据一致
						if (activeCell == names[o]) {
							var genAble = {};
							var rangeStrSrcObj = {};
							// 获取当前行的数据（其中dataIndex 为数据库配置的固定列索引），用对象储存
							for (var j = 0; j < dataIndex.length; j++) {
								var range = new GC.Spread.Sheets.Range(i, dataIndex[j], 1, 1);
								var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
								// rangeStrSrcArr = i + "," + rangeStr;
								rangeStrSrcObj[dataParam[j]] = rangeStr;
								if (sheet.getValue(i,dataIndex[j]) != null) {
									genAble[dataParam[j]] = sheet.getValue(i,dataIndex[j]);
									// rangeStrSrcArr.push(rangeStr);
								} else {
									genAble[dataParam[j]] = "";
								}
								
							}
							
							// 获取当前列的名称 例如 D列 （其中，activeColIndex 为数据库配置列）
							var range = new GC.Spread.Sheets.Range(i, activeColIndex, 1, 1);
							var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
							rangeStrArr.push(rangeStr);
							
							// 保存 正常/冻结/质押 状态，留做数据回传使用
							rowDataStateArr.push(sheet.getValue(i,activeColIndex));
							
							// 把excel中的唯一字段用来当作sheet名
							sheetNameArr.push(sheet.getValue(i,dataIndex[0]));

							// 获取匹配的数据行数
							var o = i;
							activeRowIndex.push(o++);
							
							// 将当前数据放入数组中
							dataArr.push(genAble);
							
							rangeStrSrcArr.push(rangeStrSrcObj);
						
						}
					}
				}
			}
			
			var cellDataIndex = item.dgColIndex3;
			
			// 数据库配置字段，用于新增或更新 一个底稿下多个sheet，每个sheet增加行
			var getUpdateSheetIndex = item.dgColIndex4;
			
			
			var displayText = "是否根据'" + item.name + "'中的数据生成'" + item.redirectName + "'？";
			bdoConfirmBox('提示', displayText, isConfirm => {
				bdoInProcessingBox('生成中');
				$.ajax({
					url: 'dgCenter/DgPaper.batchGenOtherDg.json',
					// async: false,
					type: 'post',
					dataType: 'json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: item.redirectId,
						param4: workpaperId,
						param5: activeSheetIndex,
						param6: JSON.stringify(activeRowIndex),
						param7: activeColIndex,
						param8: JSON.stringify(rangeStrArr),
						param9: JSON.stringify(dataArr),
						param10: JSON.stringify(sheetNameArr),
						param11: activeRowIndex,
						param12: getUpdateSheetIndex,
						param13: item.redirectName,
						param14: cellDataIndex,
						param15: JSON.stringify(rowDataStateArr),
						param16: JSON.stringify(rangeStrSrcArr)
					},
					success(data) {
						if(data.success){
							var list = [];
							var list2 = [];
							var otherAutoId = "";
							for (var i = 0;i < data.data.length; i++) {
								if (data.data[i].type == 1) {
									list.push(data.data[i]);
								} else {
									otherAutoId = data.data[i].otherAutoId;
									list2.push(data.data[i]);
								}
							}
							if (list.length > 0) {
								generateSinglyLink(list);
								// console.log(list)
							}
							if (list2.length > 0) {
								generateFetchDgValue(otherAutoId,list2)
							}
							$('#otherDgModal').modal('hide');
							$('#showGenDgModal').modal('hide');
							// openOtherDg(data.data[0].workpaperId);
							(function(){
								$.ajax({
									type : 'post',
									url: 'dgCenter/DgGeneral.query.json',
									// async : false,
									data : {
										menuId: window.sys_menuId,
										sqlId: 'DG00067',
										param1: customerId,
										param2: projectId,
										start: -1,
										limit: -1
									},
									dataType : 'json',
									success(data) {
										if(data.success) {
											designer.paperArr = data.data;
										}
									}
								});
							})();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		$('#accountDataParamBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				//async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00361',
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data.length > 0 && $('#startRow_detail').val() == ''){
							bdoInfoBox('提示', '请输入明细项开始行');
							return;
						}
						if(data.data.length > 1 && $('#startRow_sum').val() == ''){
							bdoInfoBox('提示', '请输入小计项开始行');
							return;
						}
						getAccountData($('#startRow_detail').val(), $('#startRow_sum').val());
					}
				}
			});
		});
		$('#sampling_sortNoP').val('B');
		$('#sampling_vchDateP').val('C');
		$('#sampling_oldVoucherIdP').val('D');
		$('#sampling_summaryP').val('E');
		$('#sampling_oppositeAccountLastP').val('F');
		$('#sampling_debitValueP').val('G');
		$('#sampling_crebitValueP').val('H');
		$('#sampling_contentCompleteP').val('I');
		$('#sampling_authorizeP').val('J');
		$('#sampling_handleCorrectP').val('K');
		$('#sampling_contentMatchP').val('L');
		$('#sampling_amountMatchP').val('M');
		$('#sampling_cutoffCorrectP').val('N');
		$('#sampling_customizeResult1P').val('O');
		$('#sampling_customizeResult2P').val('P');
		$('#sampling_customizeResult3P').val('Q');
		$('#sampling_customizeResult4P').val('R');
		$('#sampling_fileIndexIdP').val('S');
		$('#sampling_contentP').val('T');
		$('#sampling_remarkP').val('U');
		$('#sampling_auditResultP').val('V');
		$('#sampling_sampleNameP').val('W');
		$('#sampling_relateSampleNameP').val('X');
		$('#sampling_itemRow_index').val(6);
		if(_data.extraOptions.userSubjectName == '固定资产'){
			$('#sampling_fileIndexIdP').val('U');
			$('#sampling_contentP').val('V');
			$('#sampling_remarkP').val('W');
			$('#sampling_auditResultP').val('X');
			$('#sampling_sampleNameP').val('Y');
			$('#sampling_relateSampleNameP').val('Z');
		}
        //获取抽凭数据
        $('#samplingBtn').click(e => {
           $('#adjustDataDiv').css('display', 'none');
           $('#samplingDataDiv').modal('show');
           $('#sampling_sampleMethod').html(ComboLocalDicOption(true, '抽样方式'));
           // $('#bank_dg').html(ComboLocalDicOption(true, '生成底稿'));
           dgSamplingInfo_view.localParam.urlparam.param11 = $('#sampling_subjectid').val();
           dgSamplingInfo_view.localParam.urlparam.param5 = $('#sampling_sampleMethod').val();
           dgSamplingInfo_view.localParam.urlparam.param16 = $('#sampling_sampleName').val();
           if($('#sampling_sampleMethod').val() == ''){
               dgSamplingInfo_view.localParam.urlparam.param15 = '7';
           }else{
        	   dgSamplingInfo_view.localParam.urlparam.param15 = '';
           }
           if($('#sampling_sampleMethod').val() == '7'){
        	   dgSamplingInfo_view.localParam.urlparam.param2 = '';
        	   dgSamplingInfo_view.localParam.urlparam.param14 = '';
           }else{
        	   dgSamplingInfo_view.localParam.urlparam.param2 = window.CUR_PROJECT_ACC_YEAR;
        	   dgSamplingInfo_view.localParam.urlparam.param14 = window.CUR_PROJECT_ACC_YEAR;
           }
           BdoDataTable('sampling_table', dgSamplingInfo_view);
        });
        //查询抽凭数据
        $('#btn_sampling_search').click(function() {
        	dgSamplingInfo_view.localParam.urlparam.param11 = $('#sampling_subjectid').val();
            dgSamplingInfo_view.localParam.urlparam.param5 = $('#sampling_sampleMethod').val();
            dgSamplingInfo_view.localParam.urlparam.param16 = $('#sampling_sampleName').val();
            if($('#sampling_sampleMethod').val() == ''){
                dgSamplingInfo_view.localParam.urlparam.param15 = '7';
            }else{
         	   dgSamplingInfo_view.localParam.urlparam.param15 = '';
            }
            if($('#sampling_sampleMethod').val() == '7'){
         	   dgSamplingInfo_view.localParam.urlparam.param2 = '';
         	   dgSamplingInfo_view.localParam.urlparam.param14 = '';
            }else{
         	   dgSamplingInfo_view.localParam.urlparam.param2 = window.CUR_PROJECT_ACC_YEAR;
         	   dgSamplingInfo_view.localParam.urlparam.param14 = window.CUR_PROJECT_ACC_YEAR;
            }
            BdoDataTable('sampling_table', dgSamplingInfo_view);
        });
        //关闭抽凭数据页面
        $('#modal_sampling_cancel').click(function() {
            $('#samplingDataDiv').modal('hide');
        });
    	//选择科目
    	$('#sampling_subjectid').focus(function() {
    		$('#modal_subjectid_sampling').modal('show');
    		if ($('#subject_tree_sampling').hasClass('treeview')) {
    			return;
    		}
    		$('#subject_tree_sampling').tree({
    			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
    			params: {
    				lockProjectId: projectId,
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
    				searchInputId: 'searchInputSampling'
    			},
    			singleSelect: true,
    			lazyLoad: false,
    			onceLoad: true,
    			view: {
    				leafIcon: 'fa fa-building text-flat',
    				nodeIcon: 'fa fa-bank text-primary-light',
    				folderSelectable: false,
    				multiSelect: false,
    				showCheckbox: true,
    				selectedColor: '',
    				selectedBackColor: ''

    			}
    		});
    	});
    	$('#modal_subjectid_sure').click(function() {
    		var selectValue = $('#subject_tree_sampling').tree('getTreeMultiValue');
    		if (typeof(selectValue) === 'object') {
    			$('#sampling_subjectid').val('');
    		} else {
    			$('#sampling_subjectid').val(selectValue);

    		}
    		$('#modal_subjectid_sampling').modal('hide');
    	});
    	$('#modal_subjectid_reset').click(function() {
    		$('#subject_tree_sampling').tree('reset');
    	});
    	// 获取抽凭数据
		$('#modal_sampling_save').click(e => {
			bdoConfirmBox('提示', '是否确定重新获取抽凭数据？', function() {
				if(designer.Spread.getActiveSheet().name() == '封面'){
					bdoErrorBox('获取失败', '不能在‘封面’工作表获取抽凭数据！');
					return;
				}
				if(!checkSamplingColumn()){
					return;
				}
				transition(() => {
					var json = spread.toJSON();
					if (!currentNode) {
						return;
					}
					excelIo.save(json, blob => {
						bdoInProcessingBox('加载中...');
						var param = {};
						param.fileName = fileName;
						param.workpaperId = workpaperId;
						param.customerId = customerId;
						param.projectId = projectId;
						param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();

						param = getDgParam(param);
						if(typeof(param) == "undefined"){
							bdoErrorBox('保存失败', "请再保存一次！");
							return;
						}
						var formData = new FormData();
						$.each(param, (key, val) => {
							formData.append(key, val);
						});
						formData.append('file', blob);
						$.ajax({
							url: 'dgCenter/DgWapper.uploadFile.json',
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false,
							success(data) {
								if (data.success) {
									if($('#sampling_sampleMethod').val() == '7'){
										var object = [{
											vchDate : $('#sampling_vchDateP').val(),
											oldVoucherId : $('#sampling_oldVoucherIdP').val(),
											oppositeAccountLast : $('#sampling_oppositeAccountLastP').val(),
											debitValue : $('#sampling_debitValueP').val(),
											crebitValue : $('#sampling_crebitValueP').val(),
											cutoffCorrect : $('#sampling_cutoffCorrectP').val(),
											fileIndexId : $('#sampling_fileIndexIdP').val(),
											content : $('#sampling_contentP').val(),
											remark : $('#sampling_remarkP').val(),
											auditResultName : $('#sampling_auditResultP').val(),
											sampleName : $('#sampling_sampleNameP').val(),
											relateSampleName : $('#sampling_relateSampleNameP').val(),
											summary : $('#sampling_summaryP').val(),
											sortNo : $('#sampling_sortNoP').val()
										}];
										
										var jsonData = JSON.stringify(object);
									}else{
										var object = [{
											vchDate : $('#sampling_vchDateP').val(),
											oldVoucherId : $('#sampling_oldVoucherIdP').val(),
											oppositeAccountLast : $('#sampling_oppositeAccountLastP').val(),
											debitValue : $('#sampling_debitValueP').val(),
											crebitValue : $('#sampling_crebitValueP').val(),
											contentComplete : $('#sampling_contentCompleteP').val(),
											authorize : $('#sampling_authorizeP').val(),
											handleCorrect : $('#sampling_handleCorrectP').val(),
											contentMatch : $('#sampling_contentMatchP').val(),
											amountMatch : $('#sampling_amountMatchP').val(),
											customizeResult1 : $('#sampling_customizeResult1P').val(),
											customizeResult2 : $('#sampling_customizeResult2P').val(),
											customizeResult3 : $('#sampling_customizeResult3P').val(),
											customizeResult4 : $('#sampling_customizeResult4P').val(),
											fileIndexId : $('#sampling_fileIndexIdP').val(),
											content : $('#sampling_contentP').val(),
											remark : $('#sampling_remarkP').val(),
											auditResultName : $('#sampling_auditResultP').val(),
											sampleName : $('#sampling_sampleNameP').val(),
											relateSampleName : $('#sampling_relateSampleNameP').val(),
											summary : $('#sampling_summaryP').val(),
											sortNo : $('#sampling_sortNoP').val()
										}];
										
										var jsonData = JSON.stringify(object);
									}
									var yyyy = window.CUR_PROJECT_ACC_YEAR;
									if($('#sampling_sampleMethod').val() == '7'){
										yyyy = '';
									}
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgWapper.getSamplingData.json',
										data: {
											menuId: window.sys_menuId,
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											lockCustomerId: customerId,
											param1: projectId,
											param2: yyyy,
											param5: $('#sampling_sampleMethod').val(),
											param11: $('#sampling_subjectid').val(),
											param14: yyyy,
											param16: $('#sampling_sampleName').val(),
											param17: '1',
											param22: designer.Spread.getActiveSheetIndex() + 1,
											param23: $('#sampling_itemRow_index').val(),
											param24: jsonData,
											param25: workpaperId,
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
												getExcelData({
													menuId: window.sys_menuId,
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: workpaperId,
													param2: customerId
												});
												$('#samplingDataDiv').modal('hide');
											}else{
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				});
			});
		});
		// 检查列数据是否填写正确
		function checkSamplingColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#sampling_vchDateP').parent().parent().css({'border': '0px'});
			$('#sampling_oldVoucherIdP').parent().parent().css({'border': '0px'});
			//$('#sampling_subjectnameP').parent().parent().css({'border': '0px'});
			$('#sampling_debitValueP').parent().parent().css({'border': '0px'});
			$('#sampling_crebitValueP').parent().parent().css({'border': '0px'});
			$('#sampling_contentCompleteP').parent().parent().css({'border': '0px'});
			$('#sampling_authorizeP').parent().parent().css({'border': '0px'});
			$('#sampling_handleCorrectP').parent().parent().css({'border': '0px'});
			$('#sampling_contentMatchP').parent().parent().css({'border': '0px'});
			$('#sampling_amountMatchP').parent().parent().css({'border': '0px'});
			$('#sampling_customizeResult1P').parent().parent().css({'border': '0px'});
			$('#sampling_customizeResult2P').parent().parent().css({'border': '0px'});
			$('#sampling_customizeResult3P').parent().parent().css({'border': '0px'});
			$('#sampling_customizeResult4P').parent().parent().css({'border': '0px'});
			$('#sampling_fileIndexIdP').parent().parent().css({'border': '0px'});
			$('#sampling_remarkP').parent().parent().css({'border': '0px'});
			$('#sampling_auditResultP').parent().parent().css({'border': '0px'});
			$('#sampling_sampleNameP').parent().parent().css({'border': '0px'});
			$('#sampling_relateSampleNameP').parent().parent().css({'border': '0px'});
			$('#sampling_oppositeAccountLastP').parent().parent().css({'border': '0px'});
			$('#sampling_itemRow_index').parent().parent().css({'border': '0px'});
			$('#sampling_summaryP').parent().parent().css({'border': '0px'});
			$('#sampling_sortNoP').parent().parent().css({'border': '0px'});
			$('#sampling_contentP').parent().parent().css({'border': '0px'});
			$('#sampling_cutoffCorrectP').parent().parent().css({'border': '0px'});
			var flag = true;
			var pattern = /^[A-Z]{1,2}$/;
			var itemNameP = $('#sampling_vchDateP').val();
			var errorText = '';
			if (itemNameP == '' || !pattern.test(itemNameP)) {
				$('#sampling_vchDateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '日期列';
			}
			var itemRow = $('#sampling_itemRow_index').val();
			var pattern1 = /^[0-9]{1,}$/;
			if (itemRow == '' || !pattern1.test(itemRow)) {
				$('#sampling_itemRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '项目开始行';
			}
			if ($('#sampling_sortNoP').val() == '' || !pattern.test($('#sampling_sortNoP').val())) {
				$('#sampling_sortNoP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '编号列';
			}
			if ($('#sampling_oldVoucherIdP').val() == '' || !pattern.test($('#sampling_oldVoucherIdP').val())) {
				$('#sampling_oldVoucherIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '凭证编号列';
			}
			if ($('#sampling_summaryP').val() == '' || !pattern.test($('#sampling_summaryP').val())) {
				$('#sampling_summaryP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '摘要列';
			}
			/*if ($('#sampling_subjectnameP').val() == '' || !pattern.test($('#sampling_subjectnameP').val())) {
				$('#sampling_subjectnameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '科目名称列';
			}*/
			if ($('#sampling_oppositeAccountLastP').val() == '' || !pattern.test($('#sampling_oppositeAccountLastP').val())) {
				$('#sampling_oppositeAccountLastP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '对方科目列';
			}
			if ($('#sampling_debitValueP').val() == '' || !pattern.test($('#sampling_debitValueP').val())) {
				$('#sampling_debitValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '借方金额列';
			}
			if ($('#sampling_crebitValueP').val() == '' || !pattern.test($('#sampling_crebitValueP').val())) {
				$('#sampling_crebitValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '贷方金额列';
			}
			if($('#sampling_sampleMethod').val() != '7'){
				if ($('#sampling_contentCompleteP').val() == '' || !pattern.test($('#sampling_contentCompleteP').val())) {
					$('#sampling_contentCompleteP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '原始凭证内容完整列';
				}
				if ($('#sampling_authorizeP').val() == '' || !pattern.test($('#sampling_authorizeP').val())) {
					$('#sampling_authorizeP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '有授权批准列';
				}
				if ($('#sampling_handleCorrectP').val() == '' || !pattern.test($('#sampling_handleCorrectP').val())) {
					$('#sampling_handleCorrectP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '账务处理正确列';
				}
				if ($('#sampling_contentMatchP').val() == '' || !pattern.test($('#sampling_contentMatchP').val())) {
					$('#sampling_contentMatchP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '账证的内容相符列';
				}
				if ($('#sampling_amountMatchP').val() == '' || !pattern.test($('#sampling_amountMatchP').val())) {
					$('#sampling_amountMatchP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '账证的金额相符列';
				}
				if ($('#sampling_customizeResult1P').val() == '' || !pattern.test($('#sampling_customizeResult1P').val())) {
					$('#sampling_customizeResult1P').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '核对内容7列';
				}
				if ($('#sampling_customizeResult2P').val() == '' || !pattern.test($('#sampling_customizeResult2P').val())) {
					$('#sampling_customizeResult2P').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '核对内容8列';
				}
				if ($('#sampling_customizeResult3P').val() == '' || !pattern.test($('#sampling_customizeResult3P').val())) {
					$('#sampling_customizeResult3P').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '核对内容9列';
				}
				if ($('#sampling_customizeResult4P').val() == '' || !pattern.test($('#sampling_customizeResult4P').val())) {
					$('#sampling_customizeResult4P').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '核对内容10列';
				}
			}else{
				if ($('#sampling_cutoffCorrectP').val() == '' || !pattern.test($('#sampling_cutoffCorrectP').val())) {
					$('#sampling_cutoffCorrectP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '截止测试正确列';
				}
			}
			if ($('#sampling_auditResultP').val() == '' || !pattern.test($('#sampling_auditResultP').val())) {
				$('#sampling_auditResultP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '审计结论列';
			}
			if ($('#sampling_sampleNameP').val() == '' || !pattern.test($('#sampling_sampleNameP').val())) {
				$('#sampling_sampleNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '抽凭名称列';
			}
			if ($('#sampling_relateSampleNameP').val() == '' || !pattern.test($('#sampling_relateSampleNameP').val())) {
				$('#sampling_relateSampleNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '关联抽凭名称列';
			}
			if ($('#sampling_fileIndexIdP').val() == '' || !pattern.test($('#sampling_fileIndexIdP').val())) {
				$('#sampling_fileIndexIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '附件索引列';
			}
			if ($('#sampling_remarkP').val() == '' || !pattern.test($('#sampling_remarkP').val())) {
				$('#sampling_remarkP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '备注列';
			}
			if ($('#sampling_contentP').val() == '' || !pattern.test($('#sampling_contentP').val())) {
				$('#sampling_contentP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '附件内容列';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
		// 科目项列、期初数列、调整数列、期末数列--设置列号
		$('#samplingDataDiv').on('click', 'button[name="modal_sampling_location"]', function() {
			var sheet = designer.Spread.getActiveSheet();
			var range = new GC.Spread.Sheets.Range(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			$(this).parent().children('input').val(rangeStr.replace(/[0-9]/ig, ''));
		});
		// 
		$('#sampling_sampleMethod').on('change', function() {
			if(this.value == '7'){
				$('#sampling_fileIndexIdP').val('S');
				$('#sampling_remarkP').val('U');
				$('#sampling_auditResultP').val('V');
				$('#sampling_sampleNameP').val('W');
				$('#sampling_relateSampleNameP').val('X');
				$('#sampling_contentP').val('T');
			}else{
				$('#sampling_fileIndexIdP').val('S');
				$('#sampling_remarkP').val('U');
				$('#sampling_auditResultP').val('V');
				$('#sampling_sampleNameP').val('W');
				$('#sampling_relateSampleNameP').val('X');
				$('#sampling_contentP').val('T');
			}

		});
		$('#substitute_sortNoP').val('B');
		$('#substitute_vchDateP').val('C');
		$('#substitute_oldVoucherIdP').val('D');
		$('#substitute_summaryP').val('E');
		$('#substitute_oppositeAccountLastP').val('F');
		$('#substitute_occurValueP').val('G');
		$('#substitute_itemRow_index').val(22);
		$('#substitute_sortNoNextP').val('B');
		$('#substitute_vchDateNextP').val('C');
		$('#substitute_oldVoucherIdNextP').val('D');
		$('#substitute_summaryNextP').val('E');
		$('#substitute_oppositeAccountLastNextP').val('F');
		$('#substitute_occurValueNextP').val('G');
		$('#substitute_itemRow_indexNext').val(32);
		$('#substitute_assItemNameP').val('C2');
		$('#substitute_remainP').val('C9');
		$('#substitute_debitTotalP').val('C10');
		$('#substitute_creditTotalP').val('C11');
		$('#substitute_debitTotalCutOffP').val('C14');
		$('#substitute_creditTotalCutOffP').val('C15');
		$('#substitute_endDateP').val('C5');
		//核算科目
		$('#substitute_assitemid').focus(function() {
			$('#modal_assitemid_substitute').modal('show');
			if ($('#substitute_assitem_tree').hasClass('treeview')) {
				return;
			}
			$('#substitute_assitem_tree').tree2({
				url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: customerId,
					lockProjectId: projectId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param11: dgSubstitute_view.localParam.urlparam.param1,
					searchInputId: 'searchInputSubstitute'
				},
				singleSelect: false,
				//lazyLoad: false,
				//onceLoad: true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: true,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}
			});
		});
		$('#modal_assitemid_substitute_sure').click(function() {
			if (typeof($('#substitute_assitem_tree').tree2('getTreeMultiValue')) == 'object' || $('#substitute_assitem_tree').tree2('getTreeMultiValue') == "undefined") {
				$('#substitute_assitemid').val('');
			} else {
				$('#substitute_assitemid').val($('#substitute_assitem_tree').tree2('getTreeMultiValue'));
			}
			$('#modal_assitemid_substitute').modal('hide');
		});
		$('#modal_assitemid_substitute_reset').click(function() {
			$('#substitute_assitem_tree').tree2('reset');
			$('#searchInputSubstitute').keyup();
		});
		//获取替代测试数据
        $('#substituteTestBtn').click(e => {
           $('#adjustDataDiv').css('display', 'none');
           $('#substituteDataDiv').modal('show');
           //$('#substitute_method').html(ComboLocalDicOption(false, '替代测试辅助核算选择方式'));
           //$('#substitute_direction').html(ComboLocalDicOption(false, '替代测试方向'));
           //$('#substitute_type').html(ComboLocalDicOption(false, '替代测试类型'));
           $('#substitute_balance').val('');
           $('#substitute_amount').val('');
           $('#substitute_rate').val('');
           $('#substitute_rank_1').val('');
           $('#substitute_rank_2').val('');
           $('#substitute_assitemid').val('');
           /*document.getElementById("substitute_amount_div").style.display='block';
           document.getElementById("substitute_rate_div").style.display='none';
           document.getElementById("substitute_rank_div").style.display='none';
           document.getElementById("substitute_assitemid_div").style.display='none';*/
           $.ajax({
				url: 'finCenter/SubjectEntry.querySubstituteData.json',
				type: 'post',
				data: {
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId,
					param1: designer.userSubjectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success && data.data.length > 0) {
						$('#substitute_subjectid').val(data.data[0].subjectId + '-' + data.data[0].subjectName);
						//$('#substitute_balance').val(getMn(data.data[0].balance));
						$('#substitute_direction').val(data.data[0].direction);
						dgSubstitute_view.localParam.urlparam.param1 = data.data[0].subjectId;
						dgSubstitute_view.localParam.urlparam.param4 = data.data[0].direction;
						dgSubstitute_view.localParam.urlparam.param5 = data.data[0].balance;
						dgSubstitute_view.localParam.urlparam.param6 = data.data[0].endDate;
						dgSubstitute_view.localParam.urlparam.param7 = data.data[0].subjectId;
						dgSubstitute_view.localParam.urlparam.param8 = data.data[0].subMonth;
						//$('#btn_substitute_search').click();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
        });
        $('#substitute_method').change(function() {
        	if($('#substitute_method').val() == '1'){
        		document.getElementById("substitute_amount_div").style.display='block';
        		document.getElementById("substitute_rate_div").style.display='none';
        		document.getElementById("substitute_rank_div").style.display='none';
        		document.getElementById("substitute_assitemid_div").style.display='none';
        	}else if($('#substitute_method').val() == '2'){
        		document.getElementById("substitute_amount_div").style.display='none';
        		document.getElementById("substitute_rate_div").style.display='block';
        		document.getElementById("substitute_rank_div").style.display='none';
        		document.getElementById("substitute_assitemid_div").style.display='none';
        	}else if($('#substitute_method').val() == '3'){
        		document.getElementById("substitute_amount_div").style.display='none';
        		document.getElementById("substitute_rate_div").style.display='none';
        		document.getElementById("substitute_rank_div").style.display='block';
        		document.getElementById("substitute_assitemid_div").style.display='none';
        	}else if($('#substitute_method').val() == '4'){
        		document.getElementById("substitute_amount_div").style.display='none';
        		document.getElementById("substitute_rate_div").style.display='none';
        		document.getElementById("substitute_rank_div").style.display='none';
        		document.getElementById("substitute_assitemid_div").style.display='block';
        	}
        	
        });
        //对输入金额进行校验
    	$('#substitute_balance,#substitute_amount,#substitute_rate').blur(function() {
    		clearNoNum($(this));
    	});
    	//对输入金额进行校验
    	$('#substitute_rank_1,#substitute_rank_2').blur(function() {
    		clearNoNumInt($(this));
    	});
    	//对输入金额进行校验
    	function clearNoNum(obj){
    		obj.val(obj.val().replace(/[^\d.]/g,""));//清除"数字"和"."以外的字符
    		obj.val(obj.val().replace(/^\./g,""));//验证第一个字符是数字而不是字符
    		obj.val(obj.val().replace(/\.{2,}/g,"."));//只保留第一个.清除多余的
    		obj.val(obj.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
    		obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));//只能输入两个小数
    	}
    	//对输入金额进行校验
    	function clearNoNumInt(obj){
    		obj.val(obj.val().replace(/[^\d]/g,""));//清除"数字"和"."以外的字符
    	}
        //查询替代测试数据
        $('#btn_substitute_search').click(function() {
        	var substitute_balance = $('#substitute_balance').val();
			var substitute_amount = $('#substitute_amount').val();
			var substitute_rate = $('#substitute_rate').val();
			var substitute_rank_1 = $('#substitute_rank_1').val();
			var substitute_rank_2 = $('#substitute_rank_2').val();
			var substitute_assitemid = $('#substitute_assitemid').val();
			if(substitute_rate != '' && substitute_rate != null && (substitute_balance == '' || substitute_balance == null)){
				bdoInfoBox('提示', '请输入期末余额');
    			return;
			}
			if((substitute_amount == '' || substitute_amount == null) && 
				(substitute_rate == '' || substitute_rate == null) &&
				(substitute_rank_1 == '' || substitute_rank_1 == null) &&
				(substitute_rank_2 == '' || substitute_rank_2 == null) &&
				(substitute_assitemid == '' || substitute_assitemid == null)){
				bdoInfoBox('提示', '请选择辅助核算或者其他筛选方式');
    			return;
			}
			var endDate2 = '';
			var endDate3 = '';
			if($('#substitute_type').val() == '1'){
				endDate2 = dgSubstitute_view.localParam.urlparam.param6;
        	}else{
        		endDate3 = dgSubstitute_view.localParam.urlparam.param6;
        	}
			if ($('#substitute_table').hasClass('dataTable')) {
				$('#substitute_table').DataTable().clear();
				$('#substitute_table').DataTable().destroy();
				$('#substitute_table').empty();
			}
           //bdoInProcessingBox('加载中...');
           dgSubstituteCount_view.localParam.urlparam.param1 = dgSubstitute_view.localParam.urlparam.param1;
           dgSubstituteCount_view.localParam.urlparam.param2 =endDate2;
           dgSubstituteCount_view.localParam.urlparam.param3 = endDate3;
           dgSubstituteCount_view.localParam.urlparam.param4 = dgSubstitute_view.localParam.urlparam.param4;
           dgSubstituteCount_view.localParam.urlparam.param5 = dgSubstitute_view.localParam.urlparam.param5;
           dgSubstituteCount_view.localParam.urlparam.param6 = dgSubstitute_view.localParam.urlparam.param6;
           dgSubstituteCount_view.localParam.urlparam.param9 = workpaperId;
           dgSubstituteCount_view.localParam.urlparam.param11 = substitute_assitemid;
           dgSubstituteCount_view.localParam.urlparam.param12 = dgSubstitute_view.localParam.urlparam.param8;
           dgSubstituteCount_view.localParam.urlparam.param15 = $('#substitute_method').val();
           dgSubstituteCount_view.localParam.urlparam.param16 = $('#substitute_assItemNameP').val();
           dgSubstituteCount_view.localParam.urlparam.param17 = getNum(substitute_balance);
           dgSubstituteCount_view.localParam.urlparam.param18 = getNum(substitute_amount);
           dgSubstituteCount_view.localParam.urlparam.param19 = substitute_rate;
           dgSubstituteCount_view.localParam.urlparam.param20 = substitute_rank_1;
           dgSubstituteCount_view.localParam.urlparam.param21 = substitute_rank_2;
           BdoDataTable('substitute_table', dgSubstituteCount_view);
           $('#substituteTableDiv').modal('show');
           
           /*$.ajax({
				url: 'dgCenter/DgWapper.getSubstituteAssitemData.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId,
					param1: dgSubstitute_view.localParam.urlparam.param1,
					param2: endDate2,
					param3: endDate3,
					param4: dgSubstitute_view.localParam.urlparam.param4,
					param5: dgSubstitute_view.localParam.urlparam.param5,
					param6: dgSubstitute_view.localParam.urlparam.param6,
					param9: workpaperId,
					param11: substitute_assitemid,
					param12: dgSubstitute_view.localParam.urlparam.param8,
					param15: $('#substitute_method').val(),
					param16: $('#substitute_assItemNameP').val(),
					param17: getNum(substitute_balance),
					param18: getNum(substitute_amount),
					param19: substitute_rate,
					param20: substitute_rank_1,
					param21: substitute_rank_2,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('加载完成', data.resultInfo.statusText);
						dgSubstitute_view.localParam.data = data.data;
						BdoDataTable('substitute_table', dgSubstitute_view);
						$('#substituteTableDiv').modal('show');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});*/
        });
        //关闭替代测试数据页面
        $('#modal_substitute_cancel').click(function() {
            $('#substituteDataDiv').modal('hide');
        });
        //关闭替代测试数据页面
        $('#modal_substituteTable_cancel').click(function() {
            $('#substituteTableDiv').modal('hide');
        });
        // 获取替代测试数据
		$('#modal_substitute_save').click(e => {
			//var substitute_select = '';
			var substitute_balance = $('#substitute_balance').val();
			var substitute_amount = $('#substitute_amount').val();
			var substitute_rate = $('#substitute_rate').val();
			var substitute_rank_1 = $('#substitute_rank_1').val();
			var substitute_rank_2 = $('#substitute_rank_2').val();
			var substitute_assitemid = $('#substitute_assitemid').val();
			if(substitute_rate != '' && substitute_rate != null && (substitute_balance == '' || substitute_balance == null)){
				bdoInfoBox('提示', '请输入期末余额');
    			return;
			}
			if((substitute_amount == '' || substitute_amount == null) && 
				(substitute_rate == '' || substitute_rate == null) &&
				(substitute_rank_1 == '' || substitute_rank_1 == null) &&
				(substitute_rank_2 == '' || substitute_rank_2 == null) &&
				(substitute_assitemid == '' || substitute_assitemid == null)){
				bdoInfoBox('提示', '请选择辅助核算或者其他筛选方式');
    			return;
			}
			/*if($('#substitute_method').val() == '1'){
        		if($('#substitute_amount').val() == '' || $('#substitute_amount').val() == null){
            		bdoInfoBox('提示', '请输入期末余额');
        			return;
            	}
        		substitute_select = $('#substitute_amount').val();
        	}else if($('#substitute_method').val() == '2'){
        		if($('#substitute_rate').val() == '' || $('#substitute_rate').val() == null){
            		bdoInfoBox('提示', '请输入期末余额占比');
        			return;
            	}
        		substitute_select = $('#substitute_rate').val();
        	}else if($('#substitute_method').val() == '3'){
        		if($('#substitute_rank').val() == '' || $('#substitute_rank').val() == null){
            		bdoInfoBox('提示', '请输入期末余额排名');
        			return;
            	}
        		substitute_select = $('#substitute_rank').val();
        	}else if($('#substitute_method').val() == '4'){
        		if($('#substitute_assitemid').val() == '' || $('#substitute_assitemid').val() == null){
            		bdoInfoBox('提示', '请选择辅助核算');
        			return;
            	}
        		substitute_select = $('#substitute_assitemid').val();
        	}*/
			if($('#substitute_table').DataTable().data() != null && $('#substitute_table').DataTable().data().length > 0){
				
			}else{
				bdoInfoBox('提示', '没有查询到核算客户');
    			return;
			}
			var objectTable = [];
			var lenTable = $('#substitute_table').DataTable().data().length;
			for(var i=0;i<lenTable;i++){
				objectTable.push($('#substitute_table').DataTable().data()[i]);
			}
			var jsonData3 = JSON.stringify(objectTable);
			bdoConfirmBox('提示', '是否确定重新获取替代测试数据？', function() {
				if(designer.Spread.getActiveSheet().name() == '封面'){
					bdoErrorBox('获取失败', '不能在‘封面’工作表获取替代测试数据！');
					return;
				}
				if(!checkSubstituteColumn()){
					return;
				}
				transition(() => {
					var json = spread.toJSON();
					if (!currentNode) {
						return;
					}
					excelIo.save(json, blob => {
						bdoInProcessingBox('加载中...');
						var param = {};
						param.fileName = fileName;
						param.workpaperId = workpaperId;
						param.customerId = customerId;
						param.projectId = projectId;
						param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();

						param = getDgParam(param);
						if(typeof(param) == "undefined"){
							bdoErrorBox('保存失败', "请再保存一次！");
							return;
						}
						var formData = new FormData();
						$.each(param, (key, val) => {
							formData.append(key, val);
						});
						formData.append('file', blob);
						$.ajax({
							url: 'dgCenter/DgWapper.uploadFile.json',
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false,
							success(data) {
								if (data.success) {
									var object = [{
										vchDate : $('#substitute_vchDateP').val(),
										oldVoucherId : $('#substitute_oldVoucherIdP').val(),
										oppositeAccountLast : $('#substitute_oppositeAccountLastP').val(),
										occurValue : $('#substitute_occurValueP').val(),
										//confirmValue : $('#substitute_confirmValueP').val(),
										summary : $('#substitute_summaryP').val(),
										sortNo : $('#substitute_sortNoP').val()
									}];
									var jsonData = JSON.stringify(object);
									var object1 = [{
										vchDateNext : $('#substitute_vchDateNextP').val(),
										oldVoucherIdNext : $('#substitute_oldVoucherIdNextP').val(),
										oppositeAccountLastNext : $('#substitute_oppositeAccountLastNextP').val(),
										occurValueNext : $('#substitute_occurValueNextP').val(),
										summaryNext : $('#substitute_summaryNextP').val(),
										sortNoNext : $('#substitute_sortNoNextP').val()
									}];
									
									var jsonData1 = JSON.stringify(object1);
									var object2;
									if(dgSubstitute_view.localParam.urlparam.param4 == '-1'){
										object2 = [{
											assItemName : $('#substitute_assItemNameP').val(),
											remain : $('#substitute_remainP').val(),
											debitTotalOcc : $('#substitute_creditTotalP').val(),
											creditTotalOcc : $('#substitute_debitTotalP').val(),
											debitTotalOccCutOff : $('#substitute_creditTotalCutOffP').val(),
											creditTotalOccCutOff : $('#substitute_debitTotalCutOffP').val(),
											endDate : $('#substitute_endDateP').val()
										}];
									}else{
										object2 = [{
											assItemName : $('#substitute_assItemNameP').val(),
											remain : $('#substitute_remainP').val(),
											debitTotalOcc : $('#substitute_debitTotalP').val(),
											creditTotalOcc : $('#substitute_creditTotalP').val(),
											debitTotalOccCutOff : $('#substitute_debitTotalCutOffP').val(),
											creditTotalOccCutOff : $('#substitute_creditTotalCutOffP').val(),
											endDate : $('#substitute_endDateP').val()
										}];
									}
									
									var jsonData2 = JSON.stringify(object2);
									var endDate2 = '';
									var endDate3 = '';
									if($('#substitute_type').val() == '1'){
										endDate2 = dgSubstitute_view.localParam.urlparam.param6;
						        	}else{
						        		endDate3 = dgSubstitute_view.localParam.urlparam.param6;
						        	}
									bdoInProcessingBox('加载中...');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgWapper.getSubstituteData.json',
										data: {
											menuId: window.sys_menuId,
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											lockCustomerId: customerId,
											lockYyyy: window.CUR_PROJECT_ACC_YEAR,
											lockProjectId : projectId,
											param1: dgSubstitute_view.localParam.urlparam.param1,
											param2: endDate2,
											param3: endDate3,
											param4: dgSubstitute_view.localParam.urlparam.param4,
											param5: dgSubstitute_view.localParam.urlparam.param5,
											param6: dgSubstitute_view.localParam.urlparam.param6,
											param7: $('#substitute_itemRow_index').val(),
											param8: jsonData,
											param9: workpaperId,
											param10: $('#substitute_itemRow_indexNext').val(),
											param11: substitute_assitemid,
											param12: dgSubstitute_view.localParam.urlparam.param8,
											param13: jsonData1,
											param14: jsonData2,
											param15: $('#substitute_method').val(),
											param16: $('#substitute_assItemNameP').val(),
											param17: getNum(substitute_balance),
											param18: getNum(substitute_amount),
											param19: substitute_rate,
											param20: substitute_rank_1,
											param21: substitute_rank_2,
											param22: jsonData3,
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
												getExcelData({
													menuId: window.sys_menuId,
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: workpaperId,
													param2: customerId
												});
												$('#substituteDataDiv').modal('hide');
												$('#substituteTableDiv').modal('hide');
											}else{
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
									for(let i = 0;i < objectTable.length;i++){
										setTimeout(function(){ $('#showProcessing').html('正在生成' + objectTable[i].assItemName + '(' + (i+1) + '/' + objectTable.length + ')'); }, i*2500);
									}
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				});
				
			});
		});
		// 检查列数据是否填写正确
		function checkSubstituteColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#substitute_vchDateP').parent().parent().css({'border': '0px'});
			$('#substitute_oldVoucherIdP').parent().parent().css({'border': '0px'});
			$('#substitute_occurValueP').parent().parent().css({'border': '0px'});
			//$('#substitute_occurValueP').parent().parent().css({'border': '0px'});
			//$('#sampling_subjectnameP').parent().parent().css({'border': '0px'});
			//$('#sampling_debitValueP').parent().parent().css({'border': '0px'});
			//$('#sampling_crebitValueP').parent().parent().css({'border': '0px'});
			$('#substitute_oppositeAccountLastP').parent().parent().css({'border': '0px'});
			$('#substitute_itemRow_index').parent().parent().css({'border': '0px'});
			$('#substitute_summaryP').parent().parent().css({'border': '0px'});
			$('#substitute_sortNoP').parent().parent().css({'border': '0px'});
			$('#substitute_vchDateNextP').parent().parent().css({'border': '0px'});
			$('#substitute_oldVoucherIdNextP').parent().parent().css({'border': '0px'});
			$('#substitute_occurValueNextP').parent().parent().css({'border': '0px'});
			$('#substitute_oppositeAccountLastNextP').parent().parent().css({'border': '0px'});
			$('#substitute_itemRow_indexNext').parent().parent().css({'border': '0px'});
			$('#substitute_summaryNextP').parent().parent().css({'border': '0px'});
			$('#substitute_sortNoNextP').parent().parent().css({'border': '0px'});
			$('#substitute_assItemNameP').parent().parent().css({'border': '0px'});
			$('#substitute_remainP').parent().parent().css({'border': '0px'});
			$('#substitute_debitTotalP').parent().parent().css({'border': '0px'});
			$('#substitute_creditTotalP').parent().parent().css({'border': '0px'});
			$('#substitute_debitTotalCutOffP').parent().parent().css({'border': '0px'});
			$('#substitute_creditTotalCutOffP').parent().parent().css({'border': '0px'});
			$('#substitute_endDateP').parent().parent().css({'border': '0px'});
			var flag = true;
			var pattern = /^[A-Z]{1,2}$/;
			var itemNameP = $('#substitute_vchDateP').val();
			var errorText = '';
			if (itemNameP == '' || !pattern.test(itemNameP)) {
				$('#substitute_vchDateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '日期列';
			}
			var itemRow = $('#substitute_itemRow_index').val();
			var pattern1 = /^[0-9]{1,}$/;
			if (itemRow == '' || !pattern1.test(itemRow)) {
				$('#substitute_itemRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '项目开始行';
			}
			if ($('#substitute_sortNoP').val() == '' || !pattern.test($('#substitute_sortNoP').val())) {
				$('#substitute_sortNoP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '编号列';
			}
			if ($('#substitute_oldVoucherIdP').val() == '' || !pattern.test($('#substitute_oldVoucherIdP').val())) {
				$('#substitute_oldVoucherIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '凭证编号列';
			}
			if ($('#substitute_summaryP').val() == '' || !pattern.test($('#substitute_summaryP').val())) {
				$('#substitute_summaryP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '摘要列';
			}
			if ($('#substitute_occurValueP').val() == '' || !pattern.test($('#substitute_occurValueP').val())) {
				$('#substitute_occurValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '发生额列';
			}
			/*if ($('#substitute_confirmValueP').val() == '' || !pattern.test($('#substitute_confirmValueP').val())) {
				$('#substitute_confirmValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '可以确认的金额列';
			}*/
			/*if ($('#sampling_subjectnameP').val() == '' || !pattern.test($('#sampling_subjectnameP').val())) {
				$('#sampling_subjectnameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '科目名称列';
			}*/
			if ($('#substitute_oppositeAccountLastP').val() == '' || !pattern.test($('#substitute_oppositeAccountLastP').val())) {
				$('#substitute_oppositeAccountLastP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '对方科目列';
			}
			/*if ($('#sampling_debitValueP').val() == '' || !pattern.test($('#sampling_debitValueP').val())) {
				$('#sampling_debitValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '借方金额列';
			}
			if ($('#sampling_crebitValueP').val() == '' || !pattern.test($('#sampling_crebitValueP').val())) {
				$('#sampling_crebitValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '贷方金额列';
			}*/
			var itemNameNextP = $('#substitute_vchDateNextP').val();
			if (itemNameNextP == '' || !pattern.test(itemNameNextP)) {
				$('#substitute_vchDateNextP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后日期列';
			}
			var itemRowNext = $('#substitute_itemRow_indexNext').val();
			if (itemRowNext == '' || !pattern1.test(itemRowNext)) {
				$('#substitute_itemRow_indexNext').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后项目开始行';
			}
			if ($('#substitute_sortNoNextP').val() == '' || !pattern.test($('#substitute_sortNoNextP').val())) {
				$('#substitute_sortNoNextP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后编号列';
			}
			if ($('#substitute_oldVoucherIdNextP').val() == '' || !pattern.test($('#substitute_oldVoucherIdNextP').val())) {
				$('#substitute_oldVoucherIdNextP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后凭证编号列';
			}
			if ($('#substitute_summaryNextP').val() == '' || !pattern.test($('#substitute_summaryNextP').val())) {
				$('#substitute_summaryNextP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后摘要列';
			}
			if ($('#substitute_occurValueNextP').val() == '' || !pattern.test($('#substitute_occurValueNextP').val())) {
				$('#substitute_occurValueNextP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后发生额列';
			}
			if ($('#substitute_oppositeAccountLastPNext').val() == '' || !pattern.test($('#substitute_oppositeAccountLastNextP').val())) {
				$('#substitute_oppositeAccountLastPNext').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期后对方科目列';
			}
			var pattern2 = /^[A-Z]+\d+$/;
			if ($('#substitute_assItemNameP').val() == '' || !pattern2.test($('#substitute_assItemNameP').val())) {
				$('#substitute_assItemNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '债务人名称';
			}
			if ($('#substitute_remainP').val() == '' || !pattern2.test($('#substitute_remainP').val())) {
				$('#substitute_remainP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期初数';
			}
			if ($('#substitute_debitTotalP').val() == '' || !pattern2.test($('#substitute_debitTotalP').val())) {
				$('#substitute_debitTotalP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期增加';
			}
			if ($('#substitute_creditTotalP').val() == '' || !pattern2.test($('#substitute_creditTotalP').val())) {
				$('#substitute_creditTotalP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期减少';
			}
			if ($('#substitute_debitTotalCutOffP').val() == '' || !pattern2.test($('#substitute_debitTotalCutOffP').val())) {
				$('#substitute_debitTotalCutOffP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '审计日止增加';
			}
			if ($('#substitute_creditTotalCutOffP').val() == '' || !pattern2.test($('#substitute_creditTotalCutOffP').val())) {
				$('#substitute_creditTotalCutOffP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '审计日止减少';
			}
			if ($('#substitute_endDateP').val() == '' || !pattern2.test($('#substitute_endDateP').val())) {
				$('#substitute_endDateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '截止日';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
		$('#voucherTest_sortNoP').val('B');
		$('#voucherTest_rangeP').val('C');
		$('#voucherTest_companyNameP').val('D');
		$('#voucherTest_remainP').val('E');
		$('#voucherTest_debitOccP').val('F');
		$('#voucherTest_creditOccP').val('G');
		$('#voucherTest_balanceP').val('H');
		$('#voucherTest_resultP').val('I');
		$('#voucherTest_summaryRow_index').val(4);
		$('#voucherTest_assItemNameP').val('G3');
		$('#voucherTest_remainDetailP').val('E10');
		$('#voucherTest_debitDetailP').val('E11');
		$('#voucherTest_creditDetailP').val('E12');
		$('#voucherTest_sampleMethodP').val('C');
		$('#voucherTest_numberP').val('D');
		$('#voucherTest_numberRateP').val('E');
		$('#voucherTest_debitSumP').val('F');
		$('#voucherTest_debitRateP').val('G');
		$('#voucherTest_creditSumP').val('H');
		$('#voucherTest_creditRateP').val('I');
		$('#voucherTest_sampleNameP').val('J');
		$('#voucherTest_countRow_index').val(19);
		$('#voucherTest_NoP').val('C');
		$('#voucherTest_vchDateP').val('D');
		$('#voucherTest_oldVoucherIdP').val('E');
		$('#voucherTest_summaryP').val('F');
		$('#voucherTest_oppositeAccountLastP').val('G');
		$('#voucherTest_debitValueP').val('H');
		$('#voucherTest_creditValueP').val('I');
		$('#voucherTest_fileIndexIdP').val('J');
		$('#voucherTest_contentP').val('K');
		$('#voucherTest_remarkP').val('L');
		$('#voucherTest_auditResultP').val('M');
		$('#voucherTest_samplingNameP').val('N');
		$('#voucherTest_relateSampleNameP').val('O');
		$('#voucherTest_itemRow_index').val(29);
		
		//核算科目
		$('#voucherTest_assitemid').focus(function() {
			$('#modal_assitemid_voucherTest').modal('show');
			if ($('#voucherTest_assitem_tree').hasClass('treeview')) {
				return;
			}
			$('#voucherTest_assitem_tree').tree2({
				url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: customerId,
					lockProjectId: projectId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param11: dgVoucherTestCount_view.localParam.urlparam.param1,
					searchInputId: 'searchInputVoucherTest'
				},
				singleSelect: false,
				//lazyLoad: false,
				//onceLoad: true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: true,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}
			});
		});
		$('#modal_assitemid_voucherTest_sure').click(function() {
			if (typeof($('#voucherTest_assitem_tree').tree2('getTreeMultiValue')) == 'object' || $('#voucherTest_assitem_tree').tree2('getTreeMultiValue') == "undefined") {
				$('#voucherTest_assitemid').val('');
			} else {
				$('#voucherTest_assitemid').val($('#voucherTest_assitem_tree').tree2('getTreeMultiValue'));
			}
			$('#modal_assitemid_voucherTest').modal('hide');
		});
		$('#modal_assitemid_voucherTest_reset').click(function() {
			$('#voucherTest_assitem_tree').tree2('reset');
			$('#searchInputVoucherTest').keyup();
		});
		//获取凭证测试数据
        $('#voucherTestBtn').click(e => {
           $('#adjustDataDiv').css('display', 'none');
           $('#voucherTestDataDiv').modal('show');
           $('#voucherTest_balance_rank').val('');
           $('#voucherTest_credit_rank').val('');
           $('#voucherTest_debit_rank').val('');
           $('#voucherTest_assitemid').val('');
           $('#voucherTest_summary_sheet').empty();
           $('#voucherTest_detail_sheet').empty();
           $('#voucherTest_summary_sheet').append("<option value=''></option>");
           $('#voucherTest_detail_sheet').append("<option value=''></option>");
           for (var i = 0; i < designer.Spread.getSheetCount(); i++) {
        	   var sheet = designer.Spread.getSheet(i);
        	   $('#voucherTest_summary_sheet').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
        	   $('#voucherTest_detail_sheet').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
        	   if(sheet.name().indexOf('汇总表') != -1){
        		   $('#voucherTest_summary_sheet').val(sheet.name());
        	   }else if(sheet.name().indexOf('凭证测试') != -1){
        		   $('#voucherTest_detail_sheet').val(sheet.name());
        	   }
           }
           $.ajax({
				url: 'finCenter/SubjectEntry.querySubstituteData.json',
				type: 'post',
				data: {
					lockCustomerId: customerId,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					lockProjectId : projectId,
					param1: designer.userSubjectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success && data.data.length > 0) {
						$('#voucherTest_subjectid').val(data.data[0].subjectId + '-' + data.data[0].subjectName);
						dgVoucherTestCount_view.localParam.urlparam.param1 = data.data[0].subjectId;
						dgVoucherTestCount_view.localParam.urlparam.param4 = data.data[0].direction;
						dgVoucherTestCount_view.localParam.urlparam.param5 = data.data[0].balance;
						dgVoucherTestCount_view.localParam.urlparam.param6 = data.data[0].endDate;
						dgVoucherTestCount_view.localParam.urlparam.param7 = data.data[0].subjectId;
						dgVoucherTestCount_view.localParam.urlparam.param8 = data.data[0].subMonth;
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
        });
    	//对输入金额进行校验
    	$('#voucherTest_balance_rank,#voucherTest_credit_rank,#voucherTest_debit_rank').blur(function() {
    		clearNoNumInt($(this));
    	});
        //查询凭证测试数据
        $('#btn_voucherTest_search').click(function() {
			var voucherTest_balance_rank = $('#voucherTest_balance_rank').val();
			var voucherTest_credit_rank = $('#voucherTest_credit_rank').val();
			var voucherTest_debit_rank = $('#voucherTest_debit_rank').val();
			var voucherTest_assitemid = $('#voucherTest_assitemid').val();
			if((voucherTest_balance_rank == '' || voucherTest_balance_rank == null) && 
				(voucherTest_credit_rank == '' || voucherTest_credit_rank == null) &&
				(voucherTest_debit_rank == '' || voucherTest_debit_rank == null) &&
				(voucherTest_assitemid == '' || voucherTest_assitemid == null)){
				bdoInfoBox('提示', '请选择辅助核算或者其他筛选方式');
    			return;
			}
			var endDate2 = '';
			var endDate3 = '';
			if ($('#voucherTest_table').hasClass('dataTable')) {
				$('#voucherTest_table').DataTable().clear();
				$('#voucherTest_table').DataTable().destroy();
				$('#voucherTest_table').empty();
			}
            //bdoInProcessingBox('加载中...');
			dgVoucherTestCount_view.localParam.urlparam.param1 = dgVoucherTestCount_view.localParam.urlparam.param1;
			dgVoucherTestCount_view.localParam.urlparam.param2 = endDate2;
			dgVoucherTestCount_view.localParam.urlparam.param3 = endDate3;
			dgVoucherTestCount_view.localParam.urlparam.param4 = dgVoucherTestCount_view.localParam.urlparam.param4;
			dgVoucherTestCount_view.localParam.urlparam.param5 = dgVoucherTestCount_view.localParam.urlparam.param5;
			dgVoucherTestCount_view.localParam.urlparam.param6 = dgVoucherTestCount_view.localParam.urlparam.param6;
			dgVoucherTestCount_view.localParam.urlparam.param9 = workpaperId;
			dgVoucherTestCount_view.localParam.urlparam.param11 = voucherTest_assitemid;
			dgVoucherTestCount_view.localParam.urlparam.param12 = dgVoucherTestCount_view.localParam.urlparam.param8;
			dgVoucherTestCount_view.localParam.urlparam.param16 = $('#voucherTest_assItemNameP').val();
			dgVoucherTestCount_view.localParam.urlparam.param17 = voucherTest_balance_rank;
			dgVoucherTestCount_view.localParam.urlparam.param18 = voucherTest_credit_rank;
			dgVoucherTestCount_view.localParam.urlparam.param19 = voucherTest_debit_rank;
            BdoDataTable('voucherTest_table', dgVoucherTestCount_view);
            $('#voucherTestTableDiv').modal('show');
        });
        //关闭凭证测试数据页面
        $('#modal_voucherTest_cancel').click(function() {
            $('#voucherTestDataDiv').modal('hide');
        });
        //关闭凭证测试数据页面
        $('#modal_voucherTestTable_cancel').click(function() {
            $('#voucherTestTableDiv').modal('hide');
        });
        // 获取凭证测试数据
		$('#modal_voucherTest_save').click(e => {
			var voucherTest_balance_rank = $('#voucherTest_balance_rank').val();
			var voucherTest_credit_rank = $('#voucherTest_credit_rank').val();
			var voucherTest_debit_rank = $('#voucherTest_debit_rank').val();
			var voucherTest_assitemid = $('#voucherTest_assitemid').val();
			if((voucherTest_balance_rank == '' || voucherTest_balance_rank == null) && 
				(voucherTest_credit_rank == '' || voucherTest_credit_rank == null) &&
				(voucherTest_debit_rank == '' || voucherTest_debit_rank == null) &&
				(voucherTest_assitemid == '' || voucherTest_assitemid == null)){
				bdoInfoBox('提示', '请选择辅助核算或者其他筛选方式');
    			return;
			}
			if($('#voucherTest_table').DataTable().data() != null && $('#voucherTest_table').DataTable().data().length > 0){
				
			}else{
				bdoInfoBox('提示', '没有查询到核算客户');
    			return;
			}
			var objectTable = [];
			var lenTable = $('#voucherTest_table').DataTable().data().length;
			for(var i=0;i<lenTable;i++){
				objectTable.push($('#voucherTest_table').DataTable().data()[i]);
			}
			var jsonData4 = JSON.stringify(objectTable);
			bdoConfirmBox('提示', '是否确定重新获取凭证测试数据？', function() {
				if(designer.Spread.getActiveSheet().name() == '封面'){
					bdoErrorBox('获取失败', '不能在‘封面’工作表获取凭证测试数据！');
					return;
				}
				if(!checkVoucherTestColumn()){
					return;
				}
				transition(() => {
					var json = spread.toJSON();
					if (!currentNode) {
						return;
					}
					excelIo.save(json, blob => {
						bdoInProcessingBox('加载中...');
						var param = {};
						param.fileName = fileName;
						param.workpaperId = workpaperId;
						param.customerId = customerId;
						param.projectId = projectId;
						param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();

						param = getDgParam(param);
						if(typeof(param) == "undefined"){
							bdoErrorBox('保存失败', "请再保存一次！");
							return;
						}
						var formData = new FormData();
						$.each(param, (key, val) => {
							formData.append(key, val);
						});
						formData.append('file', blob);
						$.ajax({
							url: 'dgCenter/DgWapper.uploadFile.json',
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false,
							success(data) {
								if (data.success) {
									// 汇总表
									if(dgVoucherTestCount_view.localParam.urlparam.param4 == '-1'){
										var object = [{
											sortNo : $('#voucherTest_sortNoP').val(),
											range : $('#voucherTest_rangeP').val(),
											assItemName : $('#voucherTest_companyNameP').val(),
											remain : $('#voucherTest_remainP').val(),
											creditTotalOcc : $('#voucherTest_debitOccP').val(),
											debitTotalOcc : $('#voucherTest_creditOccP').val(),
											balance : $('#voucherTest_balanceP').val(),
											result : $('#voucherTest_resultP').val()
										}];
									}else{
										var object = [{
											sortNo : $('#voucherTest_sortNoP').val(),
											range : $('#voucherTest_rangeP').val(),
											assItemName : $('#voucherTest_companyNameP').val(),
											remain : $('#voucherTest_remainP').val(),
											debitTotalOcc : $('#voucherTest_debitOccP').val(),
											creditTotalOcc : $('#voucherTest_creditOccP').val(),
											balance : $('#voucherTest_balanceP').val(),
											result : $('#voucherTest_resultP').val()
										}];
									}
									var jsonData = JSON.stringify(object);
									// 统计表
									var object1 = [{
										sampleMethodName : $('#voucherTest_sampleMethodP').val(),
										voucherNum : $('#voucherTest_numberP').val(),
										rate1 : $('#voucherTest_numberRateP').val(),
										debitOcc : $('#voucherTest_debitSumP').val(),
										rate2 : $('#voucherTest_debitRateP').val(),
										creditOcc : $('#voucherTest_creditSumP').val(),
										rate3 : $('#voucherTest_creditRateP').val(),
										sampleName : $('#voucherTest_sampleNameP').val()
									}];
									var jsonData1 = JSON.stringify(object1);
									// 明细表
									var object2 = [{
										no : $('#voucherTest_NoP').val(),
										vchDate : $('#voucherTest_vchDateP').val(),
										oldVoucherId : $('#voucherTest_oldVoucherIdP').val(),
										summary : $('#voucherTest_summaryP').val(),
										oppositeAccountLast : $('#voucherTest_oppositeAccountLastP').val(),
										debitValue : $('#voucherTest_debitValueP').val(),
										crebitValue : $('#voucherTest_creditValueP').val(),
										fileIndexId : $('#voucherTest_fileIndexIdP').val(),
										content : $('#voucherTest_contentP').val(),
										remark : $('#voucherTest_remarkP').val(),
										auditResultName : $('#voucherTest_auditResultP').val(),
										sampleName : $('#voucherTest_samplingNameP').val(),
										relateSampleName : $('#voucherTest_relateSampleNameP').val()
									}];
									var jsonData2 = JSON.stringify(object2);
									// 
									var object3;
									if(dgVoucherTestCount_view.localParam.urlparam.param4 == '-1'){
										object3 = [{
											assItemName : $('#voucherTest_assItemNameP').val(),
											remain : $('#voucherTest_remainDetailP').val(),
											debitTotalOcc : $('#voucherTest_creditDetailP').val(),
											creditTotalOcc : $('#voucherTest_debitDetailP').val()
										}];
									}else{
										object3 = [{
											assItemName : $('#voucherTest_assItemNameP').val(),
											remain : $('#voucherTest_remainDetailP').val(),
											debitTotalOcc : $('#voucherTest_debitDetailP').val(),
											creditTotalOcc : $('#voucherTest_creditDetailP').val()
										}];
									}
									var jsonData3 = JSON.stringify(object3);
									var endDate2 = '';
									var endDate3 = '';
									bdoInProcessingBox('加载中...');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgWapper.getVoucherTestData.json',
										data: {
											menuId: window.sys_menuId,
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											lockCustomerId: customerId,
											lockYyyy: window.CUR_PROJECT_ACC_YEAR,
											lockProjectId : projectId,
											param1: dgVoucherTestCount_view.localParam.urlparam.param1,
											param2: jsonData,
											param3: jsonData3,
											param4: dgVoucherTestCount_view.localParam.urlparam.param4,
											param5: dgVoucherTestCount_view.localParam.urlparam.param5,
											param6: dgVoucherTestCount_view.localParam.urlparam.param6,
											param7: $('#voucherTest_countRow_index').val(),
											param8: $('#voucherTest_itemRow_index').val(),
											param9: workpaperId,
											param10: $('#voucherTest_summaryRow_index').val(),
											param11: voucherTest_assitemid,
											param12: dgVoucherTestCount_view.localParam.urlparam.param8,
											param13: jsonData1,
											param14: jsonData2,
											param15: '',
											param16: $('#voucherTest_assItemNameP').val(),
											param17: parseInt(designer.Spread.getSheetIndex($('#voucherTest_summary_sheet option:selected').val())),
											param18: parseInt(designer.Spread.getSheetIndex($('#voucherTest_detail_sheet option:selected').val())),
											param19: voucherTest_balance_rank,
											param20: voucherTest_credit_rank,
											param21: voucherTest_debit_rank,
											param22: jsonData4,
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
												getExcelData({
													menuId: window.sys_menuId,
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: workpaperId,
													param2: customerId
												});
												$('#voucherTestDataDiv').modal('hide');
												$('#voucherTestTableDiv').modal('hide');
											}else{
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
									for(let i = 0;i < objectTable.length;i++){
										setTimeout(function(){ $('#showProcessing').html('正在生成' + objectTable[i].assItemName + '(' + (i+1) + '/' + objectTable.length + ')'); }, i*2500);
									}
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				});
				
			});
		});
		// 检查列数据是否填写正确
		function checkVoucherTestColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#voucherTest_summary_sheet').parent().parent().css({'border': '0px'});
			$('#voucherTest_sortNoP').parent().parent().css({'border': '0px'});
			$('#voucherTest_rangeP').parent().parent().css({'border': '0px'});
			$('#voucherTest_companyNameP').parent().parent().css({'border': '0px'});
			$('#voucherTest_remainP').parent().parent().css({'border': '0px'});
			$('#voucherTest_debitOccP').parent().parent().css({'border': '0px'});
			$('#voucherTest_creditOccP').parent().parent().css({'border': '0px'});
			$('#voucherTest_balanceP').parent().parent().css({'border': '0px'});
			$('#voucherTest_resultP').parent().parent().css({'border': '0px'});
			$('#voucherTest_summaryRow_index').parent().parent().css({'border': '0px'});
			$('#voucherTest_detail_sheet').parent().parent().css({'border': '0px'});
			$('#voucherTest_assItemNameP').parent().parent().css({'border': '0px'});
			$('#voucherTest_remainDetailP').parent().parent().css({'border': '0px'});
			$('#voucherTest_debitDetailP').parent().parent().css({'border': '0px'});
			$('#voucherTest_creditDetailP').parent().parent().css({'border': '0px'});
			$('#voucherTest_sampleMethodP').parent().parent().css({'border': '0px'});
			$('#voucherTest_numberP').parent().parent().css({'border': '0px'});
			$('#voucherTest_numberRateP').parent().parent().css({'border': '0px'});
			$('#voucherTest_debitSumP').parent().parent().css({'border': '0px'});
			$('#voucherTest_debitRateP').parent().parent().css({'border': '0px'});
			$('#voucherTest_creditSumP').parent().parent().css({'border': '0px'});
			$('#voucherTest_creditRateP').parent().parent().css({'border': '0px'});
			$('#voucherTest_sampleNameP').parent().parent().css({'border': '0px'});
			$('#voucherTest_countRow_index').parent().parent().css({'border': '0px'});
			$('#voucherTest_NoP').parent().parent().css({'border': '0px'});
			$('#voucherTest_vchDateP').parent().parent().css({'border': '0px'});
			$('#voucherTest_oldVoucherIdP').parent().parent().css({'border': '0px'});
			$('#voucherTest_summaryP').parent().parent().css({'border': '0px'});
			$('#voucherTest_oppositeAccountLastP').parent().parent().css({'border': '0px'});
			$('#voucherTest_debitValueP').parent().parent().css({'border': '0px'});
			$('#voucherTest_creditValueP').parent().parent().css({'border': '0px'});
			$('#voucherTest_fileIndexIdP').parent().parent().css({'border': '0px'});
			$('#voucherTest_contentP').parent().parent().css({'border': '0px'});
			$('#voucherTest_remarkP').parent().parent().css({'border': '0px'});
			$('#voucherTest_auditResultP').parent().parent().css({'border': '0px'});
			$('#voucherTest_samplingNameP').parent().parent().css({'border': '0px'});
			$('#voucherTest_relateSampleNameP').parent().parent().css({'border': '0px'});
			$('#voucherTest_itemRow_index').parent().parent().css({'border': '0px'});			
			
			var flag = true;
			var pattern = /^[A-Z]{1,2}$/; // 列
			var pattern1 = /^[0-9]{1,}$/; // 数值
			var pattern2 = /^[A-Z]+\d+$/; // 单元格
			var errorText = '';
			if ($('#voucherTest_summary_sheet option:selected').val() == '') {
				$('#voucherTest_summary_sheet').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '汇总表sheet';
			}
			if ($('#voucherTest_sortNoP').val() == '' || !pattern.test($('#voucherTest_sortNoP').val())) {
				$('#voucherTest_sortNoP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '序号列';
			}
			if ($('#voucherTest_rangeP').val() == '' || !pattern.test($('#voucherTest_rangeP').val())) {
				$('#voucherTest_rangeP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '样本选择条件列';
			}
			if ($('#voucherTest_companyNameP').val() == '' || !pattern.test($('#voucherTest_companyNameP').val())) {
				$('#voucherTest_companyNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '单位名称列';
			}
			if ($('#voucherTest_remainP').val() == '' || !pattern.test($('#voucherTest_remainP').val())) {
				$('#voucherTest_remainP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期初余额列';
			}
			if ($('#voucherTest_debitOccP').val() == '' || !pattern.test($('#voucherTest_debitOccP').val())) {
				$('#voucherTest_debitOccP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期增加列';
			}
			if ($('#voucherTest_creditOccP').val() == '' || !pattern.test($('#voucherTest_creditOccP').val())) {
				$('#voucherTest_creditOccP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期减少列';
			}
			if ($('#voucherTest_balanceP').val() == '' || !pattern.test($('#voucherTest_balanceP').val())) {
				$('#voucherTest_balanceP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期末余额列';
			}
			if ($('#voucherTest_resultP').val() == '' || !pattern.test($('#voucherTest_resultP').val())) {
				$('#voucherTest_resultP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '结论列';
			}
			if ($('#voucherTest_summaryRow_index').val() == '' || !pattern1.test($('#voucherTest_summaryRow_index').val())) {
				$('#voucherTest_summaryRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '汇总表开始行';
			}
			if ($('#voucherTest_detail_sheet option:selected').val() == '') {
				$('#voucherTest_detail_sheet').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '凭证测试表sheet';
			}
			if ($('#voucherTest_assItemNameP').val() == '' || !pattern2.test($('#voucherTest_assItemNameP').val())) {
				$('#voucherTest_assItemNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '公司名称';
			}
			if ($('#voucherTest_remainDetailP').val() == '' || !pattern2.test($('#voucherTest_remainDetailP').val())) {
				$('#voucherTest_remainDetailP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '期初数';
			}
			if ($('#voucherTest_debitDetailP').val() == '' || !pattern2.test($('#voucherTest_debitDetailP').val())) {
				$('#voucherTest_debitDetailP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期增加';
			}
			if ($('#voucherTest_creditDetailP').val() == '' || !pattern2.test($('#voucherTest_creditDetailP').val())) {
				$('#voucherTest_creditDetailP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '本期减少';
			}
			if ($('#voucherTest_sampleMethodP').val() == '' || !pattern.test($('#voucherTest_sampleMethodP').val())) {
				$('#voucherTest_sampleMethodP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '抽凭方式列';
			}
			if ($('#voucherTest_numberP').val() == '' || !pattern.test($('#voucherTest_numberP').val())) {
				$('#voucherTest_numberP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '样本数量列';
			}
			if ($('#voucherTest_numberRateP').val() == '' || !pattern.test($('#voucherTest_numberRateP').val())) {
				$('#voucherTest_numberRateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '样本数量占发生额总数量的比例列';
			}
			if ($('#voucherTest_debitSumP').val() == '' || !pattern.test($('#voucherTest_debitSumP').val())) {
				$('#voucherTest_debitSumP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '借方抽样金额列';
			}
			if ($('#voucherTest_debitRateP').val() == '' || !pattern.test($('#voucherTest_debitRateP').val())) {
				$('#voucherTest_debitRateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '借方抽样金额占借方总发生额比例列';
			}
			if ($('#voucherTest_creditSumP').val() == '' || !pattern.test($('#voucherTest_creditSumP').val())) {
				$('#voucherTest_creditSumP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '贷方抽样金额列';
			}
			if ($('#voucherTest_creditRateP').val() == '' || !pattern.test($('#voucherTest_creditRateP').val())) {
				$('#voucherTest_creditRateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '贷方抽样金额占贷方总发生额比例列';
			}
			if ($('#voucherTest_sampleNameP').val() == '' || !pattern.test($('#voucherTest_sampleNameP').val())) {
				$('#voucherTest_sampleNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '抽凭名称列';
			}
			if ($('#voucherTest_countRow_index').val() == '' || !pattern1.test($('#voucherTest_countRow_index').val())) {
				$('#voucherTest_countRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '抽凭统计表开始行';
			}
			if ($('#voucherTest_NoP').val() == '' || !pattern.test($('#voucherTest_NoP').val())) {
				$('#voucherTest_NoP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '编号列';
			}
			if ($('#voucherTest_vchDateP').val() == '' || !pattern.test($('#voucherTest_vchDateP').val())) {
				$('#voucherTest_vchDateP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '日期列';
			}
			if ($('#voucherTest_oldVoucherIdP').val() == '' || !pattern.test($('#voucherTest_oldVoucherIdP').val())) {
				$('#voucherTest_oldVoucherIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '凭证编号列';
			}
			if ($('#voucherTest_summaryP').val() == '' || !pattern.test($('#voucherTest_summaryP').val())) {
				$('#voucherTest_summaryP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '摘要列';
			}
			if ($('#voucherTest_oppositeAccountLastP').val() == '' || !pattern.test($('#voucherTest_oppositeAccountLastP').val())) {
				$('#voucherTest_oppositeAccountLastP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '对方科目列';
			}
			if ($('#voucherTest_debitValueP').val() == '' || !pattern.test($('#voucherTest_debitValueP').val())) {
				$('#voucherTest_debitValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '借方金额列';
			}
			if ($('#voucherTest_creditValueP').val() == '' || !pattern.test($('#voucherTest_creditValueP').val())) {
				$('#voucherTest_creditValueP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '贷方金额列';
			}
			if ($('#voucherTest_fileIndexIdP').val() == '' || !pattern.test($('#voucherTest_fileIndexIdP').val())) {
				$('#voucherTest_fileIndexIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '附件索引列';
			}
			if ($('#voucherTest_contentP').val() == '' || !pattern.test($('#voucherTest_contentP').val())) {
				$('#voucherTest_contentP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '附件内容列';
			}
			if ($('#voucherTest_remarkP').val() == '' || !pattern.test($('#voucherTest_remarkP').val())) {
				$('#voucherTest_remarkP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '备注列';
			}
			if ($('#voucherTest_auditResultP').val() == '' || !pattern.test($('#voucherTest_auditResultP').val())) {
				$('#voucherTest_auditResultP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '审计结论列';
			}
			if ($('#voucherTest_samplingNameP').val() == '' || !pattern.test($('#voucherTest_samplingNameP').val())) {
				$('#voucherTest_samplingNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '抽凭名称列';
			}
			if ($('#voucherTest_relateSampleNameP').val() == '' || !pattern.test($('#voucherTest_relateSampleNameP').val())) {
				$('#voucherTest_relateSampleNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '关联抽凭名称列';
			}
			if ($('#voucherTest_itemRow_index').val() == '' || !pattern1.test($('#voucherTest_itemRow_index').val())) {
				$('#voucherTest_itemRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '凭证查验明细开始行';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
		// 获取利息收入数据
		$('#interestBtn').click(e => {
			bdoConfirmBox('提示', '是否确定重新获取利息收入数据？', function() {
				if(designer.Spread.getActiveSheet().name() == '封面'){
					bdoErrorBox('获取失败', '不能在‘封面’工作表获取替代测试数据！');
					return;
				}
				transition(() => {
					var json = spread.toJSON();
					if (!currentNode) {
						return;
					}
					excelIo.save(json, blob => {
						bdoInProcessingBox('加载中...');
						var param = {};
						param.fileName = fileName;
						param.workpaperId = workpaperId;
						param.customerId = customerId;
						param.projectId = projectId;
						param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();

						param = getDgParam(param);
						if(typeof(param) == "undefined"){
							bdoErrorBox('保存失败', "请再保存一次！");
							return;
						}
						var formData = new FormData();
						$.each(param, (key, val) => {
							formData.append(key, val);
						});
						formData.append('file', blob);
						$.ajax({
							url: 'dgCenter/DgWapper.uploadFile.json',
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false,
							success(data) {
								if (data.success) {
									bdoInProcessingBox('加载中...');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgWapper.getInterestData.json',
										data: {
											menuId: window.sys_menuId,
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											lockCustomerId: customerId,
											lockYyyy: window.CUR_PROJECT_ACC_YEAR,
											lockProjectId : projectId,
											param9: workpaperId,
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
												getExcelData({
													menuId: window.sys_menuId,
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: workpaperId,
													param2: customerId
												});
												$('#adjustDataDiv').css('display', 'none');
											}else{
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
									/*for(let i = 0;i < objectTable.length;i++){
										setTimeout(function(){ $('#showProcessing').html('正在生成' + objectTable[i].assItemName + '(' + (i+1) + '/' + objectTable.length + ')'); }, i*2500);
									}*/
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				});
				
			});
		});
		// 获取科目账套数据
		$('#accountDataBtn').click(e => {
			bdoConfirmBox('提示', '是否确定重新获取账套数据？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00237',
						param1: customerId,
						param2: projectId,
						param3: workpaperId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0] != null && data.data[0].methodStyle == 1) {
								$('#accountDataParamModal').modal('show');
							} else {
								getAccountData('', '');
							}
						}
					}
				});
			});
		});
		// 点击直接定位到审计调整的位置
		$('#positionAdjustDataBtn').click(e => {
			document.getElementById('adjustment').scrollIntoView();
		});
		// 审计数据按钮--打开选择审计数据modal
		$('#adjustDataBtn').click(e => {
			adjustData_table_view.localParam.urlparam.param3 = $('#adjustData_type option:selected').attr('data-result');
			adjustData_table_view.localParam.urlparam.param5 = $('#adjustData_adjustType').val();
			BdoDataTable('adjustData_table', adjustData_table_view);
			// $('#adjustData_type').val(1);
			fillColumn();
		});
		// 选择审计数据modal--关闭按钮
		$('#modal_adjust_cancel').click(function() {
			$('#adjustDataDiv').css('display', 'none');
		});
		// 检查列数据是否填写正确
		function checkColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#adjustData_subjectIdP').parent().parent().css({'border': '0px'});
			$('#adjustData_subjectNameP').parent().parent().css({'border': '0px'});
			$('#adjustData_assItemIdP').parent().parent().css({'border': '0px'});
			$('#adjustData_assItemNameP').parent().parent().css({'border': '0px'});
			$('#adjustData_itemStartRow_index').parent().parent().css({'border': '0px'});
			$('#adjustData_itemEndRow_index').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_debit').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_credit').parent().parent().css({'border': '0px'});
			$('#adjustData_adjustP_index').parent().parent().css({'border': '0px'});
			var flag = true;
			var pattern = /^[A-Z]{1,3}$/;
			var errorText = '';
			var itemNameP = $('#adjustData_subjectNameP').val();
			if (flag && (itemNameP == '' || !pattern.test(itemNameP))) {
				$('#adjustData_subjectNameP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '科目名称列';
			}
			var startRow = $('#adjustData_itemStartRow_index').val();
			var pattern1 = /^[0-9]{1,}$/;
			if (flag && (startRow == '' || !pattern1.test(startRow))) {
				$('#adjustData_itemStartRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '项目开始行';
			}
			var endRow = $('#adjustData_itemEndRow_index').val();
			if (flag && (endRow == '' || !pattern1.test(endRow))) {
				$('#adjustData_itemEndRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '项目结束行';
			}
			if (flag && ($('#adjustData_adjustP').val() != null && $('#adjustData_adjustP').val() != '')) {
				if (!pattern.test($('#adjustData_adjustP').val())) {
					$('#adjustData_adjustP').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '调整数列';
				}
			}
			if (flag && ($('#adjustData_adjustP_debit').val() != null && $('#adjustData_adjustP_debit').val() != '')) {
				if (!pattern.test($('#adjustData_adjustP_debit').val())) {
					$('#adjustData_adjustP_debit').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '调整数(借)列';
				}
			}
			if (flag && ($('#adjustData_adjustP_credit').val() != null && $('#adjustData_adjustP_credit').val() != '')) {
				if (!pattern.test($('#adjustData_adjustP_credit').val())) {
					$('#adjustData_adjustP_credit').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '调整数(贷)列';
				}
			}
			if (flag && ($('#adjustData_adjustP_index').val() != null && $('#adjustData_adjustP_index').val() != '')) {
				if (!pattern.test($('#adjustData_adjustP_index').val())) {
					$('#adjustData_adjustP_index').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '调整数(索引)列';
				}
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
        // 检查列数据是否填写正确
        function checkAccountAgeColumn(type) {
			if (type == 1 || type == 3) {
			    var accoutAgeName = $("#accoutAge_name").val();
			    if (accoutAgeName =='' || accoutAgeName.length == 0){
                    bdoErrorBox('失败', '名称不能为空');
                    return;
                }
            }
            $('#accoutAge_nameP').parent().parent().css({'border': '0px'});
            $('#accountAge_itemColumn_index').parent().parent().css({'border': '0px'});
            $('#accountAge_itemRow_index').parent().parent().css({'border': '0px'});
            $('#accountAge_adjustColumn_index').parent().parent().css({'border': '0px'});
            var flag = true;
            var pattern = /^[A-Z]{1,2}$/;
            var accoutAgeNameP = $('#accoutAge_nameP').val();
            var errorText = '';
            if (accoutAgeNameP == '' || !pattern.test(accoutAgeNameP)) {
                $('#accoutAge_nameP').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '名称项列';
            }
            if (type == 1 || type == 2) {
                if ($('#accountAge_itemColumn_index').val() != null && $('#accountAge_itemColumn_index').val() != '') {
                    if (!pattern.test($('#accountAge_itemColumn_index').val())) {
                        $('#accountAge_itemColumn_index').parent().parent().css({'border': '1px dashed red'});
                        flag = false;
                        errorText = '未审账龄开始列';
                    }
                }else{
                	$('#accountAge_itemColumn_index').parent().parent().css({'border': '1px dashed red'});
                    flag = false;
                    errorText = '未审账龄开始列';
                }
            }
            var itemRow = $('#accountAge_itemRow_index').val();
            var pattern1 = /^[0-9]{1,}$/;
            if (itemRow == '' || !pattern1.test(itemRow)) {
                $('#accountAge_itemRow_index').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '账龄开始行';
            }
            if (type == 3 || type == 4) {
                if ($('#accountAge_adjustColumn_index').val() != null && $('#accountAge_adjustColumn_index').val() != '') {
                    if (!pattern.test($('#accountAge_adjustColumn_index').val())) {
                        $('#accountAge_adjustColumn_index').parent().parent().css({'border': '1px dashed red'});
                        flag = false;
                        errorText = '审定账龄开始列';
                    }
                }else{
                	$('#accountAge_adjustColumn_index').parent().parent().css({'border': '1px dashed red'});
                    flag = false;
                    errorText = '审定账龄开始列';
                }
            }
            if (!flag) {
                bdoErrorBox('失败', '请正确输入' + errorText + '!');
            }
            return flag;
        }
        // 检查列数据是否填写正确
        function checkAccountAgeSaveColumn() {
            $('#accountAge_save_itemColumn_index').parent().parent().css({'border': '0px'});
            $('#accountAge_save_adjustColumn_index').parent().parent().css({'border': '0px'});
            $('#accountAge_save_itemRow_index').parent().parent().css({'border': '0px'});
            $('#accountAge_save_endRow_index').parent().parent().css({'border': '0px'});
            var flag = true;
            var pattern = /^[A-Z]{1,2}$/;
            var errorText = '';
            if ($('#accountAge_save_itemColumn_index').val() != null && $('#accountAge_save_itemColumn_index').val() != '') {
                if (!pattern.test($('#accountAge_save_itemColumn_index').val())) {
                    $('#accountAge_save_itemColumn_index').parent().parent().css({'border': '1px dashed red'});
                    flag = false;
                    errorText = '未审账龄开始列';
                }
            }else{
            	$('#accountAge_save_itemColumn_index').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '未审账龄开始列';
            }
            if ($('#accountAge_save_adjustColumn_index').val() != null && $('#accountAge_save_adjustColumn_index').val() != '') {
                if (!pattern.test($('#accountAge_save_adjustColumn_index').val())) {
                    $('#accountAge_save_adjustColumn_index').parent().parent().css({'border': '1px dashed red'});
                    flag = false;
                    errorText = '审定账龄开始列';
                }
            }else{
            	$('#accountAge_save_adjustColumn_index').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '审定账龄开始列';
            }
            var itemRow = $('#accountAge_save_itemRow_index').val();
            var endRow = $('#accountAge_save_endRow_index').val();
            var pattern1 = /^[0-9]{1,}$/;
            if (itemRow == '' || !pattern1.test(itemRow)) {
                $('#accountAge_save_itemRow_index').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '账龄开始行';
            }
            if (endRow == '' || !pattern1.test(endRow)) {
                $('#accountAge_save_endRow_index').parent().parent().css({'border': '1px dashed red'});
                flag = false;
                errorText = '账龄结束行';
            }
            if (!flag) {
                bdoErrorBox('失败', '请正确输入' + errorText + '!');
            }
            return flag;
        }

		// 选择审计数据modal--确定按钮
		$('#modal_adjust_sure').click(function() {
			var flag = checkColumn();
			if (!flag) {
				return;
			}
			var table = $('#adjustData_table').dataTable();
			var data = table.fnGetData();
			if (data.length == 0) {
				bdoInfoBox('提示', '无调整数据！');
				return;
			}
			bdoInProcessingBox('调整数据设置中');
			var sheet = designer.Spread.getActiveSheet();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var startRow = $('#adjustData_itemStartRow_index').val();
			var endRow = $('#adjustData_itemEndRow_index').val();
			var count = data.length * (endRow - startRow + 1);
			if(count > 1000){
				transition(() => {
					var json = designer.Spread.toJSON();
					excelIo.save(json, blob => {
						var param = {};
						param.fileName = fileName;
						param.workpaperId = workpaperId;
						param.customerId = customerId;
						param.projectId = projectId;
						param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();
						param = getDgParam(param);
						if(typeof(param) == "undefined"){
							bdoErrorBox('保存失败', "请再保存一次！");
							return;
						}
						param.tagChanged = JSON.stringify(designer.tagChanged);
						designer.tagChanged = [];
						var formData = new FormData();
						$.each(param, (key, val) => {
							formData.append(key, val);
						});
						formData.append('file', blob);
						$.ajax({
							url: 'dgCenter/DgWapper.uploadFile.json',
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false,
							success(data) {
								if (data.success) {
									storage.removeItem(storageId);
									storage.removeItem(storageStatus);
									storage.removeItem(storageTime);
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgWapper.insertAdjustData.json',
										// async : false,
										data: {
											menuId: window.sys_menuId,
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: customerId,
											param2: projectId,
											param3: workpaperId,
											param4: $('#adjustData_type').val(),
											param5: $('#adjustData_adjustType').val(),
											param6: $('#adjustData_subjectIdP').val(),
											param7: $('#adjustData_subjectNameP').val(),
											param8: $('#adjustData_assItemIdP').val(),
											param9: $('#adjustData_assItemNameP').val(),
											param10: $('#adjustData_itemStartRow_index').val(),
											param11: $('#adjustData_itemEndRow_index').val(),
											param12: $('#adjustData_adjustP').val(),
											param13: $('#adjustData_adjustP_debit').val(),
											param14: $('#adjustData_adjustP_credit').val(),
											param15: $('#adjustData_adjustP_index').val(),
											param16: designer.userSubjectId,
											param17: designer.Spread.getActiveSheetIndex(),
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												$('#adjustData_subjectIdP').parent().parent().css({'border': '0px'});
												$('#adjustData_subjectNameP').parent().parent().css({'border': '0px'});
												$('#adjustData_assItemIdP').parent().parent().css({'border': '0px'});
												$('#adjustData_assItemNameP').parent().parent().css({'border': '0px'});
												$('#adjustData_itemStartRow_index').parent().parent().css({'border': '0px'});
												$('#adjustData_itemEndRow_index').parent().parent().css({'border': '0px'});
												$('#adjustData_adjustP_debit').parent().parent().css({'border': '0px'});
												$('#adjustData_adjustP_credit').parent().parent().css({'border': '0px'});
												$('#adjustData_adjustP_index').parent().parent().css({'border': '0px'});
												var time = data.data[0].time;
												if (storage.length > 200) {
													storage.removeItem(storage.key(2));
													storage.removeItem(storage.key(1));
													storage.removeItem(storage.key(0));
												}
												storage.setItem(storageTime, time);
												var excel = data.data[0].excelBase64Data;
												var file = dataURLtoFile(excel, param.param1);
												blobToDataURL(file, data => {
													storage.setItem(storageId, data);
													storage.setItem(storageStatus, 'server');
												});
												excelIo.open(file, json => {
													var workbookObj = json;
													workbookObj = updateUsedRange(json);
													spread.fromJSON(workbookObj);
													for (var i = 0; i < spread.getSheetCount(); i++) {
														if(spread.getSheet(i).getColumnCount() < 20){
															spread.getSheet(i).setColumnCount(20);
														}else{
															spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
														}
														spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
													}
													getCustomizeStyle(false);
													bdoSuccessBox('成功', '设置成功！');
													spread.setActiveSheetIndex(sheetIndex);
													var extraData = data.data[0].extraData;
													var displaytext = '还剩&nbsp;' + extraData.length + '&nbsp;笔调整未刷入底稿<div style="height: 250px;overflow-y: auto">';
													for(var rowData of extraData){
														displaytext = displaytext + '<br>科目名称：<font color="red">' + rowData.subjectname1 + '</font>';
														displaytext = displaytext + '&nbsp;&nbsp;科目全路径：<font color="red">' + rowData.subjectFullName1 + '</font>';
														if(rowData.assItemName != null && rowData.assItemName != ''){
															displaytext = displaytext + '&nbsp;&nbsp;核算项名称：<font color="red">' + rowData.assItemName + '</font>';
														}
													}
													displaytext = displaytext + '</div>';
													bdoInfoBox('提示', displaytext);
												}, e => {
													bdoErrorBox('失败', e.errorMessage);
												});
												/*getExcelData({
													menuId: window.sys_menuId,
													param1: workpaperId,
													param2: customerId
												});*/
											}
										}
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
						blobToDataURL(blob, data => {
							storage.setItem(storageId, data);
							storage.setItem(storageStatus, 'server');
						});
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				});
			}else{
				setTimeout(function(){
					spread.suspendPaint();
					clearExcelAdjustData(data);
					
					var extraData = refreshAdjustData(data);
					spread.resumePaint();
					setAdjustDglocation(extraData);
				}, 100);
			}
		});
		// 已保存已选择的选项列--科目项列、调整数列、调整数(借)列、调整数(贷)列、调整数(索引)列
		function setAdjustDglocation(extraData){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.setAdjustDglocation.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
					param4: $('#adjustData_type').val(),
					param5: $('#adjustData_adjustType').val(),
					param6: $('#adjustData_subjectIdP').val(),
					param7: $('#adjustData_subjectNameP').val(),
					param8: $('#adjustData_assItemIdP').val(),
					param9: $('#adjustData_assItemNameP').val(),
					param10: $('#adjustData_itemStartRow_index').val(),
					param11: $('#adjustData_itemEndRow_index').val(),
					param12: $('#adjustData_adjustP').val(),
					param13: $('#adjustData_adjustP_debit').val(),
					param14: $('#adjustData_adjustP_credit').val(),
					param15: $('#adjustData_adjustP_index').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#adjustData_subjectIdP').parent().parent().css({'border': '0px'});
						$('#adjustData_subjectNameP').parent().parent().css({'border': '0px'});
						$('#adjustData_assItemIdP').parent().parent().css({'border': '0px'});
						$('#adjustData_assItemNameP').parent().parent().css({'border': '0px'});
						$('#adjustData_itemStartRow_index').parent().parent().css({'border': '0px'});
						$('#adjustData_itemEndRow_index').parent().parent().css({'border': '0px'});
						$('#adjustData_adjustP_debit').parent().parent().css({'border': '0px'});
						$('#adjustData_adjustP_credit').parent().parent().css({'border': '0px'});
						$('#adjustData_adjustP_index').parent().parent().css({'border': '0px'});
						bdoSuccessBox('成功', '设置成功！');
						if(extraData.length > 0){
							setTimeout(function(){
								var displaytext = '还剩&nbsp;' + extraData.length + '&nbsp;笔调整未刷入底稿<div style="height: 250px;overflow-y: auto">';
								for(var rowData of extraData){
									displaytext = displaytext + '<br>科目名称：<font color="red">' + rowData.subjectname1 + '</font>';
									displaytext = displaytext + '&nbsp;&nbsp;科目全路径：<font color="red">' + rowData.subjectFullName1 + '</font>';
									if(rowData.assItemName != null && rowData.assItemName != ''){
										displaytext = displaytext + '&nbsp;&nbsp;核算项名称：<font color="red">' + rowData.assItemName + '</font>';
									}
								}
								displaytext = displaytext + '</div>';
								bdoInfoBox('提示', displaytext);
							}, 100);
						}
					}
				}
			});
		}
		// 设置调整数据前，清空
		function clearExcelAdjustData(data){
			var sheet = designer.Spread.getActiveSheet();
			var startRow = parseInt($('#adjustData_itemStartRow_index').val());
			var endRow = parseInt($('#adjustData_itemEndRow_index').val());
			for(var row = startRow;row <= endRow;row++){
				// 调整数
				if ($('#adjustData_adjustP').val() != null && $('#adjustData_adjustP').val() != '') {
					var adjustRange = getRange(sheet, $('#adjustData_adjustP').val() + row);
					sheet.clear(adjustRange.row, adjustRange.col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
				}
				// 调整数(借)
				if ($('#adjustData_adjustP_debit').val() != null && $('#adjustData_adjustP_debit').val() != '') {
					var adjustRange = getRange(sheet, $('#adjustData_adjustP_debit').val() + row);
					sheet.clear(adjustRange.row, adjustRange.col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
				}
				// 调整数(贷)
				if ($('#adjustData_adjustP_credit').val() != null && $('#adjustData_adjustP_credit').val() != '') {
					var adjustRange = getRange(sheet, $('#adjustData_adjustP_credit').val() + row);
					sheet.clear(adjustRange.row, adjustRange.col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
				}
				/*// 调整数(索引)
				if ($('#adjustData_adjustP_index').val() != null && $('#adjustData_adjustP_index').val() != '') {
					var indexIdRange = getRange(sheet, $('#adjustData_adjustP_index').val() + row);
					sheet.clear(indexIdRange.row, indexIdRange.col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
				}*/
			}
		}
		// 填充调整数据
		function refreshAdjustData(data) {
			var extraData = [];
			var sheet = designer.Spread.getActiveSheet();
			var startRow = parseInt($('#adjustData_itemStartRow_index').val());
			var endRow = parseInt($('#adjustData_itemEndRow_index').val());
			// 科目名称单元格位置
			var subjectNameRange = getRange(sheet, $('#adjustData_subjectNameP').val() + 1);
			var subjectNameCol = subjectNameRange.col;
			var subjectIdCol = -1;
			if($('#adjustData_subjectIdP').val() != null && $('#adjustData_subjectIdP').val() != ''){
				// 科目编号单元格位置
				var subjectIdRange = getRange(sheet, $('#adjustData_subjectIdP').val() + 1);
				subjectIdCol = subjectIdRange.col;
			}
			var assItemNameCol = -1;
			var assItemIdCol = -1;
			if($('#adjustData_assItemNameP').val() != null && $('#adjustData_assItemNameP').val() != ''){
				// 核算名称单元格位置
				var assItemNameRange = getRange(sheet, $('#adjustData_assItemNameP').val() + 1);
				assItemNameCol = assItemNameRange.col;
			}
			if($('#adjustData_assItemIdP').val() != null && $('#adjustData_assItemIdP').val() != ''){
				// 核算编号单元格位置
				var assItemIdRange = getRange(sheet, $('#adjustData_assItemIdP').val() + 1);
				assItemIdCol = assItemIdRange.col;
			}
			for(var num = 0;num < data.length;num++){
				console.log('设置调整数据：' + num);
				var rowData = data[num];
				// 客户科目编号
				var subjectId = rowData.subjectId;
				// 客户科目全路径
				var subjectFullName = rowData.subjectFullName1;
				// 客户科目名称
				var subjectname = rowData.subjectname1;
				// 核算项编号
				var assItemId = rowData.assItemId;
				// 核算项名称
				var assItemName = rowData.assItemName;
				var foundRowIndex = -1;
				var isMatch = false;
				for (var i = startRow - 1; i <= endRow - 1; i++) {
					var cellTextSubjectName = '';
					var cellTextSubjectId = '';
					var cellTextAssItemName = '';
					var cellTextAssItemId = '';
					// 科目名称
					cellTextSubjectName = sheet.getValue(i, subjectNameCol);
					if(subjectIdCol != -1){
						cellTextSubjectId = sheet.getValue(i, subjectIdCol);
					}
					if(assItemNameCol != -1){
						cellTextAssItemName = sheet.getValue(i, assItemNameCol);
					}
					if(assItemIdCol != -1){
						cellTextAssItemId = sheet.getValue(i, assItemIdCol);
					}
					if(cellTextSubjectName == subjectFullName || cellTextSubjectName == subjectname){
						isMatch = true;
					}
					if(isMatch && subjectIdCol != -1){
						if(cellTextSubjectId != subjectId){
							isMatch = false;
						}
					}
					if(isMatch && assItemNameCol != -1){
						if(cellTextAssItemName != assItemName){
							isMatch = false;
						}
					}
					if(isMatch && assItemIdCol != -1){
						if(cellTextAssItemId != assItemId){
							isMatch = false;
						}
					}
					if (isMatch) {
						foundRowIndex = i;
						break;
					}
				}
				if (isMatch) {
					var row = foundRowIndex + 1;
					// 调整数
					if ($('#adjustData_adjustP').val() != null && $('#adjustData_adjustP').val() != '') {
						var adjustRange = getRange(sheet, $('#adjustData_adjustP').val() + row);
						var cellValue = sheet.getValue(adjustRange.row, adjustRange.col);
						if(cellValue != null && cellValue != ''){
							sheet.getCell(adjustRange.row, adjustRange.col).value(parseFloat(cellValue) + rowData.adjust);
						}else{
							sheet.getCell(adjustRange.row, adjustRange.col).value(rowData.adjust);
						}
					}
					// 调整数(借)
					if ($('#adjustData_adjustP_debit').val() != null && $('#adjustData_adjustP_debit').val() != '') {
						var adjustRange = getRange(sheet, $('#adjustData_adjustP_debit').val() + row);
						var cellValue = sheet.getValue(adjustRange.row, adjustRange.col);
						if(cellValue != null && cellValue != ''){
							sheet.getCell(adjustRange.row, adjustRange.col).value(parseFloat(cellValue) + rowData.adjust1);
						}else{
							sheet.getCell(adjustRange.row, adjustRange.col).value(rowData.adjust1);
						}
					}
					// 调整数(贷)
					if ($('#adjustData_adjustP_credit').val() != null && $('#adjustData_adjustP_credit').val() != '') {
						var adjustRange = getRange(sheet, $('#adjustData_adjustP_credit').val() + row);
						var cellValue = sheet.getValue(adjustRange.row, adjustRange.col);
						if(cellValue != null && cellValue != ''){
							sheet.getCell(adjustRange.row, adjustRange.col).value(parseFloat(cellValue) + rowData.adjust2);
						}else{
							sheet.getCell(adjustRange.row, adjustRange.col).value(rowData.adjust2);
						}
					}
					// 调整数(索引)
					if ($('#adjustData_adjustP_index').val() != null && $('#adjustData_adjustP_index').val() != '') {
						var indexIdRange = getRange(sheet,$('#adjustData_adjustP_index').val() + row);
						var cellText = sheet.getValue(indexIdRange.row, indexIdRange.col);
						if(cellText != null && cellText != ''){
							var arrA, arrB;
							arrA = cellText.split(',');
							arrB = rowData.indexId.split(',');
							var arrR = distinct(arrA, arrB);
							sheet.getCell(indexIdRange.row, indexIdRange.col).value(arrR.join(','));
						}else{
							sheet.getCell(indexIdRange.row, indexIdRange.col).value(rowData.indexId);
						}
					}
				}else{
					extraData.push(rowData);
				}
			}
			return extraData;
		}

        function reSetHeadBody(sheet, elObject, subjectId) {
            var startRow = elObject.accountAgeItemRowIndex;
            var tmpVal = elObject.titleIndex;
            var rowCount = sheet.getRowCount();
            var ageType = elObject.ageType;
            var count = 6;
            if(ageType == '1'){
            	// 审定账龄
            	var headRange = getRange(sheet,elObject.accountAgeAdjustColumnIndex+tmpVal);
                //头部重置
    			for (var k = 0; k < count; k++) {
    				sheet.setValue(headRange.row, headRange.col + k, '');
    			}
    			//数据重置
    			for (var i = startRow; i <= rowCount; i++) {
    				var dataRange = getRange(sheet,elObject.accountAgeAdjustColumnIndex + i);
    				for (var j = 0; j < count; j++) {
    					sheet.setValue(dataRange.row, dataRange.col + j, '');
    				}
    			}
            }else{
                var headRange = getRange(sheet,elObject.accountAgeItemColumnIndex+tmpVal);
                //头部重置
    			for (var k = 1; k < count+1; k++) {
    				sheet.setValue(headRange.row, headRange.col + k, '');
    			}
    			//数据重置
    			for (var i = startRow; i <= rowCount; i++) {
    				var dataRange = getRange(sheet,elObject.accountAgeItemColumnIndex + i);
    				for (var j = 1; j < count; j++) {
    					sheet.setValue(dataRange.row, dataRange.col + j, '');
    				}
    			}
            }
		}
		function getSubjectNameRow(sheet, elObject) {
			var startRow = elObject.accountAgeItemRowIndex;
			var rowCount = sheet.getRowCount();
			var result = {};
			for (var i = startRow; i <= rowCount; i++) {
				// 单元格位置
				var itemNameRange = getRange(sheet, elObject.accoutAgeNameP + i);
				// 单元格内容
				var itemName = sheet.getCell(itemNameRange.row, itemNameRange.col).value();
				if (itemName == '') {
					continue;
				}
				result[itemName] = i;
			}
			return result;
		}

		function getSubjectNameRowForDetails(sheet, elObject) {
			var startRow = elObject.accountAgeItemRowIndex;
			var rowCount = sheet.getRowCount();
			var result = {};
			for (var i = startRow; i <= rowCount; i++) {
				// 单元格位置
				var itemNameRange = getRange(sheet, elObject.accoutAgeNameP + i);
				// 单元格内容
				var itemName = sheet.getCell(itemNameRange.row, itemNameRange.col).value()+''+sheet.getCell(itemNameRange.row, itemNameRange.col-2).value();
				if (itemName == '') {
					continue;
				}
				result[itemName] = i;
			}
			return result;
		}
        // 填充账龄头部数据
        function refreshAccountAgeHead(sheet, arr, subjectId, elObject) {
            var startRow = elObject.accountAgeItemRowIndex;
            var tmpVal = elObject.titleIndex;
            var ageType = elObject.ageType;
            if(ageType == '1'){
            	var headRange = getRange(sheet,elObject.accountAgeAdjustColumnIndex+tmpVal);
                for (var i = 1; i <= arr.length; i++) {
                	sheet.setValue(headRange.row, headRange.col + i - 1, arr[i-1]);
                }
            }else{
                var headRange = getRange(sheet,elObject.accountAgeItemColumnIndex+tmpVal);
                for (var i = 1; i <= arr.length; i++) {
                	sheet.setValue(headRange.row, headRange.col + i, arr[i-1]);
                }
            }
		}
        // 填充账龄数据
        function refreshAccountAgeData(sheet, rowData, count, arr, elObject, rowMap,isCount) {
            //var sheet = designer.Spread.getActiveSheet();
            /*var startRow = elObject.accountAgeItemRowIndex;
            var rowCount = sheet.getRowCount();*/
			//var subjectname = rowData.araName;
			//var rowIndex = rowMap[subjectname];
			var araId = rowData.subjectId;
			if(rowData.araId!=null){
				var araId = rowData.araId+rowData.subjectId;
			}else{
				// 债务人为空时，科目就是债务人
				araId = rowData.subjectId+rowData.subjectId;
			}

			if(isCount){
				if(rowData.araId!=null){
					araId = rowData.araId;
				}else{
					araId = rowData.subjectId;
				}
			}
            var rowIndex = rowMap[araId];
			if(rowIndex != undefined && rowIndex != null) {
				if(elObject.ageType == '1'){
					if (elObject.accountAgeAdjustColumnIndex != null && elObject.accountAgeAdjustColumnIndex != '') {
						//let t1 = new Date().getMilliseconds();
						var dataRange = getRange(sheet,elObject.accountAgeAdjustColumnIndex + rowIndex);
						//spread.suspendPaint();
						//let t2 = new Date().getMilliseconds();
						for (var j = 0; j < count - 1; j++) {
							//console.info(elObject.accountAgeItemColumnIndex,rowMap[subjectname]);
							var dataVal = null;
							switch (j) {
								case 0: dataVal = rowData.ara07;break;
								case 1: dataVal = rowData.ara08;break;
								case 2: dataVal = rowData.ara09;break;
								case 3: dataVal = rowData.ara10;break;
								case 4: dataVal = rowData.ara11;break;
								case 5: dataVal = rowData.ara12;break;
							}
							//let t3 = new Date().getMilliseconds();

							sheet.setValue(dataRange.row, dataRange.col + j, dataVal);

							//sheet.getCell(dataRange.row, dataRange.col + j).value(dataVal);
							//let t4 = new Date().getMilliseconds();
							//console.info("t1:", t1,"t2:",t2,"t3:", t3, "t4:", t4);
							//console.info("getRange:", t2-t1,"setValue:",t4-t3,"ALL Time:", t4-t1);
						}
						//sheet.resumePaint();
					}
				}else{
					if (elObject.accountAgeItemColumnIndex != null && elObject.accountAgeItemColumnIndex != '') {
						//let t1 = new Date().getMilliseconds();
						var dataRange = getRange(sheet,elObject.accountAgeItemColumnIndex + rowIndex);
						//spread.suspendPaint();
						//let t2 = new Date().getMilliseconds();
						var style = sheet.getStyle(dataRange.row, dataRange.col -1);
						style.foreColor = 'red';
						if(rowData.reason!=null && rowData.reason.indexOf("账龄计算总额与截止日期期末余额不一致")!=-1){
							sheet.setStyle(dataRange.row, dataRange.col -1, style);
						}else{
							sheet.setStyle(dataRange.row, dataRange.col -1, sheet.getStyle(dataRange.row, dataRange.col +1));
						}

						for (var j = 0; j < count; j++) {
							//console.info(elObject.accountAgeItemColumnIndex,rowMap[subjectname]);
							var dataVal = null;
							switch (j) {
								case 0: dataVal = rowData.reason;break;
								case 1: dataVal = rowData.ara01;break;
								case 2: dataVal = rowData.ara02;break;
								case 3: dataVal = rowData.ara03;break;
								case 4: dataVal = rowData.ara04;break;
								case 5: dataVal = rowData.ara05;break;
								case 6: dataVal = rowData.ara06;break;
							}
							//let t3 = new Date().getMilliseconds();

							sheet.setValue(dataRange.row, dataRange.col + j, dataVal);

							//sheet.getCell(dataRange.row, dataRange.col + j).value(dataVal);
							//let t4 = new Date().getMilliseconds();
							//console.info("t1:", t1,"t2:",t2,"t3:", t3, "t4:", t4);
							//console.info("getRange:", t2-t1,"setValue:",t4-t3,"ALL Time:", t4-t1);
						}
						//sheet.resumePaint();
					}
				}
			}
            /*for (var i = startRow; i <= rowCount; i++) {
                if (arr.indexOf(i) > -1) {
                    continue;
                }
                // 单元格位置
                var itemNameRange = getRange(elObject.accoutAgeNameP + i);
                // 单元格内容
                var itemName = sheet.getCell(itemNameRange.row, itemNameRange.col).text().trim();
                if(itemName == '') {
                    arr.push(i);
                    continue;
                }
                // 客户科目名称
                var subjectname = rowData.araName;
                // 匹配科目项列
                if (subjectname == itemName) {
                    arr.push(i);
                    //spread.suspendPaint();
                    if (elObject.accountAgeItemColumnIndex != null && elObject.accountAgeItemColumnIndex != '') {
                        for (var j = 0; j < count; j++) {
                            var dataRange = getRange(elObject.accountAgeItemColumnIndex + i);
                            var dataVal = null;
                            switch (j) {
                                case 0: dataVal = rowData.ara01;break;
                                case 1: dataVal = rowData.ara02;break;
                                case 2: dataVal = rowData.ara03;break;
                                case 3: dataVal = rowData.ara04;break;
                                case 4: dataVal = rowData.ara05;break;
                                case 5: dataVal = rowData.ara06;break;
                            }
                            sheet.getCell(dataRange.row, dataRange.col + j).value(dataVal);
                        }
                    }
                    //sheet.resumePaint();
                }
            }*/
        }
		function distinct(arrA, arrB) {
			let arr = arrA.concat(arrB);
			let result = [];
			let obj = {};
			for (let i of arr) {
				if (!obj[i]) {
					result.push(i);
					obj[i] = 1;
				}
			}
			return result;
		}
		// 根据单元格字符串获取行列
		function getRange(sheet, rangeStr) {
			//console.log(rangeStr);
			//var sheet = designer.Spread.getActiveSheet();
			return range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
		}
		$('#openFormulaModalBtn').click(e => {
			$('#formulaSubjectId').val(designer.userSubjectId);
			$('#formulaSubjectName').val(designer.userSubjectId + '-' + designer.userSubjectName);
			$('#formulaModal').modal('show');
		});
		$('#formulaModal').on('show.bs.modal', function() {
			$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
			BdoDataTable('tagsMainTable', tagsMainTable);
			$('#tagMainGroup').html('');
			$('#tagsMainTable tbody').on('click', 'td button', function() {
				let cellAlias = this.lastElementChild.value;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.deleteTag.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: cellAlias,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#tagsMainTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '删除标签成功！');
						}
					}
				});
			});
			$('#tagsMainTable tbody').on('click', 'td a', function() {
				let colIndex = $(this).parents('td').index();
				if (colIndex === 1) {
					let length = $('#tagMainGroup .col-sm-1 input').length;
					let txt;
					if (length > 0) {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div><div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					} else {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					}
					$('#tagMainGroup').append(txt);
					$('#tagMainGroup .col-sm-1 input')[length].value = $(this).text();
					$('#tagMainGroup .col-sm-1 input')[length].title = $(this).parent().next().text();
				}
			});
		});
		$('#uodoTagMainBtn').click((event) => {
			let length1 = $('#tagMainGroup .col-sm-1 input').length;
			if (length1 > 0) {
				$('#tagMainGroup .col-sm-1')[length1 * 2 - 2].remove();
			}
			let length2 = $('#tagMainGroup .col-sm-1 select').length;
			if (length2 > 0) {
				$('#tagMainGroup .col-sm-1')[length2 * 2 - 1].remove();
			}
		});
		$('#formulaTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: customerId,
					param3: projectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
							if(tagInfo.type == 'dg'){
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgGeneral.query.json',
									// async : false,
									data: {
										menuId: window.sys_menuId,
										sqlId: 'DG00078',
										param1: customerId,
										param2: projectId,
										param3: tagInfo.workpaperId,
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
											$.sessionStorage('dgFileNode', JSON.stringify(nodeData));
											$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
											window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
											$.sessionStorage('dgFileNode', null);
										}
									}
								});
							} else if(tagInfo.type == 'note'){
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgGeneral.query.json',
									// async: false,
									data: {
										menuId: window.sys_menuId,
										sqlId: 'DG00092',
										param1: tagInfo.noteAutoId,
										param2: customerId,
										param3: projectId,
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
											$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
											window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
										} else {
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							} else if(tagInfo.type == 'db'){
								var yyyy = tagInfo.whereParam.substr(tagInfo.whereParam.indexOf('yyyy') + 7, 4);
								var text = '该标签为试算平衡表"' + tagInfo.subjectName + '"的"' + yyyy;
								var field = tagInfo.field;
								if(field == 'unAuditAmount'){
									text += '年未审数';
								}else if(field == 'adjustAmount'){
									text += '年审计调整数';
								}else if(field == 'auditAmount'){
									text += '年审定数"';
								}
								swal(text);
							} else if(tagInfo.type == 'function'){
								var field = tagInfo.field;
								var yyyy = 0;
								if(field.indexOf('current') != -1){
									yyyy = parseInt(tagInfo.yyyy);
								} else {
									yyyy = parseInt(tagInfo.yyyy) - 1;
								}
								var text = '';
								if(field.indexOf('Before') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '未审数"';
								}else if(field.indexOf('Adjust') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '调整数"';
								}else if(field.indexOf('After') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '审定数"';
								}
								swal(text);
							} else if(tagInfo.type == 'report'){
								var text = '该标签为报表"' + tagInfo.colName + tagInfo.colCode + '"的"' + tagInfo.reportValDesc + '"';
								swal(text);
							} else if(tagInfo.type == 'auditReport'){
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgGeneral.query.json',
									// async : false,
									data: {
										menuId: window.sys_menuId,
										sqlId: 'DG00224',
										param1: customerId,
										param2: projectId,
										param3: tagInfo.workpaperId,
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
											nodeData.autoId = nodeData.extraOptions.workpaperId;
											nodeData.workpaperId = nodeData.extraOptions.workpaperId;
											nodeData.menuId = window.sys_menuId;
											$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
											$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
											window.open('/Faith/dgcenter.do?m=openQYXJFile&projectId=' + nodeData.extraOptions.projectId);
										}
									}
								});
							}
						}
					}
				}
			});
		});
		$('#formulaTable').on('click', 'button[name="editFormula"]', function() {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			$('#tagMainGroup').html('');
			var title = object.formulaText.split(/[\+\-\=]+/);
			var text = object.formula.split(/[\+\-\=]+/);
			var sign = object.formula.split(/[^\+\-\=]+/);
			var txt;
			for (var i = 0; i < text.length; i++) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + text[i] + '\" title=\"' + title[i] + '\" readonly=\"readonly\"></div></div>');
				$('#tagMainGroup').append(txt);
				if (i + 1 < sign.length - 1) {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div>');
					$('#tagMainGroup').append(txt);
					$('#tagMainGroup .col-sm-1 select')[i].value = sign[i + 1];
				}
			}
			$('#formulaType').val(object.formulaType);
			$('#formulaModal [data-toggle="tabs"] a:first').tab('show');
		});
		$('#formulaTable').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.delFormula.json',
					async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: object.autoId
					},
					dataType: 'json',
					success(data) {
						var referredAutoId;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00113',
								param1: customerId,
								param2: projectId,
								param3: 'DG',
								param4: workpaperId,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									if (data.data[0] != null) {
										referredAutoId = data.data[0].infoFormula;
									}
								}
							}
						});
						if (referredAutoId == '') {
							referredAutoId = '0';
						}
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00229',
								param1: customerId,
								param2: projectId,
								param3: referredAutoId,
								param4: $('#formulaTypeMain').val(),
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									if (data.data[0] != null) {
										$('#totalNumMain').html(data.data[0].totalNum);
										$('#rightNumMain').html(data.data[0].rightNum);
									}
								}
							}
						});
						formulaTable.localParam.urlparam.param3 = referredAutoId;
						$('#formulaTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', '成功删除校验公式！');
					}
				});
			});
		});
		$('#checkFormulaBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});

		function getTagValue(inputText) {
			let tagValue = 0;
			let tagId = inputText.replace('p', '');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagId,
					param2: customerId,
					param3: projectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						tagValue = data.data[0].tagValue;
					}
				}
			});
			return parseFloat(tagValue).toFixed(2);
		}

		$('#ensureBtn').click((event) => {
			let $tagMainGroupSelect = $('#tagMainGroup .col-sm-1 select');
			let $tagMainGroupInput = $('#tagMainGroup .col-sm-1 input');
			let length = $tagMainGroupSelect.length;
			if (length === 0) {
				bdoErrorBox('失败', '请正确设置公式！');
				$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
				return;
			}
			let formula = $tagMainGroupInput.val();
			let formulaText = $tagMainGroupInput.attr('title');

			let inputFirstValue = $('#tagMainGroup .col-sm-1 input')[0].value;
			let formulaValue = getTagValue(inputFirstValue);
			for (let i = 0; i < length; i++) {
				let inputValue = $('#tagMainGroup .col-sm-1 input')[i + 1].value;
				let selectValue = $tagMainGroupSelect[i].value;
				if (selectValue == '') {
					$tagMainGroupSelect[i].focus();
					bdoErrorBox('失败', '请选择运算符号！');
					return;
				}
				formula = formula + selectValue + inputValue;
				formulaText = formulaText + selectValue + $('#tagMainGroup .col-sm-1 input')[i + 1].title;

				let value = getTagValue(inputValue);
				formulaValue = formulaValue + selectValue + value;
			}
			if (formula.indexOf('=') === -1 || formula.indexOf('=') !== formula.lastIndexOf('=')) {
				bdoErrorBox('失败', '请正确设置公式！');
				return;
			}
			// 等式左边值
			let formulaValueLeft = formulaValue.substring(0, formulaValue.indexOf('='));
			// 取得具体数值数组
			let formulaValueListLeft = formulaValueLeft.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListLeft = formulaValueLeft.split(/[^\+\-]+/);
			let formulaCalcLeft = formulaValueListLeft[0] == '' ? 0 : formulaValueListLeft[0];
			let formulaValueLeftNew = formulaCalcLeft.toString();
			if (signListLeft.length > 1) {
				let startNumLeft = 1;
				if (signListLeft[0] == '-') {
					startNumLeft = 0;
				}
				for (let i = startNumLeft; i < signListLeft.length - 1; i++) {
					let signLeft = signListLeft[i];
					let signValueLeft = formulaValueListLeft[i + 1 - startNumLeft];
					if (signLeft === '+') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					} else if (signLeft === '-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '+-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '--') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					}
				}
			}
			// 等式右边值
			let formulaValueRight = formulaValue.substring(formulaValue.indexOf('=') + 1);
			// 取得具体数值数组
			let formulaValueListRight = formulaValueRight.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListRight = formulaValueRight.split(/[^\+\-]+/);
			let formulaCalcRight = formulaValueListRight[0] == '' ? 0 : formulaValueListRight[0];
			if (signListRight.length > 1) {
				let startNumRight = 1;
				if (signListRight[0] == '-') {
					startNumRight = 0;
				}
				for (let i = startNumRight; i < signListRight.length - 1; i++) {
					let signRight = signListRight[i];
					let signValueRight = formulaValueListRight[i + 1 - startNumRight];
					if (signRight === '+') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
					if (signRight === '-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '+-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '--') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
				}
			}
			// 等式左边等于等式右边 1:计算结果正确
			if (parseFloat(formulaCalcLeft).toFixed(2) == parseFloat(formulaCalcRight).toFixed(2)) {
				var formulaCal = '1';
			} else {
				var formulaCal = '0';
			}
			let formulaAutoId = formula.replace(/p/g,'');
			let tagAllId = formulaAutoId.replace(/=/g,',').replace(/\+/g,',').replace(/-/g,',');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.setProjectFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: formula.replace(/\+/g, '%2B'),
					param4: formulaText.replace(/\+/g, '%2B'),
					param5: formulaValue.replace(/\+/g, '%2B'),
					param6: formulaCal,
					param7: formulaAutoId.replace(/\+/g, '%2B'),
					param8: $('#formulaSubjectId').val(),
					param9: $('#formulaSubjectName').val(),
					param10: tagAllId,
					param11: $('#formulaType').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', '设置校验数据公式成功！');
						$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
						let $tagMainGroup = $('#tagMainGroup .col-sm-1');
						$tagMainGroup.remove();
					} else {
						bdoErrorBox('失败', '设置校验数据公式失败！');
					}
				}
			});
		});
		$('#tagDeleteModal').on('show.bs.modal', function() {
			var sheet = designer.Spread.getActiveSheet();
			var range = new GC.Spread.Sheets.Range(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			var tagPosition = workpaperId + ':' + sheet.name() + ':' + rangeStr;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00148',
					param1: customerId,
					param2: projectId,
					param3: 'dg',
					param4: tagPosition,
					param5: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data && data.success && data.data) {
						$('#referredFormualList').empty();
						for (var i = 0; i < data.data.length; i++) {
							// data.data[0].formulaText
							if (i != data.data.length - 1) {
								// <label class="css-input css-checkbox css-checkbox-primary control-label"><input type="checkbox" checked data-result="' + data.data[i].autoId + '"/></label>
								var $div = $('<label class="css-input css-checkbox css-checkbox-primary control-label"><input type="checkbox" name="referredFormual" checked data-result="' + data.data[i].autoId + '"/><span></span></label>&nbsp;<label>' + data.data[i].formulaText + '</label><br><br>');
								$('#referredFormualList').append($div);
							} else {
								var $div = $('<label class="css-input css-checkbox css-checkbox-primary control-label"><input type="checkbox" name="referredFormual" checked data-result="' + data.data[i].autoId + '"/><span></span></label>&nbsp;<label>' + data.data[i].formulaText + '</label>');
								$('#referredFormualList').append($div);
							}
						}
						if(data.data.length > 0){
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.Spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ':' + row + ':' + col;
							if (designer.ShowMutualIndexCacheMap.has(mapKey)) {
								designer.ShowMutualIndexCacheMap.delete(mapKey);
								spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								activeCell.cellType(void 0);
								activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.right);
								spread.resumePaint();
							}
						}
					}
				}
			});
		});
		$('#confirmBtn').click((event) => {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			var tagPosition = workpaperId + ':' + sheet.name() + ':' + rangeStr;
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			if (designer.ShowMutualIndexCacheMap.has(mapKey)) {
				designer.ShowMutualIndexCacheMap.delete(mapKey);
				spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				activeCell.cellType(void 0);
				activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.right);
				spread.resumePaint();
			}
			var param = {};
			param = getDgParam(param);
			if(typeof(param) == "undefined"){
				bdoErrorBox('保存失败', "请再保存一次！");
				return;
			}
			var length = $('input[name="referredFormual"]:checked').length;
			var delStr = '';
			for (var i = 0; i < length; i++) {
				delStr = delStr + ',' + $('input[name="referredFormual"]').eq(i).attr('data-result');
			}
			if (length > 0) {
				delStr = delStr.substring(1);
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.deleteMutualIndex.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
					param4: param.customizeStyle,
					param5: delStr,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#tagDeleteModal').modal('hide');
						bdoSuccessBox('成功', '删除成功！');
					}
				}
			});
		});
		$('button[name="retractDivBtn"]').on('click', event => {
			var text = $(event.currentTarget).html();
			if(text == '展开'){
				$(event.currentTarget).parent().prevAll().show();
				$(event.currentTarget).html('收起');
			}else{
				var length = $(event.currentTarget).parent().prevAll().length;
				for(var i = 0;i < length - 1;i++){
					$(event.currentTarget).parent().prevAll().eq(i).hide();
				}
				$(event.currentTarget).html('展开');
			}
		});
		$('#accountsToCollectSureBtn').click(function() {
			// 应收账款明细表--生成应收账款账龄分析表
			// 应收账款明细表--生成应收账款坏账准备
			// 其他应收款明细表--生成其他应收款坏账准备
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			
			$('#titleRow_accountsToCollect').parent().parent().css({'border': '0px'});
			$('#detailRow_accountsToCollect').parent().parent().css({'border': '0px'});
			$('#startCol_accountsToCollect').parent().parent().css({'border': '0px'});
			var flag = true;
			var errorText = '';
			
			var pattern1 = /^[0-9]{1,}$/;
			var titleRow = $('#titleRow_accountsToCollect').val();
			if (flag && (titleRow == '' || !pattern1.test(titleRow))) {
				$('#titleRow_accountsToCollect').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '账龄表头行';
			}
			var detailRow = $('#detailRow_accountsToCollect').val();
			if (flag && (detailRow == '' || !pattern1.test(detailRow))) {
				$('#detailRow_accountsToCollect').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '账龄数值行';
			}
			
			var pattern2 = /^[A-Z]{1,3}$/;
			var startColP = $('#startCol_accountsToCollect').val();
			if (flag && (startColP == '' || !pattern2.test(startColP))) {
				$('#startCol_accountsToCollect').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '账龄开始列';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
				return;
			}
			bdoInProcessingBox('生成中...');
			$.ajax({
				url: 'dgCenter/DgPaper.createOtherDg.json',
				// async: false,
				type: 'post',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: $('#otherRedirectId_accountsToCollect').val(),
					param4: designer.workpaperId,
					param5: designer.Spread.getActiveSheetIndex(),
					param6: designer.Spread.getActiveSheet().name(),
					param7: $('#titleRow_accountsToCollect').val(),
					param8: $('#detailRow_accountsToCollect').val(),
					param9: $('#startCol_accountsToCollect').val()
				},
				success(data) {
					if(data.success){
						(function(){
							$.ajax({
								type : 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data : {
									menuId: window.sys_menuId,
									sqlId: 'DG00067',
									param1: customerId,
									param2: projectId,
									start: -1,
									limit: -1
								},
								dataType : 'json',
								success(data) {
									if(data.success) {
										designer.paperArr = data.data;
									}
								}
							});
						})();
						openOtherDg(data.data[0].workpaperId);
						$('#accountsToCollectParamModal').modal('hide');
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$('#statement_balanceP').val('O');
		$('#statement_subjectIdP').val('B');
		$('#statement_assItemIdP').val('D');
		$('#statement_itemRow_index').val(4);
		// 获取银行对账单余额对话框
		var statement_balance_show = function () {
			var name = context.Spread.getActiveSheet().name();
			if(name != '银行存款明细余额表'){
				bdoInfoBox('提示', '请在"银行存款明细余额表"工作表使用！');
			}else{
				$('#modal_statement_balance').modal('show');
			}
		};
		// 获取银行对账单余额
		$('#modal_statement_sure').click(function() {
			var flag = checkStatementColumn();
			if (!flag) {
				return;
			}
			//获取数据
			var itemRow = parseInt($('#statement_itemRow_index').val());
			var statement_subjectIdP = $('#statement_subjectIdP').val();
			var statement_assItemIdP = $('#statement_assItemIdP').val();
			var sheet = designer.Spread.getActiveSheet();
			var param = {
				startRowIndex: itemRow,
				subjectIdP: $('#statement_subjectIdP').val(),
				assItemIdP: $('#statement_assItemIdP').val(),
				balanceP: $('#statement_balanceP').val()
			};
			var jsonParam = getStatementBankInfo(sheet, param);
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'dgCenter/DgPaper.queryStatementBalance.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					jsonData: JSON.stringify(jsonParam)
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var balanceData = data.data;
						if (balanceData.length > 0) {
							var sheet = designer.Spread.getActiveSheet();
							designer.Spread.suspendPaint();
							designer.Spread.suspendCalcService();

							var rowMap = null;
							rowMap = getStatementRowForDetails(sheet, param);

							let cnt = 0;
							for (var arrayData of balanceData) {
								refreshStatementBalanceData(sheet, arrayData, param, rowMap);
							}
							designer.Spread.resumeCalcService();
							designer.Spread.resumePaint();
						}
						bdoSuccessBox('成功', '获取成功！');
						$('#modal_statement_balance').modal('hide');
					}else{
						bdoErrorBox('失败', '获取失败');
					}
				}
			});
		});
		// 获取银行数据
		function getStatementBankInfo(sheet, elObject) {
			var startRow = elObject.startRowIndex;
			var rowCount = sheet.getRowCount();
			var result = [];
			for (var i = startRow; i <= rowCount; i++) {
				// 单元格位置
				var subjectIdRange = getRange(sheet, elObject.subjectIdP + i);
				var assItemIdRange = getRange(sheet, elObject.assItemIdP + i);
				// 单元格内容
				var subject = sheet.getCell(subjectIdRange.row, subjectIdRange.col).value()
				var assItem = sheet.getCell(assItemIdRange.row, assItemIdRange.col).value();
				if ((subject == '' || subject == null) && (assItem == '' || assItem == null)) {
					continue;
				}
				var tempData = {subjectId:subject,assItemId:assItem};
				result.push(tempData);
			}
			return result;
		}
		// 获取数据行列
		function getStatementRowForDetails(sheet, elObject) {
			var startRow = elObject.startRowIndex;
			var rowCount = sheet.getRowCount();
			var result = {};
			for (var i = startRow; i <= rowCount; i++) {
				// 单元格位置
				var subjectIdRange = getRange(sheet, elObject.subjectIdP + i);
				var assItemIdRange = getRange(sheet, elObject.assItemIdP + i);
				// 单元格内容
				var itemName = sheet.getCell(subjectIdRange.row, subjectIdRange.col).value()+'-'+sheet.getCell(assItemIdRange.row, assItemIdRange.col).value();
				if (itemName == '') {
					continue;
				}
				result[itemName] = i;
			}
			return result;
		}
		// 检查列数据是否填写正确
		function checkStatementColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#statement_balanceP').parent().parent().css({'border': '0px'});
			$('#statement_subjectIdP').parent().parent().css({'border': '0px'});
			$('#statement_assItemIdP').parent().parent().css({'border': '0px'});
			$('#statement_itemRow_index').parent().parent().css({'border': '0px'});
			var flag = true;
			var pattern = /^[A-Z]{1,2}$/;
			var errorText = '';
			if ($('#statement_balanceP').val() == '' || !pattern.test($('#statement_balanceP').val())) {
				$('#statement_balanceP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '对账单余额列';
			}
			if ($('#statement_subjectIdP').val() == '' || !pattern.test($('#statement_subjectIdP').val())) {
				$('#statement_subjectIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '开户银行编号列';
			}
			if ($('#statement_assItemIdP').val() == '' || !pattern.test($('#statement_assItemIdP').val())) {
				$('#statement_assItemIdP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '辅助核算编号列';
			}
			var itemRow = $('#statement_itemRow_index').val();
			var pattern1 = /^[0-9]{1,}$/;
			if (itemRow == '' || !pattern1.test(itemRow)) {
				$('#statement_itemRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '数据开始行';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
		// 填充余额数据
		function refreshStatementBalanceData(sheet, rowData, elObject, rowMap) {
			var araId = rowData.subjectId+'-'+rowData.assItemId;
			var rowIndex = rowMap[araId];
			if(rowIndex != '' && rowIndex != null && rowData.balance != '' && rowData.balance != null) {
				if (elObject.balanceP != null && elObject.balanceP != '') {
					var dataRange = getRange(sheet,elObject.balanceP + rowIndex);
					sheet.setValue(dataRange.row, dataRange.col, rowData.balance);
				}
			}
		}
		//关闭获取银行对账单余额页面
		$('#modal_statement_balance_cancel').click(function() {
			$('#modal_statement_balance').modal('hide');
		});
		$('#correspondence_amount_bankAccountP').val('B');
		$('#correspondence_amount_requestAmountP').val('H');
		$('#correspondence_amount_requestAmountCnyP').val('I');
		$('#correspondence_amount_confirmationNumberP').val('J');
		$('#correspondence_amount_replyAmountP').val('K');
		$('#correspondence_amount_replyAmountCnyP').val('L');
		$('#correspondence_amount_itemRow_index').val(4);
		// 获取函证金额
		$('#modal_correspondence_amount_sure').click(function() {
			var flag = checkCorrespondenceAmountColumn();
			if (!flag) {
				return;
			}
			//获取数据
			var itemRow = parseInt($('#correspondence_amount_itemRow_index').val());
			var sheet = designer.Spread.getActiveSheet();
			var param = {
				startRowIndex: itemRow,
				bankAccountP: $('#correspondence_amount_bankAccountP').val(),
				requestAmountP: $('#correspondence_amount_requestAmountP').val(),
				requestAmountCnyP: $('#correspondence_amount_requestAmountCnyP').val(),
				confirmationNumberP: $('#correspondence_amount_confirmationNumberP').val(),
				replyAmountP: $('#correspondence_amount_replyAmountP').val(),
				replyAmountCnyP: $('#correspondence_amount_replyAmountCnyP').val()
			};
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'dgCenter/DgFunctions.browseBankResultDetail.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: designer.workpaperId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var balanceData = data.data;
						if (balanceData.length > 0) {
							var sheet = designer.Spread.getActiveSheet();
							designer.Spread.suspendPaint();
							designer.Spread.suspendCalcService();

							var rowMap = null;
							rowMap = getCorrespondenceAmountRowForDetails(sheet, param);

							let cnt = 0;
							for (var arrayData of balanceData) {
								refreshCorrespondenceAmountData(sheet, arrayData, param, rowMap);
							}
							designer.Spread.resumeCalcService();
							designer.Spread.resumePaint();
						}
						bdoSuccessBox('成功', '获取成功！');
						$('#modal_correspondence_amount').modal('hide');
					}else{
						bdoErrorBox('失败', '获取失败');
					}
				}
			});
		});
		// 获取数据行列
		function getCorrespondenceAmountRowForDetails(sheet, elObject) {
			var startRow = elObject.startRowIndex;
			var rowCount = sheet.getRowCount();
			var result = {};
			for (var i = startRow; i <= rowCount; i++) {
				// 单元格位置
				var bankAccountRange = getRange(sheet, elObject.bankAccountP + i);
				// 单元格内容
				var bankAccount = sheet.getCell(bankAccountRange.row, bankAccountRange.col).value();
				if (bankAccount == '') {
					continue;
				}
				result[bankAccount] = i;
			}
			return result;
		}
		// 检查列数据是否填写正确
		function checkCorrespondenceAmountColumn() {
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			if(sheetIndex == 0){
				bdoErrorBox('失败', '请选择除封面页之外的sheet页!');
				return false;
			}
			$('#correspondence_amount_bankAccountP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_requestAmountP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_requestAmountCnyP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_confirmationNumberP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_replyAmountP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_replyAmountCnyP').parent().parent().css({'border': '0px'});
			$('#correspondence_amount_itemRow_index').parent().parent().css({'border': '0px'});
			var flag = true;
			var pattern = /^[A-Z]{1,2}$/;
			var errorText = '';
			if ($('#correspondence_amount_bankAccountP').val() == '' || !pattern.test($('#correspondence_amount_bankAccountP').val())) {
				$('#correspondence_amount_bankAccountP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '银行账号列';
			}
			if ($('#correspondence_amount_requestAmountP').val() == '' || !pattern.test($('#correspondence_amount_requestAmountP').val())) {
				$('#correspondence_amount_requestAmountP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '发函金额原币列';
			}
			if ($('#correspondence_amount_requestAmountCnyP').val() == '' || !pattern.test($('#correspondence_amount_requestAmountCnyP').val())) {
				$('#correspondence_amount_requestAmountCnyP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '发函金额折合人民币列';
			}
			if ($('#correspondence_amount_confirmationNumberP').val() == '' || !pattern.test($('#correspondence_amount_confirmationNumberP').val())) {
				$('#correspondence_amount_confirmationNumberP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '函证编号列';
			}
			if ($('#correspondence_amount_replyAmountP').val() == '' || !pattern.test($('#correspondence_amount_replyAmountP').val())) {
				$('#correspondence_amount_replyAmountP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '可确认金额原币列';
			}
			if ($('#correspondence_amount_replyAmountCnyP').val() == '' || !pattern.test($('#correspondence_amount_replyAmountCnyP').val())) {
				$('#correspondence_amount_replyAmountCnyP').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '可确认金额折合人民币列';
			}
			var itemRow = $('#correspondence_amount_itemRow_index').val();
			var pattern1 = /^[0-9]{1,}$/;
			if (itemRow == '' || !pattern1.test(itemRow)) {
				$('#correspondence_amount_itemRow_index').parent().parent().css({'border': '1px dashed red'});
				flag = false;
				errorText = '数据开始行';
			}
			if (!flag) {
				bdoErrorBox('失败', '请正确输入' + errorText + '!');
			}
			return flag;
		}
		// 填充余额数据
		function refreshCorrespondenceAmountData(sheet, rowData, elObject, rowMap) {
			var araId = rowData.bankAccount;
			var rowIndex = rowMap[araId];
			if(rowIndex != '' && rowIndex != null) {
				var requestAmountRange = getRange(sheet,elObject.requestAmountP + rowIndex);
				var requestAmountCnyRange = getRange(sheet,elObject.requestAmountCnyP + rowIndex);
				var confirmationNumberRange = getRange(sheet,elObject.confirmationNumberP + rowIndex);
				var replyAmountRange = getRange(sheet,elObject.replyAmountP + rowIndex);
				var replyAmountCnyRange = getRange(sheet,elObject.replyAmountCnyP + rowIndex);
				sheet.setValue(requestAmountRange.row, requestAmountRange.col, rowData.requestAmount);
				sheet.setValue(requestAmountCnyRange.row, requestAmountCnyRange.col, rowData.requestAmountCny);
				sheet.setValue(confirmationNumberRange.row, confirmationNumberRange.col, rowData.confirmationNumber);
				sheet.setValue(replyAmountRange.row, replyAmountRange.col, rowData.replyAmount);
				sheet.setValue(replyAmountCnyRange.row, replyAmountCnyRange.col, rowData.replyAmountCny);
			}
		}
		//关闭获取银行对账单余额页面
		$('#modal_correspondence_amount_cancel').click(function() {
			$('#modal_correspondence_amount').modal('hide');
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		//setHeight();
		listener();
		$('#adjustData_type option[value="1"]').attr('data-result', window.CUR_PROJECT_ACC_YEAR);
		$('#adjustData_type option[value="2"]').attr('data-result', parseInt(CUR_PROJECT_ACC_YEAR) - 1);
		transition(() => {
			bdoInProcessingBox('加载中...');
			getExcelData({
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: workpaperId,
				param2: customerId
			});
			$('#fileFullPath').text(fullPath);
		});
		
		OneUI.initHelper('slimscroll');

		batchUploadWPAttachForm = createForm(batchUploadWPAttachFormCfg); // 底稿附件批量上传

		ready();
	};

	// 底稿附件批量上传对话框配置
	batchUploadWPAttachFormCfg = {
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

							let files = data.data;
							let objMatch = {};
							for (let i = 0, oFile; i < files.length; i++) {
								oFile = files[i];
								objMatch[i + ''] = {
									dgId: workpaperId,
									attachName: oFile.name,
									attachPath: oFile.path,
									dgName: '',
								};
							}
							let jsonStr = JSON.stringify(objMatch);

							jsonStr.length > 2 && $.ajax({
								type: 'post',
								url: 'dgCenter/BatchUploadDgAttach.saveMatchedDgAttachFiles.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: customerId,
									param2: projectId,
									param3: jsonStr
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										$('#dgPageAttachTable').DataTable().ajax.reload();
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

	/**
	 * 过渡效果
	 */
	transition = callback => {
		$('.progress-mark').trigger('toggle-progress', 'show');
		var timer;
		var doIt = () => {
			timer && clearTimeout(timer);
			callback && callback();
			$('.progress-mark').trigger('toggle-progress', 'hide');
		};
		timer = setTimeout(doIt, 500);
	};
	/**
	 * 设置高度
	 */
	getHeight = () => {
		var icon = $('#fullscreenBtn').find('i');
		var fullscreenFlg = icon.hasClass('si-size-actual');
		if (fullscreenFlg) {
			return height + 85;
		} else {
			return height + 25;
		}
	};

	/**
	 * 保存文件（server）
	 */
	saveExcelServer = (param, fileData) => {
		var formData = new FormData();
		$.each(param, (key, val) => {
			formData.append(key, val);
		});
		formData.append('file', fileData);
		$.ajax({
			url: 'dgCenter/DgWapper.uploadFile.json',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					storage.removeItem(storageId);
					storage.removeItem(storageStatus);
					storage.removeItem(storageTime);
					/*getExcelData({
						menuId: window.sys_menuId,
						param1: workpaperId,
						param2: customerId
					});*/
					// 公式校验
					$.ajax({
						url: 'dgCenter/DgWapper.checkDgFormula.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: customerId,
							param2: projectId,
							param3: 'DG',
							param4: workpaperId
						},
						dataType: 'json',
						success(data) {
							if (!data.success) {
								swal({
									title: '错误',
									html: data.resultInfo.statusText,
									type: 'error',
									showCancelButton: true,
									confirmButtonText: '查看',
									cancelButtonText: '取消',
									allowOutsideClick: false,
									allowEscapeKey: false
								}).then((isConfirm) => {
									$('#formulaModal').modal('show');
									$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
									$('#formulaTable').DataTable().ajax.reload();
								}).catch(swal.noop);
							}else{
								bdoSuccessBox('成功');
							}
						}
					});
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	/**
	 * 转base64 成文件格式
	 */
	dataURLtoFile = (dataString, filename) => {
		var dl = dataString.indexOf('base64,') + 'base64,'.length;
		if (dl > 'base64,'.length) {
			dataString = dataString.substring(dl);
		}
		var mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			bstr = atob(dataString),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime,
			name: filename
		});
	};

	/**
	 * 转成文件 base64 格式
	 */
	blobToDataURL = (blob, callback) => {
		var a = new FileReader();
		a.onload = e => {
			callback(e.target.result);
		};
		a.readAsDataURL(blob);
	};

	/**
	 * 获取文件
	 */
	getExcelData = (param) => {
		spread = designer.Spread;
		var fileData = getFileFromStorage(storageId);
		if (fileData == null) {
			$.ajax({
				url: 'dgCenter/DgMain.getWorkpaper.json',
				type: 'POST',
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						var time = data.data[0].time;
						if (storage.length > 200) {
							storage.removeItem(storage.key(2));
							storage.removeItem(storage.key(1));
							storage.removeItem(storage.key(0));
						}
						storage.setItem(storageTime, time);
						var excel = data.data[0].excelBase64Data;
						var file = dataURLtoFile(excel, param.param1);
						blobToDataURL(file, data => {
							storage.setItem(storageId, data);
							storage.setItem(storageStatus, 'server');
						});
						excelIo.open(file, json => {
							var workbookObj = json;
							workbookObj = updateUsedRange(json);
							spread.fromJSON(workbookObj);
							spread.setActiveSheetIndex(0);
							for (var i = 0; i < spread.getSheetCount(); i++) {
								if(spread.getSheet(i).getColumnCount() < 20){
									spread.getSheet(i).setColumnCount(20);
								}else{
									spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
								}
								spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
							}
							getCustomizeStyle(true);
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		} else {
			$.ajax({
				url: 'dgCenter/DgMain.getWorkpaper.json',
				type: 'POST',
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.success) {
							var time = data.data[0].time;
							var timeServer = parseInt(storage.getItem(storageTime));
							if (time != timeServer) {
								bdoConfirmBox('提示', '是否将服务器文件覆盖当前浏览器缓存文件？', (isConfirm) => {
									bdoInProcessingBox('加载中...');
									if (storage.length > 200) {
										storage.removeItem(storage.key(2));
										storage.removeItem(storage.key(1));
										storage.removeItem(storage.key(0));
									}
									storage.setItem(storageTime, time);
									var excel = data.data[0].excelBase64Data;
									var file = dataURLtoFile(excel, param.param1);
									blobToDataURL(file, data => {
										storage.setItem(storageId, data);
										storage.setItem(storageStatus, 'server');
									});
									excelIo.open(file, json => {
										var workbookObj = json;
										workbookObj = updateUsedRange(json);
										spread.fromJSON(workbookObj);
										spread.setActiveSheetIndex(0);
										for (var i = 0; i < spread.getSheetCount(); i++) {
											if(spread.getSheet(i).getColumnCount() < 20){
												spread.getSheet(i).setColumnCount(20);
											}else{
												spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
											}
											spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
										}
										getCustomizeStyle(true);
									}, e => {
										bdoErrorBox('失败', e.errorMessage);
									});
								}, () => {
									var file = dataURLtoFile(fileData, fileName);
									var status = storage.getItem(storageStatus);
									excelIo.open(file, json => {
										var workbookObj = json;
										workbookObj = updateUsedRange(json);
										spread.fromJSON(workbookObj);
										spread.setActiveSheetIndex(0);
										for (var i = 0; i < spread.getSheetCount(); i++) {
											if(spread.getSheet(i).getColumnCount() < 20){
												spread.getSheet(i).setColumnCount(20);
											}else{
												spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
											}
											spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
										}
										getCustomizeStyle(true);
										if (status == 'local') {
											swal({
												title: '提示',
												text: '该文件上次编辑后未保存到服务器！',
												type: 'warning',
												showConfirmButton: false,
												allowOutsideClick: true,
												timer: 2000
											}).catch(swal.noop);
										}
									}, e => {
										bdoErrorBox('失败', e.errorMessage);
									});
								});
							}else{
								var file = dataURLtoFile(fileData, fileName);
								var status = storage.getItem(storageStatus);
								excelIo.open(file, json => {
									var workbookObj = json;
									workbookObj = updateUsedRange(json);
									spread.fromJSON(workbookObj);
									spread.setActiveSheetIndex(0);
									for (var i = 0; i < spread.getSheetCount(); i++) {
										if(spread.getSheet(i).getColumnCount() < 20){
											spread.getSheet(i).setColumnCount(20);
										}else{
											spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
										}
										spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
									}
									getCustomizeStyle(true);
									if (status == 'local') {
										swal({
											title: '提示',
											text: '该文件上次编辑后未保存到服务器！',
											type: 'warning',
											showConfirmButton: false,
											allowOutsideClick: true,
											timer: 2000
										}).catch(swal.noop);
									}
								}, e => {
									bdoErrorBox('失败', e.errorMessage);
								});
							}
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			});
		}
	};

	/**
	 * 保存文件
	 */
	saveExcel = (json) => {
		if (!currentNode) {
			return;
		}
		
		excelIo.save(json, blob => {
			var param = {};
			param.fileName = fileName;
			param.workpaperId = workpaperId;
			param.customerId = customerId;
			param.projectId = projectId;
			param.auditConclusion = spread.getSheetFromName('封面').getCell(10, 2).text();
			param = getDgParam(param);
			if(typeof(param) == "undefined"){
				bdoErrorBox('保存失败', "请再保存一次！");
				return;
			}
			param.tagChanged = JSON.stringify(designer.tagChanged);
			designer.tagChanged = [];
			saveExcelServer(param, blob);
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'server');
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	/**
	 * 导出文件
	 */
	exportExcel = () => {
		if (!currentNode) {
			return;
		}
		var json = spread.toJSON();
		excelIo.save(json, blob => {
			saveAs(blob, fileName);
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	/**
	 * 保存文件到本地缓存
	 */
	saveFileInStorage = (json) => {
		if (!currentNode) {
			return;
		}
		excelIo.save(json, blob => {
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'local');
				bdoSuccessBox('成功');
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	/**
	 * 从缓存中取文件
	 */
	getFileFromStorage = (storageId) => {
		var fileString = storage.getItem(storageId);
		if (!fileString) return null;
		return fileString.replace('data:application/zip;base64,', '');
	};

	/**
	 * 关闭画面前事件
	 */
	beforClose = () => {
		if (currentNode && currentNode.type == 'FILE') {
			var icon = $('#fullscreenBtn').find('i');
			var fullscreenFlg = icon.hasClass('si-size-actual');
			if (fullscreenFlg) {
				$('#ss').height((height + 40) + 'px');
			} else {
				$('#ss').height((height - 20) + 'px');
			}
			bdoConfirmBox('提示', '是否保存当前文件？', (isConfirm) => {
				var timer = setTimeout(() => {
					clearTimeout(timer);
					transition(() => {
						var json_ = spread.toJSON();
						excelIo.save(json_, blob_ => {
							saveExcel(json_);
							getExcelData({
								menuId: window.sys_menuId,
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: workpaperId,
								param2: customerId
							});
							$('#fileFullPath').text(fullPath);
						}, e => {
						});
					});
				}, 0);
			}, () => {
				var timer = setTimeout(() => {
					clearTimeout(timer);
					transition(() => {
						getExcelData({
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: workpaperId,
							param2: customerId
						});
						$('#fileFullPath').text(fullPath);
					});
				}, 0);
			});
		}
	};

	//转金额格式
	function getMn(num) {
		var num = num.toFixed(2);
		var int = num.split('.')[0];
		var float = num.split('.')[1];
		var _number = int.toString();        // 数字转成字符串
		var result = '';            // 转换后的字符串
		var counter = '';
		for (var i = _number.length - 1; i >= 0; i--) {
			counter++;
			result = _number.charAt(i) + result;
			if (!(counter % 3) && i != 0) {
				result = ',' + result;
			}
		}
		if (result[0] == ',') {
			result = result.replace(',', '');
		}
		if (int < 0) {
			if (result[1] == ',') {
				result = result.replace(',', '');
			}
		}
		return result + '.' + float;
	}
	//转数字
	function getNum(str) {
		if(str){
			var reg = new RegExp(',', 'g');//g,表示全部替换
			str = str.replace(reg, '');
		}
		return str;
	}
	
	String.prototype.endWith = function(str){
		if(str==null || str=="" || this.length == 0 ||str.length > this.length){
			return false;
		}
		if(this.substring(this.length - str.length)==str){
			return true;
		}else{
			return false;
		}
		return true;
	}
	
	mount();
};