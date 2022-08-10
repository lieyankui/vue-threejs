<template>
  <div :style="{ display: listPosition === 'right' ? 'flex' : 'block' }">
    <div
      class="file-selector"
      :style="{
        backgroundImage: `url(${uploadIcon})`,
      }"
      @dragover="fileDragover"
      @drop="fileDrop"
    >
      <p>
        拖拽到此处上传或者
        <a href="javascript: void(0)" @click="showFileSelector">点击上传</a>
      </p>
      <input
        type="file"
        multiple
        @change="selectFilesChange"
        :ref="fileInputRef"
      />
    </div>
    <ul class="file-list" v-if="showFileList">
      <li
        class="file-list-item"
        @click="fileItemClick(file)"
        v-for="(file, index) in files"
        :key="index"
        :class="{ selected: file.id === currFileId }"
        @mouseover="showImage($event, file)"
      >
        <!-- @mouseout="hideImage" -->
        <img :src="file.src" />
        <p :title="file.name">{{ file.name }}</p>
      </li>
    </ul>
    <div
      class="image-popover"
      @click="hideImage"
      :class="{ 'image-popover-show': !!currHoverFile && popoverShow }"
    >
      <div class="toolbar"></div>
      <div class="image-popover-content" @click="(e) => (e.stopPropagation(),e.preventDefault())" :ref="popoverRef">
        <img :src="currHoverFile && currHoverFile.src" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import uploadIcon from "./imgs/upload-icon.png";
const FILE_STATUS_ENUM = {
  ADD: "add",
  REMOVE: "remove",
  UPLOADED: "uploaded",
};
// 生成唯一id
function getUniqueId() {
  return Math.random().toString().substring(2) + Date.now();
}

export default {
  name: "file-selector",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    listPosition: {
      type: String,
      default: "right", // bottom | right | inner
    },
  },
  data() {
    return {
      fileInputRef: "fileInputRef",
      uploadIcon: uploadIcon,
      MAX_FILE_SIZE: 10 * 1024 * 1024,
      files: [],
      currFileId: "",
      mouseHoverTimer: { timer: null, count: 0, ms: null },
      popoverDelayMs: 300,
      popoverShow: false,
      popoverData: null,
      popoverRef: "popoverRef",
      currHoverFile: null,
    };
  },

  mounted() {},

  methods: {
    hideImage(e) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        this.closePopover();
      }, 3000);
    },
    showImage(e, file) {
      e.preventDefault();
      e.stopPropagation();
      if (this.popoverShow === true) return;
      if (!this.mouseHoverTimer.ms) {
        this.mouseHoverTimer.ms = Date.now();
      } else {
        this.currHoverFile = file;
        const interval = Date.now() - this.mouseHoverTimer.ms;
        console.log("interval:", interval);
        if (interval >= this.popoverDelayMs) {
          this.showPopover(e, file);
          this.mouseHoverTimer = { timer: null, count: 0, ms: null };
        }
      }
    },
    showPopover(e, file) {
      console.log("e: ", e);
      console.log("file: ", file);
      const position = this.getPosition(e, this.$refs[this.popoverRef]);
      const popoverEle = this.$refs[
        this.popoverRef
      ];
      popoverEle.style.transform = `translate(${position.x}, ${position.y})`;
      console.log("position: ", position);
      this.popoverShow = true;
      this.popoverData = {
        imgSrc: file.src,
        postion: {
          x: e.x,
          y: e.y,
        },
      };
    },
    getPosition({ x, y }, ele) {
      const position = { x: x - 100 / 2, y: y - 100 / 2 };
      return position;
    },

    closePopover() {
      this.popoverShow = false;
      this.popoverData = null;
    },
    selectFilesChange(e) {
      const files = e.target.files;
      files.forEach(this.files2Imgs);
    },
    showFileSelector() {
      this.$refs[this.fileInputRef].click();
    },
    fileItemClick(file) {
      if (this.currFileId === file.id) {
        this.currFileId = "";
        this.$emit("file-selected", null);
      } else {
        this.currFileId = file.id;
        this.$emit("file-selected", file);
      }
    },
    fileDragover(e) {
      e.preventDefault();
    },
    fileDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > this.MAX_FILE_SIZE) {
        return alert(`文件大小不能超过${this.MAX_FILE_SIZE / 1024 / 1024}M`);
      }
      const type = Object.prototype.toString.call(file);
      if (type == "[object File]") {
        this.files2Imgs(file);
      }
    },
    files2Imgs(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.files.push({
          id: getUniqueId(),
          name: file.name,
          status: FILE_STATUS_ENUM.ADD,
          file: file,
          src: reader.result,
        });
      });
      reader.readAsDataURL(file);
    },
  },
  watch: {
    files(newVal) {
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.files)) {
        this.files = newVal;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$high-light: #409eff;
* {
  box-sizing: border-box;
}
.file-selector {
  position: relative;
  flex: 1;
  width: 320px;
  height: 160px;
  border: 1px dotted rgb(224, 224, 230);
  border-radius: 8px;
  padding: 24px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  //   background-size: 30% 30%;
  text-align: center;
  transition: background 0.3s ease-in-out;
  &:hover {
    border-color: $high-light;
    background-position: center 40%;
  }
  input[type="file"] {
    display: none;
  }
  p {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    font-size: 20px;
    text-align: center;
    color: #aaa;
    a {
      text-decoration: none;
      color: $high-light;
    }
  }
}
.file-list {
  flex: 1;
  display: flex;
  //   justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px 10px;
  list-style: none;
  padding: 0 24px;
  margin: 0;
  .file-list-item {
    position: relative;
    width: 100px;
    height: 125px;
    overflow: hidden;
    // padding-bottom: 26px;
    line-height: 28px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid rgb(224, 224, 230);
    border-radius: 3px;
    img {
      position: absolute;
      top: 40%;
      left: 50%;
      display: block;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      transform: translate(-50%, -50%);
    }
    p {
      //   display: none;
      position: absolute;
      width: 100%;
      line-height: 25px;
      bottom: 0;
      margin: 0;
      padding: 0 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    &:hover,
    &.selected {
      color: $high-light;
      border-color: $high-light;
      p {
        display: block;
      }
    }
  }
}
.image-popover {
  position: fixed;
  display: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
//   background-color: #ccc;
  background-color: transparent;
  .image-popover-content {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff;
    transition: transform 0.3s ease-in-out;
    width: 100px;
    height: 100px;
  }
  &.image-popover-show {
    display: block;
    .image-popover-content {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: auto;
      height: auto;
    }
  }
}
</style>