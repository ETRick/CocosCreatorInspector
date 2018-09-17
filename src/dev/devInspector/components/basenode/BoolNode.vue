<template>
  <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
    <CheckBox :uuid="uuid" :mykey="mykey" :myvalue="myvalue" />
  </Node>
</template>

<script>
  export default {
    props: [
      'uuid',
      'mykey',
      'myvalue',
    ]
  }
</script>

<style scoped>
</style>
