/**
 * 现金流量表和所有者权益表批注
 */
var PostilPage = (agrs) => {
	let _template
		, postilPage
		, postilType
		, foreignId
		, vmPostil
		, listener;
	listener = () => {

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
				if (newVal) {
					$('.postil-content').css({bottom: '190px'});
				} else {
					$('.postil-content').css({bottom: '0px'});
				}
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
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
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
				if(!window.CUR_PROJECTID || !window.CUR_CUSTOMERID || !(window.CUR_CUSTOMERID > '') || !(window.CUR_PROJECTID > '')) {
					dfd.resolve({});
					return dfd;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00061',
						param1: window.CUR_PROJECTID,
						param2: window.CUR_CUSTOMERID
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
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
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
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
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
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
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
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
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
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
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
				var text = event.toElement.text;
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
							param2: window.CUR_CUSTOMERID,
							param3: window.CUR_PROJECTID
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
				_template = agrs.template || tplLoader('dgCenter/html/dg/postil2.html');
			}
			agrs.template = _template;
			postilType = agrs.type;
			foreignId = agrs.foreignId;

			$(agrs.region).empty().append(_template);
		}
	});
};