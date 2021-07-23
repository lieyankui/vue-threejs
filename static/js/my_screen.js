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
//获取事件对象
function getEvent(e){
	return e||window.event;
}
//给元素添加事件
var addEvent=function(ele,type,fn,param){
	param=param||null;
	if(ele.addEventListener){
		ele.addEventListener(type,function(e){
			e=getEvent(e);
			fn(e,param);
		})
    }else if(ele.attachEvent){
    	ele.attachEvent("on"+type,function(e){
    		e=getEvent(e);
    		fn(e,param);
    	})
    }else{
    	ele["on"+type]=function(e){
    		e=getEvent(e);
    		fn(e,param);
    	}
    }
};
var removeEvent=function(ele,type,fn){
    if(ele.addEventListener){
    	ele.removeEventListener(type,fn)
    }else if(ele.attachEvent){
    	ele.detachEvent("on"+type,fn)
    }else{
    	ele["on"+type]=null
    }
}

//拖拽元素改变其尺寸执行的方法
var dragStart = function (e,screen) {
	var ele=e.target;
	if(!ele){
		return;
	}
	window.currDragEle=ele;
	window.currScreen=screen;
	var pEle=ele.parentNode;
	ele.initRelaPosi={x:e.pageX,y:e.pageY};
	//console.log("初始化相对坐标偏差值",ele.initRelaPosi);
	ele.isDrag=true;
	screen.setCurrScreen();
};
var dragMove = function (e) {
	if(!window.currDragEle){
		return;
	}
	var ele=window.currDragEle;
	if(!ele.isDrag){
		return;
	}
	var eleCursor=ele.style.cursor;
	if(!eleCursor||!eleCursor.length) return;
	var dir;
	if(eleCursor.indexOf("-")==-1) return;
	dir=eleCursor.substring(0,eleCursor.indexOf("-"));
	var pEle=ele.parentNode;
	var initRelaPosi=ele.initRelaPosi;
	var relaPosi={x:e.pageX,y:e.pageY};
	var moveX=relaPosi.x-initRelaPosi.x,moveY=relaPosi.y-initRelaPosi.y;
	var currScreen=window.currScreen;

	//console.log(moveX,moveY);
	//e  w  s  n   nw  ne  sw  se
	switch(dir){
		case "e":
			var width=(parseInt(pEle.style.width)+moveX)+"px";
			setStyle(pEle,{width:width});
			break;
		case "w":
			var width=(parseInt(pEle.style.width)-moveX)+"px";
			var left=(getLeftVal(pEle)+moveX)+"px";
			setStyle(pEle,{width:width,left:left});
			break;
		case "s":
			var height=(parseInt(pEle.style.height)+moveY)+"px";
			setStyle(pEle,{height:height});
			break;
		case "n":
			var height=(parseInt(pEle.style.height)-moveY)+"px";
			var top=(getTopVal(pEle)+moveY)+"px";
			setStyle(pEle,{height:height,top:top});
			break;
		case "nw":
			var width=(parseInt(pEle.style.width)-moveX)+"px";
			var left=(getLeftVal(pEle)+moveX)+"px";
			var height=(parseInt(pEle.style.height)-moveY)+"px";
			var top=(getTopVal(pEle)+moveY)+"px";
			setStyle(pEle,{height:height,top:top,width:width,left:left});
			break;
		case "ne":
			var width=(parseInt(pEle.style.width)+moveX)+"px";
			var height=(parseInt(pEle.style.height)-moveY)+"px";
			var top=(getTopVal(pEle)+moveY)+"px";
			setStyle(pEle,{height:height,top:top,width:width});
			break;
		case "sw":
			var width=(parseInt(pEle.style.width)-moveX)+"px";
			var left=(getLeftVal(pEle)+moveX)+"px";
			var height=(parseInt(pEle.style.height)+moveY)+"px";
			setStyle(pEle,{height:height,width:width,left:left});
			break;
		case "se":
			var width=(parseInt(pEle.style.width)+moveX)+"px";
			var height=(parseInt(pEle.style.height)+moveY)+"px";
			setStyle(pEle,{width:width,height:height});
			break;
		default:
			return;
	}
	ele.initRelaPosi=relaPosi;
	currScreen.autoCalcSize();
};

