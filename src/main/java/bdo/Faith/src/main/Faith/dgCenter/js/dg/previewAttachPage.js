/**
 * 右侧副底稿
 */
var PreviewAttachPage = (agrs) => {
	var _template
		, _data
		, mount
		, listener
		, customerId
		, projectId
		, workpaperId
		, mapKey
		, mapCache
		, mapType;

	_data = _data ? _data : agrs.data;
	_template = agrs.template || tplLoader('dgCenter/html/dg/previewAttachPage.html');
	agrs.template = _template;

	customerId = _data.customerId;
	projectId = _data.projectId;
	workpaperId = _data.workpaperId;
	mapKey = _data.mapKey;
	mapCache = _data.mapCache;
	mapType = _data.mapType;

	/**
	 * 事件绑定
	 */
	listener = () => {
		var createLinkDiv = (function () {
			$('#linkGroup').html('');
			if(mapType == 'sampling'){
				for(var map of mapCache){
					var fileName = map.text.substring(map.text.indexOf(":") + 1);
					var fileSuffix = map.text.substring(map.text.lastIndexOf(".") + 1).toLowerCase();
					var text;
					if(fileSuffix == 'xls' || fileSuffix == 'xlsx' || fileSuffix == 'xltx' || fileSuffix == 'xlsm'
						|| fileSuffix == 'xltm' || fileSuffix == 'xlsb' || fileSuffix == 'xlam'){
						text = '<span class="icon node-icon fa fa-file-excel-o text-primary-light"></span>';
					} else if(fileSuffix == 'jpg' || fileSuffix == 'png'){
						text = '<span class="icon node-icon fa fa-file-image-o text-primary-light"></span>';
					} else if(fileSuffix == 'doc' || fileSuffix == 'docx'){
						text = '<span class="icon node-icon fa fa-file-word-o text-primary-light"></span>';
					} else if(fileSuffix == 'zip' || fileSuffix == 'rar'){
						text = '<span class="icon node-icon fa fa-file-archive-o text-primary-light"></span>';
					} else if(fileSuffix == 'pdf'){
						text = '<span class="icon node-icon fa fa-file-pdf-o text-primary-light"></span>';
					}
					var txt = $('<li class="list-group-item node-' + map.id + '" data-nodeid="' + map.id + '" data-type="type2" data-suffix="' + fileSuffix + '" style="cursor: pointer;">'
						+ '&nbsp;&nbsp;'
						+ text
						+ '&nbsp;&nbsp;'
						+ map.text
						+ '</li>');
					$('#linkGroup').append(txt);
				}
			}else if(mapType == 'singleLink'){
				for(var map of mapCache){
					if(map.isFile == true && map.isPaper == false){
						var fileNames = map.fileName.split(',');
						var attachmentLinks = map.attachmentLink.split(',');
						for(var i = 0;i < fileNames.length;i++){
							var fileName = fileNames[i];
							var attachmentLink = attachmentLinks[i];	
							var fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
							var text;
							if(fileSuffix == 'xls' || fileSuffix == 'xlsx' || fileSuffix == 'xltx' || fileSuffix == 'xlsm'
								|| fileSuffix == 'xltm' || fileSuffix == 'xlsb' || fileSuffix == 'xlam'){
								text = '<span class="icon node-icon fa fa-file-excel-o text-primary-light"></span>';
							} else if(fileSuffix == 'jpg' || fileSuffix == 'png'){
								text = '<span class="icon node-icon fa fa-file-image-o text-primary-light"></span>';
							} else if(fileSuffix == 'doc' || fileSuffix == 'docx'){
								text = '<span class="icon node-icon fa fa-file-word-o text-primary-light"></span>';
							} else if(fileSuffix == 'zip' || fileSuffix == 'rar'){
								text = '<span class="icon node-icon fa fa-file-archive-o text-primary-light"></span>';
							} else if(fileSuffix == 'pdf'){
								text = '<span class="icon node-icon fa fa-file-pdf-o text-primary-light"></span>';
							}
							var txt = $('<li class="list-group-item node-' + attachmentLink.substring(0, attachmentLink.indexOf(':')) + '" data-nodeid="' + attachmentLink.substring(0, attachmentLink.indexOf(':')) + '" data-type="type1" data-suffix="' + fileSuffix + '" style="cursor: pointer;">'
								+ '&nbsp;&nbsp;'
								+ text
								+ '&nbsp;&nbsp;'
								+ fileName
								+ '</li>');
							$('#linkGroup').append(txt);
						}
					}
				}
			}
		})();
		$('.list-group li').on('click', function(event) {
			var attachId = $(event.currentTarget).attr('data-nodeid');
			if(!checkAttachExist(attachId)){
				bdoErrorBox('失败', '附件已删除，请刷新底稿后重新打开附件页面！');
				return;
			}
			var dataType = $(event.currentTarget).attr('data-type');
			var fileSuffix = $(event.currentTarget).attr('data-suffix').toLowerCase();
			var text = $(event.currentTarget).text();
			var fileName = text.substring(text.indexOf(":") + 1);
			if (fileSuffix == "pdf" || fileSuffix == "jpg" || fileSuffix == "png") {
				$('#sideRegin').css('display', 'block');
				$('#sideRegin').html('');
				var $div = $('<iframe src="dgCenter/DgPaper.previewFile.json?param1=' + attachId + '&param2=' + dataType + '" allowfullscreen="true" width="100%" height="' + window.innerHeight + 'px" style="border: none;" onload="resize(this)"></iframe>');
				$('#sideRegin').append($div);
			}else if(fileSuffix == 'xls' || fileSuffix == 'xlsx' || fileSuffix == 'xltx' || fileSuffix == 'xlsm'
				|| fileSuffix == 'xltm' || fileSuffix == 'xlsb' || fileSuffix == 'xlam'){
				$('#sideRegin').css('display', 'block');
				$('#sideRegin').html('');
				var mapData = {
						customerId: customerId,
						projectId: projectId,
						attachId: attachId,
						fileName: fileName,
						dataType: dataType
				};
				$.sessionStorage('previewAttachNode', JSON.stringify(mapData));
				var $div = $('<iframe id="iframe_attach_' + attachId + '" src="/Faith/dgcenter.do?m=openAttach&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
				$('#sideRegin').append($div);
			}else{
				downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: attachId, param2: customerId, param3: dataType});
			}
		});
		
		function checkAttachExist(attachmentId){
			var isExist = true;
			if(mapType == 'sampling'){
				$.ajax({
					type : 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00329',
						param1: customerId,
						param2: projectId,
						param3: attachmentId,
						start: -1,
						limit: -1
					},
					dataType : 'json',
					success(data) {
						if(data.success) {
							if(data.data[0].num == 0){
								isExist = false;
							}
						}
					}
				});
			}else if(mapType == 'singleLink'){
				$.ajax({
					type : 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00180',
						param1: customerId,
						param2: projectId,
						param3: attachmentId,
						start: -1,
						limit: -1
					},
					dataType : 'json',
					success(data) {
						if(data.success) {
							if(data.data[0].num == 0){
								isExist = false;
							}
						}
					}
				});
			}
			return isExist;
		}
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
	};
	mount();

};