/*
 * author:heyongkui
 * e-mail:1181354012@qq.com
 * time:2018年01月25日
 * 实现转动 ：  传入要实现转动的div的id  转动的图片的路径数组
 * 
 */
var containerDiv,mainWidth,mainHeight,rotateData;
var imgIndex=0,lastIndex=0,imgs,speed=1,initWidth,initHeight,afterWidth,afterHeight,upWSpeed,upHSpeed,imgCount,imgWidth,imgHeight;
var timer;
function beginRotate(containerDiv,imgUrls){
	containerDiv=getDom(containerDiv);
	containerDiv.style.position="relative";
	mainWidth=containerDiv.clientWidth;//获取div的表面宽度
	mainHeight=containerDiv.clientHeight;//获取div的表面高度
	imgCount=imgUrls.length;
	getImgSize();
	mainWidth="200";mainHeight="150";
	var rotateDiv=createDom("div");
	rotateDiv.setAttribute("id","rotateDiv");
	rotateDiv.style.width=mainWidth+"px";
	rotateDiv.style.height=mainHeight+"px";
	rotateDiv.style.margin="180px auto";
	rotateDiv.style.transformStyle="preserve-3d";
	rotateDiv.style.webkitTransformStyle="preserve-3d";
	rotateDiv.style.mozTransformStyle="preserve-3d";
	rotateDiv.style.transition="2s";
	rotateDiv.style.webkitTransition="2s";
	rotateDiv.style.mozTransition="2s";
	rotateDiv.style.transform="rotateY(0deg) rotateX(-15deg) rotateZ(0deg)";
	rotateDiv.style.webkitTransform="rotateY(0deg) rotateX(-15deg) rotateZ(0deg)";
	rotateDiv.style.mozTransform="rotateY(0deg) rotateX(-15deg) rotateZ(0deg)";
	containerDiv.appendChild(rotateDiv);
	var ctrlDiv=createDom("div");
	ctrlDiv.setAttribute("id","ctrlDiv");
	ctrlDiv.style.width="100%";
	ctrlDiv.style.height="6%";
	ctrlDiv.style.position="absolute";
	ctrlDiv.style.left="0";
	ctrlDiv.style.bottom="0";
	ctrlDiv.style.background="#aaa";
	containerDiv.appendChild(ctrlDiv);
	var leftCtrlDiv=createDom("div");
	leftCtrlDiv.setAttribute("id","leftCtrlDiv");
	leftCtrlDiv.style.width="3%";
	leftCtrlDiv.style.height="6%";
	leftCtrlDiv.style.position="absolute";
	leftCtrlDiv.style.right="0";
	leftCtrlDiv.style.top="47%";
	leftCtrlDiv.style.background="#aaa";
	containerDiv.appendChild(leftCtrlDiv);
	var rightCtrlDiv=createDom("div");
	rightCtrlDiv.setAttribute("id","rightCtrlDiv");
	rightCtrlDiv.style.width="4%";
	rightCtrlDiv.style.height="7%";
	rightCtrlDiv.style.position="absolute";
	rightCtrlDiv.style.left="0";
	rightCtrlDiv.style.top="47%";
	rightCtrlDiv.style.background="#aaa";
	containerDiv.appendChild(rightCtrlDiv);
	var allowRotate=true;
	rotateData=getRotateData(imgUrls.length);
	for (var i = 0; i < imgUrls.length; i++) {
		var r_div=createDom("div");
		r_div.className="rotate_div";
		r_div.style.width=mainWidth+"px";
		r_div.style.height=mainHeight+"px";
		//r_div.style.border="5px outset #aaa";
		r_div.style.position="absolute";
		r_div.style.overflow="hidden";
		r_div.style.perspective="0px";
		r_div.style.webkitPerspective="0px";
		r_div.style.mozPerspective="0px";
		r_div.style.transformOrigin="center center 0px";
		r_div.style.webkitTransformOrigin="center center 0px";
		r_div.style.mozTransformOrigin="center center 0px";
		r_div.style.transform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
		r_div.style.webkitTransform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
		r_div.style.mozTransform="rotateY("+((i+1)*rotateData.rotateY)+"deg) translateZ("+rotateData.translateZ+"px)";
		r_div.style.background="url("+imgUrls[i]+") no-repeat";
		r_div.style.backgroundSize="100% 100%";
		rotateDiv.appendChild(r_div);
	}
	imgs=document.getElementsByClassName("rotate_div");
	//alert(getRotateByDirection(rotateDiv));
	initWidth=imgs[0].clientWidth;
	initHeight=imgs[0].clientHeight;
	afterWidth=(imgs[0].clientWidth)*2;
	afterHeight=(imgs[0].clientHeight)*2;
	upWSpeed=Math.ceil(initWidth/rotateData.rotateY);
	upHSpeed=Math.ceil(initHeight/rotateData.rotateY);
	imgIndex=imgs.length-1;
	lastIndex=imgIndex;
	setCurrentImgStyle();
	timer=window.setInterval(function(){
		if(allowRotate){
			startRotate();
		}else{
			return;
		}
	},5000);
}
	
