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
    data() {
      return {}
    },
    watch: {
      // 属性修改时，直接更新节点
      myvalue: function() {
        this.changeValue();
      }
    },
    methods: {
      // // 修改任意key-value属性值
      changeValue() {
        // 添加uuid，key值
        let code = "ccIns.setNodeValue(" +
          "'" + this.uuid + "'," +
          "'" + this.mykey + "'," +
          this.myvalue + ")";
        this._evalCode(code);
        this._freshNode(this.uuid);
      },
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
