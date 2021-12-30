$(function () {
	uiBlocksApi(false, 'init');
	// 加载图表说明
	var dataCheckData = [
		{ "name": "平衡性校验", "content": "检验凭证的借、贷方发生额是否相等" },
		{ "name": "科目期初数和期末数校验", "content": "检验科目本年期初数和上年期末数是否相等" },
		{ "name": "核算科目期初数和期末数校验", "content": "检验核算科目本年期初数和上年期末数是否相等" },
		{ "name": "余额表和外币余额表期初数校验", "content": "检验余额表和外币余额表期初数是否相等" },

		{ "name": "余额表和外币余额表期末数校验", "content": "检验余额表和外币余额表期末数是否相等" },
		{ "name": "核算余额表和外币核算余额表期初数校验", "content": "检验核算余额表和外币核算余额表期初数是否相等" },
		{ "name": "核算余额表和外币核算余额表期末数校验", "content": "检验核算余额表和外币核算余额表期末数是否相等" },
		{ "name": "科目余额、发生额校验", "content": "检验凭证分录（包括其他调整）发生额与余额表各科目发生额是否不一致" },

		{ "name": "辅助核算项目、余额核对校验", "content": "检验辅助核算科目和余额表科目余额是否相等" },
		{ "name": "科目编码校验", "content": "检验凭证分录对应的科目编号是否为空" },
		{ "name": "余额表级次校验", "content": "检验余额表各级次科目金额合计数与上级科目是否相等" },
		{ "name": "凭证类型校验", "content": "检验凭证分录的凭证类型是否为空" },

		{ "name": "凭证编号校验", "content": "检验凭证分录的凭证编号是否为空" },
		{ "name": "制单人校验", "content": "检验凭证分录的制单人是否存在" },
		{ "name": "制单人与审核人一致性校验", "content": "检验凭证分录制单人、审核人是否为同一人" },
		{ "name": "制单人、审核人权限校验", "content": "检验导入的编制人员权限与凭证分录上的权限是否相同" },

		{ "name": "金额负数校验", "content": "检验凭证分录的发生额是否为负数" },
		{ "name": "核算余额校验", "content": "核算余额加计是否小于0" },
		{ "name": "借贷方零金额校验", "content": "检验凭证分录借贷方发生额是否为0" },
		{ "name": "损益是否结转校验", "content": "检验损益类科目是否有余额" },

		{ "name": "分录摘要校验", "content": "检验凭证分录摘要为空、摘要为纯数字、摘要中含有轧差、冲抵等关键字的分录的分录" },
		{ "name": "科目重复校验", "content": "检验同一会计科目在同一笔凭证中同时具有借方和贷方发生额" },
		{ "name": "录入日期异常校验", "content": "检验凭证分录的录入日期是否为空或是周末,节假日等" },
		{ "name": "制单人对应分录校验", "content": "每笔凭证是否均有制单人" },
	];
	/** 加载 树 下拉框 */
	// 客户 日期
	getUserCustomers('check_companyid');
	//getUserCustomers('datacheck_voucher_auth_customerId');
	getUserCustomers('voucher_auth_customerId');
	$('#check_year').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', // 语言设置
		format: 'yyyy', // 日期显示格式
		minViewMode: 2
	});
	let startyear = window.CUR_PROJECT_START_YEAR;    //2018
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#check_year').val(startyear);
	// 查询
	$('#check_search').click(function () {
		var check_companyid = $('#check_companyid').val();
		var check_year = $('#check_year').val();
		if (check_companyid != '' && check_year != '') {
			$('#check_search').attr('disabled', 'disabled');

			$.ajax({
				url: 'cpBase/General.query.json',
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'FIN200002',
					lockProjectId: check_companyid,
					lockYyyy: check_year
				},
				dataType: 'json',
				success: function (data) {
					if (data.data && data.data.length > 0) {
						$('#dataisedit').show();
						var editSubjectRecord = '';
						var editDirectionRecord = '';
						$.each(data.data, function (i, d) {
							if (d.type == '4'){
								editSubjectRecord = '该年度数据科目编号层级已修改!<br>';
							}
							editDirectionRecord += '修改日期 : ' + d.editDate + ' ' + d.content + '&#10;'
						});
						$('#dataisedittxt').html(editSubjectRecord + '该年度数据科目方向已修改!<a style="cursor:pointer" title="' + editDirectionRecord + '"> 详情</a>');
					} else {
						$('#dataisedit').hide();
						$('#dataisedittxt').html('');
					}
				}
			});

			$.ajax({
				url: 'finCenter/DataCheck.getDataCheck.json',
				type: 'post',
				bdolxLoader: false,
				data: {
					lockProjectId: check_companyid,
					lockYyyy: check_year
				},
				dataType: 'json',
				success: function (data) {
					checkChart(null, 0);
					if (data.data == null || data.data.length == 0) {
						bdoInfoBox('提示', '无数据，无法校验！');
						$('#check_search').removeAttr('disabled');
						return;
					}
					var chartobj = data.data[0].TOTAL[0];
					if (!chartobj.AMOUNT || chartobj.AMOUNT == '' || chartobj.AMOUNT == '0' || chartobj.AMOUNT == 0) {
						bdoInfoBox('提示', '无数据，无法校验！');
						$('#check_search').removeAttr('disabled');
						return;
					}
					$('#pznum').html(chartobj.VOUCHERNUM ? chartobj.VOUCHERNUM : 0);
					$('#flnum').html(chartobj.JOURNALNUM ? chartobj.JOURNALNUM : 0);
					$('#hsflnum').html(chartobj.ASSNUM ? chartobj.ASSNUM : 0);
					$('#totalnum').html(formatMoney(chartobj.AMOUNT ? chartobj.AMOUNT : 0));
					$('#debitnum').html(formatMoney(chartobj.DEBIT ? chartobj.DEBIT : 0));
					$('#creditnum').html(formatMoney(chartobj.CREDIT ? chartobj.CREDIT : 0));
					if (data.data[0].CHECKOUTRESULT.length > 0) {
						$('#checkoutResult').html(data.data[0].CHECKOUTRESULT[0].checkoutResult);
					}
					$.ajax({
						url: 'finCenter/DataCheck.getDataCheck1.json',
						type: 'post',
						bdolxLoader: false,
						data: {
							lockProjectId: check_companyid,
							lockYyyy: check_year
						},
						dataType: 'json',
						success: function (data) {
							if (data.data && data.data.length > 0) {
								checkChart(data.data[0], 1, 0);
							}
							$.ajax({
								url: 'finCenter/DataCheck.getDataCheck2.json',
								type: 'post',
								bdolxLoader: false,
								data: {
									lockProjectId: check_companyid,
									lockYyyy: check_year
								},
								dataType: 'json',
								success: function (data) {
									if (data.data && data.data.length > 0) {
										checkChart(data.data[0], 1, 1);
									}
									$.ajax({
										url: 'finCenter/DataCheck.getDataCheck3.json',
										type: 'post',
										bdolxLoader: false,
										data: {
											lockProjectId: check_companyid,
											lockYyyy: check_year
										},
										dataType: 'json',
										success: function (data) {
											if (data.data && data.data.length > 0) {
												checkChart(data.data[0], 1, 2);
											}
											$.ajax({
												url: 'finCenter/DataCheck.getDataCheck4.json',
												type: 'post',
												bdolxLoader: false,
												data: {
													lockProjectId: check_companyid,
													lockYyyy: check_year
												},
												dataType: 'json',
												success: function (data) {
													if (data.data && data.data.length > 0) {
														checkChart(data.data[0], 1, 3);
														voucherAuthUploadInit();
													}
													$.ajax({
														url: 'finCenter/DataCheck.getDataCheck5.json',
														type: 'post',
														bdolxLoader: false,
														data: {
															lockProjectId: check_companyid,
															lockYyyy: check_year
														},
														dataType: 'json',
														success: function (data) {
															if (data.data && data.data.length > 0) {
																checkChart(data.data[0], 1, 4);
															}
															$.ajax({
																url: 'finCenter/DataCheck.getDataCheck6.json',
																type: 'post',
																bdolxLoader: false,
																data: {
																	lockProjectId: check_companyid,
																	lockYyyy: check_year
																},
																dataType: 'json',
																success: function (data) {
																	if (data.data && data.data.length > 0) {
																		checkChart(data.data[0], 2, 5);
																	}
																	$('#check_search').removeAttr('disabled');
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
	$('#check_search').click();
	// 生成图表
	function checkChart(chartData, type, serail) {
		if (type == 0) {
			$('#data_check_charts').empty();
			return;
		}
		$.each(chartData, function (index, info) {
			var chartIndex = (serail * 4) + parseInt(index) - 1;
			if (info && info.length > 0) {
				var title = dataCheckData[chartIndex].content;
				if (chartIndex == 15) {
					$('#data_check_charts').append('<div><div class="col-sm-3" style="width:25%;"><div id="qtip' + chartIndex + '" title="' + title + '"  class="si si-question" style="float:left;width:20px;height:20px;position: relative;right: 15px;"></div><button id="voucherAuthUpload" type="button" style="float:left;width:100px;height:20px;position: relative;right: 20px;top:-4px;background:none;border:none;z-index: 1000;"><i class="si si-cloud-upload">&nbsp;导入权限</i></button><div id="chart' + chartIndex + '" style="width:100%;height:450px;"></div></div></div>');
					var chartDom = echarts.init(document.getElementById('chart' + chartIndex));
					initChart(chartDom, info);
				} else if(chartIndex == 23){
					// 分录制单人
					$('#data_check_charts').append('<div id="qtip23" title="' + dataCheckData[23].content + '"  class="si si-question" style="float:left;width:20px;height:20px;"></div><div class="col-sm-3"><div id="charto2" style="width:90%;height:450px;"></div></div>');
					var chartDom = echarts.init(document.getElementById('charto2'));
					initChart2(chartDom, info);
				} else {
					$('#data_check_charts').append('<div><div class="col-sm-3" style="width:25%;"><div id="qtip' + chartIndex + '" title="' + title + '"  class="si si-question" style="float:left;width:20px;height:20px;position: relative;right: 15px;"></div><div id="chart' + chartIndex + '" style="width:100%;height:450px;"></div></div></div>');
					var chartDom = echarts.init(document.getElementById('chart' + chartIndex));
					initChart(chartDom, info);
				}
				
			}
		});
	}

	function initChart(chartDom, chartData){
		var chartTitleColor = 'rgba(0, 0, 0, 1)';
		if (chartData[1].NUM != 0) {
			chartTitleColor = 'rgba(255, 0, 0, 1)';
		}
		var chartoption = {
			title: {
				text: chartData[0].NAME,
				textStyle: {
					color: chartTitleColor
				},
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				position: 'inside',
				formatter: function (param) {
					return '<span>' + param.seriesName + '</span><br><span>' + param.name + ' : ' + formatChart(param.value) + '(' + param.percent + '%)</span>';
				}
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				top: 30,
				data: [chartData[0].TITLE, chartData[1].TITLE]
			},
			series: [{
				name: chartData[0].NAME + '/数量',
				type: 'pie',
				minAngle: 5,
				avoidLabelOverlap: true,
				radius: '30%',
				center: ['25%', '50%'],
				data: [{
					name: chartData[0].TITLE,
					value: chartData[0].NUM,
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}, {
					name: chartData[1].TITLE,
					value: chartData[1].NUM,
					label: {
						position: 'inside',
						formatter: function (params) {
							if (params.percent == 0 || params.percent == 100) {
								return '';
							}
						}
					},
					labelLine: {
						show: false
					}
				}]
			}, {
				name: chartData[0].NAME + '/金额',
				type: 'pie',
				minAngle: 5,
				avoidLabelOverlap: true,
				radius: '30%',
				center: ['75%', '50%'],
				data: [{
					name: chartData[0].TITLE,
					value: chartData[0].AMOUNT,
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}, {
					name: chartData[1].TITLE,
					value: chartData[1].AMOUNT,
					label: {
						position: 'inside',
						formatter: function (params) {
							if (params.percent == 0 || params.percent == 100) {
								return '';
							}
						}
					},
					labelLine: {
						show: false
					}
				}]
			}],
			color: ['#46c37b', '#d26a5c']
		};
		chartDom.setOption(chartoption, true);
		chartClick(chartDom);
	}

	function initChart2(chartDom, chartData){
		var chartoption = {
			title: {
				text: '制单人对应分录校验',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: function (param) {
					return '<span>' + param.seriesName + '</span><br><span>' + param.name + ' : ' + formatChart(param.value) + '(' + param.percent + '%)</span>';
				}
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				top: 30,
				data: []
			},
			series: [{
				name: '制单人对应分录/数量',
				type: 'pie',
				radius: '30%',
				center: ['25%', '50%'],
				data: [],
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}, {
				name: '制单人对应分录/金额',
				type: 'pie',
				radius: '30%',
				center: ['75%', '50%'],
				data: [],
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}]
		};
		$.each(chartData, function (index, info) {
			chartoption.legend.data.push(info.voucherFillUser);
			chartoption.series[0].data.push({
				name: info.voucherFillUser,
				value: info.journalNum
			});
			chartoption.series[1].data.push({
				name: info.voucherFillUser,
				value: info.totalOcc
			});
		});
		chartDom.setOption(chartoption, true);
		chartClick(chartDom);
	}

	var datacheck_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/DataCheck.getSubjectDetail.json',
			urlparam: {}
		},
		tableParam: {}
	};

	// 点击饼图查看详细表单
	function chartClick(elem) {
		elem.off('click');
		elem.on('click', function (e) {
			datacheck_view.localParam.urlparam = {
				menuId: window.sys_menuId,
				param3: e.name,
				lockProjectId: $('#check_companyid').val(),
				lockYyyy: $('#check_year').val()
			};
			datacheck_view.tableParam = {
				select: true,
				scrollY: '300',
				lengthChange: true,
				ordering: true,
				order: [1, 'asc'],
				serverSide: true,
				columnDefs: []
			};
			// 凭证
			if (e.name == '平衡凭证' || e.name == '不平衡凭证'
				|| e.name == '科目不重复' || e.name == '科目重复'
				|| e.name == '借方和贷方非0' || e.name == '借方或贷方为0'
				|| e.name == '录入日期正常' || e.name == '录入日期异常'
				|| e.name == '制单人、审核人不同' || e.name == '制单人、审核人相同'
				|| e.name == '有制单人' || e.name == '无制单人'
				|| e.name == '有凭证类型' || e.name == '无凭证类型'
				|| e.name == '有凭证编号' || e.name == '无凭证编号'
				|| e.name == '编制人员权限不正确' || e.name == '编制人员权限正确') {
				datacheck_view.tableParam.columnDefs = [{
					targets: 1,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-center',
					title: '分录日期类型',
					name: 'dateType',
					data: 'dateType',
					width: '100px',
					renderer: 'getDicLabelByVal|dateType',
					render: function (data, type, row, meta) {
						let dateType = DicVal2Nm(data, 'dateType');
						return dateType > '' ? dateType : '工作日';
					}
				}, {
					targets: 3,
					className: 'text-center',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '100px'
				}, {
					targets: 4,
					className: 'text-center',
					title: '系统编号',
					name: 'voucherId',
					data: 'voucherId',
					width: '100px',
					visible: false
				}, {
					targets: 5,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '100px'
				}, {
					targets: 6,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitocc',
					data: 'debitocc',
					width: '150px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditocc',
					data: 'creditocc',
					width: '150px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-center',
					title: '制单人',
					name: 'voucherFillUser',
					data: 'voucherFillUser',
					width: '100px'
				}, {
					targets: 9,
					className: 'text-center',
					title: '审核人',
					name: 'voucherAuditUser',
					data: 'voucherAuditUser',
					width: '100px'
				}, {
					targets: 10,
					className: 'text-center',
					title: '记账人',
					name: 'voucherKeepUser',
					data: 'voucherKeepUser',
					width: '100px'
				}];
			}
			// 分录
			else if (e.name == '有科目编码' || e.name == '无科目编码'
				|| e.name == '发生额不是负数' || e.name == '发生额是负数'
				|| e.name == '摘要不包含关键字' || e.name == '摘要包含关键字') {
				datacheck_view.tableParam.columnDefs = [{
					targets: 1,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-center',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-center',
					title: '系统编号',
					name: 'voucherId',
					data: 'voucherId',
					width: '100px',
					visible: false
				}, {
					targets: 4,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '100px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: 6,
					className: 'text-center',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: '100px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '发生额',
					name: 'occurValue',
					data: 'occurValue',
					width: '150px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: 9,
					className: 'text-left',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '200px'
				}, {
					targets: 10,
					className: 'text-center',
					title: '制单人',
					name: 'voucherFillUser',
					data: 'voucherFillUser',
					width: '100px'
				}, {
					targets: 11,
					className: 'text-center',
					title: '审核人',
					name: 'voucherAuditUser',
					data: 'voucherAuditUser',
					width: '100px'
				}, {
					targets: 12,
					className: 'text-center',
					title: '记账人',
					name: 'voucherKeepUser',
					data: 'voucherKeepUser',
					width: '100px'
				}];
			}
			// 科目和凭证发生额
			else if (e.name == '凭证发生额合计和科目发生额一致' || e.name == '凭证发生额合计和科目发生额不一致') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remainP',
						data: 'remainP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '借方发生额',
						name: 'debitOccP',
						data: 'debitOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 6,
						className: 'text-right',
						title: '分录借方发生额',
						name: 'debitOccS',
						data: 'debitOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '贷方发生额',
						name: 'creditOccP',
						data: 'creditOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 8,
						className: 'text-right',
						title: '分录贷方发生额',
						name: 'creditOccS',
						data: 'creditOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 9,
						className: 'text-right',
						title: '期末余额',
						name: 'balanceP',
						data: 'balanceP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 科目
			else if (e.name == '余额表各次级明细合计数与上一级相等' || e.name == '余额表各次级明细合计数与上一级不相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remainP',
						data: 'remainP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '下级合计期初',
						name: 'remainS',
						data: 'remainS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 6,
						className: 'text-right',
						title: '借方发生额',
						name: 'debitOccP',
						data: 'debitOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '下级合计借方',
						name: 'debitOccS',
						data: 'debitOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 8,
						className: 'text-right',
						title: '贷方发生额',
						name: 'creditOccP',
						data: 'creditOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 9,
						className: 'text-right',
						title: '下级合计贷方',
						name: 'creditOccS',
						data: 'creditOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 10,
						className: 'text-right',
						title: '期末余额',
						name: 'balanceP',
						data: 'balanceP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 11,
						className: 'text-right',
						title: '下级合计期末',
						name: 'balanceS',
						data: 'balanceS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			} else if (e.name == '辅助核算项目、余额相等' || e.name == '辅助核算项目、余额不等'
				|| e.name == '核算余额不小于0' || e.name == '核算余额小于0') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remainP',
						data: 'remainP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '核算期初',
						name: 'remainS',
						data: 'remainS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 6,
						className: 'text-right',
						title: '借方发生额',
						name: 'debitOccP',
						data: 'debitOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '核算借方',
						name: 'debitOccS',
						data: 'debitOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 8,
						className: 'text-right',
						title: '贷方发生额',
						name: 'creditOccP',
						data: 'creditOccP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 9,
						className: 'text-right',
						title: '核算贷方',
						name: 'creditOccS',
						data: 'creditOccS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 10,
						className: 'text-right',
						title: '期末余额',
						name: 'balanceP',
						data: 'balanceP',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 11,
						className: 'text-right',
						title: '核算期末',
						name: 'balanceS',
						data: 'balanceS',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 损益是否结转
			else if (e.name == '损益未结转科目' || e.name == '损益结转科目') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '借方发生额',
						name: 'debitTotalOcc',
						data: 'debitTotalOcc',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 6,
						className: 'text-right',
						title: '贷方发生额',
						name: 'creditTotalOcc',
						data: 'creditTotalOcc',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 8,
						className: 'text-right',
						title: '结转金额',
						name: 'tranOcc',
						data: 'tranOcc',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 科目期初数和期末数校验
			else if (e.name == '本年期初数和上年期末数不相等' || e.name == '本年期初数和上年期末数相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '上年期末余额',
						name: 'amount',
						data: 'amount',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 核算科目期初数和期末数校验
			else if (e.name == '核算本年期初数和上年期末数不相等' || e.name == '核算本年期初数和上年期末数相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '核算科目编号',
						name: 'assItemId',
						data: 'assItemId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '核算科目名称',
						name: 'assTotalName',
						data: 'assTotalName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 5,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 6,
						className: 'text-right',
						title: '上年期末余额',
						name: 'amount',
						data: 'amount',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 本位币和外币校验
			else if (e.name == '余额表和外币余额表期初数相等' || e.name == '余额表和外币余额表期初数不相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '外币期初余额(本位币合计)',
						name: 'remainF',
						data: 'remainF',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 本位币和外币校验
			else if (e.name == '余额表和外币余额表期末数相等' || e.name == '余额表和外币余额表期末数不相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 5,
						className: 'text-right',
						title: '外币期末余额(本位币合计)',
						name: 'balanceF',
						data: 'balanceF',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}
			// 本位币和外币校验
			else if (e.name == '核算余额表和外币核算余额表期初数相等' || e.name == '核算余额表和外币核算余额表期初数不相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '核算编号',
						name: 'assItemId',
						data: 'assItemId',
						width: '150px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '核算名称',
						name: 'assTotalName',
						data: 'assTotalName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 5,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 6,
						className: 'text-right',
						title: '期初余额',
						name: 'remain',
						data: 'remain',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '外币期初余额(本位币合计)',
						name: 'remainF',
						data: 'remainF',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			}// 本位币和外币校验
			else if (e.name == '核算余额表和外币核算余额表期末数相等' || e.name == '核算余额表和外币核算余额表期末数不相等') {
				datacheck_view.tableParam.order = [1, 'asc'],
					datacheck_view.tableParam.columnDefs = [{
						targets: 1,
						className: 'text-left',
						title: '核算编号',
						name: 'assItemId',
						data: 'assItemId',
						width: '150px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '核算名称',
						name: 'assTotalName',
						data: 'assTotalName',
						width: '150px'
					}, {
						targets: 3,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-left',
						title: '科目名称',
						name: 'fullName',
						data: 'fullName',
						width: '150px'
					}, {
						targets: 5,
						className: 'text-center',
						title: '方向',
						name: 'direction',
						data: 'direction',
						width: '100px'
					}, {
						targets: 6,
						className: 'text-right',
						title: '期末余额',
						name: 'balance',
						data: 'balance',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: 7,
						className: 'text-right',
						title: '外币期末余额(本位币合计)',
						name: 'balanceF',
						data: 'balanceF',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}];
			} else {
				datacheck_view.tableParam.columnDefs = [{
					targets: 1,
					className: 'text-center',
					title: '分录日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-center',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-center',
					title: '系统编号',
					name: 'voucherId',
					data: 'voucherId',
					width: '100px',
					visible: false
				}, {
					targets: 4,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '100px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: 6,
					className: 'text-center',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: '100px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '发生额',
					name: 'occurValue',
					data: 'occurValue',
					width: '150px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: 9,
					className: 'text-left',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '200px'
				}, {
					targets: 10,
					className: 'text-center',
					title: '制单人',
					name: 'voucherFillUser',
					data: 'voucherFillUser',
					width: '100px'
				}, {
					targets: 11,
					className: 'text-center',
					title: '审核人',
					name: 'voucherAuditUser',
					data: 'voucherAuditUser',
					width: '100px'
				}, {
					targets: 12,
					className: 'text-center',
					title: '记账人',
					name: 'voucherKeepUser',
					data: 'voucherKeepUser',
					width: '100px'
				}];
			}
			if (e.name == '编制人员权限不正确') {
				getDataCheckAuthPerson($('#check_companyid').val(), $('#check_year').val(), e.name);
			} else {
				$('#datacheck_detail_title').text(e.name + ' 详细信息');
			}
			$('#modal_datacheckdetail').modal('show');
		});
	}
	// 穿透 凭证
	var datacheck_table_voucher = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'FIN201008'
			}
		},
		tableParam: {
			select: true,
			scrollY: '300',
			lengthChange: true,
			ordering: true,
			order: [3, 'asc'],
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-center',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '100px'
			}, {
				targets: 2,
				className: 'text-center',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '100px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '100px'
			}, {
				targets: 4,
				className: 'text-right',
				title: '借方发生额',
				name: 'debitocc',
				data: 'debitocc',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 5,
				className: 'text-right',
				title: '贷方发生额',
				name: 'creditocc',
				data: 'creditocc',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 6,
				className: 'text-center',
				title: '制单人',
				name: 'voucherFillUser',
				data: 'voucherFillUser',
				width: '100px'
			}, {
				targets: 7,
				className: 'text-center',
				title: '审核人',
				name: 'voucherAuditUser',
				data: 'voucherAuditUser',
				width: '100px'
			}, {
				targets: 8,
				className: 'text-center',
				title: '记账人',
				name: 'voucherKeepUser',
				data: 'voucherKeepUser',
				width: '100px'
			}]
		}
	};
	// 分录
	var datacheck_table_entry = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'FIN201009'
			}
		},
		tableParam: {
			select: true,
			scrollY: '300',
			lengthChange: true,
			ordering: true,
			order: [3, 'asc'],
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-center',
				title: '分录日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '100px'
			}, {
				targets: 2,
				className: 'text-center',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '100px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '系统编号',
				name: 'voucherId',
				data: 'voucherId',
				width: '100px',
				visible: false
			}, {
				targets: 4,
				className: 'text-center',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '100px'
			}, {
				targets: 5,
				className: 'text-left',
				title: '摘要',
				name: 'summary',
				data: 'summary',
				width: '200px',
				render: function (data, type, row, meta) {
					if (data && data.length > 15) {
						return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
					}
					return data;
				}
			}, {
				targets: 6,
				className: 'text-center',
				title: '方向',
				name: 'direction',
				data: 'direction',
				width: '100px'
			}, {
				targets: 7,
				className: 'text-right',
				title: '发生额',
				name: 'occurValue',
				data: 'occurValue',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 8,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '100px'
			}, {
				targets: 9,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '200px'
			}, {
				targets: 10,
				className: 'text-center',
				title: '制单人',
				name: 'voucherFillUser',
				data: 'voucherFillUser',
				width: '100px'
			}, {
				targets: 11,
				className: 'text-center',
				title: '审核人',
				name: 'voucherAuditUser',
				data: 'voucherAuditUser',
				width: '100px'
			}, {
				targets: 12,
				className: 'text-center',
				title: '记账人',
				name: 'voucherKeepUser',
				data: 'voucherKeepUser',
				width: '100px'
			}]
		}
	};
	// 显示详细
	$('#modal_datacheckdetail').on('shown.bs.modal', function () {
		$('#datacheck_table').off();
		BdoDataTable('datacheck_table', datacheck_view);
		$('#datacheck_table').on('dblclick', 'tr td', function () {
			var object = $('#datacheck_table').DataTable().data()[$(this).closest('tr').index()];
			if (object.oldVoucherId > '' && object.vchDate > '') {
				if (object.subjectId > '') {
					datacheck_table_voucher.localParam.urlparam.lockProjectId = $('#check_companyid').val();
					datacheck_table_voucher.localParam.urlparam.lockYyyy = $('#check_year').val();
					datacheck_table_voucher.localParam.urlparam.param3 = object.oldVoucherId;
					datacheck_table_voucher.localParam.urlparam.param4 = object.vchDate;
					$('#modal_datacheckdetail_voucher').modal('show');
				} else {
					datacheck_table_entry.localParam.urlparam.lockProjectId = $('#check_companyid').val();
					datacheck_table_entry.localParam.urlparam.lockYyyy = $('#check_year').val();
					datacheck_table_entry.localParam.urlparam.param3 = object.oldVoucherId;
					datacheck_table_entry.localParam.urlparam.param4 = object.vchDate;
					datacheck_table_entry.localParam.urlparam.param5 = '';
					$('#modal_datacheckdetail_entry').modal('show');
				}
			} else if (object.subjectId > '') {
				datacheck_table_entry.localParam.urlparam.lockProjectId = $('#check_companyid').val();
				datacheck_table_entry.localParam.urlparam.lockYyyy = $('#check_year').val();
				datacheck_table_entry.localParam.urlparam.param3 = '';
				datacheck_table_entry.localParam.urlparam.param4 = '';
				datacheck_table_entry.localParam.urlparam.param5 = object.subjectId;
				$('#modal_datacheckdetail_entry').modal('show');
			}
		});
		$('#modal_datacheckdetail_export').off();
		$('#modal_datacheckdetail_export').on('click', function () {
			exportExcelFin(this, datacheck_view.localParam.urlparam.param3, datacheck_view, 'datacheck_table');
		});
		$('#modal_datacheckdetail_btn_viewuser').off();
		$('#modal_datacheckdetail_btn_viewuser').on('click', function () {
			$.ajax({
				url: 'finCenter/General.query.json',
				type: 'post',
				data: {
					sqlId: 'FIN201014',
					lockProjectId: $('#check_companyid').val(),
					lockYyyy: $('#check_year').val()
				},
				dataType: 'json',
				success: function (data) {
					if (data.success && data.data && data.data.length > 0) {
						var userHtml = '';
						$.each(data.data, function (index, value) {
							userHtml += '<tr><td>' + value.userType + '</td><td>' + value.voucherUser + '</td></tr>';
						})
						$('#modal_datacheckdetail_usertable').html(userHtml);
						$('#modal_datacheckdetail_viewuser').modal('show');
					}
				}
			});
		});
	});

	$('#modal_datacheckdetail_voucher').on('shown.bs.modal', function () {
		$('#datacheck_table_voucher').off();
		BdoDataTable('datacheck_table_voucher', datacheck_table_voucher);
		$('#datacheck_table_voucher').on('dblclick', 'tr td', function () {
			var object = $('#datacheck_table_voucher').DataTable().data()[$(this).closest('tr').index()];
			if (object.oldVoucherId > '' && object.vchDate > '') {
				datacheck_table_entry.localParam.urlparam.lockProjectId = $('#check_companyid').val();
				datacheck_table_entry.localParam.urlparam.lockYyyy = $('#check_year').val();
				datacheck_table_entry.localParam.urlparam.param3 = object.oldVoucherId;
				datacheck_table_entry.localParam.urlparam.param4 = object.vchDate;
				datacheck_table_entry.localParam.urlparam.param5 = '';
				$('#modal_datacheckdetail_entry').modal('show');
			}
		});
		$('#modal_datacheckdetail_voucher_export').off();
		$('#modal_datacheckdetail_voucher_export').on('click', function () {
			exportExcelFin(this, datacheck_view.localParam.urlparam.param3, datacheck_table_voucher, 'datacheck_table_voucher');
		});
	});

	$('#modal_datacheckdetail_entry').on('shown.bs.modal', function () {
		BdoDataTable('datacheck_table_entry', datacheck_table_entry);
		$('#modal_datacheckdetail_entry_export').off();
		$('#modal_datacheckdetail_entry_export').on('click', function () {
			exportExcelFin(this, datacheck_view.localParam.urlparam.param3, datacheck_table_entry, 'datacheck_table_entry');
		});
	});

	function formatChart(val) {
		if (isNaN(val)) {
			return val;
		} else if (val % 1 == 0) {
			return accounting.formatMoney(val, '', 0, ',', '.');
		} else if (val % 1 != 0) {
			return accounting.formatMoney(val, '', 2, ',', '.');
		}
		return val;
	}

	// 弹出框时,使页面不置顶
	$('html,body').css({
		'overflow': 'auto',
		'height': '100%',
		'-webkit-overflow-scrolling': 'touch'
	});

	// 显示修改记录
	$('#dataisEdit').on('click', function () {
		$('#modal_editinfo').modal('show');
	});

	$('#modal_editinfo').on('shown.bs.modal', function () {
		let editTabParamIndex = 1;
		let editTabParam = {
			localParam: {
				tabNum: true,
				url: 'base/General.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'FA10103',
					lockProjectId: $('#check_companyid').val(),
					lockYyyy: $('#check_year').val()
				}
			},
			tableParam: {
				select: true,
				scrollX: true,
				lengthChange: true,
				ordering: true,
				order: [3, 'asc'],
				serverSide: true,
				columnDefs: [{
					targets: editTabParamIndex++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '70px'
				}, {
					targets: editTabParamIndex++,
					className: 'text-center',
					title: '类型',
					name: 'editType',
					data: 'editType',
					width: '100px'
				}, {
					targets: editTabParamIndex++,
					className: 'text-left',
					title: '详细信息',
					name: 'content',
					data: 'content',
					width: '500px'
				}, {
					targets: editTabParamIndex++,
					className: 'text-center',
					title: '修改人',
					name: '__ueditUserName',
					data: '__ueditUserName',
					width: '70px'
				}, {
					targets: editTabParamIndex++,
					className: 'text-center',
					title: '修改时间',
					name: 'editDate',
					data: 'editDate',
					width: '100px'
				}]
			}
		};
		BdoDataTable('tab_edit_info', editTabParam);
	});
	// 制单人和审核人权限
	var voucher_auth_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/DataCheck.queryVoucherUserAuth.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: $('#check_companyid').val()
			}
		},
		tableParam: {
			select: true,
			scrollY: '300',
			lengthChange: true,
			ordering: true,
			order: [1, 'asc'],
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-center',
				title: '姓名',
				name: 'userName',
				data: 'userName',
				width: '100px'
			}, {
				targets: 2,
				className: 'text-center',
				title: '角色',
				name: 'roleName',
				data: 'roleName',
				width: '100px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '年份',
				name: 'yyyy',
				data: 'yyyy',
				width: '100px'
			}, {
				targets: 4,
				className: 'text-left',
				title: '科目',
				name: 'subjectName',
				data: 'subjectName',
				width: '150px'
			}]
		}
	};
	function voucherAuthUploadInit() {
		/** 导入页面 */
		$('#voucherAuthUpload').off('click');
		$('#voucherAuthUpload').on('click', function () {
			$('#modal_datacheck_voucher_auth').modal('show');
			$('#importAuthCustomer').html('&nbsp;' + $('#check_companyid').find('option:selected').text())
			voucher_auth_view.localParam.urlparam.lockProjectId = $('#check_companyid').val();
			BdoDataTable('datacheck_voucher_auth_table', voucher_auth_view);
		});
	}
	/** 查询导入的权限数据 */
	$('#datacheck_voucher_auth_search').click(function (e) {
		voucher_auth_view.localParam.urlparam.lockProjectId = $('#datacheck_voucher_auth_customerId').val();
		BdoDataTable('datacheck_voucher_auth_table', voucher_auth_view);
	});
	/** 导出权限数据 */
	$('#modal_datacheck_voucher_auth_export').on('click', function () {
		exportExcel(this, "编制人员权限", voucher_auth_view, 'datacheck_voucher_auth_table');
		return false;
	});
	/** 下载模板按钮 */
	$('#voucher_auth_downtemp').click(function (e) {
		downloadFile('finCenter/DataCheck.downloadVoucherUserModal.json', {});
	});
	/** 导入客户余额表按钮 */
	$('#datacheck_voucher_auth_import').click(function () {
		checkImportAuth($('#check_companyid').val(), voucherAuthImportInit);
	});
	function voucherAuthImportInit() {
		$('#modal_voucher_auth_import').modal('show');
		$('#voucher_auth_customerId').val($('#check_companyid').val());
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			acceptedFiles: '.xlsx',
			allowedFileExtensions: ['xlsx'],
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			showCancel: false,
			showClose: false,
			required: true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			uploadAsync: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadUrl: 'finCenter/DataCheck.importVoucherUser.json',
			uploadExtraData: function () {
				return {
					lockProjectId: '',
					lockYyyy: ''
				};
			}
		};
		pluginOpt.uploadExtraData = function () {
			return {
				lockProjectId: $('#voucher_auth_customerId').val()
				//lockYyyy: $('#account_yyyy_model').val(),
			};
		};
		var $el = $('#voucher_auth_fileinput').fileinput(pluginOpt);
		$el.on('filebatchuploadsuccess', function (event, data) {
			BdoDataTable('datacheck_voucher_auth_table', voucher_auth_view);
			refreshVoucherAuth(voucher_auth_view.localParam.urlparam.lockProjectId, $('#check_year').val());
			if (!data.response.success) {
				bdoErrorBox('系统提示', data.response.resultInfo.statusText);
			} else {
				bdoSuccessBox('上传成功');
			}
			$('#modal_voucher_auth_import').modal('hide');
			$('#voucher_auth_fileinput').fileinput('clear');
			$('#voucher_auth_fileinput').fileinput('enable');
		});
		$el.on('filebatchuploaderror', function (event, data, msg) {
			BdoDataTable('datacheck_voucher_auth_table', voucher_auth_view);
			refreshVoucherAuth(voucher_auth_view.localParam.urlparam.lockProjectId, $('#check_year').val());
			bdoErrorBox('系统提示', msg);
			$('#modal_voucher_auth_import').modal('hide');
			$('#voucher_auth_fileinput').fileinput('clear');
			$('#voucher_auth_fileinput').fileinput('enable');
		});
		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}
		/** 导入按钮 */
		$('#voucher_auth_submit').click(function () {
			var fileUrl = $('#voucher_auth_fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认导入吗？';
			bdoConfirmBox('确认', tip, function () {
				uploadFile();
			});
		});
	}
	function checkImportAuth(customerId, callback) {
		$.ajax({
			type: 'get',
			url: 'cpBase/Combo.getCustomerForImport.json',
			dataType: 'json',
			async: true,
			success: function (data) {
				var hasAuth = false;
				$.each(data.data, function (i, info) {
					if (info.value == customerId) {
						hasAuth = true;
						callback();
					}
				});
				if (!hasAuth) {
					bdoInfoBox('提示', '无权限，无法导入！');
				}
			}
		});
	}
	// 生成图表
	function refreshCheckChart(object, chartIndex) {
		var checkchart, chartoption;
		$('#chart' + chartIndex).empty();
		document.getElementById('chart' + chartIndex).removeAttribute("_echarts_instance_");
		$.each(object.CHECK1, function (index, info) {
			if (info) {
				checkchart = echarts.init(document.getElementById('chart' + chartIndex));
				var chartTitleColor = 'rgba(0, 0, 0, 1)';
				if (info[1].NUM != 0) {
					chartTitleColor = 'rgba(255, 0, 0, 1)';
				}
				chartoption = {
					title: {
						text: info[0].NAME,
						textStyle: {
							color: chartTitleColor
						},
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						position: 'inside',
						formatter: function (param) {
							return '<span>' + param.seriesName + '</span><br><span>' + param.name + ' : ' + formatChart(param.value) + '(' + param.percent + '%)</span>';
						}
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						top: 30,
						data: [info[0].TITLE, info[1].TITLE]
					},
					series: [{
						name: info[0].NAME + '/数量',
						type: 'pie',
						minAngle: 5,
						avoidLabelOverlap: true,
						radius: '30%',
						center: ['25%', '50%'],
						data: [{
							name: info[0].TITLE,
							value: info[0].NUM,
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}, {
							name: info[1].TITLE,
							value: info[1].NUM,
							label: {
								position: 'inside',
								formatter: function (params) {
									if (params.percent == 0 || params.percent == 100) {
										return '';
									}
								}
							},
							labelLine: {
								show: false
							}
						}]
					}, {
						name: info[0].NAME + '/金额',
						type: 'pie',
						minAngle: 5,
						avoidLabelOverlap: true,
						radius: '30%',
						center: ['75%', '50%'],
						data: [{
							name: info[0].TITLE,
							value: info[0].AMOUNT,
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}, {
							name: info[1].TITLE,
							value: info[1].AMOUNT,
							label: {
								position: 'inside',
								formatter: function (params) {
									if (params.percent == 0 || params.percent == 100) {
										return '';
									}
								}
							},
							labelLine: {
								show: false
							}
						}]
					}],
					color: ['#46c37b', '#d26a5c']
				};
				checkchart.setOption(chartoption, true);
				chartClick(checkchart);
			}
		});
	}
	// 刷新编制人权限图标
	function refreshVoucherAuth(check_companyid, check_year) {
		$.ajax({
			url: 'finCenter/DataCheck.getDataCheckAuth.json',
			type: 'post',
			bdolxLoader: false,
			data: {
				lockProjectId: check_companyid,
				lockYyyy: check_year
			},
			dataType: 'json',
			success: function (data) {
				if (data.data && data.data.length > 0) {
					refreshCheckChart(data.data[0], '203');
				}
				$('#check_search').removeAttr('disabled');
			}
		});
	}
	// 获取权限不正确人员
	function getDataCheckAuthPerson(check_companyid, check_year, name) {
		$.ajax({
			url: 'finCenter/DataCheck.getDataCheckAuthPerson.json',
			type: 'post',
			bdolxLoader: false,
			data: {
				lockProjectId: check_companyid,
				lockYyyy: check_year
			},
			dataType: 'json',
			success: function (data) {
				if (data.data && data.data.length > 0) {
					var userName = '(';
					for (var i = 0; i < data.data.length; i++) {
						if (data.data[i].userName != null) {
							userName = userName + data.data[i].userName + ',';
						}
					}
					if (userName.length > 1) {
						userName = userName.substring(0, userName.length - 1);
					}
					userName = userName + ')';
					$('#datacheck_detail_title').text(name + ' 详细信息' + userName);
				}
			}
		});
	}
});