<template>
  <div id="app">
    <Node name="Uuid">
      <span> {{component.uuid}} </span>
    </Node>
    <div v-for="mykey in comp" :key="mykey">
        <CheckBox v-if="typeof component[mykey] == 'boolean'" :itemData="component" :mykey="mykey">
        </CheckBox>
        <SingleNode v-else-if="typeof component[mykey] != 'object'" :itemData="component" :mykey="mykey">
        </SingleNode>
        <Node v-else-if="component[mykey] && component[mykey].name" :name="mykey.firstUpperCase()">
          <span> {{component[mykey].name}} </span>
        </Node>
    </div>
  </div>
</template>

<script>

  export default {
    // mounted() {
    //   console.log(this.component);
    // },
    data() {
      return {
        // 得到主键，除去comptype和uuid
        comp: Object.keys(this.component).filter(function(key) {
          return key[0] != "_";
        }).slice(2)
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
  /* span {
    color: #fd942b;
  } */
  span {
    color: #ff0015;
  }
</style>
