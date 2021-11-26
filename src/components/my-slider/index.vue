<template>
  <div class="my-slider-wrapper">
    <span v-if="!!label" :style="labelStyles" class="my-slider-label"
      >{{ label }}:
    </span>
    <input
      class="my-slider-input"
      type="range"
      :min="min"
      :max="max"
      @mousewheel="changeValue($event)"
      v-model="innerValue"
    />
    <span
      v-if="!isInputMode"
      class="my-slider-label"
      :style="suffixStyles"
      @mouseenter="changeMode"
      >{{ innerValue }}</span
    >
    <span v-if="isInputMode" class="my-slider-label" :style="suffixStyles">
      <input
        class="my-slider-input__num"
        @mouseleave="changeMode"
        @mousewheel="changeValue($event)"
        :step="step"
        type="number"
        v-model="innerValue"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: "my-slider",
  props: {
    value: {
      type: String | Number,
      default: 0,
    },
    min: {
      type: String | Number,
      default: 0,
    },
    max: {
      type: String | Number,
      default: 100,
    },
    label: {
      type: String,
      default: "",
    },
    step: {
      type: String | Number,
      default: 1,
    },
    labelStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    suffixStyle: {
      type: Object,
      default() {
        return {
          width: "80px",
        };
      },
    },
    color: {
      type: String,
      default: "#1e80ff",
    },
  },
  computed: {
    labelStyles() {
      return {
        ...this.labelStyle,
        color: this.color,
      };
    },
    suffixStyles() {
      return {
        ...this.labelStyle,
        ...this.suffixStyle,
        color: this.color,
      };
    },
  },
  data() {
    return {
      innerValue: this.value,
      isInputMode: false,
    };
  },
  created() {},
  mounted() {},

  methods: {
    changeMode() {
      this.isInputMode = !this.isInputMode;
    },
    getAvailableVal(val, min = 0, max = 100) {
      if (val === undefined || val === null || val === "") val = 0;
      return Math.max(min, Math.min(val, max));
    },
    changeValue($event) {
      $event.preventDefault();
      $event.stopPropagation();
      const deltaY = $event.deltaY;
      if (deltaY > 0) {
        this.innerValue -= 1;
      } else {
        this.innerValue += 1;
      }
    },
  },

  watch: {
    value(val) {
      if (this.innerValue !== val) {
        this.innerValue = val;
      }
    },
    innerValue: {
      immediate: true,
      handler(val) {
        val = this.getAvailableVal(val, this.min, this.max);
        this.innerValue = val;
        this.$emit("input", val || 0);
        this.$emit("slide", val || 0);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.my-slider-wrapper {
  display: inline-block;
  .my-slider-label {
    display: inline-block;
    padding: 0px 12px;
    height: 36px;
    line-height: 36px;
    vertical-align: 3px;
  }
  .my-slider-input__num {
    width: 42px;
    border: 1px solid #1e80ff;
    border-radius: 5px;
    line-height: 24px;
    color: #1e80ff;
    outline: none;
    padding-left: 6px;
  }
  /* 这里不考虑浏览器的兼容性 */
  .my-slider-input {
    -webkit-appearance: none;
    height: 8px;
    border-radius: 4px;
    background-image: linear-gradient(
      to right,
      #038aff,
      #19b5fe,
      #6bb9f0,
      #89c4f4
    ); // #22a7f0, #19b5fe,
  }
  /* -webkit-slider-thumb仅对谷歌浏览器有效 */
  .my-slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #4871f7;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    cursor: pointer;
  }
  .my-slider-input::-webkit-slider-thumb:hover {
    background: #4d05e8;
  }
}
</style>
