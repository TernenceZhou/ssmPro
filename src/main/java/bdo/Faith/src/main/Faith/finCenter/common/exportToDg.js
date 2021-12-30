// 选择tb科目
function ecportToDg(customerId, customername, bgdata, onExport) {
	if (customerId == '') {
		bdoInfoBox('提示', '请选择客户');
		return;
	}

	$('#modal_tbsubjectid').modal('show');
	$('#modal_tbsubjectid_sure').attr('disabled', false);

	if ($('#tbsubject_tree').hasClass('treeview')) {

		$('#tbsubject_tree').tree('reset');
		$('#tbsubject_tree').tree('destory');

	}
	$('#tbsubject_tree').tree({
		url: 'cpBase/TreeCommon.findTbSubjectType.json',
		params: {
			param1: customerId,
			param2: customername
		},
		singleSelect: true,
		lazyLoad: false,
		onceLoad: true,
		view: {
			leafIcon: 'fa fa-building text-flat',
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: false,
			multiSelect: false,
			showCheckbox: false,
			selectedColor: '#fff',
			onlyLeafCheck: true,
			selectedBackColor: '#4ca2e8',
			singleSelect: true
		}
	});
	onExport && $('#modal_tbsubjectid_sure').click(onExport);
}

function huoqunode() {
	$('#modal_tbsubjectid_sure').attr('disabled', true);
	var tree = $('#tbsubject_tree').treeview(true);
	var node = tree.getSelected()[0];
	if (node == null || node == '') {
		bdoInfoBox('提示', '请选择底稿附件');
		$('#modal_tbsubjectid_sure').attr('disabled', false);
		return false;
	} else {

		let param = {};
		while (node.parentId != undefined) {
			if (node.typeName == 'filesubject') {
				//param.filesubject = encodeURI(node.id);
				param.filesubject = encodeURI(node.qtip);
				param.workpaperId = encodeURI(node.value);
				//workpaperID
			}
			if (node.typeName == 'shenjisubject') {
				param.shenjisubject = encodeURI(node.label);

			}

			if (node.typeName == 'project') {
				param.treeproject = encodeURI(node.id);
			}
			node = tree.getParent(node);
		}

		return param;
	}

}

function jsq(tableParam, tableId) {
	tableParam.initComplete = function(setting, json) {
		if (tableParam && tableParam.param1 == 'jsq') {
			var jsq = '<div class="row">'
				+ '<div class="col-sm-8">'
				+ '<div class="form-material">'
				+ '<input id="suanshi_' + tableId + '"  type="text" style="width: 100%" autocomplete="off">'
				+ '</div>'
				+ '</div>'
				+ '<div class="col-sm-1">'
				+ '<div class="form-material">=</div>'
				+ '</div>'
				+ '<div class="col-sm-2">'
				+ '<div class="form-material input-group">'
				+ '<input id="jieguo_' + tableId + '" type="text" style=" width: 100%" autocomplete="off">'
				+ '</div>'
				+ '</div>'
				+ '<div class="col-sm-1">'
				+ '<div class="form-material">'
				+ '<input type="button" class="btn btn-md btn-primary" style="font-size:medium;padding:1px" id="jsq_clear_' + tableId + '" value="reset">'
				+ '</input>'
				+ '</div>'
				+ '</div>'
				+ '</div>';
			$('#' + tableId + '_wrapper').append(jsq);
			/*	$('#'+tableId+'_info').parent().parent().siblings().eq(1).children('div:first-child').children().addClass('col-sm-2');
				$('#'+tableId+'_info').parent().parent().siblings().eq(1).children('div:first-child').children().css('display', 'inline-block');
				$('#'+tableId+'_info').parent().parent().siblings().eq(1).children('div:first-child').append(jsq);*/
			$('#jsq_clear_' + tableId).unbind();
			$('#jsq_clear_' + tableId).on('click', function() {
				$('#suanshi_' + tableId).val('');
				$('#jieguo_' + tableId).val('');
			});
		}
		var $this = $(this);
		var id = $this.attr('id');
		$('#' + id + '_info_next').off();
		$('#' + id + '_info_next').on('click', function() {
			$this.DataTable().ajax.reload();
		});
	};
}

function jsqcorresponding(tableId) {
	var jsq = '<div class="row">'
		+ '<div class="col-sm-8">'
		+ '<div class="form-material">'
		+ '<input id="suanshi_' + tableId + '"  type="text" style="width: 100%" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-sm-1">'
		+ '<div class="form-material">=</div>'
		+ '</div>'
		+ '<div class="col-sm-2">'
		+ '<div class="form-material input-group">'
		+ '<input id="jieguo_' + tableId + '" type="text" style=" width: 100%" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-sm-1">'
		+ '<div class="form-material">'
		+ '<input type="button" class="btn btn-md btn-primary" style="font-size:medium;padding:1px" id="jsq_clear_' + tableId + '" value="reset">'
		+ '</input>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	$('#' + tableId).prev().html('').append(jsq);
}

function jsqsamevoucher(tableId) {
	var jsq = '<div class="row">'
		+ '<div class="col-sm-8">'
		+ '<div class="form-material">'
		+ '<input id="suanshi_' + tableId + '"  type="text" style="width: 100%" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-sm-1">'
		+ '<div class="form-material">=</div>'
		+ '</div>'
		+ '<div class="col-sm-2">'
		+ '<div class="form-material input-group">'
		+ '<input id="jieguo_' + tableId + '" type="text" style=" width: 100%" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-sm-1">'
		+ '<div class="form-material">'
		+ '<input type="button" class="btn btn-md btn-primary" style="font-size:medium;padding:1px" id="jsq_clear_' + tableId + '" value="reset">'
		+ '</input>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	$('#' + tableId + '_count').prev().html('').append(jsq);
}

function fnInfoCallback(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
	var id = $(this).attr('id');

	if ($(id + '_info_next').length < 1) {
		return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">共 <b>' + iTotal + '</b>条' +
			' <a class="tableRefresh" id="' + id + '_info_next"><i class="fa fa-refresh" style="cursor:pointer;">刷新</i></a></div>';
	} else {
		return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">共 <b>' + iTotal + '</b>条' +
			' <a class="tableRefresh" id="' + id + '_info_next"><i class="fa fa-refresh" style="cursor:pointer;">刷新</i></a></div>';

	}
}

