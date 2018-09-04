<template>
  <!-- change函数使用传入的函数或者自带的函数 -->
  <input v-if='!readonly' class="myInput"
        @focus="pauseGame(uuid)"
        @blur="resumeGame(uuid)"
        @change="changeFunc ? changeFunc() : setNodeValue(uuid, mykeys, myvalue)"
        :placeholder="myvalue"
        v-model="myvalue">
  <span v-else>{{myvalue}}</span>
</template>

<script>
  export default {
    // changeFunc和mykeys二选一
    //  如果不存在changeFunc，使用默认函数
    props: [
      'uuid',
      'mykeys',
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

