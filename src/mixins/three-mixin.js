// import { getScene } from '@/utils/three-utils';
export default {
    data() {
        return {
            containerRef: 'container',
            scene: null,
            camera: null,
            renderer: null,
        }
    },
    mounted() {
        // window.addEventListener('resize', this.onResize);
        this.initLoad && this.load();
    },
    destroyed() {
        // window.removeEventListener('resize', this.onResize);
    },
    methods: {
        load() {
            let container = this.getContainer();
            let containerWidth = container.clientWidth;
            let containerHeight = container.clientHeight;
            let scene = this.scene = new this.$three.Scene();
            let camera = this.camera = new this.$three.PerspectiveCamera(45, containerWidth/containerHeight, 0.1, 1000);
            let renderer = this.renderer = new this.$three.WebGLRenderer();
            renderer.setSize(containerWidth, containerHeight);
            container.appendChild(renderer.domElement);

            this.loadCb && this.loadCb({scene, camera, renderer});
            this.render();
        },
        render() {
            this.resizeRenderToDisplaySize();
            if(this.renderCb) this.renderCb();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.render);
        },
        getContainer() {
            return this.$refs[this.containerRef];
        },
        onResize() {
            const container = this.getContainer();
            let width = container.clientWidth;
            let height = container.clientHeight;
            const canvas = this.renderer.domElement;
            canvas.width = width;
            canvas.height = height;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        },
        resizeRenderToDisplaySize(renderer){
            renderer = renderer || this.renderer;
            const container = this.getContainer();
            const canvas = renderer.domElement;
            const pixelRatio = window.devicePixelRatio;
            const width = container.clientWidth * (pixelRatio | 1);
            const height = container.clientHeight * (pixelRatio | 1);
            const needResize = canvas.width !== width || canvas.height !== height;
            if(needResize) {
                canvas.width = width;
                canvas.height = height;
                renderer.setSize(width, height, false);
            }
            console.log('needResize', needResize);
            return needResize;
        },
    }
}