//拖拽元素改变其尺寸执行的方法
var dragStop = function (e) {
	if(!window.currDragEle){
		return;
	}
	var ele=window.currDragEle;
	ele.isDrag=false;
	ele.initRelaPosi=null;
	window.currDragEle=null;
	window.currScreen=null;
};
//屏幕工具栏对象
function MyScreenToolBar(){
	var self=this;
	var toolBar=createDom("div",document.body,{"text-align":"left",position:"fixed",bottom:0,left:0,height:"40px","line-height":"40px;",width:"100%",background:"rgba(135,206,235,0.8)",display:"block","z-index":999999});
	toolBar.setAttribute("id","myScreenToolBar");
	self.domObj=toolBar;
	self.screens=[];
	self.minScreens=[];
	return self;
}
MyScreenToolBar.prototype={
		addScreen:function(screen){
			var self=this;
			self.screens.push(screen);
		},
		minScreen:function(screen){
			var self=this;
			self.minScreens.push(screen);
			if(self.minScreens.length){
				setStyle(self.domObj,{display:"block"});
			}
			for (var i = 0; i < self.minScreens.length; i++) {
				var item=self.minScreens[i];
				if(item==screen){
					item.minFlag=true;
					screen.domObj.style.display="none";
					var screenItem=createDom("div",self.domObj);
					screenItem.className="my_screen_toolbar_title";
					screenItem.innerHTML=screen.title.innerHTML||"&#160;";
					screenItem.setAttribute("title","还原");
					screenItem.setAttribute("id",screen.domId+"_title");
					screenItem.onclick=function(){
						self.restoreScreen(this.id);
					};
					break
				}
			}
		},
		restoreScreen:function(titleId){
			var self=this;
			if(titleId){
				var domId=titleId.substring(0,titleId.lastIndexOf("_"));
				var screenDom=getDom(domId);
				setStyle(screenDom,{display:"inline-block"});
				var titleDom=getDom(titleId);
				self.domObj.removeChild(titleDom);
				var screenArr=self.minScreens;
				for (var i = 0; i < screenArr.length; i++) {
					if(screenArr[i].domId==domId){
						screenArr.splice(i,1);
						break;
					}
				}
			}
			if(self.minScreens&&self.minScreens.length==0){
				setStyle(self.domObj,{display:"none"});
			};
		}
};

