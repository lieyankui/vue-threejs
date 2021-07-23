### 1、canvas是基于状态绘制的

如果在ctx.stroke()或者ctx.fill()后设置样式是不会生效的，因为已经绘制过了
同样在绘制之前设置多次样式，只有最后一次绘制的样式会生效，前几次设置的样式都被覆盖了

### 2、绘制封闭多边形的时候，ctx.beginPath()和ctx.closePath()要成对使用

3、如果先描边 再填充 描边的宽度 会被填充的颜色覆盖一半 （如果线宽为10 
则只能显示5的宽度）
要想解决这个问题，需要先填充 再描边就可以了
即 要绘制带描边的封闭填充图形时 要先填充后描边
4、lineCap 设置线段开始和结束的样式  如果画了一条折线 也只有最开始和结束为止才有效果
  butt      默认样式
  round     圆角
  square    方角（效果和默认样式一样  多出来了一点）
5、lineJoin 指定线条与线条相交时呈现出来的形态
  miter     默认样式（尖角）
  bevel     衔接（平角）
  round     圆角
6、图形变换
位移  translate(x,y)
旋转  rotate(deg)
缩放  scale(sx,sy)
canvas的图形变换是叠加的
如果连续使用两次translate 则第二次图形移动的x 等于前两次移动的x的值相加
第二次移动的y等于前两次移动的y相加
所以使用图形变换后  要先还原到原来的位置，然后再使用图形变换
例如：
第一种方法
  ctx.translate(100,100);
  ctx.fillRect(0,0,100,100);
  ctx.translate(-100,-100);

  ctx.translate(300,300);
  ctx.fillRect(0,0,100,100);
  ctx.translate(-300,-300);

第二种方法
  ctx.save();
  ctx.translate(100,100);
  ctx.fillRect(0,0,100,100);
  ctx.restore();

注意： ctx.save()和ctx.restore()应该是成对出现的

使用scale()时会把 偏移量 线宽 尺寸全部缩放 因此使用时需要综合考虑实际情况使用

使用transform设置变换矩阵
//ctx.transform(a,b,c,d,e,f)
//a 水平缩放
//b 水平倾斜
//c 垂直倾斜
//d 垂直缩放
//e 水平位移
//f 垂直位移

使用setTransform设置变换矩阵
//ctx.setTransform(a,b,c,d,e,f)
//参数含义与transform一样
//无视前边所有的transform累加  从默认的初始位置开始变换

7、fileStyle可以赋的值 全都适用与strokeStyle
a、color    b、渐变色   c、图片   d、canvas    e、video