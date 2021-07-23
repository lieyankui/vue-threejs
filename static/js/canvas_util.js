//var gradient = context.createLinearGradient(0, 0, 300, 0);//线性渐变
//获取弧度角度
function getAngle(angleNum){
	angleNum=parseFloat(angleNum);
	//alert(typeof angleNum);
	return angleNum*Math.PI/180;
}
//绘制一条直线  参数ctx画布  x1起点横坐标 y1起点纵坐标  x2终点横坐标 y2终点纵坐标   color颜色
function drawLine(ctx,x1,y1,x2,y2,color){
    ctx.save();// 保存初始Canvas状态
    ctx.beginPath();//只要是非连续路径绘制，都要记得都要执行一句context.beginPath()
    ctx.strokeStyle = color;
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}
function getSnow(snowSize){
	snowSize=parseFloat(snowSize);
	var snowEle=document.createElement("canvas");
	snowEle.setAttribute("width",snowSize);
	snowEle.setAttribute("height",snowSize);
	var snowRadius=snowSize/2;
	var ctx=snowEle.getContext("2d");
	
	
}





























