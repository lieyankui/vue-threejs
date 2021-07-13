<template>
    <div class="comp-container canvas-wrapper" :ref="containerRef">
    </div>
</template>

<script>
import ThreeMixin from '@/mixins/three-mixin';
export default {
    name: 'VueThreejsLine',
    mixins: [ ThreeMixin ],
    data() {
        return {
            initLoad: true,
        };
    },

    mounted() {
        
    },

    methods: {
        loadCb({scene, camera}) {
            camera.position.set( 0, 0, 100 );
            camera.lookAt( 0, 0, 0 );
            const $three = this.$three;
            var material = new $three.LineBasicMaterial( { color: 0x0000ff } );
            var lineGeometry = new $three.BufferGeometry();
            const pointArray = [
                new $three.Vector3(-10, 0, 0),
                new $three.Vector3(0, 10, 0),
                new $three.Vector3( 10, 0, 0)
            ];
            lineGeometry.setFromPoints(pointArray);
            var line = new $three.Line( lineGeometry, material );
            scene.add( line );
        },

        renderCb() {

        }
    },
};
</script>

<style lang="scss" scoped>

</style>