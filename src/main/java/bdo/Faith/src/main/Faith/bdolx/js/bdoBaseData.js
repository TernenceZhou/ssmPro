var DicJsonlData = $.getJSON('./localData/data/kdic/kdic.jsonl');

var IndustryJsonlData = $.getJSON('./localData/db/tableinfo/bdo_base.base_industry.jsonl');

var DicVal2Nm = function(DicValue, DicType) {
	var DicNm;
	$.each(DicJsonlData.responseJSON[DicType], function(index, info) {
		if (DicValue == index) {
			DicNm = info;
		}
	});
	return DicNm;
};

var IndustryVal2Nm = function(IndustryValue) {
	var IndustryNm;
	$.each(IndustryJsonlData.responseJSON, function(index, info) {
		if (IndustryValue == index) {
			IndustryNm = info;
		}
	});
	return IndustryNm;
};


var IndustryVal2NmByGB = function(firstLevel, secondLevel) {
	var IndustryNm = null;
	if (secondLevel != null && secondLevel != '') {
		$.each(IndustryJsonlData.responseJSON, function(index, info) {
			var patt1 = new RegExp(/[A-z]/g);
			var patt2 = new RegExp(secondLevel + '$', 'gmi');
			if (patt1.test(index.charAt(0)) && index.charAt(3) == 0 && patt2.test(index)) {
				IndustryNm = info;
				return false;
			}
		});
	}
	if (IndustryNm != null) {
		return IndustryNm;
	}

	if (firstLevel != null && firstLevel != '') {
		firstLevel = firstLevel.toUpperCase() + '000';
		$.each(IndustryJsonlData.responseJSON, function(index, info) {
			if (firstLevel == index) {
				IndustryNm = info;
				return false;
			}
		});
	}
	return IndustryNm;
};


var IndustryValByGB = function(firstLevel, secondLevel) {
	var IndustryNm = null;
	if (secondLevel != null && secondLevel != '') {
		$.each(IndustryJsonlData.responseJSON, function(index, info) {
			var patt1 = new RegExp(/[A-z]/g);
			var patt2 = new RegExp(secondLevel + '$', 'gmi');
			if (patt1.test(index.charAt(0)) && index.charAt(3) == 0 && patt2.test(index)) {
				IndustryNm = index;
				return false;
			}
		});
	}
	if (IndustryNm != null) {
		return IndustryNm;
	}

	if (firstLevel != null && firstLevel != '') {
		firstLevel = firstLevel.toUpperCase() + '000';
		$.each(IndustryJsonlData.responseJSON, function(index, info) {
			if (firstLevel == index) {
				IndustryNm = index;
				return false;
			}
		});
	}
	return IndustryNm;
};