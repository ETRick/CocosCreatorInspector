
<template>
  <div class="component" v-if="component">
    <!-- 选择框绑定active -->
    <CheckBox v-if="typeof component.enabled != 'undefined'" class="myCheckBox"
              :uuid="component.uuid.value" mykey="enabled" :myvalue="component.enabled.value" />

    <!-- 显示节点type和uuid -->
    <h4 @click="onClickComp" :class="{inenabledInHierarchy: component.enabledInHierarchy && component.enabledInHierarchy.value === false}">
      {{comptype + " (" + component.uuid.value + ")"}}
    </h4>

    <!-- 根据type类型生成模板 -->
    <div v-show="isShowComp" v-for="mykey in compkeys" :key="mykey">
        <EnumNode v-if="isEnumType(comptype, mykey)" 
                  :enumTypes="getEnumType(comptype, mykey)" 
                  :uuid="component.uuid.value" 
                  :mykey="mykey" 
                  :myvalue="component[mykey].value">
        </EnumNode>
        <BoolNode v-else-if="component[mykey].type == 'boolean'"
                  :uuid="component.uuid.value" 
                  :mykey="mykey" 
                  :myvalue="component[mykey].value">
        </BoolNode>
        <NumberNode v-else-if="component[mykey].type == 'number'" 
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </NumberNode>
        <StringNode v-else-if="component[mykey].type == 'string'"
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </StringNode>
        <ColorNode v-else-if="component[mykey].type == 'Color'"
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </ColorNode>
        <ArrayNode v-else-if="component[mykey].type == 'Array'"
                   :uuid="component.uuid.value" 
                   :mykey="mykey" 
                   :myarray="component[mykey].value">
        </ArrayNode>
        <VectorNode v-else-if="['Size', 'Vec2', 'Vec3'].hasValue(component[mykey].type)"
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </VectorNode>
        <Node v-else-if="component[mykey].type != 'null' && component[mykey].value.name"
              :name="mykey.firstUpperCase()">
          <span>{{component[mykey].value.name.value}}</span>
        </Node>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      // 得到主键，除去uuid,name和两个enabled
      compkeys: Object.keys(this.component ? this.component : {}).filter(
        function(key) {
          return (
            key[0] != "_" &&
            ["uuid", "name", "enabled", "enabledInHierarchy"].indexOf(key) == -1
          );
        }
      ),
      isShowComp: true
    };
  },
  methods: {
    onClickComp() {
      this.isShowComp = !this.isShowComp;
    },
    // 判断是否为枚举类型
    isEnumType(comptype, key) {
      return typeof Vue.enumStorage.get(comptype, key) != "undefined";
    },
    // 由于传入参数不能使用Vue，因此改成这种方式
    getEnumType(comptype, key) {
      return Vue.enumStorage.get(comptype, key);
    }
  },
  props: ["comptype", "component"]
};
</script>

<style scoped>
span {
  color: #fd942b;
}

h4 {
  margin: 8px;
  cursor: pointer;
}

.myCheckBox {
  margin-top: 10px;
  width: 15px;
  height: 15px;
  float: left;
}

.inenabledInHierarchy {
  text-decoration: line-through;
}

.component {
  border: 2px solid #a1a1a1;
  padding: 5px 5px;
  background: #dddddd;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px; /* 老的 Firefox */
}
</style>
