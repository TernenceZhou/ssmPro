/**
 * 附注科目维护
 */
function nodeSubjectManage(context) {
	let tpl = tplLoader('dgCenter/html/dg/adjustTab.html');
	let $topTab = $('#comsubjectManageTopTab');
	let $topTabContent = $('#comsubjectManageTopTabContent');
	let $nodeSubjectTabLi = $('<li id="nodeSubjectTabLi"><a href="#tab_nodesubject">附注科目维护</a></li>');
	let $nodeSubjectTab = $(tpl);
	let $nodeSubjectTable = $('#nodeSubjectTable', $nodeSubjectTab);


	let cnt = 0;
	/**
	 * 一览配置
	 * @type {number}
	 */
	const nodeSubjectTableConf = {
		localParam : {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId : window.sys_menuId,
				sqlId : 'DG00000',
			},
			tabNum : true
		},
		tableParam : {
			select: true,
			ordering: false,
			//order : [2, 'asc'],
			serverSide: true,
			autoWidth: true,
			scrollY: 500,
			scrollX: true,
			scrollCollapse: true,
			paging: true,
			fixedColumns: true,
			columnDefs :[{
				targets : (()=>{ cnt = 0;return ++cnt; })(),
				orderable : false,
				title : `
						<label class="css-input css-checkbox css-checkbox-primary">	
							<input type="checkbox" id="checkAll" name="nodeSubjectCheckbox">
							<span></span>
						</label>
				`,
				width : '80px',
				data : null,
				className : 'text-center',
				render(data, type, row, meta) {
					let renderStr = `
						<label class="css-input css-checkbox css-checkbox-primary">	
							<input type="checkbox" name="nodeSubjectCheckbox" value="` + data.autoId + `" data-row="` + meta.row + `">
							<span></span>
						</label>
					`;
					return renderStr;
				}
			}, {
				targets : ++cnt,
				orderable : false,
				title : '处理',
				width : '80px',
				data : null,
				className : 'text-center',
				render(data, type, row, meta) {
					let renderStr = `
						<dev>
							<button class="btn btn-xs btn-info table-btn-operate" type="button" name="nodeSubjectEditBtn" data-placement="top" title="编辑" data-toggle="tooltip" data-row="` + meta.row + `">	<i class="fa fa-edit"></i></button>
							<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="nodeSubjectUploadBtn" data-placement="top" title="上传模板" data-toggle="tooltip" data-row="` + meta.row + `">	<i class="fa fa-upload"></i></button>
							<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="nodeSubjectDownloadBtn" data-placement="top" title="下载模板" data-toggle="tooltip" data-row="` + meta.row + `">	<i class="fa fa-upload"></i></button>
							<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="nodeSubjectDelBtn" data-placement="top" title="删除" data-toggle="tooltip" data-row="` + meta.row + `">	<i class="fa fa-close"></i></button>
						</dev>
					`;
					return renderStr;
				}
			}]
		}
	};

	/**
	 * 构建附注科目维护tab
	 */
	function createDom() {
		if($('#nodeSubjectTabLi', $topTab).length == 0) {
			$nodeSubjectTabLi.appendTo($topTab);
		}
		if($('#tab_nodesubject', $topTabContent).length == 0) {
			$nodeSubjectTab.appendTo($topTabContent);
		}
	}
}