<template>
  <div id="app">
    <div class="comp">
      <input type="checkbox" class="myCheckBox"
              :checked="component.enabled"
              @click="onCheckBoxClick">
      <h4 @click="onClickComp" :class="{inenabledInHierarchy: !component.enabledInHierarchy}">
        {{(component.type == "" ? "Undefined Type": component.type) + " (" + component.uuid + ")"}}
      </h4>
      <div v-show="isShowComp" v-for="mykey in comp" :key="mykey">
          <CheckBox v-if="typeof component[mykey] == 'boolean'" :uuid="component.uuid" :mykey="mykey" :myvalue="component[mykey]">
          </CheckBox>
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
  export default {
    mounted() {
    },
    data() {
      return {
        // 得到主键，除去comptype和uuid
        comp: Object.keys(this.component).filter(function(key) {
          return key[0] != "_";
        }).slice(4),
        isShowComp: true,
      }
    },
    methods: {
      onCheckBoxClick() {
        this.component.enabled = !this.component.enabled;
        this._evalCode("window.pluginSetNodeValue('" 
                    + this.component.uuid 
                    + "','enabled',"
                    + this.component.enabled + ");");
        this._freshNode(this.component.uuid);
      },
      onClickComp() {
        this.isShowComp = !this.isShowComp;
      }
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
    margin-top: 8px;
    margin-bottom: 8px;
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
