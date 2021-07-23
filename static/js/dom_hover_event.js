/*
* author:heyongkui
* 功能：addHoverEvent：给参数元素添加鼠标悬浮事件，鼠标悬浮显示提示框
*   mask：实现类似新手引导功能（第一步、第二部等）       
* 参数：1、参数元素的id或者dom元素  2、悬浮提示框中的内容（最好是innerHTML）
*
*/
//模拟新手引导  参数格式
/*var params=[
	{id:"hover1",desc:"内容3333333333333333333333333333333333333333333333333333",dir:"top"},
	{id:"hover2",desc:"内容4444444444444444444444444444444444",dir:"bottom"},
	{id:"hover3",desc:"内容内容11111111",dir:"right"},
	{id:"hover4",desc:"内容222222222222",dir:"left"}
];*/
//id为元素的id属性值   desc为悬浮框显示的内容  dir为悬浮框显示在元素的那个方向  left/right/top/bottom
function mask(params) {
    var mask = $byId('guider_mask');
    var body=document.body||document.getElementsByTagName('body')[0];
    if(!mask){
    	mask=document.createElement("div");
    	mask.setAttribute("id","guider_mask");
    	body.appendChild(mask);
    }
    if (params.length === 0) {
        mask.style.display = 'none';
        var tooltip=getDomByClass("hover_tooltip")[0];
        tooltip.style.display = 'none';
        return;
    }

    //var {id, desc, dir} = params[0];
    var id=params[0].id;
    var content=params[0].desc;
    var dir=params[0].dir;

    /****************   获取要cover的元素基本信息   ****************/
    var ele = $byId(id);
    var offsetWidth = getWidth(ele);
    var offsetHeight = getHeight(ele);
    //console.log(offsetWidth+"aaaaa==="+offsetHeight);
    //console.log("元素宽度",offsetWidth);
    var posiInfo=getXAndY(ele);
    var offsetLeft = posiInfo.left;
    var offsetTop = posiInfo.top;

    //console.log(offsetWidth, offsetHeight, offsetLeft, offsetTop);

    /****************   获取屏幕大小，包含滚动区域   ****************/
    var scrollWidth = body.scrollWidth;
    var scrollHeight = body.scrollHeight;

    //console.log(scrollWidth, scrollHeight);

    /****************   为Mask设置css   ****************/        
    mask.style.width = scrollWidth + 'px';
    mask.style.height = scrollHeight + 'px';
    mask.style.borderColor = "rgba(0, 0, 0, 0.75)";
    mask.style.borderStyle = 'solid';
    mask.style.borderLeftWidth = offsetLeft + 'px';
    mask.style.borderRightWidth = (scrollWidth - offsetWidth - offsetLeft - 0) + 'px';
    mask.style.borderTopWidth = offsetTop + 'px';
    mask.style.borderBottomWidth = (scrollHeight - offsetHeight - offsetTop - 0 ) + 'px';
    mask.style.position = 'absolute';
    mask.style.left = 0;
    mask.style.top = 0;

    /****************   为Mask设置desc   ****************/        
    //var maskDesc = $byId('mask-desc');
    //maskDesc.innerHTML = desc;
    showTooltip(ele,content,dir);
    /****************   绑定next事件   ****************/
    var nextBtn = $byId('next_btn');
    (function(mask) {
        nextBtn.onclick = function() {
            params.shift();
            mask(params);
        };    
    })(arguments.callee);//匿名方法  自动执行 把当前函数对象作为参数传入匿名函数 
    //console.log("参数",arguments.callee); 
};
//给参数元素添加事件    鼠标悬浮显示提示框，
/*params:1、要显示悬浮框的元素id、悬浮框的内容、悬浮框的方向
 * 
 * 
 * 
 * */
