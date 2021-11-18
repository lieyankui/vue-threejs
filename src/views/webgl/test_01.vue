<template>
  <div class="flex-box-v" :ref="containerRef">
    <canvas :ref="canvasRef"></canvas>
  </div>
</template>

<script>
import WebglMixin from "@/mixins/webgl-mixin";
import { initShader } from "@/utils/webgl-utils";
export default {
  name: "webgl-test01",
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

      // 定点着色器源码
      const vertexShaderSource = `
        void main() {
          gl_PointSize = 50.0;
          gl_Position = vec4(20.0, 0.0, 0.0, 100.0);
        }
      `;

      // 片元着色器源码
      const fragShaderSource = `
        void main() {
          gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
      `;
      const program = initShader(gl, vertexShaderSource, fragShaderSource);
      // 使用program
      gl.useProgram(program);
      gl.drawArrays(gl.POINTS, 1, 1);
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
