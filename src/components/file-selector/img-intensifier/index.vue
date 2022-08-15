<template>
  <div class="img-intensifier">
    <div class="toolbar">
      <div
        class="toolbar-item"
        v-for="item in toolbarItemData"
        :key="item.type"
        @click="toolbarItemClick(item)"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="canvas-container" :ref="canvasContainerRef">
      <canvas :ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script>
const OPERATION_TYPE = {
  SELECT: "SELECT",
  WATERMARK: "WATERMARK",
  CLIP: "CLIP",
  WRITE: "WRITE",
  LINE: "LINE",
  CLOSE: "CLOSE",
};
const toolbarItemData = [
  {
    type: "SELECT",
    text: "选择",
    rebindThis: false,
    handler: function () {
      this.$emit("close");
    },
  },
  {
    type: "WATERMARK",
    text: "水印",
    rebindThis: false,
    handler: function () {},
  },
  {
    type: "CLIP",
    text: "裁剪",
    rebindThis: false,
    handler: function () {},
  },
  {
    type: "WRITE",
    text: "画笔",
    rebindThis: false,
    handler: function () {},
  },
  {
    type: "LINE",
    text: "直线",
    rebindThis: false,
    handler: function () {},
  },
  // {
  //     type: '',
  //     text: '',
  //     handler: function() {

  //     },
  // },
  {
    type: "CLOSE",
    text: "关闭",
    rebindThis: true,
    handler: function () {
      this.$emit("close");
    },
  },
];
export default {
  name: "img-intensifier",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      canvasRef: "canvasRef",
      canvasContainerRef: "canvasContainerRef",
      canvas: null,
      ctx: null,
      img: null,
      toolbarItemData: toolbarItemData,
    };
  },
  created() {},

  mounted() {
    this.init();
  },

  methods: {
    toolbarItemClick(item) {
      console.log("item: ", item);
      if (item.rebindThis) {
        const handler = item.handler.bind(this);
        handler();
      }
    },
    init() {
      this.loadImg(this.src).then((img) => {
        this.initCanvas(img);
        this.drawImage(img);
      });
    },
    initCanvas(img) {
      this.img = img;
      this.canvas = this.$refs[this.canvasRef];
      const { width, height } = this.getCanvasContainerSize();
      const wb = img.width / width;
      const hb = img.height / height;
      if (wb >= 0.9 || hb >= 0.9) {
        if (wb > hb) {
          img.width = 0.9 * width;
          img.height = "auto";
        } else {
          img.height = 0.9 * height;
          img.width = "auto";
        }
      }
      this.canvas.width = width;
      this.canvas.height = height;
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext("2d");
      } else {
        alert("Error: Your brower is too old");
      }
    },
    drawImage(img) {
      this.ctx.drawImage(img, 0, 0, img.width, img.height);
    },
    loadImg(src) {
      return new Promise((resolve, reject) => {
        if (!src && !this.src)
          return reject(new Error("Image's arc field can't be falsys."));
        const img = new Image();
        img.src = src || this.src;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (err) => {
          reject(err);
        };
      });
    },
    getCanvasContainerSize() {
      const container = this.$refs[this.canvasContainerRef];
      return container.getBoundingClientRect();
    },
    getCanvas() {
      return this.$ref[this.canvasRef];
    },
  },
  watch: {
    src(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$nextTick(() => {
          this.init();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$high-light: #409eff;
.img-intensifier {
  position: relative;
  width: 100%;
  height: 100%;
  .toolbar {
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-90%);
    display: flex;
    height: 60px;
    margin-bottom: 12px;
    padding: 10px 24px;
    background: #fff;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0 2px 10px #ccc;
    transition: transform 0.3s ease-in-out;
    .toolbar-item {
      cursor: pointer;
      &:hover {
        color: $high-light;
        transform: scale(1.02);
      }
    }
    &:hover {
      transform: translateY(0);
    }
  }
  .canvas-container {
    width: 100%;
    height: 100%;
    text-align: center;
    canvas {
      display: inline-block;
      vertical-align: middle;
    }
    &::after {
      content: "";
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>