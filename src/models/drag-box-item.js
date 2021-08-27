export class DragBoxItem {
    $wrapper = null;
    $ele = null;
    position = {};
    constructor(domElement, dragBoxWrapper) {
        this.$domElement = domElement;
        this.$wrapper = dragBoxWrapper;
    }

    initData() {
        //
        this.log('initData', 'start');

        this.log('initData', 'end');
    }

    initEvent() {
        //
    }

    onMove(event) {

    }

    remove() {
        if(!this.$wrapper) return;
        return this.$wrapper.removeItem(this);
    }

}