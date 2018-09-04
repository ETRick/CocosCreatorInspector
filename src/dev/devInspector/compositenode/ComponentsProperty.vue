<template>
  <div v-if="components">
    <h2 @click="onClickAllComp">挂载组件:</h2>
    <hr />
 
    <!-- 依次展示脚本 -->
    <div v-show="isShowComps" v-for="comp in components.value" :key="comp.value.uuid.value">
      <ComponentProperty :comptype="comp.type" :component="comp.value" />
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

  hr {
    margin-bottom: 5px;
    margin-top: 2px;
  }
</style>