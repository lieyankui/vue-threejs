//定义变量接收页面高度和页面宽度
var pageHeight,pageWidth;
pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
window.onresize=function(){
	 pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
	 pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
}
var contextPath=getRootPath();
//日期工具对象
var dateUtil={
    //格式化日期
    formateDate:function(date,splitStr){
        if(date&&typeof date=="object"){
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var day=date.getDate();
            var hour=date.getHours();
            var minute=date.getMinutes();
            var second=date.getSeconds();
            if(!splitStr){
                splitStr="-";
            }
            return year+""+splitStr+month+""+splitStr+day+" "+hour+":"+minute+":"+second;
        }
    },
    //解析日期字符串
    parseDate:function(dateStr){
        var date=new Date();
        //验证日期的正则
        var dateRegex=/^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}\s*\d{1,2}[:]{1}\d{1,2}[:]{1}\d{1,2}$/;
        if(dateRegex.test(dateStr)){
            dateStr=dateStr.replace(/\-|\/|\./g,"/");
            var dateArr=dateStr.split(/\s+/);
            if(dateArr&&dateArr.length){
                var dates=dateArr[0].split(/\-|\/|\./);
                var times=dateArr[1].split(/:/);
                //console.log(dates+"==="+times);
                date.setFullYear(parseInt(dates[0]));
                date.setMonth(parseInt(dates[1])-1);
                date.setDate(parseInt(dates[2]));
                date.setHours(parseInt(times[0]));
                date.setMinutes(parseInt(times[1]));
                date.setSeconds(parseInt(times[2]));
            }else{
                date=null;
                throw "日期字符串解析错误:日期字符串格式错误";
            }
        }else{
            date=null;
            throw "日期字符串解析错误:日期字符串格式错误";
        }
        return date;
    }
    
};

