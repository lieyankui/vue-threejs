<template>
  <div class="my-grid-table-wrap">
    <div class="my-grid-table-toolbar" :style="toolbarStyle">
      <div class="my-grid-table-toolbar-switch" @click="changeSwitch">
        <div class="hover-icon">
          <i class="el-icon-d-arrow-left"></i>
        </div>
      </div>
      <div class="my-grid-table-toolbar-content" v-show="switchFlag">
        <div class="my-grid-table-toolbar-item">
          <div class="title">配置信息</div>
        </div>
        <div class="my-grid-table-toolbar-item">
          <div class="label">行数</div>
          <div class="input">
            <input
              type="text"
              v-model="tableParams.rowNum"
              :readonly="!isEditing"
            />
          </div>
        </div>
        <div class="my-grid-table-toolbar-item">
          <div class="label">列数</div>
          <div class="input">
            <input
              type="text"
              v-model="tableParams.colNum"
              :readonly="!isEditing"
            />
          </div>
        </div>
        <div class="my-grid-table-toolbar-item" v-show="isEditing">
          <button @click="saveConfInfo">确定</button>
        </div>
        <div class="my-grid-table-toolbar-item" v-show="!isEditing">
          <button @click="editConf">编辑</button>
        </div>
        <div class="my-grid-table-toolbar-item" v-show="isEditing">
          <button @click="restoreConf">还原</button>
        </div>
        <div class="my-grid-table-toolbar-item">
          <div class="title">可拖拽组件</div>
        </div>
        <div class="comp-wrap">
          <!-- 直接展示位组件 -->
          <div
            v-if="isEditing"
            v-for="item in compArr"
            :key="isEditing + '' + item.compPath"
            draggable="true"
            @dragstart="compDrag($event, item.compPath)"
          >
            <span>{{ item.compName }}</span>
            <div class="comp-item">
              <component
                :is="item.component"
                class="comp-item-body"
                v-if="item.component && item.compPath"
              ></component>
            </div>
          </div>
          <div v-if="!isEditing" v-for="item in compArr" :key="isEditing + '' + item.compPath">
            <span>{{ item.compName }}</span>
            <div class="comp-item" draggable="false">
              <component
                :is="item.component"
                class="comp-item-body"
                v-if="item.component && item.compPath"
              ></component>
            </div>
          </div>
          <!-- 展示为图标 -->
          <!-- <div
            v-if="isEditing"
            v-for="item in compArr"
            :key="item"
            draggable="true"
            @dragstart="compDrag($event,item.compPath)"
          >
            <span>{{item.compName}}</span>
            <div class="comp-item">
              <img :src="item.compIcon" alt>
            </div>
          </div>
          <div v-if="!isEditing" v-for="item in compArr">
            <span>{{item.compName}}</span>
            <div class="comp-item" draggable="false">
              <img :src="item.compIcon" alt>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <table class="my-grid-table-main">
      <tr height="0" class="empty-tr">
        <td class="empty-td"></td>
        <td
          v-for="colIndex of parseInt(tableParams.colNum)"
          :style="tdWidth"
          :key="colIndex"
        ></td>
      </tr>
      <tr class="my-grid-tr" v-for="(tr, rowIndex) in tdArr" :key="rowIndex">
        <td :style="tdHeight"></td>
        <!-- <td class="empty-td"></td> -->
        <template v-for="(td, colIndex) in tr">
          <!-- :style="{
              width: (100 / tableParams.colNum) * (td.colspan || 1) + '%',
              height: (100 / tableParams.rowNum) * (td.rowspan || 1) + '%'
          }"-->
          <td
            class="my-grid-td"
            :class="{ 'not-edit': !isEditing }"
            :rowspan="td.rowspan"
            :colspan="td.colspan"
            :data-tdjson="JSON.stringify(td)"
            v-if="td.enabled"
            :key="colIndex"
            @drop="compDrop($event, td.uniqueStr)"
            @dragover="compDragover($event, td.uniqueStr)"
          >
            <!-- v-if="td.showToolbar" -->
            <!-- @mouseenter.stop="showTdToolbar(td)"
              @mouseleave.stop="hideTdToolbar(td)"
            @mouseout.stop="hideTdToolbar(td)"-->
            <div v-show="isEditing" class="my-grid-td-toolbar">
              <div class="hover-icon">
                <i class="el-icon-arrow-down"></i>
              </div>
              <input
                type="text"
                placeholder="列数"
                v-model="td.colspan"
                @input="collapseTdCol(td)"
              />
              <input
                type="text"
                placeholder="行数"
                v-model="td.rowspan"
                @input="collapseTdRow(td)"
              />
              &#160;
              <i
                class="el-icon-close close-btn"
                title="清除组件"
                @click="clearComp(td)"
              ></i>
            </div>
            <div
              class="my-grid-td-content"
              draggable="true"
              @dragstart="compDrag($event, td.compPath, td)"
              v-if="isEditing"
              @mousedown="onMouseDown($event, td)"
            >
              <component :is="td.component" v-if="td.component"></component>
            </div>
            <div class="my-grid-td-content" draggable="false" v-if="!isEditing">
              <component :is="td.component" v-if="td.component"></component>
            </div>
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>
<script>
import { _import } from "@/utils";
export default {
  name: "tl-grid-template",
  components: {},
  props: {
    // 所需对象
    data: {
      type: Object,
      default() {
        return null;
      },
    },
    //初始化行数
    initRowNum: {
      type: Number | String,
      default: 6,
    },
    // 初始化列数
    initColNum: {
      type: Number | String,
      default: 5,
    },
    componentArr: {
      type: Array,
      default() {
        return [
          {
            compCode: "test_01",
            compName: "test_01",
            compPath: "components/tl-grid-template/src/components/test/test_01",
          },
          {
            compCode: "test_02",
            compName: "test_02",
            compPath: "components/tl-grid-template/src/components/test/test_02",
          },
          {
            compCode: "test_03",
            compName: "test_03",
            compPath: "components/tl-grid-template/src/components/test/test_03",
          },
        ];
      },
    },
    initConfData: {
      type: Object,
      default() {
        return {
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
        };
      },
    },
  },
  data() {
    return {
      tableParams: {
        rowNum: 6,
        colNum: 5,
      },
      tdArr: [],
      tdTempData: { colspan: 1, rowspan: 1, enabled: true },
      switchFlag: true,
      isEditing: false,
      isInit: true,
      compArr: [],
    };
  },
  created() {
    // console.log('this', this);
    this.initData();
    this.initCompArr(this.componentArr);
    this.initEvents();
  },
  mounted() {},
  destroyed() {
    this.cancelEvents();
  },
  watch: {
    ["tableParams.rowNum"](val) {
      // 行数改变时执行的方法
      if (this.isInit) return;

      this.setTdArr();
    },
    ["tableParams.colNum"](val) {
      //列数改变时执行的方法
      if (this.isInit) return;

      this.setTdArr();
    },
    data(val) {
      this.dataChange(val);
    },
    componentArr(val) {
      this.initCompArr(val);
    },
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    toolbarStyle() {
      return this.switchFlag
        ? {}
        : {
            // transform: "translate(100%,-50%)"
            transform: "translate(100%)",
          };
    },
    switchStyle() {
      return this.switchFlag
        ? {}
        : {
            "padding-left": "7px",
          };
    },
    tdWidth() {
      return {
        width: 100 / this.tableParams.colNum + "%",
      };
    },
    tdHeight() {
      return {
        height: 100 / this.tableParams.rowNum + "%",
      };
    },
  },
  methods: {
    /**
     * 初始化数据的方法
     */
    initData() {
      //
      if (this.data) {
        this.dataChange(this.data);
      } else {
        this.initTableParams();
      }
    },
    /**
     * 初始化表格配置参数
     */
    initTableParams() {
      let tableParams = {
        rowNum: this.initRowNum,
        colNum: this.initColNum,
      };
      this.tableParams = tableParams;
    },
    /**
     * 初始化事件
     */
    initEvents() {
      window.addEventListener('mousemove',this.onMouseMove);
      window.addEventListener('mouseup',this.onMouseUp);
    },
    /**
     * 取消事件
     */
    cancelEvents() {
      window.removeEventListener('mousemove',this.onMouseMove);
      window.removeEventListener('mouseup',this.onMouseUp);
    },
    /**
     * 绑定的data数据发生改变时执行的方法
     */
    dataChange(data) {
      if (data && Object.keys(data).length) {
        let tableParams = this.deepClone(data.tableParams);
        let tdArr = this.deepClone(data.tdArr);
        this.tdArr = this.loadCompData(tdArr);
        this.$forceUpdate();
        this.setTableParams(tableParams);
      }
    },
    /**
     * 复制对象的方法
     */
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },
    /**
     * 加载用户配置的组件信息数据
     */
    loadCompData(datas) {
      for (let i = 0; i < datas.length; i++) {
        let arr = datas[i];
        for (let l = 0; l < arr.length; l++) {
          let item = arr[l];
          if (item.compPath) {
            item.component = _import(item.compPath);
          }
        }
      }
      return datas;
    },
    /**
     * 加载可拖拽组件数据
     */
    initCompArr(datas) {
      for (let i = 0; i < datas.length; i++) {
        const comp = datas[i];
        if (comp.compPath) {
          try {
            comp.component = _import(comp.compPath);
          } catch (error) {
            console.log("【引入组件信息失败】：组件路径为==", comp.compPath);
            datas.splice(i, 1);
            i--;
          }
        }
      }
      this.compArr = datas;
      this.$forceUpdate();
    },
    /**
     * 点击确定时执行的方法
     */
    saveConfInfo() {
      this.isEditing = false;
      // 保存相关操作
      let confData = JSON.stringify({
        tdArr: this.dealTdDatas(this.tdArr),
        tableParams: this.tableParams,
      });
      // console.log("保存编辑的首页配置数据", confData);
      this.$emit("save", confData);
    },
    /**
     * 点击保存时删除配置信息中的组件实例数据
     */
    dealTdDatas(datas) {
      if (!datas || !datas.length) return;
      let newDatas = JSON.parse(JSON.stringify(datas));
      for (let i = 0; i < newDatas.length; i++) {
        let arr = newDatas[i];
        for (let l = 0; l < arr.length; l++) {
          let item = arr[l];
          delete item.component;
        }
      }
      return newDatas;
    },
    /**
     * 点击编辑时切换为编辑状态
     */
    editConf() {
      this.isEditing = true;
    },
    /**
     * 清除当前单元格绑定的组件数据
     */
    clearComp(td) {
      if (!td.compPath && !td.component) return;
      td.compPath = "";
      td.component = null;
      this.$forceUpdate();
    },
    /**
     * 还原为默认的配置信息
     */
    restoreConf() {
      // console.log("this.initConfData", this.initConfData);
      let initConfData = null;
      try {
        initConfData = JSON.parse(this.initConfData);
      } catch (error) {
        initConfData = this.initConfData;
      }
      this.tdArr = initConfData.tdArr;
      this.loadCompData(this.tdArr);
      this.$forceUpdate();
      this.setTableParams(initConfData.tableParams);
    },
    /**
     * 鼠标按下时执行的方法
     *
     */
    onMouseDown(event, td){
      // console.log("event", event);
      // console.log('td', td);
      // console.log('event.button', event.button);
    },
    /**
     * 鼠标移动时执行的方法
     */
    onMouseMove(event) {
      // console.log('onMouseMove this', this);
    },

    /**
     *鼠标谈起时执行的方法
     */
    onMouseUp(event) {
      // console.log('onMouseUp this', this);
    },
    /**
     * 组件拖动时执行的方法  设置事件数据传输对象用来传输参数
     * @param event 拖动事件对象
     * @param compPath  拖动的组件对象的组件路径
     * @param dragStartTd  如果拖动的是td才会有此参数  拖动开始的td的唯一标识
     */
    compDrag(event, compPath, dragStartTd) {
      let data = {
        compPath: compPath,
      };
      if (dragStartTd) {
        data.startUniqueStr = dragStartTd.uniqueStr;
      }
      event.dataTransfer.setData("dragData", JSON.stringify(data));
    },
    /**
     * 拖拽的元素放下时执行的方法
     * @param event 事件对象
     * @param uniqueStr  放下的目标元素的唯一标识 用来获取对应元素
     */
    compDrop(event, uniqueStr) {
      event.preventDefault();
      let data = event.dataTransfer.getData("dragData");
      data = JSON.parse(data);
      let compPath = data.compPath;
      if (!compPath) return;
      let startUniqueStr = data.startUniqueStr;
      // console.log("拖拽事件传的参数", compPath);
      // console.log("拖拽事件传的参数tdArr", this.tdArr);
      let flag = false;
      let flag2 = !startUniqueStr;
      for (let i = 0; i < this.tdArr.length; i++) {
        let arr = this.tdArr[i];
        for (let l = 0; l < arr.length; l++) {
          let item = arr[l];
          // 如果拖动的是td则清空起始拖动的td中的组件
          if (!!startUniqueStr && item.uniqueStr == startUniqueStr) {
            item.component = null;
            item.compPath = "";
            flag2 = true;
            if (flag) {
              break;
            }
          }
          // 设置目标td对象对应的组件内容
          if (item.uniqueStr == uniqueStr) {
            item.component = compPath && _import(compPath);
            item.compPath = compPath;
            // console.log("当前td对象", item);
            flag = true;
            if (flag2) {
              break;
            }
          }
        }
        if (flag && flag2) {
          this.$forceUpdate();
          break;
        }
      }
    },
    // 组件拖动完成后执行的方法
    compDragover(event) {
      event.preventDefault();
    },
    //
    changeSwitch() {
      this.switchFlag = !this.switchFlag;
    },
    setTdArr() {
      let arr = [];
      let rowNum = this.tableParams.rowNum;
      let colNum = this.tableParams.colNum;
      for (let i = 0; i < rowNum; i++) {
        let tdArr = [];
        for (let l = 0; l < colNum; l++) {
          tdArr.push({
            ...this.tdTempData,
            rowNum: i,
            colNum: l,
            uniqueStr: i + "::" + l,
          });
        }
        arr.push(tdArr);
      }
      // console.log("tdArr", JSON.stringify(arr));
      this.tdArr = arr;
      this.$forceUpdate();
    },
    // 设置table配置
    setTableParams(tableParams) {
      this.isInit = true;
      this.tableParams = tableParams;
      this.$nextTick(() => {
        this.isInit = false;
      });
    },
    // 合并列执行的方法
    collapseTdCol(td) {
      let tableParams = this.tableParams;
      let tr = this.tdArr[td.rowNum];
      // 判断要合并的列数小于1 则重新复制为1
      if (parseFloat(td.colspan) < 1) {
        td.colspan = 1;
      }
      // 如果要合并的列数加上当前列的下标大于表格的总列数 则复制为最大可合并取值
      if (parseFloat(td.colspan) + parseFloat(td.colNum) > tableParams.colNum) {
        td.colspan = tableParams.colNum - parseFloat(td.colNum);
      }
      let { rowspan, colspan, rowNum, colNum, oldColspan } = td;
      // 获取修改后要合并的列数和修改前要合并的列数的差值
      let colDiff = parseFloat(colspan) - (parseFloat(oldColspan) || 1);
      if (colDiff == 0) return;
      let flag = colDiff > 0;
      for (let i = 0; i < rowspan; i++) {
        let trData = this.tdArr[rowNum + i];
        for (let l = 1; l <= Math.abs(colDiff); l++) {
          let tdData =
            trData[
              colNum + parseFloat(Math.min(colspan, oldColspan || 1)) - 1 + l
            ];
          tdData.enabled = !flag;
        }
      }
      // 记录上次合并的列数
      td.oldColspan = td.colspan;
    },
    // 验证合并列输入的数据
    validateColData(td) {
      let tableParams = this.tableParams;
      let tr = this.tdArr[td.rowNum];
      // 判断要合并的列数小于1 则重新赋值为1
      if (parseFloat(td.colspan) < 1) {
        td.colspan = 1;
      }
      // 如果要合并的列数加上当前列的下标大于表格的总列数 则复制为最大可合并取值
      if (parseFloat(td.colspan) + parseFloat(td.colNum) > tableParams.colNum) {
        td.colspan = tableParams.colNum - parseFloat(td.colNum);
      }
      // 遍历当前行中
    },
    // 合并行的方法
    collapseTdRow(td) {
      let tableParams = this.tableParams;
      let tr = this.tdArr[td.rowNum];
      // 判断要合并的列数小于1 则重新复制为1
      if (parseFloat(td.rowspan) < 1) {
        td.rowspan = 1;
      }
      if (parseFloat(td.rowspan) + parseFloat(td.rowNum) > tableParams.rowNum) {
        td.rowspan = tableParams.rowNum - parseFloat(td.rowNum);
      }
      let { rowspan, colspan, rowNum, colNum, oldColspan } = td;
      // 获取合并行数改变的值
      let rowDiff = parseFloat(td.rowspan) - (parseFloat(td.oldRowspan) || 1);
      if (rowDiff == 0) return;
      let flag = rowDiff > 0;
      for (let i = 1; i <= Math.abs(rowDiff); i++) {
        // 获取要修改的行数据
        let rowNum =
          td.rowNum +
          parseFloat(Math.min(td.rowspan, td.oldRowspan) || 1) -
          1 +
          i;
        let trData = this.tdArr[rowNum];
        // 获取要修改的列数据
        for (let l = 0; l < colspan; l++) {
          let tdData = trData[colNum + l];
          tdData.enabled = !flag;
        }
      }
      td.oldRowspan = td.rowspan;
    },
    // 遍历tr重新设置tr中td的下标
    refreshTdColNum(tr) {
      if (!tr) return;
      // 遍历重新设置当前行中列的下标
      for (let i = 0; i < tr.length; i++) {
        let tdData = tr[i];
        tdData.colNum = i;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.my-grid-table-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
}
.my-grid-table-toolbar {
  user-select: none;
  position: absolute;
  right: -1px;
  // top: 30%;
  // height: 400px;
  // transform: translateY(-50%);
  top: 0;
  height: 100%;
  z-index: 888;
  background: #fff;
  padding: 15px 0px 15px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transform: translateX(100%);
  box-shadow: -2px 5px 15px -5px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateX(0%);
  }
  .comp-wrap {
    margin-right: 10px;
    .comp-item {
      max-width: 150px;
      height: 120px;
      margin-bottom: 10px;
      border: 1px solid #e6e6e6;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
      .comp-item-body {
        zoom: 0.2;
        // transform: scale(20%);
      }
      &[draggable="false"] {
        cursor: not-allowed;
        pointer-events: none;
      }
      &[draggable="true"] {
        cursor: allowed;
      }
    }
  }
  .my-grid-table-toolbar-switch {
    position: absolute;
    left: 0px;
    top: 50%;
    width: 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50% 0 0 50%;
    transform: translate(-100%, -50%);
    background-color: skyblue;
    cursor: pointer;
    color: #fff;
  }
  .my-grid-table-toolbar-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .my-grid-table-toolbar-item {
    display: flex;
    margin-bottom: 10px;
    margin-right: 10px;
    height: 40px;
    line-height: 40px;

    div {
      display: inline-block;
      padding: 0 5px;
    }
    input {
      border: 0;
      width: 100px;
      outline: none;
      text-align: center;
    }
    button,
    input[type="button"],
    input[type="submit"] {
      width: 100%;
      background: skyblue;
      border: 1px solid skyblue;
      cursor: pointer;
    }
    .input {
      flex: 1;
      text-align: center;
      border: 1px solid #e6e6e6;
      border-radius: 3px;
    }
    .title {
      width: 100%;
      text-align: center;
      font-weight: bolder;
    }
  }
}
.my-grid-table-main {
  width: 100%;
  height: 100%;
  border: 0;
  border-collapse: collapse;
  box-sizing: border-box;
  table-layout: fixed;
  .empty-tr {
    height: 0;
    td {
      border: 0;
      padding: 0;
    }
  }
  .my-grid-tr {
    .empty-td {
      width: 0;
      padding: 0;
    }
    .my-grid-td {
      position: relative;
      padding: 5px 5px 3px 3px;
      border: 1px dotted skyblue;
      box-sizing: border-box;
      overflow: hidden;
      // resize: none;
      .my-grid-td-content {
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
        overflow: hidden;
        box-shadow: 3px 3px 10px 0px #cccccc;
        background: skyblue;
        border-radius: 10px;
        & > * {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          overflow: auto;
          // box-shadow: 0px 0px 2px 1px #cccccc;
        }
        // &[draggable="false"] {
        //   cursor: not-allowed;
        // }
      }
      .my-grid-td-toolbar {
        position: absolute;
        top: -30px;
        right: 0px;
        z-index: 11;
        border-radius: 5px;
        border: 1px solid #ccc;
        background: #fff;
        // box-shadow: -2px 5px 15px -5px rgba(0, 0, 0, 0.3);

        // padding: 0 10px;
        input {
          display: inline-block;
          width: 50px;
          line-height: 24px;
          border: 0;
          outline: none;
          text-align: center;
          border: 1px solid #e6e6e6;
          border-radius: 3px;
        }
        .hover-icon {
          position: absolute;
          bottom: -15px;
          right: 10px;
          height: 15px;
          width: 20px;
          border-radius: 0px 0px 10px 10px;
          background-color: skyblue;
          cursor: pointer;
          text-align: center;
          color: #fff;
        }
        .close-btn {
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
          color: skyblue;
        }
        &:hover {
          top: 0px;
          box-shadow: -2px 5px 15px -5px rgba(0, 0, 0, 0.3);
          .hover-icon {
            display: none;
          }
        }
      }
    }
    .not-edit {
      border: 0;
    }
  }
}
</style>
