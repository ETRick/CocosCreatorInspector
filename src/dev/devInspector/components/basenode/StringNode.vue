<template>
  <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
    <InputBox :uuid="uuid" :mykey="mykey" :myvalue="myvalue" :readonly="readonly" />
  </Node>
</template>

<script>
export default {
  props: ["uuid", "mykey", "myvalue", "readonly"]
};
</script>

<style scoped>
span {
  color: #fd942b;
}

.myInput {
  width: 90%;
  border-radius: 5px;
  color: #fd942b;
}
</style>
