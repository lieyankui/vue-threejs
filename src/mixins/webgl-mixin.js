import { debounceTime, fromEvent, map, Observable, startWith } from "rxjs";

export default {
  data() {
    return {
      containerRef: "containerRef",
      canvasRef: "canvasRef",
      $subscribe: null,
      $resizeSub: null,
      gl: null,
      program: null,
    };
  },
  mounted() {
    this.$subscribe = fromEvent(window, "resize")
      .pipe(
        startWith(true),
        debounceTime(200),
      )
      .subscribe((e) => {
        let initFlag = false;
        if(e === true) {
          initFlag = true;
        }
        this.onResize && this.onResize(initFlag);
      });
  },

  methods: {
    onResize(initFlag) {
      this.$resizeSub = this.initSize().subscribe((res) => {
        this.onAfterResize && this.onAfterResize(res, initFlag);
      });
    },
    initSize() {
      if (this.$resizeSub) {
        this.$resizeSub.unsubscribe();
      }
      const container = this.getContainer();
      const canvas = this.getCanvas();
      canvas.setAttribute("width", 0);
      canvas.setAttribute("height", 0);
      return new Observable((observer) => {
        this.$nextTick(() => {
          canvas.setAttribute("width", container.clientWidth);
          canvas.setAttribute("height", container.clientHeight);
          this.$nextTick(() => {
            observer.next({ width: canvas.width, height: canvas.height });
          })
        });
      });
    },
    getContainer() {
      return this.getRef(this.containerRef);
    },
    getCanvas() {
      return this.getRef(this.canvasRef);
    },
    getRef(refStr) {
      return this.$refs[refStr];
    },
  },
  destroyed() {
    this.$subscribe.unsubscribe();
  },
};
