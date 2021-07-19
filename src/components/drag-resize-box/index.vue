<template>
  <div
    class="drag-resize-box"
    :ref="refName"
    :style="{ width: w + 'px', height: h + 'px', left: x + 'px', top: y + 'px', zIndex: z + '', border: showBorder ? '1px solid ' + bgColor : '0' }"
  >
    <div
      class="drag-resize-content"
      :style="{ overflow: enable ? 'auto' : 'hidden', background: bgColor }"
      @mousedown="mouseDown($event, 'move')"
    >
      <slot></slot>
    </div>
    <div
      class="dr-re-toolbar"
      v-if="showToolbar && enable"
      @mousedown.prevent="mouseDown($event, 'move')"
    >
      <div class="icon-close" v-if="showClose" @click.prevent="closeComp"></div>
    </div>
    <div
      v-if="showToolbar && enable"
      class="dr-re-lt"
      :class="[showBorder ? 'b-show' : 'b-hide']"
      @mousedown="mouseDown($event, 'nw')"
    ></div>
    <div v-if="showToolbar && enable" class="dr-re-t" @mousedown="mouseDown($event, 'n')"></div>
    <div
      v-if="showToolbar && enable"
      class="dr-re-rt"
      :class="[showBorder ? 'b-show' : 'b-hide']"
      @mousedown="mouseDown($event, 'ne')"
    ></div>
    <div v-if="showToolbar && enable" class="dr-re-r" @mousedown="mouseDown($event, 'e')"></div>
    <div
      v-if="showToolbar && enable"
      class="dr-re-rb"
      :class="[showBorder ? 'b-show' : 'b-hide']"
      @mousedown="mouseDown($event, 'se')"
    ></div>
    <div class="dr-re-b" @mousedown="mouseDown($event, 's')"></div>
    <div
      v-if="showToolbar && enable"
      class="dr-re-lb"
      :class="[showBorder ? 'b-show' : 'b-hide']"
      @mousedown="mouseDown($event, 'sw')"
    ></div>
    <div v-if="showToolbar && enable" class="dr-re-l" @mousedown="mouseDown($event, 'w')"></div>
  </div>
</template>

