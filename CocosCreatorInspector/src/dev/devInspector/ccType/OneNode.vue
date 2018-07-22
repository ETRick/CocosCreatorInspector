<template>
  <div id="app">
    <div>
      <ui-prop name="key">
        <span> {{itemData[key]}}</span>
      </ui-prop>
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
        this._evalCode(
          "window.pluginSetNodeValue(" +
          "'" + this.itemData.uuid + "'," +
          "'" + key + "'," +
          "'" + this.itemData[key] + "'" +
          ")");
        this._freshNode();
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
      'key'
    ]
  }
</script>

<style scoped>
</style>
