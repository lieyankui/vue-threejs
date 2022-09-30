<template>
  <div class="draw-container">
    <h1>国庆头像制作</h1>
    <hr />
    <div class="form-container">
      <div class="upload-container">
        <div class="left">
          <file-selector :originImgUrls="originImgUrls" listPosition="bottom" v-model="form.files" @change="fileChange"></file-selector>
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
    </div>
    <div class="bg">

    </div>
  </div>
</template>

<script>
import FileSelector from "../../components/file-selector/index.vue";
import img1 from '/static/imgs/photo/avatars-dog.png'
import img2 from '/static/imgs/photo/avatars-dog2.png'
import img3 from '/static/imgs/photo/avatars-shuita.png'
export default {
  components: { FileSelector },
  data() {
    return {
      currentUrl: "",
      imgData: [],
      originImgUrls: [img1, img2, img3],
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
      console.log('files: ', files);
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
  background: rgba(255, 255, 255, 0.2);
  min-height: 100%;
  * {
    box-sizing: border-box;
  }
  h1 {
    text-align: left;
    color: red;
  }
  a {
    color: red;
  }
  hr {
    background-color: red;
    height: 3px;
    border: 0;
  }
  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to left top, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4), transparent), url('/static/imgs/guoqing/gq4096.png');
    background-repeat: no-repeat;
    z-index: -1;
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

  @media screen and (max-width: 600px) {
    padding-left: 24px;
    padding-right: 24px;
    .bg {
      background-size: 100% auto;
    }
  }
}
</style>
