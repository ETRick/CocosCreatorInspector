<template>
  <div id="app">
    <Node v-if="typeof myvalue != 'undefined'"
          :name="mykey.firstUpperCase()">
      <input v-if='!readonly' class="myInput"
        @focus="pauseGame(uuid)"
        @blur="resumeGame(uuid)"
        @change="setNodeValue(uuid, mykey, myvalue)"
        :placeholder="myvalue"
        v-model="myvalue">
      <span v-else>{{myvalue}}</span>
    </Node>
  </div>
</template>

<script>
  export default {
    name: "app",
    props: 
    [
      'uuid',
      'mykey',
      'myvalue',
      'readonly'
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
