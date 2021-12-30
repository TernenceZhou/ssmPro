$(document).ready(function(){
	function HomePage() {
		let $homePage = $('#homePage');
		let $homeCustomerCount = $('#homeCustomerCount', $homePage);
		let $homeProjectCount = $('#homeProjectCount', $homePage);
		let $homeSpeedProgress = $('#homeSpeedProgress', $homePage);
		let $homePostilCount = $('#homePostilCount', $homePage);
		let $currentTime = $('#currentTime', $homePage);
		let $refreshData = $('#refreshData', $homePage);
		let $homeProjectTable = $('#homeProjectTable', $homePage);
		let $homePostilTable = $('#homePostilTable', $homePage);
		let $homeCustomerFinTable = $('#homeCustomerFinTable', $homePage);
		let $homeCustomerFinTableSearch = $('#homeCustomerFinTableSearch', $homePage);
		let $homeCustomerFinTableReset = $('#homeCustomerFinTableReset', $homePage);
		let $homeProjectTableSearch = $('#homeProjectTableSearch', $homePage);
		let $homeProjectTableReset = $('#homeProjectTableReset', $homePage);
		let $homePostilTableSearch = $('#homePostilTableSearch', $homePage);
		let $homePostilTableReset = $('#homePostilTableReset', $homePage);
		function chart1Init() {
			let dom = document.getElementById("chart1");
			let myChart = echarts.init(dom);
			let data = [];
			let now = +new Date(1997, 9, 3);
			let oneDay = 24 * 3600 * 1000;
			let value = Math.random() * 1000;
			for (let i = 0; i < 1000; i++) {
				data.push(randomData());
			}
			let option = null;
			option = {
				grid: {
					show: false
				},
				xAxis: {
					show: false,
					type: 'time',
					/*boundaryGap: false,
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']*/
				},
				yAxis: {
					show: false,
					type: 'value',
					boundaryGap: [0, '100%'],
				},
				series: [{
					data: [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320],
					type: 'line',
					symbol: 'none',
					areaStyle: {
						normal: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

								offset: 0,
								color: 'rgba(80,141,255,0.39)'
							}, {
								offset: .34,
								color: 'rgba(56,155,255,0.25)'
							}, {
								offset: 1,
								color: 'rgba(38,197,254,0.00)'
							}])
						}
					},
					symbolSize: 0,
					itemStyle: {
						normal: {
							lineStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

									offset: 0,
									color: 'rgba(80,141,255,0.39)'
								}, {
									offset: .34,
									color: 'rgba(56,155,255,0.25)'
								}, {
									offset: 1,
									color: 'rgba(38,197,254,0.00)'
								}])
							}
						}
					},
				}]
			};
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}

			function randomData() {
				now = new Date(+now + oneDay);
				value = value + Math.random() * 21 - 10;
				return {
					name: now.toString(),
					value: [
						[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
						Math.round(value)
					]
				}
			}

			setInterval(function() {
				for (let i = 0; i < 5; i++) {
					data.shift();
					data.push(randomData());
				}
				myChart.setOption({
					series: [{
						data: data
					}]
				});
			}, 1000);
		}
		function chart2Init() {
			let dom = document.getElementById("chart2");
			let myChart = echarts.init(dom);
			let dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
			let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
			let yMax = 500;
			let dataShadow = [];

			for (let i = 0; i < data.length; i++) {
				dataShadow.push(yMax);
			}

			let option = {
				xAxis: {
					show: false,
					data: dataAxis,
					axisLabel: {
						inside: true,
						textStyle: {
							color: '#fff'
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					z: 10
				},
				yAxis: {
					show: false,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						textStyle: {
							color: '#999'
						}
					}
				},
				dataZoom: [
					{
						type: 'inside'
					}
				],
				series: [
					{ // For shadow
						type: 'bar',
						itemStyle: {
							normal: {color: 'rgba(0,0,0,0.05)'}
						},
						barGap:'-100%',
						barCategoryGap:'40%',
						data: dataShadow,
						animation: false
					},
					{
						type: 'bar',
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
										{offset: 0, color: '#83bff6'},
										{offset: 0.5, color: '#188df0'},
										{offset: 1, color: '#188df0'}
									]
								)
							},
							emphasis: {
								color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
										{offset: 0, color: '#2378f7'},
										{offset: 0.7, color: '#2378f7'},
										{offset: 1, color: '#83bff6'}
									]
								)
							}
						},
						data: data
					}
				]
			};
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}
			// Enable data zoom when user click bar.
			let zoomSize = 6;
			myChart.on('click', function (params) {
				console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
				myChart.dispatchAction({
					type: 'dataZoom',
					startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
					endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
				});
			});
		}
		function chart3Init() {
			let dom = document.getElementById("chart3");
			let myChart = echarts.init(dom);
			let option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				xAxis: {
					show: false,
					type: 'value',
					boundaryGap: [0, 0.01]
				},
				yAxis: {
					show: false,
					type: 'category',
					data: ['']
				},
				series: [
					{
						type: 'bar',
						data: [18203],
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
										{offset: 0, color: '#2BE3C8'},
										{offset: 0.5, color: '#188df0'},
										{offset: 1, color: '#13C2C2'}
									]
								)
							},
							emphasis: {
								color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
										{offset: 0, color: '#2BE3C8'},
										{offset: 0.7, color: '#2378f7'},
										{offset: 1, color: '#13C2C2'}
									]
								)
							}
						}
					}
				]
			};
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}
		}
		function chart4Init() {
			let option = {
				color: ['#3398DB'],
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						data : ['0', '0%~20%', '20%~40%', '40%~60%', '60%~80%', '80%~100%', '100%'],
						axisTick: {
							alignWithLabel: true
						},
						name: '进度（%）'
					}
				],
				yAxis : [
					{
						minInterval: 1,
						type : 'value',
						name: '项目数'
					}
				],
				series : [
					{
						name:'',
						type:'bar',
						barWidth: '60%',
						data:[]
					}
				]
			};
			$.ajax({
				url: 'cpBase/General.queryProjectById.json',
				data: {
					menuId : window.sys_menuId,
					sqlId : 'DG00093',
					param1 : window.sys_userId,
					page: 0,
					limit: -1,
					start: -1
				},
				type: 'POST',
				dataType : 'json'
			}).done((data) => {
				if(data.success) {
					if(data.data && data.data.length > 0) {
						option.series[0].data = [];
						let seriesData = [];
						seriesData.push(data.data.filter(item => item.progress == 0).length);
						seriesData.push(data.data.filter(item => item.progress > 0 && item.progress <= 20 ).length);
						seriesData.push(data.data.filter(item => item.progress > 20 && item.progress <= 40 ).length);
						seriesData.push(data.data.filter(item => item.progress > 40 && item.progress <= 60 ).length);
						seriesData.push(data.data.filter(item => item.progress > 60 && item.progress <= 80 ).length);
						seriesData.push(data.data.filter(item => item.progress > 80 && item.progress < 100 ).length);
						seriesData.push(data.data.filter(item => item.progress == 100 ).length);
						option.series[0].data = seriesData;
						let dom = document.getElementById("chart4");
						let myChart = echarts.init(dom);

						if (option && typeof option === "object") {
							myChart.setOption(option, true);
						}
					}
				}
			});

		}

		/**
		 * 客户账套列表初始化
		 * @returns {*}
		 */
		function finTableInit() {
			let cnt = 0;
			let finTableConf = {
				localParam : {
					url: 'cpBase/General.queryCustomerFin.json',
					urlparam: {
						menuId : window.sys_menuId,
						sqlId : 'DG00131',
						param1 : window.sys_userId,
						param2 : $('#home_detail_customerId').val()
					},
					tabNum : false
				},
				tableParam : {
					scrollY: false,
					scrollX : true,
					select : true,
					ordering : true,
					pageLength : 10,
					dom:
						"<'row'<'col-sm-12'tr>>" +
						"<'row'<'col-sm-6'i><'col-sm-6'p>>",
					columnDefs :[{
						targets : (()=>{cnt=0;return ++cnt;})(),
						orderable : false,
						className : 'text-center',
						title : '处理',
						width : '10px',
						render(data, type, row, meta) {
							let renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" name="optLinkToBalance" data-placement="top" title="进入" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-link"></i>'
								+'	</button>';
							return renderStr;
						}
					},{
						targets : ++cnt,
						orderable : true,
						className : 'text-left',
						title : '客户',
						name: 'customerName',
						data : 'customerName',
						width : '250px',
						render(data, type, row, meta) {
							return '<a>'+data+'</a>';
						}
					}, {
						targets : ++cnt,
						orderable : true,
						className : 'text-center',
						title : '账套',
						name : 'yyyy',
						data : 'yyyy',
						width : '80px'
					}, {
						targets : ++cnt,
						orderable : true,
						className : 'text-center',
						title : '最后导入时间',
						name : 'importDate' ,
						data : 'importDate',
						width : '100px',
						render(data) {
							return new Date(data).format('yyyy-MM-dd HH:mm:ss');
						}
					}, {
						targets : ++cnt,
						orderable : true,
						className : 'text-center',
						title : '上传用户',
						name : 'yyyy',
						data : '__uuploadUser',
						width : '80px',
						render(data) {
							if(!data) {
								return '';
							}
							return data.userName;
						}
					}]
				}
			};
			BdoDataTable('homeCustomerFinTable', finTableConf);
		}

		/**
		 * 在执行项目列表初始化
		 * @returns {*}
		 */
		function projectTableInit() {
			let cnt = 0;
			let projectTableConf = {
				localParam : {
					url: 'cpBase/General.queryProjectById.json',
					urlparam: {
						menuId : window.sys_menuId,
						sqlId : 'DG00093',
						param1 : window.sys_userId,
						param2 : $('#home_projectName').val(),
						limit: -1,
						start: -1
					},
					tabNum : false
				},
				tableParam : {
					scrollY: false,
					scrollX : true,
					select : true,
					ordering : false,
					pageLength : 10,
					dom:
						"<'row'<'col-sm-12'tr>>" +
						"<'row'<'col-sm-6'i><'col-sm-6'p>>",
					columnDefs :[{
						targets : (()=>{cnt=0;return ++cnt;})(),
						orderable : false,
						className : 'text-center',
						title : '处理',
						width : '10px',
						render(data, type, row, meta) {
							let renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-dgcenter" type="button" name="optLinkToDgCenter" data-placement="top" title="进入" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-link"></i>'
								+'	</button>';
							return renderStr;
						}
					},{
						targets : ++cnt,
						orderable : false,
						className : 'text-left',
						title : '项目名称',
						name: 'projectName',
						data : 'projectName',
						width : '300px'/*,
						render(data, type, row, meta) {
							return '';
						}*/
					}, {
						targets : ++cnt,
						orderable : true,
						title : '项目负责人',
						name : 'manager',
						data : '__umanager',
						width : '80px',
						render(data, type, row, meta) {
							if(!data) {
								return '';
							}
							return data.userName;
						}
					}, {
						targets : ++cnt,
						orderable : true,
						title : '审计开始时间',
						name : 'projectStartDate' ,
						data : 'projectStartDate',
						width : '150px'/*,
						render(data, type, row, meta) {
							return new ;
						}*/
					}, {
						targets : ++cnt,
						orderable : true,
						title : '进度',
						name : 'progress',
						data : 'progress',
						width : '300px',
						render(data, type, row, meta) {
							return `<div class="progress progress-mini progress-none-margin">
										<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="+`+data+`+" aria-valuemin="0" aria-valuemax="100" style="width: `+data+`%"></div>
									</div>`;
						}
					}, {
						targets : ++cnt,
						orderable : true,
						title : '',
						name : 'progressV',
						//data : 'progress',
						width : '10px',
						render(data, type, row, meta) {
							return row.progress + '%';
						}
					}]
				}
			};
			BdoDataTable('homeProjectTable', projectTableConf);
		}

		/**
		 * 附注列表初始化
		 * @returns {*}
		 */
		function postilTableInit() {
			let cnt = 0;
			let postilTableConf = {
				localParam: {
					url: 'cpBase/General.queryProjectById.json',
					urlparam: {
						menuId: window.sys_menuId,
						sqlId: 'DG00101',
						param1: window.sys_userId,
						param2 : $('#home_postil_projectName').val(),
						limit: -1,
						start: -1
					},
					tabNum: false
				},
				tableParam: {
					scrollY: false,
					scrollX: true,
					select: true,
					ordering: false,
					autoWidth: false,
					pageLength: 10,
					dom:
						"<'row'<'col-sm-12'tr>>" +
						"<'row'<'col-sm-6'i><'col-sm-6'p>>",
					columnDefs: [{
						targets : (()=>{cnt=0;return ++cnt;})(),
						orderable : false,
						className : 'text-center',
						title : '处理',
						width : '10px',
						render(data, type, row, meta) {
							let renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-postil" type="button" name="optLinkToPostil" data-placement="top" title="进入批注汇总" data-toggle="tooltip" data-row="' + meta.row + '">'
								+'	<i class="fa fa-eye"></i>'
								+'	</button>';
							return renderStr;
						}
					},{
						targets: ++cnt,
						orderable: false,
						className: 'text-left',
						title: '项目名称',
						name: 'projectName',
						data: 'projectName',
						width: '300px'
					}, {
						targets: ++cnt,
						orderable: true,
						title: '批注摘要',
						className: 'text-left',
						name: 'postilContentText',
						data: 'postilContentText',
						width: '100px',
						render(data, tyep, row, meta) {
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}
					}, {
						targets: ++cnt,
						orderable: true,
						title: '审计阶段',
						className: 'text-center',
						name: 'auditState',
						data: 'auditState',
						renderer: 'getDicLabelByVal|审计阶段',
						width: '70px',
						render(data) {
							return DicVal2Nm(data, '审计阶段');//data == 100 ? '一审' : (data == 200 ? '二审' : '三审');
						}
					},/* {
						targets: ++cnt,
						orderable: true,
						title: '底稿编制人',
						name: '__uWorkpaperEditor',
						data: '__uWorkpaperEditor',
						width: '150px',
						render(data, type, row, meta) {
							if(!data) {
								return '';
							}
							return data.userName;
						}
					},*/ {
						targets: ++cnt,
						orderable: true,
						title: '批注状态',
						name: 'state',
						data: 'state',
						renderer: 'getDicLabelByVal|批注状态',
						width: '50px',
						render(data) {
							return DicVal2Nm(data, '批注状态');//data == 1 ? '开启' : '关闭';
						}
					}, {
						targets: ++cnt,
						orderable: true,
						title: '批注日期',
						name: 'createDate',
						data : 'createDate',
						width: '80px',
						render(data, type, row, meta) {
							return new Date(data).format('yyyy-MM-dd HH:mm:ss');
						}
					}, {
						targets: ++cnt,
						orderable: true,
						title: '批注人',
						name: '__uCreateUser',
						data : '__uCreateUser',
						width: '50px',
						render(data, type, row, meta) {
							if(!data) {
								return '';
							}
							return data.userName;
						}
					}]
				}
			};
			BdoDataTable('homePostilTable', postilTableConf);
		}

		/**
		 * 统计数据
		 */
		function countInfoInit() {
			$homeCustomerCount.text('');
			$homeProjectCount.text('');
			$homeSpeedProgress.text('');
			$homePostilCount.text('');
			$currentTime.text('');
			$.ajax({
				url: 'cpBase/General.queryDgHomePageInfo.json',
				data: {
					menuId: window.sys_menuId
				},
				type: 'POST',
				dataType : 'json'
			}).done(function(data) {
				if(data.success) {
					let respData = data.data[0];
					function getDefVal(val, defval) {
						if(defval) {
							return defval;
						}
						if(!val) {
							return 0;
						}
						return val;
					}
					$.each(respData, (k, o) => {
						if(o == null || o == undefined) {
							respData[k] = 0;
						}
					});
					$homeCustomerCount.text(getDefVal(respData.cusCount));
					$homeProjectCount.text(getDefVal(respData.prjCount));
					$homeSpeedProgress.text(getDefVal(respData.prjInProgressCount) + ' / ' + (getDefVal(respData.prjFinishedCount)));
					$homePostilCount.text(getDefVal(respData.postilInProgressCount) + ' / ' + (getDefVal(respData.postilFinishCount) + getDefVal(respData.postilInProgressCount)));
					$currentTime.text(new Date(getDefVal(respData.currentTime, '')).format('yyyy-MM-dd HH:mm:ss'));
				}else {

				}
			});
		}

		function saveProject(param, menuId) {
			if(!param.param3 || param.param3 == '') {
				bdoErrorBox('错误', '项目编号不能为空！');
			}
			$.ajax({
				type : 'post',
				url : 'dgCenter/CustomerProjectSet.save.json',
				data : param,
				dataType : 'json',
				success : function(data) {
					if(data.success){
						reLoadLoginData();
						let resultData = data.data[0];
						window.CUR_DGPROJECT_AUTOID = resultData.autoId;
						window.CUR_CUSTOMERID = resultData.customerId;
						window.BDO_CUSTOMER_SELECT = window.CUR_CUSTOMERID;
						window.CUR_CUSTOMERNAME = resultData.customerName;
						window.BDO_CUSTOMERNAME_SELECT = resultData.customerName;
						window.CUR_PROJECTID = resultData.projectId ;
						window.CUR_PROJECTNAME = resultData.projectName.split('-')[1];
						window.CUR_PROJECT_START_YEAR = resultData.auditStartYear;
						window.CUR_PROJECT_END_YEAR = resultData.auditEndYear;
						window.CUR_PROJECT_START_MONTH = resultData.auditEndYear;
						window.CUR_PROJECT_END_MONTH = resultData.auditEndMonth;
						window.BDO_PROJECTNAME_SELECT = window.CUR_PROJECTID + "-" + window.CUR_PROJECTNAME;
						window.CUR_PROJECT_ACC_YEAR = resultData.dgAccYear;
						/*$('#navCustomerName').text("客户："+(window.BDO_CUSTOMER_SELECT && window.BDO_CUSTOMER_SELECT != 'null' ? window.BDO_CUSTOMER_SELECT+"-"+window.BDO_CUSTOMERNAME_SELECT : ''));
						$('#navProjectName').text("项目："+(window.BDO_PROJECTNAME_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : ''));*/
						let navCustomerNameText = (window.BDO_CUSTOMER_SELECT && window.BDO_CUSTOMER_SELECT != 'null' ? window.BDO_CUSTOMER_SELECT + '-' + window.BDO_CUSTOMERNAME_SELECT : '');
						if(navCustomerNameText > '') {
							navCustomerNameText = '客户：' + navCustomerNameText;
						}
						let navProjectNameText = (window.BDO_PROJECTNAME_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : '');
						if(navProjectNameText > '') {
							navProjectNameText = '项目：' + navProjectNameText;
						}
						$('#navCustomerName').text(navCustomerNameText);
						$('#navProjectName').text(navProjectNameText);
						$('body').trigger('transferMenu', [{
							menuId: menuId
						}, function() {
							window.transferedMenu = true;
						}]);
					}else {
						bdoErrorBox('失败', '项目切换失败！');
					}
				}
			});
		}

		function eventBind() {
			$refreshData.click(function(event) {
				$.ajax({
					type: 'POST',
					url: 'dgCenter/CustomerProjectSet.refreshUserCustomers.json',
					dataType: 'json',
					data: {
						menuId: window.sys_menuId
					}
				}).done(function(data) {
					if(data.success) {
						userCustomers = data.data[0].userCustomers;
						countInfoInit();
						chart4Init();
						$homeProjectTable.DataTable().ajax.reload();
						$homePostilTable.DataTable().ajax.reload();
						$homeCustomerFinTable.DataTable().ajax.reload();
					}else {
						bdoInfoBox("", data.resultInfo.statusText);
					}
				});
			});
			$homeCustomerFinTable.on('click', '.opt-link-to-balance', function(event) {
				if(!checkMenu('40000007')){
					bdoInfoBox("", '您没有权限访问，请先去平台考核完成基础考核。');
					return;
				}
				event.preventDefault();
				// 获取当前列数据
				let table = $homeCustomerFinTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				window.BDO_CUSTOMER_SELECT_temp = window.BDO_CUSTOMER_SELECT;
				window.BDO_CUSTOMER_SELECT = rowData.customerId;
				window.BDO_YEAR_SELECT_temp = window.BDO_YEAR_SELECT;
				window.BDO_YEAR_SELECT = rowData.yyyy;
				window.transferedMenu = true;
				$('body').trigger('transferMenu', [{
					menuId: '40000007'
				}, function() {
					//$('#account_year').val(BDO_YEAR_SELECT);
					window.BDO_CUSTOMER_SELECT_temp = window.BDO_CUSTOMER_SELECT;
					window.BDO_YEAR_SELECT_temp = window.BDO_YEAR_SELECT;
					window.transferedMenu = false;
				}]);
			});
			$homeProjectTable.on('click', '.opt-link-to-dgcenter', function(event) {
				let menuId = '40000022';
				if(!checkMenu(menuId)){
					bdoInfoBox("", '您没有权限访问，请先去平台考核完成高级考核。');
					return;
				}
				// 获取当前列数据
				let table = $homeProjectTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let customerId = rowData.customerId;
				let projectId = rowData.projectId;
				let projectName = rowData.projectName;
				let auditStartDate = rowData.auditTimeBegin;
				let auditEndDate = rowData.auditTimeEnd;
				let customerName = rowData.customerName;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00142',
						param1: projectId,
						param2: customerId,
						param3: window.sys_userId,
						limit: -1,
						start: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								event.preventDefault();
								if(customerId != window.CUR_CUSTOMERID && projectId != window.CUR_PROJECTID) {
									let param = {
										param1 : customerId,
										param2 : customerName.replace(customerId+'-', ''),
										param3 : projectId,
										param4 : projectName,
										param5 : auditStartDate,
										param6 : auditEndDate,
										lockProjectId: '0'
									};
									if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
										bdoErrorBox('切换项目失败[0005]', '客户编号和项目编号不能为空。');
									}
									saveProject(param, menuId);
								}else {
									$('body').trigger('transferMenu', [{
										menuId: menuId
									}, function() {
										window.transferedMenu = true;
									}]);
								}
							}else{
								bdoErrorBox('切换项目失败', '您没有该项目权限');
							}
							
						} else {
							bdoErrorBox('切换项目失败', data.resultInfo.statusText);
						}
					}
				});
				
			});
			$homeCustomerFinTableSearch.on('click', function() {
				finTableInit();
			});
			$homeCustomerFinTableReset.on('click', function() {
				$('#home_detail_customerId').val('');
				finTableInit();
			});
			$homeProjectTableSearch.on('click', function() {
				projectTableInit();
			});
			$homeProjectTableReset.on('click', function() {
				$('#home_projectName').val('');
				projectTableInit();
			});
			$homePostilTable.on('click', '.opt-link-to-postil', function(event) {
				let menuId = '40000072';
				if(!checkMenu(menuId)){
					bdoInfoBox("", '您没有权限访问，请先去平台考核完成高级考核。');
					return;
				}
				// 获取当前列数据
				let table = $homePostilTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let customerId = rowData.customerId;
				let customerName = rowData.customerName;
				let projectId = rowData.projectId;
				let projectName = rowData.projectName;
				let auditStartDate = rowData.auditTimeBegin;
				let auditEndDate = rowData.auditTimeEnd;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00142',
						param1: projectId,
						param2: customerId,
						param3: window.sys_userId,
						limit: -1,
						start: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data.length == 0){
								event.preventDefault();
								if(customerId == window.CUR_CUSTOMERID && projectId == window.CUR_PROJECTID) {
									$('body').trigger('transferMenu', [{
										menuId: menuId
									}, function() {
										window.transferedMenu = true;
									}]);
								}else{
									let param = {
										param1 : customerId,
										param2 : customerName.replace(customerId+'-', ''),
										param3 : projectId,
										param4 : projectName,
										param5 : auditStartDate,
										param6 : auditEndDate,
										lockProjectId: '0'
									};
									if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
										bdoErrorBox('切换项目失败[0005]', '客户编号和项目编号不能为空。');
									}
									saveProject(param, menuId);
								}
							}else{
								bdoErrorBox('切换项目失败', '您没有该项目权限');
							}
						} else {
							bdoErrorBox('切换项目失败', data.resultInfo.statusText);
						}
					}
				});
			});
			$homePostilTableSearch.on('click', function() {
				postilTableInit();
			});
			$homePostilTableReset.on('click', function() {
				$('#home_postil_projectName').val('');
				postilTableInit();
			});
		}
		/**
		 * 最新动态显示获取最近获得培训证书的人
		 * 
		 */
		function certificateInit() {
			$.ajax({
				url: 'ot/OteGeneral.query.json',
				type: 'post',
				data: {
					sqlId: 'OT00008',
					menuId: window.sys_menuId,
					start: 0,
					limit: 100
				},
				dataType: 'json',
				success: function(data) {
					if (data && data.success && data.data ) {
						if(data.data.length > 0){
							var message = '<marquee direction="up" height="295px" onmouseover="this.stop()" onmouseout="this.start()">';
							for(var i = 0;i < data.data.length;i++){
								message = message + '<p>' + data.data[i].message + '</p>';
							}
							message = message + '</marquee>';
							$('#top_certificate').html(message);
						}
					}
				}
			});
		}
		/**
		 * 验证菜单权限
		 * 
		 */
		function checkMenu(menuId) {
			for(var i = 0;i < window.canUseMenuList.length;i++){
				if (window.canUseMenuList[i] == menuId) {
					return true;
				}
			}
			return false;
		}
		function init() {
			/*chart1Init();
			chart2Init();
			chart3Init();
			chart4Init();*/
			// 客户
			/*getUserCustomers('home_detail_customerId');
			$('#home_detail_customerId').val('').trigger("change");*/
			countInfoInit();
			finTableInit();
			projectTableInit();
			postilTableInit();
			chart4Init();
			certificateInit();
			eventBind();
		}
		return {
			init
		};
	}
	$(function() {
		new HomePage().init();
	});
});