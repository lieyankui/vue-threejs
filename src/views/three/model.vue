<template>
    <div class="comp-container canvas-wrapper" :ref="containerRef">
    </div>
</template>

<script>
import ThreeMixin from '@/mixins/three-mixin';
import { loadGltf } from '@/utils/three-utils';


//
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
        loadCb({scene, camera, renderer}) {
            renderer.gammaOutput = true;
            renderer.gammaFactor = 2.2;
            camera.position.set( 0, 200, 1000 );
            // camera.lookAt( 0, 0, 0 );
            // const $three = this.$three;
            // var material = new $three.MeshBasicMaterial( { color: 0x0000ff } );

            loadGltf('static/models/phoenix_bird/scene.gltf').subscribe(gltf => {
                // console.log('gltf', gltf);
                // console.log('gltf.scene', gltf.scene);
                const model = gltf;

                scene.add( gltf.scene );
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Scene
                gltf.scenes; // Array<THREE.Scene>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
            }, error => {
                console.log('error', error);
            });
        },

        renderCb() {

        }
    },
};
</script>

<style lang="scss" scoped>

</style>