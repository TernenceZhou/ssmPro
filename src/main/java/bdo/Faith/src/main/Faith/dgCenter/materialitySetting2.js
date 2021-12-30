$(document).ready(function() {
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN',
		format: 'yyyy-MM-dd'
	});

	$('#mater_form').find('.form-group').eq(5).find('.has-success').find('input').on('keyup', function() {
		$(this).parents('.form-group').find('.error').remove();
		if ($(this).val() < 50 || $(this).val() > 75 || Number($(this).val()) == NaN) {
			$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
				'<i class="fa fa-exclamation-triangle"></i>' +
				'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
				'</div>');
		}
	});

	$('#mater_form').find('.form-group').eq(6).find('.has-success').find('input').on('keyup', function() {
		$(this).parents('.form-group').find('.error').remove();
		if ($(this).val() < 1 || $(this).val() > 10 || Number($(this).val()) == NaN) {
			$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
				'<i class="fa fa-exclamation-triangle"></i>' +
				'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
				'</div>');
		}
	});

	$('input[type="radio"][name="mater_use"]').click(function() {
		materCalcu($(this).attr('data-result'));
		var tparent = $(this).parent().parent();
		tparent.parent().parent().find('.has-success').find('input').attr('disabled', 'disabled');
		tparent.next().find('input').removeAttr('disabled');
		tparent.parent().find('.has-success').find('input').removeAttr('disabled');
		$('#mater_form').find('.form-group').eq(5).find('.has-success').find('input').removeAttr('disabled');
		$('#mater_form').find('.form-group').eq(6).find('.has-success').find('input').removeAttr('disabled');
		var setVd = function(index, min, max) {
			$('.form-group').eq(2).find('.error').remove();
			$('.form-group').eq(3).find('.error').remove();
			$('.form-group').eq(4).find('.error').remove();
			$('.form-group').eq(5).find('.error').remove();
			$('#mater_form').find('.form-group').eq(index).find('.has-success').find('input[name="mater_rate"]').on('keyup', function() {
				$(this).parents('.form-group').find('.error').remove();
				if ($(this).val() < min || $(this).val() > max || Number($(this).val()) == NaN) {
					$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
						'<i class="fa fa-exclamation-triangle"></i>' +
						'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
						'</div>');
				}
			});
		};
		if ($(this).attr('data-result') == 1) {
			setVd(1, 0.5, 1);
		} else if ($(this).attr('data-result') == 2) {
			setVd(2, 3, 10);
		} else if ($(this).attr('data-result') == 3) {
			setVd(3, 1, 5);
		} else if ($(this).attr('data-result') == 4) {
			setVd(4, 0.5, 2);
		}
		tparent.parent().find('.has-success').find('input').keyup();
	});

	$('input[type="number"][name="mater_surerate"]').mousewheel(function(e) {
		var me = $(this);
		$(this).keyup();

		function remove(min, max) {
			if (e.deltaY == -1 && me.val() > max) {
				me.parents('.form-group').find('.error').remove();
			} else if (e.deltaY == 1 && me.val() < min) {
				me.parents('.form-group').find('.error').remove();
			}
		}

		if ($(this).attr('data-result') == 1) {
			remove(50, 75);
		} else if ($(this).attr('data-result') == 2) {
			remove(1, 10);
		}
	});

	$('input[type="text"][name="mater_number"], input[type="number"][name="mater_rate"]').mousewheel(function(e) {
		var me = $(this);
		$(this).keyup();

		function remove(min, max) {
			if (e.deltaY == -1 && me.val() > max) {
				me.parents('.form-group').find('.error').remove();
			} else if (e.deltaY == 1 && me.val() < min) {
				me.parents('.form-group').find('.error').remove();
			}
		}

		if ($(this).attr('data-result') == 1) {
			remove(.5, 1);
		} else if ($(this).attr('data-result') == 2) {
			remove(3, 10);
		} else if ($(this).attr('data-result') == 3) {
			remove(1, 5);
		} else if ($(this).attr('data-result') == 4) {
			remove(.5, 2);
		}
	});

	$('input[type="text"][name="mater_number"], input[type="number"][name="mater_rate"]').change(function(e) {
		if ($(this).attr('name') == 'mater_number') {
			var val = getNum($(this).val());
			if (isNaN(val * 1)) {
				$(this).val('');
				$(this).attr('placeholder', '请输入正确的金额');
			} else {
				$(this).val(getMn(val * 1));
				materCalcu($(this).attr('data-result'));
			}
		} else {
			materCalcu($(this).attr('data-result'));
		}
	});

	$('input[type="number"][name="mater_surerate"]').change(function() {
		if ($('#mater_surenum').val() != '' && $(this).val() != '') {
			$('input[type="text"][name="mater_sureratenum"][data-result="' + $(this).attr('data-result') + '"]').val(getMn(getNum($('#mater_surenum').val()) * $(this).val() / 100));
		} else {
			$('input[type="text"][name="mater_sureratenum"][data-result="' + $(this).attr('data-result') + '"]').val('');
		}
	});

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

	function getNum(str) {
		if(str){
			var reg = new RegExp(',', 'g');//g,表示全部替换
			str = str.replace(reg, '');
		}
		return str;
	}

	function materCalcu(data_result) {
		var num = getNum($('input[type="text"][name="mater_number"][data-result="' + data_result + '"]').val());
		var rate = $('input[type="number"][name="mater_rate"][data-result="' + data_result + '"]').val();
		$('input[type="text"][name="mater_procent"]').val(rate);
		if ($('input[type="radio"][name="mater_use"]:checked').attr('data-result') == data_result) {
			if (num != '' && rate != '') {
				$('#mater_surenum, input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val(getMn(num * rate / 100));
				$('input[type="text"][name="mater_sureratenum"]').each(function() {
					if ($('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() != '') {
						$(this).val(getMn(getNum($('#mater_surenum').val()) * $('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() / 100));
					} else {
						$(this).val('');
					}
				});
			} else {
				$('#mater_surenum, input[type="text"][name="mater_sureratenum"], input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val('');
			}
		} else {
			if (num != '' && rate != '') {
				$('input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val(getMn(num * rate / 100));
			} else {
				$('input[type="text"][name="mater_ratenum"][data-result="' + data_result + '"]').val('');
			}
		}
	}

	function getNowDate() {
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

	$('#mater_set').click(function() {
		var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
		$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_surerate"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error');
		$('input[type="number"][name="mater_surerate"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error');
		$('textarea').closest('.form-group').removeClass('has-error');
		$('#warnInfo').remove();
		if (settingType == '1') {
			var num = getNum($('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val());
			var rate = $('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').val();
			if (num == null || num == '') {
				$('#warnInfo').remove();
				$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
			if (rate == null || rate == '') {
				$('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
		} else if (settingType == '2') {
			var num = getNum($('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val());
			var rate = $('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').val();
			if (num == null || num == '') {
				$('#warnInfo').remove();
				$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
			if (rate == null || rate == '') {
				$('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
		} else if (settingType == '3') {
			var num = getNum($('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val());
			var rate = $('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').val();
			if (num == null || num == '') {
				$('#warnInfo').remove();
				$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
			if (rate == null || rate == '') {
				$('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
		} else if (settingType == '4') {
			var num = getNum($('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val());
			var rate = $('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').val();
			if (num == null || num == '') {
				$('#warnInfo').remove();
				$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
			if (rate == null || rate == '') {
				$('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').closest('.form-group').removeClass('has-error').addClass('has-error');
				$('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
				return;
			}
		}

		var sureratenum1 = $('input[type="number"][name="mater_surerate"][data-result="1"]').val();
		var sureratenum2 = $('input[type="number"][name="mater_surerate"][data-result="2"]').val();
		if (sureratenum1 == null || sureratenum1 == '') {
			$('input[type="number"][name="mater_surerate"][data-result="1"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="number"][name="mater_surerate"][data-result="1"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
		if (sureratenum2 == null || sureratenum2 == '') {
			$('input[type="number"][name="mater_surerate"][data-result="2"]').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('input[type="number"][name="mater_surerate"][data-result="2"]').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}
		var mareason = $('textarea[name="mater_reason"]').val();
		if (mareason == null || mareason == '') {
			$('textarea').closest('.form-group').removeClass('has-error').addClass('has-error');
			$('textarea').parents('.form-group > div').append('<div id="warnInfo" class="help-block text-right animated fadeInDown">请输入</div>');
			return;
		}

		//不在范围内的数字禁止提交
		if ($('#mater_form .error').length > 0) {
			$('#mater_form .error').hide().fadeIn(500);
			return;
		}


		var formParam = {
			projectId: window.CUR_PROJECTID,
			customerId: window.CUR_CUSTOMERID,
			materIndex: $('input[name="mater_index"]').val(),
			editUser: window.sys_userId,
			editDate: $('input[name="mater_editdate"]').val(),
			reason: $('textarea[name="mater_reason"]').val(),
			settingType: settingType,
			settingTypeValue1: getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val()),
			settingTypeValue2: getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val()),
			settingValue1: getNum($('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val()),
			settingRate1: $('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').val(),
			settingImportValue1: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 1 + '"]').val()),
			settingRateOne1: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
			settingRateTwo1: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			settingValue2: getNum($('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val()),
			settingRate2: $('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').val(),
			settingImportValue2: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 2 + '"]').val()),
			settingRateOne2: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
			settingRateTwo2: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			settingValue3: getNum($('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val()),
			settingRate3: $('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').val(),
			settingImportValue3: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 3 + '"]').val()),
			settingRateOne3: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
			settingRateTwo3: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			settingValue4: getNum($('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val()),
			settingRate4: $('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').val(),
			settingImportValue4: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 4 + '"]').val()),
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
	});

	$.ajax({
		type: 'post',
		//url: 'dgCenter/MaterialitySetting.queryMater.json',
		url: 'dgCenter/DgGeneral.query.json',
		dataType: 'json',
		data: {
			menuId: window.sys_menuId,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			sqlId: 'DG00085',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID
		},
		success: function(data) {
			if (data.success) {
				var object = data.data[0];
				if (!object || data.data.length == 0) return;
				$('input[name="mater_index"]').val(object.materIndex);
				$('input[name="mater_editer"]').val(object.__ueditUserName);

				/*if (object.userName == null || object.userName == "") {
					$('input[name="mater_editer"]').val("");
				} else {
					$('input[name="mater_editer"]').val(object.__ueditUserName);
				}*/

				if (object.editDate == '' || object.editDate == null) {
					$('input[name="mater_editdate"]').val(getNowDate());
				} else {
					$('input[name="mater_editdate"]').val(object.editDate);
				}
				$('textarea[name="mater_reason"]').val(object.reason);
				$('input[type="text"][name="mater_number"][data-result="' + 1 + '"]').val(getMn(object.settingValue1 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 1 + '"]').val(object.settingRate1);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne1);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo1);
				$('input[type="text"][name="mater_number"][data-result="' + 2 + '"]').val(getMn(object.settingValue2 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 2 + '"]').val(object.settingRate2);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne2);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo2);
				$('input[type="text"][name="mater_number"][data-result="' + 3 + '"]').val(getMn(object.settingValue3 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 3 + '"]').val(object.settingRate3);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne3);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo3);
				$('input[type="text"][name="mater_number"][data-result="' + 4 + '"]').val(getMn(object.settingValue4 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 4 + '"]').val(object.settingRate4);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne4);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo4);
				$('input[type="radio"][name="mater_use"][data-result="' + object.settingType + '"]').attr('checked', 'checked');
				$('input[type="radio"][name="mater_use"][data-result="' + object.settingType + '"]').click();
				$('#mater_form').find('.form-group').eq(5).find('.has-success').find('input').keyup();
				$('#mater_form').find('.form-group').eq(6).find('.has-success').find('input').keyup();
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

	listener = () => {
		/*$("#upload").click(event => {
			$('#materuploadTplFormModal').modal('show');
		});*/
	};

	mount = () => {
		listener();
	};
	mount();

});