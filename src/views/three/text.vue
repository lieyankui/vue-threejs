<template>
    <div class="comp-container canvas-wrapper" :ref="containerRef">
    </div>
</template>

<script>
import ThreeMixin from '@/mixins/three-mixin';
import { loadFont } from '@/utils/three-utils';

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
            var material = new $three.MeshBasicMaterial( { color: 0x0000ff } );
            loadFont('static/font/three/FZShuTi_Regular.json').subscribe(font => {
                // console.log('font', font);
                // console.log('isFont', font.isFont);

                /**
                 * font — THREE.Font的实例。
                 * size — Float。字体大小，默认值为100。
                 * height — Float。挤出文本的厚度。默认值为50。
                 * curveSegments — Integer。（表示文本的）曲线上点的数量。默认值为12。
                 * bevelEnabled — Boolean。是否开启斜角，默认为false。
                 * bevelThickness — Float。文本上斜角的深度，默认值为20。
                 * bevelSize — Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
                 * bevelSegments — Integer。斜角的分段数。默认值为3。
                 * 
                */
                var textGeometry = new $three.TextGeometry('呵呵', {
                    font: font,
                    size: 10,
                    height: 5,
                    curveSegments: 10,
                    bevelEnabled: false,
                    bevelThickness: 3,
                    bevelSize: 2,
                    bevelSegments: 3
                });
                var mesh = new $three.Mesh(textGeometry, material);
                scene.add( mesh );
            });

            
        },

        renderCb() {

        }
    },
};
</script>

<style lang="scss" scoped>

</style>