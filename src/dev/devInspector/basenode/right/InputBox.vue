<template>
  <!-- change函数使用传入的函数或者自带的函数 -->
  <input v-if='!readonly' class="myInput"
        @focus="pauseGame(uuid)"
        @blur="resumeGame(uuid)"
        @change="typeof changeFunc == 'function' ? changeFunc(mykey, myvalue) : setNodeValue(uuid, mykey, myvalue)"
        :placeholder="myvalue"
        v-model="myvalue">
  <span v-else>{{myvalue}}</span>
</template>

<script>
  export default {
    // 如果不存在changeFunc，使用默认函数setNodeValue
    props: [
      'uuid',
      'mykey',
      'myvalue',
      'readonly',
      'changeFunc',
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