function startRotate(domId){
	allowRotate=false;
	setLastImgStyle();
	imgIndex=(imgIndex==0?imgs.length-1:imgIndex-1);
	var timer;
	var rotateY=0;
	var targetRotate=rotateData.rotateY;
	var dom;
	if(!domId){
		dom=getDom("rotateDiv");
	}else{
		dom=getDom(domId);
	} 
	var rotateTimer=window.setInterval(function(){
		if(rotateY>=targetRotate){
			window.clearInterval(rotateTimer);
			window.setTimeout(imgUpper,1500);
			lastIndex=imgIndex;
		}else{
			rotateY+=speed;
			rotate(dom,speed);
		}
	},1);
}
//图片逐步放大方法  (效果不好没用)
function imgUpper(){
	var currImg=imgs[imgIndex];
	var lastImg=imgs[lastIndex];
	var i=1,left=0,top=0;;
	var upTimer=window.setInterval(function(){
		//lastImg.style.width=(lastImg.clientWidth-upWSpeed)+"px";
		//lastImg.style.height=(lastImg.clientHeight-upHSpeed)+"px";
		currImg.style.width=(currImg.clientWidth+upWSpeed)+"px";
		currImg.style.height=(currImg.clientHeight+upHSpeed)+"px";
		if(i%2==0){
			left+=upWSpeed;
			top+=upHSpeed;
			currImg.style.left="-"+left+"px";
			currImg.style.top="-"+top+"px";
		}
		if(currImg.clientWidth>=afterWidth){
			window.clearInterval(upTimer);
			allowRotate=true;
		}
		i++;
	},1);
}
//实现div旋转的方法
function rotate(dom,speed,direct,flag){	
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
	//alert(rotateX+"==="+rotateY+"==="+rotateZ);
	if(dir=="x"){
		dom.style.transform="rotateX("+(parseInt(rotateX)+rotateSpeed)+"deg) "+"rotateY("+rotateY+"deg) "+"rotateZ("+rotateZ+"deg)";
	}else if(dir=="y"){
		dom.style.transform="rotateX("+rotateX+"deg) "+"rotateY("+(parseInt(rotateY)+rotateSpeed)+"deg) "+"rotateZ("+rotateZ+"deg)";
	}else if(dir=="z"){
		dom.style.transform="rotateX("+rotateX+"deg) "+"rotateY("+rotateY+"deg) "+"rotateZ("+(parseInt(rotateZ)+rotateSpeed)+"deg)";
	}
}
//获取图片大小  角度转弧度的常量0.017453293
function getImgSize(){
	var width=mainWidth-100;
	var whRate=mainHeight/mainWidth;
	var angle=(180-(360/imgCount))/2*0.017453293;
	if(imgCount%2==1){
		imgWidth=Math.floor((2*width)/(Math.tan(angle)+(1/Math.cos(angle))));
		imgHeight=Math.floor(imgWidth*whRate);
	}else{
		if(imgCount%2%2==0){
			imgWidth=Math.floor((4*width)/(Math.tan(angle)));
			imgHeight=Math.floor(imgWidth*whRate);
		}else if(imgCount%2%2==1){
			imgWidth=Math.floor((4*width)/(1/Math.cos(angle)));
			imgHeight=Math.floor(imgWidth*whRate);
		}
	}
	//alert(imgWidth+"==="+imgHeight);
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
	rotateY=getRotateByDirection(dom);
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
//根据id获取dom元素
function getDom(id){
	return document.getElementById(id);
}
//创建dom元素
function createDom(domType,json){
	var dom=document.createElement(domType);
	if(!json){
		return dom;
	}
	setStyle(dom,json);
	return dom;
}
function setStyle(dom,json){
	if(json){
		for(var k in json){
			if(dom.style[k]){
				dom.style[k]=json[k];
			}
		}
	}
}	