//依赖jquery
function uploadFileByForm(form,callBack){
	var formData = new FormData(form); 
	$.ajax({ 
		  type: 'post', 
		  url: getRootPath()+"/UploadFile", 
		  data: formData,
		  cache: false, 
		  processData: false, 
		  contentType: false,
		  success: function(data){
			  data=JSON.parse(data);
			  if(callBack){
				  callBack(data);
			  }
		  }
	});
}
//获取项目跟路径
function getRootPath(){
	  var strFullPath=window.document.location.href;
	  var strPath=window.document.location.pathname;
	  var pos=strFullPath.indexOf(strPath);
	  var prePath=strFullPath.substring(0,pos);
	  var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
	  return prePath+postPath;
}