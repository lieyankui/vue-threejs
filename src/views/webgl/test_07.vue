<template>
  <div class="flex-box-v" :ref="containerRef">
    <canvas :ref="canvasRef"></canvas>
    <div class="webgl-mask">
      <div class="item-row">
        <button class="active" @click="moveToCenter">居中</button>
        <button class="active" @click="reset">还原</button>
        &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;
      </div>
      <div class="item-row" v-for="slider in sliderDatas" :key="slider.label">
        <my-slider
          v-model="slider.value"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          @slide="sliderChange"
        ></my-slider>
      </div>
      <div class="item-row" v-for="slider in rotationDatas" :key="slider.label">
        <my-slider
          v-model="slider.value"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          @slide="rotateChange"
        ></my-slider>
      </div>
    </div>
  </div>
</template>

<script>
import WebglMixin from "@/mixins/webgl-mixin";
import {
  initShader,
  initBuffers,
  clearDraw,
  setRectAngle,
  randomInt,
  drawF,
  getFArray,
} from "@/utils/webgl-utils";
export default {
  name: "webgl-test04",
  mixins: [WebglMixin],
  computed: {
    currX() {
      return this.sliderDatas[0].value;
    },
    currY() {
      return this.sliderDatas[1].value;
    },
    translationArr() {
      return [this.sliderDatas[0].value, this.sliderDatas[1].value];
    },
  },
  data() {
    return {
      positionAttributeLocation: null,
      resolutionUniformLocation: null,
      colorUniformLocation: null,
      translationLocation: null,
      rotationLocation: null,
      positionBuffer: null,
      animationFrameId: null,
      sliderDatas: [
        { value: 200, min: 0, max: 1200, label: "x" },
        { value: 200, min: 0, max: 580, label: "y" },
      ],
      rotationDatas: [{ value: 90, min: 0, max: 360, label: "r" }],
      colorArr: [
        [76, 201, 240],
        [72, 149, 239],
        [67, 97, 238],
        [63, 55, 201],
        [34, 167, 240],
        [137, 196, 244],
      ],
      width: 100,
      height: 120,
      sizeInfo: {},
      rotateInfo: [1, 0],
    };
  },

  mounted() {},

  methods: {
    // 加载
    initLoad() {
      const canvas = this.getCanvas();
      const gl = (this.gl = canvas.getContext("webgl"));
      // 定点着色器源码
      const vertexShaderSource = `
        // 一个属性值，将会从缓冲中获取数据
        attribute vec2 a_position;
        // 定义全局变量 u_resolution  resolution 意思为：分辨率
        uniform vec2 u_resolution;
        // 定义全局变量 u_translation;
        uniform vec2 u_translation;
        // 定义全局变量 u_rotation;
        uniform vec2 u_rotation;
        void main() {
          // 旋转
          vec2 rotatedPosition = vec2(
            a_position.x * u_rotation.y + a_position.y * u_rotation.x,
            a_position.y * u_rotation.y - a_position.x * u_rotation.x
          );
          // 加上平移量
          vec2 position = rotatedPosition + u_translation;
          // 把分辨率位置坐标转化为裁剪空间坐标数据
          // 当前位置所在的分辨率 / 屏幕总分辨率  得出 相对于屏幕总范围为 1 时，当前位置的坐标
          vec2 zeroToOne = position / u_resolution;
          // 因为裁剪空间坐标的总范围为 2 ，所以需要把相对于屏幕总范围为 1 时的坐标 * 2
          vec2 zeroToTwo = zeroToOne * 2.0;
          // 又因为裁剪空间的坐标为 -1 - 1 所以 再把结果减去 1 就转换为裁剪空间的坐标
          vec2 clipSpace = zeroToTwo - 1.0;
          gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
      `;

      // 片元着色器源码
      /**
       * precision mediump float; // 片段着色器没有一个默认精度，所以我们需要设置一个精度
       * mediump 是一个不错的默认值，代表 “medium precision” (中等精度)
       */
      const fragShaderSource = `
        // 片段着色器没有一个默认精度，所以我们需要设置一个精度
        precision mediump float;
        uniform vec4 u_color;
        void main() {
          gl_FragColor = u_color;
        }
      `;
      // 在GPU上创建GLSL着色程序
      const program = (this.program = initShader(
        gl,
        vertexShaderSource,
        fragShaderSource
      ));
      // 从着色程序中找到 a_position 属性的位置  寻找属性值位置（和全局属性位置）应该在初始化的时候完成，
      // 而不是在渲染循环中
      this.positionAttributeLocation = gl.getAttribLocation(
        program,
        "a_position"
      );
      // 找到全局变量 u_resolution 的位置
      this.resolutionUniformLocation = gl.getUniformLocation(
        program,
        "u_resolution"
      );
      // 找到全局变量 u_color 的位置
      this.colorUniformLocation = gl.getUniformLocation(program, "u_color");
      // 找到全局变量 u_translation
      this.translationLocation = gl.getUniformLocation(
        program,
        "u_translation"
      );
      // 找到全局变量 u_rotation
      this.rotationLocation = gl.getUniformLocation(program, "u_rotation");
      // 属性值从缓冲中获取数据，所以我们创建一个 位置信息 缓冲
      const positionBuffer = (this.positionBuffer = gl.createBuffer());
      // 绑定位置信息缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positionArr = getFArray(0, 0, this.width, this.height);

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positionArr),
        gl.STATIC_DRAW
      );

      this.render();
    },
    // 重新加载
    render() {
      this.cancelAnimationFrame();
      if (!this.gl) return;
      const gl = this.gl;
      const positionAttributeLocation = this.positionAttributeLocation;
      const program = this.program;
      const positionBuffer = this.positionBuffer;
      // 把裁剪空间坐标对应到画布像素坐标
      // 这样就告诉WebGL裁剪空间的 -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 和y轴的 0 -> gl.canvas.height。这样就告诉WebGL裁剪空间的 -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 和y轴的 0 -> gl.canvas.height。
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      // 清空画布
      clearDraw(gl);
      // 使用program
      gl.useProgram(program);
      // 告诉WebGL怎么从之前准备的缓冲中获取数据给着色器中的属性
      // 启用对应属性
      gl.enableVertexAttribArray(positionAttributeLocation);
      // 指定从缓冲中读取数据的方式
      // 将绑定点绑定到缓冲数据 positionBuffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // 告诉属性怎么从 positionBuffer 中读取数据（ARRAY_BUFFER）
      let size = 2; // 每次迭代运行提取两个单位数据
      let type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
      let normalize = false; // 不需要归一化数据
      let stride = 0; // 0 = 移动单位数量 * 每个单位占用内存 (sizeof(type))
      // 每次迭代运行运动多少内存到下一个数据开始点
      let offset = 0; // 从缓冲起始位置开始读取
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );
      gl.uniform2f(
        this.resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );
      gl.uniform4f(
        this.colorUniformLocation,
        this.colorArr[1][0] / 255,
        this.colorArr[1][1] / 255,
        this.colorArr[1][2] / 255,
        1
      );
      gl.uniform2fv(this.translationLocation, this.translationArr);

      gl.uniform2fv(this.rotationLocation, this.rotateInfo);
      const primitiveType = gl.TRIANGLES;
      const offset1 = 0;
      const count = 18;
      gl.drawArrays(primitiveType, offset1, count);
      // this.animationFrameId = window.requestAnimationFrame(() => {
      //   this.render();
      // });
    },
    cancelAnimationFrame() {
      if (!this.animationFrameId) return;
      window.cancelAnimationFrame(this.animationFrameId);
    },
    // webgl-mixin 混入文件中处理完窗口大小改变事件后会调用此方法
    onAfterResize(size, initFlag) {
      this.sizeInfo = size;
      // 如果是初始化加载执行只需要执行一次的代码
      if (initFlag) {
        this.initLoad();
      } else {
        this.render();
      }
      this.setMaxRange(size);
    },
    sliderChange(val) {
      this.render();
    },
    rotateChange(val) {
      this.rotateInfo = this.getPosiByRotateAngle(val);
      this.render();
    },
    getPosiByRotateAngle(val) {
      const angle = (parseInt(val) * Math.PI) / 180;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      return [x, y];
    },
    moveToCenter() {
      const size = this.sizeInfo;
      this.sliderDatas[0].value = Math.floor((size.width - this.width) / 2);
      this.sliderDatas[1].value = Math.floor((size.height - this.height) / 2);
    },
    setMaxRange(size) {
      this.sliderDatas[0].max = size.width - this.width;
      this.sliderDatas[1].max = size.height - this.height;
    },
    reset() {
      this.sliderDatas[0].value = 0;
      this.sliderDatas[1].value = 0;
    },
  },
  watch: {
    // sliderDatas: {
    //   deep: true,
    //   handler() {
    //     this.render();
    //   },
    // },
  },
};
</script>

<style lang="scss" scoped>
.webgl-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  // background-color: rgba(0, 0, 0, 0.3);
}
.item-row {
  text-align: right;
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  .item-label {
    display: inline-block;

    line-height: 1;
    padding: 0 8px;
    text-align: left;
    color: #1e80ff;
    font-size: 1.5rem;
  }
  .fix-width {
    width: 60px;
  }
  input[type="range"] {
    pointer-events: auto;
  }
}
</style>
