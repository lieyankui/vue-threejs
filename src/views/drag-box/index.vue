<template>
    <div class="comp-container" :ref="container">
        
    </div>
</template>

<script>
import { DragBoxWrapper, DragBoxItem } from '@/models/index';
export default {
    name: 'VueThreejsIndex',
    data() {
        return {
            container: 'container',
        };
    },

    mounted() {
        const wrapper = new DragBoxWrapper(this.getContainer);
    },

    methods: {
        
        getContainer() {
            return this.$refs[this.contaienr];
        }
    },
};
</script>

<style lang="scss" scoped>

</style>