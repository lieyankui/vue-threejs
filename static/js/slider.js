/*
 * author:heyongkui
 * e-mail:1181354012@qq.com
 * time:2018年01月25日
 * 实现轮播图 ：  传入要实现轮播图的div的id  轮播的图片的路径数组
 */
//变量含义（从左到右）：传入的div元素、获取div的表面宽度、获取div的表面高度、默认速度、图片初始下标、上一张图片的下标、滚动方向标志、所有图片元素组成的集合、控制图片的span组成的集合
var slider_box,slide_mainWidth,slide_mainHeight,slide_speed=10,slide_imgIndex=0,slide_lastIndex=0,slide_scrollDire=1,slide_imgs,slide_imgSpans;
var canOperate=true;
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
		s_img_main=createDom("div");//,{minWidth:"100%",height:"100%",overflow:"hidden",whiteSpace:"nowrap",display:"inline-block"}
			s_img_main.setAttribute("id","s_img_main");
			s_img_main.style.minWidth="100%";
			s_img_main.style.height="100%";
			s_img_main.style.overflow="hidden";
			s_img_main.style.whiteSpace="nowrap";
		//var imgJson={width:slide_mainWidth+"px",height:slide_mainHeight+"px",display:"inline-block",padding:"0",margin:"0",border:"0"};
		slider_box.appendChild(s_img_main);
		//创建一个用来放控制图片播放所有按钮的div
		s_img_ctrl=createDom("div");//,{width:"100%",height:"100%",zIndex:"666",position:"absolute",left:"0",top:"0",background:"rgba(0,0,0,0)"}
			s_img_ctrl.setAttribute("id","s_img_ctrl");
			s_img_ctrl.style.width="100%";
			s_img_ctrl.style.height="100%";
			s_img_ctrl.style.zIndex="666";
			s_img_ctrl.style.position="absolute";
			s_img_ctrl.style.left="0";
			s_img_ctrl.style.top="0";
			s_img_ctrl.style.background="rgba(0,0,0,0)";
		slider_box.appendChild(s_img_ctrl);
		//创建一个用来放控制图片左右播放按钮的div
		slide_dire_ctrl=createDom("div");//,{width:"100%",height:"25%",zIndex:"666",position:"absolute",left:"0",top:(slide_mainHeight*0.75)/2+"px"}
			slide_dire_ctrl.style.width="100%";
			slide_dire_ctrl.style.height="15%";
			slide_dire_ctrl.style.position="absolute";
			slide_dire_ctrl.style.left="0";
			slide_dire_ctrl.style.top=(slide_mainHeight*0.75)/2+"px";
		slide_left_ctrl=createDom("div");
			slide_left_ctrl.style.width="40px";
			slide_left_ctrl.style.height="100%";
			slide_left_ctrl.style.position="absolute";
			slide_left_ctrl.style.left="10px";
			slide_left_ctrl.id="slide_left_ctrl";
			slide_left_ctrl.style.background="rgba(255,255,255,0.5)";
		slide_dire_ctrl.appendChild(slide_left_ctrl);
		slide_left_ctrl_img=createDom("img");
			slide_left_ctrl_img.setAttribute("src","../imgs/arrow-left.png");
			slide_left_ctrl_img.style.width="100%";
			slide_left_ctrl_img.style.height="100%";
			slide_left_ctrl_img.style.cursor="pointer";
		slide_left_ctrl.appendChild(slide_left_ctrl_img);
		slide_right_ctrl=createDom("div");
			slide_right_ctrl.style.width="40px";
			slide_right_ctrl.style.height="100%";
			slide_right_ctrl.style.position="absolute";
			slide_right_ctrl.style.right="10px";
			slide_right_ctrl.id="slide_right_ctrl";
			slide_right_ctrl.style.background="rgba(255,255,255,0.5)";
		slide_dire_ctrl.appendChild(slide_right_ctrl);
		slide_right_ctrl_img=createDom("img");
			slide_right_ctrl_img.setAttribute("src","../imgs/arrow-right.png");
			slide_right_ctrl_img.style.width="100%";
			slide_right_ctrl_img.style.height="100%";
			slide_right_ctrl_img.style.cursor="pointer";
		slide_right_ctrl.appendChild(slide_right_ctrl_img);
		slide_right_ctrl.style.borderRadius="10px";
		slide_left_ctrl.style.borderRadius="10px";
		s_img_ctrl.appendChild(slide_dire_ctrl);

		//slide_dire_ctrl.style.lineHeight=slide_dire_ctrl.clientHeight;
		//创建一个用来放控制图片播放按钮的div
		slide_img_ctrl=createDom("div");//,{width:"100%",height:"25%",position:"absolute",left:"0",bottom:"0"}
			slide_img_ctrl.style.width="100%";
			slide_img_ctrl.style.height="10%";
			slide_img_ctrl.style.position="absolute";
			slide_img_ctrl.style.left="0";
			slide_img_ctrl.style.bottom="0";
			slide_img_ctrl.style.textAlign="center";
		s_img_ctrl.appendChild(slide_img_ctrl);

		//slide_img_ctrl.style.lineHeight=slide_img_ctrl.clientHeight;
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

		slide_imgs=s_img_main.getElementsByTagName("img");
		slide_imgSpans=slide_img_ctrl.getElementsByTagName("span");
		slide_imgSpans[0].style.background="rgba(255,255,255,1)";
		slide_left_ctrl.style.display="none";
		var timer=window.setInterval(function(){
			slide();
		},3000);
		s_img_ctrl.onmouseover=function(){
			window.clearInterval(timer);
		};
		s_img_ctrl.onmouseout=function(){
			window.clearInterval(timer);
			timer=window.setInterval(function(){
				slide();
			},3000);
		};
		//给imgSpans添加点击事件
		for (var i = 0; i < slide_imgSpans.length; i++) {
			slide_imgSpans[i].onclick=function(){
				if(canOperate){
					var slide_imgIndexPara=this.innerHTML-1;
					slide(slide_imgIndexPara,true);
				}

			};
		}
		slide_left_ctrl.onclick=function(){
			if(canOperate){
				slide(slide_imgIndex-1);
			}
		};
		slide_right_ctrl.onclick=function(){
			if(canOperate){
				slide(slide_imgIndex+1);
			}
		};
	}catch(e){
		getDom(domId).innerHTML="<span style='color:red;'>参数格式不对，请核对</span>";
	}

}
function setslide_scrollDire(){
	if(slide_imgIndex==0){
		slide_scrollDire=1;
	}else if(slide_imgIndex==slide_imgs.length-1){
		slide_scrollDire=-1;
	}
}
function getLastslide_imgIndex(slide_imgIndex){
	return --slide_imgIndex<0?slide_imgs.length-1:slide_imgIndex;
}

