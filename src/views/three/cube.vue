<template>
  <div class="comp-container canvas-wrapper" :ref="containerRef"></div>
</template>

<script>
import ThreeMixin from "@/mixins/three-mixin";
export default {
  name: "three-cube",
  mixins: [ThreeMixin],
  data() {
    return {
      initLoad: true,
    };
  },
  mounted() {},

  methods: {
    loadCb({ scene, camera }) {
      // cube
      const geomery = new this.$three.BoxGeometry(1, 1, 1);
      // MeshPhongMaterial 材质不会受灯光影响
      //   const material = new this.$three.MeshBasicMaterial({ color: 0x99ffcc });
      const material = new this.$three.MeshPhongMaterial({ color: 0x99ffcc });

      const cube = (this.cube = new this.$three.Mesh(geomery, material));
      scene.add(cube);

      camera.position.z = 10;
      // light
      const color = 0xffffff;
      const intensity = 1;
      const light = new this.$three.DirectionalLight(color, intensity);
      light.position.set(0, 2, 4);
      scene.add(light);
    },
    renderCb() {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    },
  },
};
</script>

<style lang="scss" scoped></style>
