define(function () {
  var ObjUtil = {}; //定义ObjUtil对象
  var o = ObjUtil; //定义ObjUtil对象的简称
  /**
   * 给o的成员变量赋值
   */
  o._funcReg = /^\s*function\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}$/; //复制函数使用的正则
  o._trimReg = /(^\s*)|(\s*$)/g; // 去除两端空字符串使用的空格
  /**
   * 给o的成员变量赋值结束
   */

  /**
   * 合并对象的方法
   * 把从第二个参数开始的对象的属性赋值给第一个参数，后面参数的某个属性值会覆盖前面参数的属性值
   */
  o.extend = function (target) {
    if (!target) throw new Error("目标对象在参数列表中不能为空");
    // console.log("arguments", arguments);
    var _this = this;
    // 参数转数组
    var args = Array.prototype.slice.apply(arguments);
    // console.log("args", args);
    for (var i = 1, l = args.length; i < l; i++) {
      var obj = args[i];
      for (var key in obj) {
        target[key] = _this.clone(obj[key]);
      }
    }
    return target;
  };

  /**
   * 去除两端空字符串
   */
  o.trim = function (str) {
    var _this = this;
    if (!str) {
      return "";
    }
    return str.replace(_this._trimReg, "");
  };

  /**
   * 获取参数对象的类型
   * 判断类型的方法有
   * 方法一：采用typeof  但不能区分对象和数组
   * 方法二：instanceof  instaceof只可以用来判断数组和对象，不能判断string和boolean类型
   * 方法三：使用constructor方法
   * 方法四：利用tostring()方法，这个方法是最佳的方案。
   *    function () {} //[object Function]
        null // [object Null]
        undefined // [object Undefined]
        2 // [object Number]
        "aaa" // [object String]
        {} // [object Object]
        [1, 2, 3] // [object Array]
        true // [object Boolean]
    此方法就是利用方法四来判断数据类型
   */
  o.getType = function (obj) {
    // console.log("参数对象:", obj);
    var typeStr = Object.prototype.toString.call(obj);
    // console.log("toString后的字符串", typeStr);
    var reg = /^\[object\s([a-zA-Z]+)\]$/;
    var result = typeStr.match(reg);
    // console.log("匹配结果", result[1].toLowerCase());
    if (result) {
      return result[1].toLowerCase();
    } else {
      return typeof obj;
    }
  };

  /**
   * 深度克隆一个对象 （只包括对象类型、function类型、array类型和原始类型）
   */
  o.clone = function (source) {
    var _this = this;
    var newObj;
    var type = _this.getType(source);
    if (type == "object") {
      newObj = {};
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          newObj[key] = _this.clone(source[key]);
        }
      }
    } else if (type == "array") {
      newObj = [];
      for (let i = 0, l = source.length; i < l; i++) {
        newObj.push(_this.clone(source[i]));
      }
    } else if (type == "function") {
      newObj = _this.cloneFunc(source);
      //   console.log("方法名：", source.name);
      //   newObj.name = source.name || "";
    } else {
      newObj = source;
    }
    return newObj;
  };

  /**
   * 复制一个函数
   */
  o.cloneFunc = function (func) {
    var _this = this;
    var type = _this.getType(func);
    if (type != "function") throw new Error("argument[0] is not a function");

    //第一种方法
    var funcStr = func.toString();
    // console.log("方法字符串：", funcStr);
    var newFunc = eval("(" + funcStr + ")");
    // console.log("newFunc", newFunc);
    return newFunc;

    //第二种方法截取参数列表和方法体
    // var funcStr = func.toString();
    // // console.log("方法字符串：", funcStr);
    // var result = funcStr.match(_this._funcReg);
    // // console.log("方法字符串匹配结果:", result);
    // var paramStr = result[1] || "";
    // paramStr = _this.trim(paramStr);
    // var funcBodyStr = result[2] || "";
    // var paramArr = paramStr ? paramStr.split(",") : null;
    // // console.log("paramStr", paramStr);
    // // console.log("funcBodyStr", funcBodyStr);
    // if (paramArr) {
    //   return new Function(...paramArr, funcBodyStr);
    // } else {
    //   return new Function(funcBodyStr);
    // }
  };

  /**
   * 判断浏览器类型
   */
  o.getBrowserType = function () {
    // console.log("navigator", navigator);
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE =
      userAgent.indexOf("compatible") > -1 &&
      userAgent.indexOf("MSIE") > -1 &&
      !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari =
      userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome =
      userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if (fIEVersion == 7) {
        return "IE7";
      } else if (fIEVersion == 8) {
        return "IE8";
      } else if (fIEVersion == 9) {
        return "IE9";
      } else if (fIEVersion == 10) {
        return "IE10";
      } else if (fIEVersion == 11) {
        return "IE11";
      } else {
        return "0";
      } //IE版本过低
      return "IE";
    }
    if (isOpera) {
      return "Opera";
    }
    if (isEdge) {
      return "Edge";
    }
    if (isFF) {
      return "FF";
    }
    if (isSafari) {
      return "Safari";
    }
    if (isChrome) {
      return "Chrome";
    }
  };

  /**
   * 获取指定路径参数
   */
  o.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return null;
  };
  /**
   * 获取全部路径参数
   */
  o.getUrlParams = function () {
    var reg = /([^&]*)=([^&]*)(?:&|$)/gi;
    var paramStr = window.location.search.substr(1);
    if (!paramStr) return null;
    var result = null;
    var params = {};
    while ((result = reg.exec(paramStr))) {
      params[result[1]] = decodeURIComponent(result[2]);
    }
    return params;
  };

  /**
   * 判断是否为空
   */
  o.isEmpty = function (obj) {
    var _this = this;
    var type = _this.getType(obj);
    var len = 0;
    if (type == "object") {
      len = Object.keys(obj).length;
    } else if (type == "array") {
      len = obj.length;
    }
    return obj == "" || obj == null || obj == undefined || len == 0;
  };
  /**
   * 判断是不是dom元素
   */
  o.isElement = function (a) {
    return a && a.appendChild;
  };
  /**
   * 判断是不是Date类型
   */
  o.isDate = function (a) {
    return !!(a && a.getFullYear);
  };
  /**
   * 判断是不是数组类型
   */
  o.isArray = function (a) {
    return !!(a && !!a.unshift);
  };
  /**
   * 判断是不是为空
   */
  o.isNull = function (a) {
    return a === null || a === undefined;
  };
  /**
   * 判断是不是Number类型
   */
  o.isNumber = function (a) {
    return !isNaN(a) && typeof a == "number";
  };
  /**
   * 判断两个对象是不是相等
   */
  o.isEquals = function (d, c) {
    var _this = this;
    if (d !== 0 && c !== 0) {
      if ((_this.isNull(d) || d == "") && (_this.isNull(c) || c == "")) {
        return true;
      }
    }
    if (d && c && d.getFullYear && c.getFullYear) {
      return d.getTime() === c.getTime();
    }
    if (typeof d == "object" && typeof c == "object") {
      return d === c;
    }
    return String(d) === String(c);
  };

  /**
   * 防抖函数
   */
  o.debounce = function (fn, delay) {
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
  };
  /**
   * 节流函数
   */
  o.throttle = function (fn, delay) {
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
  };

  //返回ObjUtil对象
  return ObjUtil;
});