function slide(slide_imgIndexPara,isClickSpan){
	if(slide_imgIndex==slide_imgIndexPara) return;
	canOperate=false;
	slide_imgSpans[slide_lastIndex].style.background="rgba(255,255,255,0.5)";
	if(slide_imgIndexPara==undefined){//没传参数说明在自动滚动
		setslide_scrollDire();//设置滚动的方向
		slide_imgIndex+=slide_scrollDire;//获取要显示的图片的下标
	}else if(slide_imgIndexPara>=0&&slide_imgIndexPara<=slide_imgs.length-1){
		slide_imgIndex=slide_imgIndexPara;
	}else if(slide_imgIndexPara<0){
		slide_imgIndex=1;
	}else if(slide_imgIndexPara>slide_imgs.length-1){
		slide_imgIndex=slide_imgs.length-2;
	}
	var scrollWidth=s_img_main.scrollWidth;
	var tarPosi=slide_imgIndex*slide_mainWidth;//滚动的目标位置
	var currPosi=s_img_main.scrollLeft;
	var l=Math.abs(tarPosi-currPosi);
	var slide_speed=Math.floor(l/100);
	var current=0;
	if(tarPosi==currPosi){
		return;
	}else if(tarPosi<currPosi){
		slide_speed=-slide_speed;
	}
	if(isClickSpan){
		s_img_main.scrollLeft=tarPosi;
		slide_imgSpans[slide_imgIndex].style.background="rgba(255,255,255,1)";
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
		var timer=window.setInterval(function(){
			current+=Math.abs(slide_speed);
			if(current>=l-Math.abs(slide_speed)){
				s_img_main.scrollLeft=tarPosi;
				window.clearInterval(timer);
				slide_imgSpans[slide_imgIndex].style.background="rgba(255,255,255,1)";
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
				s_img_main.scrollLeft+=slide_speed;
			}

		},5);
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
			/*if(dom.tagName=="IMG"){
				alert(k+"==="+json[k]);
			}*/
			if(dom.style[k]){
				dom.style[k]=json[k];
			}
		}
	}
}