(function(w,d){
	var operaFlag=true;
	setSize();
	w.onresize=function(){
		setSize();
	};
	function setSize(){
		setFitSize("my_fit");
		//setFitSize("my_main");
	}
	//设置class=my_fit的元素的高度为父元素剩余的高度
	function setFitSize(className){
		if(operaFlag){
			operaFlag=false;
			//获取所有class=className的元素
			var fitEles=getElesByClass(className);
			if(!fitEles.length){
				return;
			}
			for (var i = 0,l=fitEles.length; i < l; i++) {
				var fitEle=fitEles[i];
				var parEle=fitEle.parentNode;
				if(parEle){
					var pHeight=parEle.clientHeight;
					var pWidth=parEle.clientWidth;
					var broElesHeight=0,broElesWidth=0;
					var eles=parEle.children;
					var broEles=new Array();
					for (var j = 0,k=eles.length; j < k; j++) {
						var ele=eles[j];
						if(fitEle!=ele){
							if(className=="my_fit"){
								broElesHeight+=ele.offsetHeight;
							}else if(className=="my_main"){
								broElesWidth+=Math.ceil(ele.offsetWidth);
							}
						}else{
							continue;
						}
					}
					if(className=="my_fit"){
						fitEle.style.height=Math.ceil(pHeight-broElesHeight)+"px";
						fitEle.style.width=pWidth+"px";
					}else if(className=="my_main"){
						//alert(pWidth+"==="+broElesWidth);
						fitEle.style.width=(Math.ceil(pWidth-broElesWidth))+"px";//Math.ceil
						fitEle.style.height=pHeight+"px";
					}
				}
			}
			operaFlag=true;
		}
		
	}
	//获取body元素
	function getBody(){
		return d.body||d.getElementsByTagName("body")[0];
	}
	//根据class获取元素
	function getElesByClass(className){
        var elems = [];
        if(!d.getElementsByClassName){
            var dom = d.getElementByTagName('*');
            for(var i = 0;i<dom.length;i++){
                if(dom[i].className == className)
                     elems.push(dom[i]);
            }
        }else{
            elems = d.getElementsByClassName(className);
        }
        return elems;
    }
})(window,document);