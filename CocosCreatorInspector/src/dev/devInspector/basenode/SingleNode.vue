<template>
  <div id="app">
    <SlideNode :name="mykey.firstUpperCase()" 
               :mykey="mykey" :step="step"
               v-if="typeof itemData[mykey] != 'undefined'"
               @movestep="changeFloatValueAction">
      <input v-if='!readonly' class="myInput"
        @focus="pauseGame"
        @blur="resumeGame"
        @change="changeValue"
        :placeholder="itemData[mykey]"
        v-model.lazy="itemData[mykey]">
      <span v-else> {{itemData[mykey]}}</span>
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
      changeFloatValueAction(step, key) {
        // console.log("changeFloatValueAction", key);
        if (typeof this.itemData[this.mykey] == "number") {
          let value = parseFloat(this.itemData[key]);
          this.itemData[key] = value + step;
          this.changeValue(key);
        }
      },
      // 修改任意key-value属性值
      changeValue() {
        // 添加uuid，key值
        let code = "window.pluginSetNodeValue(" +
          "'" + this.itemData.uuid + "'," +
          "'" + this.mykey + "',";
        // value值需要判断一下
        if (typeof this.itemData[this.mykey] == "number") {
          code += this.itemData[this.mykey] + ")";
        } else {
          code += "'" + this.itemData[this.mykey] + "'" + ")";
        }
        this._evalCode(code);
        this._freshNode();
      },
      pauseGame() {
        this._evalCode("window.pluginPauseGame()");
        this._freshNode();
      },
      resumeGame() {
        this._evalCode("window.pluginResumeGame()");
        this._freshNode();
      },
    },
    props: [
      'itemData',
      'mykey',
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
