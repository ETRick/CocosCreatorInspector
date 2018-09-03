<template>
  <div id="app">
    <Node :name="titlename.firstUpperCase()">
      <SlideNode v-for="mykey in mykeys" :key="mykey" v-if="typeof itemData[mykey].value != 'undefined'"
                :name="mykey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="mykey"
                class="ui" :style="{width: 100 / mykeys.length + '%'}"
                @movestep="changeFloatValueAction" :step="step">
        <input v-if="!readonly" class="myInput"
                @focus="pauseGame"
                @blur="resumeGame"
                @change="changeValue(mykey)"
                :placeholder="itemData[mykey].value"
                v-model="itemData[mykey].value">
        <span v-else> {{itemData[mykey].value}} </span>
      </SlideNode>
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
      // 添加uuid，key值
      let uuid = this.itemData.uuid.value;
      let value = this.itemData[key].value;
      let code = "ccIns.setNodeValue(" +
        "'" + uuid + "'," +
        "'" + key + "'," +
        value + ")";
      this._evalCode(code);
      this._freshNode(uuid);
    },
    changeFloatValueAction(step, key) {
      let value = parseFloat(this.itemData[key].value);
      if (!isNaN(value)) {
        this.itemData[key].value = value + step;
        this.changeValue(key);
      }
    },
    pauseGame() {
      let uuid = this.itemData.uuid.value;
      this._evalCode("ccIns.pauseGame()");
      this._freshNode(uuid);
    },
    resumeGame() {
      let uuid = this.itemData.uuid.value;
      this._evalCode("ccIns.resumeGame()");
      this._freshNode(uuid);
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
