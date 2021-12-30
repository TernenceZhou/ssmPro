//拼接科目引号
var getSplicingSubject = function(object) {
	if (object == '' || object == null) {
		return '';
	}
	var subjectArr = object.split(',');
	var subjectId = subjectArr.map(str => '"' + str + '"').join(',');

	/*var subjectId="";
	for ( var index in subjectArr) {
		
		if(index<subjectArr.length){
			console.log(subjectArr[index]);
			subjectId+="\""+subjectArr[index]+"\",";
		}
	}
	subjectId=subjectId.substring(0,subjectId.length-1);*/
	return subjectId;
};

/**
 * 转base64 成文件格式
 */
function dataURLtoFile(dataString, filename, mime) {
	let index = dataString.indexOf('base64,');
	if (index >= 0) {
		let dl = dataString.indexOf('base64,') + 'base64,'.length;
		if (dl > 'base64,'.length) {
			dataString = dataString.substring(dl);
		}
	}
	mime || (mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	let bstr = atob(dataString),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {
		type: mime,
		name: filename
	});
}

/**
 * 转成文件 base64 格式
 */
function blobToDataURL(blob, callback) {
	var a = new FileReader();
	a.onload = e => {
		callback(e.target.result);
	};
	a.readAsDataURL(blob);
}