<template>
  <div class="comp-container">
    <div class="comp-content">
      <news-item
        v-for="news in newsList"
        :data="news"
        :key="news.id"
      ></news-item>
    </div>
    <div class="comp-footer" :title="copyrightStr">
      <div class="comp-footer-content">
        {{ copyrightStr }}
      </div>
    </div>
  </div>
</template>

<script>
import { newsList } from "./mock";
import NewsItem from "./news-item.vue";
export default {
  components: {
    NewsItem,
  },
  data() {
    return {
      newsList,
      copyrightStr: "Copyright © 2003-2024 yokry, Inc. all rights reserved",
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}
.comp-content {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 24px;
  overflow: auto;
}
.comp-container {
  max-height: 100%;
  position: relative;
  padding-bottom: 60px;
  background: url("/static/imgs/news-bg.jpg");

  .comp-footer {
    position: fixed;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100%;
    bottom: 0;
    left: 0;
    box-shadow: 0 -10px 20px 3px #ccc;

    .comp-footer-content {
      width: 100%;
      padding: 0 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>
