<template>
  <div class="comp-container login-wrapper">
    <div class="login-form"></div>
  </div>
</template>

<script>
export default {
  name: "my-login",
  mounted() {
      const arr = [1, 2, 3];
      const iterator = arr[Symbol.iterator]();
      console.log('arr', arr);
      console.log('Symbol.iterator', Symbol.iterator);
      console.log('iterator', iterator);
      console.log('iterator.next()', iterator.next());
      console.log('iterator.next()', iterator.next());
      console.log('iterator.next()', iterator.next());
      console.log('iterator.next()', iterator.next());
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  // background-image: linear-gradient( 135deg, #C2FFD8 10%, #465EFB 100%);
}
.login-form {
  // background-color: rgba(255, 255, 255, .3);
}
</style>
