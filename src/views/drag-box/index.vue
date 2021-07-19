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
    const wrapper = new DragBoxWrapper(this.getContainer);
  },
  methods: {
    getContainer() {
      return this.$refs[this.contaienr];
    },
  },
};
</script>

<style lang="scss" scoped></style>
