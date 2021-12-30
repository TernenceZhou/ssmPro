/**
 * 项目合并范围一览
 */
var DgMergeProjectPage = (agrs) => {
	let _template
		, _data
		, mount
		, listener;

	_template = tplLoader('dgCenter/html/dg/mergeProject.html');
	_data = agrs.data;
	$(agrs.region).empty(); // 先清空
	let mode = _data.mode; // 对话框(parent/child)

	// 父项目表格配置
	function getDgParentProjectTableConfig(){
		let cnt = 1;
		let tableConfig = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00261',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					limit: -1,
					start: -1
				}
			},
			tableParam: {
				scrollX: true,
				scrollCollapse: true,
				pageLength: 1000,
				select: true,
				lengthChange: false,
				serverSide: true,
				ordering: false,
				dom: '<"row"<"col-sm-12"tr>>',
				paging: false,
				fixedThead: true,
				fixedHeight: '480px',
				columnDefs: [{
					targets: cnt++,
					title: '序号',
					class: 'text-center',
					width: '20px',
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				}, {
					targets: cnt++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '30px',
					render: function(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="delMergeProject" data-placement="top" title="删除" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-times-circle-o"></i>'
							+ '</button>';
						return renderStr;
					}
				}, {
					targets: cnt++,
					orderable: true,
					title: '客户名',
					name: 'customerName',
					data: 'customerName',
					width: '150px'
				}, {
					targets: cnt++,
					orderable: true,
					title: '项目名',
					name: 'projectName',
					data: 'projectName',
					width: '200px'
				}]
			}
		};
		return tableConfig;
	}

	// 子项目表格配置
	function getDgChildProjectTableConfig(){
		let cnt = 1;
		let tableConfig = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00260',
					param1: _data.customerId,
					param2: _data.projectId,
					limit: -1,
					start: -1
				}
			},
			tableParam: {
				scrollX: true,
				scrollCollapse: true,
				pageLength: 1000,
				select: true,
				lengthChange: false,
				serverSide: true,
				ordering: false,
				dom: '<"row"<"col-sm-12"tr>>',
				paging: false,
				fixedThead: true,
				fixedHeight: '480px',
				columnDefs: [{
					targets: cnt++,
					title: '序号',
					class: 'text-center',
					width: '20px',
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				}, {
					targets: cnt++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '30px',
					render: function(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="delMergeProject" data-placement="top" title="删除" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-times-circle-o"></i>'
							+ '</button>';
						return renderStr;
					}
				}, {
					targets: cnt++,
					orderable: true,
					title: '客户名',
					name: 'mergeCustomerName',
					data: 'mergeCustomerName',
					width: '150px'
				}, {
					targets: cnt++,
					orderable: true,
					title: '项目名',
					name: 'mergeProjectName',
					data: 'mergeProjectName',
					width: '200px'
				}, {
					targets: cnt++,
					orderable: true,
					title: '业务类型',
					name: 'mergeFinanceReportType',
					data: 'mergeFinanceReportType',
					width: '80px',
					render: function(data, type, row, meta) {
						return data == '1' ? '合并' : '单体';
					}

				}, {
					targets: cnt++,
					orderable: true,
					title: '是否母项目的单体项目',
					name: 'isUnitChildProject',
					data: 'isUnitChildProject',
					width: '150px',
					render: function(data, type, row, meta) {
						return data == '1' ? '是' : '否';
					}
				}]
			}
		};
		return tableConfig;
	}

	/**
	 * 事件绑定写在这里
	 */
	listener = () => {

		// 刷新父项目表格
		$('#btnRefreshParentProjectTable').click(() => {
			$('#parentProjectTable').DataTable().ajax.reload();
		});

		// 刷新子项目表格
		$('#btnRefreshMergeProjectTable').click(() => {
			$('#mergeProjectTable').DataTable().ajax.reload();
		});

		// 添加子项目对话框 仅用于合并（无底稿）
		$('#btnAddNewProject').click(() => {
			$('#mergeCustomer').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
			$('#mergeProjectName').val('');
			$('#createProjectModal').modal('show');
		});

		// 添加子项目对话框 项目管理系统
		$('#btn_user_subject').click(() => {
			$('#selNewProject').val('');
			$('#selectNewProjectModal').modal('show');
		});
		$('#selNewProject').change(function(){
			var selNewProject= $('#selNewProject').val();
			if(selNewProject.length==10){//精确查询
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00282',
						param1: window.CUR_PROJECT_ACC_YEAR, // 选择同年项目用
						param2: selNewProject//项目编号
					},
					dataType: 'json',
					success: function(rs) {
						if (rs.success && rs.data[0]!=null) {

							$('#selNewProject').val( rs.data[0].projectName);
							$('#selNewProject').attr('selected-data', rs.data[0].customerId + ',' + rs.data[0].projectId+','+rs.data[0].year);
							/*let projectList = [];
							for (let i = 0, data, value; i < rs.data.length; i++) {
								data = rs.data[i].customerId + ',' + rs.data[i].projectId+','+rs.data[i].year;
								value = rs.data[i].projectName;
								projectList.push({data, value});
							}

							$('.js-merge-newProjects').devbridgeAutocomplete({
								noCache: true,
								minChars: 0,
								autoSelectFirst: true,
								orientation: 'auto',
								maxHeight: 270,
								lookup: projectList, 		// 项目数据
								onSelect: function(suggestion) {
									let $this = $(this);
									$this.attr('selected-value', suggestion.value);
									$this.attr('selected-data', suggestion.data);
								}
							});
*/
						}
					}
				});
			}

		});
		$('#btnSelectNewProjectOk').click(() => {

			let selectedProject = $('#selNewProject').val();
			if (!selectedProject) {
				bdoInfoBox('提示', "请选择子项目");
				return;
			}

			let selectedData = $('#selNewProject').attr('selected-data');
			let ary = selectedData.split(',');
			let mergeCustomerId = ary[0];
			let selectedProjectId = ary[1];
			let year = ary[2];

			$.ajax({
				type: 'post',
				url: 'dgCenter/DgMergeProject.addSelectNewProject.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: mergeCustomerId,
					param2: selectedProjectId,
					param4: year,
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#selectNewProjectModal').modal('hide');
						$('#mergeProjectTable').DataTable().ajax.reload();
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});

		// 确定(添加子项目)
		$('#btnNewProjectOk').click(() => {

			let selectedCustomer = $('#mergeCustomer').val();
			let mergeProjectName = $('#mergeProjectName').val().trim();
			if (!selectedCustomer ) {
				bdoInfoBox('提示', "请选择客户");
				return;
			}
			if (!mergeProjectName) {
				bdoInfoBox('提示', "请填写项目名称");
				return;
			}

			let ary = selectedCustomer.split('-');
			let mergeCustomerId = ary[0];
			let mergeCustomerName = ary[1];

			$.ajax({
				type: 'post',
				url: 'dgCenter/DgMergeProject.addNewProject.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: mergeCustomerId,
					param2: mergeCustomerName,
					param3: mergeProjectName
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#createProjectModal').modal('hide');
						$('#mergeProjectTable').DataTable().ajax.reload();
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});

		// 删除子项目
		$('#mergeProjectTable').on('click', 'button.table-btn-operate[name="delMergeProject"]', event => {
			let table = $('#mergeProjectTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '确认删除子项目【' + rowData.mergeProjectName + '】?', function() {
				$.ajax({
					url: 'dgCenter/DgMergeProject.deleteMergeProject.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.autoId,
						param2: window.CUR_CUSTOMERID,
						param3: rowData.mergeCustomerId,
						param4: rowData.mergeProjectId,
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功');
							$('#mergeProjectTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		// 添加父项目对话框
		$('#btnAddParentProject').click(() => {
			$('#selParentProject').val('');
			$('#selectParentProjectModal').modal('show');
		});

		$('#selParentProject').change(function(){
			var selParentProject= $('#selParentProject').val();
			if(selParentProject.length==10){//精确查询
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00262',
						param1: window.CUR_PROJECT_ACC_YEAR, // 选择同年项目用
						param2: selParentProject//项目编号
					},
					dataType: 'json',
					success: function(rs) {
						if (rs.success && rs.data[0]!=null) {

							$('#selParentProject').val( rs.data[0].projectName);
							$('#selParentProject').attr('selected-data', rs.data[0].customerId + ',' + rs.data[0].projectId+','+rs.data[0].year);
							/*let projectList = [];
							for (let i = 0, data, value; i < rs.data.length; i++) {
								data = rs.data[i].customerId + ',' + rs.data[i].projectId+','+rs.data[i].year;
								value = rs.data[i].projectName;
								projectList.push({data, value});
							}*/

							/*$('.js-merge-projects').devbridgeAutocomplete({
								noCache: true,
								minChars: 0,
								autoSelectFirst: true,
								maxHeight: 270,
								lookup: projectList, 		// 项目数据
								onSelect: function(suggestion) {
									let $this = $(this);
									$this.attr('selected-value', suggestion.value);
									$this.attr('selected-data', suggestion.data);
								}
							});*/

						}
					}
				});
			}

		});
		// 确定(添加父项目)
		$('#btnSelectParentProjectOk').click(() => {

			let selectedProject = $('#selParentProject').val();
			if (!selectedProject) {
				bdoInfoBox('提示', "请选择父项目");
				return;
			}

			let selectedData = $('#selParentProject').attr('selected-data');
			let ary = selectedData.split(',');
			let selectedCustomerId = ary[0];
			let selectedProjectId = ary[1];
			let year = ary[2];

			$.ajax({
				type: 'post',
				url: 'dgCenter/DgMergeProject.addSelectedParentProject.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: selectedCustomerId,
					param2: selectedProjectId,
					param3: $('#chkIsUnitChildProject').prop("checked") ? '1' : '0',   // 是否父项目的单体项目
					param4: year,
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#selectParentProjectModal').modal('hide');
						$('#parentProjectTable').DataTable().ajax.reload();
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});

		// 删除父项目
		$('#parentProjectTable').on('click', 'button.table-btn-operate[name="delMergeProject"]', event => {
			let table = $('#parentProjectTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '确认删除父项目【' + rowData.projectName + '】?', function() {
				$.ajax({
					url: 'dgCenter/DgMergeProject.deleteParentProject.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: rowData.autoId,
						param2: rowData.customerId,
						param3: rowData.projectId,
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功');
							$('#parentProjectTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

	};

	/**
	 * 初始化写在这里
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);

		if (mode === 'parent'){
			// 打开父项目窗口
			$('#modalParentProjectList').modal('show');
			//initSelectableProjects();
			BdoDataTable('parentProjectTable', getDgParentProjectTableConfig());
		}else{
			// 打开子项目窗口
			$('#modalChildProjectList').modal('show');
			//initSelectableCustomers();
			BdoDataTable('mergeProjectTable', getDgChildProjectTableConfig());
		}

		listener();
	};


	function initSelectableProjects(){

		// 自动完成（项目选择）
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00262',
				param1: window.CUR_PROJECT_ACC_YEAR, // 选择同年项目用
			},
			dataType: 'json',
			success: function(rs) {
				if (rs.success) {

					let projectList = [];
					for (let i = 0, data, value; i < rs.data.length; i++) {
						data = rs.data[i].customerId + ',' + rs.data[i].projectId+','+rs.data[i].year;
						value = rs.data[i].projectName;
						projectList.push({data, value});
					}

					$('.js-merge-projects').devbridgeAutocomplete({
						noCache: true,
						minChars: 0,
						autoSelectFirst: true,
						orientation: 'auto',
						maxHeight: 270,
						lookup: projectList, 		// 项目数据
						onSelect: function(suggestion) {
							let $this = $(this);
							$this.attr('selected-value', suggestion.value);
							$this.attr('selected-data', suggestion.data);
						}
					});

				}
			}
		});

	}

	function initSelectableCustomers(){

		// 自动完成（客户选择）
		let customerList = [];
		let customers = JSON.parse(userCustomers);
		for (let i = 0, data, value; i < customers.length; i++) {
			data = value = customers[i].value + '-' + customers[i].label;
			customerList.push({data, value});
		}
		$('.js-merge-customers').devbridgeAutocomplete({
			noCache: true,
			minChars: 0,
			autoSelectFirst: true,
			orientation: 'auto',
			maxHeight: 270,
			lookup: customerList, 		// 客户数据
			onSelect: function(suggestion) {
				let $this = $(this);
				$this.attr('selected-value', suggestion.value);
			}
		});
	}
	// 挂载显示
	mount();

};