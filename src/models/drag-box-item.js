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
    
    log(method, message) {
        console.log(`【${this.formatDate()}】[DragBoxItem]--method: [${method}]: ${message}`);
    }
    
    formatDate(date) {
        date = date || new Date();
        date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // const week = date.getDay();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const milliSeconds = date.getMilliseconds();
        return `${year}-${month}-${day} ${hour}:${minute}:${second} ${milliSeconds}`;
    }
}