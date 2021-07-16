import { Subject } from "rxjs";

export class DragBoxWrapper {
    // DragBoxItem array
    items = [];
    $ele = null;
    onItemsChange = new Subject();
    constructor(ele) {
        this.log('constructor', 'start');
        this.$ele = ele;
        
        this.init();
        this.log('constructor', 'end');
    }

    init() {
        this.log('init', 'start');


        this.log('init', 'end');
    }

    initData() {
        this.log('initData', 'start');
        const { $ele } = this;
        this.width = $ele.clientWidth;
        this.height = $ele.clientHeight;
        this.log('initData', 'end');
    }
    
    initEvents() {
        window.addEventListener('resize', (e) => {
            this.onResize(e);
        });
    }

    addItem(item) {
        this.log('addItem', item);
        items.push(item);
        this.onItemsChange.next(this.items);
        return this.items;
    }

    removeItem(item) {
        this.log('removeItem', 'item');
        const {items} = this;
        const index = items.indexOf(item);
        if(index > 0){
            const removeItem = items.splice(index, 1)
            this.onItemsChange.next(items);
            return removeItem;
        }
        return null;
    }

    clear() {
        this.log('clear', 'start');

        this.items = [];
        this.onItemsChange.next([]);

        this.log('clear', 'end');
    }

    onResize(e) {
        this.log('onResize', 'event', e);
        
    }

    log(method, message, content) {
        console.log(`【${this.formatDate()}】[DragBoxItem]--method: [${method}]: ${message}`, content);
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