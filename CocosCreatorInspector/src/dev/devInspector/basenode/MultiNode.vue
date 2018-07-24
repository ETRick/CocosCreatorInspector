<template>
  <div id="app">
    <Node :name="titlename.firstUpperCase()">
      <div style="float: left;width: 100%;">
        <SlideNode v-for="mykey in mykeys" :key="mykey" v-if="typeof itemData[mykey] != 'undefined'"
                  :name="mykey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="mykey"
                  class="ui" :style="{width: 100 / mykeys.length + '%'}"
                  @movestep="changeFloatValueAction" :step="step">
          <input v-if="!readonly" class="myInput"
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
  keysFunc() {
    return this.mykeys;
  },
  methods: {
    changeValue(key) {
      // console.log("changeValue", key);
      this._evalCode(
        "window.pluginSetNodeValue(" +
        "'" + this.itemData.uuid + "'," +
        "'" + key + "'," +
        "'" + this.itemData[key] + "'" +
        ")");
      this._freshNode();
    },
    changeFloatValueAction(step, key) {
      // console.log("changeFloatValueAction", key);
      let value = parseFloat(this.itemData[key]);
      this.itemData[key] = value + step;
      this.changeValue(key);
    },
    _freshNode() {
      let uuid = this.itemData.uuid;
      let code2 = "window.getNodeInfo('" + uuid + "')";
      this._evalCode(code2);
    },
    _evalCode(code) {
      if (chrome && chrome.devtools) {
        chrome.devtools.inspectedWindow.eval(code);
      } else {
        console.log(code);
      }
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
