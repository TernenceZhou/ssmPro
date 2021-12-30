$('.date-picker').datepicker({
	autoclose: true,
	todayHighlight: true,
	language: 'zh-CN',
	format: 'yyyy-MM-dd'
});

$('input[type="radio"][name="mater_use"]').click(function() {
	materCalcu($(this).attr('data-result'));
});

$('input[type="text"][name="mater_number"], input[type="number"][name="mater_rate"]').change(function() {
	materCalcu($(this).attr('data-result'));
});

$('input[type="number"][name="mater_surerate"]').change(function() {
	if ($('#mater_surenum').val() != '' && $(this).val() != '') {
		$('input[type="text"][name="mater_sureratenum"][data-result="' + $(this).attr('data-result') + '"]').val(($('#mater_surenum').val() * $(this).val() / 100).toFixed(4));
	} else {
		$('input[type="text"][name="mater_sureratenum"][data-result="' + $(this).attr('data-result') + '"]').val('');
	}
});

function materCalcu(data_result) {
	var num = $('input[type="text"][name="mater_number"][data-result="' + data_result + '"]').val();
	var rate = $('input[type="number"][name="mater_rate"][data-result="' + data_result + '"]').val();
	if ($('input[type="radio"][name="mater_use"]:checked').attr('data-result') == data_result) {
		if (num != '' && rate != '') {
			$('#mater_surenum, input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val((num * rate / 100).toFixed(4));
			$('input[type="text"][name="mater_sureratenum"]').each(function() {
				if ($('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() != '') {
					$(this).val(($('#mater_surenum').val() * $('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() / 100).toFixed(4));
				} else {
					$(this).val('');
				}
			});
		} else {
			$('#mater_surenum, input[type="text"][name="mater_sureratenum"], input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val('');
		}
	} else {
		if (num != '' && rate != '') {
			$('input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val((num * rate / 100).toFixed(4));
		} else {
			$('input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val('');
		}
	}
}

function getNowDate() {
//	if(val!=null){
//		return val;
//	}
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) month = '0' + month;
	if (day < 10) day = '0' + day;
	var hours = date.getHours();
	var mins = date.getMinutes();
	var sec = date.getSeconds();
	return date.getFullYear() + '-' + month + '-' + day;
}


$('#mater_form').validate({
	errorClass: 'help-block text-right animated fadeInDown',
	errorElement: 'div',
	onkeyup: function(e) {
		$(e).valid();
	},
	//onblur : true,
	errorPlacement: function(error, e) {
		$(e).parents('.form-group > div').append(error);
	},
	highlight: function(e) {
		$(e).closest('.form-group').removeClass('has-error').addClass('has-error');
		$(e).closest('.help-block').remove();
	},
	success: function(e) {
		$(e).closest('.form-group').removeClass('has-error');
		$(e).closest('.help-block').remove();
	},
	/*
	onblur : true,
	ignore : [],
	errorClass : 'help-block text-right animated fadeInUp',
	errorElement : 'div',
	errorPlacement : function(error, e) {
		$(e).closest('td').append(error);
	},
	highlight : function(e) {
		var elem = $(e);
		elem.closest('td').removeClass('has-error')
				.addClass('has-error');
		elem.closest('.help-block').remove();
	},
	success : function(e) {
		var elem = $(e);
		elem.closest('td').removeClass('has-error');
		elem.closest('.help-block').remove();
	},*/
	submitHandler: function() {
		formSubmit();
	},
	rules: {
		'mater_number': {required: true}
	},
	messages: {
		'mater_number': '请输入'
	}
});

function formSubmit() {
	var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
	var valid = $('#mater_form').valid();
	if (!valid) {
		return;
	}
	if (settingType == '1') {
		var num = $('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val();
		if (num == null || num == '') {
			$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
	} else if (settingType == '2') {
		var num = $('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val();
		if (num == null || num == '') {
			$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
	} else if (settingType == '3') {
		var num = $('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val();
		if (num == null || num == '') {
			$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
	} else {
		var num = $('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val();
		if (num == null || num == '') {
			$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
	}
	$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error');
	$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error');
	$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error');
	$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error');

	var formParam = {
		projectId: window.CUR_PROJECTID,
		materIndex: $('input[name="mater_index"]').val(),
//		editUser : $('input[name="mater_editer"]').val(),
		editUser: window.sys_userId,
		editDate: $('input[name="mater_editdate"]').val(),
//		auditedUnit : $('input[name="mater_unit"]').val(),
//		reviewUser : $('input[name="mater_reviewer"]').val(),
//		reviewDate : $('input[name="mater_reviewdate"]').val(),
//		belongDate : $('input[name="mater_date"]').val(),
		reason: $('textarea[name="mater_reason"]').val(),
//		auditUser : $('input[name="mater_auditer"]').val(),
//		auditDate : $('input[name="mater_auditdate"]').val(),
		settingType: settingType,
		settingTypeValue1: $('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val(),
		settingTypeValue2: $('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val(),
		settingValue1: $('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val(),
		settingRate1: $('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').val(),
		settingImportValue1: $('input[type="text"][name="mater_ratenum"][data-result="' + 1 + '"]').val(),
		settingRateOne1: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
		settingRateTwo1: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
		settingValue2: $('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val(),
		settingRate2: $('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').val(),
		settingImportValue2: $('input[type="text"][name="mater_ratenum"][data-result="' + 2 + '"]').val(),
		settingRateOne2: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
		settingRateTwo2: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
		settingValue3: $('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val(),
		settingRate3: $('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').val(),
		settingImportValue3: $('input[type="text"][name="mater_ratenum"][data-result="' + 3 + '"]').val(),
		settingRateOne3: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
		settingRateTwo3: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
		settingValue4: $('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val(),
		settingRate4: $('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').val(),
		settingImportValue4: $('input[type="text"][name="mater_ratenum"][data-result="' + 4 + '"]').val(),
		settingRateOne4: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
		settingRateTwo4: $('input[type="number"][name="mater_surerate"][data-result="2"]').val()
	};
	$.ajax({
		type: 'post',
		url: 'dgCenter/MaterialitySetting.materSetting.json',
		dataType: 'json',
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: JSON.stringify(formParam)
		},
		success: function(data) {
			if (data.success) {
				bdoSuccessBox('成功', data.resultInfo.statusText);
			} else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
}

$.ajax({
	type: 'post',
	url: 'dgCenter/MaterialitySetting.queryMater.json',
	dataType: 'json',
	data: {
		customerId: window.CUR_CUSTOMERID,
		projectId: window.CUR_PROJECTID,
		param1: window.CUR_PROJECTID
	},
	success: function(data) {
		if (data.data[0].data) {
			var object = data.data[0].data;
			$('input[name="mater_index"]').val(object.materIndex);
			if (data.data[0].userName == null || data.data[0].userName == '') {
				$('input[name="mater_editer"]').val('');
			} else {
				$('input[name="mater_editer"]').val(data.data[0].userName);
			}
			if (object.editDate == '' || object.editDate == null) {
				$('input[name="mater_editdate"]').val(getNowDate());
			} else {
				$('input[name="mater_editdate"]').val(object.editDate);
			}
//		 	$('input[name="mater_unit"]').val(object.auditedUnit);
//		 	$('input[name="mater_reviewer"]').val(object.reviewUser);
//		 	$('input[name="mater_reviewdate"]').val(object.reviewDate);
//		 	$('input[name="mater_date"]').val(object.belongDate);
			$('textarea[name="mater_reason"]').val(object.reason);
//		 	$('input[name="mater_auditer"]').val(object.auditUser);
//		 	$('input[name="mater_auditdate"]').val(object.auditDate);
			$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val(object.settingValue1);
			$('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').val(object.settingRate1);
			$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne1);
			$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo1);
			$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val(object.settingValue2);
			$('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').val(object.settingRate2);
			$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne2);
			$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo2);
			$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val(object.settingValue3);
			$('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').val(object.settingRate3);
			$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne3);
			$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo3);
			$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val(object.settingValue4);
			$('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').val(object.settingRate4);
			$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne4);
			$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo4);
			$('input[type="radio"][name="mater_use"][data-result="' + object.settingType + '"]').attr('checked', 'checked');
			var arr = ['1', '2', '3', '4'];
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] != object.settingType) {
					materCalcu(arr[i]);
				}
			}
			materCalcu(object.settingType);
		}
	}
});