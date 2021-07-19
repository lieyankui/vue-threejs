<template>
  <div class="tl-scale-box-wrap">
    <div class="tl-scale-left" :style="{width:leftWidth}">
      <div class="tl-scale-left-content">
        <slot name="left"></slot>
      </div>
      <div class="tl-scale-left-dragline" ref="leftDragLine"></div>
    </div>
    <div class="tl-scale-center">
      <div class="tl-scale-center-content">
        <slot></slot>
      </div>
    </div>
    <div class="tl-scale-right" v-if="hasRight" :style="{width:rightWidth}">
      <div class="tl-scale-right-content">
        <slot name="right"></slot>
      </div>
      <div class="tl-scale-right-dragline" ref="rightDragLine"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasRight: {
      type: Boolean,
      default: false,
    },
    leftWidth: {
      type: String,
    },
    rightWidth: {
      type: String,
    },
  },
  data() {
    return {
      leftDragLine: null,
      rightDragLine: null,
      currDragEle: null,
      currDragLine: null,
      flag: '',
      startWidth: 0,
      mouseStartX: 0,
    }
  },
  //created () {},
  mounted() {
    this.init()
  },
  //watch: {},
  computed: {},
  methods: {
    //初始化执行的操作
    init() {
      this.leftDragLine = this.$refs['leftDragLine']
      this.rightDragLine = this.$refs['rightDragLine'] || null
      this.addDragEvent(this.leftDragLine, 'left')
      if (this.rightDragLine) {
        this.addDragEvent(this.rightDragLine, 'right')
      }
    },
    //添加拖拽事件
    addDragEvent(ele, flag) {
      if (!ele) return
      ele.addEventListener('mousedown', e => {
        this.flag = flag
        this.currDragLine = e.target
        this.currDragLine.style.background = 'grey'
        this.currDragEle = e.target.parentNode
        this.startWidth = this.currDragEle.clientWidth || parseInt(this.currDragEle.style.width)
        this.mouseStartX = e.pageX
        window.addEventListener('mousemove', this.startMove)
        window.addEventListener('mouseup', this.stopMove)
      })
    },
    //开始移动的方法
    startMove(e) {
      // console.log("鼠标移动事件",e)
      if (!this.currDragEle) return
      let offsetX = e.pageX - this.mouseStartX
      // console.log("this.flag",this.flag)
      if (this.flag == 'right') {
        offsetX = -offsetX
      }
      this.currDragEle.style.width = this.startWidth + offsetX + 'px'
      this.mouseStartX = e.pageX
      this.startWidth = this.currDragEle.clientWidth || parseInt(this.currDragEle.style.width)
    },
    //停止移动的方法
    stopMove(e) {
      // console.log('鼠标弹起事件', e)
      this.currDragEle = null
      this.currDragLine.style.background = '#fff'
      this.startWidth = 0
      this.mouseStartX = 0
      window.removeEventListener('mousemove', this.startMove)
      window.removeEventListener('mouseup', this.stopMove)
    },
  },
  components: {},
}
</script>
<style scoped>
div[class*='tl-scale'] {
  box-sizing: border-box;
}
.tl-scale-box-wrap {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-grey-color);
  display: flex;
  max-width: 100%;
}
.tl-scale-left,
.tl-scale-right {
  min-width: 10%;
  width: 25%;
  position: relative;
  /* max-width: 40%; */
}
.tl-scale-left {
  padding-right: 6px;
}
.tl-scale-right {
  padding-left: 6px;
}
.tl-scale-left-dragline,
.tl-scale-right-dragline {
  position: absolute;
  top: 0px;
  width: 6px;
  height: 100%;
  border-left: 1px solid var(--border-grey-color);
  border-right: 1px solid var(--border-grey-color);
  background: #fff;
  cursor: col-resize;
}
.tl-scale-left-dragline:hover,
.tl-scale-right-dragline:hover {
  background: grey;
}
.tl-scale-left-dragline,
.tl-scale-right-dragline .tl-scale-left-dragline {
  right: 0px;
}
.tl-scale-right-dragline {
  left: 0px;
}
.tl-scale-center {
  flex: 1;
}
.tl-scale-left-content,
.tl-scale-center-content,
.tl-scale-right-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
