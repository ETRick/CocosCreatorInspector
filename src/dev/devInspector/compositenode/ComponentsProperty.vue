<template>
  <div id="app">
    <div>
      <div>
        <h2 @click="onClickAllComp" style="">挂载组件:</h2>
        <hr style="margin-bottom: 5px;margin-top: 2px;"/>
      </div>
      <div v-show="isShowAllComp" v-for="(comp,index) in components" :key="comp.uuid">
        <div style="margin-top: 5px; margin-bottom: 5px">
          <i :class="hiddenShowComps[index] ? 'el-icon-caret-right' : 'el-icon-caret-bottom'" class="icon" size="mini"></i>
          <h4 @click="onClickComp(index)">
            {{comp.comptype == "" ? "Undefined Type": comp.comptype}}
          </h4>
          <ComponentProperty v-show="!hiddenShowComps[index]" :component="comp">
          </ComponentProperty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        isShowAllComp: true,
        hiddenShowComps: [],
      }
    },
    methods: {
      onClickAllComp() {
        this.isShowAllComp = !this.isShowAllComp;
      },
      onClickComp(index) {
        if (!this.hiddenShowComps[index]) {
          this.hiddenShowComps[index] = true;
        } else {
          this.hiddenShowComps[index] = false;
        }
      }
    },
    props: [
      'components'
    ]
  }
</script>

<style scoped>
  .icon {
    margin-top: 5px;
    margin-bottom: 1px;
    float: left;
  }
  h2 {
    margin-top: 10px;
    margin-bottom: 2px;
    font-weight: bold;
    cursor: pointer
  }
  h4 {
    margin-top: 5px;
    margin-bottom: 1px;
    cursor: pointer; 
  }
  span {
    color: #fd942b;
  }
</style>
