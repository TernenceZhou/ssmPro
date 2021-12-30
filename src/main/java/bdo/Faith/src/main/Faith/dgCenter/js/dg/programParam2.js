var modalInitMethod = {
	modal1(agrs) {
		var displayText1 = '';
		var displayText2 = '';
		switch (agrs.rowData.typeId) {
			case 154 :
				// 固定资产增减变动表
				displayText1 = '累计折旧';
				displayText2 = '固定资产减值准备';
				break;
			case 20 :
				// 生产性生物资产
				displayText1 = '生产性生物资产累计折旧';
				displayText2 = '生产性生物资产减值准备';
				break;
			case 21 :
				// 油气资产
				displayText1 = '油气资产累计折旧';
				displayText2 = '油气资产减值准备';
				break
			case 22 :
				// 无形资产
				displayText1 = '累计摊销';
				displayText2 = '无形资产减值准备';
				break;
			case 139 :
				// 使用权资产明细表
				displayText1 = '使用权资产累计折旧';
				displayText2 = '使用权资产减值准备';
				break
		}
		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'dg_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'dg_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: ''
						+ '<div class="row">'
						+ 	'<div class="has-primary">'
						+ 		'<div class="col-sm-3">'
						+ 			'<div class="form-material input-group">'
						+ 				'<input class="form-control" type="text" id="customer_subjectId1" style="width: 200px;">'
						+ 				'<label for="customer_subjectId1">' + displayText1 + '：</label>'
						+ 			'</div>'
						+ 		'</div>'
						+ 		'<div class="col-sm-3">'
						+ 			'<div class="form-material input-group" style="margin-left: 80px;">'
						+ 				'<input class="form-control" type="text" id="customer_subjectId2" style="width: 200px;">'
						+ 				'<label for="customer_subjectId2">' + displayText2 + '：</label>'
						+ 			'</div>'
						+ 		'</div>'
						+ 	'</div>'
						+ '</div>'
				}
			]
		});

		(function(){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00435',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: displayText1,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data && data.data[0] && data.data[0].userSubjectId && data.data[0].userSubjectId != ''){
							$('#customer_subjectId1').val(data.data[0].userSubjectId);
						}
					}
				}
			});
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00435',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: displayText2,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data && data.data[0] && data.data[0].userSubjectId && data.data[0].userSubjectId != ''){
							$('#customer_subjectId2').val(data.data[0].userSubjectId);
						}
					}
				}
			});
			$('#programParamModal').modal('show');
		})();

		$('#customer_subjectId1').click(function() {
			$('#modal_customer_subjectid1').modal('show');
			if ($('#customer_subject_tree1').hasClass('treeview')) {
				return;
			}
			$('#customer_subject_tree1').tree({
				url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput1'
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
		$('#modal_customer_subject_sure1').click(function() {
			var selectValue = $('#customer_subject_tree1').tree('getTreeMultiValue');
			if (typeof(selectValue) === 'object') {
				$('#customer_subjectId1').val('');
			} else {
				$('#customer_subjectId1').val(selectValue);
			}
			$('#modal_customer_subjectid1').modal('hide');
			$('#customer_subject_tree1').tree('reset');
		});
		$('#modal_customer_subject_reset1').click(function() {
			$('#modal_customer_subjectid1').modal('hide');
			$('#customer_subject_tree1').tree('reset');
		});
		$('#customer_subjectId2').click(function() {
			$('#modal_customer_subjectid2').modal('show');
			if ($('#customer_subject_tree2').hasClass('treeview')) {
				return;
			}
			$('#customer_subject_tree2').tree({
				url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput2'
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
		$('#modal_customer_subject_sure2').click(function() {
			var selectValue = $('#customer_subject_tree2').tree('getTreeMultiValue');
			if (typeof(selectValue) === 'object') {
				$('#customer_subjectId2').val('');
			} else {
				$('#customer_subjectId2').val(selectValue);
			}
			$('#modal_customer_subjectid2').modal('hide');
			$('#customer_subject_tree2').tree('reset');
		});
		$('#modal_customer_subject_reset2').click(function() {
			$('#modal_customer_subjectid2').modal('hide');
			$('#customer_subject_tree2').tree('reset');
		});

		$('#dg_close').click(function() {
			$('#programParamModal').modal('hide');
		});
		var param = JSON.parse(agrs.rowData.dgparam);
		if (param != null) {
			$('#customer_subjectId1').val(param.subjectId1);
			$('#customer_subjectId2').val(param.subjectId2);
		}
		// 生成
		$('#dg_generate').click(function() {
			var data = {};
			data.subjectId1 = $('#customer_subjectId1').val();
			data.subjectId2 = $('#customer_subjectId2').val();
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
	},
	modal2(agrs) {
		$('#programParamModal').modal('show');

		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'tb_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'tb_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'tb_autoid',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					}
				}, {
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: '<label class="css-input css-radio css-radio-primary">'
						+ '银行账户来源：<input type="radio" name="mater_use" data-result="3" checked="checked"><span></span>'
						+ '</label>科目'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="1"><span></span>'
						+ '</label>科目下辅助核算'
				}
				, {
					id: 'accountass_assitemid',
					type: 'input',
					label: '核算类型',
					typeAttr: {
						normal: true,
						hidden: true
					},
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1
				}
			]
		});
		$('[for=accountass_assitemid]').hide();
		$('#accountass_assitemid').hide();
		var param = JSON.parse(agrs.rowData.dgparam);
		if (param != null) {
			if (param.accountSource == 1) {
				$('[name=\'mater_use\'][data-result=1]').attr('checked', 'checked');
			}else if (param.accountSource == 3) {
				$('[name=\'mater_use\'][data-result=3]').attr('checked', 'checked');
			}
		}
		$('#modalHideBtn').click(function() {
			$('#programParamModal').modal('hide');
		});
		$('#tb_close').click(function() {
			$('#programParamModal').modal('hide');
		});

		$('[name=\'mater_use\']').change(function() {
			if ($(this).attr('data-result') == '1' || $(this).attr('data-result') == '3') {
				$('#accountass_assitemid').hide();
				$('[for=accountass_assitemid]').hide();
				$('#caret_accountass_assitemid').hide();
			} else {
				$('#accountass_assitemid').show();
				$('[for=accountass_assitemid]').show();
				$('#caret_accountass_assitemid').show();
			}
		});
		// 生成
		$('#tb_generate').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
		$('#modal_assitem_sure').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			var dt = $('#assitem_z_tree').treeview(true).getChecked();
			var selectedLabel = '';
			var selectedValue = '';
			for(var list of dt){
				selectedLabel = selectedLabel + ',' + list.label;
				selectedValue = selectedValue + ',' + list.value;
			}
			$('#accountass_assitemid').val(selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-content', selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-result', selectedValue.substring(1));
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#modal_assitem_reset').click(function() {
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#accountass_assitemid').focus(function() {
			$('#modal_assitemid').modal('show');
			$('#assitem_z_tree').tree2({
				url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput3',
					param11: agrs.rowData.subjectId,
					param19: $('#searchInput3').val()
				},
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
	},
	modal3(agrs) {
		$('#programParamModal').modal('show');

		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'dg_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'dg_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: '<label>会计科目级数：</label>'
						+ '<label class="css-input css-radio css-radio-primary">'
						+ '<input type="radio" name="mater_use" data-result="1" checked="checked"><span></span>'
						+ '</label>一级科目'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="2"><span></span>'
						+ '</label>二级科目'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="3"><span></span>'
						+ '</label>三级科目'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="4"><span></span>'
						+ '</label>末级科目'
				}
			]
		});
		$('#dg_close').click(function() {
			$('#programParamModal').modal('hide');
		});
		// 生成
		$('#dg_generate').click(function() {
			var data = {};
			data.subjectLevel = $('[name=\'mater_use\']:checked').attr('data-result');
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
	},
	modal4(agrs) {
		$('#programParamModal').modal('show');
		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'tb_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'tb_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'tb_autoid',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					}
				}, {
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: '<label class="css-input css-radio css-radio-primary">'
						+ '辅助核算来源：'
						+ '<input type="radio" name="mater_use" data-result="1" checked="checked"><span></span>'
						+ '</label>科目下辅助核算'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="2"><span></span>'
						+ '</label>辅助核算类型'
				}
				, {
					id: 'accountass_assitemid',
					type: 'input',
					label: '核算类型',
					typeAttr: {
						normal: true,
						hidden: true
					},
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1
				}
			]
		});
		$('[for=accountass_assitemid]').hide();
		$('#accountass_assitemid').hide();
		var param = JSON.parse(agrs.rowData.dgparam);
		if (param != null) {
			if (param.accountSource == 1) {
				$('[name=\'mater_use\'][data-result=1]').attr('checked', 'checked');
			} else {
				$('[name=\'mater_use\'][data-result=2]').attr('checked', 'checked');
				$('[for=accountass_assitemid]').show();
				$('#accountass_assitemid').val(param.accountingType);
				$('#accountass_assitemid').show();

			}
		}
		$('#modalHideBtn').click(function() {
			$('#programParamModal').modal('hide');
		});
		$('#tb_close').click(function() {
			$('#programParamModal').modal('hide');
		});

		$('[name=\'mater_use\']').change(function() {
			if ($(this).attr('data-result') == '1') {
				$('#accountass_assitemid').hide();
				$('[for=accountass_assitemid]').hide();
				$('#caret_accountass_assitemid').hide();
			} else {
				$('#accountass_assitemid').show();
				$('[for=accountass_assitemid]').show();
				$('#caret_accountass_assitemid').show();
			}
		});
		// 生成
		$('#tb_generate').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			if (data.accountSource == '2' && !$('#programParamForm').valid()) {
				return;
			}
			if (data.accountSource == '2') {
				data.accountingType = $('#accountass_assitemid').val();
			}
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
		$('#modal_assitem_sure').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			var dt = $('#assitem_z_tree').treeview(true).getChecked();
			var selectedLabel = '';
			var selectedValue = '';
			for(var list of dt){
				selectedLabel = selectedLabel + ',' + list.label;
				selectedValue = selectedValue + ',' + list.value;
			}
			$('#accountass_assitemid').val(selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-content', selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-result', selectedValue.substring(1));
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#modal_assitem_reset').click(function() {
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#accountass_assitemid').focus(function() {
			$('#modal_assitemid').modal('show');
			$('#assitem_z_tree').tree2({
				url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput2',
					param11: agrs.rowData.subjectId,
					param19: $('#searchInput2').val()
				},
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
	},
	modal5(agrs) {
		$('#programParamModal').modal('show');
		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'tb_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'tb_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'tb_autoid',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					}
				}, {
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: '<label class="css-input css-radio css-radio-primary">'
						+ '数据来源：'
						+ '<input type="radio" name="mater_use" data-result="3"><span></span>'
						+ '</label>科目'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="1" checked="checked"><span></span>'
						+ '</label>科目下辅助核算'
						+ '<label class="css-input css-radio css-radio-primary" style="margin-left:30px;">'
						+ '<input type="radio" name="mater_use" data-result="2"><span></span>'
						+ '</label>辅助核算类型'
				}
				, {
					id: 'accountass_assitemid',
					type: 'input',
					label: '核算类型',
					typeAttr: {
						normal: true,
						hidden: true
					},
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1
				}
			]
		});
		$('[for=accountass_assitemid]').hide();
		$('#accountass_assitemid').hide();
		var param = JSON.parse(agrs.rowData.dgparam);
		if (param != null) {
			if (param.accountSource == 1) {
				$('[name=\'mater_use\'][data-result=1]').attr('checked', 'checked');
			} else if (param.accountSource == 3) {
				$('[name=\'mater_use\'][data-result=3]').attr('checked', 'checked');
			} else {
				$('[name=\'mater_use\'][data-result=2]').attr('checked', 'checked');
				$('[for=accountass_assitemid]').show();
				$('#accountass_assitemid').val(param.accountingType);
				$('#accountass_assitemid').show();

			}
		}
		$('#modalHideBtn').click(function() {
			$('#programParamModal').modal('hide');
		});
		$('#tb_close').click(function() {
			$('#programParamModal').modal('hide');
		});

		$('[name=\'mater_use\']').change(function() {
			if ($(this).attr('data-result') == '1' || $(this).attr('data-result') == '3') {
				$('#accountass_assitemid').hide();
				$('[for=accountass_assitemid]').hide();
				$('#caret_accountass_assitemid').hide();
			} else {
				$('#accountass_assitemid').show();
				$('[for=accountass_assitemid]').show();
				$('#caret_accountass_assitemid').show();
			}
		});
		// 生成
		$('#tb_generate').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			if (data.accountSource == '2' && !$('#programParamForm').valid()) {
				return;
			}
			if (data.accountSource == '2') {
				data.accountingType = $('#accountass_assitemid').val();
			}
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
		$('#modal_assitem_sure').click(function() {
			var data = {};
			data.accountSource = $('[name=\'mater_use\']:checked').attr('data-result');
			var dt = $('#assitem_z_tree').treeview(true).getChecked();
			var selectedLabel = '';
			var selectedValue = '';
			for(var list of dt){
				selectedLabel = selectedLabel + ',' + list.label;
				selectedValue = selectedValue + ',' + list.value;
			}
			$('#accountass_assitemid').val(selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-content', selectedLabel.substring(1));
			$('#accountass_assitemid').attr('data-result', selectedValue.substring(1));
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#modal_assitem_reset').click(function() {
			$('#modal_assitemid').modal('hide');
			$('#assitem_z_tree').tree2('reset');
		});
		$('#accountass_assitemid').focus(function() {
			$('#modal_assitemid').modal('show');
			$('#assitem_z_tree').tree2({
				url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput3',
					param11: agrs.rowData.subjectId,
					param19: $('#searchInput3').val()
				},
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
	},
	modal6(agrs) {
		var displayText = '';
		switch (agrs.rowData.typeId) {
			case 91 :
				// 分月收入、成本明细表
				displayText = '主营业务成本';
				break;
			case 99 :
				// 其他业务收入、成本明细表
				displayText = '其他业务成本';
				break;
			case 71 :
				// 递延所得税资产明细内容调整表
				displayText = '递延所得税负债';
				break
			case 74 :
				// 递延所得税负债明细内容调整表
				displayText = '递延所得税资产';
				break;
			case 155 :
				// 商誉明细表
				displayText = '商誉减值准备';
				break;
			case 130 :
				// 其他债权投资明细表
				displayText = '其他债权投资减值准备';
				break
			case 166 :
				// 债权投资明细表
				displayText = '债权投资减值准备';
				break;
			case 167 :
				// 长期股权投资明细表
				displayText = '长期股权投资减值准备';
				break;
			case 175 :
				// 制造费用明细表
				displayText = '生产成本';
				break;
			case 89 :
				// 主营业务收入、成本明细
				displayText = '主营业务成本';
				break;
		}
		$('#programParamForm').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'dg_generate',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;生成'
				}, {
					id: 'dg_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'generate_rule',
					type: '',
					label: '生成规则',
					html: '<div class="form-material">'
						+ '<label for="customer_subjectId">' + displayText + '：</label>'
						+ '<input type="text" class="form-control" style="width: 200px;" id="customer_subjectId">'
						+ '</div>'
				}
			]
		});

		(function(){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00435',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: displayText,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data && data.data[0] && data.data[0].userSubjectId && data.data[0].userSubjectId != ''){
							$('#customer_subjectId').val(data.data[0].userSubjectId);
						}
						$('#programParamModal').modal('show');
					}
				}
			});
		})();

		$('#customer_subjectId').click(function() {
			$('#modal_customer_subjectid').modal('show');
			if ($('#customer_subject_tree').hasClass('treeview')) {
				return;
			}
			$('#customer_subject_tree').tree({
				url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId : 'searchInput2'
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
		$('#modal_customer_subject_sure').click(function() {
			var selectValue = $('#customer_subject_tree').tree('getTreeMultiValue');
			if (typeof(selectValue) === 'object') {
				$('#customer_subjectId').val('');
			} else {
				$('#customer_subjectId').val(selectValue);

			}
			$('#modal_customer_subjectid').modal('hide');
			// $('#customer_subject_tree').tree('reset');
		});
		$('#modal_customer_subject_reset').click(function() {
			$('#modal_customer_subjectid').modal('hide');
			$('#customer_subject_tree').tree('reset');

		});
		$('#dg_close').click(function() {
			$('#programParamModal').modal('hide');
		});

		var param = JSON.parse(agrs.rowData.dgparam);
		if (param != null) {
			$('#customer_subjectId').val(param.subjectId);
		}
		// 生成
		$('#dg_generate').click(function() {
			var data = {};
			data.subjectId = $('#customer_subjectId').val();
			bdoInProcessingBox('生成中');
			agrs.generateDg(data);
		});
	},
	modal7(agrs) {
		(function(){
			$.ajax({
				type: 'post',
				url: 'finCenter/General.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'FIN900037',
					menuId: window.sys_menuId,
					param1: agrs.rowData.subjectId,
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data) {
							$("select[name='taxes_sort']").each(function () {
								$(this).append("<option value=''></option>");
								for(var list of data.data){
									// 222101004
									var subjectId = list.subjectId;
									// 出口退税
									var subjectName = list.subjectName;
									// 应交税费/增值税/出口退税
									var subjectFullName = list.subjectFullName;
									// 增值税销项税
									var text = $(this).parents('td').prev().find('label').text();
									if(subjectName == text){
										$(this).append("<option value='" + subjectId + "' title='" + subjectName + "' selected>" + subjectFullName + "</option>");
									}else{
										$(this).append("<option value='" + subjectId + "' title='" + subjectName + "' >" + subjectFullName + "</option>");
									}
								}
							});
							$('#programParamModal').modal('show');
						}
					}
				}
			});
		})();
		$('#programParamModal').on('show.bs.modal', function() {
			$('#dg_taxes_close').unbind('click');
			$('#dg_taxes_close').click(function() {
				$('#programParamModal').modal('hide');
			});
			var param = JSON.parse(agrs.rowData.dgparam);
			if (param != null) {
				$("select[name='taxes_sort']").each(function () {
					var id = $(this).attr('id').replace('taxes_', '');
					$(this).val(param['subjectId' + id]);
				});
			}
			// 生成
			$('#dg_taxes_generate').unbind('click');
			$('#dg_taxes_generate').click(function() {
				var data = {};
				$("select[name='taxes_sort']").each(function () {
					var id = $(this).attr('id').replace('taxes_', '');
					data['subjectId' + id] = $(this).val();
				});
				bdoInProcessingBox('生成中');
				agrs.generateDg(data);
			});
		});
	}
};

function programParamInit(agrs) {
	var template = tplLoader(agrs.rowData.paramHtmlPath);
	$('#programParamModalWrap').html(template);
	let methodName = $('#programParamModalWrap').find('[data-dgparam-method]').attr('data-dgparam-method');
	modalInitMethod[methodName](agrs);
}