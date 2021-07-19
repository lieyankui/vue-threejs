(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    window.GridDragBox = factory();
  }
})(this, function () {
  //默认配置对象
  GridDragBox.config = {
    colNum: 6, // 列数
    rowNum: 4, // 行数
    rowGap: 10, //行间距
    colGap: 10, //列间距
    bgBdColor: "skyblue", // 背景边框颜色
    currBgBdColor: "yellow", //选中时背景边框颜色
    bdColor: "blue", //边框颜色
    currBdColor: "green", // 选中时边框颜色
    showBgLine: true, // 是否显示背景辅助线
    showBorder: true, // 是否显示border
  };
  //构造方法
  function GridDragBox(config) {
    if (!(config && config.el)) {
      return;
    }
    var el = config.el;
    if (getType(config.el) == "string") {
      el = document.querySelector(config.el);
    }
    //判断是不是节点类型  不是直接返回
    if (!isElement(el)) {
      throw new Error(
        "The attribute el can't is undefined, and the type must be HTMLElement."
      );
    }
    //
    if (!config.itemDatas || !config.itemDatas.length)
      throw new Error(
        "The attribute itemDatas can't is undefined, and the type must be Array."
      );
    this.el = el;
    //合并默认配置对象和传入的配置对象
    var config = (this.config = extend(GridDragBox.config, config));
    // console.log("配置对象config", config);
    this.init();
    //
  }
  //GridDragBox的原型对象
  GridDragBox.prototype = {
    init: function () {
      var _this = this;
      // 计算初始化参数
      _this.calcInitData();
      //初始化元素
      _this.initEle();
      //添加初始化事件
      _this.addInitEvent();
    },
    // 计算初始化参数
    calcInitData: function () {
      var _this = this;
      var el = _this.el;
      var config = _this.config;
      var colNum = config.colNum;
      var rowNum = config.rowNum;
      var rowGap = config.rowGap;
      var colGap = config.colGap;
      _this.initData = {};

      _this.styles = {};
      var w = (_this.initData.width = getWidth(el));
      var h = (_this.initData.height = getHeight(el));
      _this.initData.itemWidth = Math.floor(
        (w - (colNum - 1) * colGap) / colNum
      );
      _this.initData.itemHeight = Math.floor(
        (h - (rowNum - 1) * rowGap) / rowNum
      );
      _this.initData.rowGap = config.rowGap;
      _this.initData.colGap = config.colGap;
      _this.initData.bgItemNum = colNum * rowNum;
      _this.styles.gridTemp = {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "grid",
        overflow: "hidden",
        boxSizing: "border-box",
        gridTemplateRows: "repeat(" + rowNum + ",1fr)",
        gridTemplateColumns: "repeat(" + colNum + ",1fr)",
        gridRowGap: rowGap,
        gridColumnGap: colGap,
      };
      _this.styles.mainGridTemp = clone(
        extend(_this.styles.gridTemp, {
          //   border: _this.config.showBorder
          //     ? "1px solid " + _this.config.bdColor
          //     : "0",
        })
      );
      _this.styles.bgGridTemp = clone(
        extend(_this.styles.gridTemp, {
          position: "absolute",
          left: "0",
          top: "0",
          zIndex: "-1",
          gridRowGap: _this.initData.rowGap + "px",
          gridColumnGap: _this.initData.colGap + "px",
          border: _this.config.showBgLine
            ? "1px dotted " + _this.config.bgBdColor
            : "0",
        })
      );
      _this.styles.mainItem = {
        position: "absolute",
        width: _this.initData.itemWidth + "px",
        height: _this.initData.itemHeight + "px",
        boxSizing: "border-box",
        border: _this.config.showBorder
          ? "1px solid " + _this.config.bdColor
          : "0",
      };
      _this.styles.bgItem = {
        boxSizing: "border-box",

        border: _this.config.showBgLine
          ? "1px dotted " + _this.config.bgBdColor
          : "0",
      };
    },
    // 初始化 元素
    initEle() {
      var _this = this;
      var eleFrag = document.createDocumentFragment();
      //创建背景
      var bgGridEle = (_this.bgGridEle = createDom(
        "div",
        eleFrag,
        _this.styles.bgGridTemp
      ));
      var mainGridEle = (_this.mainGridEle = createDom(
        "div",
        eleFrag,
        _this.styles.mainGridTemp
      ));
      var bgItems = (_this.bgItems = []);
      var bgItemNum = _this.initData.bgItemNum;
      var colNum = _this.config.colNum;
      //   var rowNum = _this.config.rowNum;
      //遍历创建背景中全部的 grid-item
      for (var i = 1; i <= bgItemNum; i++) {
        var bgItem = _this.createItem(i, 0);
        bgGridEle.appendChild(bgItem);
        bgItems.push(bgItem);
      }
      var mainItems = (_this.mainItems = []);
      var itemDatas = _this.config.itemDatas;
      //遍历创建可拖拽的grid-item
      for (var i = 0, l = itemDatas.length-1; i <= l; i++) {
        var itemData=itemDatas[i];
        var mainItem = _this.createItem(i, 1);
        mainItem.innerHTML=itemData.content;
        addEvent(mainItem, "mousedown", _this.itemDown, _this);
        mainGridEle.appendChild(mainItem);
        mainItems.push(mainItem);
      }
      //创建背景的每个小方格
      _this.el.appendChild(eleFrag);

      //添加拖拽事件
      //   _this.addDragEvent();
    },
    //创建每个小方格
    /**
     *第
     * @param {grid-item 的下标 } i
     * @param {区分是创建背景中的 grid-item 还是可拖拽的 grid-item } type
     */
    createItem: function (i, type) {
      var _this = this;

      var colNum = _this.config.colNum;
      //   var rowNum = _this.config.rowNum;
      var rowIndex = i % colNum == 0 ? i / colNum : Math.ceil(i / colNum);
      var colIndex = i % colNum == 0 ? colNum : i % colNum;
      var left =
        (colIndex - 1) *
        (_this.initData.itemWidth + _this.initData.colGap + 0.5);
      var top =
        (rowIndex - 1) *
        (_this.initData.itemHeight + _this.initData.rowGap + 0.5);
      var itemStyle =
        type == 0
          ? _this.styles.bgItem
          : extend(_this.styles.mainItem, {
              left: left + "px",
              top: top + "px",
            });
      var item = createDom("div", null, itemStyle);
      item.itemInfo = {
        rowIndex: rowIndex,
        colIndex: colIndex,
      };
      item.setAttribute("rowIndex", rowIndex);
      item.setAttribute("colIndex", colIndex);

      return item;
    },
    //给grid-item添加事件
    addDragEvent: function () {
      var _this = this;
      var mainItems = _this.mainItems;
      //   console.log("mainItems", mainItems);
      for (var i = 1, l = mainItems.length; i <= l; i++) {
        var item = mainItems[i - 1];
        // console.log("item" + i + ":", item);
        addEvent(item, "mousedown", _this.itemDown, _this);
      }
    },
    //添加事件
    addInitEvent: function () {
      var _this = this;

      //给window添加鼠标弹起事件
      addEvent(window, "mouseup", _this.mouseUp, _this);
      addEvent(window, "mousemove", _this.itemMove, _this);
    },
    //grid-item鼠标按下时指执行的方法
    itemDown: function (e, _this) {
      // console.log("itemDown时this对象：", this); // this对象指向触发事件的对象
      var target = e.target;
      _this.currMainItem = target;
      var posiInfo = _this.getPosiInfo(target);
      target.moveInfo = {
        startX: e.pageX,
        startY: e.pageY,
        left: posiInfo.x,
        top: posiInfo.y,
        width: posiInfo.w,
        height: posiInfo.h,
      };
    },
    //grid-item鼠标移动时指执行的方法
    itemMove: function (e, _this) {
      //   console.log("itemMove时this对象：", this); // this对象指向触发事件的对象
      if (!_this.currMainItem) return;
      //   console.log("移动了。。。。。。。");
      _this.isMoving = true;
      var currEle = _this.currMainItem;
      //   console.log("currEle", currEle);

      //移动元素相关操作
      var moveInfo = currEle.moveInfo;
      // console.log("开始位置信息：", moveInfo);
      var offsetX = e.pageX - moveInfo.startX;
      var offsetY = e.pageY - moveInfo.startY;
      if (offsetX == 0 && offsetY == 0) {
        _this.isMoving = false;
        return;
      }
      var currX = moveInfo.left + offsetX;
      var currY = moveInfo.top + offsetY;
      // console.log("结束位置信息：", {
      //   left: currX,
      //   top: currY,
      // });
      //设置当前元素的下标为最上层显示  并设置元素位置为鼠标拖拽后的位置
      setStyle(currEle, {
        zIndex: "99",
        left: currX + "px",
        top: currY + "px",
      });
      // 更新当前位置信息
      currEle.moveInfo = {
        startX: e.pageX,
        startY: e.pageY,
        left: getLeft(currEle),
        top: getTop(currEle),
      };

      //高亮背景grid-item相关操作
      var gridInfo = _this.getGridInfo(currEle);
      // var itemIndex =
      //   (gridInfo.rowIndex - 1) * _this.config.colNum + (gridInfo.colIndex - 1);
      var itemIndex = gridInfo.itemIndex;
      var currBgItem = _this.bgItems[itemIndex];

      if (_this.lastBgItem != currBgItem) {
        setStyle(currBgItem, {
          border: "1px solid " + _this.config.currBgBdColor,
        });
        if (_this.lastBgItem) {
          setStyle(_this.lastBgItem, {
            border: "1px dotted " + _this.config.bgBdColor,
          });
        }
        _this.lastBgItem = currBgItem;
      }
    },
    //鼠标弹起时执行的方法
    mouseUp: function (e, _this) {
      //   console.log("鼠标弹起——this:", _this);
      //   console.log("this对象：", this);// this对象指向触发事件的对象
      if (_this.currMainItem && _this.isMoving) {
        var currMainItem = _this.currMainItem;
        _this.setGridInfo(currMainItem);
        _this.currMainItem = null;
      }
    },
    //获取参数元素的位置信息
    getPosiInfo: function (ele) {
      if (!isElement(ele)) {
        return;
      }
      var posiInfo = {
        w: ele.offsetWidth || parseInt(ele.style.width),
        h: ele.offsetHeight || parseInt(ele.style.height),
        x: ele.offsetLeft || parseInt(ele.style.left),
        y: ele.offsetTop || parseInt(ele.style.top),
      };
      //   console.log("位置信息：", posiInfo);
      return posiInfo;
    },

    // 设置当前元素的位置为离的最近的网格的位置
    setGridInfo: function (ele) {
      var _this = this;
      var itemW = _this.initData.itemWidth;
      var itemH = _this.initData.itemHeight;
      var rowGap = _this.initData.rowGap;
      var colGap = _this.initData.colGap;
      var gridInfo = _this.getGridInfo(ele);
      // console.log("gridInfo", gridInfo);
      var itemIndex=gridInfo.itemIndex;
      ele.setAttribute("rowIndex", gridInfo.rowIndex);
      ele.setAttribute("colIndex", gridInfo.colIndex);
      var currBgItem = _this.bgItems[itemIndex];
      // var top = (gridInfo.rowIndex - 1) * (itemH + rowGap);
      // var left = (gridInfo.colIndex - 1) * (itemW + colGap);
      var top=currBgItem.offsetTop;
      var left=currBgItem.offsetLeft;
      var width=currBgItem.offsetWidth;
      var height=currBgItem.offsetHeight;
      setStyle(ele, {
        left: left + "px",
        top: top + "px",
        width:width+ "px",
        height:height+"px",
      });
    },
    // 获取离当前元素最近的网格位置
    getGridInfo: function (ele) {
      var _this = this;
      var itemW = _this.initData.itemWidth;
      var itemH = _this.initData.itemHeight;
      var rowGap = _this.initData.rowGap;
      var colGap = _this.initData.colGap;
      var p = _this.getPosiInfo(ele);
      var xIndex = Math.ceil(p.x / (itemW + colGap));
      var xY = p.x % (itemW + colGap);
      if (xY > (itemW + colGap) / 2 || xY == 0) {
        xIndex += 1;
      }
      xIndex = xIndex <= 0 ? 1 : xIndex;
      xIndex = xIndex > _this.config.colNum ? _this.config.colNum : xIndex;
      var yIndex = Math.ceil(p.y / (itemH + rowGap));
      var yY = p.y % (itemH + rowGap);
      if (yY > (itemH + rowGap) / 2 || yY == 0) {
        yIndex += 1;
      }
      yIndex = yIndex <= 0 ? 1 : yIndex;
      yIndex = yIndex > _this.config.rowNum ? _this.config.rowNum : yIndex;
      return {
        gridColumn: xIndex + "/" + (xIndex + 1),
        gridRow: yIndex + "/" + (yIndex + 1),
        rowIndex: yIndex,
        colIndex: xIndex,
        itemIndex:
          (yIndex - 1) * _this.config.colNum +
          (xIndex - 1),
      };
    },
  };

  //工具方法
  function addEvent(ele, type, fn, param) {
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
  //获取当前事件对象
  function getEvent(e) {
    return e || window.event;
  }
  //设置元素样式
  function setStyle(dom, styleJson) {
    if (!dom) {
      return;
    }
    for (var name in styleJson) {
      dom.style[name] = styleJson[name];
    }
  }
  // 创建元素
  function createDom(domType, pdom, styleJson) {
    var dom = document.createElement(domType);
    if (pdom && pdom.appendChild) {
      pdom.appendChild(dom);
    }
    setStyle(dom, styleJson);
    return dom;
  }
  //获取元素宽度
  function getWidth(ele) {
    return ele.offsetWidth || parseInt(ele.style.width);
  }
  //获取元素高度
  function getHeight(ele) {
    return ele.offsetHeight || parseInt(ele.style.height);
  }
  //获取left的值
  function getLeft(ele) {
    return ele.offsetLeft || parseInt(ele.style.left);
  }
  //获取top的值
  function getTop(ele) {
    return ele.offsetTop || parseInt(ele.style.top);
  }
  //获取对象类型
  function getType(obj) {
    var typeStr = Object.prototype.toString.call(obj);
    var reg = /^\[object\s([a-zA-Z]+)\]$/;
    var result = typeStr.match(reg);
    if (result) {
      return result[1].toLowerCase();
    } else {
      return typeof obj;
    }
  }
  //判断是不是节点类型
  function isElement(a) {
    return a && a.appendChild;
  }

  //合并对象
  function extend(target) {
    if (!target) throw new Error("目标对象在参数列表中不能为空");
    var _this = this;
    // 参数转数组
    var args = Array.prototype.slice.apply(arguments);
    for (var i = 1, l = args.length; i < l; i++) {
      var obj = args[i];
      for (var key in obj) {
        target[key] = clone(obj[key]);
      }
    }
    return target;
  }
  // 深克隆一个对象
  function clone(source) {
    var newObj;
    var type = getType(source);
    if (type == "object") {
      newObj = {};
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          newObj[key] = clone(source[key]);
        }
      }
    } else if (type == "array") {
      newObj = [];
      for (let i = 0, l = source.length; i < l; i++) {
        newObj.push(clone(source[i]));
      }
    } else if (type == "function") {
      newObj = cloneFunc(source);
    } else {
      newObj = source;
    }
    return newObj;
  }
  // 深克隆一个函数
  function cloneFunc(func) {
    var type = getType(func);
    if (type != "function") throw new Error("argument[0] is not a function");

    //第一种方法
    var funcStr = func.toString();
    var newFunc = eval("(" + funcStr + ")");
    return newFunc;
  }

  return GridDragBox;
});
