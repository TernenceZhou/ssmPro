webpackJsonp([12],{Tnc4:function(t,e){},eu7J:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("mvHQ"),i=a.n(n),s=a("fZjL"),c=a.n(s),r=a("Gu7T"),l=a.n(r),o=a("Dd8w"),u=a.n(o),d=a("+6Bu"),h=a.n(d),m=a("ZHXk"),p=a.n(m),g=a("K/T8"),f=a("0RKR"),y=a("7+uW"),b=a("vn6w"),x=a.n(b);y.a.component("vue-draggable-resizable",x.a);var v={components:{EditableCell:{template:'\n        <div class="editable-cell">\n            <div v-if="editable" class="editable-cell-input-wrapper">\n            <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon\n                type="check"\n                class="editable-cell-icon-check"\n                @click="check"\n            />\n            </div>\n            <div v-else class="editable-cell-text-wrapper">\n            {{ value || \' \' }}\n            <a-icon type="edit" class="editable-cell-icon" @click="edit" />\n            </div>\n        </div>\n        ',props:{text:String},data:function(){return{value:"",editable:!1}},watch:{text:{handler:function(t,e){this.value=t},immediate:!0}},methods:{handleChange:function(t){var e=t.target.value;this.value=e},check:function(){this.editable=!1,this.$emit("change",this.value)},edit:function(){this.editable=!0}}}},name:"matchBusinessData",data:function(){var t=this;return this.components={header:{cell:function(e,a,n){var i=a.key,s=h()(a,["key"]),c=t.columns.find(function(t){return(t.dataIndex||t.key)===i});if(!c||!c.width)return e("th",u()({},s),[].concat(l()(n)));var r={key:c.dataIndex||c.key,class:"table-draggable-handle",attrs:{w:10,x:c.width,z:1,axis:"x",draggable:!0,resizable:!1},on:{dragging:function(t,e){c.width=Math.max(t,1)}}},o=e("vue-draggable-resizable",u()({},r));return e("th",u()({},s,{class:"resize-table-th"}),[].concat(l()(n),[o]))}}},{scollXWidth:3e3,value:this.text,editable:!1,searchDialogVisible:!1,spinning:!1,columns:[{title:"客商名称",dataIndex:"merchantName",width:300,ellipsis:!0,fixed:"left"},{title:"含抽凭数据",dataIndex:"isSampling",ellipsis:!0,width:120,scopedSlots:{customRender:"isSampling"}},{title:"一级科目",dataIndex:"oneSubjectName",width:200,ellipsis:!0},{title:"科目全路径",dataIndex:"subjectFullName",width:200,ellipsis:!0},{title:"期初余额",dataIndex:"remain",width:170,ellipsis:!0,align:"right",customRender:g.b.commafy},{title:"借方发生额",dataIndex:"debitOcc",width:170,ellipsis:!0,align:"right",customRender:g.b.commafy},{title:"贷方发生额",dataIndex:"creditOcc",width:170,ellipsis:!0,align:"right",customRender:g.b.commafy},{title:"期末余额",dataIndex:"balance",ellipsis:!0,align:"right",width:170,customRender:g.b.commafy},{title:"统一信用代码",dataIndex:"customerUscc",width:270,ellipsis:!0,scopedSlots:{customRender:"customerUscc"},customCell:function(t,e){return{style:{"background-color":"#E0F5E9"}}}},{title:"工商注册名称",dataIndex:"customerName",width:200,ellipsis:!0},{title:"工商办公地址",dataIndex:"officeAddress",width:200,ellipsis:!0},{title:"工商注册地址",dataIndex:"registeredAddress",width:200,ellipsis:!0},{title:"工商注册资本",width:200,dataIndex:"registerAmount",ellipsis:!0,customRender:g.b.commafy},{title:"百度地址",dataIndex:"baiduAddress",width:200,ellipsis:!0},{title:"地区",dataIndex:"areaPlace",width:170,ellipsis:!0,scopedSlots:{customRender:"areaPlace"}},{title:"行业大类",dataIndex:"industrycategory",width:170,ellipsis:!0,scopedSlots:{customRender:"industrycategory"}},{title:"行业门类",dataIndex:"industryclassification",width:170,ellipsis:!0,scopedSlots:{customRender:"industryclassification"}}],isSamplingList:[{label:"全部",key:0,value:""},{label:"是",key:1,value:"1"},{label:"否",key:2,value:"0"}],labelCol:{span:6},wrapperCol:{span:13},dataList:[],dataListCopy:[],changeTable:!1,columns2:[{title:"统一信用代码",dataIndex:"customerUscc",width:"200px",ellipsis:!0,fixed:"left",customRender:function(e,a,n){for(var i={children:e,attrs:{}},s=g.b.mergeCells(t.dataList,"customerUscc"),c=0;c<s[0].length;c++)n===s[1][c]&&(i.attrs.rowSpan=s[0][c]),n>s[1][c]&&n<=s[1][c+1]&&(i.attrs.rowSpan=0);return i}},{title:"工商注册名称",dataIndex:"customerName",width:"300px",ellipsis:!0,customRender:function(e,a,n){for(var i={children:e,attrs:{}},s=g.b.mergeCells(t.dataList,"customerName"),c=0;c<s[0].length;c++)n===s[1][c]&&(i.attrs.rowSpan=s[0][c]),n>s[1][c]&&n<=s[1][c+1]&&(i.attrs.rowSpan=0);return i}},{title:"工商办公地址",width:"200px",dataIndex:"officeAddress",ellipsis:!0},{title:"工商注册地址",width:"200px",dataIndex:"registeredAddress",ellipsis:!0},{title:"工商注册资本",width:200,dataIndex:"registerAmount",ellipsis:!0,customRender:g.b.commafy},{title:"百度地址",width:"200px",dataIndex:"baiduAddress",ellipsis:!0},{title:"客商编号",dataIndex:"merchantId",width:"170px",ellipsis:!0},{title:"客商名称",width:"300px",dataIndex:"merchantName",ellipsis:!0},{title:"含抽凭数据",dataIndex:"isSampling",width:"120px",scopedSlots:{customRender:"isSampling"}},{title:"一级科目",dataIndex:"subjectName",width:"200px",ellipsis:!0},{title:"地区",dataIndex:"areaPlace",width:170,ellipsis:!0,scopedSlots:{customRender:"areaPlace"}},{title:"行业大类",dataIndex:"industrycategory",width:170,ellipsis:!0,scopedSlots:{customRender:"industrycategory"}},{title:"行业门类",dataIndex:"industryclassification",width:170,ellipsis:!0,scopedSlots:{customRender:"industryclassification"}},{title:"期初余额",dataIndex:"remain",width:"170px",align:"right",ellipsis:!0,customRender:g.b.commafy},{title:"借方发生额",width:"170px",dataIndex:"debitOcc",align:"right",ellipsis:!0,customRender:g.b.commafy},{title:"贷方发生额",width:"170px",dataIndex:"creditOcc",align:"right",ellipsis:!0,customRender:g.b.commafy},{title:"期末余",width:"170px",dataIndex:"balance",align:"right",ellipsis:!0,customRender:g.b.commafy}],queryParams:{sqlId:"DG40003",start:0,limit:10,param9:""},searchForm:{merchantName:null,isSampling:null,customerUscc:null},pagination:{current:1,pageSize:10,showSizeChanger:!0,pageSizeOptions:["10","20","30","40","50"],onShowSizeChange:function(e,a){t.queryParams.start=e-1,t.queryParams.limit=a,t.queryParams.isChange=!0,t.pagination.pageSize=a,t.queryMerchantInitData()},showQuickJumper:!1,size:"small",total:0,showTotal:function(){return"共"+t.pagination.total+"条"},change:!0,onChange:function(e,a){t.queryParams.start=(e-1)*a,t.queryParams.limit=t.pagination.pageSize,t.queryParams.isChange=!1,t.pagination.current=e,t.queryMerchantInitData()}},totalCount:0,matchCount:0,samplingCount:0,samplingMatchCount:0,checked:!1}},methods:{updataBusiness:function(t){if(this.spinning)return this.$message.error("数据处理中,请勿重复点击");var e={param1:t},a=this;this.$confirm({title:"提示",content:"是否确定要更新工商数据？",onOk:function(){a.spinning=!0,a.$sacpApis.updateCompanyByUscc(e).then(function(t){t.success&&a.queryMerchantInitData()}).catch(function(t){return a.$message.error(t)}).finally(function(){return a.spinning=!1})},onCancel:function(){}})},clearUscc:function(t,e,a){var n=this;this.$confirm({title:"提示",content:"是否清除该统一信用代码？",onOk:function(){n.onCellChange(t,e,a)},onCancel:function(){}})},matchBaiduAddress:function(){var t=this;this.spinning=!0,this.$sacpApis.matchBaiduAddressByHand().then(function(e){e.success?t.queryMerchantInitData():t.$message.error(e.resultInfo.statusText)}).catch(function(e){return t.$message.error(e)}).finally(function(){t.spinning=!1})},matchCompanyChange:function(){this.changeTable=!this.changeTable,this.changeTable?this.queryParams.sqlId="DG40004":this.queryParams.sqlId="DG40003",this.queryMerchantInitData()},openSearchDialog:function(){this.searchDialogVisible=!0},onCellChange:function(t,e,a){var n=this,i=[].concat(l()(this.dataList)).find(function(e){return e.key===t.key});if(i[e]==a)return this.$message.warning("当前数据未改动!");if(i[e]=a,this.spinning=!0,i){var s={param1:i.autoId,param2:a};this.$sacpApis.matchCompanyByUscc(s).then(function(e){var s=[].concat(l()(n.dataListCopy)).find(function(e){return e.key===t.key});if(e.success){s.customerUscc=a,["customerName","officeAddress","registeredAddress","registerAmount","baiduAddress","areaPlace","industrycategory","industryclassification"].forEach(function(t){s[t]="",i[t]=""}),n.$message.success("统一信用代码修改成功")}else t.customerUscc=s.customerUscc,n.$message.error(e.resultInfo.statusText)}).catch(function(t){return n.$message.error(t)}).finally(function(){n.spinning=!1})}},onSubmitSeachItem:function(){this.queryParams.start=0,this.queryParams.limit=10,this.queryParams.isChange=!0,p.a.set(this.queryParams,"param3",this.searchForm.merchantName),p.a.set(this.queryParams,"param4",this.searchForm.isSampling),p.a.set(this.queryParams,"param5",this.searchForm.customerUscc),this.queryMerchantInitData()},cancelSearch:function(){var t=this;this.searchDialogVisible=!1,c()(this.searchForm).forEach(function(e){return t.searchForm[e]=null})},queryMatchCompanyList:function(){var t=this;this.spinning=!0,this.$sacpApis.matchCompanyList().then(function(e){e.success?t.queryMerchantInitData():t.$message.error(e.resultInfo.statusText),t.spinning=!1}).catch(function(e){return t.$message.error(e)}).finally(function(){t.isChange=!1})},unmatchedBusinessData:function(){this.queryParams.param9=1,this.queryMerchantInitData()},queryMerchantInitData:function(){var t=this;this.queryParams.lockCustomerId=f.a.findUserInfo().curCustomerId,this.queryParams.lockProjectId=f.a.findUserInfo().curProjectId,this.queryParams.lockYyyy=f.a.findUserInfo().curAccYear,this.spinning=!0,this.dataList.length=0,this.queryParams.param10=this.checked?"":1,this.$sacpApis.findMerchantList(this.queryParams).then(function(e){e.success?(e.data&&e.data.length&&e.data.forEach(function(t,e){p.a.set(t,"key",e)}),t.dataList=e.data,t.dataListCopy=JSON.parse(i()(e.data)),t.pagination.defaultPageSize=e.start,t.pagination.total=e.totalCount,t.totalCount=e.totalCount,t.queryParams.isChange&&(t.pagination.current=1),t.queryMatchNum()):t.$message.error(e.resultInfo.statusText)}).catch(function(e){return t.$message.error(e)}).finally(function(){t.searchDialogVisible&&t.cancelSearch(),t.spinning=!1})},queryMatchNum:function(){var t=this;this.$sacpApis.matchedNum().then(function(e){if(e.success){var a=e.data[0];t.matchCount=a.matchCount,t.samplingCount=a.samplingCount,t.samplingMatchCount=a.samplingMatchCount,t.totalCount=a.totalCount}else t.$message.error(e.resultInfo.statusText)}).catch(function(e){return t.$message.error(e)}).finally(function(){t.spinning=!1})},manualRefesh:function(){this.queryParams.param9="",this.queryMerchantInitData()},onChange:function(){this.queryMerchantInitData()}},created:function(){this.queryMerchantInitData()}},I={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"matchBusinessData"},[a("a-spin",{attrs:{tip:"加载中...",spinning:t.spinning,size:"large"}},[a("div",{staticStyle:{"text-align":"center","margin-bottom":"8px"}},[a("a-icon",{staticStyle:{"margin-right":"8px"},attrs:{type:"tag"}}),t._v("\n            "+t._s(t.totalCount+"条数据")+"\n            "),a("span",{staticStyle:{color:"#409eff","margin-left":"10px",cursor:"pointer"},on:{click:t.manualRefesh}},[a("a-icon",{staticStyle:{"margin-right":"5px"},attrs:{type:"sync"}}),t._v("刷新\n            ")],1),t._v("\n            "+t._s("  (已关联工商数据"+t.matchCount+"条)")+" |\n            "+t._s("含抽凭数据"+t.samplingCount+"条")+t._s("  (已关联工商数据"+t.samplingMatchCount+"条)")+"\n            "),a("a-button",{attrs:{type:"primary"},on:{click:t.unmatchedBusinessData}},[t._v("\n                未匹配工商数据\n            ")]),t._v(" "),a("a-checkbox",{staticStyle:{"margin-left":"10px"},on:{change:t.onChange},model:{value:t.checked,callback:function(e){t.checked=e},expression:"checked"}},[t._v("显示")])],1),t._v(" "),a("a-table",{attrs:{columns:t.changeTable?t.columns2:t.columns,"data-source":t.dataList,bordered:"",rowKey:function(t){return t.key},pagination:t.pagination,scroll:{y:"calc(100% - 55px)",x:"scollXWidth"},components:t.components},scopedSlots:t._u([{key:"customerUscc",fn:function(e,n){return t.changeTable?void 0:[a("editable-cell",{attrs:{text:e},on:{change:function(e){return t.onCellChange(n,"customerUscc",e)}}}),t._v(" "),n.customerUscc?a("a-button",{attrs:{type:"primary",shape:"circle",icon:"sync",size:"small",title:"更新工商数据"},on:{click:function(e){return t.updataBusiness(n.customerUscc)}}}):t._e(),t._v(" "),n.customerUscc?a("a-button",{attrs:{type:"primary",shape:"circle",icon:"delete",size:"small",title:"一键清除"},on:{click:function(e){return t.clearUscc(n,"customerUscc","")}}}):t._e()]}}],null,!0)})],1),t._v(" "),a("a-modal",{attrs:{title:"查询","ok-text":"确认","cancel-text":"取消"},on:{ok:t.onSubmitSeachItem,cancel:t.cancelSearch},model:{value:t.searchDialogVisible,callback:function(e){t.searchDialogVisible=e},expression:"searchDialogVisible"}},[a("a-form-model",{attrs:{model:t.searchForm,"label-col":t.labelCol,"wrapper-col":t.wrapperCol}},[a("a-form-model-item",{attrs:{label:"客商名称"}},[a("a-input",{attrs:{placeholder:"请输入"},model:{value:t.searchForm.merchantName,callback:function(e){t.$set(t.searchForm,"merchantName",e)},expression:"searchForm.merchantName"}})],1),t._v(" "),a("a-form-model-item",{attrs:{label:"含抽凭数据"}},[a("a-select",{attrs:{placeholder:"请选择"},model:{value:t.searchForm.isSampling,callback:function(e){t.$set(t.searchForm,"isSampling",e)},expression:"searchForm.isSampling"}},t._l(t.isSamplingList,function(e){return a("a-select-option",{key:e.key,attrs:{value:e.value}},[t._v("\n                        "+t._s(e.label)+"\n                    ")])}),1)],1),t._v(" "),a("a-form-model-item",{attrs:{label:"统一信用代码"}},[a("a-input",{attrs:{placeholder:"请输入"},model:{value:t.searchForm.customerUscc,callback:function(e){t.$set(t.searchForm,"customerUscc",e)},expression:"searchForm.customerUscc"}})],1)],1)],1)],1)},staticRenderFns:[]};var C=a("VU/8")(v,I,!1,function(t){a("Tnc4")},"data-v-02e72928",null);e.default=C.exports}});
//# sourceMappingURL=12.b803a68cfd0ab03c009a.js.map