function addHoverEvent(domId,content,dir){
	var dom=typeof domId=="string"?$byId(domId):domId;
	//1、鼠标悬浮事件
	if(!dom.onmouseover){
		dom.onmouseover=function(e){
			var event=getEvent(e);
			var target=event.target;
			//console.log(event.target);
			//var posiInfo=getXAndY(target);
			//console.log(posiInfo);
			showTooltip(target,content,dir);
		};
	}
	//2、鼠标移出隐藏悬浮框
	if(!dom.onmouseout){
		dom.onmouseout=function(e){
			//var event=getEvent(e);
			//var target=event.target;
			//console.log(event.target);
			//hideTooltip();
		};
	}
	//鼠标在窗口任意位置点击隐藏悬浮框
	window.onclick=function(e){
		var target=e.target;
		var tooltip=getDomByClass("hover_tooltip")[0];
		if(target!=tooltip){
			hideTooltip();
		}
	}
}
//显示悬浮框
function showTooltip(target,content,dir){
	if(!target){
		return;
	}
	if(!content){
		content="无内容";
	}
	var posiInfo=getXAndY(target);
	//console.log("获取参数元素x和y方向上的偏移量",posiInfo);
	var domWidth=getWidth(target),domHeight=getHeight(target);
	//console.log("获取参数元素的宽",domWidth);
	//console.log("获取参数元素的高",domHeight);
	var midWidth=posiInfo.left+domWidth/2,midHeight=posiInfo.top+domHeight/2;
	//console.log("获取参数元素的x方向中点",midWidth);
	//console.log("获取参数元素的y方向中点",midHeight);
	var maxWidth=posiInfo.left+domWidth,maxHeight=posiInfo.top+domHeight;
	//console.log("获取参数元素的最大x",maxWidth);
	//console.log("获取参数元素的最大y",maxHeight);
	var arrow=getDomByClass("hover_tooltip_arrow")[0];
	
	var tWidth,tHeight;
	var body=document.body||document.getElementsByTagName("body")[0];
	var tooltip=getDomByClass("hover_tooltip")[0];
	if(tooltip){
		body.removeChild(tooltip);
	}
	//if(!tooltip){
		tooltip=document.createElement("div");
		tooltip.className="hover_tooltip";
		body.appendChild(tooltip);
		//创建主内容区
		var mainEle=document.createElement("div");
		mainEle.style.height="100%";
		tooltip.appendChild(mainEle);
		//创建头部
		var titleEle=document.createElement("div");
		titleEle.style.height="40px";
		titleEle.style.lineHeight="40px";
		titleEle.style.textAlign="center";
		mainEle.appendChild(titleEle);
		var contentEle=document.createElement("div");
		contentEle.style.minHeight="40px";
		contentEle.style.lineHeight="40px";
		contentEle.style.textAlign="center";
		//contentEle.style.wordWrap="break-word";
		contentEle.style.wordBreak="break-all";//超出换行
		contentEle.innerHTML=content;
		mainEle.appendChild(contentEle);
		var bottomEle=document.createElement("div");
		bottomEle.style.minHeight="40px";
		bottomEle.style.lineHeight="40px";
		bottomEle.style.textAlign="center";
		mainEle.appendChild(bottomEle);
		var nextBtn=document.createElement("button");
		nextBtn.innerHTML="下一步";
		nextBtn.setAttribute("id","next_btn");
		bottomEle.appendChild(nextBtn);
		
		
		arrow=document.createElement("div");
		arrow.className="hover_tooltip_arrow";
		tooltip.appendChild(arrow);
	//}else{
		
	//}
	tooltip.style.display="block";
	tWidth=getWidth(tooltip);
	tHeight=getHeight(tooltip);
	arrowWidth=arrow.clientWidth;
	arrowHeight=arrow.clientHeight;
	//console.log("获取悬浮框的宽度",tWidth);
	//console.log("获取悬浮框的高度",tHeight);
	//tooltip.style.display="none";
	var relaSpace=Math.floor(Math.sqrt(2*Math.pow(arrowWidth/2,2)));
	var tooltipPosiInfo={};
	if(!dir||dir=="right"){
		tooltipPosiInfo.x=maxWidth+relaSpace-2;
		tooltipPosiInfo.y=midHeight-tHeight/2;
		arrow.style.position="absolute";
		arrow.style.left=(-relaSpace)+"px";
		arrow.style.top=((tHeight-arrowHeight)/2+1)+"px";
		arrow.style.border="1px solid #aaaaaa";
		arrow.style.borderTopWidth=0;
		arrow.style.borderRightWidth=0;
	}else if(dir=="top"){
		tooltipPosiInfo.x=midWidth-tWidth/2;
		tooltipPosiInfo.y=posiInfo.top-tHeight-relaSpace+2;
		arrow.style.position="absolute";
		arrow.style.bottom=(-relaSpace)+"px";
		arrow.style.left=((tWidth-arrowWidth)/2+1)+"px";
		arrow.style.border="1px solid #aaaaaa";
		arrow.style.borderTopWidth=0;
		arrow.style.borderLeftWidth=0;
	}else if(dir=="left"){
		tooltipPosiInfo.x=posiInfo.left-relaSpace-tWidth+2;
		tooltipPosiInfo.y=midHeight-tHeight/2;
		arrow.style.position="absolute";
		arrow.style.right=(-relaSpace)+"px";
		arrow.style.top=((tHeight-arrowHeight)/2+1)+"px";
		arrow.style.border="1px solid #aaaaaa";
		arrow.style.borderLeftWidth=0;
		arrow.style.borderBottomWidth=0;
	}else if(dir=="bottom"){
		tooltipPosiInfo.x=midWidth-tWidth/2;
		tooltipPosiInfo.y=maxHeight+relaSpace-2;
		arrow.style.position="absolute";
		arrow.style.top=(-relaSpace)+"px";
		arrow.style.left=((tWidth-arrowWidth)/2+1)+"px";
		arrow.style.border="1px solid #aaaaaa";
		arrow.style.borderBottomWidth=0;
		arrow.style.borderRightWidth=0;
	}
	tooltip.style.left=tooltipPosiInfo.x+"px";
	tooltip.style.top=tooltipPosiInfo.y+"px";
	//tooltip.style.display="block";
	//console.log(tooltipPosiInfo);
	return tooltipPosiInfo;
}
//隐藏悬浮框
function hideTooltip(){
	var tooltip=getDomByClass("hover_tooltip")[0];
	if(tooltip){
		tooltip.style.display="none";
	}
}
//获取事件对象
function getEvent(e){
	return e||window.event;
}
//根据id获取元素
function $byId(domId){
	return document.getElementById(domId);
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
//获取dom元素的高度
function getHeight(dom,isContainerMargin){
	var height=dom.offsetHeight;
	if(isContainerMargin){
		height+=(parseInt(dom.style.marginTopWidth)||0+parseInt(dom.style.marginBottomWidth)||0);
	}
	return height;
}
//获取dom元素的宽度
function getWidth(dom,isContainerMargin){
	var width=dom.offsetWidth;
	if(isContainerMargin){
		width+=(parseInt(dom.style.marginLeftWidth)||0+parseInt(dom.style.marginRightWidth)||0);
	}
	return width;
}

//获取body元素
function getBody(isTop){
	var win=isTop?window.top:window;
	return win.document.body||win.document.getElementsByTagName("body")[0];
}