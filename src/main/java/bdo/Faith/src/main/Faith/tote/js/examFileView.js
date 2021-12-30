/**
 * 右侧考试试卷一览
 */
var ExamFileViewPage = (agrs) => {
	var _template
		, _data
		, mount
		, listener
		, examId;

	_data = _data ? _data : agrs.data;
	_template = agrs.template || tplLoader('tote/html/examFileView.html');
	agrs.template = _template;

	examId = _data.extraOptions.examId;

	/**
	 * 事件绑定
	 */
	listener = () => {
		// 试卷一览--科目
		var createFileInfoDiv = (function () {
			$.ajax({
				type: 'post',
				url: 'cpBase/General.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'TOTE00007',
					param1: CUR_USERID,
					param2: examId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#fileInfoGroup').html('');
						var text = '<span class="icon node-icon fa fa-file-excel-o text-primary-light"></span>';
						for(var list of data.data){
							var signText = '<span class="badge">√</span>';
							if(list.examStatus != 2){
								signText = '<span class="badge">×</span>';
							}
							var txt = $('<li class="list-group-item node-' + list.autoId + '" data-nodeid="' + list.autoId + '" style="cursor: pointer;">'
								+ '&nbsp;&nbsp;'
								+ text
								+ '&nbsp;&nbsp;'
								+ list.examName + '--' + list.subjectName
								+ signText
								+ '</li>');
							$('#fileInfoGroup').append(txt);
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		})();
		$('.list-group li').on('click', function(event) {
			var autoId = $(event.currentTarget).attr('data-nodeid');
			$.ajax({
				type: 'post',
				url: 'tote/ToteExam.compareEndTime.json',
				data: {
					menuId: window.sys_menuId,
					param1: autoId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						var nodeData = {
							extraOptions: data.data[0].list,
							currentNode: {
								extraOptions: data.data[0].list
							}
						};
						if(data.data[0].result){
							nodeData.type = '1';
						}else{
							nodeData.type = '3';
						}
						$('#sideRegin').css('display', 'block');
						$('#sideRegin').html('');
						$.sessionStorage('fileNode', JSON.stringify(nodeData));
						var $div = $('<iframe id="iframe_tote_' + autoId + '" src="/Faith/bdotote.do?m=openToteExamFile" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
						$('#sideRegin').append($div);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
	};
	mount();

};