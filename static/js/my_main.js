//leadInJs(getRootPath()+"/js/jquery-1.8.3.min.js");
leadInJs(getRootPath()+"/js/dom_rela.js");
//引入技术文件的方法1
function loadJs(url,success){
	var scriptDom=document.createElement("script");
	scriptDom.setAttribute("src",url);
	success=success||function(){};
	scriptDom.onload=scriptDom.onreadystatechange=function(){
		if(!this.readyState||"loaded"===this.readyState||"complete"===this.readyState){
			success();
			this.onload=this.onreadystatechange=null;
			this.parentNode.removeChild(this);
		}
	}
	document.getElementsByTagName("head")[0].appendChild(scriptDom);
}
//引入技术文件的方法2
function leadInJs(srcStr){
	var scriptDom=document.createElement("script");
	var headEle=document.getElementsByTagName("head")[0];
	scriptDom.setAttribute("type","text/javascript");
	scriptDom.setAttribute("src",srcStr);
	headEle.appendChild(scriptDom);
}
//js获取项目绝对路径1
function getRootPath() {
  var pathName = window.location.pathname.substring(1);
  var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
  if (webName == "") {
    return window.location.protocol + '//' + window.location.host;
  }
  else {
    return window.location.protocol + '//' + window.location.host + '/' + webName;
  }
}