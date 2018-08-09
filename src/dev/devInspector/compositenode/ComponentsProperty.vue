<template>
  <div id="app">
    <div>
      <div>
        <h2 @click="onClickAllComp">挂载组件:</h2>
        <hr style="margin-bottom: 5px;margin-top: 2px;"/>
      </div>
      <div v-show="isShowComps" v-for="comp in components" :key="comp.uuid">
        <ComponentProperty :component="comp">
        </ComponentProperty>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShowComps: true,
      }
    },
    methods: {
      onClickAllComp() {
        this.isShowComps = !this.isShowComps;
      },
    },
    props: [
      'components'
    ]
  }
</script>

<style scoped>
  h2 {
    margin-top: 10px;
    margin-bottom: 2px;
    font-weight: bold;
    cursor: pointer
  }
  span {
    color: #fd942b;
  }
</style>