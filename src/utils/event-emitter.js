/**
 * on(event, listener)：为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
    emit(event, [arg1], [arg2])： 按监听器的顺序执行执行每个监听器
    addListener(event, listener)：on的同名函数（alias）
    once(event, listener): 和on类似，但只触发一次，随后便解除事件监听
    removeListener(event, listener)： 移除指定事件的某个监听回调
    removeAllListeners([event])：移除指定事件的所有监听回调
    setMaxListeners(n)：用于提高监听器的默认限制的数量。（默认10监听回调个产生警告）
    listeners(event)： 返回指定事件的监听器数组。
 */

// ES5 version

function EventEmitter() {
  this.listeners = {};
  this.maxListenerNum = 10;
}

EventEmitter.prototype.on = function(type, listener) {
  if(typeof listener !== "function") {
    throw console.error("监听器类型必须为function。");
  }
  var listeners = this.listeners;
  if(listeners[type] && listeners[type].length >= this.maxListenerNum) {
    throw console.error('监听器的最大数量是%d,您已超出限制', this.maxListener)
  }
  if(listeners[type] instanceof Array){
    listeners[type].push(listener);
  } else {
    listeners[type] = [].concat(listener);
  }
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

EventEmitter.prototype.emit = function(type) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.listeners[type].forEach(listener => {
    listener.apply(null, args);
  });
}

EventEmitter.prototype.removeListener = function(type, listener) {
  var listeners = this.listeners[type] || [];
  var index = listeners.indexOf(listener);
  if(index >= -1){
    listeners.splice(index, 1);
  }
}

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  function fn() {
    var args = Array.prototype.slice.call(arguments);
    listener.apply(null, args);
    self.removeListener(type, fn);
  }
  self.on(type, fn);
}

EventEmitter.prototypez.removeAllListeners = function(type) {
  this.listeners[type] = [];
}

EventEmitter.prototype.listeners = function(type) {
  return this.listeners[type];
}

EventEmitter.prototype.setMaxListenerNum = function(num) {
  this.maxListenerNum = num;
}



