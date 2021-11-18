<template>
  <div class="comp-container" :ref="container">
    <tl-grid-template :data="initConfData"></tl-grid-template>
    <!-- <test-drag></test-drag> -->
  </div>
</template>

<script>
import { DragBoxWrapper, DragBoxItem } from "@/models/index";
import TlGridTemplate from "@/components/tl-grid-template/index";
import TestDrag from "@/components/test-drag";

export default {
  name: "VueThreejsIndex",
  components: {
    TlGridTemplate,
    TestDrag,
  },
  data() {
    return {
      container: "container",
      initConfData: {
        tableParams: {
          rowNum: 6,
          colNum: 5,
        },
        tdArr: [
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 0,
              colNum: 0,
              uniqueStr: "0::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 0,
              colNum: 1,
              uniqueStr: "0::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 0,
              colNum: 2,
              uniqueStr: "0::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 0,
              colNum: 3,
              uniqueStr: "0::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 0,
              colNum: 4,
              uniqueStr: "0::4",
            },
          ],
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 1,
              colNum: 0,
              uniqueStr: "1::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 1,
              colNum: 1,
              uniqueStr: "1::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 1,
              colNum: 2,
              uniqueStr: "1::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 1,
              colNum: 3,
              uniqueStr: "1::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 1,
              colNum: 4,
              uniqueStr: "1::4",
            },
          ],
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 2,
              colNum: 0,
              uniqueStr: "2::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 2,
              colNum: 1,
              uniqueStr: "2::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 2,
              colNum: 2,
              uniqueStr: "2::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 2,
              colNum: 3,
              uniqueStr: "2::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 2,
              colNum: 4,
              uniqueStr: "2::4",
            },
          ],
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 3,
              colNum: 0,
              uniqueStr: "3::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 3,
              colNum: 1,
              uniqueStr: "3::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 3,
              colNum: 2,
              uniqueStr: "3::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 3,
              colNum: 3,
              uniqueStr: "3::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 3,
              colNum: 4,
              uniqueStr: "3::4",
            },
          ],
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 4,
              colNum: 0,
              uniqueStr: "4::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 4,
              colNum: 1,
              uniqueStr: "4::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 4,
              colNum: 2,
              uniqueStr: "4::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 4,
              colNum: 3,
              uniqueStr: "4::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 4,
              colNum: 4,
              uniqueStr: "4::4",
            },
          ],
          [
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 5,
              colNum: 0,
              uniqueStr: "5::0",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 5,
              colNum: 1,
              uniqueStr: "5::1",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 5,
              colNum: 2,
              uniqueStr: "5::2",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 5,
              colNum: 3,
              uniqueStr: "5::3",
            },
            {
              colspan: 1,
              rowspan: 1,
              enabled: true,
              rowNum: 5,
              colNum: 4,
              uniqueStr: "5::4",
            },
          ],
        ],
      },
    };
  },
  mounted() {
    // const wrapper = new DragBoxWrapper(this.getContainer);
    // const array = ['1', '2', '3'].map(parseInt);
    // console.log('array', array);
    // console.log('parseInt("2", 1)', parseInt("2", 1));// NaN
    // console.log('parseInt("1", 1)', parseInt("1", 1));// NaN
    // console.log('parseInt("0", 1)', parseInt("0", 1));//
    // console.log('parseInt("3", 2)', parseInt("3", 2));// NaN
    // console.log('parseInt("2", 2)', parseInt("2", 2));// NaN
    // console.log('parseInt("1", 2)', parseInt("1", 2));// 1

    // 测试位掩码
    // const flag1 = 1;
    // const flag2 = 2;
    // const flag3 = 4;
    // let mask = flag1 | flag2 | flag3;
    // console.log("mask: ", mask); // 3
    // console.log("mask & flag1:  ", mask & flag1); // 1
    // console.log("mask & flag2:  ", mask & flag2); // 2
    // console.log("mask & flag3:  ", mask & flag3); // 4

    //
    // const mask0 = parseInt("00000001", 2);
    // const mask1 = parseInt("00000010", 2);
    // const mask2 = parseInt("00000100", 2);
    // const mask3 = parseInt("00001000", 2);
    // const mask4 = parseInt("00010000", 2);
    // const mask5 = parseInt("00100000", 2);
    // const mask6 = parseInt("01000000", 2);
    // const mask7 = parseInt("10000000", 2);
    // let valueFlags = 1;
    // // console.assert(xxx); 断言结果为true时不会输出任何结果
    // console.assert(valueFlags & mask0); //

    // valueFlags |= mask0 | mask1; // valueFlags = valueFlags | (mask0 | mask1)
    // console.assert(valueFlags & mask0 && valueFlags & mask1);

    // valueFlags |= mask7; // valueFlags = valueFlags | mask7
    // console.assert(valueFlags & mask7);
    // console.assert(valueFlags & mask0 && valueFlags & mask1);

    // valueFlags &= ~mask1;
    // console.assert(!(valueFlags & mask1));
    // console.log(valueFlags ^ mask1);
  },
  methods: {
    getContainer() {
      return this.$refs[this.contaienr];
    },
  },
};
</script>

<style lang="scss" scoped></style>
