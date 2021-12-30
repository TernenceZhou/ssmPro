$(document).ready(function() {
	let menuName = '审计调整汇总';

	function adjustSummeryTabShown(event) {
		window.xxrPageKey = menuName + '-' + $(event.currentTarget).text();
	}

	$('#tab_adjust[data-toggle="tabs"] a').off('shown.bs.tab', adjustSummeryTabShown);
	$('#tab_adjust[data-toggle="tabs"] a').on('shown.bs.tab', adjustSummeryTabShown);
});
