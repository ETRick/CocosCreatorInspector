
<template>
  <div id="app" class="component" v-if="component">
    <input v-if="typeof component.enabled != 'undefined'" type="checkbox" class="myCheckBox"
            :checked="component.enabled.value"
            @click="onCheckBoxClick">
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
        <CheckBox v-else-if="component[mykey].type == 'boolean'"
                  :uuid="component.uuid.value" 
                  :mykey="mykey" 
                  :myvalue="component[mykey].value">
        </CheckBox>
        <NumberNode v-else-if="component[mykey].type == 'number'" 
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value"
                    :step="10">
        </NumberNode>
        <StringNode v-else-if="component[mykey].type == 'string'"
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </StringNode>
        <ColorPicker v-else-if="component[mykey].type == 'Color'"
                    :uuid="component.uuid.value" 
                    :mykey="mykey" 
                    :myvalue="component[mykey].value">
        </ColorPicker>
        <ArrayNode v-else-if="component[mykey].type == 'Array'"
                   :uuid="component.uuid.value" 
                   :mykey="mykey" 
                   :myarray="component[mykey].value">
        </ArrayNode>
        <Node v-else-if="component[mykey].type != 'null' && component[mykey].value.name"
              :name="mykey.firstUpperCase()">
          <span>{{component[mykey].value.name.value}}</span>
        </Node>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  mounted() {
  },
  data() {
    return {
      // 得到主键，除去comptype和uuid
      compkeys: Object.keys(this.component ? this.component : {}).filter(function(key) {
        return key[0] != "_" && key != "uuid" && key != "enabled" && key != "enabledInHierarchy";
      }),
      isShowComp: true,
    }
  },
  methods: {
    onCheckBoxClick() {
      this.component.enabled.value = !this.component.enabled.value;

      let uuid = this.component.uuid.value;
      let enabled = this.component.enabled.value;
      this._evalCode("ccIns.setNodeValue(" 
                  + "'" + uuid + "'"
                  + ",'enabled',"
                  + enabled + ");");
      this._freshNode(uuid);
    },
    onClickComp() {
      this.isShowComp = !this.isShowComp;
      console.log(this.isShowComp);
    },    
    // 判断是否为枚举类型
    isEnumType(comptype, key) {
      return typeof Vue.enumStorage.get(comptype, key) != "undefined";
    },
    // 由于传入参数不能使用Vue，因此改成这种方式 
    getEnumType(comptype, key) {
      return Vue.enumStorage.get(comptype, key);
    },
  },
  props: [
    'comptype',
    'component',
  ]
}
</script>

<style scoped>
  span {
    color: #ff0015;
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
