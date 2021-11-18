/**
 * author:heyongkui
 * e-mail:1181354012@qq.com
 * time:2019年08月13日
 * 实现转动 ：  传入要实现转动的div的id  转动的图片的路径数组
 *
 *
 * 一、把传入的元素作为一个滚动的盒子
 * 添加元素 1、向左滚动的按钮2、向右滚动的按钮3、点击转动到指定图片的按钮工具栏和按钮
 * 4、添加转动的图片元素
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    global.RotateBox = factory();
  }
})(this, function () {
  var pageHeight, pageWidth;
  pageHeight = document.body
    ? document.body.clientHeight
    : document.documentElement.clientHeight;
  pageWidth = document.body
    ? document.body.clientWidth
    : document.documentElement.clientWidth;

  //初始化参数配置
  var defaultSetting = {
    rotateSpeed: 1,
    btnStyle: {
      width: "40px",
      height: "40px",
      position: "absolute",
    },
    boxStyle: {
      position: "relative",
    },
    imgStyle: {
      position: "absolute",
      overflow: "hidden",
      perspective: "0px",
      "webkit-perspective": "0px",
      "moz-perspective": "0px",
      "transform-origin": "center center 0px",
      "webkit-transform-origin": "center center 0px",
      "moz-transform-origin": "center center 0px",
    },
    imgBoxStyle: {
      position: "absolute",
      "transform-style": "preserve-3d",
      "webkit-transform-style": "preserve-3d",
      "moz-transform-style": "preserve-3d",
      //"transition":"0s",
      //"webkit-transition":"0s",
      //"moz-transition":"0s",
      transform: "rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
      "webkit-transform": "rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
      "moz-transform": "rotateY(0deg) rotateX(-15deg) rotateZ(0deg)",
    },
  };
  //创建转动轮播图的构造方法
  function RotateBox(domId, imgArr, setting) {
    if (!domId) throw Error("第一个参数不能为空");
    if (!Array.isArray(imgArr) || !imgArr.length)
      throw Error("第二个参数图片数组不能为空");
      var self = this;
      var box = $get(domId);
      if (box) {
        self.domObj = box;
        self.imgNum = imgArr.length;
        self.allowRotate = true;

        //如果有自定义设置采用自定义设置
        self.init();
        self.rotateSpeed = self.settingObj.rotateSpeed;
        //给必要的属性赋值
        self.height = box.clientHeight || parseInt(box.style.height);
        self.width = box.clientWidth || parseInt(box.style.width);
        defaultSetting.btnStyle.top =
          (self.height - parseInt(defaultSetting.btnStyle.height)) / 2 + "px";
        $setStyle(box, defaultSetting.boxStyle); //给盒子设置必要的样式
        //获取图片的宽度和高度
        self.imgSize = self.getImgSize();
        //console.log(self.settingObj);
        //console.log(Math.round(Math.sin(0.017453293*30)*100)/100);
        //创建左右按钮
        var leftBtn = $create("div", box, {
          width: defaultSetting.btnStyle.width,
          height: defaultSetting.btnStyle.height,
          background: "url('../imgs/arrow-left.png')",
          "background-size": "100% 100%",
          position: "absolute",
          left: "0px",
          top: defaultSetting.btnStyle.top,
        });
        var rightBtn = $create("div", box, {
          width: defaultSetting.btnStyle.width,
          height: defaultSetting.btnStyle.height,
          background: "url('../imgs/arrow-right.png')",
          "background-size": "100% 100%",
          position: "absolute",
          right: "0px",
          top: defaultSetting.btnStyle.top,
        });
        //把图片数组放入此变量
        self.imgArr = [];
        //创建一个放置图片的元素 并设置样式
        self.settingObj.imgBoxStyle.left =
          (parseInt(self.width) - parseInt(self.imgSize.width)) / 2 + "px";
        //console.log(self);
        var imageBoxDiv = $create("div", box, self.settingObj.imgBoxStyle);
        $setStyle(imageBoxDiv, {
          width: self.imgSize.width + 8 + "px",
          height: self.imgSize.height + 8 + "px",
        });
        box.appendChild(imageBoxDiv);
        self.imgBox = imageBoxDiv;
        self.imgBoxRange = self.getImgBoxRange();
        imageBoxDiv.style.margin =
          Math.floor((self.height - self.imgBoxRange.height / 2) / 2) +
          "px auto";
        //获取转动所需参数
        var rotateData = self.getRotateData(self.imgNum);
        self.rotateData = rotateData;
        //console.log(self.imgSize);
        //遍历创建图片
        for (var i = 0; i < imgArr.length; i++) {
          var imgDom = $create("div", imageBoxDiv, defaultSetting.imgStyle);
          $setStyle(imgDom, self.settingObj.imgStyle);
          $setStyle(imgDom, {
            background: "url(" + imgArr[i].url + ")",
            "background-size": "100% 100%",
          });
          imgDom.style.transform =
            "rotateY(" +
            (i + 1) * rotateData.rotateY +
            "deg) translateZ(" +
            rotateData.translateZ +
            "px)";
          imgDom.style.webkitTransform =
            "rotateY(" +
            (i + 1) * rotateData.rotateY +
            "deg) translateZ(" +
            rotateData.translateZ +
            "px)";
          imgDom.style.mozTransform =
            "rotateY(" +
            (i + 1) * rotateData.rotateY +
            "deg) translateZ(" +
            rotateData.translateZ +
            "px)";
          imgDom.setAttribute("imgIndex", "img" + i);
          imgDom.innerHTML = "img" + i;
          self.imgArr.push(imgDom);
          self.imgArrData = imgArr;
          //给图片添加点击事件
          addEvent(
            imgDom,
            "click",
            function (e, param) {
              var index = param.index;
              var self = param.self;
              var imgArrData = self.imgArrData;
              window.open(imgArrData[index].href);
            },
            { self: self, index: i }
          );
        }
        //给盒子对象的左右滚动按钮赋值
        self.leftBtn = leftBtn;
        self.rightBtn = rightBtn;

        self.startRotate();
        //给rotateBox中的相关元素添加事件
        addEvent(
          self.domObj,
          "mouseover",
          function (e, param) {
            param.stopRotate(1);
          },
          self
        );
        addEvent(
          self.domObj,
          "mouseout",
          function (e, param) {
            param.startRotate(1);
          },
          self
        );
        addEvent(
          leftBtn,
          "click",
          function (e, param) {
            param.rotateSpeed = -Math.abs(param.rotateSpeed);
            param.rotateBox();
          },
          self
        );
        addEvent(
          rightBtn,
          "click",
          function (e, param) {
            param.rotateSpeed = Math.abs(param.rotateSpeed);
            param.rotateBox();
          },
          self
        );
      } else {
        throw new Error("未找到参数元素,请重试");
      }
  }
  //
  RotateBox.prototype = {
    //构造方法
    constructor: RotateBox,
	init: function (){
		this.initSetting();
		this.initStyle();
	},
    initSetting: function (setting) {
      //如果有自定义设置采用自定义设置
      if (setting && Object.keys(setting).length) {
        this.settingObj = extend(defaultSetting, setting);
      } else {
        this.settingObj = defaultSetting;
      }
    },
	initStyle: function() {

	},
    //获取转动的图片在视觉上占得长度和宽度
    getImgBoxRange: function () {
      var self = this;
      var imgBox = self.imgBox;
      var width = self.width - 200;
      var angle = 15 * 0.017453293;
      var height = Math.ceil(width * Math.sin(angle)) + self.imgSize.height;
      return { width: width, height: height };
    },
    //获取图片尺寸
    getImgSize: function () {
      var self = this;
      if (self.imgNum == 0) {
        return;
      }
      var width = Math.round(self.width * 0.8);
      var whRate = self.height / self.width;
      var n = self.imgNum; //(self.imgNum%2==1?self.imgNum+1:self.imgNum)
      var angle = (90 - 180 / n) * 0.017453293;
      width = Math.floor(width * Math.cos(angle));
      height = Math.floor(width * whRate);
      self.settingObj.imgStyle.width = width + "px";
      self.settingObj.imgStyle.height = height + "px";
      //console.log({width:width,height:height});
      return { width: width, height: height };
    },
    getRotateData: function (n) {
      var self = this;
      if (n && parseInt(n)) {
        n = parseInt(n);
        var rotateY = 360 / n;
        var a = (180 - 360 / n) / 2;
        var translateZ =
          Math.ceil(
            (Math.tan(((180 - 360 / n) / 2) * 0.017453293) *
              self.imgSize.width) /
              2
          ) + 50;
        return { rotateY: rotateY, translateZ: translateZ };
      } else {
        return null;
      }
    },
    startRotate: function (flag) {
      var self = this;
      if (!flag) {
        self.allowRotate = true;
      }
      self.startTimer = setInterval(function () {
        self.rotateBox();
      }, 3000);
    },
    rotateBox: function () {
      var self = this;
      if (!self.allowRotate) {
        return;
      }
      self.allowRotate = false;
      var rotateData = self.rotateData;
      var rotateAngle = rotateData.rotateY;
      var speed = self.rotateSpeed;
      var rotateEle = self.imgBox;
      var rotateY = 0;
      self.rotateTimer = setInterval(function () {
        if (rotateY >= rotateAngle) {
          self.allowRotate = true;
          clearInterval(self.rotateTimer);
          rotateY = 0;
        } else {
          rotate(rotateEle, speed);
          rotateY += Math.abs(speed);
        }
      }, 20);
    },
    stopRotate: function (flag) {
      var self = this;
      clearInterval(self.startTimer);
      if (!flag) {
        self.allowRotate = false;
      }
    },
    rotate: function () {},
  };
  //实现div旋转的方法
  function rotate(dom, speed, direct) {
    var dir, rotateSpeed, rotateX, rotateY, rotateZ;
    if (direct) {
      dir = direct;
    } else {
      dir = "y";
    }
    if (speed) {
      rotateSpeed = speed;
    } else {
      rotateSpeed = 1;
    }
    var rotateInfo = getCurrentRotate(dom);
    rotateX = rotateInfo.rotateX;
    rotateY = rotateInfo.rotateY;
    rotateZ = rotateInfo.rotateZ;
    //console.log((rotateX+"==="+rotateY+"==="+rotateZ));
    if (dir == "x") {
      dom.style.transform =
        "rotateX(" +
        (rotateX + rotateSpeed) +
        "deg) " +
        "rotateY(" +
        rotateY +
        "deg) " +
        "rotateZ(" +
        rotateZ +
        "deg)";
    } else if (dir == "y") {
      dom.style.transform =
        "rotateX(" +
        rotateX +
        "deg) " +
        "rotateY(" +
        (rotateY + rotateSpeed) +
        "deg) " +
        "rotateZ(" +
        rotateZ +
        "deg)";
    } else if (dir == "z") {
      dom.style.transform =
        "rotateX(" +
        rotateX +
        "deg) " +
        "rotateY(" +
        rotateY +
        "deg) " +
        "rotateZ(" +
        (rotateZ + rotateSpeed) +
        "deg)";
    }
  }

  function getHeight(dom, isContainerMargin) {
    var height = dom.offsetHeight;
    if (isContainerMargin) {
      height +=
        parseInt(dom.style.marginTopWidth) ||
        0 + parseInt(dom.style.marginBottomWidth) ||
        0;
    }
    return height;
  }
  function getWidth(dom, isContainerMargin) {
    var width = dom.offsetWidth;
    if (isContainerMargin) {
      width +=
        parseInt(dom.style.marginLeftWidth) ||
        0 + parseInt(dom.style.marginRightWidth) ||
        0;
    }
    return width;
  }
  //给元素添加事件   params:1、要添加事件的元素2、事件的类型 如：click3、回调函数4,、回调函数的参数
  function addEvent(obj, eventType, callback, param) {
    obj.addEventListener(eventType, function (e) {
      if (param) {
        callback(e, param);
      } else {
        callback(e);
      }
    });
  }
  //取消绑定事件
  function removeEvent(obj, eventType, callback) {
    obj.removeEventListener(eventType, function () {
      if (callback) {
        callback();
      }
    });
  }

  /**
   * 添加事件对象
   * @param {添加事件的目标对象} ele
   * @param {事件类型} Type
   * @param {回调函数 回调函数的默认第一个参数为事件对象  第二个参数为传入的 param对象} fn
   * @param {传入回调函数的第二个参数} param
   */
  function addEvent(ele, type, fn, param) {
    var _this = this;
    param = param || null;
    if (ele.addEventListener) {
      ele.addEventListener(type, function (e) {
        e = getEvent(e);
        fn(e, param);
      });
    } else if (ele.attachEvent) {
      ele.attachEvent("on" + type, function (e) {
        e = getEvent(e);
        fn(e, param);
      });
    } else {
      ele["on" + type] = function (e) {
        e = getEvent(e);
        fn(e, param);
      };
    }
  }
  /**
   * 移除参数元素的指定事件类型
   * @param {目标元素} ele
   * @param {事件类型} type
   * @param {事件执行时调用的方法} fn
   */
  function removeEvent(ele, type, fn) {
    if (!ele) return;
    if (ele.addEventListener) {
      ele.removeEventListener(type, fn);
    } else if (ele.attachEvent) {
      ele.detachEvent("on" + type, fn);
    } else {
      ele["on" + type] = null;
    }
  }

  //获取事件对象
  function getEvent(e) {
    return e || window.event;
  }

  //获取x、y、z方向上旋转的角度
  function getCurrentRotate(dom, direction) {
    var rotateX, rotateY, rotateZ;
    rotateX = getRotateByDirection(dom, "x");
    rotateY = getRotateByDirection(dom, "y");
    rotateZ = getRotateByDirection(dom, "z");
    var rotateInfo = { rotateX: rotateX, rotateY: rotateY, rotateZ: rotateZ };
    if (direction) {
      return rotateInfo[direction];
    } else {
      return rotateInfo;
    }
  }
  //获取某个方向上的旋转角度
  function getRotateByDirection(dom, direction) {
    var dir, startIndex, endIndex;
    var rotate = dom.style.transform;
    if (direction) {
      dir = direction;
    } else {
      dir = "y";
    }
    dir = dir.toUpperCase();
    startIndex = rotate.indexOf("rotate" + dir + "(") + 8;
    endIndex = rotate.indexOf("d", startIndex);
    return parseInt(rotate.substring(startIndex, endIndex));
  }

  //合并json数据
  function extend(des, src) {
    for (p in src) {
      des[p] = src[p];
    }
    return des;
  }

  //转动传入的元素 指定的角度
  function rotateDomOnce(dom, angle) {
    if (!dom) {
      return;
    }
    angle = angle || 0;
    dom.style.transform = "rotate" + dir + "(" + parseInt(angle) + "deg)";
  }
  //转动传入的元素 指定的角度
  function rotateDom(dom, addAngle, dir) {
    addAngle = addAngle || 1;
    dir = dir || "z";
    var currAngle = getRotateByDirection(dom, dir);
    currAngle = currAngle || 0;
    dom.style.transform =
      "rotate" + dir + "(" + (currAngle + addAngle) + "deg)";
  }
  //获取dom元素某个方向上的旋转角度
  function getRotateByDirection(dom, dir) {
    var startIndex, endIndex;
    dir = dir || "z";
    var rotate = dom.style.transform;
    dir = dir.toUpperCase();
    startIndex = rotate.indexOf("rotate" + dir + "(") + 8;
    endIndex = rotate.indexOf("deg", startIndex);
    return parseInt(rotate.substring(startIndex, endIndex));
  }
  //转动传入的dom元素指定的角度   confInfo为js对象 x为x方向上旋转的角度  以此类推
  function rotateDom(dom, confInfo) {
    var rotateConf = { x: 0, y: 0, z: 0 };
    if (confInfo) {
      rotateConf = extend(rotateConf, confInfo);
    }
    currAngleX = getRotateByDirection(dom, "x");
    currAngleY = getRotateByDirection(dom, "y");
    currAngleZ = getRotateByDirection(dom, "z");
    currAngleX = currAngleX || 0;
    currAngleY = currAngleY || 0;
    currAngleZ = currAngleZ || 0;
    dom.style.transform =
      "rotatez(" +
      (currAngleZ + rotateConf.z) +
      "deg)" +
      " rotatex(" +
      (currAngleX + rotateConf.x) +
      "deg)" +
      " rotatey(" +
      (currAngleY + rotateConf.y) +
      "deg)";
  }

  //获取left属性值
  function getLeftVal(dom) {
    var left = dom.style.left || dom.clientLeft;
    return parseInt(left);
  }
  //获取top属性值
  function getTopVal(dom) {
    var top = dom.style.top || dom.clientTop;
    return parseInt(top);
  }

  //操作dom的方法
  function $get(domId) {
    return document.getElementById(domId);
  }
  //创建dom元素
  function $create(domType, pdom, styleJson) {
    var dom = document.createElement(domType);
    if (!pdom) {
      return dom;
    }
    pdom.appendChild(dom);
    $setStyle(dom, styleJson);
    return dom;
  }
  //设置参数dom的样式
  function $setStyle(dom, styleJson) {
    if (!dom) {
      return;
    }
    for (var name in styleJson) {
      dom.style[name] = styleJson[name];
    }
  }
  //根据class获取元素
  function $getByClass(className) {
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
  }
  //随机颜色的方法
  function bg1() {
    return "#" + Math.floor(Math.random() * 256).toString(10);
  }
  function bg2() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  }
  function getBgColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  return RotateBox;
});
