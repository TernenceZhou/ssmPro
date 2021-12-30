function MaterialitySetting(agrs) {
	let _template = agrs.template || tplLoader('dgCenter/html/dg/materialitySetting.html')
		, customerId = agrs.data.customerId
		, projectId = agrs.data.projectId;
	let mergerMateriality;
	$(agrs.region).html(_template);
	$('#mergerReport').hide();
	$('#mergeMateriality').hide();
	$('#headtitle').empty().text(agrs.data.htmlstr);
	/** 模态框设置 */
	/*	$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN',
		format: 'yyyy-MM-dd'
	});

	$('#mater_form').find('.form-group').eq(7).find('.has-success').find('input').on('keyup', function() {
		$(this).parents('.form-group').find('.error').remove();
		if ($(this).val() < 50 || $(this).val() > 90 || Number($(this).val()) == NaN) {
			$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
				'<i class="fa fa-exclamation-triangle"></i>' +
				'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
				'</div>');
		}
		$(this).parents('.form-group').find('.different').remove();
		var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
		if(mergerMateriality != null && mergerMateriality.settingType == settingType){
			if ($(this).val() != mergerMateriality['settingRateOne' + settingType]) {
				$(this).parents('.form-group').find('.different_reason').append('<div class="different btn btn-warning push-5-r push-10" style="min-width: 10px;" title="与合并项目不一致，请填写原因！" data-toggle="tooltip">' +
						'<i class="fa fa-exclamation-triangle"></i>' +
						'</div>');
			}
		}
	});

	$('#mater_form').find('.form-group').eq(8).find('.has-success').find('input').on('keyup', function() {
		$(this).parents('.form-group').find('.error').remove();
		if ($(this).val() < 1 || $(this).val() > 5 || Number($(this).val()) == NaN) {
			$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
				'<i class="fa fa-exclamation-triangle"></i>' +
				'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
				'</div>');
		}
		$(this).parents('.form-group').find('.different').remove();
		var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
		if(mergerMateriality != null && mergerMateriality.settingType == settingType){
			if ($(this).val() != mergerMateriality['settingRateTwo' + settingType]) {
				$(this).parents('.form-group').find('.different_reason').append('<div class="different btn btn-warning push-5-r push-10" style="min-width: 10px;" title="与合并项目不一致，请填写原因！" data-toggle="tooltip">' +
						'<i class="fa fa-exclamation-triangle"></i>' +
						'</div>');
			}
		}
	});

	$('input[type="radio"][name="mater_use"]').click(function() {
		materialityValue($(this).attr('data-result'));
		materCalcu($(this).attr('data-result'));
		var tparent = $(this).parent().parent();
		tparent.parent().parent().find('.has-success').find('input').attr('disabled', 'disabled');
		tparent.next().find('input').removeAttr('disabled');
		tparent.parent().find('.has-success').find('input').removeAttr('disabled');
		$('#mater_form').find('.form-group').eq(7).find('.has-success').find('input').removeAttr('disabled');
		$('#mater_form').find('.form-group').eq(8).find('.has-success').find('input').removeAttr('disabled');
		var setVd = function(index, min, max) {
			$('.form-group').eq(1).find('.error').remove();
			$('.form-group').eq(2).find('.error').remove();
			$('.form-group').eq(3).find('.error').remove();
			$('.form-group').eq(4).find('.error').remove();
			$('.form-group').eq(5).find('.error').remove();
			$('.form-group').eq(6).find('.error').remove();
			$('.form-group').eq(1).find('.different').remove();
			$('.form-group').eq(2).find('.different').remove();
			$('.form-group').eq(3).find('.different').remove();
			$('.form-group').eq(4).find('.different').remove();
			$('.form-group').eq(5).find('.different').remove();
			$('.form-group').eq(6).find('.different').remove();
			$('#different_reason_1').find('.different').remove();
			$('#different_reason_2').find('.different').remove();
			$('#different_reason_3').find('.different').remove();
			$('#different_reason_4').find('.different').remove();
			$('#different_reason_5').find('.different').remove();
			$('#different_reason_6').find('.different').remove();
			$('#mater_form').find('.form-group').eq(index).find('.has-success').find('input[name="mater_rate"]').on('keyup', function() {
				$(this).parents('.form-group').find('.error').remove();
				if ($(this).val() < min || $(this).val() > max || Number($(this).val()) == NaN) {
					$(this).parents('.form-group').find('#add').append('<div class="error btn btn-warning push-5-r push-10" style="min-width: 100px;">' +
						'<i class="fa fa-exclamation-triangle"></i>' +
						'<font style="vertical-align: inherit;"><font style="vertical-align: inherit;">不在范围内</font></font>' +
						'</div>');
				}
				$(this).parents('.form-group').find('.different').remove();
				if(mergerMateriality != null && mergerMateriality.settingType == index){
					if ($(this).val() != mergerMateriality['settingRate' + index]) {
						$(this).parents('.form-material').find('.different_reason').append('<div class="different btn btn-warning push-5-r push-10" style="min-width: 10px;" title="与合并项目不一致，请填写原因！" data-toggle="tooltip">' +
								'<i class="fa fa-exclamation-triangle"></i>' +
								'</div>');
					}
				}
				$('#different_reason_' + index).find('.different').remove();
				if(mergerMateriality != null && mergerMateriality.settingType != index){
					$('#different_reason_' + index).append('<div class="different btn btn-warning push-5-r push-10" style="min-width: 10px;" title="与合并项目不一致，请填写原因！" data-toggle="tooltip">' +
							'<i class="fa fa-exclamation-triangle"></i>' +
							'</div>');
				}
			});
		};
		if ($(this).attr('data-result') == 1) {
			setVd(1, 0.5, 3);
		} else if ($(this).attr('data-result') == 2) {
			setVd(2, 3, 10);
		} else if ($(this).attr('data-result') == 3 ) {
			setVd(3, 1, 2);
		} else if ($(this).attr('data-result') == 4) {
			setVd(4, 0.5 ,3);
		}else if ($(this).attr('data-result') == 5) {
			setVd(5, 2, 5);
		}else if ($(this).attr('data-result') == 6) {
			setVd(6, 0.5, 3);
		}
		tparent.parent().find('.has-success').find('input').keyup();
		$('#mater_form').find('.form-group').eq(7).find('.has-success').find('input').keyup();
		$('#mater_form').find('.form-group').eq(8).find('.has-success').find('input').keyup();
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
			remove(50, 90);
		} else if ($(this).attr('data-result') == 2) {
			remove(1, 5);
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
			remove(.5, 2);
		} else if ($(this).attr('data-result') == 2) {
			remove(3, 10);
		} else if ($(this).attr('data-result') == 3) {
			remove(1, 2);
		} else if ($(this).attr('data-result') == 5) {
			remove(2, 5);
		}else if ($(this).attr('data-result') == 4 || $(this).attr('data-result') == 6) {
			remove(.5, 3);
		}
	});

	$('input[type="text"][name="mater_number"], input[type="number"][name="mater_rate"], input[type="text"][id="mater_surenum"]').change(function(e) {
		if ($(this).attr('name') == 'mater_number') {
			var val = getNum($(this).val());
			if (isNaN(val * 1)) {
				$(this).val('');
				$(this).attr('placeholder', '请输入正确的金额');
			} else {
				$(this).val(getMn(val * 1));
				materCalcu($(this).attr('data-result'));
			}
		} else if ($(this).attr('id') == 'mater_surenum') {
			var val = getNum($(this).val());
			if (isNaN(val * 1)) {
				$(this).val('');
				$(this).attr('placeholder', '请输入正确的金额');
			} else {
				$(this).val(getMn(val * 1));
				$('input[type="text"][name="mater_sureratenum"]').each(function() {
					if ($('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() != '') {
						$(this).val(getMn(getNum($('#mater_surenum').val()) * $('input[type="number"][name="mater_surerate"][data-result="' + $(this).attr('data-result') + '"]').val() / 100));
					} else {
						$(this).val('');
					}
				});
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
		if(!isEmpty(num)){
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
		return num;
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
			// 审定阶段重要性水平设置
			materialitySet(data_result);
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
	$('#finalSettingTypeValue1').change(function() {
		if ($('#finalSettingTypeValue1').val() != '' && $(this).val() != '') {
			var val = getNum($(this).val());
			$('#finalSettingTypeValue1').val(getMn(val*1));
		} else {
			$('#finalSettingTypeValue1').val(0);
		}
	});
	$('#finalSettingTypeValue2').change(function() {
		var val = getNum($(this).val());
		if ($('#finalSettingTypeValue2').val() != '' && $(this).val() != '') {
			$('#finalSettingTypeValue2').val(getMn(val*1));
		} else {
			$('#finalSettingTypeValue2').val(0);
		}
	});

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
		var settingTypeValue1=parseFloat(getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val()));
		var settingTypeValue2=parseFloat(getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val()));
		var mergeSettingTypeValue1= 0;
		var	mergeSettingTypeValue2=0;
		if(!isEmpty($('#mergeSettingTypeValue1').val())){
			mergeSettingTypeValue1=parseFloat(getNum($('#mergeSettingTypeValue1').val()));
		}
		if(!isEmpty($('#mergeSettingTypeValue2').val())){
			mergeSettingTypeValue2=parseFloat(getNum($('#mergeSettingTypeValue2').val()));
		}
		var finalSettingTypeValue1= 0;
		var	finalSettingTypeValue2= 0;
		if(mergeSettingTypeValue1>0 || mergeSettingTypeValue2>0){
			if(isEmpty($('#finalSettingTypeValue1').val())|| isEmpty($('#finalSettingTypeValue2').val())){
				bdoInfoBox('提示', '请输入最终实施的重要性水平');
				return false;
			}
			finalSettingTypeValue1= parseFloat(getNum($('#finalSettingTypeValue1').val()));
			finalSettingTypeValue2= parseFloat(getNum($('#finalSettingTypeValue2').val()));
			if(finalSettingTypeValue1>mergeSettingTypeValue1 || finalSettingTypeValue1>settingTypeValue1
			||finalSettingTypeValue2>mergeSettingTypeValue2 ||finalSettingTypeValue2>settingTypeValue2){
				bdoInfoBox('提示', '最终实施的重要性水平不能大于集团分配的的重要性水平和选择的重要性水平!');
				return false;
			}
		}else{//如果集团分配的重要性水平没值的话，则直接将选择的重要性水平作为最终实施的重要性水平
			finalSettingTypeValue1=settingTypeValue1;
			finalSettingTypeValue2=settingTypeValue2;
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
			settingRateTwo4: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			settingValue5: getNum($('input[type="text"][name="mater_number"][data-result="' + 5 + '"]').val()),
			settingRate5: $('input[type="number"][name="mater_rate"][data-result="' + 5 + '"]').val(),
			settingImportValue5: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 5 + '"]').val()),
			settingRateOne5: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
			settingRateTwo5: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			settingValue6: getNum($('input[type="text"][name="mater_number"][data-result="' + 6 + '"]').val()),
			settingRate6: $('input[type="number"][name="mater_rate"][data-result="' + 6 + '"]').val(),
			settingImportValue6: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 6 + '"]').val()),
			settingRateOne6: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
			settingRateTwo6: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
			finalSettingTypeValue1: finalSettingTypeValue1,
			finalSettingTypeValue2: finalSettingTypeValue2
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

	// 审定阶段重要性水平设置
	function materialityValue(settingType) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/MaterialitySetting.getMateriality.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: window.CUR_PROJECT_ACC_YEAR,
				param4: settingType,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success  ) {
					if (data.data && data.data.length > 0 && data.data[0].materiality != '') {
						$('#mater_profit').val(getMn(data.data[0].materiality));
					} else {
						$('#mater_profit').val(0);
					}
				}else{
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}

	// 审定阶段重要性水平设置
	function materialitySet(settingType) {
		var rate = $('input[type="number"][name="mater_rate"][data-result="' + settingType + '"]').val();
		var profit = $('#mater_profit').val();
		// 重要性水平 title
		$('#mater_profit_label').html($('#mater_label_' + settingType).html());
		// 选择百分比(%)
		$('#mater_procent').val(rate);
		if (profit != '' && rate != '') {
			// 主营业务收入、税前利润、总资产或净资产、收入/费用总额
			var materialityNumber = getNum($('#mater_profit').val());
			// 重要性水平
			var num = (materialityNumber * rate) / 100;
			$('#mater_num').val(getMn(num));
			// 建议的重要性水平
			var ratenum = $('input[type="text"][name="mater_ratenum"][data-result="' + settingType + '"]').val();
			// 结果
			if (parseFloat(num.toFixed(2)) > parseFloat(getNum(ratenum))) {
				$('#mater_result').val('高于计划阶段的重要性水平！');
				$('#mater_result').css({'color': 'red'});
			} else if (parseFloat(num.toFixed(2)) < parseFloat(getNum(ratenum))) {
				$('#mater_result').val('低于计划阶段的重要性水平！');
				$('#mater_result').css({'color': '#646464'});
			} else {
				$('#mater_result').val('等于计划阶段的重要性水平！');
				$('#mater_result').css({'color': '#646464'});
			}
		} else {
			$('#mater_num').val('');
			$('#mater_result').val('');
		}
	}

	// 打开重要性水平设置弹出框
	$('#openMaterModal').on('click', function() {
		var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
		if (settingType == undefined) {
			bdoInfoBox('提示', '请先在重要性水平计算选择一个科目！');
			return;
		}
		$('#materialityModal').modal('show');
	});

	let getFormatCode = function(strValue) {
		return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
	};

	function isEmpty(obj) {
		if (typeof obj == 'undefined' || obj == null || obj == '') {
			return true;
		} else {
			return false;
		}
	}

	$('#exportLevel').click(function() {
		var isManager = true;
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00197',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if (sys_userId != data.data[0].manager) {
						isManager = false;
					}
				}
			}
		});
		if (!isManager) {
			bdoInfoBox('提示', '非项目负责人无权限导出重要性水平设置！');
			return;
		}
		$.sessionStorage('autoId', agrs.data.autoId);
		var settingTypeValue1=parseFloat(getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val()));
		var settingTypeValue2=parseFloat(getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val()));
		var mergeSettingTypeValue1= 0;
		var	mergeSettingTypeValue2=0;
		if(!isEmpty($('#mergeSettingTypeValue1').val())){
			mergeSettingTypeValue1=parseFloat(getNum($('#mergeSettingTypeValue1').val()));
		}
		if(!isEmpty($('#mergeSettingTypeValue2').val())){
			mergeSettingTypeValue2=parseFloat(getNum($('#mergeSettingTypeValue2').val()));
		}

		var finalSettingTypeValue1= 0;
		var	finalSettingTypeValue2= 0;
		if(mergeSettingTypeValue1>0 || mergeSettingTypeValue2>0){
			if(isEmpty($('#finalSettingTypeValue1').val()) || isEmpty($('#finalSettingTypeValue2').val())){
				bdoInfoBox('提示', '请输入最终实施的重要性水平');
				return false;
			}
			finalSettingTypeValue1= parseFloat(getNum($('#finalSettingTypeValue1').val()));
			finalSettingTypeValue2= parseFloat(getNum($('#finalSettingTypeValue2').val()));
			if(finalSettingTypeValue1>mergeSettingTypeValue1 || finalSettingTypeValue1>settingTypeValue1
				||finalSettingTypeValue2>mergeSettingTypeValue2 ||finalSettingTypeValue2>settingTypeValue2){
				bdoInfoBox('提示', '最终实施的重要性水平不能大于集团分配的的重要性水平和选择的重要性水平!');
				return false;
			}
		}else{//如果集团分配的重要性水平没值的话，则直接将选择的重要性水平作为最终实施的重要性水平
			finalSettingTypeValue1=settingTypeValue1;
			finalSettingTypeValue2=settingTypeValue2;
		}
		var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
		if (settingType == null || settingType == undefined || settingType == '') {
			bdoInfoBox('', '请先在重要性水平计算选择一个科目！');
		} else {
			//var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var myParams = {
				projectId: window.CUR_PROJECTID,
				customerId: window.CUR_CUSTOMERID,
				autoId: JSON.parse($.sessionStorage('autoId')),
				materIndex: $('input[name="mater_index"]').val(),
				editUser: window.sys_userId,
				editDate: $('input[name="mater_editdate"]').val(),
				reason: getFormatCode($('textarea[name="mater_reason"]').val()),
				settingType: settingType,
				settingTypeValue1: getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val()),
				settingTypeValue2: getNum($('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val()),
				mergeSettingTypeValue1: getNum($('#mergeSettingTypeValue1').val()),
				mergeSettingTypeValue2: getNum($('#mergeSettingTypeValue2').val()),
				finalSettingTypeValue1: getNum($('#finalSettingTypeValue1').val()),
				finalSettingTypeValue2: getNum($('#finalSettingTypeValue2').val()),
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
				settingRateTwo4: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
				settingValue5: getNum($('input[type="text"][name="mater_number"][data-result="' + 5 + '"]').val()),
				settingRate5: $('input[type="number"][name="mater_rate"][data-result="' + 5 + '"]').val(),
				settingImportValue5: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 5 + '"]').val()),
				settingRateOne5: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
				settingRateTwo5: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
				settingValue6: getNum($('input[type="text"][name="mater_number"][data-result="' + 6 + '"]').val()),
				settingRate6: $('input[type="number"][name="mater_rate"][data-result="' + 6 + '"]').val(),
				settingImportValue6: getNum($('input[type="text"][name="mater_ratenum"][data-result="' + 6 + '"]').val()),
				settingRateOne6: $('input[type="number"][name="mater_surerate"][data-result="1"]').val(),
				settingRateTwo6: $('input[type="number"][name="mater_surerate"][data-result="2"]').val(),
				settingImportValue: getNum($('input[type="text"][id="mater_surenum"]').val())
			};

			if (settingType == '1') {
				if (isEmpty(myParams.settingImportValue1) || isEmpty(myParams.settingRateOne1)
					|| isEmpty(myParams.settingRateTwo1) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate1)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}

			} else if (settingType == '2') {
				if (isEmpty(myParams.settingImportValue2) || isEmpty(myParams.settingRateOne2)
					|| isEmpty(myParams.settingRateTwo2) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate2)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}
			} else if (settingType == '3') {
				if (isEmpty(myParams.settingImportValue3) || isEmpty(myParams.settingRateOne3)
					|| isEmpty(myParams.settingRateTwo3) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate3)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}
			} else if (settingType == '4'){
				if (isEmpty(myParams.settingImportValue4) || isEmpty(myParams.settingRateOne4)
					|| isEmpty(myParams.settingRateTwo4) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate4)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}
			}else if (settingType == '5'){
				if (isEmpty(myParams.settingImportValue5) || isEmpty(myParams.settingRateOne5)
					|| isEmpty(myParams.settingRateTwo5) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate5)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}
			}else if (settingType == '6'){
				if (isEmpty(myParams.settingImportValue6) || isEmpty(myParams.settingRateOne6)
					|| isEmpty(myParams.settingRateTwo6) || isEmpty(myParams.settingTypeValue1)
					|| isEmpty(myParams.settingTypeValue2) || isEmpty(myParams.reason)
					|| isEmpty(myParams.settingRate6)) {
					bdoInfoBox('提示', '请先保存数据再导出!');
					return false;
				}
			}

			$.ajax({
				type: 'post',
				url: 'dgCenter/ExportOtherDg.materSettingExport.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: JSON.stringify(myParams)
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						if (data.data && data.data.length > 0) {
							let dataString = data.data[0].fileData;
							let fileName = data.data[0].fileName;
							let isNew = data.data[0].isNew;
							bdoInfoBox('成功', fileName + '导出成功！');
							saveAs(dataURLtoFile(dataString, fileName), fileName);
							if (!isNew) {
								return;
							}
							getSubjecttree({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_PROJECTID,
								param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
							}, data => {
								$('.js-tree-collapsed').trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: (3),
									callback(tree) {
										tree.expandNode(agrs.data.nodeId, {levels: (agrs.data.deep + 2), silent: true});
										tree.selectNode(agrs.data.nodeId, {silent: true});
										agrs.data = tree.getNode(agrs.data.nodeId);
									}
								}]);
							});
						}
					} else {
						bdoErrorBox('失败', data.resultInfo && data.resultInfo.statusText);
					}
				}
			});
		}


	});


	$('#mergeMateriality').click(function() {
		var settingTypeValue1= $('input[type="text"][name="mater_sureratenum"][data-result="' + 1 + '"]').val();
		var	settingTypeValue2= $('input[type="text"][name="mater_sureratenum"][data-result="' + 2 + '"]').val();
		if(isEmpty(settingTypeValue1) ||isEmpty(settingTypeValue2)){
			bdoInfoBox('提示', '请先输入重要性水平');
			return false;
		}
		this.mergeMaterialitySider = side({el: '#mergeMaterialitySider'});
		this.mergeMaterialitySider.show();
		this.mergeMaterialitySider.autoHide = false;
		let region = '#mergeMaterialityRegion';
		let data = {
			settingTypeValue1: settingTypeValue1,
			settingTypeValue2 : settingTypeValue2

		};
		MergeMaterialityPage({region,data});
	});

	$('#materialityModal').on('show.bs.modal', function() {
		$('#mater_type').get(0).selectedIndex = 0;
		$('#mater_subject_1').get(0).selectedIndex = 0;
		$('#mater_subject_2').get(0).selectedIndex = 0;
		/*$('#mater_subject_1').css({'display': 'block'});
		$('#mater_subject_2').css({'display': 'none'});*/
		$('#mater_subject_text_1').css({'display': 'block'});
		$('#mater_subject_text_2').css({'display': 'none'});
		$('#mater_subjectId').val('');
		$('#mater_subjectName').val('');
		$('#mater_auditAmount').val('');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00111',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
					var constitute;
					if (settingType == '1' && data.data[0] && data.data[0].constitute1) {
						constitute = data.data[0].constitute1;
					} else if (settingType == '2' && data.data[0] && data.data[0].constitute2) {
						constitute = data.data[0].constitute2;
					} else if (settingType == '3' && data.data[0] && data.data[0].constitute3) {
						constitute = data.data[0].constitute3;
					} else if (settingType == '4' && data.data[0] && data.data[0].constitute4) {
						constitute = data.data[0].constitute4;
					}
					if (constitute != null && constitute != '') {
						constitute = constitute.replace(new RegExp(/"/g), '');
						$('#itemGroup').html('');
						var subjectList = constitute.split(',');
						for (var i = 0; i < subjectList.length; i++) {
							let subjectId = subjectList[i];
							let length = $('#itemGroup .col-sm-2 input').length;
							let txt;
							if (length > 0) {
								txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"+">+</option></select></div></div><div class=\"col-sm-2\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly></div></div>');
							} else {
								txt = $('<div class=\"col-sm-2\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly></div></div>');
							}
							$('#itemGroup').append(txt);
							$('#itemGroup .col-sm-2 input')[length].value = subjectId;
							for (let list of tbList) {
								if (list.tbSubjectId == subjectId) {
									$('#itemGroup .col-sm-2 input')[length].title = list.tbSubjectId + '-' + list.tbSubjectName + ':' + getMn(parseFloat(list.auditAmount));
									if (i == subjectList.length - 1) {
										$('#mater_subject_1').val(list.tbSubjectId);
										$('#mater_subject_text_1').val(list.tbSubjectId + ':' + list.tbSubjectName);
										$('#mater_subjectId').val(list.tbSubjectId);
										$('#mater_subjectName').val(list.tbSubjectName);
										$('#mater_auditAmount').val(getMn(parseFloat(list.auditAmount)));
									}
									return;
								}
							}
							for (let list of reportList) {
								if (list.colCode == subjectId) {
									$('#itemGroup .col-sm-2 input')[length].title = list.colCode + '-' + list.colDisp + ':' + getMn(parseFloat(list.auditedAmount));
									if (i == subjectList.length - 1) {
										$('#mater_subject_2').val(list.colCode);
										$('#mater_subject_text_2').val(list.colCode + ':' + list.colDisp);
										$('#mater_subjectId').val(list.colCode);
										$('#mater_subjectName').val(list.colDisp);
										$('#mater_auditAmount').val(getMn(parseFloat(list.auditedAmount)));
									}
									return;
								}
							}
						}
					} else {
						$('#itemGroup').html('');
					}
				}
			}
		});
	});
	// 类型
	$('#mater_type').change(function() {
		if ($(this).val() === '1') {
			$('#mater_subject_text_1').css({'display': 'block'});
			$('#mater_subject_text_2').css({'display': 'none'});
			$('#mater_subject_1').get(0).selectedIndex = 0;
		} else if ($(this).val() === '2') {
			$('#mater_subject_text_1').css({'display': 'none'});
			$('#mater_subject_text_2').css({'display': 'block'});
			$('#mater_subject_2').get(0).selectedIndex = 0;
		}
	});
	// TB输入框
	$(document).bind('click', function(e) {
		var e = e || window.event; //浏览器兼容性
		var elem = e.target || e.srcElement;
		while (elem) { //循环判断至跟节点，防止点击的是div子元素
			if (elem.id && (elem.id == 'mater_subject_text_1' || elem.id == 'mater_subject_1')) {
				return;
			}
			elem = elem.parentNode;
		}
		$('#mater_subject_1').css('display', 'none'); //点击的不是div或其子元素
	});
	$('#mater_subject_text_1').on('focus', function() {
		$('#mater_subject_1').empty();
		$('#mater_subject_1').css({'display': ''});
		for (let list of tbList) {
			//若找到以输入框的内容开头的，添option
			if ((list.tbSubjectId + ':' + list.tbSubjectName).indexOf(this.value) != -1) {
				$('#mater_subject_1').append('<option value=\'' + list.tbSubjectId + '\' title=\'' + list.tbSubjectName + '\' data-amount=\'' + list.auditAmount + '\' data-name=\'' + list.tbSubjectName + '\'>' + list.tbSubjectId + ':' + list.tbSubjectName + '</option>');
			}
		}
	});
	$('#mater_subject_text_1').on('input', function() {
		$('#mater_subject_1').empty();
		$('#mater_subject_1').css({'display': ''});
		for (let list of tbList) {
			//若找到以输入框的内容开头的，添option
			if ((list.tbSubjectId + ':' + list.tbSubjectName).indexOf(this.value) != -1) {
				$('#mater_subject_1').append('<option value=\'' + list.tbSubjectId + '\' title=\'' + list.tbSubjectName + '\' data-amount=\'' + list.auditAmount + '\' data-name=\'' + list.tbSubjectName + '\'>' + list.tbSubjectId + ':' + list.tbSubjectName + '</option>');
			}
		}
	});
	// TB下拉框
	$('#mater_subject_1').change(function() {
		var value = $('#mater_subject_1').val();
		var name = $('#mater_subject_1 option:selected').attr('data-name');
		var amount = $('#mater_subject_1 option:selected').attr('data-amount');
		$('#mater_subjectId').val(value);
		$('#mater_subjectName').val(name);
		$('#mater_auditAmount').val(amount);
		$('#mater_subject_1').css({'display': 'none'});
	});
	// 报表输入框
	$(document).bind('click', function(e) {
		var e = e || window.event; //浏览器兼容性
		var elem = e.target || e.srcElement;
		while (elem) { //循环判断至跟节点，防止点击的是div子元素
			if (elem.id && (elem.id == 'mater_subject_text_2' || elem.id == 'mater_subject_2')) {
				return;
			}
			elem = elem.parentNode;
		}
		$('#mater_subject_2').css('display', 'none'); //点击的不是div或其子元素
	});
	$('#mater_subject_text_2').on('focus', function() {
		$('#mater_subject_2').empty();
		$('#mater_subject_2').css({'display': ''});
		for (let list of reportList) {
			//若找到以输入框的内容开头的，添option
			if ((list.colCode + ':' + list.colDisp).indexOf(this.value) != -1) {
				$('#mater_subject_2').append('<option value=\'' + list.colCode + '\' title=\'' + list.colDisp + '\' data-amount=\'' + list.auditedAmount + '\' data-name=\'' + list.colDisp + '\'>' + list.colCode + ':' + list.colDisp + '</option>');
			}
		}
	});
	$('#mater_subject_text_2').on('input', function() {
		$('#mater_subject_2').empty();
		$('#mater_subject_2').css({'display': ''});
		for (let list of reportList) {
			//若找到以输入框的内容开头的，添option
			if ((list.colCode + ':' + list.colDisp).indexOf(this.value) != -1) {
				$('#mater_subject_2').append('<option value=\'' + list.colCode + '\' title=\'' + list.colDisp + '\' data-amount=\'' + list.auditedAmount + '\' data-name=\'' + list.colDisp + '\'>' + list.colCode + ':' + list.colDisp + '</option>');
			}
		}
	});
	// 报表下拉框
	$('#mater_subject_2').change(function() {
		var value = $('#mater_subject_2').val();
		var name = $('#mater_subject_2 option:selected').attr('data-name');
		var amount = $('#mater_subject_2 option:selected').attr('data-amount');
		$('#mater_subjectId').val(value);
		$('#mater_subjectName').val(name);
		$('#mater_auditAmount').val(amount);
		$('#mater_subject_2').css({'display': 'none'});
	});
	// 撤销
	$('#undoItemBtn').click(function() {
		let length1 = $('#itemGroup .col-sm-2 input').length;
		if (length1 > 0) {
			$('#itemGroup .col-sm-2')[length1 - 1].remove();
		}
		let length2 = $('#itemGroup .col-sm-1 select').length;
		if (length2 > 0) {
			$('#itemGroup .col-sm-1')[length2 - 1].remove();
		}
	});
	// 添加
	$('#addItemBtn').click(function() {
		if ($('#mater_subjectId').val() != '') {
			let length = $('#itemGroup .col-sm-2 input').length;
			let txt;
			if (length > 0) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"+">+</option></select></div></div><div class=\"col-sm-2\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly></div></div>');
			} else {
				txt = $('<div class=\"col-sm-2\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly></div></div>');
			}
			$('#itemGroup').append(txt);
			$('#itemGroup .col-sm-2 input')[length].value = $('#mater_subjectId').val();
			$('#itemGroup .col-sm-2 input')[length].title = $('#mater_subjectId').val() + '-' + $('#mater_subjectName').val() + ':' + getMn(parseFloat($('#mater_auditAmount').val()));
		} else {
			bdoInfoBox('提示', '请选择科目！');
		}
	});
	$('#setMaterBtn').click(function() {
		var length = $('#itemGroup .col-sm-2 input').length;
		if (length > 0) {
			var param = '"' + $('#itemGroup .col-sm-2 input')[0].value + '"';
			for (var i = 1; i < length; i++) {
				param = param + ',"' + $('#itemGroup .col-sm-2 input')[i].value + '"';
			}
			var settingType = $('input[type="radio"][name="mater_use"]:checked').attr('data-result');
			$.ajax({
				url: 'dgCenter/MaterialitySetting.setMaterNum.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: param,
					param4: settingType
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						materialityValue(settingType);
						materialitySet(settingType);
						bdoSuccessBox('成功', '设置成功！');
						$('#materialityModal').modal('hide');
					}
				}
			});
		} else {
			bdoErrorBox('失败', '请添加TB或报表科目！');
		}
	});
	$.ajax({
		url: 'dgCenter/MaterialitySetting.initMaterNum.json',
		type: 'post',
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
		},
		dataType: 'json',
		success: function(data) {
			if (data.success ) {
				if (data.data && data.data.length > 0 ) {
					if(data.data[0].hasMergerReport == true){
						$('#mergerReport').show();
						$('#mergeSettingTypeValue1').val(getMn(data.data[0].settingTypeValue1));
						$('#mergeSettingTypeValue2').val(getMn(data.data[0].settingTypeValue2));
					}
					if(data.data[0].isMergerReport == true){
						$('#mergeMateriality').show();
					}else{
						mergerMateriality = data.data[0].mergerMateriality;
					}
				}
			} else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
	// 下拉框 TB
	/*var tbList = [];
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		dataType: 'json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00107',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: window.CUR_PROJECT_ACC_YEAR,
			start: -1,
			limit: -1
		},
		success: function(data) {
			if (data.success) {
				tbList = data.data;
				$('#mater_subject_1').empty();
				for (let list of data.data) {
					$('#mater_subject_1').append('<option value=\'' + list.tbSubjectId + '\' title=\'' + list.tbSubjectName + '\' data-amount=\'' + list.auditAmount + '\' data-name=\'' + list.tbSubjectName + '\'>' + list.tbSubjectId + ':' + list.tbSubjectName + '</option>');
				}
			}
		}
	});
	// 下拉框 报表
	var reportList = [];
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		dataType: 'json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00108',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param4: window.CUR_PROJECT_ACC_YEAR,
			start: -1,
			limit: -1
		},
		success: function(data) {
			if (data.success) {
				reportList = data.data;
				$('#mater_subject_2').empty();
				for (let list of data.data) {
					$('#mater_subject_2').append('<option value=\'' + list.colCode + '\' data-amount=\'' + list.auditedAmount + '\' data-name=\'' + list.colDisp + '\'>' + list.colCode + ':' + list.colDisp + '</option>');
				}
			}
		}
	});*/
	$.ajax({
		type: 'post',
		//url: 'dgCenter/MaterialitySetting.queryMater.json',
		url: 'dgCenter/DgGeneral.query.json',
		dataType: 'json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00085',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			start: -1,
			limit: -1
		},
		success: function(data) {
			if (data.success) {
				var object = data.data[0];
				if (!object || data.data.length == 0) {
					var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
					$('input[name="mater_index"]').val(node.extraOptions.indexId);
					$('input[name="mater_editer"]').val(window.selfNm);
					$('input[name="mater_editdate"]').val(getNowDate());
					return;
				}
				if (object.materIndex == null || object.materIndex == '') {
					var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
					$('input[name="mater_index"]').val(node.extraOptions.indexId);
				} else {
					$('input[name="mater_index"]').val(object.materIndex);
				}
				if (object.__ueditUserName == null || object.__ueditUserName == '') {
					$('input[name="mater_editer"]').val(window.selfNm);
				} else {
					$('input[name="mater_editer"]').val(object.__ueditUserName);
				}
				if (object.editDate == null || object.editDate == '') {
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
				$('input[type="text"][name="mater_number"][data-result="' + 5 + '"]').val(getMn(object.settingValue5 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 5 + '"]').val(object.settingRate5);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne5);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo5);
				$('input[type="text"][name="mater_number"][data-result="' + 6 + '"]').val(getMn(object.settingValue6 * 1));
				$('input[type="number"][name="mater_rate"][data-result="' + 6 + '"]').val(object.settingRate6);
				$('input[type="number"][name="mater_surerate"][data-result="1"]').val(object.settingRateOne6);
				$('input[type="number"][name="mater_surerate"][data-result="2"]').val(object.settingRateTwo6);
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
				$('#finalSettingTypeValue1').val(getMn(object.finalSettingTypeValue1));
				$('#finalSettingTypeValue2').val(getMn(object.finalSettingTypeValue2));
				// materCalcu(object.settingType);
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
		OneUI.initHelper('slimscroll');
	};
	mount();

}