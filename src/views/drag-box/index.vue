<template>
    <div class="comp-container">
        <drag-resize-box bgColor="skyblue" :disabled="true">disabled</drag-resize-box>
        <drag-resize-box bgColor="yellow" :showToolbar="false">yellow</drag-resize-box>
        <drag-resize-box bgColor="red" :showClose="false">red</drag-resize-box>
        <drag-resize-box bgColor="orange" :showBorder="false">orange</drag-resize-box>
    </div>
</template>

<script>
import DragResizeBox from '@/components/drag-resize-box';
export default {
    name: 'drag-box',
    components: {
        DragResizeBox,
    },
    data() {
        return {

        };
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style lang="scss" scoped>
.comp-container {
    position: relative;
}
</style>