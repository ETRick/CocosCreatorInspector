<template>
  <div id="app">
    <SlideNode :name="mykey.firstUpperCase()" 
               :mykey="mykey" :step="step"
               v-if="typeof myvalue != 'undefined'"
               @movestep="changeFloatValueAction">
      <input v-if='!readonly' class="myInput"
        @focus="pauseGame"
        @blur="resumeGame"
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
        let code = "window.pluginSetNodeValue(" +
          "'" + this.uuid + "'," +
          "'" + this.mykey + "',";
        // value值需要判断一下
        if (typeof this.myvalue == "number") {
          code += this.myvalue + ")";
        } else {
          code += "'" + this.myvalue + "'" + ")";
        }
        this._evalCode(code);
        this._freshNode(this.uuid);
      },
      changeFloatValueAction(step) {
        if (typeof this.myvalue == "number") {
          let value = parseFloat(this.myvalue);
          this.myvalue = value + step;
          this.changeValue();
        }
      },
      pauseGame() {
        this._evalCode("window.pluginPauseGame()");
        this._freshNode(this.uuid);
      },
      resumeGame() {
        this._evalCode("window.pluginResumeGame()");
        this._freshNode(this.uuid);
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
