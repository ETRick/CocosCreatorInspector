<template>
  <div id="app">
    <SlideNode v-if="typeof myvalue != 'undefined'"
               :name="mykey.firstUpperCase()" 
               :mykey="mykey" :step="step"
               @movestep="changeFloatValueAction">
      <input v-if='!readonly' class="myInput"
        @focus="pauseGame(uuid)"
        @blur="resumeGame(uuid)"
        @change="changeValue"
        :placeholder="myvalue"
        v-model="myvalue">
      <span v-else>{{myvalue}}</span>
    </SlideNode>
  </div>
</template>

<script>
  export default {
    name: "app",
    data() {
      return {}
    },
    methods: {
      // 修改任意key-value属性值
      changeValue() {
        // 添加uuid，key值
        let code = "ccIns.setNodeValue(" +
          "'" + this.uuid + "'," +
          "'" + this.mykey + "'," +
          this.myvalue + ")";
        this._evalCode(code);
        this._freshNode(this.uuid);
      },
      changeFloatValueAction(step) {
        let value = parseFloat(this.myvalue);
        if (!isNaN(value)) {
          this.myvalue = value + step;
          this.changeValue();
        }
      },
    },
    props: 
    [
      'uuid',
      'mykey',
      'myvalue',
      'step',
      'readonly'
    ]
  }
</script>

<style scoped>
  span {
    color: #fd942b;
  }
  
  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
