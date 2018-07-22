<template>
  <div id="app">
    <div>
        <div vi-for="key in keys" style="float: left;width: 100%;">
            <ui-prop :name="key" :width="100 / len(keys) + '%'" style="float: left; cursor: ew-resize;"
                    @movestep="changeFloatValueAction(key)"
                    step="10">
            <input class="myInput"
                    @change="changeValue"
                    placeholder="itemData[key]"
                    v-model="itemData[key]">
            </ui-prop>
        </div>
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
        this._evalCode(
          "window.pluginSetNodeValue(" +
          "'" + this.itemData.uuid + "'," +
          "'" + key + "'," +
          "'" + this.itemData[key] + "'" +
          ")");
        this._freshNode();
      },
      changeFloatValueAction(key, step) {
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
      'keys'
    ]
  }
</script>

<style scoped>
  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
