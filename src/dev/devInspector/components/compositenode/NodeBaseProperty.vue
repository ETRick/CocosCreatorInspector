<template>
  <div v-if="itemData.uuid">
    <!-- 选择框绑定active -->
    <CheckBox v-if="typeof itemData.active != 'undefined'" class="myCheckBox"
              :uuid="itemData.uuid.value" mykey="active" :myvalue="itemData.active.value" />
    
    <!-- 显示节点name和uuid -->
    <h1 @click="onClickNode" :class="{inactiveInHierarchy: itemData.activeInHierarchy && itemData.activeInHierarchy.value === false}">
      {{itemData.name.value + " (" + itemData.uuid.value + ")"}}
    </h1>
    <hr />

    <!-- 根据配置文件中属性显示属性值 -->
    <div v-show="isShowNode" v-for="config in configs" :key="config"
         v-if="config.key && itemData[config.key]">
      <BoolNode v-if="itemData[config.key].type === 'boolean'"
                :uuid="itemData.uuid.value"
                :mykey="config.key"
                :myvalue="itemData[config.key].value">
      </BoolNode>
      <NumberNode v-else-if="itemData[config.key].type == 'number'"
                  :uuid="itemData.uuid.value"
                  :mykey="config.key"
                  :myvalue="itemData[config.key].value"
                  :readonly="config.readonly"
                  :step="config.step">
      </NumberNode>
      <StringNode v-else-if="itemData[config.key].type == 'string'"
                  :uuid="itemData.uuid.value"
                  :mykey="config.key"
                  :myvalue="itemData[config.key].value"
                  :readonly="config.readonly">
      </StringNode>
      <VectorNode v-else-if='["Vec2", "Vec3", "Size"].hasValue(itemData[config.key].type)'
                  :uuid="itemData.uuid.value"
                  :mykey="config.key"
                  :myvalue="itemData[config.key].value"
                  :readonly="config.readonly">
      </VectorNode>
      <ColorNode v-else-if="itemData[config.key].type == 'Color'" 
                    :uuid="itemData.uuid.value"
                    :mykey="config.key"
                    :myvalue="itemData[config.key].value">
      </ColorNode>
    </div>
    <MultiNumberNode v-else-if="config.keys"
                    :itemData="itemData"
                    :titlename="config.title"
                    :mykeys="config.keys"
                    :readonly="config.readonly"
                    :step="config.step">
    </MultiNumberNode> 
  </div>
</template>

<script>
import configjs from "../../../../config/nodebase.json";

export default {
  data() {
    return {
      configs: configjs,
      isShowNode: true
    };
  },
  methods: {
    onClickNode() {
      this.isShowNode = !this.isShowNode;
    }
  },
  props: ["itemData"]
};
</script>

<style scoped>
h1 {
  margin-top: 20px;
  margin-bottom: 4px;
  margin-left: 20px;
  font-weight: bold;
  cursor: pointer;
}

hr {
  margin-bottom: 10px;
  margin-top: 4px;
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
