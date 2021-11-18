<template>
  <div class="flex-box-v" :ref="containerRef">
    <canvas :ref="canvasRef"></canvas>
  </div>
</template>

<script>
import WebglMixin from "@/mixins/webgl-mixin";
import { initShader, initBuffers } from "@/utils/webgl-utils";
export default {
  name: "webgl-test02",
  mixins: [WebglMixin],
  data() {
    return {};
  },

  mounted() {
  },

  methods: {
    // 加载
    load() {
      const canvas = this.getCanvas();
      const gl = canvas.getContext('webgl');
      const data = new Float32Array([0.5,0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5]);
      // 定点着色器源码
      const vertexShaderSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
      `;

      // 片元着色器源码
      const fragShaderSource = `
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `;
      const program = initShader(gl, vertexShaderSource, fragShaderSource);
      const programInfo = {
        program: program,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
        }
      }

      // 使用program
      gl.useProgram(program);
      gl.drawArrays(gl.POINTS, 1, 1);
    },
    drawScene(gl, programInfo, buffers) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL); // lequal
    },
    // 重新加载
    reload() {
      this.load();
    },
    // webgl-mixin 混入文件中处理完窗口大小改变事件后会调用此方法
    onAfterResize(size) {
      // console.log("size", size);
      this.reload();
    },
  },
};
</script>

<style lang="scss" scoped></style>
