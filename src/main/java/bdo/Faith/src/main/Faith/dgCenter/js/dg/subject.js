/**
 *
 */
var SubjectPage = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/subject.html');
	agrs.template = _template;
	$('#headtitle').empty().text(agrs.data.text);
	tabPage = {};
	listener = () => {
		/*$('[data-toggle="tabs"] a, .js-tabs a').click(function(e){
			e.preventDefault();
			jQuery(this).tab('show');
		});*/

		$('#subPageRight [data-toggle="tabs"] a, .js-tabs a').on('show.bs.tab', function(evt) {
			window.xxrPageKey = $(evt.currentTarget).text();
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			switch (id) {
				case 'guidePageTab':
					GuidePage({region: '#guidePageTab', data: agrs.data});
					break;
				case 'auditProgramPageTab':
					AuditProgramPage({region: '#auditProgramPageTab', data: agrs.data});
					break;
				case 'postilsPageTab':
					PostilsPage({region: '#postilsPageTab', data: agrs.data});
					break;
				case 'adjustPageTab':
					AdjustPage({region: '#adjustPageTab', data: agrs.data});
					break;
				case 'batchWPPageTab':
					BatchUploadWorkpaperPage({region: '#batchWPPageTab', data: agrs.data});
					break;
				/*case 'formulaPageTab':
					FormulaPage({region: '#formulaPageTab', data: agrs.data});
					break;*/
				case 'dgAttachPageTab':
					AttachPage({region: '#dgAttachPageTab', data: agrs.data});
					break;
				case 'samplingCountPageTab':
					SamplingCountPage({region: '#samplingCountPageTab', data: agrs.data});
					break;
				default:
					break;
			}
		});
	};
	mount = () => {
		$(agrs.region).empty().append(_template);
		window.xxrPageKey = $('#subPageRight [data-toggle="tabs"] li.active a').text();
		listener();
		AuditProgramPage({region: '#auditProgramPageTab', data: agrs.data});
		OneUI.initHelper('slimscroll');
	};

	mount();

};