<template>
  <div id="app" v-if="components">
    <h2 @click="onClickAllComp">挂载组件:</h2>
    <hr style="margin-bottom: 5px;margin-top: 2px;"/>
 
    <div v-show="isShowComps" v-for="comp in components.value" :key="comp.value.uuid.value">
      <ComponentProperty :comptype="comp.type" :component="comp.value">
      </ComponentProperty>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
    },
    name: "app",
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