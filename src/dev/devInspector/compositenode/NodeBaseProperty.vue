<template>
  <div id="app">
    <input v-if="typeof itemData.active != 'undefined'" type="checkbox" class="myCheckBox"
            :checked="itemData.active"
            @click="onCheckBoxClick">
    <h1 @click="onClickNode" :class="{inactiveInHierarchy: itemData.activeInHierarchy === false}">
      {{itemData.name + " (" + itemData.uuid + ")"}}
    </h1>
    <hr style="margin-bottom: 10px; margin-top: 4px;"/>

    <div v-if="isShowNode">    
      <!-- 配置文件中属性 -->
      <div v-for="config in configs" :key="config">
        <SingleNodeLine v-if="config.type === 'single'" 
                  :uuid="itemData.uuid"
                  :mykey="config.key"
                  :myvalue="itemData[config.key]"
                  :readonly="config.readonly"
                  :step="config.step || 10">
        </SingleNodeLine>
        <CheckBox v-else-if="config.type === 'bool'"
                  :uuid="itemData.uuid"
                  :mykey="config.key"
                  :myvalue="itemData[config.key]">
        </CheckBox>
        <MultiNodeLine v-else-if="config.type === 'multi'"
                  :itemData="itemData"
                  :titlename="config.title"
                  :mykeys="config.keys"
                  :readonly="config.readonly"
                  :step="config.step || 10">
        </MultiNodeLine>
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
  </div>
</template>

<script>
  
  import configjs from '../../../config/nodebase.json'

  export default {
    name: "app",
    data() {
      return {
        configs: configjs,
        isShowNode: true,
      }
    },
    methods: {
      onCheckBoxClick() {
        this.itemData.active = !this.itemData.active;
        this._evalCode("window.pluginSetNodeValue('" 
                    + this.itemData.uuid 
                    + "','active',"
                    + this.itemData.active + ");");
        this._freshNode(this.itemData.uuid);
      },
      onClickNode() {
        this.isShowNode = !this.isShowNode;
      },
      changeColor() {
        let color = this.itemData.color;
        this._evalCode(
          "window.pluginSetNodeColor('" +
          this.itemData.uuid + "','" +
          color + "');");
        this._freshNode(this.itemData.uuid);
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
  h1 {
    margin-top: 20px;
    margin-bottom: 4px;
    margin-left: 20px;
    font-weight: bold;
    cursor: pointer
  }
  .inactiveInHierarchy {
    text-decoration: line-through;
  }
  .myCheckBox {
    width: 20px;
    height: 20px;
    margin-top: 8px; 
    float: left;
  }
</style>
