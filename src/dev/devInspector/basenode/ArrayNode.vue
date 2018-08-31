<template>
  <div id="app">
    <Node v-if="typeof myarray != 'undefined'" :name="mykey.firstUpperCase()" >
      <input class="myInput"
        @focus="pauseGame"
        @blur="resumeGame"
        @change="changeLength"
        :placeholder="myarray.length"
        v-model="myarray.length">
    </Node>
    <Node v-for="(obj, index) in myarray" :key="index"
          :name="'└── [' + index + ']'">
      <input v-if="obj.type == 'boolean'" type="checkbox"
            style="width: 20px; height: 20px;"
            :checked="myarray[index].value"
            @click="onBtnClick(index)">
      <input v-else-if="obj.type == 'number' || obj.type == 'string'" class="myInput"
            @focus="pauseGame"
            @blur="resumeGame"
            @change="changeArrayValue(index)"
            :placeholder="myarray[index].value"
            v-model="myarray[index].value">
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
    data() {
      return {};
    },
    methods: {
      // 改变数组长度
      changeLength() {
        let code = "ccIns.setNodeArrayLength(" +
          "'" + this.uuid + "'," +
          "'" + this.mykey + "'," +
          this.myarray.length + ")";
        this._evalCode(code);
        this._freshNode(this.uuid);
      },
      // CheckBox点击触发函数
      onBtnClick(index) {
        this.myarray[index].value = !this.myarray[index].value; 
        let value = this.myarray[index].value;
        this._evalCode("ccIns.setNodeArrayValue('" 
                    + this.uuid + "','"
                    + this.mykey + "',"
                    + index + ","
                    + value + ");");
                  
        this._freshNode(this.uuid);
      },
      // string或者number点击触发函数
      changeArrayValue(index) {
        // number类型
        if (this.myarray[index].type == "number") {
          let value = parseFloat(this.myarray[index].value);
          if (!isNaN(value)) {
            this._evalCode("ccIns.setNodeArrayValue('" 
                        + this.uuid + "','"
                        + this.mykey + "',"
                        + index + ","
                        + value + ");");
          }
        } else {
          // string类型
          let value = this.myarray[index].value;
          this._evalCode("ccIns.setNodeArrayValue('" 
                      + this.uuid + "','"
                      + this.mykey + "',"
                      + index + ","
                      + "'" + value + "');");
        }
        this._freshNode(this.uuid);
      },
      pauseGame() {
        this._evalCode("ccIns.pauseGame()");
        this._freshNode(this.uuid);
      },
      resumeGame() {
        this._evalCode("ccIns.resumeGame()");
        this._freshNode(this.uuid);
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
</style>
