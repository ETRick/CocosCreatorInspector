<template>
  <!-- Vector包括Vec2，Vec3和Size -->
  <Node :name="mykey.firstUpperCase()">
    <SlideNode v-for="seckey in seckeys" :key="seckey" 
              v-if="typeof myvalue[seckey] != 'undefined'"
              :name="seckey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="seckey"
              class="ui" :style="{width: 100 / seckeys.length + '%'}"
              @movestep="changeFloatValueAction" :step="step">
      <InputBox :uuid="uuid" :mykey="seckey" :myvalue="myvalue[seckey].value" :readonly="readonly" :changeFunc="changeValue" />
    </SlideNode>
  </Node>
</template>

<script>
export default {
  data() {
    return {
      seckeys: Object.keys(this.myvalue)
    };
  },
  methods: {
    // 修改时修改整个Object(Vec/Size)
    changeValue(key, value) {
      // 由于value拷贝复制进去，因此在此处修改值
      value = parseFloat(value);
      if (!isNaN(value)) {
        this.myvalue[key].value = value;
        // 构造要赋值的value
        let obj = {};
        for (let key of this.seckeys) {
          obj[key] = this.myvalue[key].value;
        }
        this.setNodeValue(this.uuid, this.mykey, obj);
      }
    },
    // 根据鼠标拖动修改值
    changeFloatValueAction(step, key) {
      let value = parseFloat(this.myvalue[key].value);
      if (!isNaN(value)) {
        this.changeValue(key, value + step);
      }
    }
  },
  props: ["uuid", "mykey", "myvalue", "step", "readonly"]
};
</script>

<style scoped>
.ui {
  float: left;
  cursor: ew-resize;
}
</style>
