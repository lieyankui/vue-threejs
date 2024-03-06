<template>
  <div class="draw-container">
    <!-- <h1>Welcome to Yokry's automatic scoring page</h1> -->
    <!-- <hr /> -->
    <div class="form-container">
      <div class="upload-container">
        <div class="left">
          <file-selector
            v-model="form.files"
            @change="fileChange"
          ></file-selector>
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
      <div class="container">
        <div class="cube">
          <div class="back">back</div>
          <div class="down">down</div>
          <div class="up">up</div>
          <div class="right">right</div>
          <div class="left">left</div>
          <div class="front">front</div>
        </div>
      </div>

      <!-- <div class="row">
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
      </div> -->
    </div>
  </div>
</template>

<script>
import FileSelector from '../../components/file-selector/index.vue'
export default {
  components: { FileSelector },
  data () {
    return {
      currentUrl: '',
      imgData: [],
      form: {
        minScore: 0,
        maxScore: 0,
        files: []
      }
    }
  },
  mounted () {},
  methods: {
    upload () {
      //
    },
    triggerFile () {
      const fileInput = this.getFileControl()
      fileInput.click()
    },
    fileChange (files) {
      // console.log('files: ', files);
      // files.forEach(this.files2Imgs);
    },
    files2Imgs (file) {
      if (!file) return
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.imgData.push({
          name: file.name,
          src: reader.result
        })
      })
      reader.readAsDataURL(file.file)
    },

    getFileControl () {
      return this.$refs['fileControl']
    }
  }
}
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

.container {
  perspective: 800px;
  perspective-origin: center -200px;
}

.cube {
  position: relative;
  width: 150px;
  height: 150px;
  margin: calc(50vh - 75px) auto;
  /* 设置子元素位于3D空间中 */
  transform-style: preserve-3d;
  transform: rotateY(-45deg);
}

/* 重叠在一起 */
.cube div {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}

.front {
  background: rgba(255, 0, 0, 0.5);
  animation: front 0.5s ease 0.5s forwards;
}

.left {
  background: rgba(255, 251, 0, 0.5);
  animation: left 0.5s ease 1.5s forwards;
}

.right {
  background: rgba(72, 255, 0, 0.5);
  animation: right 0.5s ease 2s forwards;
}

.up {
  background: rgba(0, 195, 255, 0.5);
  animation: up 0.5s ease 2.5s forwards;
}

.down {
  background: rgba(255, 0, 221, 0.5);
  animation: down 0.5s ease 3s forwards;
}

.back {
  background: rgba(255, 0, 221, 0.5);
  animation: back 0.5s ease 1s forwards;
}

/* 分解动画 */
@keyframes front {
  0% {
    transform: translateZ(0);
  }

  100% {
    transform: translateZ(75px);
  }
}

@keyframes left {
  0% {
    transform: translateX(0) rotateY(0);
  }

  100% {
    transform: translateX(-75px) rotateY(-90deg);
  }
}

@keyframes right {
  0% {
    transform: translateX(0) rotateY(0);
  }

  100% {
    transform: translateX(75px) rotateY(90deg);
  }
}

@keyframes up {
  0% {
    transform: translateY(0) rotateX(0);
  }

  100% {
    transform: translateY(-75px) rotateX(90deg);
  }
}

@keyframes down {
  0% {
    transform: translateY(0) rotateX(0);
  }

  100% {
    transform: translateY(75px) rotateX(-90deg);
  }
}

@keyframes back {
  0% {
    transform: translateZ(0);
  }

  100% {
    transform: translateZ(-75px);
  }
}
</style>
