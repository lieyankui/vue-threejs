<template>
  <div class="right-box-wrap" :style="{ width: show ? showWidth + 'px' : hideWidth + 'px', height: height }" @mouseleave="delayhide">
    <!--  opacity: show ? 1 : 0,  -->
    <div class="right-box" :style="{ width: showWidth + 'px', background: bgColor, overflow: 'hidden' }">
      <slot></slot>
    </div>
    <div v-if="showSwitch" :class="[show ? 'collapse-show' : 'collapse-hide']" @click="changeShow">
      <i class="iconfont" :class="[show ? 'icon-double-arro-right' : 'icon-double-arrow-left']"></i>
    </div>
    <div v-if="!showSwitch" class="hover-switch-bar" @mouseenter="delayShow"></div>
  </div>
</template>

<script>
export default {
  props: {
    autoClose: {
      type: Boolean,
      default: false,
    },
    showSwitch: {
      type: Boolean,
      default: true,
    },
    showWidth: {
      type: [String, Number],
      default: '200',
    },
    hideWidth: {
      type: [String, Number],
      default: '0',
    },
    show: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [String, Number],
      default: '300px',
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
    delayShowTime: {
      type: Number,
      default: 300,
    },
    delayHideTime: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      showTimer: null,
      hideTimer: null,
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    changeShow() {
      this.show = !this.show
    },
    //延迟显示
    delayShow() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
      }
      this.showTimer = setTimeout(() => {
        this.show = true
      }, this.delayShowTime)
    },
    //延迟隐藏
    delayhide() {
      if (!this.autoClose || this.showSwitch) {
        return
      }
      if (this.showTimer) {
        clearTimeout(this.showTimer)
      }
      this.hideTimer = setTimeout(() => {
        this.show = false
      }, this.delayHideTime)
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
@use "sass:math";
@import '~@/styles/variables';
$iconSize: 60px;
$arrowH: 25px;
$arrowR: (math.div($arrowH, 2))-1;
.right-box-wrap {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e6e6e6;
  transition: all 0.3s ease-in-out;
}
.hover-switch-bar {
  position: absolute;
  width: 10px;
  height: 100%;
  left: -5px;
  top: 0;
  background-color: rgba(255, 255, 255, 0);
}
.right-box {
  width: 100%;
  height: 100%;
  padding: 15px 10px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  overflow-x: auto;
  /*transition: all 0.1s ease-in-out;*/
  transition: all 0.3s ease-in-out;
  z-index: 2;
}
.collapse-show,
.collapse-hide {
  width: math.div($iconSize, 2);
  height: $iconSize;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 137, 114, 0.993);
  transition: all 0.3s ease-in-out;
  z-index: -1;
  text-align: center;
  color: #076f5e;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 26px;
    vertical-align: middle;
  }
  &:hover {
    transform: scale(1.1) translateY(-50%);
    border: 1px solid #0ddfad;
    color: #fff;
  }
}
.collapse-show {
  border-radius: 0 $iconSize $iconSize 0;
  left: 0;
  z-index: 5;
  padding-right: 10px;
}
.collapse-hide {
  border-radius: $iconSize 0 0 $iconSize;
  left: -(math.div($iconSize, 3));
  padding-left: 0px;
}
</style>
