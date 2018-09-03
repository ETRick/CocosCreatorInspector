<template>
  <div id="app">
    <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
      <el-select v-model="myvalue" size="mini">
        <el-option
          v-for="type in Object.keys(enumTypes)"
          :key="enumTypes[type]"
          :label="type"
          :value="enumTypes[type]">
        </el-option>
      </el-select>
    </Node>
  </div>
</template>

<script>
  export default {
    name: "app",
    watch: {
      // 属性修改时，直接更新节点
      myvalue: function() {
        this.setNodeValue(this.uuid, this.mykey, this.myvalue);
      }
    },
    props: 
    [
      'enumTypes',
      'uuid',
      'mykey',
      'myvalue',
    ]
  }
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
