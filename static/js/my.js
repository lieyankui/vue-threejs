//定义变量接收页面高度和页面宽度
var pageHeight,pageWidth;
pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
window.onresize=function(){
	 pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
	 pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
}
//获取项目根路径
//var projectPath=getRootPath();
//弹出页面
function openwindow(url,name,iWidth,iHeight){
  //url转向网页的地址;
  //name网页名称，可为空;
  //iWidth弹出窗口的宽度;
  //iHeight弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
     var iTop = (window.screen.height-30-iHeight)/2;       //获得窗口的垂直位置;
     var iLeft = (window.screen.width-10-iWidth)/2;        //获得窗口的水平位置;
     window.open(getRootPath()+"/"+url,name,'height='+iHeight+',innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}
//根据dom的id使元素居中
function makeEleAlignCenter(id){
	var ele=document.getElementById(id);
	var width=ele.clientWidth;
	var height=ele.clientHeight;
	ele.style.position="absolute";
	ele.style.left=(parseInt(pageWidth/2)-parseInt(width/2))+"px";
	ele.style.top=(parseInt(pageHeight/2)-parseInt(height/2))+"px";
}

//在页面中随机一个位置
function randomPoint(domInfo,pDom){
	var xRange,yRange;
	if(domInfo){
		//alert((parseInt(pDom?pDom.clientWidth:pageWidth)-domInfo.width));
		//alert((parseInt(pDom?pDom.clientHeight:pageHeight)-domInfo.height));
		xRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientWidth:pageWidth)-domInfo.width-20));
		yRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientHeight:pageHeight)-domInfo.height-20));
	}else{
		xRange=Math.round(Math.random()*(totalW?totalW:pageWidth));
		yRange=Math.round(Math.random()*(totalH?totalH:pageHeight));
	}
	return {xRange:parseInt(xRange)+10,yRange:parseInt(yRange)+10};
}
//在页面中随机x方向位置
function randomX(domInfo,totalW){
	var xRange;
	if(domInfo){
		xRange=Math.round(Math.random()*((totalW?totalW:pageWidth)-domInfo.width));
	}else{
		xRange=Math.round(Math.random()*(totalW?totalW:pageWidth));
	}
	return xRange;
}
//在页面中随机y方向位置
function randomY(domInfo,totalH){
	var yRange;
	if(domInfo){
		yRange=Math.round(Math.random()*((totalH?totalH:pageHeight)-domInfo.height));
	}else{
		yRange=Math.round(Math.random()*(totalH?totalH:pageHeight));
	}
	return yRange;
}
//转动传入的元素 指定的角度
function rotateDomOnce(dom,angle){
	dom.style.transform="rotatez("+angle+"deg)";
};
//转动传入的元素 指定的角度
function rotateDom(dom,addAngle,dir){
	var currAngle=getRotateByDirection(dom,"z");
	currAngle=currAngle?currAngle:0;
	addAngle=addAngle?addAngle:1;
	//alert(currAngle+"==="+addAngle);
	if(dir){
		dom.style.transform="rotate"+dir+"("+(currAngle+addAngle)+"deg)";
	}else{
		dom.style.transform="rotatez("+(currAngle+addAngle)+"deg)";
	}
};
//获取left值
function getLeftVal(dom){
	var left=dom.style.left;
	if(!left){
		left=dom.offsetLeft;
	}
	return parseInt(left);
}

//获取left值
function getTopVal(dom){
	var top=dom.style.top;
	if(!top){
		top=dom.clientTop;
	}
	return parseInt(top);
}
//获取x、y、z方向上旋转的角度
function getCurrentRotate(dom,direction){
	var rotateX,rotateY,rotateZ;
	rotateX=getRotateByDirection(dom,"x");
	rotateY=getRotateByDirection(dom);
	rotateZ=getRotateByDirection(dom,"z");
	var rotateInfo={rotateX:rotateX,rotateY:rotateY,rotateZ:rotateZ};
	if(direction){
		return rotateInfo[direction];
	}else{
		return rotateInfo;
	}
}
//滚动条宽度计算函数
function getScrollbarWidth() {
  var oP = document.createElement("p"),
    styles = {
      width: "100px",
      height: "100px",
      overflowY: "scroll"
    }, i, scrollbarWidth;
  for (i in styles) oP.style[i] = styles[i];
  document.body.appendChild(oP);
  scrollbarWidth = oP.offsetWidth - oP.clientWidth;
  oP.remove();
  return scrollbarWidth;
}
//获取某个方向上的旋转角度
function getRotateByDirection(dom,direction){
	var dir,startIndex,endIndex;
	var rotate=dom.style.transform;
	if(direction){
		dir=direction;
	}else{
		dir="y";
	}
	dir=dir.toUpperCase();
	startIndex=rotate.indexOf("rotate"+dir+"(")+8;
	endIndex=rotate.indexOf("d",startIndex);
	return parseInt(rotate.substring(startIndex,endIndex));
}
//根据id属性值给元素绑定事件     依赖jquery
function myBind(idValue,eventType,fn,param){
	$("#"+idValue).bind(eventType,function(event){
		var event=event?event:window.event;
		eval(fn+"(param,event)");
	});
}
function callFn(fn,param){
	eval(fn+"(param)");
}
function myEval(text){
	eval("'"+text+"'");
}
function myAjax(url,param){
	var contextPath=getRootPath();
	var jsonStr=JSON.stringify(param);
	$.ajax({
        type: "POST",
        url: contextPath+"/"+url,
        contentType: "application/json",
        data: jsonStr,
        async: false,
        dataType: "json",
        success: function(text){
            //jquery会把json格式字符串自动转为js对象
            return text;
        }
    });
}
function myAsyncAjax(url,param,fn){
	var contextPath=getRootPath();
	var jsonStr=JSON.stringify(param);
	$.ajax({
        type: "POST",
        url: contextPath+"/"+url,
        contentType: "application/json",
        data: jsonStr,
        async:true,
        dataType: "json",
        success: function(text){
        	if(fn){
        		fn(text);
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
//判断参数对象是不是数组
function isArray(obj){
	if(typeof Array.isArray === 'function'){
		return Array.isArray(obj);
	}else{
		return Object.prototype.toString().call(obj) === '[object Array]';
	}
}
//记忆方法 (用在查询较为频繁且查询条件基本一样数据基本不变动)   页面刷新缓存消失
function memorize(f){
	var cache={};
	return function(){
		var key=arguments.length+Array.prototype.join.call(arguments,",");
		if(key in cache){
			return cache[key];
		}else{
			return cache[key]=f.apply(this,arguments);
		}
	};
}
//给函数对象添加获取方法名的方法
Function.prototype.getName=function(){
	var re=/function\s*(\w*)/i;
	var name=re.exec(this.toString())[1];
	return this.name||name;
}