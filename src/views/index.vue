<template>
  <div class="flex-box-v">
    <!-- <div class="nav-wrapper">
      <button
        class="nav-item"
        :class="{ active: !!currNavItem && currNavItem === item }"
        v-for="item of compArr"
        :key="item.compPath"
        @click="navItemClicked(item)"
      >
        {{ item.text }}
      </button>
    </div> -->
    <div class="nav-wrapper-left">
      <div class="nav-wrapper-left-toggleicon"></div>
      <div class="nav-wrapper-left-content">
        <ul>
          <li
            class="nav-item"
            :class="{ active: !!currNavItem && currNavItem === item }"
            v-for="item of compArr"
            :key="item.compPath"
            @click="navItemClicked(item)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>

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
.nav-wrapper-left {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  width: 0;
  height: 100%;
  background: #FFFFFF;
  transition: all 0.2s ease-in-out;
  box-shadow: 10px 0 15px 3px #ddd;
  &:hover {
    width: 200px;
    .nav-wrapper-left-content {
      // visibility: visible;
    }
  }
  .nav-wrapper-left-content {
    transition: all 0.1s ease-in-out 0.21s;
    // visibility: visible;
    overflow: hidden;
    ul {
      list-style: none;
      padding-left: 0px;
      li {
        padding: 0 16px;
        line-height: 32px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        &:hover,
        &.active {
          background-color: #CCCCCC;
          color: blue;
        }
      }
    }
  }
  .nav-wrapper-left-toggleicon {
    position: absolute;
    right: -12px;
    top: 50%;
    width: 24px;
    height: 24px;
    transform: translateY(-50%) rotate(45deg);
    background: red;
  }
}
.view-wrapper {
  //
}
</style>
