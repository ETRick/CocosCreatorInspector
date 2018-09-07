<template>
  <Node :name="titlename.firstUpperCase()">
    <SlideNode v-for="mykey in mykeys" :key="mykey" v-if="typeof itemData[mykey].value != 'undefined'"
              :name="mykey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="mykey"
              class="ui" :style="{width: 100 / mykeys.length + '%'}"
              @movestep="changeFloatValueAction" :step="step">
      <InputBox :uuid="itemData.uuid.value" :mykey="mykey" :myvalue="itemData[mykey].value" :readonly="readonly" />
    </SlideNode>
  </Node>
</template>

<script>
export default {
  methods: {
    changeFloatValueAction(step, key) {
      let value = parseFloat(this.itemData[key].value);
      if (!isNaN(value)) {
        this.itemData[key].value = value + step;
        this.setNodeValue(this.itemData.uuid.value, key, this.itemData[key].value);
      }
    },
  },
  props: [
    'itemData',
    'titlename',
    'mykeys',
    'step',
    "readonly",
  ],
}
</script>

<style scoped>
  .ui {
    float : left;
    cursor : ew-resize;
  }
</style>
