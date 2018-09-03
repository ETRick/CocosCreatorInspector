<template>
  <div id="app">
    <Node v-if="typeof myarray != 'undefined'" :name="mykey.firstUpperCase()" >
      <input class="myInput"
        @focus="pauseGame(uuid)"
        @blur="resumeGame(uuid)"
        @change="setNodeArrayLength(uuid, mykey, myarray.length)"
        :placeholder="myarray.length"
        v-model="myarray.length">
    </Node>
    
    <Node v-for="(obj, index) in myarray" :key="index"
          :name="'[' + index + ']'"
          :isTextCenter="true">
      <input v-if="obj.type == 'boolean'" type="checkbox"
            style="width: 20px; height: 20px;"
            :checked="obj.value"
            @click="onBtnClick(index)">
      <input v-else-if="obj.type == 'number'" class="myInput"
            @focus="pauseGame(uuid)"
            @blur="resumeGame(uuid)"
            @change="changeNumberValue(index)"
            :placeholder="obj.value"
            v-model="obj.value">
      <input v-else-if="obj.type == 'string'" class="myInput"
            @focus="pauseGame(uuid)"
            @blur="resumeGame(uuid)"
            @change="changeStringValue(index)"
            :placeholder="obj.value"
            v-model="obj.value">
      <div v-else-if="['Size', 'Vec2', 'Vec3'].hasValue(obj.type)">
        <Node v-for="seckey in Object.keys(obj.value)" :key="seckey" 
                   :name="seckey.eraseSubstring(titlename).firstUpperCase()[0]"
                   class="ui" :style="{width: 100 / Object.keys(obj.value).length + '%'}">
          <input class="myInput"
                @focus="pauseGame(uuid)"
                @blur="resumeGame(uuid)"
                @change="changeVecValue(index)"
                :placeholder="obj.value[seckey].value"
                v-model="obj.value[seckey].value">
        </Node>
      </div>
      <div v-else-if="obj.type != 'null'">
        <span style="float: left; width: 50%;">{{myarray[index].type}}</span>
        <span style="float: left; width: 50%;">{{obj.value.name ? myarray[index].value.name.value : "Undefined Name!"}}</span>
      </div>
      <span v-else>NULL</span>
    </Node>
  </div>
</template>

<script>
  export default {
    name: "app",
    methods: {
      // bool点击触发函数
      onBtnClick(index) {
        this.myarray[index].value = !this.myarray[index].value; 
        this.setNodeValue(this.uuid, [this.mykey, index], this.myarray[index].value);
      },
      // number点击触发函数
      changeNumberValue(index) {
        let value = parseFloat(this.myarray[index].value);
        if (!isNaN(value)) {
          this.setNodeValue(this.uuid, [this.mykey, index], value);
        }
      },
      // string点击触发函数
      changeStringValue(index) {
        this.setNodeValue(this.uuid, [this.mykey, index], this.myarray[index].value);
      },
      // vector点击触发函数
      changeVecValue(index) {
        let seckeys = Object.keys(this.myarray[index].value);
        // 构造要赋值的value
        let value = {};
        for (let key of seckeys) {
          value[key] = this.myarray[index].value[key].value;
        }
        this.setNodeValue(this.uuid, [this.mykey, index], value);
      },
    },
    props: [
      "uuid",
      "mykey",
      "myarray",
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

  .icon {
    width: 10%;
    height: 100%;
    float: left;
    background-color: #4a4a4a;
  }


  .ui {
    float : left;
    cursor : ew-resize;
  }
</style>
