<template>
  <el-select v-model="myvalue" size="mini">
    <el-option
      v-for="type in Object.keys(allTypes)"
      :key="allTypes[type]"
      :label="type"
      :value="allTypes[type]">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    watch: {
      // 属性修改时，直接更新节点
      myvalue: function() {
        this.setNodeValue(this.uuid, this.mykey, this.myvalue);
      }
    },
    props: [
      'allTypes',
      'uuid',
      'mykey',
      'myvalue',
    ]
  }
</script>

<style scoped>
</style>
