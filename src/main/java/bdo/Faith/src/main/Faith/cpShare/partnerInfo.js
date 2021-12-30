pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');
/** 模态框拖动 */
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/

/** 加载树 */
$('#search_departId').treecombo({
	url : './base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
/** 下拉框 */
$('#search_focusIndustry').html(ComboDBOption('./cpBase/Combo.findIndustry.json', true));
$('#search_mainIndustry').html(ComboDBOption('./cpBase/Combo.findIndustry.json', true));

/** table 属性 */
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'CP00006',
		param1 : '0',
		filter : queryFilter()
	},
	tableColumns : [
		{
			targets : 1,
			orderable : true,
			className : 'text-center',
			title : '处理',
			width : '100px',
			render : function(data, type, row, meta) {
				return '<button class="btn btn-xs btn-success" type="button" name="rowView" data-placement="top" title="查看合伙人简历 " data-toggle="tooltip">'
					+ '<i class="fa fa-eye"></i></button>';
			}
		}, {
			targets : 2,
			orderable : true,
			className : 'text-center',
			title : '姓名',
			name : 'id',
			data : '__uid',
			width : '100px',
			render : function(data, type, row, meta) {
				if(!data) {
					return '';
				}
				return '<span data-toggle="tooltip" title="电话: ' + data.phone
						+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
						+ '">' + data.userName + '</span>';
			}
		}, {
			targets : 3,
			orderable : true,
			title : '所属部门',
			name : 'departmentid|__ddepartmentid',
			data : '__ddepartmentid',
			width : '200px',
			render : function(data, type, row, meta){
				return data.topManageDepName + '-' + data.departName;
			}
		}, {
			targets : 4,
			orderable : true,
			title : '专注行业',
			name : 'fn1',
			data : 'fn1',
			width : '200px'
		}, {
			targets : 5,
			orderable : true,
			title : '主营行业',
			name : 'mn1',
			data : 'mn1',
			width : '200px'
		}, {
			targets : 6,
			orderable : true,
			className : 'text-left',
			title : '合作评分',
			name : 'evaluateScore',
			data : 'evaluateScore',
			width : '100px',
			render : function(data, type, row, meta){
				if(data){
					var $ratingEl = $('<div></div>');
		            $ratingEl.raty({
						score: data.toFixed(1),
						number: 5,
						readOnly : true,
						hints : false,
						halfShow :true,
			            starHalf: 'fa fa-fw fa-star-half-o text-warning',
			            starOn:'fa fa-fw fa-star text-warning'
		            });
					return $ratingEl.html();
				}
				return '';
			}
		}, {
			targets : 7,
			orderable : true,
			className : 'text-right',
			title : '可申请业务机会/提供业务机会',
			name : 'canApplyNum',
			data : 'canApplyNum',
			width : '150px',
			render : function(data, type, row, meta){
				return (row.canApplyNum ? row.canApplyNum : 0) + '/' + (row.providedNum ? row.providedNum : 0);
			}
		}, {
			targets : 8,
			orderable : true,
			title : '备注',
			name : 'memo',
			data : 'memo',
			width : '250px'
		}]
};

BdoDataTables('partnerInfo', tableParam);

/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_partnerName').val('');
	$('#search_departId').treecombo('setTreeComboValue',['', '']);
	$('#search_mainIndustry').val('');
	$('#search_focusIndustry').val('');
	tableParam.filterParam.filter = queryFilter();
	$('#partnerInfo').DataTable().ajax.reload();
});

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	$('#partnerInfo').DataTable().ajax.reload();
});

/** 导出 */
$('#btn_export').click(function() {
	exportExcel(this, '合伙人业务情况一览', tableParam, 'partnerInfo');
});

/** 行按钮 查看 */
$('#partnerInfo').on('click', 'button[name="rowView"]', function() {
	$(this).closest('tr').dblclick();
});

/** 行双击 */
$('#partnerInfo tbody').on('dblclick', 'tr', function() {
	var object = $('#partnerInfo').DataTable().data()[$(this).closest('tr').index()];
	partnerCVInfo(object.__uid.userId);
});

/** 检索条件设置 */
function queryFilter() {
	var queryFilterArr = [];
	if ($('#search_partnerName').val() != '') {
		queryFilterArr.push({
			'field' : '__uid',
			'sqlIndex' : 'id',
			'type' : 'string',
			'value' : $('#search_partnerName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_departId').val() != '') {
		queryFilterArr.push({
			'field' : 'departId',
			'sqlIndex' : 'departmentid',
			'type' : 'list',
			'value' : $('#search_departId').treecombo('getTreeComboValue'),
			'operate' : 'eq'
		});
	}
	if ($('#search_focusIndustry').val() != '') {
		queryFilterArr.push({
			'field' : 'focusIndustry',
			'sqlIndex' : 'focusIndustry',
			'type' : 'string',
			'value' : $('#search_focusIndustry option:selected').text(),
			'operate' : 'eq'
		});
	}
	if ($('#search_mainIndustry').val() != '') {
		queryFilterArr.push({
			'field' : 'mainIndustry',
			'sqlIndex' : 'mainIndustry',
			'type' : 'string',
			'value' : $('#search_mainIndustry option:selected').text(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
