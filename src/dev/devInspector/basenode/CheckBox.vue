<template>
    <Node :name="mykey.firstUpperCase()" v-if="typeof itemData[mykey] != 'undefined'">
      <input type="checkbox"
              style="width: 20px;height: 20px;"
              :checked="itemData[mykey]"
              @click="onBtnClick"
      >
    </Node>
</template>

<script>
  export default {
    name: "app",
    // mounted() {
    //   console.log(this.itemData[this.mykey]);
    // },
    data() {
      return {
      };
    },
    methods: {
        onBtnClick() {
            this.itemData[this.mykey] = !this.itemData[this.mykey]; 
            this._evalCode("window.pluginSetNodeValue('" 
                        + this.itemData.uuid + "','"
                        + this.mykey + "',"
                        + this.itemData[this.mykey] + ");");
            this._freshNode();
        },
    },
    props: [
        'itemData',
        'mykey',
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
