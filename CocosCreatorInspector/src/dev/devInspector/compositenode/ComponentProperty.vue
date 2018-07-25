<template>
  <div id="app">
    <div >
        <SingleNode v-for="mykey in comp" :key="mykey" :itemData="component" :mykey="mykey">
        </SingleNode>
    </div>
  </div>
</template>

<script>

  export default {
    mounted() {
      console.log(this.comp);
    },
    data() {
      return {
        // 得到主键
        comp: Object.keys(this.component).filter(function (key) {
          return key[0] != "_" && key != "comptype";
        }),
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
