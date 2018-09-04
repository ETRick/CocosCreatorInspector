<template>
  <div style="float: left;width: 100%;height: 100%;">
    <div style="float: left;width: 50%; height: 100%;">
      <el-color-picker v-model="myvalue" size="mini" class="colorPicker"
                        @change="setNodeColor(uuid, myvalue)">
      </el-color-picker>
    </div>
    <div style="float: left;width: 50%;">
      <span>{{myvalue}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'uuid',
      'myvalue',
      'mykey',
    ]
  }
</script>

<style scoped>
  span {
    color: #fd942b;
  }
  
  .colorPicker {
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
