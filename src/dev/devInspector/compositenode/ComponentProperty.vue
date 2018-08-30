
<template>
  <div id="app">
    <div class="comp">
      <input v-if="typeof component.enabled != 'undefined'" type="checkbox" class="myCheckBox"
              :checked="component.enabled"
              @click="onCheckBoxClick">
      <h4 @click="onClickComp" :class="{inenabledInHierarchy: component.enabledInHierarchy === false}">
        {{(component.comtype == "" ? "Undefined Type": component.comtype) + " (" + component.uuid + ")"}}
      </h4>
      <div v-show="isShowComp" v-for="mykey in compkeys" :key="mykey">
          <CheckBox v-if="typeof component[mykey] == 'boolean'" :uuid="component.uuid" :mykey="mykey" :myvalue="component[mykey]">
          </CheckBox>
          <EnumNode v-else-if="isEnumType(component.comtype.substr(3), mykey)" 
                    :enumTypes="getEnumType(component.comtype.substr(3), mykey)" 
                    :uuid="component.uuid" 
                    :mykey="mykey" 
                    :myvalue="component[mykey]">
          </EnumNode>
          <SingleNodeLine v-else-if="typeof component[mykey] != 'object'" :uuid="component.uuid" :mykey="mykey" :myvalue="component[mykey]">
          </SingleNodeLine>
          <Node v-else-if="component[mykey] && component[mykey].name" :name="mykey.firstUpperCase()">
            <span> {{component[mykey].name}} </span>
          </Node>
      </div>
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
      compkeys: Object.keys(this.component).filter(function(key) {
        return key[0] != "_" && key != "comtype" && key != "uuid"
          && key != "enabled" && key != "enabledInHierarchy";
      }),
      isShowComp: true,
    }
  },
  methods: {
    onCheckBoxClick() {
      this.component.enabled = !this.component.enabled;
      this._evalCode("ccIns.setNodeValue('" 
                  + this.component.uuid 
                  + "','enabled',"
                  + this.component.enabled + ");");
      this._freshNode(this.component.uuid);
    },
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
    },
  },
  props: [
    'component'
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
  .comp {
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
