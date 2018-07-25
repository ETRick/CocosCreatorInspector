<template>
  <div id="app">
    <!-- uuid -->
    <SingleNode :itemData="itemData" mykey="uuid" readonly="true"></SingleNode>
    
    <!-- 配置文件中属性 -->
    <div v-for="config in configs" :key="config">
      <SingleNode v-if="config.type === 'single'" 
                 :itemData="itemData"
                 :mykey="config.key"
                 :readonly="config.readonly">
      </SingleNode>
      <CheckBox v-else-if="config.type === 'singlebool'"
                :itemData="itemData"
                :mykey="config.key">
      </CheckBox>
      <MultiNode v-else-if="config.type === 'multi'"
                :itemData="itemData"
                :titlename="config.title"
                :mykeys="config.keys"
                :readonly="config.readonly"
                :step="config.step || 10">
      </MultiNode>
    </div>

    <!-- 颜色 -->
    <Node name="color" v-if="typeof itemData['color'] != 'undefined'">
      <div style="float: left;width: 100%;height: 100%;">
        <div style="float: left;width: 50%; height: 100%;">
          <el-color-picker v-model="itemData.color" size="mini"
                          style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;"
                          @change="changeColor"></el-color-picker>
        </div>
        <div style="float: left;width: 50%;">
          <span>{{itemData.color}}</span>
        </div>
      </div>
    </Node>

  </div>
</template>

<script>
  import configjs from '../config/nodebase.json'

  export default {
    name: "app",
    data() {
      return {
        configs: configjs,
      }
    },
    methods: {
      changeColor() {
        let color = this.itemData.color;
        console.log("color:" + color);
        this._evalCode(
          "window.pluginSetNodeColor('" +
          this.itemData.uuid + "','" +
          color + "');");
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
      'itemData'
    ]
  }
</script>

<style scoped>
  span {
    color: #fd942b;
  }

  .btnSize {
    padding: 5px 10px;
  }

  .comp {
    border: 2px solid #a1a1a1;
    padding: 5px 5px;
    background: #dddddd;
    width: 100%;
    border-radius: 5px;
    -moz-border-radius: 5px; /* 老的 Firefox */
  }

  .float-left {
    float: left;
  }

  .compBorder {
    border: 1px solid #b3b3b3;
    background: #ffffff
  }

  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
