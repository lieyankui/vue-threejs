<template>
  <div class="news-item">
    <h2 class="news-item-title">{{ data.title }}</h2>
    <p class="news-item-subtitle">{{ data.createTime }}</p>
    <p class="news-item-content">{{ data.content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },

  mounted () {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.news-item {
  &:not(:last-child) {
    border-bottom: 1px solid #aaa;
  }
  .news-item-title {
    text-align: center;
  }
  .news-item-subtitle {
    text-align: right;
    padding-right: 24px;
  }
  .news-item-content {
    text-indent: 2em;
  }
}
</style>
