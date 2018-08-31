<template>
  <div id="app" v-if="itemData.uuid">
    <input v-if="typeof itemData.active != 'undefined'" type="checkbox" class="myCheckBox"
            :checked="itemData.active.value"
            @click="onCheckBoxClick">
    <h1 @click="onClickNode" :class="{inactiveInHierarchy: itemData.activeInHierarchy && itemData.activeInHierarchy.value === false}">
      {{itemData.name.value + " (" + itemData.uuid.value + ")"}}
    </h1>
    <hr style="margin-bottom: 10px; margin-top: 4px;"/>

    <!-- 配置文件中属性 -->
    <div v-show="isShowNode" v-for="config in configs" :key="config">
      <div v-if="config.key && itemData[config.key]">
        <CheckBox v-if="itemData[config.key].type === 'boolean'"
                  :uuid="itemData.uuid.value"
                  :mykey="config.key"
                  :myvalue="itemData[config.key].value">
        </CheckBox>
        <NumberNode v-else-if="itemData[config.key].type == 'number'"
                    :uuid="itemData.uuid.value"
                    :mykey="config.key"
                    :myvalue="itemData[config.key].value"
                    :readonly="config.readonly"
                    :step="config.step || 10">
        </NumberNode>
        <StringNode v-else-if="itemData[config.key].type == 'string'"
                    :uuid="itemData.uuid.value"
                    :mykey="config.key"
                    :myvalue="itemData[config.key].value"
                    :readonly="config.readonly">
        </StringNode>
        <ColorPicker v-else-if="itemData[config.key].type == 'Color'" 
                     :uuid="itemData.uuid.value"
                     :mykey="config.key"
                     :myvalue="itemData[config.key].value">
        </ColorPicker>
      </div>
      <MultiNumberNode v-else-if="config.keys"
                      :itemData="itemData"
                      :titlename="config.title"
                      :mykeys="config.keys"
                      :readonly="config.readonly"
                      :step="config.step || 10">
      </MultiNumberNode> 
    </div>
  </div>
</template>

<script>
  
  import configjs from '../../../config/nodebase.json';

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
        this.itemData.active.value = !this.itemData.active.value;
        this._evalCode("ccIns.setNodeValue('" 
                    + this.itemData.uuid.value 
                    + "','active',"
                    + this.itemData.active.value + ");");
        this._freshNode(this.itemData.uuid.value);
      },
      onClickNode() {
        this.isShowNode = !this.isShowNode;
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
