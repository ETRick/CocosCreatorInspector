<template>
  <div id="app">
    <div>
        <Node :name="index" v-for="key in comp" :key="key">
          <span>{{key}}</span>
        </Node>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        comp: component.getPublicKey(),
      }
    },
    methods: {
    },
    props: [
      'component'
    ]
  }
</script>

<style scoped>
</style>
