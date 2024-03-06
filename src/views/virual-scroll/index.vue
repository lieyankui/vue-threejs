<template>
  <div class="comp-container">
    <div class="table-wrapper">
      <div class="table-body-left" ref="tableBodyLeft" @wheel="tableBodyScroll">
        <div
          class="table-body-content"
          :style="{ height: tableData.length * parseInt(itemHeight) + 'px' }"
        >
          <table class="table-body-table">
            <tr v-for="item in currTableData" :style="rowStyle" :key="item.id">
              <td>{{ item.id }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div
        class="table-body-main"
        ref="tableBodyMain"
        @wheel.prevent.stop="tableBodyWheel"
        @scroll.prevent.stop="tableBodyScroll"
      >
        <div
          class="table-body-content"
          :style="{ height: tableData.length * parseInt(itemHeight) + 'px' }"
        >
          <table
            class="table-body-table table-body-table-main"
            ref="tableBodyMainTable"
          >
            <tr
              v-for="item in currTableData"
              :height="itemHeight"
              :key="item.id"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div
        class="table-body-right"
        ref="tableBodyRight"
        @wheel="tableBodyScroll"
      >
        <div
          class="table-body-content"
          :style="{ height: tableData.length * parseInt(itemHeight) + 'px' }"
        >
          <table class="table-body-table">
            <tr v-for="item in currTableData" :style="rowStyle" :key="item.id">
              <td>{{ item.name }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemHeight: {
      type: [Number, String],
      default: '32px'
    }
  },
  computed: {
    totalHeight () {
      return this.tableData.length * this.itemHeight
    },
    rowStyle () {
      return {
        height: parseInt(this.itemHeight) + 'px'
      }
    }
  },
  watch: {
    startIndex: {
      immediate: true,
      handler (val) {
        this.currTableData = this.tableData.slice(val, val + 15)
        console.log('this.currTableData: ', this.currTableData)
      }
    }
  },
  data () {
    const tableData = []
    for (let i = 1; i <= 10000; i++) {
      tableData.push({
        id: `id_${i}`,
        name: `name_${i}`,
      })
    }
    return {
      tableData,
      currTableData: [],
      startIndex: 0
    }
  },

  mounted () {},

  methods: {
    tableBodyWheel (event) {
      const flag = -event.wheelDeltaY / Math.abs(event.wheelDeltaY)
      this.$refs['tableBodyMain'].scrollTop +=
        flag * (parseInt(this.itemHeight) * 3)
      this.tableBodyScroll()
    },
    tableBodyScroll () {
      // event.preventDefault();
      // const flag = -event.wheelDeltaY / Math.abs(event.wheelDeltaY)
      // if (this.startIndex <= 0 && flag < 0) {
      //     return
      // }
      const scrollTop = this.$refs['tableBodyMain'].scrollTop
      this.$refs['tableBodyMainTable'].style.top = scrollTop + 'px'
      if (scrollTop >= this.totalHeight) {
        // this.startIndex = this.tableData.length -
      } else if (scrollTop < this.itemHeight) {
        this.startIndex = 0
      } else {
        this.startIndex = Math.max(
          Math.floor(scrollTop / parseInt(this.itemHeight)),
          0
        )
      }
      // this.$refs["tableBodyMainTab le"].style.transform = `translateY(${this.startIndex * this.itemHeight}px)`
      console.log('this.startIndex: ', scrollTop, this.startIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper {
  position: relative;
  width: 600px;
  height: 320px;
  margin: 100px auto;
  .table-body-left,
  .table-body-right {
    position: absolute;
    top: 0;
    overflow: hidden;
    pointer-events: none;
    // background-color: #FFFFFF;
  }
  .table-body-left,
  .table-body-main,
  .table-body-right {
    height: 100%;
    text-align: center;
    scroll-behavior: smooth;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        line-height: 32px;
        &:hover {
          background-color: #cccccc;
        }
      }
    }
    .table-body-content {
      position: relative;
      .table-body-table.table-body-table-main {
        position: absolute;
        top: 0px;
        width: 100%;
      }
    }
  }
  .table-body-left {
    left: 0;
    width: 120px;
  }
  .table-body-right {
    right: 17px;
    width: 140px;
  }
  .table-body-main {
    padding-left: 120px;
    padding-right: 140px;
    overflow: auto;
  }
}
</style>
