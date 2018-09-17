<template>
  <input type="checkbox"
         class="checkBox"
         :checked="myvalue"
         @click="onBtnClick">
</template>

<script>
  export default {
    methods: {
      onBtnClick() {
        this.myvalue = !this.myvalue; 
        this.setNodeValue(this.uuid, this.mykey, this.myvalue);
      },
    },
    props: [
      'uuid',
      'mykey',
      'myvalue',
    ]
  }
</script>

<style scoped>
  .checkBox {
    width: 20px;
    height: 20px;
  }
</style>
