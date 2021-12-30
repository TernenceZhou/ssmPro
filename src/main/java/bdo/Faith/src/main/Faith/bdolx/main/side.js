function MainSider() {
	function init() {
		// 关注的伙伴
		var loadMyFocus = function(nowLength){
			var $sdiv = $('#tabs-focus');
			var $block = $sdiv.find('div.block');
			$block.addClass('block-opt-refresh');
			var $ul = $sdiv.find('ul');
			var searchVal = $('#tabs-focus-search').val().trim();
			$('#tabs-focus-search').val(searchVal);
			$.ajax({
				type : 'post',
				url : 'cpBase/Usual.getFocus.json',
				data : {
					menuId : window.sys_menuId,
					param2 : $('#tabs-focus-search').val(),
					start : 0,
					limit : nowLength
				},
				dataType : 'json',
				success : function(result) {
					$ul.html('');
					if(result.data.length >0){
						$.each(result.data, function(index, info) {
							var $this = this;
							var li = $('<li></li>').attr('id',$sdiv.attr('id')+'-block-ul-li-'+$this.focusLoginId);
								li.css({'position': 'relative'});
							var a = $('<a></a>').attr('href','javascript:void(0);');
								a.click(function(e){
									getPersonalInfo($this.focusLoginId);
								});
							var img = $('<img />')
									.attr('class','img-avatar')
									.attr('alt','头像');
									if($this.userPhoto != null && $this.userPhoto != "null"){
										img.attr('src','img/adphoto/' + $this.userPhoto)
											.error(function(){$(this).attr('src','assets/img/avatars/avatar10.jpg')});
									}else{
										img.attr('src','assets/img/avatars/avatar10.jpg');
									}
							var span = $('<span></span>');
								span.html($this.focusName);
							var div = $('<div></div>').addClass('font-w400 text-muted');
							var small = $('<small></small>');
								small.html($this.departName);
							$ul.append(li);
							li.append(a);
							a.append(img).append(span).append(div);
							div.append(small);
						});
						if(result.totalCount > nowLength){
							var li = $('<li style="padding-left:0,margin-top:20px;" class="text-center"></li>');
							var aclick = $('<a style="cursor:pointer;" data-value="'+nowLength+'">点击查看更多~</a>')
							aclick.click(function(e){
								loadMyFocus(parseInt($(e.target).attr('data-value')) + 10);
							});
							li.append(aclick);
							$ul.append(li);
						}
					}else{
						var li = $('<li class="text-center"></li>');
							li.css({ 'padding-left': '0', 'margin-top': '20px'});
							li.html('没有数据啦~');
						$ul.append(li);
					}
					$block.removeClass('block-opt-refresh');
				},
				error : function(){
					$block.removeClass('block-opt-refresh');
					sweetAlert("网络错误", "请联系管理员","error");
				}
			});
		};
		
		// 关注的伙伴-tab页签
		$('#sideToggleBtn,#tabs-focus-li').click(function(e){
			$('#tabs-focus-search').val('');
			loadMyFocus(10);
		});
		
		// 关注的伙伴-搜索框
		$('#tabs-focus-search').keyup(function(e){
			if(e.keyCode == 13){ 
				loadMyFocus(10);
			}
		});
		
		// 关注的伙伴-搜索图标
		$('#tabs-focus-search-i').click(function(e){
			loadMyFocus(10);
		});
		
		var loadSacpce = function(nowLength){
			var $sdiv = $('#tabs-sacpce');
			var $block = $sdiv.find('div.block');
			$block.addClass('block-opt-refresh');
			var $ul = $sdiv.find('ul');
			var searchVal = $('#tabs-sacpce-search').val().trim();
			$('#tabs-sacpce-search').val(searchVal);
			$.ajax({
				type : 'post',
				url : 'ot/OteGeneral.query.json',
				data : {
					menuId : window.sys_menuId,
					sqlId : 'UC000001',
					param1 : $('#tabs-sacpce-search').val(),
					start : 0,
					limit : nowLength
				},
				dataType : 'json',
				success : function(result) {
					$ul.html('');
					if(result.data.length >0){
						$.each(result.data, function(index, info) {
							var $this = this;
							var li = $('<li></li>').attr('id',$sdiv.attr('id')+'-block-ul-li-'+$this.focusLoginId);
								li.css({'position': 'relative'});
							var a = $('<a></a>').attr('href','javascript:void(0);');
								a.click(function(e){
									getPersonalInfo($this.focusLoginId);
								});
							var img = $('<img />')
									.attr('class','img-avatar')
									.attr('alt','头像');
									if($this.userPhoto != null && $this.userPhoto != "null"){
										img.attr('src','img/adphoto/' + $this.userPhoto)
											.error(function(){$(this).attr('src','assets/img/avatars/avatar10.jpg')});
									}else{
										img.attr('src','assets/img/avatars/avatar10.jpg');
									}
							var span = $('<span></span>');
								span.html($this.focusName);
							var div = $('<div></div>').addClass('font-w400 text-muted');
							var small = $('<small></small>');
								small.html($this.departName);
							$ul.append(li);
							li.append(a);
							a.append(img).append(span).append(div);
							div.append(small);
						});
						if(result.totalCount > nowLength){
							var li = $('<li style="padding-left:0,margin-top:20px;" class="text-center"></li>');
							var aclick = $('<a style="cursor:pointer;" data-value="'+nowLength+'">点击查看更多~</a>')
							aclick.click(function(e){
								loadSacpce(parseInt($(e.target).attr('data-value')) + 10);
							});
							li.append(aclick);
							$ul.append(li);
						}
					}else{
						var li = $('<li class="text-center"></li>');
							li.css({ 'padding-left': '0', 'margin-top': '20px'});
							li.html('没有数据啦~');
						$ul.append(li);
					}
					$block.removeClass('block-opt-refresh');
				},
				error : function(){
					$block.removeClass('block-opt-refresh');
					sweetAlert("网络错误", "请联系管理员","error");
				}
			});
		};
		
		// tab页签
		$('#tabs-sacpce-li').click(function(e){
			$('#tabs-sacpce-search').val('');
			loadSacpce(10);
		});
		
		// 搜索框
		$('#tabs-sacpce-search').keyup(function(e){
			if(e.keyCode == 13){ 
				loadSacpce(10);
			}
		});
		
		// 搜索图标
		$('#tabs-sacpce-search-i').click(function(e){
			loadSacpce(10);
		});
	}

	return {
		init
	};
}

$(function() {
	new MainSider().init();
});