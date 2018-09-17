<template>
  <SlideNode v-if="typeof myvalue != 'undefined'"
              :name="mykey.firstUpperCase()" 
              :mykey="mykey" :step="step"
              @movestep="changeFloatValueAction">
    <InputBox :uuid="uuid" :mykey="mykey" :myvalue="myvalue" :readonly="readonly" />
  </SlideNode>
</template>

<script>
export default {
  methods: {
    // 根据鼠标拖动修改值
    changeFloatValueAction(step) {
      let value = parseFloat(this.myvalue);
      if (!isNaN(value)) {
        this.myvalue = value + step;
        this.setNodeValue(this.uuid, this.mykey, this.myvalue);
      }
    }
  },
  props: ["uuid", "mykey", "myvalue", "step", "readonly"]
};
</script>
