<template>
  <div class="flex-box-v">
    <div class="nav-wrapper">
      <button
        class="nav-item"
        :class="{ active: !!currNavItem && currNavItem === item }"
        v-for="item of compArr"
        :key="item.compPath"
        @click="navItemClicked(item)"
      >
        {{ item.text }}
      </button>
    </div>
    <div class="view-wrapper flex-main">
      <component :is="currComp" v-if="!!currComp"></component>
    </div>
  </div>
</template>

<script>
import compArr from "./comp.conf";
import { _importView } from "@/utils";
export default {
  name: "VueThreejsIndex",
  data() {
    return {
      compArr: compArr,
      currComp: null,
      currNavItem: null,
    };
  },
  mounted() {
    this.navItemClicked(this.compArr[0]);
  },
  methods: {
    navItemClicked(item) {
      if (this.currNavItem === item) return;
      this.currNavItem = item;
      const { compPath } = item;
      this.currComp = _importView(compPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  .nav-item {
    margin-bottom: 10px;
  }
}
.view-wrapper {
  //
}
</style>
