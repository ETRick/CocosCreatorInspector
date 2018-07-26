<template>
  <div id="app">
    <SlideNode :name="mykey.firstUpperCase()" :mykey="mykey" v-if="typeof itemData[mykey] != 'undefined'">
      <input v-if='!readonly' class="myInput"
        @change="changeValue"
        :placeholder="itemData[mykey]"
        v-model="itemData[mykey]">
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
      // 修改任意key-value属性值
      changeValue() {
        console.log(this.mykey, this.itemData[this.mykey]);
        this._evalCode(
          "window.pluginSetNodeValue(" +
          "'" + this.itemData.uuid + "'," +
          "'" + this.mykey + "'," +
          "'" + this.itemData[this.mykey] + "'" +
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
      'mykey',
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
