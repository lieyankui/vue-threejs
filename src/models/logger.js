export class Logger {

    constructor() {
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