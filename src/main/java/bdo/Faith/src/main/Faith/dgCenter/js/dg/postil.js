/**
 * 底稿批注
 */
var PostilPage = (agrs) => {
	let _template
		, _data
		, postilPage
		, postilType
		, foreignId
		, vmPostil
		, customerId
		, projectId
		, listener;

	_data = _data ? _data : agrs.data;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	
	listener = () => {
		let cellTagTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00082',
						param1: customerId,
						param2: projectId,
						param4: designer.workpaperId,
						param5: 'dg',
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '370px',
				select: true,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '标签名',
					name: 'tagName',
					data: 'tagName',
					width: '100px'
				}, {
					targets: 2,
					orderable: true,
					title: '标签位置',
					name: 'tagPosition',
					data: 'tagPosition',
					width: '100px',
					render: function(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + data.substring(data.indexOf(':') + 1) + '</a>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-right',
					title: '标签值',
					name: 'tagValue',
					data: 'tagValue',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 4,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						return renderStr;
					}
				}
				]
			}
		};
		BdoDataTable('cellTagTable', cellTagTable);

		$('#postilTitle a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});

		function setCellLinkTable() {
			var dataSet = [];
			for (let cellLink of designer.ShowSingleLinkCacheMap) {
				let sheetIndex = parseInt(cellLink[0].substring(0, cellLink[0].indexOf(':')));
				let row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1, cellLink[0].lastIndexOf(':')));
				let col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
				let range = new GC.Spread.Sheets.Range(row, col, 1, 1);
				let rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
				let sheetName = designer.Spread.getSheet(sheetIndex).name();
				for (let cellTag of cellLink[1]) {
					let linkText;
					let displayText;
					if (cellTag.isFile) {
						displayText = cellTag.fileName;
						if (cellTag.isPaper) {
							linkText = cellTag.paperLink.substring(cellTag.paperLink.indexOf(':') + 1);
						} else {
							linkText = cellTag.attachmentLink.substring(cellTag.attachmentLink.indexOf(':') + 1);
						}
					} else {
						displayText = cellTag.displayText;
						linkText = cellTag.sheetName + cellTag.link.substring(cellTag.link.indexOf(':'));
					}
					dataSet.push(['', sheetName + ':' + rangeStr, linkText, displayText]);
				}
			}
			$('#cellLinkTable').dataTable({
				'data': dataSet,
				'pageLength': 30,
				'ordering': false,
				'scrollX': true,
				'scrollY': '350px',
				'columns': [
					{
						'title': '序号',
						'class': 'text-center',
						'width': '40px',
						'render': function(data, type, row, meta) {
							return meta.settings._iDisplayStart + meta.row + 1;
						}
					},
					{
						'title': '位置', 'width': '180px', 'render': function(data, type, row, meta) {
							let renderStr = '<a href=\"#\">' + data + '</a>';
							return renderStr;
						}
					},
					{'title': '链接', 'width': '180px'},
					{'title': '提示内容', 'width': '180px'}
				]
			});
			$('#cellLinkTable td a').on('click', function() {
				var sheetName = this.text.substring(0, this.text.indexOf(':'));
				var index = designer.Spread.getSheetIndex(sheetName);
				designer.Spread.setActiveSheetIndex(parseInt(index));
				var sheet = designer.Spread.getActiveSheet();
				var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, this.text.substring(this.text.indexOf(':') + 1), 0, 0);
				sheet.setActiveCell(range.row, range.col);
				var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
				// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
				sheet.showRow(range.row, verticalPosition);
				// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
			});
			$('#cellLinkTable_wrapper .tableRefresh').click((event) => {
				setCellLinkTable();
			});
		}

		$('#postilTitle a').on('show.bs.tab', function(evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			switch (id) {
				case 'cellLinkTab':
					setCellLinkTable();
					break;
				case 'cellTagTab':
					$('#cellTagTable').DataTable().ajax.reload();
					$('#cellTagTable tbody').on('click', 'td button', function() {
						var cellAlias = this.lastElementChild.value;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgCheck.deleteTag.json',
							// async : false,
							data: {
								menuId: window.sys_menuId,
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: customerId,
								param2: projectId,
								param3: cellAlias,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									$('#cellTagTable').DataTable().ajax.reload();
									bdoSuccessBox('成功', '删除标签成功！');
								}
							}
						});
					});
					$('#cellTagTable tbody').on('click', 'td a', function() {
						var sheetName = this.text.substring(0, this.text.indexOf(':'));
						var index = designer.Spread.getSheetIndex(sheetName);
						designer.Spread.setActiveSheetIndex(parseInt(index));
						var sheet = designer.Spread.getActiveSheet();
						var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, this.text.substring(this.text.indexOf(':') + 1), 0, 0);
						sheet.setActiveCell(range.row, range.col);
						var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
						// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
						sheet.showRow(range.row, verticalPosition);
						// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
					});
					break;
				default:
					break;
			}
		});

		/*$('#postilTab [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/

		$('#postilTab [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			vmPostil.newPostilBtnShow = false;
			vmPostil.onPostilClose();
			switch (id) {
				case 'postilTab1':
					if (((vmPostil.userAuditState & (0x1 << 4)) >> 4) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 400;
					break;
				case 'postilTab2':
					if (((vmPostil.userAuditState & (0x1 << 1)) >> 1) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 100;
					break;
				case 'postilTab3':
					if (((vmPostil.userAuditState & (0x1 << 2)) >> 2) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 200;
					break;
				case 'postilTab4':
					if (((vmPostil.userAuditState & (0x1 << 5)) >> 5) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 500;
					break;
				case 'postilTab5':
					if (((vmPostil.userAuditState & (0x1 << 6)) >> 6) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 600;
					break;
				case 'postilTab6':
					if (((vmPostil.userAuditState & (0x1 << 3)) >> 3) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 300;
					break;
				case 'postilTab7':
					if (((vmPostil.userAuditState & (0x1 << 7)) >> 7) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 700;
					break;
				default:
					break;
			}
		});

	};
	//
	vmPostil = new Vue({
		el: '#vmpostilPage',
		data: {
			postils1: [],
			postils2: [],
			postils3: [],
			postils4: [],
			postils5: [],
			postils6: [],
			postils7: [],
			postils: [],
			newContent: false,
			postilContent: '',
			cellContent: '',
			type: '',
			auditState: 0,
			threadParam: {},
			customerId: agrs.customerId,
			projectId: agrs.projectId,
			isSingle: false,
			userAuditState: 0,
			newPostilBtnShow: false,
			postilLevel: 2
		},
		watch: {
			newContent(newVal, oldVal) {
				if (newVal == true) {
					$('.postil-content').css({bottom: '190px'});
				} else {
					$('.postil-content').css({bottom: '0px'});
				}
				/*C001--回复批注
				C002--回复评论
				005--关闭批注
				006--打开批注
				007--删除批注*/
				if (this.type == postilType) {
					$('#postilFormBlock').find('table').find('td:eq(2)').show();
					$('#postilFormBlock').find('table').find('td:eq(3)').show();
				}else{
					$('#postilFormBlock').find('table').find('td:eq(2)').hide();
					$('#postilFormBlock').find('table').find('td:eq(3)').hide();
				}
			},
			auditState(newVal, oldVal) {
				let me = this;
				let postils = this.getPostils();

				this.fetch({
					menuId: window.sys_menuId,
					sqlId: 'DG00077',
					param1: customerId,
					param2: projectId,
					param3: (() => {
						if (agrs.isSingle) {
							return agrs.data.autoId;
						}
						return null;
					})(),
					param4: newVal,
					param5: foreignId,
					param6: postilType,
					start: -1,
					limit: -1
				}, data => {
					if (data.success) {
						me.buildData(data.data);
					} else {
					}
				});
			},
			postilContent(newVal, oldVal) {
				if(this.$postilContentEl) {
					let elCode = this.$postilContentEl.summernote('code');
					if(newVal != elCode) {
						this.$postilContentEl.summernote('code', newVal);
					}
				}
			}
		},
		methods: {
			fetchProjectInfo() {
				let me = this;
				let dfd = $.Deferred();
				if(!projectId || !customerId || !(customerId > '') || !(projectId > '')) {
					dfd.resolve({});
					return dfd;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00061',
						param1: projectId,
						param2: customerId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							dfd.resolve(data);
						}
					}
				});
				return dfd;
			},
			getPostils() {
				switch (this.auditState) {
					case 100:
						return this.postils2;
					case 200:
						return this.postils3;
					case 300:
						return this.postils6;
					case 400:
						return this.postils1;
					case 500:
						return this.postils4;
					case 600:
						return this.postils5;
					case 700:
						return this.postils7;
				}
			},
			buildData(data) {
				let result = [];
				let map = {};
				$.each(data, (index, obj) => {
					if (obj.type == postilType) {
						map[obj.autoId] = obj;
						result.push(map[obj.autoId]);
					} else {
						let parentObj = map[obj.annotationId];
						if (parentObj && !parentObj.comments) {
							parentObj.comments = [];
						}
						parentObj && parentObj.comments.push(obj);
					}
				});

				if (agrs.isSingle) {
					this.postils = result;
				} else {
					switch (this.auditState) {
						case 100:
							this.postils2 = result;
							return;
						case 200:
							this.postils3 = result;
							return;
						case 300:
							this.postils6 = result;
							return;
						case 400:
							this.postils1 = result;
							return;
						case 500:
							this.postils4 = result;
							return;
						case 600:
							this.postils5 = result;
							return;
						case 700:
							this.postils7 = result;
							return;
						default:
							break;
					}
				}
			},
			submitPostil(data, callback) {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgPostil.savePostil.json',
					//async : false,
					data: data,
					dataType: 'json',
					success(data) {
						callback && callback(data);
					}
				});
			},
			fetch(data, callback) {
				if (agrs.isSingle) {
					data.param4 = undefined;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					//async : false,
					data: data,
					dataType: 'json',
					success(data) {
						callback && callback(data);
					}
				});
			},
			onSubmitPostil(event) {
				var me = this;
				var postils = this.getPostils();
				let contentText = $('<div>' + this.postilContent + '</div>').text();
				if (this.type == postilType) {
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: me.customerId,
								projectId: me.projectId,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: postilType,
								auditState: me.auditState,
								foreignId: foreignId,
								postilLevel: me.postilLevel
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								me.fetch({
									menuId: window.sys_menuId,
									sqlId: 'DG00077',
									param1: customerId,
									param2: projectId,
									param3: postilData.autoId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType
								}, data => {
									if (data.success) {
										postils.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								postilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				} else if (this.type == 'C001') {
					let item = this.threadParam['postilActionAgrs'][1];
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: customerId,
								projectId: projectId,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: me.type,
								annotationId: item.autoId,
								commentedUser: item.__ucreateUser.userId
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								me.fetch({
									menuId: window.sys_menuId,
									sqlId: 'DG00152',
									param1: customerId,
									param2: projectId,
									param3: postilData.annotationId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType,
									param7: postilData.autoId
								}, data => {
									if (data.success) {
										if (!item.comments) {
											item.comments = [];
										}
										item.comments.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								postilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				} else if (this.type == 'C002') {
					let item = this.threadParam['postilActionAgrs'][1];
					let itemComment = this.threadParam['postilActionAgrs'][2];
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: customerId,
								projectId: projectId,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: me.type,
								annotationId: itemComment.annotationId,
								commentedUser: itemComment.__ucreateUser.userId,
								commentId: itemComment.autoId
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								me.fetch({
									menuId: window.sys_menuId,
									sqlId: 'DG00152',
									param1: customerId,
									param2: projectId,
									param3: postilData.annotationId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType,
									param7: postilData.autoId
								}, data => {
									if (data.success) {
										item.comments.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								postilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				}
			},
			onNewPostilBtnClick(event) {
				this.newContent = true;
				this.postilContent = '';
				this.cellContent = '';
				this.type = postilType;
				this.postilLevel = 2;
			},
			getCellRange(event) {
				var sheetName = designer.Spread.getActiveSheet().name();
				var row = designer.Spread.getActiveSheet().getActiveRowIndex();
				if (isNaN(row)) {
					bdoErrorBox('失败', '未选择单元格！');
					return;
				}
				var col = designer.Spread.getActiveSheet().getActiveColumnIndex();
				var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
				var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
				this.cellContent = sheetName + ':' + rangeStr;
				$('#cellContent').attr('title', this.cellContent);
			},
			setActiveCell(event) {
				var text = $(event.currentTarget).text();
				var sheetName = text.substring(0, text.indexOf(':'));
				var sheetIndex = designer.Spread.getSheetIndex(sheetName);
				designer.Spread.setActiveSheetIndex(sheetIndex);
				var sheet = designer.Spread.getActiveSheet();
				var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, text.substring(text.indexOf(':') + 1), 0, 0);
				sheet.setActiveCell(range.row, range.col);
				var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
				// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
				sheet.showRow(range.row, verticalPosition);
				// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
				var contentName = $(event.currentTarget).parent().parent().prev().children(':first').text();
				var contentText = $(event.currentTarget).parent().parent().next().text();
				sheet.comments.add(range.row, range.col, contentName + ':' + contentText);
				let comment = sheet.comments.get(range.row, range.col);
				comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
			},
			onPostilClose(event) {
				this.newContent = false;
				this.type = '';
				this.postilContent = '';
				this.cellContent = '';
				this.postilLevel = 2;
			},
			closePostil() {
				var item = this.threadParam['postilActionAgrs'][1];
				var doIt = () => {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgPostil.closePostil.json',
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: item.customerId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								item.activeFlag = 0;
								bdoSuccessBox('成功', data.resultInfo.statusText);

								var sheetIndex = designer.Spread.getSheetIndex(0, item.cellContent.indexOf(':'));
								designer.Spread.setActiveSheetIndex(sheetIndex);
								var rangeStr = item.cellContent.substring(item.cellContent.indexOf(':') + 1);
								var sheet = designer.Spread.getActiveSheet();
								var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
								sheet.comments.remove(range.row, range.col);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				};
				bdoConfirmBox('提示', '确定要关闭这条批注吗？', (isConfirm) => {
					doIt();
				});
			},
			openPostil() {
				var item = this.threadParam['postilActionAgrs'][1];
				var doIt = () => {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgPostil.openPostil.json',
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: item.customerId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								item.activeFlag = 1;
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				};
				bdoConfirmBox('提示', '确定要重新开启这条批注吗？', (isConfirm) => {
					doIt();
				});
			},
			deletePostil() {
				let item = this.threadParam['postilActionAgrs'][1];
				let _this = this;
				let itemIndex = _this.postils.indexOf(item);
				bdoConfirmBox('提示', '确定要删除这条批注吗？', (isConfirm) => {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgPostil.deletePostil.json',
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: customerId,
							param3: projectId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								_this.postils.splice(itemIndex, 1);
								let index = _this.threadParam['postilActionAgrs'].indexOf(item);
								_this.threadParam['postilActionAgrs'].splice(itemIndex, 1);
								$('#' + item.autoId).remove();
								bdoSuccessBox('成功', data.resultInfo.statusText);

								var sheetIndex = designer.Spread.getSheetIndex(0, item.cellContent.indexOf(':'));
								designer.Spread.setActiveSheetIndex(sheetIndex);
								var rangeStr = item.cellContent.substring(item.cellContent.indexOf(':') + 1);
								var sheet = designer.Spread.getActiveSheet();
								var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
								sheet.comments.remove(range.row, range.col);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			},
			postilAction(event, agrs) {
				let type = agrs[0];
				this.threadParam['postilActionAgrs'] = agrs;
				switch (type) {
					case 'C001':
						this.type = type;
						this.newContent = true;
						this.postilContent = '';
						this.cellContent = '';
						break;
					case 'C002':
						this.type = type;
						this.newContent = true;
						this.postilContent = '';
						this.cellContent = '';
						break;
					case '005':
						this.closePostil();
						break;
					case '006':
						this.openPostil();
						break;
					case '007':
						this.deletePostil();
						break;
					default:
						break;
				}
			}
		},
		mounted() {
			let me = this;
			postilPage = side({el: '#postilPage', autoHide: false});
			this.auditState = 400;
			this.fetchProjectInfo().done(function(data) {
				if (data.success) {
					if (data.data && data.data[0]) {
						let projectInfo = data.data[0];
						/*manager 项目负责人
						signAccountant2 签字会计师2
						signAccountant3 签字会计师3
						audit1 一审负责人
						audit2 二审负责人
						reaReviewer 外派复核人
						signUser 签字合伙人
						reviewPartner 复核合伙人
						issuedPeople 签发人*/
						let state = 0;
						if (projectInfo.manager == sys_userId) {
							state += (0x1 << 0);
						}
						if (projectInfo.signAccountant2 == sys_userId || projectInfo.signAccountant3 == sys_userId) {
							state += (0x1 << 4);
						}
						if (projectInfo.audit1 == sys_userId) {
							state += (0x1 << 1);
						}
						if (projectInfo.audit2 == sys_userId) {
							state += (0x1 << 2);
						}
						if (projectInfo.reaReviewer == sys_userId) {
							state += (0x1 << 5);
						}
						if (projectInfo.signUser == sys_userId) {
							state += (0x1 << 6);
						}
						if (projectInfo.reviewPartner == sys_userId) {
							state += (0x1 << 3);
						}
						if (projectInfo.issuedPeople == sys_userId) {
							state += (0x1 << 7);
						}
						me.userAuditState = state;
					}
				}
				if (((me.userAuditState & (0x1 << 4)) >> 4) == 1) {
					me.newPostilBtnShow = true;
				}
			});
			listener();
			OneUI.initHelper('slimscroll');
			postilPage.show();
			initPostilContentsEditor(this, agrs);
		},
		beforeCreate() {
			if (agrs.isSingle) {
				_template = agrs.template || tplLoader('dgCenter/html/dg/pageSinglePostil.html');
			} else {
				_template = agrs.template || tplLoader('dgCenter/html/dg/postil.html');
			}
			agrs.template = _template;
			postilType = agrs.type;
			foreignId = agrs.foreignId;

			$(agrs.region).empty().append(_template);
		}
	});
};