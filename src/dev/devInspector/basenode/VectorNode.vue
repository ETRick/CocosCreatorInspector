<template>
  <div id="app">
    <!-- Vector包括Vec2，Vec3和Size -->
    <Node :name="mykey.firstUpperCase()">
      <SlideNode v-for="seckey in seckeys" :key="seckey" 
                v-if="typeof myvalue[seckey] != 'undefined'"
                :name="seckey.eraseSubstring(titlename).firstUpperCase()[0]" :mykey="seckey"
                class="ui" :style="{width: 100 / seckeys.length + '%'}"
                @movestep="changeFloatValueAction" :step="step">
        <input v-if="!readonly" class="myInput"
              @focus="pauseGame(uuid)"
              @blur="resumeGame(uuid)"
              @change="changeValue()"
              :placeholder="myvalue[seckey].value"
              v-model="myvalue[seckey].value">
        <span v-else> {{myvalue[seckey].value}} </span>
      </SlideNode>
    </Node>
  </div>
</template>

<script>
export default {
  mounted() {
  },
  name: "app",
  data() {
    return {
      seckeys: Object.keys(this.myvalue),
    }
  },
  methods: {
    changeValue() {
      // 构造要赋值的value
      let value = {};
      for (let key of this.seckeys) {
        value[key] = this.myvalue[key].value;
      }
      let code = "ccIns.setNodeValue("
              + "'" + this.uuid + "',"
              + "'" + this.mykey + "',"
              + JSON.stringify(value) + ")";
      this._evalCode(code);
      this._freshNode(this.uuid);
    },
    // 将两种情况写到一起
    changeFloatValueAction(step, key) {
      let value = parseFloat(this.myvalue[key].value);
      if (!isNaN(value)) {
        this.myvalue[key].value = value + step;
        this.changeValue();
      }
    },
  },
  props: [
    'uuid',
    'mykey',
    'myvalue',
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
