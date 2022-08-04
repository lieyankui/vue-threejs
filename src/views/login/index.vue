<template>
  <div class="comp-container login-wrapper">
    <div class="login-form" ref="loginRef"></div>
    <h1>容器高度为：{{ formHeight }}</h1>
    <h2>{{ count }}</h2>
  </div>
</template>

<script>
import { map, concatAll, fromEvent, takeUntil } from "rxjs";
export default {
  name: "my-login",
  computed: {
    formHeight() {
      const ret =
        (this.$refs &&
          this.$refs["loginRef"] &&
          this.$refs["loginRef"].clientWidth) ||
        0;
      return ret;
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    // this.addDragEvent();
    console.log("formHeight: ", this.formHeight);
    console.log(
      'this.$refs["loginRef"].clentHeight: ',
      this.$refs["loginRef"].clientWidth
    );

    //
    // const source = interval(500).pipe(take(3));
    // source.subscribe((res) => {
    //   console.log("res", res);
    // });
  },
  methods: {
    addDragEvent() {
      let loginRef = this.$refs["loginRef"];
      let body = document.body;
      const mouseDown = fromEvent(loginRef, "mousedown");
      const mouseMove = fromEvent(body, "mousemove");
      const mouseUp = fromEvent(body, "mouseup");
      mouseDown
        .pipe(map(() => mouseMove.pipe(takeUntil(mouseUp))))
        .pipe(concatAll())
        .pipe(map((event) => ({ x: event.clientX, y: event.clientY })))
        .subscribe((pos) => {
          console.log("pos", pos);
          loginRef.style.left = pos.x + "px";
          loginRef.style.top = pos.y + "px";
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  background-image: linear-gradient(135deg, #c2ffd8 10%, #465efb 100%);
  position: relative;
}
.login-form {
  position: absolute;
  border: 1px solid #00f;
  width: 200px;
  height: 200px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // background-color: rgba(255, 255, 255, .3);
}
</style>
