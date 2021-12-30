/**
 *
 */
var SamplingCountPage = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/samplingCount.html');
	agrs.template = _template;
	$('#headtitle').empty().text(agrs.data.text);
	tabPage = {};
	listener = () => {
		$('#samplingCountTab a').on('show.bs.tab', function(evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			index = id.lastIndexOf('Tab');
			var subjectId = id.substring(0,index);
			initStatistics(subjectId);
		});
		$('#dgSamplingCount_subjectId').change(function() {
			
			initStatistics($('#dgSamplingCount_subjectId').val());
		});
	};
	let initTab = function() {
		var isSearch = false;
		var tbSubjectCode = '';
		if(agrs.data.extraOptions.nodeType == 'TBSUBJECT' && agrs.data.extraOptions.tbSubjectCode != ''){
			isSearch = true;
			tbSubjectCode = agrs.data.extraOptions.tbSubjectCode;
		}else if(agrs.data.extraOptions.nodeType == 'SUBJECT' && agrs.data.extraOptions.userSubjectId != ''){
			$('#samplingCountTab').html('<li class="active"><a href="#' + agrs.data.extraOptions.userSubjectId + 'Tab">' + agrs.data.text + '</a></li>');
			$('#samplingCountPage').html('<div class="tab-pane active"  id="' + agrs.data.extraOptions.userSubjectId + 'Tab"></div>');
			initStatistics(agrs.data.extraOptions.userSubjectId);
		}else{
			isSearch = true;
		}
		if(isSearch){
			$.ajax({
				url: 'dgCenter/DgGeneral.query.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG10011',
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					param1: tbSubjectCode,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						if(data.data != null && data.data.length > 0){
							var tab = '';
							var page = '';
							var html = '';
							var activeSubjectId = '';
							for(var i = 0;i < data.data.length;i++){
								if(i == 0){
									tab = tab + '<li class="active"><a href="#' + data.data[i].baseSubjectId + 'Tab">' + data.data[i].baseSubjectId + '-' + data.data[i].baseSubjectName + '</a></li>';
									page = page + '<div class="tab-pane active"  id="' + data.data[i].baseSubjectId + 'Tab"></div>';
									activeSubjectId = data.data[i].baseSubjectId;
								}else{
									tab = tab + '<li><a href="#' + data.data[i].baseSubjectId + 'Tab">' + data.data[i].baseSubjectId + '-' + data.data[i].baseSubjectName + '</a></li>';
									page = page + '<div class="tab-pane"  id="' + data.data[i].baseSubjectId + 'Tab"></div>';
								}

								html += '<option value="' + data.data[i].baseSubjectId + '">' + data.data[i].baseSubjectId + '-' + data.data[i].baseSubjectName + '</option>';
							}
							if(agrs.data.extraOptions.nodeType == 'PROJECT'){
								//tab = '<li class="active"><a href="#' + data.data[0].baseSubjectId + 'Tab">' + data.data[0].baseSubjectId + '-' + data.data[0].baseSubjectName + '</a></li>';
								page = '<div class="row"  id="samplingCountProjectTab"></div>';
								activeSubjectId = data.data[0].baseSubjectId;
								var subject = '<div class="row"><div class="col-sm-3">';
								subject = subject + '<div class="form-material">';
								subject = subject + '<select class="js-select2 form-control" id="dgSamplingCount_subjectId"';
								subject = subject + 'style="width: 100%;">';
								//page = page + '<option></option>';
								subject = subject + '</select>';
								subject = subject + '</div>';
								subject = subject + '</div></div>';
								$('#samplingCountTab').css('display','none'); 
								$('#samplingCountProject').html(subject + page);
								$('#dgSamplingCount_subjectId').html(html);
							}else{
								$('#samplingCountTab').html(tab);
								$('#samplingCountPage').html(page);
							}
							initStatistics(activeSubjectId);
							listener();
						}

					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		
	};
	let initStatistics = function(subjectId) {
		var samplingStatisticsContent = '<div class="block-content">'
			+ '<table id="samplingCount_table' + subjectId + '" class="table table-bordered table-hover"></table>	'
			+ '</div>';
		if(agrs.data.extraOptions.nodeType == 'PROJECT'){
			$('#samplingCountProjectTab').html(samplingStatisticsContent);
		}else{
			$('#' + subjectId + 'Tab').html(samplingStatisticsContent);
		}
		var samplingCount_view = {
			localParam: {
				tabNum: false,
				url: 'finCenter/sampling.querySamplingCount.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG10012',
					param1: subjectId,
					lockProjectId: window.CUR_PROJECTID,
					lockCustomerId: window.CUR_CUSTOMERID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR
				}
			},
			tableParam: {
				select: true,
				pageLength: 30,
				//lengthChange: false,
				//dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering: false,
				serverSide: true,
				//fixedThead: true,
				//fixedHeight: '500px',
				columnDefs: [{
						targets: 1,
						className: 'text-left',
						title: '抽凭方式',
						name: 'sampleMethodName',
						data: 'sampleMethodName',
						width: '100px',
						render: function(data, type, row, meta) {
							var renderStr = '';
							//renderStr += '<button class="btn btn-xs btn-success" type="button" name="showSamplingCountResult" data-placement="top" title="抽凭结果" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
							renderStr += '<a href="#" name="showSamplingCountResult">' + data + '</a>';
							return renderStr;
						}
					}, {
						targets: 2,
						className: 'text-center',
						title: '样本数量',
						name: 'voucherNum',
						data: 'voucherNum',
						width: '50px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '样本数量占发生额总数量的比例',
						name: 'rate1',
						data: 'rate1',
						width: '50px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '借方抽样金额',
						name: 'debitOcc',
						data: 'debitOcc',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-center',
						title: '借方抽样金额占借方总发生额比例',
						name: 'rate2',
						data: 'rate2',
						width: '50px'
					}, {
						targets: 6,
						className: 'text-right',
						title: '贷方抽样金额',
						name: 'creditOcc',
						data: 'creditOcc',
						width: '50px',
						render: function(data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-center',
						title: '贷方抽样金额占贷方总发生额比例',
						name: 'rate3',
						data: 'rate3',
						width: '50px'
					}, {
						targets: 8,
						className: 'text-left',
						title: '抽凭名称',
						name: 'sampleName',
						data: 'sampleName',
						width: '50px'
					}
				]
			}
		};
		BdoDataTable('samplingCount_table' + subjectId, samplingCount_view);
		/** 弹出抽样抽凭结果 */
		$('#samplingCount_table' + subjectId).off("click", 'a[name="showSamplingCountResult"]');
		$('#samplingCount_table' + subjectId).on('click', 'a[name="showSamplingCountResult"]', function() {
			var object = $('#samplingCount_table' + subjectId).DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			if(autoId != null && autoId != ''){
				SamplingResult({region: '#samplistResultPage', data: agrs.data, samplingId: autoId});
				$('#modal_samplistResult1').modal('show');
			}
		});
	};
	mount = () => {
		$(agrs.region).empty().append(_template);
		initTab();
		//listener();
		OneUI.initHelper('slimscroll');
	};

	mount();

};