webpackJsonp([9],{"1zey":function(t,e){},EV7D:function(t,e){},LBze:function(t,e,n){(function(t){"use strict";var e={inject:["manager"],props:{index:{type:Number,required:!0},collection:{type:[String,Number],default:"default"},disabled:{type:Boolean,default:!1}},mounted:function(){var t=this.$props,e=t.collection,n=t.disabled,i=t.index;n||this.setDraggable(e,i)},watch:{index:function(t){this.$el&&this.$el.sortableInfo&&(this.$el.sortableInfo.index=t)},disabled:function(t){t?this.removeDraggable(this.collection):this.setDraggable(this.collection,this.index)},collection:function(t,e){this.removeDraggable(e),this.setDraggable(t,this.index)}},beforeDestroy:function(){var t=this.collection;this.disabled||this.removeDraggable(t)},methods:{setDraggable:function(t,e){var n=this.$el;n.sortableInfo={index:e,collection:t,manager:this.manager},this.ref={node:n},this.manager.add(t,this.ref)},removeDraggable:function(t){this.manager.remove(t,this.ref)}}},n=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],i=!0,r=!1,a=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){r=!0,a=t}finally{try{!i&&s.return&&s.return()}finally{if(r)throw a}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)},o=function(){function t(){n(this,t),this.refs={}}return i(t,[{key:"add",value:function(t,e){this.refs[t]||(this.refs[t]=[]),this.refs[t].push(e)}},{key:"remove",value:function(t,e){var n=this.getIndex(t,e);-1!==n&&this.refs[t].splice(n,1)}},{key:"isActive",value:function(){return this.active}},{key:"getActive",value:function(){var t=this;return this.refs[this.active.collection].find(function(e){return e.node.sortableInfo.index==t.active.index})}},{key:"getIndex",value:function(t,e){return this.refs[t].indexOf(e)}},{key:"getOrderedRefs",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.active.collection;return this.refs[t].sort(function(t,e){return t.node.sortableInfo.index-e.node.sortableInfo.index})}}]),t}();function s(t,e,n){var i=t.slice(0);if(n>=i.length)for(var r=n-i.length;1+r--;)i.push(void 0);return i.splice(n,0,i.splice(e,1)[0]),i}var l={start:["touchstart","mousedown"],move:["touchmove","mousemove"],end:["touchend","touchcancel","mouseup"]},h=function(){if("undefined"==typeof window||"undefined"==typeof document)return"";var t=window.getComputedStyle(document.documentElement,"")||["-moz-hidden-iframe"],e=(Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/)||""===t.OLink&&["","o"])[1];switch(e){case"ms":return"ms";default:return e&&e.length?e[0].toUpperCase()+e.substr(1):""}}();function d(t,e){for(;t;){if(e(t))return t;t=t.parentNode}}function c(t,e,n){return n<t?t:n>e?e:n}function u(t){return"px"===t.substr(-2)?parseFloat(t):0}var f={data:function(){return{sorting:!1,sortingIndex:null,manager:new o,events:{start:this.handleStart,move:this.handleMove,end:this.handleEnd}}},props:{value:{type:Array,required:!0},axis:{type:String,default:"y"},distance:{type:Number,default:0},pressDelay:{type:Number,default:0},pressThreshold:{type:Number,default:5},useDragHandle:{type:Boolean,default:!1},useWindowAsScrollContainer:{type:Boolean,default:!1},hideSortableGhost:{type:Boolean,default:!0},lockToContainerEdges:{type:Boolean,default:!1},lockOffset:{type:[String,Number,Array],default:"50%"},transitionDuration:{type:Number,default:300},appendTo:{type:String,default:"body"},draggedSettlingDuration:{type:Number,default:null},lockAxis:String,helperClass:String,contentWindow:Object,shouldCancelStart:{type:Function,default:function(t){return-1!==["input","textarea","select","option","button"].indexOf(t.target.tagName.toLowerCase())}},getHelperDimensions:{type:Function,default:function(t){var e=t.node;return{width:e.offsetWidth,height:e.offsetHeight}}}},provide:function(){return{manager:this.manager}},mounted:function(){var t=this;this.container=this.$el,this.document=this.container.ownerDocument||document,this._window=this.contentWindow||window,this.scrollContainer=this.useWindowAsScrollContainer?this.document.body:this.container;var e=function(e){t.events.hasOwnProperty(e)&&l[e].forEach(function(n){return t.container.addEventListener(n,t.events[e],!1)})};for(var n in this.events)e(n)},beforeDestroy:function(){var t=this,e=function(e){t.events.hasOwnProperty(e)&&l[e].forEach(function(n){return t.container.removeEventListener(n,t.events[e])})};for(var n in this.events)e(n)},methods:{handleStart:function(t){var e=this,n=this.$props,i=n.distance,r=n.shouldCancelStart;if(2===t.button||r(t))return!1;this._touched=!0,this._pos={x:t.pageX,y:t.pageY};var a=d(t.target,function(t){return null!=t.sortableInfo});if(a&&a.sortableInfo&&this.nodeIsChild(a)&&!this.sorting){var o=this.$props.useDragHandle,s=a.sortableInfo,l=s.index,h=s.collection;if(o&&!d(t.target,function(t){return null!=t.sortableHandle}))return;this.manager.active={index:l,collection:h},"a"===t.target.tagName.toLowerCase()&&t.preventDefault(),i||(0===this.$props.pressDelay?this.handlePress(t):this.pressTimer=setTimeout(function(){return e.handlePress(t)},this.$props.pressDelay))}},nodeIsChild:function(t){return t.sortableInfo.manager===this.manager},handleMove:function(t){var e=this.$props,n=e.distance,i=e.pressThreshold;if(!this.sorting&&this._touched){this._delta={x:this._pos.x-t.pageX,y:this._pos.y-t.pageY};var r=Math.abs(this._delta.x)+Math.abs(this._delta.y);n||i&&!(i&&r>=i)?n&&r>=n&&this.manager.isActive()&&this.handlePress(t):(clearTimeout(this.cancelTimer),this.cancelTimer=setTimeout(this.cancel,0))}},handleEnd:function(){var t=this.$props.distance;this._touched=!1,t||this.cancel()},cancel:function(){this.sorting||(clearTimeout(this.pressTimer),this.manager.active=null)},handlePress:function(t){var e,n,i=this,r=this.manager.getActive();if(r){var o=this.$props,s=o.axis,h=o.getHelperDimensions,d=o.helperClass,c=o.hideSortableGhost,f=o.useWindowAsScrollContainer,p=o.appendTo,g=r.node,v=r.collection,m=g.sortableInfo.index,b=(e=g,{top:u((n=window.getComputedStyle(e)).marginTop),right:u(n.marginRight),bottom:u(n.marginBottom),left:u(n.marginLeft)}),x=this.container.getBoundingClientRect(),y=h({index:m,node:g,collection:v});this.node=g,this.margin=b,this.width=y.width,this.height=y.height,this.marginOffset={x:this.margin.left+this.margin.right,y:Math.max(this.margin.top,this.margin.bottom)},this.boundingClientRect=g.getBoundingClientRect(),this.containerBoundingRect=x,this.index=m,this.newIndex=m,this._axis={x:s.indexOf("x")>=0,y:s.indexOf("y")>=0},this.offsetEdge=this.getEdgeOffset(g),this.initialOffset=this.getOffset(t),this.initialScroll={top:this.scrollContainer.scrollTop,left:this.scrollContainer.scrollLeft},this.initialWindowScroll={top:window.pageYOffset,left:window.pageXOffset};var w,D=g.querySelectorAll("input, textarea, select"),k=g.cloneNode(!0);if([].concat(a(k.querySelectorAll("input, textarea, select"))).forEach(function(t,e){"file"!==t.type&&D[e]&&(t.value=D[e].value)}),this.helper=this.document.querySelector(p).appendChild(k),this.helper.style.position="fixed",this.helper.style.top=this.boundingClientRect.top-b.top+"px",this.helper.style.left=this.boundingClientRect.left-b.left+"px",this.helper.style.width=this.width+"px",this.helper.style.height=this.height+"px",this.helper.style.boxSizing="border-box",this.helper.style.pointerEvents="none",c&&(this.sortableGhost=g,g.style.visibility="hidden",g.style.opacity=0),this.translate={},this.minTranslate={},this.maxTranslate={},this._axis.x&&(this.minTranslate.x=(f?0:x.left)-this.boundingClientRect.left-this.width/2,this.maxTranslate.x=(f?this._window.innerWidth:x.left+x.width)-this.boundingClientRect.left-this.width/2),this._axis.y&&(this.minTranslate.y=(f?0:x.top)-this.boundingClientRect.top-this.height/2,this.maxTranslate.y=(f?this._window.innerHeight:x.top+x.height)-this.boundingClientRect.top-this.height/2),d)(w=this.helper.classList).add.apply(w,a(d.split(" ")));this.listenerNode=t.touches?g:this._window,l.move.forEach(function(t){return i.listenerNode.addEventListener(t,i.handleSortMove,!1)}),l.end.forEach(function(t){return i.listenerNode.addEventListener(t,i.handleSortEnd,!1)}),this.sorting=!0,this.sortingIndex=m,this.$emit("sort-start",{event:t,node:g,index:m,collection:v})}},handleSortMove:function(t){t.preventDefault(),this.updatePosition(t),this.animateNodes(),this.autoscroll(),this.$emit("sort-move",{event:t})},handleSortEnd:function(t){var e=this,n=this.manager.active.collection;this.listenerNode&&(l.move.forEach(function(t){return e.listenerNode.removeEventListener(t,e.handleSortMove)}),l.end.forEach(function(t){return e.listenerNode.removeEventListener(t,e.handleSortEnd)}));var i=this.manager.refs[n],r=function(){e.helper.parentNode.removeChild(e.helper),e.hideSortableGhost&&e.sortableGhost&&(e.sortableGhost.style.visibility="",e.sortableGhost.style.opacity="");for(var r=0,a=i.length;r<a;r++){var o=i[r],l=o.node;o.edgeOffset=null,l.style[h+"Transform"]="",l.style[h+"TransitionDuration"]=""}clearInterval(e.autoscrollInterval),e.autoscrollInterval=null,e.manager.active=null,e.sorting=!1,e.sortingIndex=null,e.$emit("sort-end",{event:t,oldIndex:e.index,newIndex:e.newIndex,collection:n}),e.$emit("input",s(e.value,e.index,e.newIndex)),e._touched=!1};this.$props.transitionDuration||this.$props.draggedSettlingDuration?this.transitionHelperIntoPlace(i).then(function(){return r()}):r()},transitionHelperIntoPlace:function(t){var e=this;if(0===this.$props.draggedSettlingDuration)return Promise.resolve();var n=this.scrollContainer.scrollLeft-this.initialScroll.left,i=this.scrollContainer.scrollTop-this.initialScroll.top,r=t[this.index].node,a=t[this.newIndex].node,o=-n;this.translate&&this.translate.x>0?o+=a.offsetLeft+a.offsetWidth-(r.offsetLeft+r.offsetWidth):o+=a.offsetLeft-r.offsetLeft;var s=-i;this.translate&&this.translate.y>0?s+=a.offsetTop+a.offsetHeight-(r.offsetTop+r.offsetHeight):s+=a.offsetTop-r.offsetTop;var l=null!==this.$props.draggedSettlingDuration?this.$props.draggedSettlingDuration:this.$props.transitionDuration;return this.helper.style[h+"Transform"]="translate3d("+o+"px,"+s+"px, 0)",this.helper.style[h+"TransitionDuration"]=l+"ms",new Promise(function(t){var n=function(n){n&&"transform"!==n.propertyName||(clearTimeout(i),e.helper.style[h+"Transform"]="",e.helper.style[h+"TransitionDuration"]="",t())},i=setTimeout(n,l+10);e.helper.addEventListener("transitionend",n,!1)})},getEdgeOffset:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{top:0,left:0};if(t){var n={top:e.top+t.offsetTop,left:e.left+t.offsetLeft};return t.parentNode!==this.container?this.getEdgeOffset(t.parentNode,n):n}},getOffset:function(t){return{x:t.touches?t.touches[0].pageX:t.pageX,y:t.touches?t.touches[0].pageY:t.pageY}},getLockPixelOffsets:function(){var t=this.$props.lockOffset;if(Array.isArray(this.lockOffset)||(t=[t,t]),2!==t.length)throw new Error("lockOffset prop of SortableContainer should be a single value or an array of exactly two values. Given "+t);var e=r(t,2),n=e[0],i=e[1];return[this.getLockPixelOffset(n),this.getLockPixelOffset(i)]},getLockPixelOffset:function(t){var e=t,n=t,i="px";if("string"==typeof t){var r=/^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(t);if(null===r)throw new Error('lockOffset value should be a number or a string of a number followed by "px" or "%". Given '+t);e=n=parseFloat(t),i=r[1]}if(!isFinite(e)||!isFinite(n))throw new Error("lockOffset value should be a finite. Given "+t);return"%"===i&&(e=e*this.width/100,n=n*this.height/100),{x:e,y:n}},updatePosition:function(t){var e=this.$props,n=e.lockAxis,i=e.lockToContainerEdges,a=this.getOffset(t),o={x:a.x-this.initialOffset.x,y:a.y-this.initialOffset.y};if(o.y-=window.pageYOffset-this.initialWindowScroll.top,o.x-=window.pageXOffset-this.initialWindowScroll.left,this.translate=o,i){var s=this.getLockPixelOffsets(),l=r(s,2),d=l[0],u=l[1],f={x:this.width/2-d.x,y:this.height/2-d.y},p={x:this.width/2-u.x,y:this.height/2-u.y};o.x=c(this.minTranslate.x+f.x,this.maxTranslate.x-p.x,o.x),o.y=c(this.minTranslate.y+f.y,this.maxTranslate.y-p.y,o.y)}"x"===n?o.y=0:"y"===n&&(o.x=0),this.helper.style[h+"Transform"]="translate3d("+o.x+"px,"+o.y+"px, 0)"},animateNodes:function(){var t=this.$props,e=t.transitionDuration,n=t.hideSortableGhost,i=this.manager.getOrderedRefs(),r=this.scrollContainer.scrollLeft-this.initialScroll.left,a=this.scrollContainer.scrollTop-this.initialScroll.top,o=this.offsetEdge.left+this.translate.x+r,s=this.offsetEdge.top+this.translate.y+a,l=window.pageYOffset-this.initialWindowScroll.top,d=window.pageXOffset-this.initialWindowScroll.left;this.newIndex=null;for(var c=0,u=i.length;c<u;c++){var f=i[c].node,p=f.sortableInfo.index,g=f.offsetWidth,v=f.offsetHeight,m={width:this.width>g?g/2:this.width/2,height:this.height>v?v/2:this.height/2},b={x:0,y:0},x=i[c].edgeOffset;x||(i[c].edgeOffset=x=this.getEdgeOffset(f));var y=c<i.length-1&&i[c+1],w=c>0&&i[c-1];y&&!y.edgeOffset&&(y.edgeOffset=this.getEdgeOffset(y.node)),p!==this.index?(e&&(f.style[h+"TransitionDuration"]=e+"ms"),this._axis.x?this._axis.y?p<this.index&&(o+d-m.width<=x.left&&s+l<=x.top+m.height||s+l+m.height<=x.top)?(b.x=this.width+this.marginOffset.x,x.left+b.x>this.containerBoundingRect.width-m.width&&(b.x=y.edgeOffset.left-x.left,b.y=y.edgeOffset.top-x.top),null===this.newIndex&&(this.newIndex=p)):p>this.index&&(o+d+m.width>=x.left&&s+l+m.height>=x.top||s+l+m.height>=x.top+v)&&(b.x=-(this.width+this.marginOffset.x),x.left+b.x<this.containerBoundingRect.left+m.width&&(b.x=w.edgeOffset.left-x.left,b.y=w.edgeOffset.top-x.top),this.newIndex=p):p>this.index&&o+d+m.width>=x.left?(b.x=-(this.width+this.marginOffset.x),this.newIndex=p):p<this.index&&o+d<=x.left+m.width&&(b.x=this.width+this.marginOffset.x,null==this.newIndex&&(this.newIndex=p)):this._axis.y&&(p>this.index&&s+l+m.height>=x.top?(b.y=-(this.height+this.marginOffset.y),this.newIndex=p):p<this.index&&s+l<=x.top+m.height&&(b.y=this.height+this.marginOffset.y,null==this.newIndex&&(this.newIndex=p))),f.style[h+"Transform"]="translate3d("+b.x+"px,"+b.y+"px,0)"):n&&(this.sortableGhost=f,f.style.visibility="hidden",f.style.opacity=0)}null==this.newIndex&&(this.newIndex=this.index)},autoscroll:function(){var t=this,e=this.translate,n={x:0,y:0},i={x:1,y:1},r=10,a=10;e.y>=this.maxTranslate.y-this.height/2?(n.y=1,i.y=a*Math.abs((this.maxTranslate.y-this.height/2-e.y)/this.height)):e.x>=this.maxTranslate.x-this.width/2?(n.x=1,i.x=r*Math.abs((this.maxTranslate.x-this.width/2-e.x)/this.width)):e.y<=this.minTranslate.y+this.height/2?(n.y=-1,i.y=a*Math.abs((e.y-this.height/2-this.minTranslate.y)/this.height)):e.x<=this.minTranslate.x+this.width/2&&(n.x=-1,i.x=r*Math.abs((e.x-this.width/2-this.minTranslate.x)/this.width)),this.autoscrollInterval&&(clearInterval(this.autoscrollInterval),this.autoscrollInterval=null,this.isAutoScrolling=!1),0===n.x&&0===n.y||(this.autoscrollInterval=setInterval(function(){t.isAutoScrolling=!0;var e=1*i.x*n.x,r=1*i.y*n.y;t.scrollContainer.scrollTop+=r,t.scrollContainer.scrollLeft+=e,t.translate.x+=e,t.translate.y+=r,t.animateNodes()},5))}}},p={name:"slick-list",mixins:[f],render:function(t){return t("div",this.$slots.default)}},g={name:"slick-item",mixins:[e],render:function(t){return t("div",this.$slots.default)}};t.ElementMixin=e,t.ContainerMixin=f,t.HandleDirective={bind:function(t){t.sortableHandle=!0}},t.SlickList=p,t.SlickItem=g,t.arrayMove=s,Object.defineProperty(t,"__esModule",{value:!0})})(e)},gET8:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("Gu7T"),r=n.n(i),a=n("fZjL"),o=n.n(a),s=n("woOf"),l=n.n(s),h=n("LBze"),d={mixins:[h.ContainerMixin],props:{tag:{type:String,default:"div"},direction:{type:String,default:"vertical"}},render:function(t){return t(this.tag,{props:l()({},this.$attrs,this.$options.propsData),on:this.$listeners},this.$slots.default)}},c={mixins:[h.ElementMixin],directives:{handle:h.HandleDirective},props:{tag:{type:String,default:"div"}},render:function(t){return t(this.tag,{props:l()({},this.$attrs,this.$options.propsData),on:this.$listeners},this.$slots.default)}},u=n("pFYg"),f=n.n(u),p=n("mvHQ"),g=n.n(p),v=function(t,e,n){var i={options:{enableDrop:!1,data:function(){return null}},eventHandlers:{onDragStart:function(t,e,n){},onDragEnd:function(t,e,n){},onDragEnter:function(t,e,n){},onDragLeave:function(t,e,n){},onDrag:function(t,e,n){},onDrop:function(t,e,n){}}};return e&&(i.options=l()({},i.options,e)),n&&(i.eventHandlers=l()({},i.eventHandlers,n)),i},m={components:{DragContainer:d,DragItem:c},props:{value:Array,border:Boolean,width:{type:String,default:"auto"},height:{type:String,default:"auto"},rowHeight:{type:String,default:"32px"},rowLineHeight:{type:String,default:"30px"},colMinWidth:{type:String,default:"64px"}},data:function(){return{tableBlocks:[],activeBlockIndex:null}},computed:{tableBlockMaxRows:function(){if(!this.tableBlocks||0===this.tableBlocks.length)return 0;var t=[];return this.tableBlocks.forEach(function(e){Array.isArray(e.data)&&t.push(e.data.length)}),Math.max.apply(Math,t)},tableBlockHeaderMaxRows:function(){var t=this;if(!this.tableBlocks||0===this.tableBlocks.length)return 0;var e=[];return this.tableBlocks.forEach(function(n){Array.isArray(n.columns)&&e.push(t.clacTreeStructLevels(n.columns,0))}),Math.max.apply(Math,e)}},watch:{value:{handler:function(t){this.tableBlocks=t||[]},immediate:!0,deep:!0}},methods:{clacTreeStructLevels:function(t,e){var n=this;if(!Array.isArray(t))return e;var i=[];return t.forEach(function(t){Array.isArray(t.children)?i.push(n.clacTreeStructLevels(t.children,e+1)):i.push(e+1)}),Math.max.apply(Math,i)},getPropRenderColumns:function(t){var e=[];return this.calcRenderedEndNodeColumns(e,t),e},calcRenderedEndNodeColumns:function(t,e){var n=this;Array.isArray(e)&&e.forEach(function(e){Array.isArray(e.children)&&0!==e.children.length?n.calcRenderedEndNodeColumns(t,e.children):t.push(e)})},calcColumnSpanInfo:function(t,e){if(!t)return t;if(Array.isArray(t.children)){for(var n=0,i=0;i<t.children.length;i++)this.calcColumnSpanInfo(t.children[i],e+1),n+=t.children[i].colspan;t.colspan=t.colspan||n||1,t.rowspan=t.rowspan||1}else t.colspan=t.colspan||1,t.rowspan=t.rowspan||this.tableBlockHeaderMaxRows-e||1},parseColumnRowData:function(t,e,n){if(!e||!Array.isArray(e))return[];for(var i=0;i<e.length;i++)t.hasOwnProperty(n.toString())?t[n.toString()].push(e[i]):t[n.toString()]=[e[i]],Array.isArray(e[i].children)&&this.parseColumnRowData(t,e[i].children,n+1)},getHeaderColumnRenderData:function(t){if(!t||!Array.isArray(t))return[];for(var e=t,n={},i=0;i<e.length;i++)this.calcColumnSpanInfo(e[i],0);return this.parseColumnRowData(n,e,0),o()(n).map(function(t){return Number(t)}).sort().map(function(t){return n[t.toString()]})},calcLeftRows:function(t){return t&&Array.isArray(t.data)?this.tableBlockMaxRows-t.data.length:0},calcLeftHeaderRows:function(t){if(!Array.isArray(t))return 0;var e=this.getHeaderColumnRenderData(t);return this.tableBlockHeaderMaxRows-e.length},onItemSortEnd:function(t){var e=t.event,n=t.newIndex,i=t.oldIndex,r=t.collection;console.log("onItemSortEnd",e,n,i,r),this.$emit("input",this.tableBlocks)},onItemSortEnd2:function(t){var e=t.event,n=t.newIndex,i=t.oldIndex,r=t.collection;console.log("onItemSortEnd2",e,n,i,r),this.$emit("input",this.tableBlocks)},onDragover:function(t){t.target.dataset.dropflag&&(this.activeBlockIndex=Number(t.target.dataset.dropflag))},onDragenter:function(t){t.target.dataset.dropflag&&(this.activeBlockIndex=Number(t.target.dataset.dropflag))},onDragleave:function(t){t.target.dataset.dropflag||(this.activeBlockIndex=null)},onDrop:function(t){if(null!=this.activeBlockIndex){var e=t.dataTransfer.getData("data");e=e?JSON.parse(e):e,this.$emit("data-drop",this.activeBlockIndex,e)}this.activeBlockIndex=null}}},b={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bdo__gridmocktable",style:{width:t.width,height:t.height},on:{dragleave:t.onDragleave}},[n("drag-container",{class:["bdo__gridmocktable--container",{border:t.border}],attrs:{tag:"div",axis:"x","lock-axis":"x","helper-class":"bdo__gridmocktable--item-hover"},on:{"sort-end":t.onItemSortEnd,dragleave:t.onDragleave},model:{value:t.tableBlocks,callback:function(e){t.tableBlocks=e},expression:"tableBlocks"}},t._l(t.tableBlocks,function(e,i){return n("drag-item",{key:"block_"+i,class:["bdo__gridmocktable--block",{border:t.border,active:t.activeBlockIndex===i}],attrs:{tag:"div",index:i,item:e,value:e,"data-dropflag":i},on:{dragover:function(e){return e.preventDefault(),t.onDragover(e)},dragenter:t.onDragenter,dragleave:t.onDragleave,drop:function(e){return t.onDrop(e)}}},[n("table",{staticClass:"bdo__gridmocktable--block-table"},[n("thead",{staticClass:"block-header dragable",attrs:{title:"长按拖动区块"}},[t._l(t.getHeaderColumnRenderData(e.columns),function(e,r){return n("tr",{key:"header_row_"+r,class:["block-header-row",{border:t.border}]},t._l(e,function(e,a){return n("th",{key:r+"-"+a,class:["bdo__gridmocktable--header-column",{border:t.border}],style:{height:t.rowHeight,lineHeight:t.rowLineHeight,minWidth:t.colMinWidth},attrs:{colspan:e.colspan,rowspan:e.rowspan,"data-dropflag":i}},[t._t("col-header-"+e.prop,[t._v(t._s(e.title))])],2)}),0)}),t._v(" "),t._l(t.calcLeftHeaderRows(e.columns),function(e){return n("tr",{key:e,class:["block-header-row",{border:t.border}],attrs:{"data-dropflag":i}})})],2),t._v(" "),n("drag-container",{staticClass:"bdo__gridmocktable--block-wrapper",attrs:{tag:"tbody","lock-axis":"y","helper-class":"bdo__gridmocktable--item-hover"},on:{"sort-end":t.onItemSortEnd2},model:{value:e.data,callback:function(n){t.$set(e,"data",n)},expression:"blockItem.data"}},[t._l(e.data,function(r,a){return n("drag-item",{key:"row_"+a,class:["bdo__gridmocktable--row",{border:t.border}],attrs:{tag:"tr",index:a,item:r,value:r}},t._l(t.getPropRenderColumns(e.columns),function(e,o){return n("td",{key:a+"-"+o,staticClass:"bdo__gridmocktable--column",class:["bdo__gridmocktable--column",{border:t.border}],style:{height:t.rowHeight,lineHeight:t.rowLineHeight,minWidth:t.colMinWidth},attrs:{title:"长按拖动行","data-dropflag":i}},[t._t("col-"+e.prop,[t._v(t._s(r[e.prop]))])],2)}),0)}),t._v(" "),t._l(t.calcLeftRows(e),function(r){return n("tr",{key:r,class:["bdo__gridmocktable--row",{border:t.border}]},t._l(t.getPropRenderColumns(e.columns),function(e,r){return n("td",{key:r,class:["bdo__gridmocktable--column",{border:t.border}],style:{height:t.rowHeight,lineHeight:t.rowLineHeight},attrs:{"data-dropflag":i}})}),0)})],2)],1)])}),1)],1)},staticRenderFns:[]};var x={name:"App",directives:{datadrag:{inserted:function(t,e,n,i){var r=n.context,a=e.arg,o=Boolean(e.modifiers.drop);if(r)if("disable"!==a){t.setAttribute("draggable",!0);var s=null,l={};switch(f()(e.value)){case"string":case"number":case"boolean":s=e.value;break;case"function":o?l.onDrop=e.value:l.onDragEnd=e.value;break;case"object":s=e.value.data,l=e.value.handlers||{}}!function(t){var e=t.context,n=t.el,i=t.dragOption;if(n&&i){var r=i.eventHandlers,a=i.options;i.options.enableDrop?(n.ondragover=function(t){return t.preventDefault(),t.stopPropagation(),!1},n.ondrop=function(t){return r.onDrop.call(e,t,JSON.parse(t.dataTransfer.getData("data")),{gg:11}),t.stopPropagation(),!1}):(n.ondragstart=function(t){t.dataTransfer.setData("data",g()(a.data())),r.onDragStart.call(e,t,a.data(),{gg:11})},n.ondragend=function(t){r.onDragEnd.call(e,t,a.data(),{gg:11})},n.ondragenter=function(t){r.onDragEnter.call(e,t,a.data(),{gg:11})},n.ondragleave=function(t){r.onDragLeave.call(e,t,a.data(),{gg:11})},n.ondrag=function(t){r.onDrag.call(e,t,a.data(),{gg:11})},n.ondragover=null,n.ondrop=null)}}({context:r,el:t,dragOption:v(r,{enableDrop:o,data:function(){return null!=s?s:""}},l)})}else t.setAttribute("draggable",!1)}}},components:{GridMockTable:n("VU/8")(m,b,!1,function(t){n("EV7D")},null,null).exports},data:function(){return{tableData:[{columns:[{title:"区块1",children:[{title:"字段组1",children:[{title:"字段1-1",prop:"p1"},{title:"字段1-2",prop:"p2"}]},{title:"字段2",prop:"p3"}]}],data:[{p1:"a1-1",p2:"a1-2",p3:"a1-3"},{p1:"a2-1",p2:"a2-2",p3:"a2-3"},{p1:"a3-1",p2:"a3-2",p3:"a3-3"}]},{columns:[{title:"区块2",children:[{title:"字段1",prop:"p1"},{title:"字段2",prop:"p2"}]}],data:[{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"}]},{columns:[{title:"区块3",children:[{title:"字段1",prop:"p1"},{title:"字段2",prop:"p2"}]}],data:[{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"},{p1:"a",p2:"b"}]},{columns:[{title:"区块4",children:[{title:"字段1",prop:"p1"},{title:"字段组2",children:[{title:"字段2",prop:"p2"},{title:"字段3",prop:"p3"}]}]}],data:[{p1:"a",p2:"b",p3:"c"},{p1:"a",p2:"b",p3:"c"},{p1:"a",p2:"b",p3:"c"},{p1:"a",p2:"b",p3:"c"},{p1:"a",p2:"b",p3:"c"}]},{columns:[{title:"合计",prop:"p1"}],data:[{p1:10},{p1:34},{p1:14},{p1:2},{p1:19}]}],optionanData:[{label:"候选拖动数据1",p1:"OD1-1",p2:"OD1-2",p3:"OD1-3"},{label:"候选拖动数据2",p1:"OD2-1",p2:"OD2-2",p3:"OD2-3"},{label:"候选拖动数据3",p1:"OD3-1",p2:"OD3-2",p3:"OD3-3"},{label:"候选拖动数据4",p1:"OD4-1",p2:"OD4-2",p3:"OD4-3"},{label:"候选拖动数据5",p1:"OD5-1",p2:"OD5-2",p3:"OD5-3"},{label:"候选拖动数据6",p1:"OD6-1",p2:"OD6-2",p3:"OD6-3"},{label:"候选拖动数据7",p1:"OD7-1",p2:"OD7-2",p3:"OD7-3"},{label:"候选拖动数据8",p1:"OD8-1",p2:"OD8-2",p3:"OD8-3"},{label:"候选拖动数据9",p1:"OD9-1",p2:"OD9-2",p3:"OD9-3"},{label:"候选拖动数据10",p1:"OD10-1",p2:"OD10-2",p3:"OD10-3"}]}},methods:{onDataDrop:function(t,e){var n;console.log("onDataDrop",t,e);var i=this.optionanData.splice(e,1);(n=this.tableData[t].data).push.apply(n,r()(i)),console.log("data",this.tableData)}},mounted:function(){}},y={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h1",[t._v("GridMockTable Demo")]),t._v(" "),n("div",{staticStyle:{display:"flex"}},[n("grid-mock-table",{attrs:{border:""},on:{"data-drop":t.onDataDrop},model:{value:t.tableData,callback:function(e){t.tableData=e},expression:"tableData"}}),t._v(" "),n("ul",{staticStyle:{border:"1px solid #DCDFE6","margin-left":"24px",padding:"16px 0"}},t._l(t.optionanData,function(e,i){return n("li",{directives:[{name:"datadrag",rawName:"v-datadrag",value:i,expression:"index"}],key:i,staticClass:"drag-item"},[t._v(t._s(e.label))])}),0)],1)])},staticRenderFns:[]};var w=n("VU/8")(x,y,!1,function(t){n("1zey")},null,null);e.default=w.exports}});