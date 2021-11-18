import { debounceTime, fromEvent, map, Observable, startWith } from "rxjs";

export default {
  data() {
    return {
      containerRef: "containerRef",
      canvasRef: "canvasRef",
      $subscribe: null,
      $resizeSub: null,
    };
  },
  mounted() {
    this.$subscribe = fromEvent(window, "resize")
      .pipe(
        startWith(0),
        debounceTime(200),
      )
      .subscribe(() => {
        this.onResize && this.onResize();
      });
  },

  methods: {
    onResize() {
      this.$resizeSub = this.initSize().subscribe((res) => {
        this.onAfterResize && this.onAfterResize(res);
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
