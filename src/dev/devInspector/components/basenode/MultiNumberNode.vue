<template>
  <Node v-if="keys.length > 0" :name="titlename.firstUpperCase()">
    <SlideNode v-for="mykey in keys" :key="mykey"
              :name="mykey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="mykey"
              class="ui" :style="{width: 100 / keys.length + '%'}"
              @movestep="changeFloatValueAction" :step="step">
      <InputBox :uuid="itemData.uuid.value" :mykey="mykey" :myvalue="itemData[mykey].value" :readonly="readonly" />
    </SlideNode>
  </Node>
</template>

<script>
export default {
  data() {
    return {
      // keys过滤掉mykeys中不存在的属性
      keys: []
    };
  },
  watch: {
    itemData(newVal, oldVal) {
      if (newVal != oldVal) {
        this.keys = this.mykeys.filter(
          key => typeof newVal[key] != "undefined"
        );
        this.itemData = newVal;
      }
    }
  },
  methods: {
    changeFloatValueAction(step, key) {
      let value = parseFloat(this.itemData[key].value);
      if (!isNaN(value)) {
        this.itemData[key].value = value + step;
        this.setNodeValue(
          this.itemData.uuid.value,
          key,
          this.itemData[key].value
        );
      }
    }
  },
  props: ["itemData", "titlename", "mykeys", "step", "readonly"]
};
</script>

<style scoped>
.ui {
  float: left;
  cursor: ew-resize;
}
</style>
