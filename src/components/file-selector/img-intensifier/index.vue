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
import { saveAsImg, setOpacity } from "@/utils/canvas_utils";
import img1 from "/static/imgs/guoqing/gq1024.png";
import img2 from "/static/imgs/guoqing/gq2048.png";
import img3 from "/static/imgs/guoqing/gq4096.png";
const OPERATION_TYPE = {
  SELECT: "SELECT",
  WATERMARK: "WATERMARK",
  CLIP: "CLIP",
  WRITE: "WRITE",
  LINE: "LINE",
  CLOSE: "CLOSE",
};
const toolbarItemData = [
  // {
  //   type: "SELECT",
  //   text: "选择",
  //   rebindThis: false,
  //   handler: function () {
  //     this.$emit("close");
  //   },
  // },
  // {
  //   type: "WATERMARK",
  //   text: "水印",
  //   rebindThis: false,
  //   handler: function () {},
  // },
  // {
  //   type: "CLIP",
  //   text: "裁剪",
  //   rebindThis: false,
  //   handler: function () {},
  // },
  // {
  //   type: "WRITE",
  //   text: "画笔",
  //   rebindThis: false,
  //   handler: function () {},
  // },
  // {
  //   type: "LINE",
  //   text: "直线",
  //   rebindThis: false,
  //   handler: function () {},
  // },
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
      this.reset();
    },
  },
  {
    type: "SAVE",
    text: "保存",
    rebindThis: true,
    handler: function () {
      this.$emit("save");
      // this.reset();
      this.save();
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
      if (item.rebindThis) {
        const handler = item.handler.bind(this);
        handler();
      }
    },
    init() {
      if (!this.src) return;
      this.loadImg(this.src).then((img) => {
        this.initCanvas(img);
        this.drawImage(img);
        // this.drawImageBySrc(img1);
      });
    },
    initCanvas(img) {
      this.img = img;
      this.canvas = this.$refs[this.canvasRef];
      const { width, height } = this.getImgSize(img);
      this.canvas.width = img.width = width;
      this.canvas.height = img.height = height;
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext("2d");
      } else {
        alert("Error: Your brower is too old");
      }
    },
    setImgSize(img) {
      const {width, height} = this.getImgSize(img);
      img.width = width;
      img.height = height;
    },
    getImgSize(img) {
      const { width, height } = this.getCanvasContainerSize();
      const wb = img.width / width;
      const hb = img.height / height;
      if (wb > hb) {
        return {
          width,
          height: img.height / wb
        };
      } else {
        return {
          width: img.width / hb,
          height
        };
      }
    },
    drawImageBySrc(src) {
      this.loadImg(src).then((img) => {
        this.setImgSize(img);
        this.drawImage(img);
        setOpacity(this.canvas);
      });
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
          setTimeout(() => {
            resolve(img);
          }, 800);
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
    save() {
      saveAsImg(this.canvas);
    },
    reset() {
      this.canvas.width = 0;
      this.canvas.height = 0;
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
  padding: 12px;
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

  @media screen and (max-width: 600px) {
    padding-top: 60px;
    .toolbar {
      transform: translateY(0%);
      // flex-direction: column;
      height: auto;
    }
  }
  .canvas-container {
    width: 100%;
    height: 100%;
    text-align: center;
    canvas {
      border: 0;
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