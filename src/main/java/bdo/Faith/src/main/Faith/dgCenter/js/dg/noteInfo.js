/**
 * 在线附注
 */
var NoteInfoPage = (agrs) => {
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
		, autoId
		, storageId
		, storageStatus
		, storageTime
		, fileName
		, fullPath
		, customerId
		, projectId
		, fullName
		, designer;
	
	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/html/dg/noteInfo.html');
	agrs.template = _template;

	autoId = _data.extraOptions.autoId;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	storageId = 'BDONOTE' + autoId;
	storageStatus = 'BDONOTE' + autoId + 'Status';
	storageTime = 'BDONOTE' + autoId + 'Time';
	fileName = _data.extraOptions.fileName;
	fullName = _data.extraOptions.fullPath;

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
	// 上期附注Table
	var lastNoteTable;
	// 其他文件Table
	var otherTable;
	// 标签Table
	var tagsMainTable;
	// 标签Table
	var tagTable;
	// 公式Table
	var formulaTable;
	// 核对公式Table
	var verifyTable;
	function loadTable(){
		dgTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00112',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
		lastNoteTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00220',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
		tagsMainTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00083',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param4: '',
						param6: '',
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
					width: '100px',
					render: function(data, type, row, meta) {
						// let renderStr = '<a href=\"#\">' + data + '</a>';
						let renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
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
		tagTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00082',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param4: designer.notePaperId,
						param5: 'note',
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
				scrollY: '295px',
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
					title: '标签名',
					name: 'tagName',
					data: 'tagName',
					width: '100px',
					render: function(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + data + '</a>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					title: '标签位置',
					name: 'tagPosition',
					data: 'tagPosition',
					width: '100px',
					render: function(data, type, row, meta) {
						// let renderStr = '<a href=\"#\">' + data + '</a>';
						let renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 3,
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
					targets: 4,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-warning \" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						return renderStr;
					}
				}, {
					targets: 5,
					name: 'tagDgId',
					data: 'tagDgId',
					visible: false
				}, {
					targets: 6,
					name: 'tagInfo',
					data: 'tagInfo',
					visible: false
				}, {
					targets: 7,
					name: 'autoId',
					data: 'autoId',
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
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: '',
						param5: 0,
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
				scrollY: '255px',
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
		verifyTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00368',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: 'NOTE',
						param4: autoId,
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
				scrollY: '355px',
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
					targets: 2,
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
					targets: 3,
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
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式核对结果',
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
					targets: 5,
					orderable: true,
					title: '公式核对备注',
					name: 'checkRemark',
					data: 'checkRemark',
					width: '120px'
				}, {
					targets: 6,
					orderable: true,
					title: '核对时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 7,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'operate',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class="btn btn-xs btn-success" name="editRemark" type="button" title="填写备注"><i class="fa fa-edit"></i></button>';
						return renderStr;
					}
				}]
			}
		};
	}

	var needSuspend;
	var tipWidth = 600;

	function setCustomizeStyle(data) {
		if (data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '')) {
			// 交叉索引
			designer.setShowMutualIndexCacheMap(JSON.parse(data.data[0].customizeStyle).ShowMutualIndexCacheMap);
		}
		// 设置活动单元格
		if ($.sessionStorage('cellLinkFormula') != null || $.sessionStorage('cellLinkFormulaBySheetName') != null) {
			designer.setCellLink();
		}
	}

	function getCustomizeStyle() {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00133',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: autoId
			},
			dataType: 'json',
			success: setCustomizeStyle
		});
	}

	function setNoteDgValueInfo(data) {
		let noteDgValueInfo = data.data[0].noteDgValueInfo;
		if (data.data && data.data[0] && (noteDgValueInfo && noteDgValueInfo != '' && noteDgValueInfo != '{}' && JSON.parse(noteDgValueInfo).NoteCacheMap && JSON.parse(noteDgValueInfo).NoteCacheMap !== '{}')) {
			// 附注底稿取值
			if (JSON.parse(noteDgValueInfo).NoteCacheMap.constructor == String) {
				designer.setNoteCacheMap(JSON.parse(JSON.parse(noteDgValueInfo).NoteCacheMap));
			} else {
				designer.setNoteCacheMap(JSON.parse(noteDgValueInfo).NoteCacheMap);
			}
		}
		bdoSuccessBox('加载完成', data.resultInfo.statusText);
	}

	function getNoteDgValueInfo() {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00094',
				param1: autoId,
				param2: customerId,
				param3: projectId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: setNoteDgValueInfo
		});
	}

	function setNoteLinkTableData(noteDgValueInfo) {
		var dataSet = [];
		if (noteDgValueInfo != null && noteDgValueInfo != '{}') {
			let mapJson = JSON.parse(noteDgValueInfo).NoteCacheMap;
			// 附注底稿取值
			for (let k of Object.keys(mapJson)) {
				let noteLinkInfo = mapJson[k][0];

				let sheetIndex = parseInt(k.substring(0, k.indexOf(':')));
				let row = parseInt(k.substring(k.indexOf(':') + 1, k.lastIndexOf(':')));
				let col = parseInt(k.substring(k.lastIndexOf(':') + 1));
				let range = new GC.Spread.Sheets.Range(row, col, 1, 1);
				let rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
				let sheetName = designer.Spread.getSheet(sheetIndex).name();

				let linkText = noteLinkInfo.dgSheetName + ' -- ' + noteLinkInfo.dgRangeStart + ':' + noteLinkInfo.dgRangeEnd;
				let displayText = noteLinkInfo.dgFileInputVal;
				let paramStr = sheetIndex + ':' + row + ':' + col + ':' + noteLinkInfo.dgFileId + ':' + noteLinkInfo.dgSheetName + ':' + noteLinkInfo.dgRangeStart + ':' + noteLinkInfo.dgRangeEnd;

				dataSet.push(['', sheetName + ':' + rangeStr, displayText, linkText, paramStr]);
			}
		}
		$('#noteLinkTable').dataTable({
			'data': dataSet,
			'pageLength': 20,
			'ordering': false,
			'scrollX': true,
			'scrollY': '275px',
			'columns': [
				{
					'title': '序号', 'class': 'text-center', 'width': '40px', 'render': function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					'title': '所在附注位置', 'width': '180px', 'render': function(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + data + '</a>';
						return renderStr;
					}
				},
				{'title': '取值底稿名', 'width': '180px'},
				{'title': '取值底稿区域', 'width': '180px'},
				{
					'title': '操作', 'class': 'text-center', 'width': '80px', 'render': function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"重新取值\"><i class=\"fa fa-refresh\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						return renderStr;
					}
				}
			]
		});
	}

	function setNoteLinkTable() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00094',
				param1: autoId,
				param2: window.CUR_CUSTOMERID,
				param3: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let noteDgValueInfo = data.data[0].noteDgValueInfo;
					if (data.data && data.data[0] && (noteDgValueInfo && noteDgValueInfo != '' && noteDgValueInfo != '{}' && JSON.parse(noteDgValueInfo).NoteCacheMap !== '{}')) {
						setNoteLinkTableData(noteDgValueInfo);
						$('#noteLinkTable td button').on('click', function() {
							let paramStr = this.lastElementChild.value;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgNote.refreshNoteDgvalue.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: paramStr,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										let dataList = data.data[0].dgRangeValue;
										let rowNum = parseInt(data.data[0].rowNum);
										let colNum = parseInt(data.data[0].colNum);
										let sheetIndex = parseInt(data.data[0].sheetIndex);
										let spread = designer.Spread;
										let sheet = spread.getSheet(sheetIndex);
										let rowIndex = parseInt(data.data[0].rowIndex);
										let columnIndex = parseInt(data.data[0].columnIndex);
										let k = 0;
										spread.suspendPaint();
										for (let i = 0; i < rowNum; i++) {
											for (let j = 0; j < colNum; j++) {
												if (parseFloat(dataList[k]).toString() == 'NaN') {
													sheet.getCell(rowIndex + i, columnIndex + j).value(dataList[k]);
												} else {
													sheet.getCell(rowIndex + i, columnIndex + j).value(parseFloat(dataList[k]));
												}
												k++;
											}
										}
										spread.resumePaint();
										bdoSuccessBox('成功', '重新取值成功！');
									}
								}
							});
						});
						$('#noteLinkTable td a').on('click', function() {
							var sheetName = this.text.substring(0, this.text.indexOf(':'));
							var index = designer.Spread.getSheetIndex(sheetName);
							designer.Spread.setActiveSheetIndex(parseInt(index));
							var sheet = designer.Spread.getActiveSheet();
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, this.text.substring(this.text.indexOf(':') + 1), 0, 0);
							sheet.setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
							sheet.showRow(range.row, verticalPosition);
							// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
						});
						$('#noteLinkTable_wrapper .tableRefresh').click((event) => {
							setNoteLinkTable();
						});
					}
				}
			}
		});
	}

	function setFieldInfo(param) {
		let baseNote = $.sessionStorage('baseNote');
		let spread = designer.Spread;
		if (baseNote != '' && JSON.parse(baseNote) != '') {
			for (let data of JSON.parse(baseNote)) {
				let position = data.fieldPosition;
				if (position == null || position == '') {
					continue;
				}
				let preSheetName = position.substring(0, position.indexOf(':'));
				let preSheet = spread.getSheetFromName(preSheetName);
				let preRangeStr = position.substring(position.indexOf(':') + 1);
				let preRange = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getSheetFromName(preSheetName), preRangeStr, 0, 0);
				preSheet.comments.remove(preRange.row, preRange.col);
				/*let comment = preSheet.comments.remove(preRange.row, preRange.col);
				comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);*/
				/*let preCell = preSheet.getCell(preRange.row, preRange.col);
				// 清除单元格格式
				preCell.cellType(void 0);
				// 居右
				preCell.hAlign(GC.Spread.Sheets.HorizontalAlign.right);*/
			}
		}
		for (let data of param) {
			let position = data.fieldPosition;
			if (position == null || position == '') {
				continue;
			}
			let sheet = spread.getActiveSheet();
			let rangeStr = position.substring(position.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
			spread.suspendPaint();
			sheet.comments.add(range.row, range.col, '报备模板字段：' + data.fieldName);
			let comment = sheet.comments.get(range.row, range.col);
			comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
			/*let cellTagStart = [];
			cellTagStart.push({
				type: 'link',
				linkText: 'F',
				fieldName: data.fieldName,
				fieldPosition: data.fieldPosition
			});
			let activeCell = sheet.getCell(range.row, range.col);
			activeCell.cellType(new designer.ShowFieldInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);*/
			spread.resumePaint();
		}
	}

	function checkFieldInfo() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00104',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: designer.noteExtraOptions.reportTplId,
				param4: designer.noteExtraOptions.knoteId,
				param5: designer.noteExtraOptions.noteNo,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					var isNull = false;
					let spread = designer.Spread;
					$.sessionStorage('baseNote', JSON.stringify(data.data));
					for (let dataList of data.data) {
						if ((dataList.fieldValue == null || dataList.fieldValue == '') && !isNull) {
							isNull = true;
						}
						let position = dataList.fieldPosition;
						if (position == null || position == '') {
							continue;
						}
						let sheetName = position.substring(0, position.indexOf(':'));
						let sheet = spread.getSheetFromName(sheetName);
						let rangeStr = position.substring(position.indexOf(':') + 1);
						let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
						spread.suspendPaint();
						sheet.comments.add(range.row, range.col, '报备模板字段：' + dataList.fieldName);
						let comment = sheet.comments.get(range.row, range.col);
						comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
						/*var cellTagStart = [];
						cellTagStart.push({
							type: 'link',
							linkText: 'F',
							fieldName: dataList.fieldName,
							fieldPosition: dataList.fieldPosition
						});
						let activeCell = sheet.getCell(range.row, range.col);
						activeCell.cellType(new designer.ShowFieldInfo());
						activeCell.tag({
							cellTagStart: cellTagStart
						});
						// 居左
						activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);*/
						spread.resumePaint();
					}
					if (isNull) {
						$('#fieldInfoBtn').removeClass('btn-success');
						$('#fieldInfoBtn').addClass('btn-danger');
						swal({
							title: '尚未完成报备模板字段信息设置!',
							html: '',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					} else {
						$('#fieldInfoBtn').addClass('btn-success');
						$('#fieldInfoBtn').removeClass('btn-danger');
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
		//To Fix the designer resize performance issues.
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
		designer = initDesignerNote(_data);
		loadTable();
		
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
					$content = $('.content .fill-spread-content');

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

	var reportTplID = currentNode.extraOptions.reportTplId;
	var kNoteId = currentNode.extraOptions.knoteId;
	var noteNo = currentNode.extraOptions.noteNo;
	//附注表格参数
	var field_info_view = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00104',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: reportTplID,
					param4: kNoteId,
					param5: noteNo,
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
			paging: false,
			fixedHeight: '460px',
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '报备模板字段信息',
					name: 'fieldName',
					data: 'fieldName',
					width: '100px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '报备模板字段值',
					name: 'fieldValue',
					data: 'fieldValue',
					width: '100px',
					render: function(data, type, row, meta) {
						var str = data != null ? data : '';
						var renderStr = '<input class=\"form-control\" type=\"text\" name=\"field_value\" value=\"' + str + '\" readonly>';
						return renderStr;
					}
				}, {
					targets: 3,
					className: 'text-left',
					title: '报备模板字段位置',
					name: 'fieldPosition',
					data: 'fieldPosition',
					width: '100px',
					render: function(data, type, row, meta) {
						var str = data != null ? data : '';
						var renderStr = '<input class=\"form-control\" type=\"text\" name=\"field_position\" value=\"' + str + '\" readonly>';
						return renderStr;
					}
				}, {
					targets: 4,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" type="button" name="getCellInfo" data-placement="top" title="获取当前单元格" data-toggle="tooltip"><i class="fa fa-location-arrow"></i></button>';
						return renderStr;
					}
				}, {
					targets: 5,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}]
		}
	};
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
			var moveObject = document.getElementById('fieldInfoDiv');
			lastX = moveObject.offsetLeft;
			lastY = moveObject.offsetTop;
			lastcX = e.clientX;
			lastcY = e.clientY;
		}
	}

	function mousemove(e) {
		var moveObject = document.getElementById('fieldInfoDiv');
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
	 * end
	 */

	/**
	 * 事件绑定
	 */
	listener = () => {
		/**
		 * 保存
		 */
		$('#saveExcelBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00092',
					param1: autoId,
					param2: customerId,
					param3: projectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data[0].isFinished == '1'){
							bdoErrorBox('失败', '已完成的附注不能再保存');
						}else{
							bdoInProcessingBox('保存中');
							transition(() => {
								var json = spread.toJSON();
								saveExcel(json);
							});
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		/**
		 * 临时保存
		 */
		$('#saveExcelStorageBtn').click((event) => {
			transition(() => {
				var json = spread.toJSON();
				saveFileInStorage(json);
			});
		});
		/**
		 * 导出
		 */
		$('#exportExcelBtn').click((event) => {
			// 导出文件
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgNote.havePermission.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID,
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data[0].permission){
							transition(() => {
								exportExcel();
							});
						}else{
							bdoInfoBox('提示', '只有项目负责人或项目组员才能导出附注文件!');

						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		/**
		 * 获取最新版本
		 */
		$('#coverBtn').click((event) => {
			if (!currentNode) {
				return;
			}
			storage.removeItem(storageId);
			storage.removeItem(storageStatus);
			storage.removeItem(storageTime);
			getExcelData({
				menuId: window.sys_menuId,
				param1: autoId,
				param2: customerId,
				param3: projectId
			});
		});
		/**
		 * 批注
		 */
		$('#postilBtn').click((event) => {
			PostilPage({
				region: '#sideRegin',
				data: _data,
				type: 'NOTE-' + _data.extraOptions.noteNo,
				foreignId: _data.extraOptions.autoId,
				customerId: _data.extraOptions.customerId,
				projectId: _data.extraOptions.projectId
			});
			$('#sideRegin').show();
		});

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
				case 'lastNoteTab':
					$('#lastNoteTable').DataTable().ajax.reload();
					break;
				case 'otherTab':
					$('#otherTable').DataTable().ajax.reload();
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
			BdoDataTable('lastNoteTable', lastNoteTable);
			BdoDataTable('otherTable', otherTable);
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
			$("#lastNoteTable_length").append('<div class="input-group pull-right"><input id="searchText3" type="text" class="form-control" placeholder="附注名称..." style="width: 120px;height: 30px;"><button id="search_lastNote" class="btn btn-default" type="button" title="附注名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_lastNote').on('click', function () {
				lastNoteTable.localParam.urlparam.param3 = $('#searchText3').val();
				$('#lastNoteTable').DataTable().ajax.reload();
			});
			$("#otherTable_length").append('<div class="input-group pull-right"><input id="searchText4" type="text" class="form-control" placeholder="文件名称..." style="width: 120px;height: 30px;"><button id="search_other" class="btn btn-default" type="button" title="文件名称查询" style="height: 30px;"><i class="fa fa-search"></i></button></div>');
			$('#search_other').on('click', function () {
				otherTable.localParam.urlparam.param3 = $('#searchText4').val();
				$('#otherTable').DataTable().ajax.reload();
			});
		});
		$('#dgTable').on('click', 'button[name="openDgFile"]', function() {
			var object = $('#dgTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			if ($('#dg_' + dgFileId, window.parent.document).length == 0) {
				setExcelnode(dgFileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#dg_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
				var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">'
					+ '<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + object.indexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
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
		});
		$('#noteTable').on('click', 'button[name="openNoteFile"]', function() {
			var object = $('#noteTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			var node = JSON.parse($.sessionStorage('noteInfoNode'));
			if (node.extraOptions.autoId != dgFileId) {
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				if ($('#note_' + dgFileId, window.parent.document).length == 0) {
					setNoteNode(dgFileId, object.projectId);
					var excelnode = designer.excelnode;
					$.sessionStorage('excelnode', JSON.stringify(excelnode));
					$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#note_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
					var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">'
						+ '<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + object.indexId + '&projectId=' + object.projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
						+ '</div>');
					$('#dgFileTabContent', window.parent.document).append($div);
					$('#dgFileTabs a:last', window.parent.document).tab('show');
					if ($('.aside-hide', window.parent.document).length !== 0) {
						$('body', window.parent.document).toggleClass('aside-hide');
						$(window).resize();
					}
				} else {
					$('[href="#note_' + dgFileId + '"]', window.parent.document).tab('show');
					$('#note_' + dgFileId, window.parent.document).addClass('active');
				}
			}
		});
		$('#lastNoteTable').on('click', 'button[name="openNoteFile"]', function() {
			var object = $('#lastNoteTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			var node = JSON.parse($.sessionStorage('noteInfoNode'));
			if (node.extraOptions.autoId != dgFileId) {
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				if ($('#note_' + dgFileId, window.parent.document).length == 0) {
					setNoteNode(dgFileId, object.projectId);
					var excelnode = designer.excelnode;
					$.sessionStorage('excelnode', JSON.stringify(excelnode));
					$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#note_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
					var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">'
						+ '<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + object.indexId + '&projectId=' + object.projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
						+ '</div>');
					$('#dgFileTabContent', window.parent.document).append($div);
					$('#dgFileTabs a:last', window.parent.document).tab('show');
					if ($('.aside-hide', window.parent.document).length !== 0) {
						$('body', window.parent.document).toggleClass('aside-hide');
						$(window).resize();
					}
				} else {
					$('[href="#note_' + dgFileId + '"]', window.parent.document).tab('show');
					$('#note_' + dgFileId, window.parent.document).addClass('active');
				}
			}
		});
		$('#otherTable').on('click', 'button[name="openDgFile"]', function() {
			var object = $('#otherTable').DataTable().data()[$(this).closest('tr').index()];
			var dgFileId = object.autoId;
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			if ($('#dg_' + dgFileId, window.parent.document).length == 0) {
				setOtherExcelnode(dgFileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#dg_' + dgFileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
				var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">'
					+ '<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + object.fileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
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
		});
		/*$('#formulaModal [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/
		$('#tagSortMain').change((event) => {
			if($('#tagSortMain').val() == 'note'){
				tagsMainTable.localParam.urlparam.param6 = autoId;
			} else {
				tagsMainTable.localParam.urlparam.param6 = '';
			}
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#tagTypeMain').change((event) => {
			tagsMainTable.localParam.urlparam.param4 = $('#tagTypeMain').val();
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#formulaTypeMain').change((event) => {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'NOTE',
					param4: autoId,
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					param5: $('#formulaCalcMain').val(),
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
		$('#formulaCalcMain').change((event) => {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'NOTE',
					param4: autoId,
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					param5: $('#formulaCalcMain').val(),
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
			formulaTable.localParam.urlparam.param5 = $('#formulaCalcMain').val();
			$('#formulaTable').DataTable().ajax.reload();
		});
		$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'tagMainTab':
					tagsMainTable.localParam.urlparam.param6 = autoId;
					$('#tagsMainTable').DataTable().ajax.reload();
					break;
				case 'formulaMainTab':
					refreshFormulaTable(false);
					break;
				default:
					break;
			}
		});

		// 刷新校验公式表
		function refreshFormulaTable(reload){
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'NOTE',
					param4: autoId,
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					param5: $('#formulaCalcMain').val(),
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
			if(reload){
				$('#formulaTable').DataTable().ajax.reload();
			}else{
				BdoDataTable('formulaTable', formulaTable);
			}
		}

		// 校验公式表刷新按钮点击事件
		$('#formulaMainTab').on('click', 'a[class="tableRefresh"]', function() {
			refreshFormulaTable(true);
		});
		$('#openTagModalBtn').click(e => {
			$('#tagModal').modal('show');
		});
		$('#tagModal').on('show.bs.modal', function() {
			BdoDataTable('tagTable', tagTable);
			$('#tagTable tbody').on('click', 'td button', function() {
				let cellAlias = this.lastElementChild.value;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.deleteTag.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: cellAlias,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#tagTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '删除标签成功！');
						}
					}
				});
			});
		});
		$('#openFormulaModalBtn').click(e => {
			$('#formulaSubjectId').val(designer.userSubjectId);
			$('#formulaSubjectName').val(designer.userSubjectId + '-' + designer.userSubjectName);
			$('#formulaModal').modal('show');
		});
		$('#formulaModal').on('show.bs.modal', function() {
			$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
			tagsMainTable.localParam.urlparam.param6 = autoId;
			// $('#tagsMainTable').DataTable().ajax.reload();
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
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
			refreshFormulaTable(false);
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
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
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
										param1: window.CUR_CUSTOMERID,
										param2: window.CUR_PROJECTID,
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
											$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
											$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
											window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
										}
									}
								});
							} else if(tagInfo.type == 'note'){
								if(autoId != tagInfo.noteAutoId){
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgGeneral.query.json',
										// async: false,
										data: {
											menuId: window.sys_menuId,
											sqlId: 'DG00092',
											param1: tagInfo.noteAutoId,
											param2: window.CUR_CUSTOMERID,
											param3: window.CUR_PROJECTID,
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
								}else{
									var sheetName = tagInfo.tagPosition.substring(tagInfo.tagPosition.indexOf(':') + 1, tagInfo.tagPosition.lastIndexOf(':'));
									var sheetIndex = parseInt(spread.getSheetIndex(sheetName));
									spread.setActiveSheetIndex(sheetIndex);
									var rangeStr = tagInfo.tagPosition.substring(tagInfo.tagPosition.lastIndexOf(':') + 1);
									var range = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getActiveSheet(), rangeStr, 0, 0);
									spread.getActiveSheet().setActiveCell(range.row, range.col);
									var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
									spread.getActiveSheet().showRow(range.row, verticalPosition);
								}
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
										param1: window.CUR_CUSTOMERID,
										param2: window.CUR_PROJECTID,
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
			/*autoId: 2
			customerId: 10002136
			formula: "p1=p2+p3+p4"
			formulaAutoId: "1=2+3+4"
			formulaCalc: "0"
			formulaText: "T0072017年未审数=6601审前金额2017+T082审前金额2017+审前金额本期数合计"
			formulaValue: "100055.30=44985.42+44985.42+44985.42"
			projectId: 2017059353
			subjectId: "T082"
			subjectName: "T082-销售费用"
			updateTime: 1554341911000*/
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
			$('#formulaModal [data-toggle="tabs"] a:first').tab('show');
		});
		$('#formulaTable').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.delFormula.json',
					// async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: object.autoId
					},
					dataType: 'json',
					success(data) {
						refreshFormulaTable(true);
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'NOTE',
					param4: autoId,
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
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: formula.replace(/\+/g, '%2B'),
					param4: formulaText.replace(/\+/g, '%2B'),
					param5: formulaValue.replace(/\+/g, '%2B'),
					param6: formulaCal,
					param7: formulaAutoId.replace(/\+/g, '%2B'),
					param8: '',
					param9: '',
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
		// 打开核对公式modal
		$('#openVerifyModalBtn').click(e => {
			$('#verifyModal').modal('show');
		});
		$('#verifyModal').on('show.bs.modal', function() {
			BdoDataTable('verifyTable', verifyTable);
		});
		$('#verifyTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
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
						}else if(tagInfo.type == 'auditReport'){
							var sheetIndex = parseInt(spread.getSheetIndex(tagInfo.sheetName));
							spread.setActiveSheetIndex(sheetIndex);
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getActiveSheet(), tagInfo.rangeStr, 0, 0);
							spread.getActiveSheet().setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							spread.getActiveSheet().showRow(range.row, verticalPosition);
						}
					}
				}
			});
		});
		// 弹出编辑备注模态框
		$('#verifyTable').on('click', 'button[name="editRemark"]', function() {
			var object = $('#verifyTable').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			$('#formulaId').val(autoId);
			var checkRemark = object.checkRemark;
			$('#remark_input').val(checkRemark);
			$('#remarkModal').modal('show');
		});
		// 保存备注
		$('#saveRemarkBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.saveFormulaRemark.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $('#formulaId').val(),
					param4: $('#remark_input').val().trim(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// $('#verifyTable').DataTable().ajax.reload();
						$('#remarkModal').modal('hide');
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '保存备注成功！');
					}
				}
			});
		});
		// 校验核对公式
		$('#verifyFormulaBtn').click((event) => {
			bdoInProcessingBox('核对中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.checkVerifyFormula.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'NOTE',
					param4: autoId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '核对完成！');
					}
				}
			});
		});
		/** 模态框设置 */
		/*		$('.modal').on('show.bs.modal', function(){
					$(this).draggable({
						handle: '.block-header',
						cursor: 'move'
					});
					$(this).css('overflow', 'hidden');
				});*/
		/**
		 * 获取底稿取值链接
		 */
		$('#openNoteLinkBtn').click((event) => {
			$('#noteLinkModal').modal('show');
		});
		$('#noteLinkModal').on('show.bs.modal', function(e) {
			setNoteLinkTable();
		});
		/*$('#linkBtn').click((event)=>{
			$('#noteLinkModal').modal('show');
			setNoteLinkTable();
		});*/
		/**
		 * 报备模板字段信息
		 */
		$('#fieldInfoBtn').click((event) => {
			$('#fieldInfoDiv').css({'display': ''});
			BdoDataTable('fieldInfoTable', field_info_view);
		});
		$('button[name="closeLinkDiv"]').click((event) => {
			$('#fieldInfoDiv').css({'display': 'none'});
			// checkFieldInfo();
		});
		$('#fieldInfoTable').on('click', 'button[name="getCellInfo"]', function() {
			let rowIndex = $(this).closest('tr').index();
			let sheet = designer.Spread.getActiveSheet();
			let row = sheet.getActiveRowIndex();
			let col = sheet.getActiveColumnIndex();
			let range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			let rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			$('#fieldInfoTable input[name="field_value"]')[rowIndex].value = sheet.getValue(row, col);
			$('#fieldInfoTable input[name="field_position"]')[rowIndex].value = sheet.name() + ':' + rangeStr;
		});
		$('#fieldInfoTable').on('click', 'input[name="field_position"]', function() {
			let sheet = designer.Spread.getActiveSheet();
			let position = this.value;
			let sheetName = position.substring(0, position.indexOf(':'));
			let rangeStr = position.substring(position.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
			sheet.setActiveCell(range.row, range.col);
			let verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			// let horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
			sheet.showRow(range.row, verticalPosition);
			// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
		});
		$('#note_fieldInfo_update').click((event) => {
			let length = $('input[name="field_value"]').length;
			var param = [];
			for (var i = 0; i < length; i++) {
				var fieldValue = $('input[name="field_value"]')[i].value;
				var fieldPosition = $('input[name="field_position"]')[i].value;
				var rowIndex = parseInt($('input[name="field_value"]')[i].parentElement.parentElement.firstElementChild.innerText);
				var object = $('#fieldInfoTable').DataTable().data()[rowIndex - 1];
				var autoId = object.autoId !== null ? object.autoId : '';
				param.push({
					fieldValue: fieldValue,
					fieldPosition: fieldPosition,
					autoId: autoId,
					fieldName: object.fieldName
				});
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgNote.updateFieldInfo.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: designer.noteExtraOptions.reportTplId,
					param4: designer.noteExtraOptions.knoteId,
					param5: designer.noteExtraOptions.noteNo,
					param6: designer.noteExtraOptions.noteName,
					param7: designer.noteExtraOptions.fileName,
					param8: JSON.stringify(param),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('更新成功!', data.resultInfo.statusText);
						$('#fieldInfoTable').DataTable().ajax.reload();
						setFieldInfo(param);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		/**
		 * 过渡效果
		 */
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
		/**
		 * 更新附注取值
		 */
		$('#refreshAllLinkBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00094',
					param1: autoId,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let noteDgValueInfo = data.data[0].noteDgValueInfo;
						if (data.data && data.data[0] && (noteDgValueInfo && noteDgValueInfo != '' && noteDgValueInfo != '{}' && JSON.parse(noteDgValueInfo).NoteCacheMap !== '{}')) {
							let mapJson = JSON.parse(noteDgValueInfo).NoteCacheMap;
							for (let k of Object.keys(mapJson)) {
								let noteLinkInfo = mapJson[k][0];
								let paramStr = k + ':' + noteLinkInfo.dgFileId + ':' + noteLinkInfo.dgSheetName + ':' + noteLinkInfo.dgRangeStart + ':' + noteLinkInfo.dgRangeEnd;
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgNote.refreshNoteDgvalue.json',
									// async : false,
									data: {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										menuId: window.sys_menuId,
										param1: window.CUR_CUSTOMERID,
										param2: window.CUR_PROJECTID,
										param3: paramStr,
										start: -1,
										limit: -1
									},
									dataType: 'json',
									success(data) {
										if (data.success) {
											let dataList = data.data[0].dgRangeValue;
											let rowNum = parseInt(data.data[0].rowNum);
											let colNum = parseInt(data.data[0].colNum);
											let sheetIndex = parseInt(data.data[0].sheetIndex);
											let spread = designer.Spread;
											let sheet = spread.getSheet(sheetIndex);
											let rowIndex = parseInt(data.data[0].rowIndex);
											let columnIndex = parseInt(data.data[0].columnIndex);
											let k = 0;
											spread.suspendPaint();
											for (let i = 0; i < rowNum; i++) {
												for (let j = 0; j < colNum; j++) {
													if (parseFloat(dataList[k]).toString() == 'NaN') {
														sheet.getCell(rowIndex + i, columnIndex + j).value(dataList[k]);
													} else {
														sheet.getCell(rowIndex + i, columnIndex + j).value(parseFloat(dataList[k]));
													}
													k++;
												}
											}
											spread.resumePaint();
											bdoSuccessBox('成功', '更新附注取值成功！');
										}
									}
								});
							}
						}
					}
				}
			});
		});

		$('#openTemplateBtn').click((event) => {
			var indexId = agrs.data.extraOptions.reportTplId;
			var dgFileId = agrs.data.extraOptions.knoteId;
			var noteNo = agrs.data.extraOptions.noteNo;
			var noteName = agrs.data.extraOptions.noteName;
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			if ($('#tpl_' + dgFileId, window.parent.document).length == 0) {
				setTplnode(dgFileId, indexId, noteNo);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#tpl_' + dgFileId + '\'><h5 class=\'block-title\'>' + noteName + '模板' + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
				var $div = $('<div class="postil-content-wrap tab-pane active" id="tpl_' + dgFileId + '">'
					+ '<iframe id="iframe_tpl_' + dgFileId + '" src="/Faith/dgcenter.do?m=openTplIframe&index=' + indexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
					+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if ($('.aside-hide', window.parent.document).length !== 0) {
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			} else {
				$('[href="#tpl_' + dgFileId + '"]', window.parent.document).tab('show');
				$('#tpl_' + dgFileId, window.parent.document).addClass('active');
			}
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
		transition(() => {
			getExcelData({
				menuId: window.sys_menuId,
				param1: autoId,
				param2: customerId,
				param3: projectId
			});
			$('#fileFullPath').text(fullPath);
		});
		DgDesignerPage({region: '#designerment', data: _data});
		OneUI.initHelper('slimscroll');
		ready();
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
			url: 'dgCenter/DgNote.saveDgNoteInfo.json',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					var time = data.data[0].time;
					storage.setItem(storageTime, time);
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$.ajax({
						url: 'dgCenter/DgNote.checkNoteFormula.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: 'NOTE',
							param4: autoId
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
				url: 'dgCenter/DgNote.getDgNoteInfo.json',
				type: 'POST',
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						var time = data.data[0].time;
						if (storage.length > 300) {
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
							getNoteDgValueInfo();
							getCustomizeStyle();
							// checkFieldInfo();
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
						bdoSuccessBox('加载完成', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		} else {
			$.ajax({
				url: 'dgCenter/DgNote.getDgNoteInfo.json',
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
									if (storage.length > 300) {
										storage.removeItem(storage.key(2));
										storage.removeItem(storage.key(1));
										storage.removeItem(storage.key(0));
									}
									var excel = data.data[0].excelBase64Data;
									storage.setItem(storageTime, time);
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
										getNoteDgValueInfo();
										getCustomizeStyle();
										// checkFieldInfo();
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
										getNoteDgValueInfo();
										getCustomizeStyle();
										// checkFieldInfo();
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
									getNoteDgValueInfo();
									getCustomizeStyle();
									// checkFieldInfo();
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
			param.autoId = autoId;
			param.customerId = customerId;
			param.projectId = projectId;
			param = getNoteParam(param);
			param.tagChanged = JSON.stringify(designer.tagChanged);
			designer.tagChanged = [];
			saveExcelServer(param, blob);
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'server');
				// storage.setItem(storageTime, time);
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
				// storage.setItem(storageTime, time);
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
								param1: autoId,
								param2: customerId,
								param3: projectId
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
							param1: autoId,
							param2: customerId,
							param3: projectId
						});
						$('#fileFullPath').text(fullPath);
					});
				}, 0);
			});
		}
	};


	mount();
};