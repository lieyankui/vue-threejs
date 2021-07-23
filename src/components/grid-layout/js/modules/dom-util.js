/**
 * author: heyongkui
 * email: 1181354012@qq.com
 * 主要功能: dom元素常用的工具文件
 */
define(function () {
  var DomUtil = {
    transformReg: /^matrix\(([\s\S]*)\)$/,
    /**
     * 判断是不是dom元素
     * @param {} a
     */
    isElement: function (a) {
      return a && a.appendChild;
    },
    /**
     * 根据id获取元素
     * @param {} id
     */
    getEle: function (id) {
      return document.getElementById(id);
    },
    /**
     * 根据类名获取元素数组
     * @param {} className
     */
    getByCls: function (className) {
      if (!className) return [];
      var elems = [];
      if (!document.getElementsByClassName) {
        var dom = document.getElementByTagName("*");
        for (var i = 0; i < dom.length; i++) {
          if (dom[i].className == className) elems.push(dom[i]);
        }
      } else {
        elems = document.getElementsByClassName(className);
      }
      return elems;
    },
    /**
     * 获取body元素
     * @param {Boolean  为true则获取最上层window的body元素} isTop
     */
    getBody: function (isTop) {
      var win = isTop ? window.top : window;
      return win.document.body || win.document.getElementsByTagName("body")[0];
    },
    /**
     * 创建dom元素
     * @param {dom元素的类型} domType
     * @param {父元素} pdom
     * @param {样式对象} styleJson
     */
    createDom: function (domType, pdom, styleJson) {
      var _this = this;
      var dom = document.createElement(domType);
      if (!pdom) {
        return dom;
      }
      pdom.appendChild(dom);
      _this.setStyle(dom, styleJson);
      return dom;
    },
    /**
     * 获取元素的宽高
     * @param {*} dom
     */
    getSize: function (dom) {
      return { width: dom.offsetWidth || 0, height: dom.offsetHeight || 0 };
    },
    /**
     * 获取元素的宽度
     * @param {*} dom
     */
    getWidth: function (dom) {
      return dom.offsetWidth || 0;
    },
    /**
     * 获取元素的高度
     * @param {*} dom
     */
    getHeight: function (dom) {
      return dom.offsetHeight || 0;
    },
    /**
     * 获取元素左边框相对于父元素的偏移量
     * @param {} dom
     */
    getLeft: function (dom) {
      var left = dom.style.left || dom.offsetLeft || 0;
      return parseFloat(left);
    },
    /**
     * 获取元素上边框相对于父元素的偏移量
     * @param {} dom
     */
    getTop: function (dom) {
      var top = dom.style.top || dom.offsetTop || 0;
      return parseFloat(top);
    },
    /**
     * 获取元素中心点坐标
     * @param {} dom
     */
    getCenter: function (dom) {
      var _this = this;
      if (_this.isElement(dom)) {
        var minX = _this.getLeft(dom);
        var minY = _this.getTop(dom);
        var centerX = minX + _this.getWidth(dom) / 2;
        var centerY = minY + _this.getHeight(dom) / 2;
        return {
          x: centerX,
          y: centerY,
        };
      } else {
        throw new Error(
          "The arguments[0] type is error,the type must be Element"
        );
      }
    },
    /**
     * 获取参数元素位置信息
     * @param {*} dom
     */
    getPosiRange: function (dom) {
      var _this = this;
      if (_this.isElement(dom)) {
        //
        var minX = _this.getLeft(dom);
        var minY = _this.getTop(dom);
        var w = _this.getWidth(dom);
        var h = _this.getHeight(dom);
        var maxX = mixX + w;
        var maxY = minY + h;
        var halfWidth = w / 2;
        var halfHeight = h / 2;
        var centerX = mixX + halfWidth;
        var centerY = mixX + halfHeight;
        return {
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
          width: w,
          height: h,
          halfWidth: halfWidth,
          halfHeight: halfHeight,
          center: {
            x: centerX,
            y: centerY,
          },
        };
      } else {
        throw new Error(
          "The arguments[0] type is error,the type must be Element"
        );
      }
    },
    /**
     * 判断两个元素dom1和dom2是否重叠
     * 设dom1和dom2的中心点在x方向上的距离为lx，在y方向上的距离为ly
     * dom1的宽、高分别为w1、h1，dom2的宽、高分别为w2、h2
     * 如果lx>(w1/2+w2/2)  ly>(h1/2+h2/2) 则可以断定两个元素不重叠
     * @param {*} dom1
     * @param {*} dom2
     */
    isOverLap: function (dom1, dom2) {
      var _this = this;
      if (_this.isElement(dom1) && _this.isElement(dom2)) {
        var domPosi1 = _this.getPosiRange(dom1);
        var domPosi2 = _this.getPosiRange(dom2);
        var c1 = domPosi1.center;
        var c2 = domPosi2.center;
        var w1 = _this.getWidth(dom1);
        var w2 = _this.getWidth(dom2);
        var h1 = _this.getHeight(dom1);
        var h2 = _this.getHeight(dom2);
        var offsetX = Math.abs(c1.x - c2.x) - (w1 / 2 + w2 / 2);
        var offsetY = Math.abs(c1.y - c2.y) - (h1 / 2 + h2 / 2);
        if (offsetX > 0 || offsetY > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        throw new Error("The arguments type must be Element");
      }
    },
    /**
     * 获取两个元素的重叠信息(暂未完成)
     *
     * @param {*} dom1
     * @param {*} dom2
     */
    getOverLap: function (dom1, dom2) {
      var _this = this;
    },
    /**
     * 参数元素移动到指定位置
     * 相对于父元素的绝对定位 如果父元素未设置position属性 则会设置父元素的position属性为relative
     * @param {*} dom
     */
    moveTo: function (dom, posiInfo, time) {
      var _this = this;

      if (!dom || !_this.isElement(dom)) {
        throw new Error(
          "The arguments[0] can't be null and the type must be Element"
        );
      }
      var pNode = dom.parentNode;
      var position = _this.getStyle(pNode, "position");
      if (position == "static") {
        _this.setStyle(pNode, { position: "relative" });
      }
      // console.log("父节点的position属性", position);
      var posiCurr = _this.getStyle(pNode, "position");
      if (posiCurr != "absolute") {
        _this.setStyle(dom, { position: "absolute" });
      }
      //如果第二个参数为空  则给初始值
      posiInfo = posiInfo || { left: 0, top: 0 };
      //设置样式
      _this.setStyle(dom, {
        left: parseInt(posiInfo.left) + "px",
        top: parseInt(posiInfo.top) + "px",
      });
    },
    /**
     * 使参数元素上下左右居中
     * @param {*} dom
     */
    toCenter: function (dom) {
      var _this = this;
      if (!dom || !_this.isElement(dom)) {
        throw new Error(
          "The arguments[0] can't be null and the type must be Element"
        );
      }
      var pNode = dom.parentNode;
      var pWidth = _this.getWidth(pNode);
      var pHeight = _this.getHeight(pNode);
      var width = _this.getWidth(dom);
      var height = _this.getHeight(dom);
      _this.setStyle(dom, {
        left: (pWidth - width) / 2 + "px",
        top: (pHeight - height) / 2 + "px",
      });
    },
    /**
     * 元素滚动
     * @param {要滚动的dong元素} dom
     * @param {滚动的速度} speed
     * @param {滚动的方向} dir
     */
    scrollView: function (dom, speed, dir) {
      var _this = this;
      if (!dom || !_this.isElement(dom)) {
        throw new Error(
          "The arguments[0] can't be null and the type must be Element"
        );
      }
      speed = speed || 10;
      dir = dir || "y";
      var attrObj = {
        scrollPosi: "scrollTop",
        scrollAttr: "scrollHeight",
        clientAttr: "clientHeight",
      };
      if (dir == "x") {
        attrObj = {
          scrollPosi: "scrollLeft",
          scrollAttr: "scrollWidth",
          clientAttr: "clientWidth",
        };
      }
      // console.log("滚动元素", dom);
      // console.log("滚动速度", speed);
      // console.log("滚动方向", dir);
      dom[attrObj.scrollPosi] += speed;
      if (
        dom[attrObj.scrollPosi] >=
        dom[attrObj.scrollAttr] - dom[attrObj.clientAttr]
      ) {
        dom[attrObj.scrollPosi] =
          dom[attrObj.scrollAttr] - dom[attrObj.clientAttr];
      } else if (dom[attrObj.scrollPosi] < 0) {
        dom[attrObj.scrollPosi] = 0;
      }
    },
    /**
     * 获取参数元素在纵向和横向上的位置
     * @param {*} dom
     */
    getXAndYByDom: function (dom) {
      var _this = this;
      let left = dom.offsetLeft;
      let top = dom.offsetTop;
      let translate = _this.getTransformSize(dom);
      if (translate) {
        left += translate.x;
        top += translate.y;
      }
      let pNode = dom.offsetParent;
      if (pNode) {
        let xyInfo = _this.getXAndYByDom(pNode);
        left += xyInfo.left;
        top += xyInfo.top;
      }
      return { left: left, top: top };
    },
    /**
     * 获取元素通过translate偏移的位置
     * @param {参数元素} dom
     */
    getTransformSize: function (dom) {
      var _this = this;
      var transform = _this.getStyle(dom, "transform");
      //2D空间
      // 获取到的transform属性值为matrix(1, 0, 0, 1, 200, 200) （设置的样式为transform: translate(200px, 200px);） 参数解析如下：
      // 1. 正常值为1，定义的是 scaleX 通过设置 X 轴的值来定义缩放。值：>=0
      // 2. 正常值为0，定义的是 skew 定义 2D 倾斜
      // 3. 正常值为0，定义的是 rotate 定义2D 旋转角度
      // 4. 正常值为1，定义的是 scaleY 通过设置 Y 轴的值来定义缩放。值：>=0
      // 5. 正常值为0，定义的是 translateX 通过设置 X 轴的值来定义左右位移。值：任意
      // 6. 正常值为0，定义的是 translateY 通过设置 Y 轴的值来定义上下位移。值：任意

      //3D空间  此方法暂不支持3D属性计算偏移量
      // 获取到的transform属性值为matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 200, 200, 200, 1)
      // （设置的样式为transform: translate3D(200px, 200px, 200px)） 参数解析暂无
      if (transform && transform != "none") {
        var result = transform.match(_this.transformReg);
        if (result == null)
          throw new Error("暂不支持transform3d计算x和y方向计算偏移尺寸");
        var translate = {};
        transform = result[1];
        var arr = transform.split(",");
        translate.x = parseFloat(arr[4]);
        translate.y = parseFloat(arr[5]);
        return translate;
      } else {
        return null;
      }
    },
    /**
     *设置参数dom元素的样式
     * @param {要设置样式的dom元素} dom
     * @param {设置的样式对象 json对象} styleJson
     */
    setStyle: function (dom, styleJson) {
      if (!dom) {
        return;
      }
      for (var name in styleJson) {
        dom.style[name] = styleJson[name];
      }
    },
    /**
     * 获取参数元素的样式 如果第二个参数为空则获取参数元素所有的样式
     * @param {要获取样式的元素} obj
     * @param {样式的属性名} name
     */
    getStyle: function (ele, key) {
      if (!key) {
        return window.getComputedStyle
          ? getComputedStyle(ele, null)
          : ele.currentStyle;
      }
      return window.getComputedStyle
        ? getComputedStyle(ele, null)[key]
        : ele.currentStyle[key];
    },
    //获取事件对象
    getEvent: function (e) {
      return e || window.event;
    },
    /**
     * 添加事件对象
     * @param {添加事件的目标对象} ele
     * @param {事件类型} Type
     * @param {回调函数 回调函数的默认第一个参数为事件对象  第二个参数为传入的 param对象} fn
     * @param {传入回调函数的第二个参数} param
     */
    addEvent: function (ele, type, fn, param) {
      var _this = this;
      param = param || null;
      if (ele.addEventListener) {
        ele.addEventListener(type, function (e) {
          e = _this.getEvent(e);
          fn(e, param);
        });
      } else if (ele.attachEvent) {
        ele.attachEvent("on" + type, function (e) {
          e = _this.getEvent(e);
          fn(e, param);
        });
      } else {
        ele["on" + type] = function (e) {
          e = _this.getEvent(e);
          fn(e, param);
        };
      }
    },
    /**
     * 移除参数元素的指定事件类型
     * @param {目标元素} ele
     * @param {事件类型} type
     * @param {事件执行时调用的方法} fn
     */
    removeEvent: function (ele, type, fn) {
      if (!ele) return;
      if (ele.addEventListener) {
        ele.removeEventListener(type, fn);
      } else if (ele.attachEvent) {
        ele.detachEvent("on" + type, fn);
      } else {
        ele["on" + type] = null;
      }
    },
    /**
     * 获取滚动条宽度
     */
    getScrollbarWidth: function () {
      var oP = document.createElement("p"),
        styles = {
          width: "100px",
          height: "100px",
          overflowY: "scroll",
        },
        i,
        scrollbarWidth;
      for (i in styles) oP.style[i] = styles[i];
      document.body.appendChild(oP);
      scrollbarWidth = oP.offsetWidth - oP.clientWidth;
      oP.remove();
      return scrollbarWidth;
    },
    /**
     * 获取滚动高度大于视口高度的元素
     * @param {*} ele
     * @param {滚动方向} dir
     */
    getScrollEle: function (ele, dir) {
      var _this = this;
      if (!ele || !_this.isElement(ele)) {
        throw new Error(
          "The arguments[0] can't be null and the type must be Element"
        );
      }

      dir = dir || "y";
      var attrObj = {
        scrollPosi: "scrollTop",
        scrollAttr: "scrollHeight",
        clientAttr: "clientHeight",
      };
      if (dir == "x") {
        attrObj = {
          scrollPosi: "scrollLeft",
          scrollAttr: "scrollWidth",
          clientAttr: "clientWidth",
        };
      }
      if (ele && ele[attrObj.scrollAttr] > ele[attrObj.clientAttr]) {
        return ele;
      } else {
        var pNode = ele.parentNode;
        if (pNode) {
          return _this.getScrollEle(pNode, dir);
        } else {
          return ele;
        }
      }
    },

    /**
     * 阻止事件冒泡
     * @param {} e
     */
    preventEvent: function (e) {
      if (e.preventDefault) {
        // 阻止默认事件
        e.preventDefault();
        //阻止事件冒泡
        e.stopPropagation();
      } else {
        // IE
        e.cancelBubble = true;
        e.returnValue = false;
      }
    },
    /**
     * 随机一个rgb颜色
     * @param {起始透明度} opacityStart
     * @param {透明度范围} opacityRange
     */
    randomColorRgb: function (opacityStart, opacityRange) {
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);
      if (opacityStart != undefined || opacityRange != undefined) {
        let opacity = 1;
        if (opacityStart < 1) {
          opacity = (
            Math.random() *
              ((opacityRange > 1 - opacityStart
                ? 1 - opacityStart
                : opacityRange) || 1 - opacityStart) +
            opacityRange
          ).toFixed(2);
        }
        return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
      } else {
        return "rgb(" + r + "," + g + "," + b + ")";
      }
    },
    /**
     * 随机一个颜色
     *
     */
    randomColor: function () {
      return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
    },
    /**
     * 防抖函数
     * @param {要防抖的方法  Function类型} fn
     * @param {延迟多少时间之后再执行} delay
     */
    debounce: function (fn, delay) {
      var timer = null;
      delay = delay || 300;
      return function () {
        var args = arguments;
        // console.log("参数为", args);
        var _this = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(_this, args);
        }, delay);
      };
    },
    /**
     * 节流函数
     * @param {要节流的方法  Function类型} fn
     * @param {多少时间内不再重复执行} delay
     */
    throttle: function (fn, delay) {
      delay = delay || 300;
      var timer = null;
      let firstTime = true;
      return function () {
        var args = arguments;
        var _this = this;
        if (firstTime) {
          // 第一次加载
          fn.apply(_this, args);
          firstTime = false;
          return;
        }
        if (timer) return;
        timer = setTimeout(function () {
          fn.apply(_this, args);
          timer = null;
        }, delay);
      };
    },
  };

  //给属性赋值
  //定义变量接收页面高度和页面宽度
  DomUtil.pageHeight = document.body
    ? document.body.clientHeight
    : document.documentElement.clientHeight;
  DomUtil.pageWidth = document.body
    ? document.body.clientWidth
    : document.documentElement.clientWidth;
  //页面尺寸改变时更新页面尺寸参数
  DomUtil.addEvent(window, "resize", function () {
    DomUtil.pageHeight = document.body
      ? document.body.clientHeight
      : document.documentElement.clientHeight;
    DomUtil.pageWidth = document.body
      ? document.body.clientWidth
      : document.documentElement.clientWidth;
  });

  /**
   * 鼠标滚动视图内容跟着滚动的方法
   * 此方法中this不是指向DomUtil对象，而是指向触发此事件的dom元素
   * @param {滚动事件对象} e
   */
  DomUtil.mouseScroll = function (e, config) {
    config = config || { dir: "y", speed: 10 };
    var speed = config.speed || 10;
    var dir = config.dir || "y";
    speed = e.wheelDelta > 0 ? -speed : speed;
    var target = DomUtil.getScrollEle(e.target, dir) || target;
    // console.log("滚动元素", target);
    DomUtil.preventEvent(e);
    DomUtil.scrollView(target, speed, dir);
  };

  return DomUtil;
});
