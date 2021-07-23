//定义变量接收页面高度和页面宽度
var pageHeight,pageWidth;
pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
//页面尺寸改变时更新页面尺寸参数
window.onresize=function(){
	 pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
 	 pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
}
var domUtil={};
//合并json数据
var extend=function(des, src) {
    for (p in src) {
      des[p]=src[p];
    }
    return des;
}
//根据dom的id使元素居中(使用限制：父标签为body元素);
function makeEleAlignCenter(id){
	var ele=document.getElementById(id);
	var width=ele.clientWidth;
	var height=ele.clientHeight;
	ele.style.position="absolute";
	ele.style.left=(parseInt(pageWidth/2)-parseInt(width/2))+"px";
	ele.style.top=(parseInt(pageHeight/2)-parseInt(height/2))+"px";
}
//在页面中随机一个位置  参数一
function randomPoint(domInfo,pDom){
	var xRange,yRange;
	if(domInfo){
		xRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientWidth:pageWidth)-domInfo.width-20))+10;
		yRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientHeight:pageHeight)-domInfo.height-20))+10;
	}else{
		xRange=Math.round(Math.random()*(pageWidth));
		yRange=Math.round(Math.random()*(pageHeight));
	}
	return {x:parseInt(xRange),y:parseInt(yRange)};
}
//给dom元素随机位置  isOver 为是否可以覆盖  默认为true
function randomPosition(dom,isOver){
	var domInfo={height:dom.clientHeight,width:dom.clientWidth};
	var positionInfo=randomPoint(domInfo,mainDiv);
	dom.style.left=positionInfo.x+"px";
	dom.style.top=positionInfo.y+"px";
	if(!isOver){
		if(domIsOverlap(dom)){
			randomPosition(dom);
		}
	}
}
//在页面中随机x方向位置
function randomX(domInfo,pDom){
	var xRange;
	if(domInfo){
		xRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientWidth:pageWidth)-domInfo.width-20))+10;
	}else{
		xRange=Math.round(Math.random()*(pageWidth));
	}
	return xRange;
}
//在页面中随机y方向位置
function randomY(domInfo,totalH){
	var yRange;
	if(domInfo){
		yRange=Math.round(Math.random()*(parseInt(pDom?pDom.clientHeight:pageHeight)-domInfo.height-20))+10;
	}else{
		yRange=Math.round(Math.random()*(pageHeight));
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
	rotateY=getRotateByDirection(dom,"y");
	rotateZ=getRotateByDirection(dom,"z");
	var rotateInfo={rotateX:rotateX,rotateY:rotateY,rotateZ:rotateZ};
	if(direction){
		return rotateInfo[direction];
	}else{
		return rotateInfo;
	}
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
//获取参数元素距离页面左侧和上边框的值
function getXAndY(target){
	var left=target.offsetLeft;
	var top=target.offsetTop;
	var pNode=target.offsetParent;
	if(pNode){
		var xyInfo=getXAndY(pNode);
		left+=xyInfo.left;
		top+=xyInfo.top;
	}
	return {left:left,top:top};
}
//鼠标滚动时div内的内容随之滚动
function onMouseScroll(e){
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
function getHeight(dom,isContainerMargin){
	var height=dom.offsetHeight;
	if(isContainerMargin){
		height+=(parseInt(dom.style.marginTopWidth)||0+parseInt(dom.style.marginBottomWidth)||0);
	}
	return height;
}
function getWidth(dom,isContainerMargin){
	var width=dom.offsetWidth;
	if(isContainerMargin){
		width+=(parseInt(dom.style.marginLeftWidth)||0+parseInt(dom.style.marginRightWidth)||0);
	}
	return width;
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
//根据class获取元素
function getDomByClass(className){
    var elems = [];
    if(!document.getElementsByClassName){
        var dom = document.getElementByTagName('*');
        for(var i = 0;i<dom.length;i++){
            if(dom[i].className == className)
                 elems.push(dom[i]);
        }
    }else{
        elems = document.getElementsByClassName(className);
    }
    return elems;
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
//获取body元素
function getBody(isTop){
	var win=isTop?window.top:window;
	return win.document.body||win.document.getElementsByTagName("body")[0];
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
	var message=paramObj.message||"";
	var title=paramObj.title||"系统提示";
	var sureText=paramObj.sureText||"确定";
	var cancleText=paramObj.cancleText||"取消";
}