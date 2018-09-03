<template>
  <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
    <input type="checkbox"
           style="width: 20px;height: 20px;"
           :checked="myvalue"
           @click="onBtnClick">
  </Node>
</template>

<script>
  export default {
    name: "app",
    methods: {
      onBtnClick() {
        this.myvalue = !this.myvalue; 
        this.setNodeValue(this.uuid, this.mykey, this.myvalue);
      },
    },
    props: [
      'uuid',
      'myvalue',
      'mykey',
      'clickFunc',
    ]
  }
</script>

<style scoped>
  .font {
    font-family: BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, 'SourceHanSansCN-Normal', Arial, sans-serif
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
   not supported by any browser */
  }
</style>
