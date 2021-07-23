/*
 * author:heyongkui
 * e-mail:1181354012@qq.com
 * time:2019年08月13日
 * 实现转动 ：  传入要实现转动的div的id  转动的图片的路径数组
 *
 *
 * 一、把传入的元素作为一个滚动的盒子
 * 添加元素 1、向左滚动的按钮2、向右滚动的按钮3、点击转动到指定图片的按钮工具栏和按钮
 * 4、添加转动的图片元素
 */


//定义变量接收页面高度和页面宽度
var pageHeight,pageWidth;
pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
//页面尺寸改变时更新页面尺寸参数
window.onresize=function(){
	 pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
 	 pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;
}
var roorPath=getRootPath();



//创建转动轮播图的构造方法
function RotateBox(domId,imgArr,setting){
	if(imgArr&&imgArr.length){
		var self=this;
		var box=getDom(domId);
		if(box){
			self.domObj=box;
			self.imgNum=imgArr.length;
			self.allowRotate=true;
			//初始化参数配置
			var defaultSetting={
				rotateSpeed:1,
				btnStyle:{
					width:"40px",
					height:"40px",
					position:"absolute",
				},
				boxStyle:{
					position:"relative"
				},
				imgStyle:{
					position:"absolute",
					overflow:"hidden",
					perspective:"0px",
					"webkit-perspective":"0px",
					"moz-perspective":"0px",
					"transform-origin":"center center 0px",
					"webkit-transform-origin":"center center 0px",
					"moz-transform-origin":"center center 0px",
				},
				imgBoxStyle:{
					position:"absolute",
					"transform-style":"preserve-3d",
					"webkit-transform-style":"preserve-3d",
					"moz-transform-style":"preserve-3d",
					//"transition":"0s",
					//"webkit-transition":"0s",
					//"moz-transition":"0s",
					"transform":"rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
					"webkit-transform":"rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
					"moz-transform":"rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
				}
			};
			//如果有自定义设置采用自定义设置
			if(setting){
				defaultSetting=extend(defaultSetting,setting);
				defaultSetting.btnStyle.width=defaultSetting.btnStyle.width.indexOf("px")==-1?defaultSetting.btnStyle.width+"px":defaultSetting.btnStyle.width;
				defaultSetting.btnStyle.height=defaultSetting.btnStyle.height.indexOf("px")==-1?defaultSetting.btnStyle.height+"px":defaultSetting.btnStyle.height;
			};
			self.settingObj=defaultSetting;
			self.rotateSpeed=self.settingObj.rotateSpeed;
			//给必要的属性赋值
			self.height=box.clientHeight||parseInt(box.style.height);
			self.width=box.clientWidth||parseInt(box.style.width);
			defaultSetting.btnStyle.top=(self.height-parseInt(defaultSetting.btnStyle.height))/2+"px";
			setStyle(box,defaultSetting.boxStyle);//给盒子设置必要的样式
			//获取图片的宽度和高度
			self.imgSize=self.getImgSize();
			//console.log(self.settingObj);
			//console.log(Math.round(Math.sin(0.017453293*30)*100)/100);
			//创建左右按钮
			var leftBtn=createDom("div",box,
				{width:defaultSetting.btnStyle.width,height:defaultSetting.btnStyle.height,
				background:"url('../imgs/arrow-left.png')",
				"background-size":"100% 100%",
				position:"absolute",left:"0px",top:defaultSetting.btnStyle.top
			});
			var rightBtn=createDom("div",box,
				{width:defaultSetting.btnStyle.width,height:defaultSetting.btnStyle.height,
				background:"url('../imgs/arrow-right.png')",
				"background-size":"100% 100%",
				position:"absolute",right:"0px",top:defaultSetting.btnStyle.top
			});
			//把图片数组放入此变量
			self.imgArr=[];
			//创建一个放置图片的元素 并设置样式
			self.settingObj.imgBoxStyle.left=(parseInt(self.width)-parseInt(self.imgSize.width))/2+"px";
			//console.log(self);
			var imageBoxDiv=createDom("div",box,self.settingObj.imgBoxStyle);
			setStyle(imageBoxDiv,{width:(self.imgSize.width+8)+"px",height:(self.imgSize.height+8)+"px"});
			box.appendChild(imageBoxDiv);
			self.imgBox=imageBoxDiv;
			self.imgBoxRange=self.getImgBoxRange();
			imageBoxDiv.style.margin=Math.floor((self.height-self.imgBoxRange.height/2)/2)+"px auto";
			//获取转动所需参数
			var rotateData=self.getRotateData(self.imgNum);
			self.rotateData=rotateData;
			//console.log(self.imgSize);
			//遍历创建图片
			for (var i = 0; i < imgArr.length; i++) {
				var imgDom=createDom("div",imageBoxDiv,defaultSetting.imgStyle);
				setStyle(imgDom,self.settingObj.imgStyle);
				setStyle(imgDom,{background:"url("+roorPath+"/assets/"+imgArr[i].url+")","background-size":"100% 100%"});
				imgDom.style.transform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
				imgDom.style.webkitTransform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
				imgDom.style.mozTransform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
				imgDom.setAttribute("imgIndex","img"+i);
				imgDom.innerHTML="img"+i;
				self.imgArr.push(imgDom);
				self.imgArrData=imgArr;
				//给图片添加点击事件
				addEvent(imgDom,"click",function(e,param){
					var index=param.index;
					var self=param.self;
					var imgArrData=self.imgArrData;
					console.log(imgArrData[index].href);
					window.open(imgArrData[index].href);
				},{self:self,index:i});
			}
			//给盒子对象的左右滚动按钮赋值
			self.leftBtn=leftBtn;
			self.rightBtn=rightBtn;

			self.startRotate();
			//给rotateBox中的相关元素添加事件
			addEvent(self.domObj,"mouseover",function(e,param){
				param.stopRotate(1);
			},self);
			addEvent(self.domObj,"mouseout",function(e,param){
				param.startRotate(1);
			},self);
			addEvent(leftBtn,"click",function(e,param){
				param.rotateSpeed=-Math.abs(param.rotateSpeed);
				param.rotateBox();
			},self);
			addEvent(rightBtn,"click",function(e,param){
				param.rotateSpeed=Math.abs(param.rotateSpeed);
				param.rotateBox();
			},self);
		}else{
			throw new Error("未找到参数元素,请重试");
		}
	}else{
		throw new Error("请检查传入的参数是否正确。\n第一个参数为元素的id属性值，第二个参数为图片数组");
	}
}
//
RotateBox.prototype={
	//构造方法
	constructor:RotateBox,
	//获取转动的图片在视觉上占得长度和宽度
	getImgBoxRange:function(){
		var self=this;
		var imgBox=self.imgBox;
		var width=self.width-200;
		var angle=15*0.017453293;
		var height=Math.ceil(width*Math.sin(angle))+self.imgSize.height;
		return {width:width,height:height};
	},
	//获取图片尺寸
	getImgSize:function(){
		var self=this;
		if(self.imgNum==0){
			return;
		}
		var width=Math.round(self.width*0.8);
		var whRate=self.height/self.width;
		var n=self.imgNum;//(self.imgNum%2==1?self.imgNum+1:self.imgNum)
		var angle=(90-(180/n))*0.017453293;
		width=Math.floor((width)*(Math.cos(angle)));
		height=Math.floor(width*whRate);
		self.settingObj.imgStyle.width=width+"px";
		self.settingObj.imgStyle.height=height+"px";
		//console.log({width:width,height:height});
		return {width:width,height:height};
	},
	getRotateData:function(n){
		var self=this;
		if(n&&parseInt(n)){
			n=parseInt(n);
			var rotateY=360/n;
			var a=(180-(360/n))/2;
			var translateZ=Math.ceil(Math.tan((180-(360/n))/2*0.017453293)*self.imgSize.width/2)+50;
			return {rotateY:rotateY,translateZ:translateZ};
		}else{
			return null;
		}
	},
	startRotate:function(flag){
		var self=this;
		if(!flag){
			self.allowRotate=true;
		}
		self.startTimer=setInterval(function(){
			self.rotateBox();
		},3000);
	},
	rotateBox:function(){
		var self=this;
		if(!self.allowRotate){
			return;
		}
		self.allowRotate=false;
		var rotateData=self.rotateData;
		var rotateAngle=rotateData.rotateY;
		var speed=self.rotateSpeed;
		var rotateEle=self.imgBox;
		var rotateY=0;
		self.rotateTimer=setInterval(function(){
			if(rotateY>=rotateAngle){
				self.allowRotate=true;
				clearInterval(self.rotateTimer);
				rotateY=0;
			}else{
				rotate(rotateEle,speed);
				rotateY+=Math.abs(speed);
			}

		},20);
	},
	stopRotate:function(flag){
		var self=this;
		clearInterval(self.startTimer);
		if(!flag){
			self.allowRotate=false;
		}
	},
	rotate:function(){

	},
};
//实现div旋转的方法
function rotate(dom,speed,direct){
	var dir,rotateSpeed,rotateX,rotateY,rotateZ;
	if(direct){
		dir=direct;
	}else{
		dir="y";
	}
	if(speed){
		rotateSpeed=speed;
	}else{
		rotateSpeed=1;
	}
	var rotateInfo=getCurrentRotate(dom);
	rotateX=rotateInfo.rotateX;
	rotateY=rotateInfo.rotateY;
	rotateZ=rotateInfo.rotateZ;
	//console.log((rotateX+"==="+rotateY+"==="+rotateZ));
	if(dir=="x"){
		dom.style.transform="rotateX("+(rotateX+rotateSpeed)+"deg) "+"rotateY("+rotateY+"deg) "+"rotateZ("+rotateZ+"deg)";
	}else if(dir=="y"){
		dom.style.transform="rotateX("+rotateX+"deg) "+"rotateY("+(rotateY+rotateSpeed)+"deg) "+"rotateZ("+rotateZ+"deg)";
	}else if(dir=="z"){
		dom.style.transform="rotateX("+rotateX+"deg) "+"rotateY("+rotateY+"deg) "+"rotateZ("+(rotateZ+rotateSpeed)+"deg)";
	}
}
//计算rotateY和translateZ的值;
function getRotateData(n){
	if(n&&parseInt(n)){
		n=parseInt(n);
		var rotateY=360/n;
		var a=(180-(360/n))/2;
		var translateZ=Math.ceil(Math.tan((180-(360/n))/2*0.017453293)*mainWidth/2)+50;
		return {rotateY:rotateY,translateZ:translateZ};
	}else{
		return null;
	}
}
//获取图片大小  角度转弧度的常量0.017453293
function getImgSize(domId,n){
	var dom=document.getElementById(domId);
	var width=getWidth(dom);
	var height=getHeight(dom);
	var whRate=height/width;
	width=Math.round(width*0.88);
	var angle=(90-(180/n))*0.017453293;
	width=Math.floor((width)*(Math.cos(angle)));
	height=Math.floor(width*whRate);
	//console.log({width:width,height:height});
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
//给元素添加事件   params:1、要添加事件的元素2、事件的类型 如：click3、回调函数4,、回调函数的参数
function addEvent(obj,eventType,callback,param){
	obj.addEventListener(eventType,function(e){
		if(param){
			callback(e,param);
		}else{
			callback(e);
		}
	});
};
//取消绑定事件
function removeEvent(obj,eventType,callback){
	obj.removeEventListener(type,function(){
		if(callback){
			callback();
		}
	});
}
//设置图片的样式
function setImgStyle(){
	dom.style.top="-"+(initHeight)+"px";
	dom.style.left="-"+(initWidth/2)+"px";
	dom.style.width=afterWidth+"px";
	dom.style.height=afterHeight+"px";
	dom.style.transform="rotateY("+((imgIndex+1)*rotateData.rotateY)+"deg) translateZ("+(rotateData.translateZ+100)+"px)";
}
//设置当前显示的图片的样式
function setCurrentImgStyle(){
	var dom=imgs[imgIndex];
	dom.style.top="-"+(initHeight)+"px";
	dom.style.left="-"+(initWidth/2)+"px";
	dom.style.width=afterWidth+"px";
	dom.style.height=afterHeight+"px";
	dom.style.transform="rotateY("+((imgIndex+1)*rotateData.rotateY)+"deg) translateZ("+(rotateData.translateZ+100)+"px)";
}
//设置上一张图片的样式
function setLastImgStyle(){
	var lastDom=imgs[lastIndex];
	lastDom.style.width=initWidth+"px";
	lastDom.style.height=initHeight+"px";
	lastDom.style.top="0px";
	lastDom.style.left="0px";
	lastDom.style.transform="rotateY("+((lastIndex+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
}
//判断如果参数大于360就取余
function initAngle(angle){
	if(angle&&angle>=360){
		return angle%360;
	}
	return angle;
}
//获取下一张图片下标
function getNextImgIndex(){
	if(speed>0&&imgIndex==imgs.length-1){
		return 0;
	}else if(speed>0&&imgIndex==0){
		return imgs.length-1;
	}else{
		imgIndex+1;
	}
}
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

//获取项目跟路径
function getRootPath(){
	  var strFullPath=window.document.location.href;
	  var strPath=window.document.location.pathname;
	  var pos=strFullPath.indexOf(strPath);
	  var prePath=strFullPath.substring(0,pos);
	  var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
	  return prePath+postPath;
}
//合并json数据
function extend(des, src) {
    for (p in src) {
      des[p]=src[p];
    }
    return des;
}
//dom相关操作方法
//根据dom的id使元素居中
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
function rotateDom(dom,addAngle,dir){
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

//获取left属性值
function getLeftVal(dom){
	var left=dom.style.left||dom.clientLeft;
	return parseInt(left);
}
//获取top属性值
function getTopVal(dom){
	var top=dom.style.top||dom.clientTop;
	return parseInt(top);
}
//获取元素所占的范围
function getDomRange(dom){
	var minX=getLeftVal(dom);
	var minY=getTopVal(dom);
	var maxX=Math.ceil(minX+dom.clientWidth);
	var maxY=Math.ceil(minY+dom.clientHeight);
	return {minX:minX,minY:minY,maxX:maxX,maxY:maxY};
}
//获取元素的中心点
function getDomCenter(dom){
	var minX=getLeftVal(dom);
	var minY=getTopVal(dom);
	var center={x:minX+dom.clientWidth/2,y:minY+dom.clientHeight/2};
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
