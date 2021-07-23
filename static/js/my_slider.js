/*
 * author:heyongkui
 * e-mail:1181354012@qq.com
 * time:2018年01月25日
 * 实现轮播图 ：  传入要实现轮播图的div的id  轮播的图片的路径数组
 * 原理：把参数图片路径生成图片横向并排放到一个div中，根据要显示的图片下标切换div的滚动位置
 */
//变量含义（从左到右）：传入的div元素、获取div的表面宽度、获取div的表面高度、默认速度、图片初始下标、上一张图片的下标、滚动方向标志、所有图片元素组成的集合、控制图片的span组成的集合
var slider_box,slide_mainWidth,slide_mainHeight,slide_speed=10,slide_imgIndex=0,slide_lastIndex=0,slide_scrollDire=1,slide_imgs,slide_imgSpans;
var canOperate=true;//放置上次点击动作未完成    为true才能继续进行操作
//接收生成的dom元素
var s_img_main,//放置所有图片的div元素
	s_img_ctrl,//放控制图片播放所有按钮的div
	slide_dire_ctrl,//放控制图片左右播放按钮的div
	slide_img_ctrl,
	slide_left_ctrl,
	slide_right_ctrl,
	slide_left_ctrl_img,
	slide_right_ctrl_img;//放控制图片播放按钮的div

