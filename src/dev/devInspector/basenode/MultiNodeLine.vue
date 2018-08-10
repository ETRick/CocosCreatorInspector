<template>
  <div id="app">
    <Node :name="titlename.firstUpperCase()">
      <div style="float: left;width: 100%;">
        <SlideNode v-for="mykey in mykeys" :key="mykey" v-if="typeof itemData[mykey] != 'undefined'"
                  :name="mykey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="mykey"
                  class="ui" :style="{width: 100 / mykeys.length + '%'}"
                  @movestep="changeFloatValueAction" :step="step">
          <input v-if="!readonly" class="myInput"
                  @focus="pauseGame"
                  @blur="resumeGame"
                  @change="changeValue(mykey)"
                  :placeholder="itemData[mykey]"
                  v-model="itemData[mykey]">
          <span v-else> {{itemData[mykey]}} </span>
        </SlideNode>
      </div>
    </Node>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {}
  },
  methods: {
    changeValue(key) {
      console.log("changeValue", key);
      // 添加uuid，key值
      let code = "ccIns.setNodeValue(" +
        "'" + this.itemData.uuid + "'," +
        "'" + key + "',";
      // value值需要判断一下
      if (typeof this.itemData[key] == "number") {
        code += this.itemData[key] + ")";
      } else {
        code += "'" + this.itemData[key] + "'" + ")";
      }
      this._evalCode(code);
      this._freshNode(this.itemData.uuid);
    },
    changeFloatValueAction(step, key) {
      // console.log("changeFloatValueAction", key);
      if (typeof this.itemData[key] == "number") {
        let value = parseFloat(this.itemData[key]);
        this.itemData[key] = value + step;
        this.changeValue(key);
      }
    },
    pauseGame() {
      this._evalCode("ccIns.pauseGame()");
      this._freshNode(this.itemData.uuid);
    },
    resumeGame() {
      this._evalCode("ccIns.resumeGame()");
      this._freshNode(this.itemData.uuid);
    },
  },
  props: [
    'itemData',
    "titlename",
    'mykeys',
    'step',
    "readonly",
  ],
}
</script>

<style scoped>
  span {
    color: #fd942b;
  }

  .ui {
    float : left;
    cursor : ew-resize;
  }

  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