function MyScreen(domId,styleObj){
	var dom=getDom(domId);
	if(dom){
		this.fistLoad=true;
		this.initHtml=dom.innerHTML;
		this.domId=domId;
		dom.innerHTML="";
		this.domObj=dom;
		this.pNode=dom.parentNode;
		this.initStyle=extend(MyScreen.Config,styleObj);
		dom.className="my_screen_container";
		setStyle(dom,{overflow:"hidden","min-width":"120px","min-height":"80px"});
		//创建header元素及其相关元素
		var header=createDom("div",dom);
		header.className="my_screen_header";
		var title=createDom("div",header);
		title.className="my_screen_header_title";
		var iconsDom=createDom("div",header);
		iconsDom.className="my_screen_header_icons";
		var minBtn=createDom("div",iconsDom);
		minBtn.className="my_screen_header_icon my_screen_header_icon_min";
		var maxBtn=createDom("div",iconsDom);
		maxBtn.className="my_screen_header_icon my_screen_header_icon_max";
		var closeBtn=createDom("div",iconsDom);
		closeBtn.className="my_screen_header_icon my_screen_header_icon_close";
		closeBtn.innerHTML="x";
		closeBtn.setAttribute("title","关闭");
		minBtn.innerHTML="-";
		minBtn.setAttribute("title","最小化");
		maxBtn.innerHTML="*";
		maxBtn.setAttribute("title","放大");
		//console.log(this.initStyle);
		if(this.initStyle.resizable==true){
			//创建屏幕四周拖拽改变尺寸的元素
			//右（东）
			var rightDragEle=createDom("div",dom);
			setStyle(rightDragEle,{width:"6px",height:"100%",position:"absolute",right:"-2px",cursor:"e-resize"});
			//左（西）
			var leftDragEle=createDom("div",dom);
			setStyle(leftDragEle,{width:"6px",height:"100%",position:"absolute",left:"-2px",cursor:"w-resize"});
			//下（南）
			var bottomDragEle=createDom("div",dom);
			setStyle(bottomDragEle,{height:"6px",width:"100%",position:"absolute",bottom:"-2px",cursor:"s-resize"});
			//上（北）
			var topDragEle=createDom("div",dom);
			setStyle(topDragEle,{height:"6px",width:"100%",position:"absolute",top:"-2px",cursor:"n-resize"});
			//西北
			var ltDragEle=createDom("div",dom);
			setStyle(ltDragEle,{width:"10px",height:"10px",position:"absolute",left:"-4px",top:"-4px","z-index":"5",cursor:"nw-resize"});
			//东北
			var rtDragEle=createDom("div",dom);
			setStyle(rtDragEle,{width:"10px",height:"10px",position:"absolute",right:"-4px",top:"-4px","z-index":"5",cursor:"ne-resize"});
			//西南
			var lbDragEle=createDom("div",dom);
			setStyle(lbDragEle,{height:"10px",width:"10px",position:"absolute",left:"-4px",bottom:"-4px","z-index":"5",cursor:"sw-resize"});
			//东南
			var rbDragEle=createDom("div",dom);
			setStyle(rbDragEle,{height:"10px",width:"10px",position:"absolute",right:"-4px",bottom:"-4px","z-index":"5",cursor:"se-resize"});
			var eventParamMap={
				e:{ele:rightDragEle,dir:"e"},
				w:{ele:leftDragEle,dir:"w"},
				s:{ele:bottomDragEle,dir:"s"},
				n:{ele:topDragEle,dir:"n"},
				nw:{ele:ltDragEle,dir:"nw"},
				ne:{ele:rtDragEle,dir:"ne"},
				sw:{ele:lbDragEle,dir:"sw"},
				se:{ele:rbDragEle,dir:"se"}
			};
			addEvent(rightDragEle,"mousedown",dragStart,this);
			addEvent(leftDragEle,"mousedown",dragStart,this);
			addEvent(bottomDragEle,"mousedown",dragStart,this);
			addEvent(topDragEle,"mousedown",dragStart,this);
			addEvent(ltDragEle,"mousedown",dragStart,this);
			addEvent(rtDragEle,"mousedown",dragStart,this);
			addEvent(lbDragEle,"mousedown",dragStart,this);
			addEvent(rbDragEle,"mousedown",dragStart,this);
			//给window添加鼠标放开事件
			addEvent(window,"mouseup",dragStop);
			addEvent(window,"mousemove",dragMove);
		}

		//创建content元素及其相关元素
		var contentOutter=createDom("div",dom);
		contentOutter.className="my_screen_content";
		var content=createDom("div",contentOutter);
		content.className="my_screen_content_inner";
		content.innerHTML=this.initHtml;
		//给screen对象属性赋值
		this.header=header;
		this.title=title;
		this.content=content;
		this.contentOutter=contentOutter;
		this.minBtn=minBtn;
		this.maxBtn=maxBtn;
		this.closeBtn=closeBtn;
		this.maxStyle={margin:0,width:"100%",height:"100%","z-index":9999,top:0,left:0};//,position:"absolute"
		this.initScreen();
		//toolBar.screens.push(this);
		//console.log(this);
		if(!this.__proto__.toolBar){
			this.__proto__.toolBar=new MyScreenToolBar();
			this.__proto__.toolBar.restoreScreen();
		}
		this.__proto__.toolBar.screens.push(this);
		this.toolBar=this.__proto__.toolBar;
	}else{
		throw new Error("未根据参数id属性值找到对应的元素");
	}
	//return this;
}
MyScreen.Config={
		width:"400px",
		height:"240px",
		position:"absolute",
		"z-index":1
};
MyScreen.prototype={
		toolBar:null,
		addDragResizeEvent:function(){

		},
		initScreen:function(){
			var self=this;
			this.initScreenSize();
			//最小化
			self.minBtn.onclick=function(){
				self.minScreen(self);
			};
			//最大化或者还原
			self.maxBtn.onclick=function(){
				self.maxScreen(self);
			};
			//关闭
			self.closeBtn.onclick=function(){
				self.closeScreen(self);
			};
			var absX=absY=0;
			self.isMove=false;
			var dom=self.domObj;
			self.header.onmousedown=function(event){
				self.isMove=true;
				var e1=event||window.event;
				self.setCurrScreen(self);
				absX=e1.pageX-getLeftVal(dom);
				absY=e1.pageY-getTopVal(dom);
				self.header.onmousemove=function(event){
					var e2=event||window.event;
					if(self.isMove){
						setStyle(self.domObj,{left:(e2.pageX-absX)+"px",top:(e2.pageY-absY)+"px"});
					}
				}
			}
			self.header.onmouseup=function(event){
				//setStyle(self.domObj,{"z-index":1});
				self.domObj.onmousemove=null;
				self.isMove=false;
				if(!self.maxFlag){
					self.initStyle.left=getLeftVal(self.domObj)+"px";
					self.initStyle.top=getTopVal(self.domObj)+"px";
				}
			}
			dom.onclick=function(){
				self.setCurrScreen(self);
			};
		},
		minScreen:function(self){
			//console.log(toolBar);
			self.toolBar.minScreen(self);
		},
		maxScreen:function(self){
			self.maxFlag=!self.maxFlag;
			if(self.maxFlag){
				this.setScreenMax();
			}else{
				this.initScreenSize();
			}
		},
		closeScreen:function(self){
			var pNode=self.domObj.parentNode;
			pNode.removeChild(self.domObj);
		},
		initScreenSize:function(){
			var self=this;
			self.maxFlag=false;
			//console.log(self.initStyle);
			if(this.fistLoad){
				this.fistLoad=false;
				var screenNum=getDomByClass("my_screen_container").length;
				var rowItemNum=parseInt(pageWidth/(parseInt(self.initStyle.width)+10));
				var rowNum=Math.ceil(screenNum/rowItemNum);
				var colNum=screenNum%rowItemNum;
				if(colNum==0){colNum=rowItemNum};
				//alert(screenNum+"==="+rowItemNum);
				self.initStyle.left=(--colNum*(parseInt(self.initStyle.width)+10))+"px";
				self.initStyle.top=(--rowNum*(parseInt(self.initStyle.height)+10))+"px";
			}
			document.body.style.overflow="auto";
			setStyle(self.domObj,extend(self.initStyle,{margin:"10px","z-index":1}));
			setStyle(self.contentOutter,{height:(self.domObj.clientHeight-40)+"px"});
			setStyle(self.content,{height:(self.domObj.clientHeight-46)+"px"});
			self.maxBtn.setAttribute("title","放大");
		},
		setScreenMax:function(){
			var self=this;
			document.body.style.overflow="hidden";
			setStyle(self.domObj,self.maxStyle);
			/*setStyle(self.contentOutter,{height:(self.domObj.clientHeight-40)+"px"});
			setStyle(self.content,{height:(self.domObj.clientHeight-46)+"px"});*/
			this.autoCalcSize();
			self.maxBtn.setAttribute("title","还原");
			/*setStyle(self.domObj,{height:(pageHeight-4)+"px",width:pageWidth+"px"});
			setStyle(self.contentOutter,{height:(pageHeight-44)+"px"});
			setStyle(self.content,{height:(pageHeight-50)+"px"});*/
		},
		//自动计算尺寸
		autoCalcSize:function(){
			var self=this;
			setStyle(self.contentOutter,{height:(self.domObj.clientHeight-40)+"px"});
			setStyle(self.content,{height:(self.domObj.clientHeight-46)+"px"});
		},
		setTitle:function(title){
			var self=this;
			self.title.innerHTML=title;
		},
		setCurrScreen:function(){
			var self=this;
			if(self.toolBar.screens&&self.toolBar.screens.length){
				var screens=self.toolBar.screens;
				for (var i = 0; i < screens.length; i++) {
					var item=screens[i];
					if(item==self){
						setStyle(item.domObj,{"z-index":20});
					}else{
						setStyle(item.domObj,{"z-index":1});
					}
				}
			}else{
				console.error(new Error("设置当前元素错误"));
			}
		}
};

//拖拽事件相关
function $(id) {
    return document.getElementById(id);
}
function getEvent(e) {
    return e || window.event;
}
function getLocation(e) {
    return {
        x: e.x || e.clientX,
        y: e.y || e.clientY
    }
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