function imgSlider(domId,imgUrls){
	try{
		//为了保证能够准确获取到参数div的clientWidth和clientHeight必须设置body和html的宽高（如果参数div的宽高为固定的px则可有可无）；
		document.getElementsByTagName("html")[0].style.width="100%";
		document.getElementsByTagName("html")[0].style.height="100%";
		document.getElementsByTagName("html")[0].style.padding="0";
		document.getElementsByTagName("html")[0].style.margin="0";
		document.getElementsByTagName("html")[0].style.border="0";
		document.getElementsByTagName("body")[0].style.width="100%";
		document.getElementsByTagName("body")[0].style.height="100%";
		document.getElementsByTagName("body")[0].style.padding="0";
		document.getElementsByTagName("body")[0].style.margin="0";
		document.getElementsByTagName("body")[0].style.border="0";
		//获取要实现轮播图的div
		slider_box=getDom(domId);
		slider_box.style.position="relative";//设置定位为相对定位 （为保证他的子元素使用绝对定位不会出问题）
		//防止传入的div有子元素
		slider_box.innerHTML="";
		slide_mainWidth=slider_box.clientWidth;//获取div的表面宽度
		slide_mainHeight=slider_box.clientHeight;//获取div的表面高度
		slider_box.style.position="relative";//设置div的定位方式
		//创建一个放置所有图片的div元素   并设置样式和属性
		s_img_main=createDom("div");
			s_img_main.setAttribute("id","s_img_main");
			s_img_main.style.minWidth="100%";
			s_img_main.style.height="100%";
			s_img_main.style.overflow="hidden";
			s_img_main.style.whiteSpace="nowrap";
		slider_box.appendChild(s_img_main);
		//创建一个用来放控制图片播放  所有   按钮的div
		s_img_ctrl=createDom("div");
			s_img_ctrl.setAttribute("id","s_img_ctrl");
			s_img_ctrl.style.width="100%";
			s_img_ctrl.style.height="100%";
			s_img_ctrl.style.zIndex="666";
			s_img_ctrl.style.position="absolute";
			s_img_ctrl.style.left="0";
			s_img_ctrl.style.top="0";
			s_img_ctrl.style.background="rgba(0,0,0,0)";//设置为完全透明并显示在图片上层
		slider_box.appendChild(s_img_ctrl);
		//创建一个用来放控制图片  左右   播放按钮的div
		slide_dire_ctrl=createDom("div");//,{width:"100%",height:"25%",zIndex:"666",position:"absolute",left:"0",top:(slide_mainHeight*0.75)/2+"px"}
			slide_dire_ctrl.style.width="100%";
			slide_dire_ctrl.style.height="15%";
			slide_dire_ctrl.style.position="absolute";
			slide_dire_ctrl.style.left="0";
			slide_dire_ctrl.style.top=(slide_mainHeight*0.75)/2+"px";
		//向左滚动的div
		slide_left_ctrl=createDom("div");
			slide_left_ctrl.style.width="40px";
			slide_left_ctrl.style.height="100%";
			slide_left_ctrl.style.position="absolute";
			slide_left_ctrl.style.left="10px";
			slide_left_ctrl.id="slide_left_ctrl";
			slide_left_ctrl.style.background="rgba(255,255,255,0.5)";
		slide_dire_ctrl.appendChild(slide_left_ctrl);
		//向左滚动图片
		slide_left_ctrl_img=createDom("img");
			slide_left_ctrl_img.setAttribute("src","../assets/imgs/arrow-left.png");
			slide_left_ctrl_img.style.width="100%";
			slide_left_ctrl_img.style.height="100%";
			slide_left_ctrl_img.style.cursor="pointer";
		slide_left_ctrl.appendChild(slide_left_ctrl_img);
		//向右滚动的div
		slide_right_ctrl=createDom("div");
			slide_right_ctrl.style.width="40px";
			slide_right_ctrl.style.height="100%";
			slide_right_ctrl.style.position="absolute";
			slide_right_ctrl.style.right="10px";
			slide_right_ctrl.id="slide_right_ctrl";
			slide_right_ctrl.style.background="rgba(255,255,255,0.5)";
		slide_dire_ctrl.appendChild(slide_right_ctrl);
		//向右滚动图片
		slide_right_ctrl_img=createDom("img");
			slide_right_ctrl_img.setAttribute("src","../assets/imgs/arrow-right.png");
			slide_right_ctrl_img.style.width="100%";
			slide_right_ctrl_img.style.height="100%";
			slide_right_ctrl_img.style.cursor="pointer";
		slide_right_ctrl.appendChild(slide_right_ctrl_img);
		//给左右滚动的div添加圆角
		slide_right_ctrl.style.borderRadius="10px";
		slide_left_ctrl.style.borderRadius="10px";
		s_img_ctrl.appendChild(slide_dire_ctrl);
		//创建一个用来放控制图片播放   底部按钮的div
		slide_img_ctrl=createDom("div");
			slide_img_ctrl.style.width="100%";
			slide_img_ctrl.style.height="10%";
			slide_img_ctrl.style.position="absolute";
			slide_img_ctrl.style.left="0";
			slide_img_ctrl.style.bottom="0";
			slide_img_ctrl.style.textAlign="center";
		s_img_ctrl.appendChild(slide_img_ctrl);
		//遍历传入的图片路径数组  来创建图片元素和对应的控制按钮
		for (var i = 0; i < imgUrls.length; i++) {
			//创建所有的图片标签
			var slider_img=createDom("img");
				slider_img.setAttribute("src",imgUrls[i]);
				slider_img.style.width="100%";
				slider_img.style.height="100%";
				slider_img.style.display="inline-block";
				slider_img.style.padding="0";
				slider_img.style.margin="0";
				slider_img.style.border="0";
			//创建图片对应的控制按钮
			var img_span=createDom("span");
				img_span.style.display="inline-block";
				img_span.style.padding="0px 10px";
				img_span.style.margin="0px 4px";
				img_span.style.border="0";
				img_span.style.background="rgba(255,255,255,0.5)";
				img_span.style.color="#000";
				img_span.innerHTML=(i+1);//"<font>"+(i+1)+"</font>"
				img_span.style.cursor="pointer";
				img_span.className="ctrl_span";
			s_img_main.appendChild(slider_img);
			slide_img_ctrl.appendChild(img_span);
		}
		//获取所有的展示图片标签
		slide_imgs=s_img_main.getElementsByTagName("img");
		//获取所有的图片控制按钮 （不包括左右按钮）
		slide_imgSpans=slide_img_ctrl.getElementsByTagName("span");
		slide_imgSpans[0].style.background="rgba(255,255,255,1)";//设置默认选中的图片的控制按钮的样式
		slide_left_ctrl.style.display="none";//向左按钮不显示（初始图片为第一张）
		var timer=window.setInterval(function(){//自动轮播3秒一次切换
			slide();//调用轮播方法
		},4000);
		s_img_ctrl.onmouseover=function(){//鼠标展示图片的div上放着是轮播停止
			window.clearInterval(timer);
		};
		s_img_ctrl.onmouseout=function(){//鼠标移除展示图片的div  轮播继续
			window.clearInterval(timer);
			timer=window.setInterval(function(){
				slide();
			},3000);
		};
		//给imgSpans添加点击事件  控制当前显示的图片
		for (var i = 0; i < slide_imgSpans.length; i++) {
			slide_imgSpans[i].onclick=function(){	
				if(canOperate){
					var slide_imgIndexPara=this.innerHTML-1;
					slide(slide_imgIndexPara,true);
				}
			};
		}
		slide_left_ctrl.onclick=function(){//给向左滑动播放按钮添加点击事件
			if(canOperate){
				slide(slide_imgIndex-1);
			}
		};
		slide_right_ctrl.onclick=function(){//给向右滑动播放按钮添加点击事件
			if(canOperate){
				slide(slide_imgIndex+1);
			}
		};
	}catch(e){
		alert("轮播图参数不正确，请检查");
	}
	
}
//设置下次滚动的方向
function setScrollDire(){
	if(slide_imgIndex==0){
		slide_scrollDire=1;//如果为第一张图片则为正向滚动
	}else if(slide_imgIndex==slide_imgs.length-1){
		slide_scrollDire=-1;//如果为最后一张图片则为反向滚动
	}
}
//实现图片滚动的方法  入参：1、要显示的图片下标     2、是否点击下方控制按钮进行滚动的标志 如果是则直接一步到位  不用滚动效果
function slide(slide_imgIndexPara,isClickSpan){
	if(slide_imgIndex==slide_imgIndexPara) return;//如果显示的图片和当前一样，直接返回 不做操作
	canOperate=false;//设置为禁止操作   等待此次操作完成
	slide_imgSpans[slide_lastIndex].style.background="rgba(255,255,255,0.5)";//初始化上一张图片对应的控制按钮的样式
	if(slide_imgIndexPara==undefined){//没传参数说明在自动滚动
		setScrollDire();//设置滚动的方向
		slide_imgIndex+=slide_scrollDire;//获取要显示的图片的下标
	}else if(slide_imgIndexPara>=0&&slide_imgIndexPara<=slide_imgs.length-1){//确定是通过图片下方的控制按钮进行的操作
		slide_imgIndex=slide_imgIndexPara;//要显示的图片下标等于点击的按钮的下标
	}else if(slide_imgIndexPara<0){//以下两个判断条件基本不走除非             图片走到最左侧时向左按钮还显示（右侧一样）
		slide_imgIndex=1;
	}else if(slide_imgIndexPara>slide_imgs.length-1){
		slide_imgIndex=slide_imgs.length-2;
	}
	var tarPosi=slide_imgIndex*slide_mainWidth;//滚动的目标位置
	var currPosi=s_img_main.scrollLeft;//当前所在位置
	var l=Math.abs(tarPosi-currPosi);//要走的距离
	var slide_speed=Math.floor(l/100);//一百次走完需要的速度
	var current=0;//定义走的总距离
	if(tarPosi==currPosi){//if当前位置等于目标位置   直接返回
		return;
	}else if(tarPosi<currPosi){//if当前位置小于目标位置    速度=相反
		slide_speed=-slide_speed;
	}
	if(isClickSpan){//if是点击的下方按钮  
		s_img_main.scrollLeft=tarPosi;//直接一步到位   不显示滚动效果
		slide_imgSpans[slide_imgIndex].style.background="rgba(255,255,255,1)";//设置图片对应的控制按钮的样式
		if(slide_imgIndex==slide_imgs.length-1){//如果是最后一张图片   向右滚动按钮消失
			slide_left_ctrl.style.display="block";
			slide_right_ctrl.style.display="none";
		}else if(slide_imgIndex==0){//如果是第一张图片   向左滚动按钮消失
			slide_left_ctrl.style.display="none";
			slide_right_ctrl.style.display="block";
		}else{//其他，向左向右按钮都显示
			slide_left_ctrl.style.display="block";
			slide_right_ctrl.style.display="block";
		}
		slide_lastIndex=slide_imgIndex;//下次滚动的上张图片下标等于当前图片下标     （用来恢复控制按钮的样式）
		canOperate=true;
	}else{
		var timer=window.setInterval(function(){//滚动效果可见
			current+=Math.abs(slide_speed);//当前总距离=当前总距离+速度；
			if(current>=l-Math.abs(slide_speed)){//为防止速度过大走过提前一次停下
				s_img_main.scrollLeft=tarPosi;//图片到目标位置
				window.clearInterval(timer);//清除定时器
				slide_imgSpans[slide_imgIndex].style.background="rgba(255,255,255,1)";//设置图片对应的控制按钮的样式
				if(slide_imgIndex==slide_imgs.length-1){
					slide_left_ctrl.style.display="block";
					slide_right_ctrl.style.display="none";
				}else if(slide_imgIndex==0){
					slide_left_ctrl.style.display="none";
					slide_right_ctrl.style.display="block";
				}else{
					slide_left_ctrl.style.display="block";
					slide_right_ctrl.style.display="block";
				}
				slide_lastIndex=slide_imgIndex;
				canOperate=true;
			}else{
				s_img_main.scrollLeft+=slide_speed;//匀速走动
			}
		},5);
	}	
}
//根据id获取dom元素
function getDom(id){
	return document.getElementById(id);
}
//创建dom元素   并设置样式（经测试不知为何设置样式没起效果）
function createDom(domType,json){
	var dom=document.createElement(domType);
	if(!json){
		return dom;
	}
	setStyle(dom,json);
	return dom;
}
//设置样式
function setStyle(dom,json){
	if(json){
		for(var k in json){
			if(dom.style[k]){
				dom.style[k]=json[k];
			}
		}
	}
}