<script>
export default {
  props: {
    w: {
      type: [String, Number],
      default: 100,
    },
    h: {
      type: [String, Number],
      default: 100,
    },
    x: {
      type: [String, Number],
      default: 0,
    },
    y: {
      type: [String, Number],
      default: 0,
    },
    z: {
      type: [String, Number],
      default: 0,
    },
    //唯一标识
    uniqueId: {
      type: String,
      default: '',
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    showBorder: {
      type: Boolean,
      default: true,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: '#aaaaaa',
    },
  },
  data() {
    return {
      container: {},
      refName: 'dragResizeBox',
      initMousePosi: {},
      currMousePosi: {},
      currDragEle: null,
      maxZIndex: 1000,
      minZIndex: 1,
    }
  },
  mounted() {
    //
    // console.log('this.$refs[this.refName]', this.$refs[this.refName])
    this.container = this.$refs[this.refName]
    //给当前组件设置层级
    if (!this.z) {
      this.setCurrDragEle()
    }
    //鼠标移动事件
    if (this.enable) {
      window.addEventListener('mousemove', e => {
        //
        // console.log('事件对象', e)
        if (this.initMousePosi) {
          if (this.initMousePosi.flag == 'move') {
            //
            this.dragMove(e)
          } else {
            // console.log('重新设置尺寸')
            this.dragResize(e)
          }
        }
      })
      //鼠标弹起事件
      window.addEventListener('mouseup', e => {
        //
        if (this.currDragEle) {
          let rectInfo = this.getCurrRect()
          if (this.initMousePosi.flag == 'move') {
            this.$emit('dragMoved', { rectInfo: rectInfo, comp: this, container: this.container })
          } else {
            // console.log('重新设置尺寸')
            this.$emit('dragResized', { rectInfo: rectInfo, comp: this, container: this.container })
          }
        }
        this.currDragEle = null
        this.initMousePosi = null
      })
    }
  },
  methods: {
    //关闭当前组件
    closeComp() {
      //
      //发出关闭事件
      this.$emit('close', { uniqueId: this.uniqueId })
      //移除当前组件
      this.container.parentNode.removeChild(this.container)
    },
    //获取元素当前位置信息
    getCurrRect() {
      let rect = {
        width: this.getAttr('width'),
        height: this.getAttr('height'),
        left: this.getAttr('left'),
        top: this.getAttr('top'),
        zIndex: this.getAttr('zIndex'),
      }
      return rect
    },
    getAttr(attr) {
      return parseInt(this.container.style[attr])
    },
    mouseDown(e, flag) {
      if (!this.enable) {
        return
      }
      let target = (this.currDragEle = this.container)
      this.initMousePosi = {
        x: e.pageX,
        y: e.pageY,
        flag: flag,
      }
      //设置当前元素为最上层元素
      this.setCurrDragEle()
      // console.log('初始化位置', this.initMousePosi)
      // console.log('鼠标按下：', { event: e, flag: flag })
    },
    //设置当前元素为最上层元素
    setCurrDragEle() {
      let pNode = this.container.parentNode
      // console.log('pNode', pNode)
      let childs = pNode.children
      // console.log('childs', childs)
      let zIndex = 1
      for (let i = 0; i < childs.length; i++) {
        const child = childs[i]
        if (child.style && child.style.zIndex && parseInt(child.style.zIndex) && parseInt(child.style.zIndex) > zIndex) {
          zIndex = parseInt(child.style.zIndex)
        }
      }
      if (this.container.style.zIndex < zIndex) {
        this.container.style.zIndex = ++zIndex + ''
      }
      if (zIndex > this.maxZIndex) {
        let childNum = childs.length
        for (let i = 0; i < childs.length; i++) {
          const child = childs[i]
          if (child.style.zIndex && parseInt(child.style.zIndex)) {
            child.style.zIndex = parseInt(child.style.zIndex) + childNum - this.maxZIndex + ''
          }
        }
      }
      // console.log('this.container的z-index:', this.container.style.zIndex)
      // else if(child.className.indexOf("drag-resize-box")!=-1){
      //   child.style.zIndex = 'auto'
      // }
    },
    dragMove(e) {
      if (this.currDragEle) {
        // console.log('改变位置')
        this.currMousePosi = {
          x: e.pageX,
          y: e.pageY,
        }
        //计算相对位置并移动
        let posi = caclPosi(this.initMousePosi, this.currMousePosi)

        this.container.style.left = parseInt(this.container.style.left) + posi.x + 'px'
        this.container.style.top = parseInt(this.container.style.top) + posi.y + 'px'
        //初始化位置信息
        this.initMousePosi.x = this.currMousePosi.x
        this.initMousePosi.y = this.currMousePosi.y
      }
    },
    dragResize(e) {
      if (this.currDragEle) {
        // console.log('this.currDragEle', this.currDragEle)
        // console.log('this.initMousePosi.flag', this.initMousePosi.flag)
        // console.log('改变尺寸')
        this.currMousePosi = {
          x: e.pageX,
          y: e.pageY,
        }
        //计算相对位置并移动
        let posi = caclPosi(this.initMousePosi, this.currMousePosi)
        // console.log('相对位置', posi)
        switch (this.initMousePosi.flag) {
          case 'e':
            // console.log('this.container.clientWidth + posi.x', this.container.style.width + posi.x)
            this.container.style.width = parseInt(this.container.style.width) + posi.x + 'px'
            break
          case 'w':
            this.container.style.width = parseInt(this.container.style.width) - posi.x + 'px'
            this.container.style.left = parseInt(this.container.style.left) + posi.x + 'px'
            break
          case 's':
            this.container.style.height = parseInt(this.container.style.height) + posi.y + 'px'
            break
          case 'n':
            this.container.style.top = parseInt(this.container.style.top) + posi.y + 'px'
            this.container.style.height = parseInt(this.container.style.height) - posi.y + 'px'
            break
          case 'nw':
            this.container.style.width = parseInt(this.container.style.width) - posi.x + 'px'
            this.container.style.left = parseInt(this.container.style.left) + posi.x + 'px'
            this.container.style.height = parseInt(this.container.style.height) - posi.y + 'px'
            this.container.style.top = parseInt(this.container.style.top) + posi.y + 'px'
            break
          case 'ne':
            this.container.style.width = parseInt(this.container.style.width) + posi.x + 'px'
            this.container.style.height = parseInt(this.container.style.height) - posi.y + 'px'
            this.container.style.top = parseInt(this.container.style.top) + posi.y + 'px'
            break
          case 'sw':
            this.container.style.height = parseInt(this.container.style.height) + posi.y + 'px'
            this.container.style.width = parseInt(this.container.style.width) - posi.x + 'px'
            this.container.style.left = parseInt(this.container.style.left) + posi.x + 'px'
            break
          case 'se':
            this.container.style.height = parseInt(this.container.style.height) + posi.y + 'px'
            this.container.style.width = parseInt(this.container.style.width) + posi.x + 'px'
            break
          default:
        }
        //初始化位置信息
        this.initMousePosi.x = this.currMousePosi.x
        this.initMousePosi.y = this.currMousePosi.y
      }
    },
  },
}
function caclPosi(oldPosi, newPosi) {
  let posi = {}
  if (oldPosi && newPosi) {
    posi.x = newPosi.x - oldPosi.x
    posi.y = newPosi.y - oldPosi.y
  }
  return posi
}
</script>

<style lang="scss" scoped>
$bWidth: 10px;
$ofSize: -(8px-4);
$iconSize: 24px;
div {
  box-sizing: border-box;
  position: absolute;
}
.dr-re-toolbar {
  display: inline-block;
  height: $iconSize;
  line-height: $iconSize;
  right: 0px;
  z-index: 9;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.dr-re-toolbar::after {
  content: '';
  clear: both;
  display: inline-block;
}
.icon-close {
  width: $iconSize;
  height: $iconSize;
  line-height: $iconSize;
  background-image: url('./imgs/close.png');
  background-size: 100%;
  text-align: center;
  &::before {
    content: '';
  }
}
.icon-close:hover {
  transform: scale(1.2);
}
.b-show {
  border: 1px solid #cccccc;
  display: block;
}
.b-hide {
  border: 0;
  display: none;
}
.drag-resize-box {
  box-sizing: border-box;
  border: 1px solid #aaaaaa;
}
.drag-resize-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
[class^='dr-re'] {
  position: absolute;
}
.dr-re-lt {
  cursor: nw-resize;
  width: $bWidth;
  height: $bWidth;
  left: $ofSize;
  top: $ofSize;
  z-index: 2;
}
.dr-re-t {
  cursor: n-resize;
  width: 100%;
  height: $bWidth;
  top: $ofSize;
  z-index: 1;
}
.dr-re-rt {
  cursor: ne-resize;
  width: $bWidth;
  height: $bWidth;
  right: $ofSize;
  top: $ofSize;
  z-index: 2;
}
.dr-re-r {
  cursor: e-resize;
  height: 100%;
  width: $bWidth;
  right: $ofSize;
  z-index: 1;
}
.dr-re-rb {
  cursor: se-resize;
  width: $bWidth;
  height: $bWidth;
  right: $ofSize;
  bottom: $ofSize;
  z-index: 2;
}
.dr-re-b {
  cursor: s-resize;
  width: 100%;
  height: $bWidth;
  bottom: $ofSize;
  z-index: 1;
}
.dr-re-lb {
  cursor: sw-resize;
  width: $bWidth;
  height: $bWidth;
  left: $ofSize;
  bottom: $ofSize;
  z-index: 2;
}
.dr-re-l {
  cursor: w-resize;
  height: 100%;
  width: $bWidth;
  left: $ofSize;
  z-index: 1;
}
</style>
