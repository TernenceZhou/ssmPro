webpackJsonp([8],{"3L/v":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n,r=a("bOdI"),s=a.n(r),o=a("fZjL"),c=a.n(o),i=a("mvHQ"),l=a.n(i),u=a("Gu7T"),m=a.n(u),d=a("Dd8w"),h=a.n(d),p=a("+6Bu"),g=a.n(p),f=a("ZHXk"),y=a.n(f),I=a("K/T8"),C=a("0RKR"),x=(n={name:"arrival",computed:{rowSelection:function(){return{onChange:function(t,e){}}}}},s()(n,"name","relatedPartyMatch"),s()(n,"computed",{refresh:function(){return this.$store.state.refreshRelatedPartMatch},visibleuPloadDialog:function(){return this.$store.state.uploadDialog}}),s()(n,"watch",{refresh:{handler:function(t){t&&this.handleQueryContactsCustomer()},immediate:!0}}),s()(n,"data",function(){var t=this;return this.components={header:{cell:function(e,a,n){var r=a.key,s=g()(a,["key"]),o=t.columns.find(function(t){return(t.dataIndex||t.key)===r});if(!o||!o.width)return e("th",h()({},s),[].concat(m()(n)));var c={key:o.dataIndex||o.key,class:"table-draggable-handle",attrs:{w:10,x:o.width,z:1,axis:"x",draggable:!0,resizable:!1},on:{dragging:function(t,e){o.width=Math.max(t,1)}}},i=e("vue-draggable-resizable",h()({},c));return e("th",h()({},s,{class:"resize-table-th"}),[].concat(m()(n),[i]))}}},{matchValue:null,currentRow:{},spinning:!1,mouseLeaveDelay:.05,columns:[{title:"序号",dataIndex:"index",key:"index",align:"center",width:50,customRender:function(t,e,a){return""+(a+1)}},{title:"关联方名称",dataIndex:"mergeCustomerName",ellipsis:!0,width:300,customRender:function(e,a,n){for(var r={children:e,attrs:{}},s=I.b.mergeCells(t.dataCollection,"mergeCustomerName"),o=0;o<s[0].length;o++)n===s[1][o]&&(r.attrs.rowSpan=s[0][o]),n>s[1][o]&&n<=s[1][o+1]&&(r.attrs.rowSpan=0);return r}},{title:"类型",dataIndex:"mergeScopeName",width:170,scopedSlots:{customRender:"mergeScopeName"}},{title:"操作",dataIndex:"autoMatch",width:120,scopedSlots:{customRender:"autoMatch"}},{title:"认缴比例",dataIndex:"stockBreakRate",width:90,customRender:I.b.fmtEquity},{title:"权益比例",width:90,dataIndex:"equityRatio",customRender:I.b.fmtEquity},{title:"持股方式",width:90,dataIndex:"stockType"},{title:"认缴金额",width:150,dataIndex:"stockCapi",align:"right",customRender:I.b.commafy},{title:"客商编号",width:150,dataIndex:"merchantId",ellipsis:!0},{title:"客商名称",width:200,dataIndex:"merchantName",ellipsis:!0},{title:"科目名称",dataIndex:"subjectName",width:200,ellipsis:!0},{title:"统一信用代码",dataIndex:"customerUscc",width:200,ellipsis:!0},{title:"工商注册名称",width:280,dataIndex:"customerName",ellipsis:!0},{title:"工商办公地址",width:260,dataIndex:"officeAddress",ellipsis:!0},{title:"工商注册地址",width:260,dataIndex:"registeredAddress",ellipsis:!0},{title:"百度地址",width:260,dataIndex:"baiduAddress",ellipsis:!0}],dataCollection:[],openSearchDiaplog:!1,searchForm:{mergeCustomerName:null,merchantName:null,customerUscc:null},labelCol:{span:6},wrapperCol:{span:13},openHandMatchDiaplog:!1,matchTableColumns:[{title:"统一信用代码",dataIndex:"customerUscc",customRender:function(e,a,n){for(var r={children:e,attrs:{}},s=I.b.mergeCells(t.matchTabledataCollection,"customerUscc"),o=0;o<s[0].length;o++)n===s[1][o]&&(r.attrs.rowSpan=s[0][o]),n>s[1][o]&&n<=s[1][o+1]&&(r.attrs.rowSpan=0);return r},scopedSlots:{filterDropdown:"filterDropdown",filterIcon:"filterIcon",customRender:"customRender"}},{title:"工商名称",dataIndex:"customerName",scopedSlots:{filterDropdown:"filterDropdown",filterIcon:"filterIcon",customRender:"searchCustomerName"}},{title:"客商代码",dataIndex:"merchantId"},{title:"客商名称",dataIndex:"merchantName",ellipsis:!0,scopedSlots:{filterDropdown:"filterDropdown",filterIcon:"filterIcon",customRender:"searchMerchantName"}}],matchTabledataCollection:[],selectedRowKeys:[],pagination:{current:1,pageSize:10,showSizeChanger:!0,pageSizeOptions:["10","20","30","40","50"],onShowSizeChange:function(e,a){t.queryParams.sqlId="DG40003",t.queryParams.start=e-1,t.queryParams.limit=a,t.queryParams.isChange=!0,t.pagination.pageSize=a,t.queryMerchantListData()},showQuickJumper:!1,size:"small",total:0,showTotal:function(){return"共"+t.pagination.total+"条"},change:!0,onChange:function(e,a){t.queryParams.sqlId="DG40003",t.queryParams.start=(e-1)*a,t.queryParams.limit=t.pagination.pageSize,t.queryParams.isChange=!1,t.pagination.current=e,t.queryMerchantListData()}},pagination1:{current:1,pageSize:10,showSizeChanger:!0,pageSizeOptions:["10","20","30","40","50"],onShowSizeChange:function(e,a){t.pagination1.pageSize=a;var n={start:(e-1)*a,limit:t.pagination1.pageSize,param3:t.searchFormCache.mergeCustomerName||null,param4:t.searchFormCache.merchantName||null,param5:t.searchFormCache.customerUscc||null,param6:t.searchFormCache.matchValue||null};null!=(y.a.get(t.searchFormCache,"mergeCustomerName")||y.a.get(t.searchFormCache,"merchantName")||y.a.get(t.searchFormCache,"customerUscc")||y.a.get(t.searchFormCache,"matchValue"))?t.onSubmitSeachItem(n):t.handleQueryContactsCustomer({start:(e-1)*a,limit:t.pagination1.pageSize})},showQuickJumper:!1,size:"small",total:0,showTotal:function(){return"共"+t.pagination1.total+"条"},change:!0,onChange:function(e,a){t.pagination1.current=e;var n={start:(e-1)*a,limit:t.pagination1.pageSize,param3:t.searchFormCache.mergeCustomerName||null,param4:t.searchFormCache.merchantName||null,param5:t.searchFormCache.customerUscc||null,param6:t.searchFormCache.matchValue||null};null!=(y.a.get(t.searchFormCache,"mergeCustomerName")||y.a.get(t.searchFormCache,"merchantName")||y.a.get(t.searchFormCache,"customerUscc")||y.a.get(t.searchFormCache,"matchValue"))?t.onSubmitSeachItem(n):t.handleQueryContactsCustomer({start:(e-1)*a,limit:t.pagination1.pageSize})}},queryParams:{sqlId:"DG40003",start:0,limit:10},selectedMatchRows:[],uploading:!1,visiableUploadDialog:!1,fileName:null,uploadFile:null,searchText:"",searchInput:null,matchDialogSerch:!1,searchedColumn:null,visiableRelateListDialog:!1,relateList:[],relateListColumns:[{title:"关联方名称",dataIndex:"mergeCustomerName",ellipsis:!0,width:"200px"},{title:"统一信用代码",dataIndex:"uscc",ellipsis:!0,width:"200px"},{title:"认缴比例",dataIndex:"stockBreakRate",customRender:I.b.fmtEquity,width:"200px"},{title:"权益比例",dataIndex:"equityRatio",customRender:I.b.fmtEquity,width:100},{title:"持股方式",dataIndex:"stockType",width:100},{title:"认缴金额",dataIndex:"stockCapi",width:"120px",align:"right",customRender:I.b.commafy}],accountAgeTableColumns:[{title:"债务人编号",dataIndex:"araId",ellipsis:!0,width:"120px"},{title:"债务人名称",dataIndex:"araName",ellipsis:!0,width:"120px",scopedSlots:{filterDropdown:"filterDropdown",filterIcon:"filterIcon",customRender:"searchMerchantName"}},{title:"数据插入状态",dataIndex:"status",ellipsis:!0,width:"120px"},{title:"原因",dataIndex:"reason",ellipsis:!0,width:"120px"},{title:"账龄",dataIndex:"accountAge",width:"550px",children:[{title:"1年内",width:"110px",dataIndex:"ara01",align:"right",customRender:I.b.commafy},{title:"1-2年",width:"100px",dataIndex:"ara02",align:"right",customRender:I.b.commafy},{title:"2-3年",width:"100px",dataIndex:"ara03",align:"right",customRender:I.b.commafy},{title:"3-4年",width:"110px",dataIndex:"ara04",align:"right",customRender:I.b.commafy},{title:"4-5年",width:"110px",dataIndex:"ara05",align:"right",customRender:I.b.commafy},{title:"5年以上",width:"110px",dataIndex:"ara06",align:"right",customRender:I.b.commafy}]}],accountAgeTabledataCollection:[],openAccountAgeDialog:!1,curstomerInformation:{},pagination2:{current:1,pageSize:10,showSizeChanger:!0,pageSizeOptions:["10","20","30","40","50"],onShowSizeChange:function(e,a){t.pagination2.pageSize=a,t.pagination2.current=1;var n={sqlId:"DG40006",lockCustomerId:t.checkAccountAgeOldItem.mergeCustomerId,lockProjectId:t.checkAccountAgeOldItem.mergeProjectId,lockYyyy:t.checkAccountAgeOldItem.mergeCurAccYear,param3:null,param4:null,param5:1,start:0,limit:a};t.getAccountAgeDataAndRelatedpartListData(n,"accountAge")},showQuickJumper:!1,size:"small",total:0,showTotal:function(){return"共"+t.pagination2.total+"条"},change:!0,onChange:function(e,a){t.pagination2.current=e;var n={sqlId:"DG40006",lockCustomerId:t.checkAccountAgeOldItem.mergeCustomerId,lockProjectId:t.checkAccountAgeOldItem.mergeProjectId,lockYyyy:t.checkAccountAgeOldItem.mergeCurAccYear,param3:null,param4:null,param5:1,start:(e-1)*a,limit:t.pagination2.pageSize};t.getAccountAgeDataAndRelatedpartListData(n,"accountAge")}},checkAccountAgeOldItem:{},relateListPagination:{current:1,pageSize:10,showSizeChanger:!0,pageSizeOptions:["10","20","30","40","50"],onShowSizeChange:function(e,a){t.relateListPagination.pageSize=a;var n={sqlId:"DG40006",lockCustomerId:t.curstomerInformation.curCustomerId,lockProjectId:t.curstomerInformation.curProjectId,lockYyyy:t.curstomerInformation.curAccYear,start:e-1,limit:t.relateListPagination.pageSize};t.getAccountAgeDataAndRelatedpartListData(n)},showQuickJumper:!1,size:"small",total:0,showTotal:function(){return"共"+t.relateListPagination.total+"条"},change:!0,onChange:function(e,a){t.relateListPagination.current=e;var n={sqlId:"DG40006",lockCustomerId:t.curstomerInformation.curCustomerId,lockProjectId:t.curstomerInformation.curProjectId,lockYyyy:t.curstomerInformation.curAccYear,start:(e-1)*a,limit:t.relateListPagination.pageSize};t.getAccountAgeDataAndRelatedpartListData(n)}},searchFormCache:{},relatioNum:0}}),s()(n,"methods",{handleSyncUploadCustomer:function(){var t=this;this.$confirm({title:"提示",content:"确认要同步关联方清单吗？",onOk:function(){t.spinning=!0,t.$sacpApis.synContacts().then(function(e){if(!e.success)return t.$message.error(e.resultInfo.statusText);t.openRelateListDialog(t.curstomerInformation,"sync"),t.$message.success("同步成功")}).catch(function(e){return t.$message.error(e)}).finally(function(){return t.spinning=!1})},onCancel:function(){}})},handleSearch:function(t,e,a){this.searchText=t[0],this.searchedColumn=a,this.searchedColumn&&"merchantName"===this.searchedColumn?this.queryParams.param3=this.searchText:this.searchedColumn&&"customerUscc"===this.searchedColumn?this.queryParams.param5=this.searchText:this.searchedColumn&&"customerName"===this.searchedColumn&&(this.queryParams.param6=this.searchText),this.queryMerchantListData()},handleSearchDebtor:function(t,e,a){this.searchText=t[0];var n={sqlId:"DG40016",lockCustomerId:this.checkAccountAgeOldItem.mergeCustomerId,lockProjectId:this.checkAccountAgeOldItem.mergeProjectId,lockYyyy:this.checkAccountAgeOldItem.mergeCurAccYear,param3:t[0],param4:null,param5:0,start:this.queryParams.start,limit:this.queryParams.limit};this.getAccountAgeDataAndRelatedpartListData(JSON.parse(l()(n)),"accountAge")},handleResetDebtor:function(t){t(),this.searchText="";var e={sqlId:"DG40006",lockCustomerId:this.checkAccountAgeOldItem.mergeCustomerId,lockProjectId:this.checkAccountAgeOldItem.mergeProjectId,lockYyyy:this.checkAccountAgeOldItem.mergeCurAccYear,param3:null,param4:null,param5:1,start:this.queryParams.start,limit:this.queryParams.limit};this.getAccountAgeDataAndRelatedpartListData(JSON.parse(l()(e)),"accountAge")},openRelateListDialog:function(t,e){if(!t)return this.$message.error("请重新登录");this.curstomerInformation=t,this.visiableRelateListDialog=!0;var a={sqlId:"DG40006",lockCustomerId:t.curCustomerId,lockProjectId:t.curProjectId,lockYyyy:t.curAccYear,start:0,limit:10};this.getAccountAgeDataAndRelatedpartListData(a,e)},getAccountAgeDataAndRelatedpartListData:function(t,e){var a=this;this.spinning=!0,t.sqlId="accountAge"===e?"DG40016":t.sqlId,this.$sacpApis.generalQuery(JSON.parse(l()(t))).then(function(t){if(!t.success)return a.$message.error(t.resultInfo.statusText);t.data&&t.data.length&&t.data.forEach(function(t,e){y.a.set(t,"key",e)}),"accountAge"===e?(a.accountAgeTabledataCollection=t.data,a.pagination2.total=t.totalCount):(a.relateList=t.data,a.relateListPagination.total=t.totalCount)}).catch(function(t){return a.$message.error(t)}).finally(function(){return a.spinning=!1})},handleReset:function(t,e){e(),this.searchText="",this.searchedColumn="",this.queryParams.param3=t&&"merchantName"===t||!t?null:this.queryParams.param3,this.queryParams.param5=t&&"customerUscc"===t||!t?null:this.queryParams.param5,this.queryParams.param6=t&&"customerName"===t||!t?null:this.queryParams.param6,this.queryMerchantListData()},openSearchDialog:function(){var t=this;this.openSearchDiaplog=!0,this.matchValue=null,c()(this.searchForm).forEach(function(e){return t.searchForm[e]=null})},openUploadDialog:function(){this.visiableUploadDialog=!0},handleCancelUpload:function(){this.visiableUploadDialog=!1,this.fileName=null,this.uploadFile=null},beforeUpload:function(t){if(t&&t.name){var e=t.name.split(".");if("xlsx"!=e[e.length-1]&&"xls"!=e[e.length-1])return this.fileName=null,this.uploadFile=null,this.$message.error("请上传excel文件格式!");this.fileName=t.name,this.uploadFile=t}},handleConfirmUpload:function(){var t=this,e=new FormData;e.append("file",this.uploadFile),this.spinning=!0,this.$sacpApis.importMerchantRelated(e).then(function(e){e.success?(t.$message.success("上传成功!"),t.handleCancelUpload(),t.handleQueryContactsCustomer()):t.$message.error(e.resultInfo.statusText)}).catch(function(e){t.$message.error(e)}).finally(function(){t.spinning=!1})},actionEmpty:function(){},downLoadImportFile:function(){this.$sacpApis.downLoad({fileId:11},"关联方导入模板.xlsx")},onSubmitSeachItem:function(t){var e={start:t?t.start:0,limit:t?t.limit:10,param3:t?t.param3:this.searchForm.mergeCustomerName,param4:t?t.param4:this.searchForm.merchantName,param5:"",param6:t?t.param6:this.matchValue,param8:t?t.param5:this.searchForm.customerUscc};this.getSearchResult(e,t)},getSearchResult:function(t,e){var a=this;this.spinning=!0;var n={};"0"==t.param6?n.param7=1:t.param6&&(n.param6=1),t.param6="";var r=h()({},t,{param1:C.a.findUserInfo().curCustomerId,param2:C.a.findUserInfo().curProjectId,lockYyyy:record.mergeCurAccYear,sqlId:"DG40007"},n);this.$sacpApis.queryContactsCustomer(r).then(function(t){t.success?(t.data&&t.data.length&&t.data.forEach(function(t,e){y.a.set(t,"key",e)}),a.dataCollection=t.data,a.pagination1.total=t.totalCount,a.searchFormCache=e?a.searchFormCache:JSON.parse(l()(a.searchForm)),a.searchFormCache.matchValue=e?a.searchFormCache.matchValue:a.matchValue):a.$message.error(t.resultInfo.statusText)}).catch(function(t){console.log(t,"err"),a.$message.error(t)}).finally(function(){a.cancelSearch(),a.spinning=!1,a.searchText=""})},cancelSearch:function(){this.openSearchDiaplog=!1},matchTableOnSelectChange:function(t,e){this.selectedRowKeys=t,this.selectedMatchRows=e},handleMatch:function(t){this.currentRow=t,this.openHandMatchDiaplog=!0,this.queryMerchantListData()},deleteMatch:function(t){var e=this;if(!t.customerUscc)return this.$message.error("当前客户没有匹配数据!");this.spinning=!0,this.$sacpApis.deleteContactsCustomerByHand({param3:t.customerUscc,param4:t.autoId}).then(function(t){t.success?(e.$message.success("取消成功!"),e.handleQueryContactsCustomer()):e.$message.error(t.resultInfo.statusText)}).catch(function(t){return e.$message.error(t)}).finally(function(){e.spinning=!1})},handleCheckAccountAge:function(t){this.checkAccountAgeOldItem=t;var e={sqlId:"DG40006",lockCustomerId:t.mergeCustomerId,lockProjectId:t.mergeProjectId,param3:null,param4:null,param5:1,start:this.queryParams.start,limit:this.queryParams.limit};e.lockCustomerId&&e.lockProjectId?(this.openAccountAgeDialog=!0,this.getAccountAgeDataAndRelatedpartListData(JSON.parse(l()(e)),"accountAge")):this.$warning({title:"提示:",content:"关联方客户信息为空，请去合并项目设置关联方清单后再点击同步合并项目的关联方清单按钮重新同步!"})},deleteMerchantRelatedById:function(t){var e=this,a={param3:t.autoId};this.$sacpApis.deleteMerchantRelatedById(a).then(function(t){t.success?(e.$message.success("删除成功!"),e.handleQueryContactsCustomer()):e.$message.error(t.resultInfo.statusText)}).catch(function(t){e.$message.error(t)}).finally(function(){e.spinning=!1})},onSubmitMatchItem:function(){var t=this;if(!this.selectedRowKeys||0==this.selectedRowKeys.length)return this.$message.error("请选择需要匹配的数据");this.spinning=!0;var e=void 0;this.selectedMatchRows.map(function(t){return e+=","+t.customerUscc});var a={param3:e=e.split(",").filter(function(t){return"undefined"!=t}).join(),param4:this.currentRow.mergeCustomerId,param5:this.currentRow.mergeProjectId,param6:this.currentRow.autoId};this.openHandMatchDiaplog=!1,this.$sacpApis.matchContactsCustomerByHand(a).then(function(e){e.success?(t.$message.success("匹配成功!"),t.handleQueryContactsCustomer(),t.cancelMatch()):t.$message.error(e.resultInfo.statusText)}).catch(function(e){t.$message.error(e)}).finally(function(){t.spinning=!1})},cancelMatch:function(){this.openHandMatchDiaplog=!1,this.selectedMatchRows=[],this.selectedRowKeys=[]},queryMerchantListData:function(){var t=this;this.spinning=!0,this.queryParams.sqlId="DG40004",this.queryParams.param4=null,this.queryParams.lockCustomerId=C.a.findUserInfo().curCustomerId,this.queryParams.lockProjectId=C.a.findUserInfo().curProjectId,this.$sacpApis.findMerchantList(this.queryParams).then(function(e){e.success?(e.data&&e.data.length&&e.data.forEach(function(t,e){y.a.set(t,"key",e)}),t.matchTabledataCollection=e.data,t.pagination.total=e.totalCount,t.queryParams.isChange&&(t.pagination.current=1)):t.$message.error(e.resultInfo.statusText)}).catch(function(e){t.$message.error(e)}).finally(function(){t.searchText="",t.searchedColumn="",t.spinning=!1})},relationNumber:function(){var t=this,e={param1:C.a.findUserInfo().curCustomerId,param2:C.a.findUserInfo().curProjectId,lockYyyy:C.a.findUserInfo().curAccYear,sqlId:"DG40046"};this.$sacpApis.findMerchantList(e).then(function(e){e.success?e.data&&e.data.length&&(t.relatioNum=e.data[0].relatedCount):t.$message.error(e.resultInfo.statusText)}).catch(function(e){t.$message.error(e)}).finally(function(){t.spinning=!1,t.$store.commit("refreshRelatedPartMatch",!1)})},handleQueryContactsCustomer:function(t){var e=this,a=t||{start:0,limit:10},n=h()({},a,{param1:C.a.findUserInfo().curCustomerId,param2:C.a.findUserInfo().curProjectId,lockYyyy:C.a.findUserInfo().curAccYear,sqlId:"DG40007"});this.spinning=!0,this.$sacpApis.queryContactsCustomer(n).then(function(t){t.success?(t.data&&t.data.length&&t.data.forEach(function(t,e){y.a.set(t,"key",e)}),e.dataCollection=t.data,e.pagination1.total=t.totalCount,e.relationNumber()):e.$message.error(t.resultInfo.statusText)}).catch(function(t){e.$message.error(t)}).finally(function(){e.spinning=!1,e.$store.commit("refreshRelatedPartMatch",!1)})},manualRefesh:function(){this.handleQueryContactsCustomer()}}),s()(n,"created",function(){this.handleQueryContactsCustomer()}),n),v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"relatedPartyMatch"},[a("a-spin",{attrs:{tip:"加载中...",spinning:t.spinning,size:"large"}},[a("div",{staticStyle:{"text-align":"center","margin-bottom":"8px"}},[a("a-icon",{staticStyle:{"margin-right":"8px"},attrs:{type:"tag"}}),t._v(t._s("共查询到"+(t.pagination1.total||0)+"条数据 ")+"\n            "),a("span",{staticStyle:{color:"#409eff","margin-left":"10px",cursor:"pointer"},on:{click:t.manualRefesh}},[a("a-icon",{staticStyle:{"margin-right":"5px"},attrs:{type:"sync"}}),t._v("刷新\n            ")],1),t._v("\n                "+t._s("已匹配"+t.relatioNum+"个关联方")+"\n        ")],1),t._v(" "),a("a-table",{staticClass:"related-parrty-table",attrs:{bordered:"",columns:t.columns,"data-source":t.dataCollection,scroll:{x:"calc(1300px + 50%)",y:"calc(100% - 55px)"},pagination:t.pagination1,components:t.components},scopedSlots:t._u([{key:"autoMatch",fn:function(e,n){return[a("a-popconfirm",{attrs:{title:"确定要取消匹配的数据吗？","ok-text":"确 定","cancel-text":"取 消"},on:{confirm:function(e){return t.deleteMatch(n)}}},[a("a-button",{staticClass:"del-match-btn",attrs:{type:"primary",shape:"circle",icon:"disconnect",size:"small",title:"取消匹配"}})],1),t._v(" "),a("a-button",{attrs:{type:"primary",shape:"circle",icon:"eye",size:"small",title:"查看账龄"},on:{click:function(e){return t.handleCheckAccountAge(n)}}}),t._v(" "),a("a-popconfirm",{attrs:{title:"确定要删除匹配的数据吗？","ok-text":"确 定","cancel-text":"取 消"},on:{confirm:function(e){return t.deleteMerchantRelatedById(n)}}},[a("a-button",{staticClass:"del-match-btn",attrs:{type:"primary",shape:"circle",icon:"delete",size:"small",title:"删除"}})],1)]}}])}),t._v(" "),a("a-modal",{attrs:{title:"查询","ok-text":"确","cancel-text":"取消"},on:{ok:function(e){return t.onSubmitSeachItem(null)},cancel:t.cancelSearch},model:{value:t.openSearchDiaplog,callback:function(e){t.openSearchDiaplog=e},expression:"openSearchDiaplog"}},[a("a-form-model",{attrs:{model:t.searchForm,"label-col":t.labelCol,"wrapper-col":t.wrapperCol}},[a("a-form-model-item",{attrs:{label:"关联方名称"}},[a("a-input",{attrs:{placeholder:"请输入"},model:{value:t.searchForm.mergeCustomerName,callback:function(e){t.$set(t.searchForm,"mergeCustomerName",e)},expression:"searchForm.mergeCustomerName"}})],1),t._v(" "),a("a-form-model-item",{attrs:{label:"客商名称"}},[a("a-input",{attrs:{placeholder:"请输入"},model:{value:t.searchForm.merchantName,callback:function(e){t.$set(t.searchForm,"merchantName",e)},expression:"searchForm.merchantName"}})],1),t._v(" "),a("a-form-model-item",{attrs:{label:"统一信用代码"}},[a("a-input",{attrs:{placeholder:"请输入"},model:{value:t.searchForm.customerUscc,callback:function(e){t.$set(t.searchForm,"customerUscc",e)},expression:"searchForm.customerUscc"}})],1),t._v(" "),a("a-form-model-item",{attrs:{label:"匹配"}},[a("a-radio-group",{model:{value:t.matchValue,callback:function(e){t.matchValue=e},expression:"matchValue"}},[a("a-radio",{attrs:{value:1}},[t._v(" 是 ")]),t._v(" "),a("a-radio",{attrs:{value:0}},[t._v(" 否 ")])],1)],1)],1)],1),t._v(" "),a("a-modal",{staticClass:"matchDialog",attrs:{title:"匹配列表","ok-text":"确认","cancel-text":"取消",width:"90%"},on:{ok:t.onSubmitMatchItem,cancel:t.cancelMatch},model:{value:t.openHandMatchDiaplog,callback:function(e){t.openHandMatchDiaplog=e},expression:"openHandMatchDiaplog"}},[a("a-table",{attrs:{bordered:"",columns:t.columns,"data-source":t.matchTabledataCollection,"row-selection":{selectedRowKeys:t.selectedRowKeys,onChange:t.matchTableOnSelectChange},scroll:{y:"calc(100% - 55px)"},pagination:t.pagination},scopedSlots:t._u([{key:"filterDropdown",fn:function(e){var n=e.setSelectedKeys,r=e.selectedKeys,s=e.confirm,o=e.clearFilters,c=e.column;return a("div",{staticStyle:{padding:"8px"}},[a("a-input",{directives:[{name:"ant-ref",rawName:"v-ant-ref",value:function(e){return t.searchInput=e},expression:"(c) => (searchInput = c)"}],staticStyle:{width:"188px","margin-bottom":"8px",display:"block"},attrs:{placeholder:"请输入",value:r[0]},on:{change:function(t){return n(t.target.value?[t.target.value]:[])},pressEnter:function(){return t.handleSearch(r,s,c.dataIndex)}}}),t._v(" "),a("a-button",{staticStyle:{width:"90px","margin-right":"8px"},attrs:{type:"primary",icon:"search",size:"small"},on:{click:function(e){return t.handleSearch(r,s,c.dataIndex)}}},[t._v("\n                        搜 索\n                    ")]),t._v(" "),a("a-button",{staticStyle:{width:"90px"},attrs:{size:"small"},on:{click:function(e){return t.handleReset(c.dataIndex,o)}}},[t._v("\n                        重 置\n                    ")])],1)}}])})],1),t._v(" "),a("a-modal",{staticClass:"upload-dialog",attrs:{title:"关联方导入","on-ok":"handleConfirmUpload"},model:{value:t.visiableUploadDialog,callback:function(e){t.visiableUploadDialog=e},expression:"visiableUploadDialog"}},[a("template",{slot:"footer"},[a("a-button",{key:"back",on:{click:t.handleCancelUpload}},[t._v("\n                    取 消\n                ")]),t._v(" "),a("a-button",{key:"submit",attrs:{type:"primary"},on:{click:t.handleConfirmUpload}},[t._v("\n                    确 定\n                ")])],1),t._v(" "),a("a-input",{staticClass:"file-name",model:{value:t.fileName,callback:function(e){t.fileName=e},expression:"fileName"}}),t._v(" "),a("a-upload",{attrs:{"before-upload":t.beforeUpload,name:"file",accept:"'xls', 'xlsx'",listType:"text"}},[a("a-button",{attrs:{type:"primary"}},[a("a-icon",{attrs:{type:"upload"}}),t._v(" 浏 览\n                ")],1)],1),t._v(" "),a("a-button",{attrs:{type:"primary",icon:"download"},on:{click:t.downLoadImportFile}},[t._v("模板文件下载")])],2),t._v(" "),a("a-modal",{staticClass:"relate-list-dialog matchDialog",attrs:{width:"80%",footer:null,destroyOnClose:!0},model:{value:t.visiableRelateListDialog,callback:function(e){t.visiableRelateListDialog=e},expression:"visiableRelateListDialog"}},[a("template",{slot:"title"},[a("div",{staticClass:"headerTitle"},[a("span",{staticClass:"a-dialog__title"},[t._v("关联方清单")]),t._v(" "),a("a-button",{attrs:{icon:"retweet",title:"同步"},on:{click:t.handleSyncUploadCustomer}})],1)]),t._v(" "),a("a-table",{attrs:{pagination:t.relateListPagination,columns:t.relateListColumns,"data-source":t.relateList,scroll:{y:"calc(100% - 55px)"}}})],2),t._v(" "),a("a-modal",{staticClass:"accountAgeDialog matchDialog",attrs:{title:"查看账龄列表",width:"90%",footer:null,destroyOnClose:!0},model:{value:t.openAccountAgeDialog,callback:function(e){t.openAccountAgeDialog=e},expression:"openAccountAgeDialog"}},[a("a-table",{attrs:{bordered:"",columns:t.accountAgeTableColumns,"data-source":t.accountAgeTabledataCollection,scroll:{y:"calc(100% - 55px)",x:"scollXWidth"},pagination:t.pagination2},scopedSlots:t._u([{key:"filterDropdown",fn:function(e){var n=e.setSelectedKeys,r=e.selectedKeys,s=e.confirm,o=e.clearFilters,c=e.column;return a("div",{staticStyle:{padding:"8px"}},[a("a-input",{directives:[{name:"ant-ref",rawName:"v-ant-ref",value:function(e){return t.searchInput=e},expression:"(c) => (searchInput = c)"}],staticStyle:{width:"188px","margin-bottom":"8px",display:"block"},attrs:{placeholder:"请输入",value:r[0]},on:{change:function(t){return n(t.target.value?[t.target.value]:[])},pressEnter:function(){return t.handleSearchDebtor(r,s,c.dataIndex)}}}),t._v(" "),a("a-button",{staticStyle:{width:"90px","margin-right":"8px"},attrs:{type:"primary",icon:"search",size:"small"},on:{click:function(e){return t.handleSearchDebtor(r,s,c.dataIndex)}}},[t._v("\n                        搜 索\n                    ")]),t._v(" "),a("a-button",{staticStyle:{width:"90px"},attrs:{size:"small"},on:{click:function(e){return t.handleResetDebtor(o)}}},[t._v("\n                        重 置\n                    ")])],1)}}])})],1)],1)],1)},staticRenderFns:[]};var b=a("VU/8")(x,v,!1,function(t){a("HbLR")},null,null);e.default=b.exports},HbLR:function(t,e){}});
//# sourceMappingURL=8.25a5b48d2ed6f7f758ea.js.map