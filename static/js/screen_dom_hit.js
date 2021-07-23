//定义变量接收页面高度和页面宽度
var pageHeight,pageWidth;
pageHeight=document.body?document.body.clientHeight:document.documentElement.clientHeight;
pageWidth=document.body?document.body.clientWidth:document.documentElement.clientWidth;

//合并json数据
var extend=function(des, src) {
    for (p in src) {
      des[p]=src[p];
    }
    return des;
}
var MoveEle=function(dom,config){
	var self=this;
	self.domObj=dom;
	self.moveParam={
		xSpeed:1,
		ySpeed:1,
		rotateSpeedX:0,
		rotateSpeedY:0,
		rotateSpeedZ:0,
		//dir:'x',
		minX:0,
		minY:0
	};
	//console.log(MoveEle.Config);
	self.config=extend(MoveEle.Config,config);
	setStyle(dom,self.config);
	var pNode=self.domObj.parentNode;
	self.moveParam.maxX=parseInt(pNode.clientWidth-dom.clientWidth);
	self.moveParam.maxY=parseInt(pNode.clientHeight-dom.clientHeight);
	window.onresize=function(){
		self.moveParam.maxX=parseInt(pNode.clientWidth-dom.clientWidth);
		self.moveParam.maxY=parseInt(pNode.clientHeight-dom.clientHeight);
	};
	return self;
};
MoveEle.prototype={
	move:function(){
		var self=this;
			self.moveTimer=window.setInterval(function(){
				self.domObj.style.left=(getLeftVal(self.domObj)+self.moveParam.xSpeed)+"px";
				self.domObj.style.top=(getTopVal(self.domObj)+self.moveParam.ySpeed)+"px";
				//超出最大值从0开始
				self.domObj.style.left=(getLeftVal(self.domObj)>=self.moveParam.maxX?0:getLeftVal(self.domObj))+"px";
				self.domObj.style.top=(getTopVal(self.domObj)>=self.moveParam.maxY?0:getTopVal(self.domObj))+"px";
				rotateDom(self.domObj,{x:self.moveParam.rotateSpeedX,y:self.moveParam.rotateSpeedY,z:1});
			},10);
			self.speedTimer=window.setInterval(function(){
				self.randomSpeed(self);
			},Math.ceil(Math.random()*1000)+4000);
	},
	randomSpeed:function(self){
		self.moveParam.xSpeed=Math.round(Math.random()*3+1);
		self.moveParam.rotateSpeedX=Math.round(Math.random()*6-3);
		self.moveParam.rotateSpeedY=Math.round(Math.random()*6-3);
		self.moveParam.rotateSpeedZ=Math.round(Math.random()*6-3);
	},
	setSpeed:function(speedObj){
		self.moveParam.xSpeed=speedObj.xSpeed;
		self.moveParam.ySpeed=speedObj.ySpeed;
	},
	stop:function(){
		var self=this;
		window.clearInterval(self.moveTimer);
	},
	initPosition:function(){
		this.setPostion({x:0,y:0});
	},
	setPostion:function(positionInfo){
		self.domObj.style.left=positionInfo.x+"px";
		self.domObj.style.top=positionInfo.y+"px";
	},
	isOutBound:function(){
		var self=this;
		var xBound=false,yBound=false;
		if(getTopVal(self.domObj)>=self.moveParam.maxY&&getLeftVal(self.domObj)>=self.moveParam.maxX){
			xBound=true;yBound=true;
		}else if(getLeftVal(self.domObj)>=self.moveParam.maxX){
			xBound=true;yBound=false;
		}else if(getTopVal(self.domObj)>=self.moveParam.maxY){
			xBound=false;yBound=true;
		}
		self.moveParam.xBound=xBound;
		self.moveParam.yBound=yBound;
		return {xBound:xBound,yBound:yBound};
	},
	changeSpeed:function(speed,speedFlag){
		var self=this;
		if(!speedFlag){
			speedFlag="x";
		}
		if(speedFlag=="x"){
			self.moveParam.xSpeed=speed;
		}else{
			self.moveParam.ySpeed=speed;
		}
	},
	setStyle:function(styleJson){
		var self=this;
		setStyle(self.domObj,styleJson);
	}
};

