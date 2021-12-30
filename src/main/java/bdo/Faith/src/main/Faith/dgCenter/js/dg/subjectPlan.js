/**
 *
 */
var SubjectPagePlan = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/subjectPlan.html');
	agrs.template = _template;
	tabPage = {};
	listener = () => {
		/*$('[data-toggle="tabs"] a, .js-tabs a').click(function(e){
			e.preventDefault();
			jQuery(this).tab('show');
		});*/
		$('#subPageRight [data-toggle="tabs"] a, .js-tabs a').on('show.bs.tab', function(evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			switch (id) {
				case 'guidePageTab':
//				GuidePage({region: '#guidePageTab', data: agrs.data});
					break;
				case 'auditProgramPageTab':
					AuditProgramPagePlan({region: '#auditProgramPageTab', data: agrs.data});
					break;
				case 'subjectPlanPageTab':
					AuditProgramPagePlan({region: '#subjectPlanPageTab', data: agrs.data});
					break;
				case 'otherSubjectPlanPageTab':
					$('#otherSubjectPlanPageTab').tab('show');
					OtherAuditProgramPagePlan({region: '#otherSubjectPlanPageTab', data: agrs.data});
					break;
				case 'postilsPageTab':
					//console.log("postilsPageTab");
//				PostilsPage({region: '#postilsPageTab'});
					break;
				default:
					break;
			}
		});
	};
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
		AuditProgramPagePlan({region: '#subjectPlanPageTab', data: agrs.data});
		// OtherAuditProgramPagePlan({region: '#otherSubjectPlanPageTabLink', data: agrs.data});
		//EditProgramPage({region: '#editProgramPageTab', data: agrs.data});
		OneUI.initHelper('slimscroll');
	};

	mount();
};