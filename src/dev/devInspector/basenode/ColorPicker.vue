<template>
  <Node v-if="typeof myvalue != 'undefined'" :name="mykey.firstUpperCase()">
    <div style="float: left;width: 100%;height: 100%;">
      <div style="float: left;width: 50%; height: 100%;">
        <el-color-picker v-model="myvalue" size="mini" class="colorPicker"
                         @change="changeColor">
        </el-color-picker>
      </div>
      <div style="float: left;width: 50%;">
        <span>{{myvalue}}</span>
      </div>
    </div>
  </Node>
</template>

<script>
  export default {
    name: "app",
    data() {
      return {};
    },
    methods: {
      changeColor() {
        this._evalCode(
          "ccIns.setNodeColor('" +
          this.uuid + "','" +
          this.myvalue + "');");
        this._freshNode(this.uuid);
      },
    },
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