MoveEle.Config={
	background:"#FFFFFF",
	content:"",
	color:"#000000",
	borderColor:"#000000",
	borderWidth:"1px",
	borderStyle:"solid",
	display:"inline-block",
	position:'absolute',
};
var Screen=function(domId,config){
	//先创建类的属性
	var self=this;
	if (!(self instanceof Screen)) {
	    return new Screen(domId,config)
	}
	var dom=getDom(domId);
	self.domObj=dom;
	self.config=extend(Screen.Config,config);
	with(self.domObj.style){
		boxSizing="border-box";
		overflow="hidden";
	}
	self.eleNum=config.eleNum;//元素个数
	self.diameter=56;            //球的直径
	self.radius=self.diameter/2;
	self.spring=config.spring;       //球相碰后的反弹力
	self.bounce=config.bounce;       //球碰到窗口边界后的反弹力
	self.gravity=config.gravity;      //球的重力
	self.balls=[];             //把创建的球置于该数组变量
	self.timer=null;            //调用函数产生的时间id
	self.L_bound=0;            //container的边界
	self.R_bound=self.domObj.clientWidth;
	self.T_bound=0;
	self.B_bound=self.domObj.clientHeight;
	return self;
};
Screen.prototype={
	createBalls:function(eleNum){
		var self=this;
		if(eleNum){
			Screen.Config.eleNum=eleNum;
			self.config.eleNum=eleNum;
		}
		for (var i = 0; i < eleNum; i++) {
			var dom=createDom("div",self.domObj,{width:'40px',height:'40px',borderRadius:'20px',textAlign:'center',lineHeight:'40px'});
			var moveEle=new MoveEle(dom);
			self.balls.push(moveEle);
			moveEle.move();
		}
	},

};
Screen.Config={
	eleNum:10,//元素个数
	spring:0.8,//球相碰后的反弹力
	bounce:-0.9,//球碰到窗口边界后的反弹力
	gravity:0.05//球的重力
};
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
//转动传入的元素 指定的角度
//转动传入的元素 指定的角度
function rotateDom(dom,confInfo){
	var rotateConf={x:0,y:0,z:0};
	if(confInfo){
		rotateConf=extend(rotateConf,confInfo);
	}
	var currAngle=0;
	currAngleX=getRotateByDirection(dom,"x");
	currAngleY=getRotateByDirection(dom,"y");
	currAngleZ=getRotateByDirection(dom,"z");
	currAngleX=currAngleX?currAngleX:0;
	currAngleY=currAngleY?currAngleY:0;
	currAngleZ=currAngleZ?currAngleZ:0;
	//var addAngle=rotateConf.addAngle?rotateConf.addAngle:1;
	//alert(currAngle+"==="+addAngle);
	dom.style.transform="rotatez("+(currAngleZ+rotateConf.z)+"deg) rotatex("+(currAngleX+rotateConf.x)+"deg) rotatey("+(currAngleY+rotateConf.y)+"deg)";
};
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
//给dom元素随机位置
function randomPosition(dom){
	var domInfo={height:dom.clientHeight,width:dom.clientWidth};
	//console.log(domInfo);
	var positionInfo=randomPoint(domInfo,mainDiv);
	//console.log(positionInfo);
	dom.style.left=positionInfo.xRange+"px";
	dom.style.top=positionInfo.yRange+"px";
	if(domIsOverlap(dom)){
		randomPosition(dom);
	}
}
//randomPoint(domInfo,totalH,totalW);
//获取元素所占的范围
function getDomRange(dom){
	var minX=getLeftVal(dom);
	var minY=getTopVal(dom);
	var dataId=dom.getAttribute("dataId");
	if(window["movedDom"+dataId]){
		if(window["movedDom"+dataId].dir=="x"){
			minX=window["movedDom"+dataId].speed+minX;
		}else{
			minY=window["movedDom"+dataId].speed+minY;
		}
	}
	var maxX=Math.ceil(minX+dom.clientWidth);
	var maxY=Math.ceil(minY+dom.clientHeight);
	//console.log("domRange",{left:left,top:top});
	return {minX:minX,minY:minY,maxX:maxX,maxY:maxY};
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
//判断是否和统计的dom元素重叠
function domIsOverlap(dom){
	var flag=false;
	var domRange=getDomRange(dom);
	var doms=dom.parentNode.children;
	var broDoms=[];
	for (var i = 0; i < doms.length; i++) {
		if(dom!==doms[i]){//是兄弟元素
			//broDoms.push(doms[i]);
			var domRangeBro=getDomRange(doms[i]);
			if(isOverLap(dom,doms[i])){
				flag= true;
				break;
			}
		}
	}
	return flag;
	//alert(doms.length+"==="+broDoms.length);
}
//判断两个元素是否重叠
function isOverLap(dom1,dom2){
	var domRange1=getDomRange(dom1);
	var midPoint1X=domRange1.minX+Math.ceil(Math.abs(domRange1.maxX-domRange1.minX)/2);
	var startPoint1X=Math.ceil(Math.abs(domRange1.maxX-domRange1.minX)/2+3);
	var midPoint1Y=domRange1.minY+Math.ceil(Math.abs(domRange1.maxY-domRange1.minY)/2);
	var startPoint1Y=Math.ceil(Math.abs(domRange1.maxY-domRange1.minY)/2+2);
	var domRange2=getDomRange(dom2);
	var midPoint2X=domRange2.minX+Math.ceil(Math.abs(domRange2.maxX-domRange2.minX)/2);
	var startPoint2X=Math.ceil(Math.abs(domRange2.maxX-domRange2.minX)/2+3);
	var midPoint2Y=domRange2.minY+Math.ceil(Math.abs(domRange2.maxY-domRange2.minY)/2);
	var startPoint2Y=Math.ceil(Math.abs(domRange2.maxY-domRange2.minY)/2+2);
	if(!(Math.abs(midPoint1X-midPoint2X)>(startPoint1X+startPoint2X))&&!(Math.abs(midPoint1Y-midPoint2Y)>(startPoint1Y+startPoint2Y))){
		return true;
	}else{
		return false;
	}

}
//获取left值
function getLeftVal(dom){
	var left=dom.style.left;
	if(!left){
		left=dom.clientLeft;
	}/*else{
		//var i=left.indexOf("p");
		//left=left.substring(0,i);
		//left=parseInt(left);
	}*/
	return parseInt(left);
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
    var o=Math.random();
    return "rgba("+r+','+g+','+b+','+1+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}