//dom元素操作相关方法
//根据dom的id使其在父元素中居中    父元素必须要有position属性
function makeEleAlignCenter(id,offsetObj){
	var ele=typeof id=="string"?document.getElementById(id):id;
	var pNode=ele.parentNode;
	var pWidth=pNode.clientWidth;
	var pHeight=pNode.clientHeight;
	var width=ele.offsetWidth;
	var height=ele.offsetHeight;
	ele.style.position="absolute";
	//console.log(((parseInt(pWidth/2)-parseInt(width/2))*(offsetObj&&offsetObj.top?parseFloat(offsetObj.top):1)));
	ele.style.left=((parseInt(pWidth/2)-parseInt(width/2))*(offsetObj&&offsetObj.left?parseFloat(offsetObj.left):1))+"px";
	ele.style.top=((parseInt(pHeight/2)-parseInt(height/2))*(offsetObj&&offsetObj.top?parseFloat(offsetObj.top):1))+"px";
}
//在页面中随机一个位置
function randomPoint(domInfo,pDom){
	var xRange,yRange;
	if(domInfo){
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
	if(!dom){
		return;
	}
	angle=angle||0;
	dom.style.transform="rotate"+dir+"("+parseInt(angle)+"deg)";
};
//转动传入的元素 指定的角度
function rotateDomByDir(dom,addAngle,dir){
	addAngle=addAngle||1;
	dir=dir||"z";
	var currAngle=getRotateByDirection(dom,dir);
	currAngle=currAngle||0;
	dom.style.transform="rotate"+dir+"("+(currAngle+addAngle)+"deg)";
};
//转动传入的dom元素指定的角度   confInfo为js对象 x为x方向上旋转的角度  以此类推
function rotateDom(dom,confInfo){
	var rotateConf={x:0,y:0,z:0};
	if(confInfo){
		rotateConf=extend(rotateConf,confInfo);
	}
	var currAngle=0;
	currAngleX=getRotateByDirection(dom,"x");
	currAngleY=getRotateByDirection(dom,"y");
	currAngleZ=getRotateByDirection(dom,"z");
	currAngleX=currAngleX||0;
	currAngleY=currAngleY||0;
	currAngleZ=currAngleZ||0;
	dom.style.transform="rotatez("+(currAngleZ+rotateConf.z)+"deg) rotatex("+(currAngleX+rotateConf.x)+"deg) rotatey("+(currAngleY+rotateConf.y)+"deg)";
};

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
//获取dom元素某个方向上的旋转角度
function getRotateByDirection(dom,dir){
	var startIndex,endIndex;
	dir=dir||"z";
	var rotate=dom.style.transform;
	dir=dir.toUpperCase();
	startIndex=rotate.indexOf("rotate"+dir+"(")+8;
	endIndex=rotate.indexOf("d",startIndex);
	return parseInt(rotate.substring(startIndex,endIndex));
}
//获取left属性值
function getLeftVal(dom){
	var left=dom.style.left||dom.offsetLeft;
	return parseInt(left);
}
//获取top属性值
function getTopVal(dom){
	var top=dom.style.top||dom.offsetTop;
	return parseInt(top);
}
//获取元素所占的范围
function getDomRange(dom){
	var minX=getLeftVal(dom);
	var minY=getTopVal(dom);
	var maxX=Math.ceil(minX+dom.offsetWidth);
	var maxY=Math.ceil(minY+dom.offsetHeight);
	return {minX:minX,minY:minY,maxX:maxX,maxY:maxY};
}
//获取元素的中心点
function getDomCenter(dom){
	var minX=getLeftVal(dom);
	var minY=getTopVal(dom);
	var center={x:minX+dom.offsetWidth/2,y:minY+dom.offsetHeight/2};
	return center;
}
//判断两个元素是否重叠(不精确)
function isOverLap(dom1,dom2){
	var c1=getDomCenter(dom1),c2=getDomCenter(dom2),w1=dom1.clientWidth,w2=dom2.clientWidth,
	h1=dom1.clientHeight,h2=dom2.clientHeight;
	if(!(Math.abs(c1.x-c2.x)>(w1/2+w2/2))&&!(Math.abs(c1.y-c2.y)>(h1/2+h2/2))){
		return true;
	}else{
		return false;
	}
}
//判断是否有兄弟元素和参数dom元素重叠
function domIsOverlap(dom){
	var flag=false;
	var doms=dom.parentNode.children;
	for (var i = 0; i < doms.length; i++) {
		if(dom!==doms[i]){//是兄弟元素
			if(isOverLap(dom,doms[i])){
				flag= true;
				break;
			}
		}
	}
	return flag;
}
//考虑兼容性问题！获取css样式
function getStyle(obj,attr) {  
    if(obj.currentStyle){
        return obj.currentStyle[attr]; 
    }else{
        return window.getComputedStyle(obj,null)[attr]; 
    }
}
//根据类名获取元素
function getDomByClass(className){
	var elems=[];
	if(!document.getElementsByClassName){
		var doms=document.getElementsByTagName("*");
		for(var i=0,l=doms.length;i<l;i++){
			if(doms[i].className.indexOf(className)!=-1){
				elems.push(doms[i]);
			}
		}
	}else{
		elems=document.getElementsByClassName(className);
	}
	return elems;
}
//获取元素相对与当前页面的x和y方向上的坐标
function getXAndY(target){
	var left=target.offsetLeft;
	var top=target.offsetTop;
	var pNode=target.offsetParent;
	if(pNode){
		var xyInfo=getXAndY(pNode);
		left+=xyInfo.left;
		top+=xyInfo.top;
		return {left:left,top:top};
	}else{
		return {left:left,top:top};
	}
}
//获取元素的宽高包括border的范围   第二个参数可选默认为false 不包含margin范围  为true包含margin范围
function getSize(dom,isContainerMargin){
	var width=dom.offsetWidth;
	var height=dom.offsetHeight;
	if(isContainerMargin){
		width+=(parseInt(dom.style.marginLeftWidth)||0+parseInt(dom.style.marginRightWidth)||0);
		height+=(parseInt(dom.style.marginTopWidth)||0+parseInt(dom.style.marginBottomWidth)||0);
	}
	return {width:width,height:height};
}
//获取子元素（不包含文本）和script标签
function getChilds(pDom){
	if(!pDom.childNodes){
		pDom=document.getElementById(pDom);
	}
	if(!pDom) return;
	var eles=pDom.childNodes;
	var childs=new Array();
	for (var j = 0,k=eles.length; j < k; j++) {
		var ele=eles[j];
		if(ele.tagName&&ele.tagName!="SCRIPT"){
			childs.push(ele);
		}else{
			continue;
		}
	}
	return childs;
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
//操作dom的方法
function getDom(domId){
	return document.getElementById(domId);
}
//创建dom元素
function createDom(domType,pdom,styleJson){
	var dom=document.createElement(domType);
	if(!pdom){
		return dom;
	}
	pdom.appendChild(dom);
	setStyle(dom,styleJson);
	return dom;
}
//获取body元素
function getBody(isTop){
	var win=isTop?window.top:window;
	return win.document.body||win.document.getElementsByTagName("body")[0];
}
//设置参数dom的样式
function setStyle(dom,styleJson){
	if(!dom){
		return;
	}
	for(var name in styleJson){
		dom.style[name]=styleJson[name];
	}
}


//dom事件相关方法
//鼠标滚动时div内的内容随之滚动
function onMouseScroll(e){
	e.preventDefault();
	var speed=e.wheelDelta>0?-10:10;
	var target=getScrollEle(e.target);
	target.scrollTop+=speed;
	if(target.scrollTop>=target.scrollHeight-target.clientHeight){
		target.scrollTop=target.scrollHeight-target.clientHeight;
	}else if(target.scrollTop<0){
		target.scrollTop=0;
	}
}
//获取鼠标滚轮滚动的元素的第一个scrollHeight>clientHeight的元素  参数：触发事件的目标元素
function getScrollEle(ele){
	if(ele.scrollHeight>ele.clientHeight){
		return ele;
	}else{
		var pNode=ele.parentNode;
		if(pNode){
			return getScrollEle(pNode);
		}else{
			return ele;
		}
	}
}
//获取事件对象
function getEvent(e){
	return e||window.event;
}
function getLocation(e) {
    return {
        x: e.x || e.clientX,
        y: e.y || e.clientY
    }
}
//给元素添加事件   params:1、要添加事件的元素2、事件的类型 如：click3、回调函数4,、回调函数的参数
function addEvent(obj,eventType,callback,param){
	if(document.addEventListener){
		obj.addEventListener(eventType,function(e){
			if(param){
				callback(e,param);
			}else{
				callback(e);
			}
		});
	}else{
		obj.attachEvent('on'+eventType,function(e){
			if(param){
				callback(e,param);
			}else{
				callback(e);
			}
        });
	}
};
//取消绑定事件
function removeEvent(obj,eventType,callback){
	obj.removeEventListener(type,function(){
		if(callback){
			callback();
		}
	});
}


// 其他方法
//使用ajax  同步请求获取数据
function myAjax(url,param){
	var contextPath=getRootPath();
	var jsonStr=JSON.stringify(param);
	var returnJson=null;
	$.ajax({
        type: "POST",
        url: contextPath+"/"+url,
        contentType: "application/json",
        data: jsonStr,
        async: false,
        dataType: "json",
        success: function(text){
            //jquery会把json格式字符串自动转为js对象
        	returnJson=text;
        }
    });
	return returnJson;
}
//使用ajax  异步请求并执行回调函数
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
//合并json数据
function extend(des, src) {
    for (p in src) {
      des[p]=src[p];
    }
    return des;
}
//去除字符串左右空格
//去左右空格;
function trim(s){
  return s.replace(/(^\s*)|(\s*$)/g, "");
}
//随机颜色的方法
function bg1(){
    return '#'+Math.floor(Math.random()*256).toString(10);
}
function bg2(){
    return '#'+Math.floor(Math.random()*0xffffff).toString(16);
}
function getBgColor(){
    var r=Math.floor(Math.random()*256);
    var g=Math.floor(Math.random()*256);
    var b=Math.floor(Math.random()*256);
    return "rgb("+r+','+g+','+b+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}
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
//给函数对象添加获取方法名的方法
Function.prototype.getName=function(){
	var re=/function\s*(\w*)/i;
	var name=re.exec(this.toString())[1];
	return this.name||name;
}

//弹窗相关操作
//在页面头部显示提示信息
function showMessage(message){
	var body=getBody();
	var bodyWidth=body.offsetWidth;
	var bodyHeight=body.offsetHeight;
	var messageBox=document.createElement("div");
	messageBox.className="message_box";
	body.appendChild(messageBox);
	messageBox.style.left=(bodyWidth-messageBox.offsetWidth)/2+"px";
	messageBox.style.top=10+"px";
	messageBox.innerHTML=message;
	setTimeout(function(){
		body.removeChild(messageBox);
	},3000);
}
//弹出confirm  paramObj格式{message:"要显示的信息",title:要显示的标题,sureText:"确定按钮显示名称",cancleText:"取消按钮显示名称",callBack:"回调函数"}
function $confirm(paramObj){
	if(!paramObj){
		return;
	}
	var message=paramObj.message||"";
	var title=paramObj.title||"系统提示";
	var sureText=paramObj.sureText||"确定";
	var cancleText=paramObj.cancleText||"取消";
	var callBack=paramObj.callBack;
	var body=getBody();
	//设置遮罩的样式
	//var maskStyle={width:"100%",height:"100%",background:"rgba(71,75,66,0.5)",
				   //position:"absolute",top:"0px",left:"0px"};
	//创建遮罩
	var mask=createDom("div",body);//,maskStyle
	mask.className="fix_title_box_mask";
	//创建confirm最外层元素
	var confirmContainer=createDom("div",mask);
	confirmContainer.className="fix_title_box_container";
	//创建confirm的title
	var confirmTitle=createDom("div",confirmContainer);
	confirmTitle.className="fix_title_box_title";
	confirmTitle.innerHTML=title;
	//创建confirm的内容区
	var confirmContent=createDom("div",confirmContainer);
	confirmContent.className="fix_title_box_content";
	//创建文本显示区
	var textArea=createDom("div",confirmContent);
	textArea.className="fix_title_box_text_area";
	textArea.innerHTML=message;
	//创建按钮显示区
	var buttonArea=createDom("div",confirmContent);
	buttonArea.className="fix_title_box_button_area";
	//创建确定按钮
	var sureBtn=createDom("input",buttonArea);
	sureBtn.setAttribute("type","button");
	sureBtn.setAttribute("value",sureText);
	sureBtn.className="fix_title_box_sure_button";
	//创建取消按钮
	var cancleBtn=createDom("input",buttonArea);
	cancleBtn.setAttribute("type","button");
	cancleBtn.setAttribute("value",cancleText);
	cancleBtn.className="fix_title_box_cancle_button";
	//弹出框剧中展示
	makeEleAlignCenter(confirmContainer,{top:0.7});
	//给元素添加事件   params:1、要添加事件的元素2、事件的类型 如：click3、回调函数4,、回调函数的参数
	//给确定按钮添加事件
	addEvent(sureBtn,"click",function(){
		if(callBack){
			callBack('sure');
			clearMask();
		}
	});
	//给取消按钮添加事件
	addEvent(cancleBtn,"click",function(){
		if(callBack){
			callBack('cancle');
			clearMask();
		}
	});
	function clearMask(){
		body.removeChild(mask);
	}
}
//模拟nui.open
function $open(paramObj){
	if(!paramObj||!paramObj.url){
		return;
	};
	var confInfo={
		width:800,
		height:600,
		allowDrag:false,
		allowResize:false,
		showCloseBtn:true,
		showMaxBtn:false,
		showTitle:true,
		title:"系统提示",
	};
	confInfo=extend(confInfo,paramObj);
	var body=getBody(true);
	var winSize=getInner(true);
	//console.log("窗口尺寸",winSize);
	//console.log("body尺寸",{width:body.clientWidth,height:body.clientHeight});
	var winWidth=getWidthNum(confInfo.width);
	var winHeight=getHeightNum(confInfo.height);
	var maskDiv=createDom("div",body,{
						  width:"100%",height:"100%",position:"absolute",
				          left:"0",top:"0",background:"rgba(0,0,0,0.5)"});
	var winMainDiv=createDom("div",maskDiv,{
		  					 width:winWidth+"px",height:winHeight+"px",position:"absolute",
		  					 left:((winSize.width-winWidth)/2)+"px",
		  					 top:((winSize.height-winHeight)/2)+"px",
		  					 background:"rgba(255,255,255,0.8)"});
	var title=createDom("div",winMainDiv,{
							 height:"40px","line-height":"40px",
							 overflow:"hidden",
							 background:"rgba(255,255,255,0.8)"});
	var titleText=createDom("div",title,{
							 height:"40px","line-height":"40px",display:"inline-block","max-width":(winWidth-200)+"px",
							 overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap",//overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
							 padding:"0px 12px",float:"left",
							 /*background:"rgba(255,255,255,0.8)"*/});
		titleText.setAttribute("title",confInfo.title);
		titleText.innerHTML=confInfo.title;
	var btnBox=createDom("div",title,{
							 height:"40px","line-height":"40px",display:"inline-block","max-width":"200px",
							 padding:"2px 10px",float:"right",
							 /*background:"rgba(255,255,255,0.8)"*/});
	if(confInfo.showCloseBtn){
		var closeBtn=createBtn("X");
		closeBtn.className="my_btn";
		btnBox.appendChild(closeBtn);
		addEvent(closeBtn,"click",function(e){
			closeOpenWin();
		});
	}
	var container=createDom("div",winMainDiv,{
						 height:(winHeight-40)+"px",
						 overflow:"hidden",
						 });
	var iframeObj=createDom("iframe",container,{
		 height:"100%",
		 width:"100%",
		 border:"0"
		 });
	var rootPath=getRootPath();
	iframeObj.src=rootPath+confInfo.url;
	paramObj.getIframeEl=getIframeEl;
	var loadFunc=paramObj.onload.bind(paramObj);
	//loadFunc();
	iframeLoaded(iframeObj,loadFunc);
	
	iframeObj.contentWindow.onbeforeunload=function(){
		alert("iframe关闭");
	};
	//
	console.log(iframeObj.contentWindow);
	
	//关闭弹出框
	function closeOpenWin(){
		var win=iframeObj.contentWindow;
		if(win.CloseOwnerWindow){
			win.CloseOwnerWindow(action);
		}else{
			win.close();
		}
		container.removeChild(iframeObj);
		body.removeChild(maskDiv);
	}
	function getIframeEl(){
		return iframeObj;
	}
}
function iframeLoaded(iframeObj,loadFunc){
	if (iframeObj.attachEvent){
		iframeObj.attachEvent("onload", function(){
			loadFunc();
		});
	} else {
		iframeObj.onload = function(){
			loadFunc();
		};
	}
	addEvent(iframeObj,"close",function(e){
		alert(1111);
	});
}
function createBtn(content,btnStyle){
	var dom=createDom("div");
	btnStyle=extend({height:"36px","line-height":"36px",padding:"0px 8px",cursor:"pointer"},btnStyle);
	dom.innerHTML=content;
	setStyle(dom,btnStyle);
	return dom;
}

//
function getWidthNum(numObj,pDom){
	var num=0;
	var pEle=pDom?pDom:getBody(true);
	if(typeof numObj=="string"){
		if(numObj.indexOf("%")!=-1){
			num=parseInt(pEle.clientWidth*(parseFloat(numObj)/100));
		}else{
			try{
				num=parseFloat(numObj);
			}catch(e){
				num=0;
			}
		}
	}else if(typeof numObj=="number"){
		num=numObj;
	}
	//console.log(numObj+"    width    "+num);
	return num;
}
function getHeightNum(numObj,pDom){
	var num=0;
	var pEle=pDom?pDom:getBody(true);
	if(typeof numObj=="string"){
		if(numObj.indexOf("%")!=-1){
			num=parseInt(pEle.clientHeight*(parseFloat(numObj)/100));
		}else{
			try{
				num=parseFloat(numObj);
			}catch(e){
				num=0;
			}
		}
	}else if(typeof numObj=="number"){
		num=numObj;
	}
	//console.log(numObj+"    height    "+num);
	return num;
}

function changeFontColorBox(){
	var body=getBody();
	var container=createDom("div",body);
	container.className="change_font_color_box_container";
	var title=createDom("div",container);
	title.className="change_font_color_box_title";
	var titleIcon=createDom("span",title);
	titleIcon.className="change_font_color_box_title_icon";
	var titleText=createDom("span",title);
	titleText.className="change_font_color_box_title_text";
	titleText.innerHTML="改变文字颜色";
	var boxBody=createDom("div",container);
	boxBody.className="change_font_color_box_body";
	var contentTable=createDom("table",boxBody);
	contentTable.className="change_font_color_box_body_content_table";
	var tbody=createDom("tbody",contentTable);
	var tr=createDom("tr",tbody);
	var td1=createDom("td",tr);
	var td2=createDom("td",tr);
	var td3=createDom("td",tr);
}


//跨浏览器获取视口大小
function getInner(isTop) {
	var win=isTop?window.top:window;
    if(typeof window.innerHeight == 'undefined') {
        //alert("1");
        return {
            width : win.document.documentElement.clientWidth,
            height : win.document.documentElement.clientHeight
        }
    }else{
        //alert("2");
        return {
            width : win.innerWidth,
            height : win.innerHeight
        }
    }
}
//跨浏览器获取Style
function getStyle(element, attr) {
    if(typeof window.getComputedStyle != 'undefined') {//W3C
        return window.getComputedStyle(element, null)[attr];
    }else if(typeof element.currentStyle != 'undefined') {//IE
        return element.currentStyle[attr];
    }
}
//判断class是否存在
function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
//跨浏览器添加link规则
function inertRule(sheet, selectorText, cssText, position) {
    if(typeof sheet.insertRule != 'undefined') {//W3C
        sheet.insertRule(selectorText + '{' + cssText + '}', position);
    }else if(typeof sheet.addRule != 'undefined') {//IE
        sheet.addRule(selectorText, cssText, position);
    }
}
//跨浏览器删除link规则
function deleteRule(sheet, index) {
    if(typeof sheet.deleteRule != 'undefined') {//W3C
        sheet.deleteRule(index);
    }else if(typeof sheet.removeRule != 'undefined') {//IE
        sheet.removeRule(index);
    }
}
//此方法可以解决从一个系统访问另一个系统的页面被拒绝的问题
function openWin(url){
	var arg = '\u003cscript\u003elocation.replace("'+url+'")\u003c/script\u003e';
	//var arg = '<script>location.replace("'+url+'")<\/script>';
	window.open('javascript:window.name;', arg,"height=250, width=250,toolbar=no ,scrollbars="+scroll+",menubar=no");
}













