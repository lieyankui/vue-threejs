<template>
  <div class="my-container-v">
    <div class="my-header">
      <div class="my-header-text">
        我的画板
      </div>
      <div class="my-header-else">
        <button @click="changeFillType">改变填充方式</button>
        <button @click="changeClosePath">改变路径是否闭合</button>
        <button @click="clearCanvas">清空画布</button>
      </div>
    </div>
    <div class="my-content">
      <canvas id="drawBoard">
        您的浏览器不支持canvas标签<i class="iconfont icon-cry"></i>~!
      </canvas>
    </div>
  </div>
</template>

<script>
//引入dom_rela工具js文件
import { getXAndYByDom } from "@/utils/dom_rela";
export default {
  props: {},
  data() {
    return {
      drawType: "stroke",
      isFill: false,
      closePath: false,
      ctx: {},
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  created() {},
  mounted() {
    // console.log(!!+1)
    this.setCanvasSize();
  },
  watch: {},
  computed: {},
  methods: {
    changeFillType() {
      this.isFill = !this.isFill;
    },
    changeClosePath() {
      this.closePath = !this.closePath;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    setCanvasSize() {
      let item = document.querySelector("#drawBoard");
      // console.log('canvasArr', canvasArr)
      let pNode = item.parentNode;
      let width = pNode.clientWidth;
      let height = pNode.clientHeight;
      console.log("width", width);
      console.log("height", height);
      this.canvasWidth = width;
      this.canvasHeight = height;
      item.setAttribute("width", width);
      item.setAttribute("height", height);
      let ctx = null;
      if (item.getContext) {
        ctx = item.getContext("2d");
        this.ctx = ctx;
      }
      if (!ctx) {
        return;
      }
      let isDraw = false;
      // 涂鸦
      item.onmousedown = e => {
        isDraw = true;
        let event = e || event;
        let posiInfo = getXAndYByDom(item);
        let x = event.clientX - posiInfo.left;
        let y = event.clientY - posiInfo.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = "rgb(31, 165, 199)";
        // ctx.lineWidth = 10
        item.onmousemove = e => {
          if (isDraw) {
            let event = e || event;
            let posiInfo = getXAndYByDom(item);
            let x = event.clientX - posiInfo.left;
            let y = event.clientY - posiInfo.top;
            // console.log('x和y坐标', { x: x, y: y })
            ctx.lineTo(x, y);
            if (this.isFill) {
              ctx.fill();
            } else {
              if (this.closePath) {
                ctx.closePath();
              }
              ctx.stroke();
            }

            // console.log(this.drawType)
            // ctx[this.drawType]()
          }
        };
      };
      item.onmouseleave = function(e) {
        isDraw = false;
        item.onmousemove = "";
      };
      document.onmouseup = function(e) {
        isDraw = false;
        item.onmousemove = "";
      };
    }
  },
  components: {}
};
</script>

<style scoped>
* {
  margin: 0;
}
.my-header {
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
  font-weight: bold;
  display: flex;
}
.my-header-text {
  padding: 0px 15px;
}
.my-header-else {
  flex: 1;
  padding-right: 20px;
  text-align: right;
}
.my-header-else button {
  margin-left: 20px;
}
.my-content {
  display: flex;
  flex-wrap: wrap;
  /* padding: 2% 2%; */
  justify-content: space-around;
  align-content: space-around;
  overflow: auto;
}
canvas {
  box-shadow: 0px 0px 10px 3px rgb(31, 165, 199);
  /* border-radius: 50px; */
  width: 100%;
  height: 100%;
}
/* canvas:hover {
  transform: scale(1.1);
  cursor: pointer;
} */
</style>
