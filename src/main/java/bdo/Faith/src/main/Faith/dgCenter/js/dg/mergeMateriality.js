/**
 * 底稿附件
 */
var MergeMaterialityPage = (agrs) => {
	var _template
		, _data
		, mount
		, cnt
		, uploadAttachForm
		, listener
		, mergeMaterialityTable;
	_template = agrs.template || tplLoader('dgCenter/html/dg/mergeMateriality.html');
	agrs.template = _template;
	_data = agrs.data;
	/**
	 * 事件绑定写在这里
	 */
	listener = () => {
		$('#mergeMaterialityTable').on('click', 'button[name="editMateriality"]', function() {
			var object = $('#mergeMaterialityTable').DataTable().data()[$(this).closest('tr').index()];
			$('#distributionMaterialityModal').modal('show');
			$('#mergeAutoId').val(object.autoId);
			$('#shortName').val(object.shortName);
			$('#stockBreakRate').val(object.stockBreakRate);
			$('#distributionMaterialityValue1').val(getMn(object.settingTypeValue1));
			$('#distributionMaterialityValue2').val(getMn(object.settingTypeValue2));
			$('#settingTypeValue1').val(_data.settingTypeValue1);
			$('#settingTypeValue2').val(_data.settingTypeValue2);
		});
		$('#distributionMaterialityValue1').change(function() {
			if ($('#distributionMaterialityValue1').val() != '' && $(this).val() != '') {
				var val = getNum($(this).val());
				$('#distributionMaterialityValue1').val(getMn(val*1));
			} else {
				$('#distributionMaterialityValue1').val(0);
			}
		});
		$('#distributionMaterialityValue2').change(function() {
			var val = getNum($(this).val());
			if ($('#distributionMaterialityValue2').val() != '' && $(this).val() != '') {
				$('#distributionMaterialityValue2').val(getMn(val*1));
			} else {
				$('#distributionMaterialityValue2').val(0);
			}
		});
		$('#materiality_save').click(function(){
			if (isEmpty($('#distributionMaterialityValue1').val()) ||isEmpty($('#distributionMaterialityValue2').val()) ) {
				bdoInfoBox('提示', '请给子项目分配重要性水平!');
				return false;
			}
			var distributionMaterialityValue1=parseFloat(getNum($('#distributionMaterialityValue1').val()));
			var distributionMaterialityValue2=parseFloat(getNum($('#distributionMaterialityValue2').val()));
			var settingTypeValue1=parseFloat(getNum($('#settingTypeValue1').val()));
			var settingTypeValue2=parseFloat(getNum($('#settingTypeValue2').val()));
			if(distributionMaterialityValue1>settingTypeValue1 || distributionMaterialityValue2>settingTypeValue2){
				bdoInfoBox('提示', '分配的重要性水平不能大于集团的重要性水平!');
				return false;
			}
			$.ajax({
				url : 'dgCenter/MaterialitySetting.updateMaterNum.json',
				type : 'post',
				data : {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1 :  distributionMaterialityValue1,
					param2 :  distributionMaterialityValue2,
					param3 :  $('#mergeAutoId').val()
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#distributionMaterialityModal').modal('hide');
						$('#mergeMaterialityTable').DataTable().ajax.reload();
						getSurpluSettingTypeValue1Total()
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	};
	/**
	 * 初始化写在这里
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		BdoDataTable('mergeMaterialityTable', mergeMaterialityTable);
		$('#settingTypeValue1Total').val(_data.settingTypeValue1);
		$('#settingTypeValue2Total').val(_data.settingTypeValue2);
		listener();
		getSurpluSettingTypeValue1Total();
		$('.col-sm-6').attr("style","display:none")
	};
	mergeMaterialityTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00322',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			/*

			scrollX: true,
			scrollY : '250px',
			scrollCollapse: true,
			pageLength: 30,
			select: true,
			serverSide: true,
			fixedThead: true,
			fixedHeight: '480px',*/
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '100px',
					render: function(data, type, row, meta) {
						var fileType = data.suffix;
						var renderStr = '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="editMateriality" data-placement="top" title="修改" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-edit"></i>'
							+ '</button>';
						//var renderStr = '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>’
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '子企业名称',
					name: 'mergeCustomerName',
					data: 'mergeCustomerName',
					width: '100px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '项目简称',
					name: 'shortName',
					data: 'shortName',
					width: '100px'
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-center',
					title: '股权比例',
					name: 'stockBreakRate',
					data: 'stockBreakRate',
					width: '50px'
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-center',
					title: '合并范围',
					name: 'mergeScope',
					data: 'mergeScope',
					width: '80px',
					render(data) {
						return DicVal2Nm(data, '合并范围');
					}
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-right width-je',
					title: '重要性水平',
					name: 'settingTypeValue1',
					data: 'settingTypeValue1',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-right width-je',
					title: '明显微小错报',
					name: 'settingTypeValue2',
					data: 'settingTypeValue2',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-left',
					title: '项目名称',
					name: 'mergeProjectName',
					data: 'mergeProjectName',
					width: '200px'
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-center',
					title: '项目来源',
					name: 'projectSource',
					data: 'projectSource',
					width: '50px',
					render: function(data, type, row, meta) {
						var renderStr = data == 1 ? 'SACP' : '非SACP';
						return renderStr;
					}
				}
			]
		}
	};
	mount();




	function getMn(num) {
		if(!isEmpty(num)) {
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
		}else{
			return '0';
		}
	}
	function getNum(str) {
		if(str){
			var reg = new RegExp(',', 'g');//g,表示全部替换
			str = str.replace(reg, '');
		}
		return str;
	}
	function isEmpty(obj) {
		if (typeof obj == 'undefined' || obj == null || obj == '') {
			return true;
		} else {
			return false;
		}
	}
	function getSurpluSettingTypeValue1Total(){
		$.ajax({
			url: 'cpBase/General.query.json',
			type: 'post',
			data: {
				sqlId: 'DG20008',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data.length>0){
					var data=data.data[0];
					var	surplusSettingTypeValue1Total=getNum(_data.settingTypeValue1)-data.settingTypeValue1Total;
					var	surplusSettingTypeValue2Total=getNum(_data.settingTypeValue2)-data.settingTypeValue2Total;
					$('#surplusSettingTypeValue1Total').val('0.00');
					$('#surplusSettingTypeValue2Total').val('0.00');
					if(surplusSettingTypeValue1Total>0){
						$('#surplusSettingTypeValue1Total').val(getMn(surplusSettingTypeValue1Total));
					}
					if(surplusSettingTypeValue2Total>0) {
						$('#surplusSettingTypeValue2Total').val(getMn(surplusSettingTypeValue2Total));
					}
				}
			}
		})
	}

	$('input[type="text"][name="distributionMaterialityValue"]').change(function(e) {
		if ($(this).attr('name') == 'distributionMaterialityValue') {
			var val = getNum($(this).val());
			if (isNaN(val * 1) || val<=0) {
				$(this).val('');
				$(this).attr('placeholder', '请输入正确的金额');
			}
		}
	});
};