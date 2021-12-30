$(document).ready(function() {
	uiBlocksApi(false, 'init');
	var myDate = new Date();
	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'sys.S300017',
				menuId: window.sys_menuId,
				systemId: systemId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			ordering: false,
			order: [6, 'desc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 25

				},{
					targets: 2,
					className: 'text-center',
					title: '处理',
					width: 25,
					render : function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDisable" data-placement="top" title="禁用" data-toggle="tooltip">'
							+ '<i class="fa fa-ban"></i></button>';
						return renderStr;
					}
				}, {
					targets: 3,
					className: 'text-center',
					title: '版本号',
					name: 'version',
					data: 'version',
					width: 50
				}, {
					targets: 4,
					className: 'text-center',
					title: '创建时间',
					name: 'versionTime',
					data: 'versionTime',
					width: 30,
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}
				}, {
					targets: 5,
					className: 'text-left',
					title: '具体内容',
					name: 'content',
					data: 'content',
					width: 30
				}, {
					targets: 6,
					className: 'text-center',
					title: 'svn版本号',
					name: 'svnVersion',
					data: 'svnVersion',
					width: 60
				}
			]
		}
	};
	BdoDataTable('baseVersionForm', accdetail_view);



	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd', //日期显示格式
		minViewMode: 0
	});

	//时间毫秒数转时间
	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
		return oTime;

	}

	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}


	/** 搜索按钮 */
	$('#btn_baseVersion_search').click(function() {
		BdoDataTable('baseVersionForm', accdetail_view);
	});

	$('#version_save').click(function() {
		var version=$('#version').val();
		var versionTime = $('#versionTime').val();
		var versionContent = $('#versionContent').summernote('code');
		var svnVserion=$('#svnVserion').val();
		$.ajax({
			type : 'post',
			url : 'cpBase/SubjectManage.addVersion.json',
			data : {
				menuId : window.sys_menuId,
				systemId: systemId,
				param1 : version,
				param2 : versionTime,
				param3 : $.base64.encode(encodeURIComponent(versionContent)),
				param4 : svnVserion,
				param5 : $('#vserionAutoId').val()
			},
			dataType : 'json',
			success : function(data) {
				$('#baseVersionForm').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#vserionAutoId').val("");
					$('#versionModal').modal('hide');
					$('#versionContent').summernote("reset");
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});


	});
	let summernoteInitFlag = false;
	$('#versionModal').on('show.bs.modal', function(e) {
		if(!summernoteInitFlag) {
			let summerotePluginOpt = {
				/*toolbar:
					[
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['view', ['fullscreen']],
					],
				codeviewFilter: false,
				codeviewIframeFilter: true,*/
				toolbar:
					[
						// [groupName, [list of button]]
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['view', ['fullscreen']],
					],
				codeviewFilter: false,
				codeviewIframeFilter: true,
				codeviewIframeWhitelistSrc: ['localhost', '127.0.0.1', 'sacpdemo.bdo.com.cn', 'sacp.bdo.com.cn'],
				callbacks: {
					onPaste: function(ne) {
						
					}
				}
			};
			$('#versionContent').off('summernote');
			$('#versionContent').summernote(summerotePluginOpt);
		}
	});
	$('#baseVersion_add').on('click',function() {
		$('#version').val("");
		$('#versionTime').val("");
		$('#svnVserion').val("");
		$('#vserionAutoId').val("");
		$('#versionContent').summernote('code',"");
		$('#versionModal').modal('show');
	});
	$('#baseVersionForm').on('click', 'button[name="rowDisable"]', function() {
		var rowData = $('#baseVersionForm').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('系统提示', '你确认要删除版本号为【' + rowData.version + '】的版本信息吗?？', function(){
			$.ajax({
				type : 'post',
				url : 'cpBase/SubjectManage.deleteVersion.json',
				data : {
					menuId : window.sys_menuId,
					systemId: systemId,
					param1 : rowData.autoId
				},
				dataType : 'json',
				success : function(data) {
					$('#baseVersionForm').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	$('#baseVersionForm').on('click', 'button[name="rowEdit"]', function() {
		var rowData = $('#baseVersionForm').DataTable().data()[$(this).closest('tr').index()];
		$('#version').val(rowData.version);
		$('#versionTime').val(getMyDate(rowData.versionTime));
		$('#svnVserion').val(rowData.svnVersion);
		$('#vserionAutoId').val(rowData.autoId);
		$('#versionModal').modal('show');
		$('#versionContent').summernote('code',rowData.content);
	});
	function getQueryString(url, name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");// 匹配目标参数
		var result = url.substr(1).match(reg);// 对querystring匹配目标参数
		if (result != null) {
			return decodeURIComponent(result[2]);
		} else {
			return null;
		}
	}

});