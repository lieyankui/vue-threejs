<template>
  <div class="flex-box-v" :ref="containerRef">
    <canvas :ref="canvasRef"></canvas>
  </div>
</template>

<script>
import WebglMixin from "@/mixins/webgl-mixin";
import { initShader, initBuffers, clearDraw } from "@/utils/webgl-utils";
export default {
  name: "webgl-test03",
  mixins: [WebglMixin],
  data() {
    return {
      positionAttributeLocation: null,
      positionBuffer: null,
    };
  },

  mounted() {},

  methods: {
    // 加载
    initLoad() {
      const canvas = this.getCanvas();
      const gl = (this.gl = canvas.getContext("webgl"));
      // 定点着色器源码
      /**
       * attribute vec4 a_position; // 一个属性值，将会从缓冲中获取数据
       */
      const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
          gl_Position = a_position;
        }
      `;

      // 片元着色器源码
      /**
       * precision mediump float; // 片段着色器没有一个默认精度，所以我们需要设置一个精度
       * mediump 是一个不错的默认值，代表 “medium precision” (中等精度)
       */
      const fragShaderSource = `
        precision mediump float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
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
      // 属性值从缓冲中获取数据，所以我们创建一个 位置信息 缓冲
      const positionBuffer = (this.positionBuffer = gl.createBuffer());
      // 绑定位置信息缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positionArr = [0, 0, 0, 0.5, 0.7, 0];
      // 通过绑定点向缓冲中存放数据
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positionArr),
        gl.STATIC_DRAW
      );

      this.render();
    },
    // 重新加载
    render() {
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
      const primitiveType = gl.TRIANGLES;
      const offset1 = 0;
      const count = 3;
      gl.drawArrays(primitiveType, offset1, count);
      window.requestAnimationFrame(() => {
        this.render();
      });
    },
    // webgl-mixin 混入文件中处理完窗口大小改变事件后会调用此方法
    onAfterResize(size, initFlag) {
      // 如果是初始化加载执行只需要执行一次的代码
      if (initFlag) {
        this.initLoad();
      } else {
        this.render();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
