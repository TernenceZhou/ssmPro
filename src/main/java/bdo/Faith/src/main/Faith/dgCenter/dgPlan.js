(function() {
	// 前端初始化
	pageRightTitle(pageTitleArr); // 内容区title 
	uiBlocksApi(false, 'init'); // oneUI 初始化

	var currentNode, height = $('#main-container').height() - $('#pageHead').height() - 60; // 编辑区高度

	/**
	 * 获取审计科目目录接口
	 */
	/*var getSubjecttree = function(param, callback) {
		$.ajax({
			url: 'dgCenter/DgMain.getPlanSubjecttree.json',
			type: 'post',
			data: param,
			dataType: 'json',
			success: callback
		});
	};*/

	$('#spreadContentDir').bind('rebuildTree', (event, param, callback) => {
		getSubjecttree(param, callback);
	});
	/**
	 * 设置内容区高度
	 */
	$('#spreadContentDir').height((height + 60) + 'px');
	$('#subPageRight').height((height + 20) + 'px');

	$('.js-tree-collapsed').bind('rebuild', (event, options) => {
		$('.js-tree-collapsed').treeview({
			data: options.data,
			color: '#555',
			expandIcon: 'fa fa-plus',
			collapseIcon: 'fa fa-minus',
			onhoverColor: '#f9f9f9',
			selectedColor: '#000',
			selectedBackColor: '#f1f1f1',
			showTags: true,
			levels: options.levels
		});
		$('.js-tree-collapsed').on('nodeSelected', (event, node) => {
			switch (node.type) {
				case 'RCL':
					RcsPage({
						region: '#subPageRight', data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID
						}
					});
					break;
				case 'IMPL':
					MaterialityPage({
						region: '#subPageRight', data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID
						}
					});
					break;
				case 'PROJECT':
					SubjectPagePlan({region: '#subPageRight', data: node});
					break;
				case 'TBSUBJECT':
					break;
				case 'SUBJECT':
					//SubjectPage({region: '#subPageRight', data: node});
					EditProgramPage({region: '#subPageRight', data: node});
					break;
				case 'SCOPEDEF':
				case 'IRA':
				case 'DESIGNAUDIT':
					AttachListPage({region: '#subPageRight', data: node});
					break;
			}
			currentNode = node;
		});
		options.callback && options.callback($('.js-tree-collapsed').treeview(true));
	});
	/**
	 * 获取树结构
	 */
	getSubjecttree({
		customerId: window.CUR_CUSTOMERID,
		projectId: window.CUR_PROJECTID,
		param1: window.CUR_PROJECTID,
		param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
	}, (data) => {
		$('.js-tree-collapsed').trigger('rebuild', [{
			data: [data.data[0].treeData],
			levels: 2
		}]);
	});

	/**
	 * 隐藏右侧栏
	 */
	$('#toggleDir').click((event) => {
		$.when((() => {
			var def = new $.Deferred();
			$('.spread-content').toggleClass('spread-content-hidedir');
			$('#toggleDir .toggle-dir-icon').toggleClass('si-arrow-left');
			$('#toggleDir .toggle-dir-icon').toggleClass('si-arrow-right');
			$('#subPageRight').resize();
			return def;
		})()).done(() => {
			/*setTimeout(()=>{
				$('.dataTable').each((index, tb)=>{
					$(tb).dataTable().fnFixedTheadResize($(tb).dataTable());
				});
			}, 500);*/
		});
		/*setTimeout(()=>{
			$(document).resize();
		}, 550);*/
	});

	/**
	 * 全屏按钮事件
	 */
	$('#fullscreenBtn').click((event) => {
		$.when((() => {
			var def = new $.Deferred();
			var icon = $('#fullscreenBtn').find('i');
			var fullscreenFlg = icon.hasClass('si-size-actual');

			icon.toggleClass('si-size-fullscreen');
			icon.toggleClass('si-size-actual');
			$('.spread-content').toggleClass('spread-content-opt-fullscreen');
			var scheight = $('.spread-content').height();

			if (fullscreenFlg) {
				$('#spreadContentDir').height((height + 60) + 'px');
				$('#subPageRight').height((height + 20) + 'px');
			} else {
				$('#spreadContentDir').height('100%');
				$('#subPageRight').height((scheight - 40) + 'px');
			}
			$('#subPageRight').resize();
			return def;
		})()).done(() => {
			/*setTimeout(()=>{
				$('.dataTable').each((index, tb)=>{
					$(tb).dataTable().fnFixedTheadResize($(tb).dataTable());
				});
			}, 500);*/
		});
	});
	$('.js-tree-collapsed')[0].addEventListener('DOMSubtreeModified', function() {
		var list = $(this).find('.list-group-item');
		for (var i = 1; i < list.length; i++) {
			if (list.eq(i).height() !== 17) {
				$('#spreadContentDir .js-tree-collapsed').width(420);
				return;
			} else {
				$('#spreadContentDir .js-tree-collapsed').width('auto');
			}
		}
	}, false);
	$('.spread-content').css('overflow-y', 'hidden');
}());
