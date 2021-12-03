<template>
  <div class="flex-box-v" :ref="containerRef">
    <canvas :ref="canvasRef"></canvas>
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
  loadImageAndCreateTextureInfo,
  createBuffer,
} from "@/utils/webgl-utils";
/**
 * degToRad: ƒ degToRad(d)
 * distance: ƒ distance(x1, y1, x2, y2)
 * dot: ƒ dot(x1, y1, x2, y2)
 * identity: ƒ identity()
 * inverse: ƒ inverse(m)
 * multiply: ƒ multiply(a, b)
 * normalize: ƒ normalize(x, y)
 * project: ƒ project(m, width, height)
 * projection: ƒ projection(width, height)
 * radToDeg: ƒ radToDeg(r)
 * reflect: ƒ reflect(ix, iy, nx, ny)
 * rotate: ƒ rotate(m, angleInRadians)
 * rotation: ƒ rotation(angleInRadians)
 * scale: ƒ scale(m, sx, sy)
 * scaling: ƒ scaling(sx, sy)
 * transformPoint: ƒ transformPoint(m, v)
 * translate: ƒ translate(m, tx, ty)
 * translation: ƒ translation(tx, ty)
 */
import m3 from "@/utils/math/m3";
import m4 from "@/utils/math/m4";
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
    scaleX() {
      return this.scaleDatas[0].value;
    },
    scaleY() {
      return this.scaleDatas[1].value;
    },
    translationArr() {
      return [this.sliderDatas[0].value, this.sliderDatas[1].value];
    },
  },
  data() {
    return {
      positionLocation: null,
      texcoordLocation: null,
      textureLocation: null,
      matrixLocation: null,
      positionBuffer: null,
      texcoordBuffer: null,
      animationFrameId: null,
      sliderDatas: [
        { value: 200, min: 0, max: 1200, label: "x" },
        { value: 200, min: 0, max: 580, label: "y" },
      ],
      rotationDatas: [{ value: 0, min: 0, max: 360, label: "r" }],
      scaleDatas: [
        { value: 1, min: -5, max: 5, label: "scaleX" },
        { value: 1, min: -5, max: 5, label: "scaleY" },
      ],
      colorArr: [
        [63, 55, 201],
        [67, 97, 238],
        [72, 149, 239],
        [34, 167, 240],
        [76, 201, 240],
        [137, 196, 244],
      ],
      width: 100,
      height: 120,
      sizeInfo: {},
      rotateInfo: [1, 0],
      rotateAngle: 0,
      textureInfos: [],
      drawInfos: [],
      then: 0,
      speed: 60,
    };
  },

  async created() {},
  mounted() {},

  methods: {
    // 加载
    initLoad() {
      console.log("initLoad start......");
      const canvas = this.getCanvas();
      const gl = (this.gl = canvas.getContext("webgl"));
      // 定点着色器源码
      const vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec2 a_texcoord;

        uniform mat4 u_matrix;

        varying vec2 v_texcoord;

        void main() {
          gl_Position = u_matrix * a_position;
          v_texcoord = a_texcoord;
        }
      `;
      /** 片段着色器源码
       *
       */
      const fragShaderSource = `
        // 片段着色器没有一个默认精度，所以我们需要设置一个精度
        precision mediump float;

        varying vec2 v_texcoord;

        uniform sampler2D u_texture;

        void main() {
          gl_FragColor = texture2D(u_texture, v_texcoord);
        }
      `;
      // 在GPU上创建GLSL着色程序
      const program = (this.program = initShader(
        gl,
        vertexShaderSource,
        fragShaderSource
      ));

      this.positionLocation = gl.getAttribLocation(
        program,
        "a_position"
      );
      this.texcoordLocation = gl.getAttribLocation(
        program,
        "a_texcoord"
      );
      this.matrixLocation = gl.getUniformLocation(program, "u_matrix");
      this.textureLocation = gl.getUniformLocation(program, "u_texture");

      const positionArr = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
      this.positionBuffer = createBuffer(gl, positionArr);
      //
      const texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
      this.texcoordBuffer = createBuffer(gl, texcoords);

      this.textureInfos.push(
        loadImageAndCreateTextureInfo(gl, "static/imgs/123.jpg")
      );
      this.textureInfos.push(
        loadImageAndCreateTextureInfo(gl, "static/imgs/158.jpg")
      );
      this.textureInfos.push(
        loadImageAndCreateTextureInfo(gl, "static/imgs/148.jpg")
      );
      const numToDraw = 9;
      for (let i = 0; i < numToDraw; i++) {
        const x = Math.random() * gl.canvas.width;
        const y = Math.random() * gl.canvas.height;
        console.log('x:', x);
        console.log('y:', y);
        const drawInfo = {
          x: x,
          y: y,
          dx: Math.random() > 0.5 ? -1 : 1,
          dy: Math.random() > 0.5 ? -1 : 1,
          textureInfo: this.textureInfos[Math.random() * this.textureInfos.length | 0]
        };
        this.drawInfos.push(drawInfo);
      }
      console.log(this.drawInfos);
      this.render();
      console.log("initLoad end......");
    },
    update(deltaTime) {
      const gl = this.gl;
      const drawInfos = this.drawInfos;
      const speed = this.speed;
      drawInfos.forEach(drawInfo => {
        // console.log('drawInfo.x:', drawInfo.x);
        // console.log('drawInfo.y:', drawInfo.y);
        drawInfo.x += drawInfo.dx * speed * deltaTime;
        drawInfo.y += drawInfo.dy * speed * deltaTime;
        if(drawInfo.x < 0){
          drawInfo.dx = 1;
        }
        if(drawInfo.x >= gl.canvas.width){
          drawInfo.dx = -1;
        }
        if(drawInfo.y < 0){
          drawInfo.dy = 1;
        }
        if(drawInfo.y >= gl.canvas.height){
          drawInfo.dy = -1;
        }
      });
    },
    drawImage(tex, texWidth, texHeight, dstX, dstY) {
      const gl = this.gl;
      const program = this.program;
      const positionBuffer = this.positionBuffer;
      const texcoordBuffer = this.texcoordBuffer;
      const positionLocation = this.positionLocation;
      const texcoordLocation = this.texcoordLocation;
      const textureLocation = this.textureLocation;
      const matrixLocation = this.matrixLocation;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      // 告诉 WebGL 使用的程序
      gl.useProgram(program);
      // 设置属性 从缓冲中提取数据
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.enableVertexAttribArray(texcoordLocation);
      gl.vertexAttribPointer(
        texcoordLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      // 从像素空间转换到裁剪空间
      let matrix = m4.orthographic(
        0,
        gl.canvas.width,
        gl.canvas.height,
        0,
        -1,
        1
      );
      // 平移到 dstX， dstY
      matrix = m4.translate(matrix, dstX, dstY, 0);
      // 缩放单位矩形的宽和高 texWidth, texHeight 个单位长度
      matrix = m4.scale(matrix, texWidth, texHeight, 1);
      // 设置矩阵
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      // 告诉着色器使用纹理单元
      gl.uniform1i(textureLocation, 0);
      // 绘制矩形
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    /**
     * 加载一些图像用于纹理
     * 创建一个纹理信息 {width: w, height: h, texture: tex}
     * 纹理起初为 1 * 1 像素，当图像加载完成后更新大小
     */
    loadImageAndCreateTextureInfo(url) {
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
      );
      // 假设所有的图像维度都不是2的整数次幂
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      const textureInfo = {
        width: 1,
        height: 1,
        texture: tex,
      };
      const img = new Image();
      img.addEventListener("load", function () {
        textureInfo.width = img.width;
        textureInfo.height = img.height;

        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
      });
      img.src = url;
      return textureInfo;
    },
    // 重新加载
    render(time) {
      // console.log("time:", time);
      this.cancelAnimationFrame();
      if (!this.gl) return;
      const now = time * 0.001;
      const deltaTime = Math.min(0.1, now - this.then);
      if(isNaN(deltaTime)) {
        console.log("time", time);
        console.log("typeof time", typeof time);
        console.log("now", now);
        console.log("then", this.then);
        throw Error('deltaTime is NaN');
      }
      // console.log("deltaTime:", deltaTime);
      this.then = now;
      this.update(deltaTime);

      const gl = this.gl;
      const drawInfos = this.drawInfos;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      drawInfos.forEach(drawInfo => {

        this.drawImage(
          drawInfo.textureInfo.texture,
          drawInfo.textureInfo.width,
          drawInfo.textureInfo.height,
          drawInfo.x,
          drawInfo.y,
        );
      });
      this.animationFrameId = window.requestAnimationFrame(this.render);
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
      this.rotateAngle = val;
      this.rotateInfo = this.getPosiByRotateAngle(val);
      this.render();
    },
    scaleChange() {
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
