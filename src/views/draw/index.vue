<template>
  <div class="draw-container">
    <h1>Welcome to Yokry's automatic scoring page</h1>
    <hr />
    <div class="form-container">
      <div class="upload-container">
        <div class="left">
          <file-selector v-model="form.files" @change="fileChange"></file-selector>
        </div>
        <div class="right">
          <ul>
            <li v-for="img in imgData" :key="img.url">
              <div>
                <img :src="img.src" />
                <span>{{ img.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="label">最低分</div>
        <div class="control">
          <input type="number" v-model="form.minScore" />
        </div>
      </div>
      <div class="row">
        <div class="label">最高分</div>
        <div class="control">
          <input type="number" v-model="form.minScore" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileSelector from "../../components/file-selector/index.vue";
export default {
  components: { FileSelector },
  data() {
    return {
      currentUrl: "",
      imgData: [],
      form: {
        minScore: 0,
        maxScore: 0,
        files:[],
      },
    };
  },
  mounted() {},
  methods: {
    upload() {
      //
    },
    triggerFile() {
      const fileInput = this.getFileControl();
      fileInput.click();
    },
    fileChange(files) {
      // console.log('files: ', files);
      // files.forEach(this.files2Imgs);
    },
    files2Imgs(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imgData.push({
          name: file.name,
          src: reader.result,
        });
      });
      reader.readAsDataURL(file.file);
    },

    getFileControl() {
      return this.$refs["fileControl"];
    },
  },
};
</script>

<style lang="scss" scoped>
.draw-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  * {
    box-sizing: border-box;
  }
  hr {
    background-color: skyblue;
    height: 3px;
    border: 0;
  }
  .form-container {
    color: rgb(51, 54, 57);
    .upload-container {
      padding: 12px;
    }
    .row {
      max-width: 100%;
      min-height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      font-size: 16px;
      .label {
        width: 100px;
        text-align: right;
        padding-right: 24px;
      }
      .control {
        flex: 8;
        border: 1px solid rgb(224, 224, 230);
        border-radius: 8px;
        padding: 0 18px;
        input {
          display: block;
          max-width: 100%;
          width: 100%;
          line-height: 36px;
          border: 0;
          outline: none;
        }
      }
      &.row {
        margin-top: 12px;
      }
    }
  }
}
</style>
