window.bdoMenu = window.bdoMenu || {};
$(document).ready(function() {
	if (window.bdoMenu.isLoaded === true) {
		return true;
	}
	window.bdoMenu.isLoaded = true;
	reLoadLoginData(false);
	let mainMenuStr = 'mainMenu';
	let sysMenuUrl = './base/SysMenu.query.json';
	let $mainContainer = $('#main-container');
	let $sidebar = $('#sidebar');
	let $userLabel = $('#userLabel', $sidebar);
	let $sideUserName = $('#sideUserName', $sidebar);
	let $defaultPage = $('#defaultPage', $sidebar);
	let defaultPageUrl = $defaultPage.attr('target');
	let $mainMenu = $('#mainMenu');
	let count = 0;
	window.pageTitleArr = [];
	window.canUseMenuList = [];

	function pageRightTitle(pagetitle) {
		$('#page_title').html('<li>' + pagetitle[0] + '</li><li><a class="link-effect" href="#">' + pagetitle[1] + '</a></li>');
		$('#page_head').html(pagetitle[1]);
	}

	window.pageRightTitle = pageRightTitle;
	$userLabel.text(officeNmSession + '-' + selfNm);
	$sideUserName.html(selfNm);
	//$mainContainer.load(defaultPageUrl);
	window.xxrPageKey = 'sacp首页';
	BdoFaithUtil.injectScripts(document, 'main', BdoFaithUtil.tplLoader(defaultPageUrl));
	let default_mid = $defaultPage.attr('mid')
	window.sys_menuId = default_mid;
	$defaultPage.addClass('active');

	function createMenu(menuItem, parentMenuId) {
		let $parentMenu = $('#' + parentMenuId, $sidebar);
		if (menuItem.ctype == '00') {
			if (menuItem.children != null) {
				let menuId = 'l' + menuItem.id;
				$parentMenu.append('<li id=\'' + menuId + '\'></li>');
				let $menu = $('#' + menuId, $mainMenu);
				$menu.append(
					'<a id = \'nav-submenu' + menuItem.id + '\' class=\'nav-submenu\' data-toggle=\'nav-submenu\' href=\'#\'><i id=\'icon' + menuItem.id + '\' class=\'si ' + menuItem.iconFile + '\'></i><span id=\'showCount' + menuItem.id + '\' class=\'sidebar-mini-hide\'>' + menuItem.name + '</span></a>'
				);
				let submenuId = 'u' + menuItem.id;
				$menu.append('<ul id=\'' + submenuId + '\'></ul>');
				$.each(menuItem.children, function(i, subMenuItem) {
					createMenu(subMenuItem, submenuId);
				});
			}
		} else if (menuItem.ctype == '01') {
			let url = getUrl(menuItem.act, menuItem.id);
			let menuId = 'm' + menuItem.id;
			$parentMenu.append(
				'<li><a class="menu nav-submenu main-action-menu" data-toggle="nav-submenu" id="' + menuId + '" target="' + url + '" mid= "' + menuItem.id + '" pmid="' + parentMenuId + '">' + menuItem.name + '</a></li>'
			);
			window.canUseMenuList.push(menuItem.id);
		}
	}

	function getUrl(a, f) {
		var d = a;
		var e = BDO_SYSTEM_WEB_ROOT.substring(1);
		if (a.indexOf('http://') != 0
			&& a.indexOf('https://') != 0) {
			if (a.length > e.length && a.indexOf(e) == 0) {
				d = a.substring(e.length);
			}
		}
		if (f != null && f != '') {
			if (d.indexOf('?') > 0) {
				d = d + '&';
			} else {
				d = d + '?';
			}
			d = d + 'menuid=' + f;
		}
		return d;
	}

	$.getJSON(sysMenuUrl, function(data) {
		$.each(data.data, function(i, item) {
			createMenu(item, mainMenuStr);
		});
		getAnnotation();
		$defaultPage.click(function() {
			//let defaultPageUrl = $defaultPage.attr('target');
			//$mainContainer.load(defaultPageUrl);
			getAnnotation();
			window.xxrPageKey = 'sacp首页';
			BdoFaithUtil.injectScripts(document, 'main', BdoFaithUtil.tplLoader(defaultPageUrl));
			window.sys_menuId = default_mid;
		});

		$('[id^=nav-submenu]', $mainMenu).click(function(event) {
			event.preventDefault();
			if ($(this).parent('li').hasClass('open')) {
				$(this).parent('li').removeClass('open');
			} else {
				$(this).parent('li').addClass('open');
				if ($(this).parent('li').siblings('li').hasClass('open')) {
					$(this).parent('li').siblings('li').removeClass('open');
				}
			}
		});
		$('body').bind('transferMenu', (event, param, callback) => {
			$('.active', $mainMenu).removeClass('active');
			$('.open', $mainMenu).removeClass('open');
			let $nextMune = $('#m' + param.menuId, $mainMenu);
			let $nextMuneParent = $nextMune.parent();
			let rest = '';
			window.xxrPageKey = $nextMune.text();
			BdoFaithUtil.injectScripts(document, 'main', BdoFaithUtil.tplLoader('general.do', {
				menuId: param.menuId,
				bid: window.sys_menuId
			}, function(result) {
				rest = result;
				//callback && callback(result);
			}));
			callback && callback(rest);
			/*$mainContainer.load('general.do'/!*'general.do?menuid='+param.menuId+'&bid=' + window.sys_menuId*!/, {
				menuid: param.menuId,
				bid: window.sys_menuId
			}, function() {
				callback && callback();
			});*/

			while ($nextMuneParent[0].id != 'mainMenu') {
				if ($nextMuneParent[0].nodeName == 'LI' || $nextMuneParent[0].nodeName == 'li') {
					$nextMuneParent.addClass('open');
				}
				$nextMuneParent = $nextMuneParent.parent();
			}
			$nextMune.addClass('active');
			$nextMune.hover();
			$nextMune.parent().removeClass('open');
			//callback && callback();
		});
		$('.main-action-menu', $mainMenu).click(function() {
			Promise.resolve().then(() => {
				getAnnotation();
				let $this = $(this);
				let menuId = $this.attr('mid');
				let pmenuId = $this.attr('pmid');
				let url = $this.attr('target');
				let basePath = $('base').attr('href');
				if(basePath) {
					url = basePath + url;
				}
				window.xxrPageKey = $this.text();
				window.sys_menuId = $this.attr('mid');
				$('.nav-submenu').not($this).removeClass('active');
				let obj = $this.parents('li').find('a:first').find('span:contains("项目中心")'); 
				//底稿中心跳转设置画面
				if (obj.length == 1 && (window.CUR_CUSTOMERID == null || window.CUR_CUSTOMERID == undefined || window.CUR_CUSTOMERID == '' || window.CUR_CUSTOMERID == 'null')) {
					//$mainContainer.load('general.do?menuid=40000049&bid=' + window.sys_menuId);
					let dgUrl = 'general.do?menuid=40000049&bid=' + window.sys_menuId;
					if(basePath) {
						dgUrl = basePath + dgUrl;
					}
					BdoFaithUtil.injectScripts(document, 'main', BdoFaithUtil.tplLoader(dgUrl));
					$('#m40000049').addClass('active');
				} else {
					BdoFaithUtil.injectScripts(document, 'main', BdoFaithUtil.tplLoader(url));
					//$mainContainer.load(url);
					$this.addClass('active');
				}
				if (menuId == '40000022' || menuId == '40000057') {
					$('body').parent().css('overflow-y', 'hidden');
				} else {
					$('body').parent().css('overflow-y', 'auto');
				}
				window.pageTitleArr = [$('#' + pmenuId).parent('li').find('span').html(), $this.html()];
				$.setBdoAjaxSetup();
			});
		});
	});
	
	function getAnnotation() {
		if(window.CUR_CUSTOMERID != null && window.CUR_PROJECTID != null){
			var queryFilterArr = [];
			var filter = {
					field: 'activeFlag',
					sqlIndex: 'a.ACTIVE_FLAG',
					type: 'string',
					value: '1',
					operate: 'eq'
			};
			queryFilterArr.push(filter);
			var queryString = JSON.stringify(queryFilterArr);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00140',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					filter: queryString,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success == true) {
						if(data.data != null){
							count = data.data.length;
						}
						projectCenter = $('#showCount40000021').html();
						$('#showCount40000021').html('项目中心' + '<span class="badge badge-danger pull-right">' + count + '</span>');
						annotation = $('#m40000072').html();
						$('#m40000072').html('批注汇总' + '<span class="badge badge-danger pull-right">' + count + '</span>');
						$('#icon40000021').html('<span class="badge badge-danger myBadge">' + count + '</span>');
					}
				}
			});
		}
	}
	$("#sidebar").mouseover(function(e){
		$('#icon40000021').html('');
	});
	$("#sidebar").mouseout(function(e){
		$('#icon40000021').html('<span class="badge badge-danger myBadge">' + count + '</span>');
	});
});
