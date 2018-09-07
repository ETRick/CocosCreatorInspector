<template>
  <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
    <SelectBox :allTypes="enumTypes" :uuid="uuid" :mykey="mykey" :myvalue="myvalue" />
  </Node>
</template>

<script>
  export default {
    props: [
      'enumTypes',
      'uuid',
      'mykey',
      'myvalue',
    ]
  }
</script>

<style scoped>
</style>
