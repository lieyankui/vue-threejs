<template>
  <div class="draw-container">
    <h1>Welcome to Yokry's automatic scoring page</h1>
    <div class="form-container">
      <div class="upload-container">
        <div class="left">
          <input type="file" accept="image/*" multiple @change="fileChange" ref="fileControl">
        </div>
        <div class="right"></div>
      </div>
      <div class="row">
        <div class="label">最低分</div>
        <div class="control"><input type="number" v-model="form.minScore"></div>
      </div>
      <div class="row">
        <div class="label">最高分</div>
        <div class="control"><input type="number" v-model="form.minScore"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUrl: "",
      urls: [],
      form: {
        minScore: 0,
        maxScore: 0,

      },
    };
  },
  mounted() {
    console.log('getFileControl: ', this.getFileControl());
    const fileInput = this.getFileControl();
    fileInput.click();
    fileInput.trigger();
  },
  methods: {
    upload() {
      //
    },
    fileChange(e) {
      console.log('files: ', e.target.value);
    },

    filesConvert(files) {
      return files.map(file => {
        return {
          name: file.name,

        }
      });
    },

    getFileControl() {
      return this.$refs['fileControl'];
    }
  },
};
</script>

<style lang="scss" scoped>

.draw-container {
  width: 1200px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  * {
    box-sizing: border-box;
  }
  .form-container {
    color: rgb(51, 54, 57);
    .upload-container {
      display: flex;
      padding: 24px;
      .left {
        flex: 1;
      }
      .right {
        flex: 1;
      }
    }
    .row {
      max-width: 100%;
      min-height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      font-size: 16px;
      .label {
        flex:3;
        text-align: right;
        padding-right: 24px;
      }
      .control {
        flex:8;
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
