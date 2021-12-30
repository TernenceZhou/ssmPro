/**
 * 抵消分录对象
 * @param args node 信息
 * @author likai
 * @date 2020-01-19 16-07
 */
function Counteract(args) {
	var _template
		, _data
		, mount
		, cnt
		, listener
		, dgAttachTable;
	_template = args.template || tplLoader('dgCenter/html/dg/offsetAdjustment.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	pageRightTitle(pageTitleArr);
	let filterTreeForm = [];
	let filterForm = {companyFirst: '', companySecond: '', journalizingWay: '', journalizingType: ''};
	let tableForm = [];
	// ComboDicOption(false,'错报类型');
	let cashSelectData = [
		{label: '--请选择--', value: ''},
	];
	let tbSelectData = [
		{label: '--请选择--', value: ''},
	];
	let projectSelectData = [
		{label: '--请选择--', value: ''},
	];
	let yearData = [
		{label: '--请选择--', value: ''},
		{label: window.CUR_PROJECT_ACC_YEAR, value: window.CUR_PROJECT_ACC_YEAR},
		{label: window.CUR_PROJECT_ACC_YEAR - 1, value: window.CUR_PROJECT_ACC_YEAR - 1},
	];
	let elOptionLoader = function (el, data, valueMap) {
		let elements = document.querySelectorAll(el);
		if (!elements) return;

		let hasOptSelected = false;
		for (let i = 0; i < elements.length; i++) {
			elements[i].innerHTML = !(data instanceof Array) ? null
				: data.map(item => {
					hasOptSelected = valueMap && (elements[i].name + i in valueMap);

					if (item.value instanceof Array) {
						return `<optgroup label="${item.label}">`
							+ item.value.map(opt => `
										<option ${hasOptSelected && (valueMap[elements[i].name + i] == opt.value) ? 'selected' : ''} value="${opt.value}">${opt.label}</option>
									`).join('')
							+ `</optgroup>`;

					} else {
						return `<option ${hasOptSelected && (valueMap[elements[i].name + i] == item.value) ? 'selected' : ''} value="${item.value}">${item.label}</option>`;
					}
				}).join('');
		}
	};

	function renderTreeNode(nodeData) {
		return `<li>`
			+ `<input type="checkbox" name="${nodeData.value}" onchange="onTreeNodeChange(this.checked, '${nodeData.value}')"/>&nbsp;`
			+ `<span>${nodeData.label}</span>`
			+ (
				(nodeData.children instanceof Array)
					? (`<ul>` + nodeData.children.map(item => renderTreeNode(item)).join('') + `</ul>`)
					: ''
			)
			+ `</li>`;
	}

	let elTreeLoader = function (el, data) {
		let element = document.querySelector(el);
		if (!element) return;

		element.innerHTML = !(data instanceof Array) ? null
			: data.map(item => renderTreeNode(item)).join('');
	};


	// filter block
	// ==========================================================================
	// start


	function queryCompanyFirstOptions(elOptionLoader) {
		elOptionLoader('#company_first', projectSelectData);
	}

	function queryCompanySecondOptions(elOptionLoader) {
		elOptionLoader('#company_second', projectSelectData);
	}

	/**
	 * 调整类别
	 * @param elOptionLoader
	 */
	function queryJournalizingWayOptions(elOptionLoader) {
		elOptionLoader('#journalizing_way', [
			{label: '--请选择--', value: ''},
			// {label: '调整', value: '1'},
			{label: '抵消', value: '2'},
			{label: '现金流量表抵消', value: '3'},
			// {label: '分录方式四', value: '4'}
		]);
	}

	/**
	 * 调整模板
	 *@param elOptionLoader
	 */
	function queryJournalizingTypeOptions(elOptionLoader) {
		elOptionLoader('#journalizing_type', [
			{label: '--请选择--', value: ''},
			{label: '以现金投资或收购股权增加的投资所产生的现金流量的抵销处理', value: '1'},
			{label: '取得投资收益收到的现金与分配股利、利润或偿付利息支付的现金的抵销处理', value: '2'},
			{label: '销售商品所产生的现金流量的抵销处理', value: '3'},
			{label: '固定资产等收回的现金净额与购建固定资产支付的抵销处理', value: '4'},
			{label: '内部往来账户交易所产生的现金流量的抵销处理', value: '4'}
		]);
	}

	/**
	 * 模板科目
	 * @param elTreeLoader
	 */
	function queryJournalizingTypeTree(elTreeLoader) {
		elTreeLoader('#sel_tree', [
			{
				label: '第1组模板',
				value: '001',
				children: [
					{
						label: '借',
						value: '001001',
						children: [
							{label: '购买商品、接受劳务支付的现金', value: '001001001'},
							{label: '支付其他与经济活动有关的现金', value: '001001002'},
							{label: '购建固定资产、无形资产和其他长期资产支付的现金', value: '001001003'}
						]
					}, {
						label: '贷',
						value: '001002',
						children: [
							{label: '处置固定资产、无形资产和其他长期资产收回的现金净额', value: '001002001'}
						]
					}
				],

			}, {
				label: '第2组模板',
				value: '002',
				children: [
					{
						label: '借',
						value: '002001',
						children: [
							{label: '购建固定资产、无形资产和其他长期资产支付的现金', value: '002001001'}
						]
					}, {
						label: '贷',
						value: '002002',
						children: [
							{label: '处置固定资产、无形资产和其他长期资产收回的现金净额', value: '002002001'},
							{label: '销售商品、提供劳务收到的现金', value: '002002002'}
						]
					}
				]
			}
		]);
	}

	function closeModal() {
		let el = document.getElementById('template_modal');
		if (el) el.style.display = 'none';
	}

	function openModal() {
		let el = document.getElementById('template_modal');
		if (el) el.style.display = 'block';
	}


	function updateFilterData(prop, value, modalTrigger) {
		if (!prop) return;
		filterForm[prop] = value;

		if (modalTrigger) {
			filterTreeForm = [];
			openModal();
			queryJournalizingTypeTree(elTreeLoader);
		}
	}

	function onTreeNodeChange(value, key) {
		let filter = key ? `[name^="${key}"]` : '';
		let elements = document.querySelectorAll(`#sel_tree input${filter}`);
		if (!elements) return;
		for (let i = 0; i < elements.length; i++) {
			elements[i].checked = value;
		}
	}

	function selectAllTreeNode() {
		onTreeNodeChange(true);
	}

	function clearAllTreeNode() {
		onTreeNodeChange(false);
	}

	function cancelTree() {
		closeModal();
	}

	function submitTree() {
		let elements = document.querySelectorAll('#sel_tree input');
		filterTreeForm = [];
		if (elements) {
			for (let i = 0; i < elements.length; i++) {
				if (elements[i].checked) filterTreeForm.push(elements[i].name);
			}
		}
		closeModal();
	}

	// filter block
	// ==========================================================================
	// end


	// table block
	// ==========================================================================
	// start


	function queryCompanyNameOptions(elOptionLoader, valueMap) {
		elOptionLoader('select[name="company"]', projectSelectData, valueMap);
	}

	function queryAccountItemOptions(elOptionLoader, valueMap) {
		elOptionLoader('select[name="accountItem"]', tbSelectData, valueMap);
	}

	function updateRowData(rowIndex, prop, value) {
		if (rowIndex >= tableForm.length) return;
		let row = tableForm[rowIndex];
		if (!row) return;
		row.active = true;
		row[prop] = value;
	}

	function refreshTable() {
		let element = document.querySelector('#table_body');
		if (!element) return;

		let valueMap = {};
		element.innerHTML = tableForm.map((rowData, index) => {
			if (rowData.company) valueMap[`company${index}`] = rowData.company;
			if (rowData.accountItem) valueMap[`accountItem${index}`] = rowData.accountItem;

			return `<tr>
						<td>
							<div class="action-btn">+</div>
							<div class="action-btn">-</div>
						</td>
						<td>
							<input name="digest" placeholder="请输入摘要信息" value="${rowData.digest}"
								 style="width:100%;"/>
						</td>
						<td>
							<select name="company"  style="width:100%;"/>
						</td>
						<td>
							<select name="accountItem" style="width:100%;"/>
						</td>
						<td>
							<input type="number" placeholder="请输入金额" value="${rowData.debtorAmount}" style="width:100%;"
								 name="debtorAmount"/>
						</td>
						<td>
							<input type="number" placeholder="请输入金额" value="${rowData.creditorAmount}" style="width:100%;"
								 name="creditorAmount"/>
						</td>
					</tr>`;
		}).join('');
		queryCompanyNameOptions(elOptionLoader, valueMap);
		queryAccountItemOptions(elOptionLoader, valueMap);
	}

	function getBlankTableRowData(flag) {
		return {
			id: (new Date().getTime() + flag || 1).toString(),
			active: false,
			digest: '',
			company: '',
			accountItem: '',
			debtorAmount: '',
			creditorAmount: ''
		};
	}

	function addTableRow(data, afterItemIndex) {
		let tmp = null;
		if (data instanceof Array) {
			tmp = data;

		} else if (typeof (data) === 'number' && data > 0) {
			tmp = [];
			for (let i = 0; i < data; i++) {
				tmp.push(getBlankTableRowData(i));
			}

		} else {
			tmp = [data || getBlankTableRowData(2)];
		}

		tableForm.splice(afterItemIndex >= 0 ? (afterItemIndex + 1) : -1, 0, ...tmp);
		refreshTable();
	}

	function removeTableRow(index) {
		if (index >= tableForm.length) return;
		tableForm.splice(index, 1);
		refreshTable();
	}

	function initYear(elOptionLoader) {
		elOptionLoader('#adjust_year', yearData);
	}

	// table block
	// ==========================================================================
	// end


	/**
	 * global init
	 * ==========================================================================
	 *
	 */

	function init() {

		queryCompanyFirstOptions(elOptionLoader);
		queryCompanySecondOptions(elOptionLoader);
		queryJournalizingWayOptions(elOptionLoader);
		queryJournalizingTypeOptions(elOptionLoader);
		initYear(elOptionLoader);
		addTableRow(4);
	}

	function submit() {
		let remarkItem = document.querySelector('#remark');

		let formData = Object.assign({},
			filterForm,
			{journalizingTypeTree: filterTreeForm || []},
			{remark: remarkItem ? remarkItem.value : ''},
			{list: tableForm.filter(item => item.active)}
		);

		// console.log('formData:', formData)
	}

	function initData() {
		$.ajax({
			url: 'dgCenter/HbElimination.findSelect.json',
			type: 'post',
			async: false,
			data: {
				sqlId: '',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1,
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					cashSelectData = [
						{label: '--请选择--', value: ''},
					];
					let cash = data.data[0];
					for (let cashKey in cash) {
						let object = {label: cashKey, value: cash[cashKey]};
						cashSelectData.splice(cashSelectData.length, 0, object)
					}
					tbSelectData = [
						{label: '--请选择--', value: ''},
					];
					let tb = data.data[1];
					for (let cashKey in tb) {
						let object = {label: cashKey, value: tb[cashKey]};
						tbSelectData.splice(tbSelectData.length, 0, object)
					}
					projectSelectData = [
						{label: '--请选择--', value: ''},
					];
					let project = data.data[2];
					for (let cashKey in project) {
						let object = {label: cashKey, value: project[cashKey]};
						projectSelectData.splice(projectSelectData.length, 0, object)
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	}

	function clean() {
		$('#journalizing_way').val('');
		$('journalizing_type').val('');
		$('#company_first').val('');
		// $('#company_first option:selected').text();
		$('#company_second').val('');
		// $('#company_second option:selected').text();
		$('#remark').val('');
		$('#adjust_year').val('');
		tableForm = [];
	}

	/**
	 * 计算借贷差值
	 */
	function balanceCalibration() {
		let debs = $('#table_body input[name="debtorAmount"]');
		let cres = $('#table_body input[name="creditorAmount"]');
		let count_deb = 0;
		let count_cre = 0;
		debs.each(function () {

			let number = parseFloat($(this).val().replace(/,/g, ''));
			if (isNaN(number)){
				count_deb += 0;
			}else {
				count_deb += number;
			}
		});
		cres.each(function () {
			let number = parseFloat($(this).val().replace(/,/g, ''));
			if (isNaN(number)) {
				count_cre += 0;
			} else {
				count_cre += number;
			}
		});

		$('#deb_span').text(formatMoney2(count_deb));
		$('#cre_span').text(formatMoney2(count_cre));
		$('#diff_span').text(formatMoney2(count_deb - count_cre));
	}


	listener = () => {
		init();
		/**
		 * 新增行
		 */
		$('#table_body').on('click', 'tr > td > div:nth-child(1)', function () {
			// .closest('tr')
			//获取当前第几行
			let rowIndex = $(this).closest('tr')[0].rowIndex;
			rowIndex = rowIndex - 1;
			addTableRow(null, rowIndex)

		});
		/**
		 * 删除
		 */
		$('#table_body').on('click', 'tr > td > div:nth-child(2)', function () {
			let length = tableForm.length;
			//最少有两行
			if (length <= 2) {
				return;
			}
			let rowIndex = $(this).closest('tr')[0].rowIndex;
			rowIndex = rowIndex - 1;
			removeTableRow(rowIndex);
			$(this).parent().parent().remove();
		});
		$('#journalizing_type').change(function () {
			updateFilterData("journalizingType", this.value, true)

		});
		$('#table_body').on('change', 'tr > td > select', function () {
			let rowIndex = $(this).closest('tr')[0].rowIndex;
			rowIndex = rowIndex - 1;
			updateRowData(rowIndex, this.name + 'Name', $(this).find('option:selected').text());
			updateRowData(rowIndex, this.name, this.value);
		});
		$('#table_body').on('change', 'tr > td > input', function () {
			let rowIndex = $(this).closest('tr')[0].rowIndex;

			if ('debtorAmount' == this.name) {

			}
			rowIndex = rowIndex - 1;
			updateRowData(rowIndex, this.name, this.value);
		});
		$('#journalizing_way').change(function () {
			switch (this.value) {
				//调整
				case "1":
					elOptionLoader('select[name="accountItem"]', tbSelectData, '');
					break;
				//tb抵消
				case "2":
					elOptionLoader('select[name="accountItem"]', tbSelectData, '');
					break;
				//现金流量抵消
				case "3":
					elOptionLoader('select[name="accountItem"]', cashSelectData, '');
					break;
				default:
					break;

			}
		});
		/**
		 * 借贷方向事件
		 */
		$('#table_body').on('change', 'input[name=creditorAmount]', function () {
			// console.log($(this));
			let deb = $(this).closest('tr').find('input[name=debtorAmount]');
			let curValue = $(this).val();
			if (!curValue && curValue == '') {
				deb.prop('disabled', false);
				deb.prop('placeholder', '请输入金额');
				deb.removeClass('display');
				$(this).prop('type', 'number');
			} else {
				deb.prop('placeholder', '');
				deb.addClass('display');
				deb.prop('disabled', true);
				$(this).prop('type', 'text');
				$(this).text(formatMoney2(curValue));
				$(this).val(formatMoney2(curValue));
			}
			balanceCalibration();
		});

		$('#table_body').on('change', 'input[name=debtorAmount]', function () {
			// console.log($(this));
			let cred = $(this).closest('tr').find('input[name=creditorAmount]');
			let curValue = $(this).val();
			if (!curValue && curValue == '') {
				cred.prop('disabled', false);
				cred.prop('placeholder', '请输入金额');
				cred.removeClass('display');
				$(this).prop('type', 'number');
			} else {
				cred.addClass('display');
				cred.prop('placeholder', '');
				cred.prop('disabled', true);
				$(this).prop('type', 'text');
				// $(this).css();
				$(this).text(formatMoney2(curValue));
				$(this).val(formatMoney2(curValue));
			}
			balanceCalibration();
		});
		/**
		 * 关闭调整
		 */
		$('#close_adjust').click(function () {
			clean();
			init();
			$('#sideRegin').hide();
		});
		$('#adjust_close').click(function () {
			$('#close_adjust').click();
		});
		/**
		 * 关闭模板选择框
		 */
		$('#template_modal > div > div > section.header > span:nth-child(2)').click(() => {
			closeModal()
		});

		/**
		 * 模板选择 取消按钮
		 */
		$('#cancel_btn').click(() => {
			cancelTree()
		});
		/**
		 * 模板选择  确定按钮
		 */
		$('#tree_submit').click(() => {
			submitTree()
		});
		/**
		 * 清空按钮
		 */
		$('#clean_all_btn').click(() => {
			clearAllTreeNode()
		});
		/**
		 * 全选按钮
		 */
		$('#select_all_btn').click(() => {
			selectAllTreeNode()
		});
		$('#save_adjust').click(function () {
			let param = {};
			let notEmptyArr = [];
			for (let item of tableForm) {
				if (item.active && item.accountItem && item.accountItem !== '') {
					notEmptyArr.splice(0, 0, item);
				}
			}
			param.arr = notEmptyArr;
			param.adjustType = $('#journalizing_way').val();
			param.templateType = $('journalizing_type').val();
			param.projectId = $('#company_first').val();
			param.projectName = $('#company_first option:selected').text();
			param.projectId1 = $('#company_second').val();
			param.projectName1 = $('#company_second option:selected').text();
			param.description = $('#remark').val();
			param.yyyy = $('#offset_dgYear2').text();
			// console.log(param);

			$.ajax({
				url: 'dgCenter/HbElimination.addAdjust.json',
				type: 'post',
				async: false,
				data: {
					sqlId: '',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: JSON.stringify(param),
					start: -1,
					limit: -1,
				},
				dataType: 'json',
				success: function (data) {
					$('#close_adjust').click();
					$('#tb_type > li.active').click();
					tableForm = [];
					clean();
					init();
				}
			});

		});
	};

	mount = () => {
		$('#offset_dgName2').text(window.CUR_CUSTOMERNAME);
		initData();
		listener();
	};
	mount();
}