<template>
  <div id="app">
    <div>
      <div>
        <h4 @click="onClickComp" style="margin-top: 5px;margin-bottom: 1px;font-weight: bold;cursor: pointer">挂载组件:</h4>
        <hr style="margin-bottom: 2px;margin-top: 2px;"/>
      </div>
      <div v-show="isShowComp">
        <Node :name="index" v-for="(comp,index) in components" :key="index">
          <span>{{comp.type}}</span>
          <Node v-for="(property, key) in comp" 
                :key="key" 
                v-if="typeof comp[property] != 'function' && key[0] != '_'"
                :name="key">
          </Node>
        </Node>

      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        isShowComp: true,
      }
    },
    methods: {
      onClickComp() {
        console.log("mouted:", this.components);
        this.isShowComp = !this.isShowComp;
      }
    },
    props: [
      'components'
    ]
  }
</script>

<style scoped>
  span {
    color: #fd942b;
  }
</style>
