<template>
  <div>
    <!-- 显示数组的长度 -->
    <Node v-if="typeof myarray != 'undefined'" :name="mykey.firstUpperCase()" >
      <InputBox :uuid="uuid" mykey="length" :myvalue="myarray.length" :changeFunc="changeArrLength" />
    </Node>

    <!-- 显示数组的其他属性值 -->
    <Node v-for="(obj, index) in myarray" :key="index"
          :name="'[' + index + ']'"
          :isTextCenter="true">
      <CheckBox v-if="obj.type == 'boolean'"
                 :uuid="uuid" :mykey="[mykey, index]" :myvalue="obj.value" />
      <InputBox v-else-if="obj.type == 'number'"
                 :uuid="uuid" :mykey="[mykey, index]" :myvalue="obj.value" />
      <InputBox v-else-if="obj.type == 'string'"
                 :uuid="uuid" :mykey="[mykey, index]" :myvalue="obj.value" />
      <Node v-else-if="['Size', 'Vec2', 'Vec3'].hasValue(obj.type)"
              v-for="seckey in Object.keys(obj.value)" :key="seckey" 
              :name="seckey.eraseSubstring(titlename).firstUpperCase()[0]"
              class="ui" :style="{width: 100 / Object.keys(obj.value).length + '%'}">
        <InputBox :uuid="uuid" :mykey="[mykey, index, seckey]" :myvalue="obj.value[seckey].value" />
      </Node>
      <div v-else-if="obj.type != 'null'">
        <span style="float: left; width: 50%;">{{myarray[index].type}}</span>
        <span style="float: left; width: 50%;">{{obj.value.name ? myarray[index].value.name.value : "No Name!"}}</span>
      </div>
      <span v-else>NULL</span>
    </Node>
  </div>
</template>

<script>
export default {
  methods: {
    // 数组长度修改触发函数
    changeArrLength(length, value) {
      this.setNodeArrayLength(this.uuid, this.mykey, value);
    }
  },
  props: ["uuid", "mykey", "myarray"]
};
</script>

<style scoped>
span {
  color: #fd942b;
}

.ui {
  float: left;
  cursor: ew-resize;
}
</style>
