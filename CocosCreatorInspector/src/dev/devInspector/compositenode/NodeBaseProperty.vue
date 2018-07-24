<template>
  <div id="app">
    <!-- uuid -->
    <FloatNode :itemData="itemData" mykey="uuid"></FloatNode>
    
    <!-- 配置文件中属性 -->
    <FloatNode :itemData="itemData" mykey="name"></FloatNode>
    <FloatNode :itemData="itemData" mykey="name"></FloatNode>
    <!-- 坐标 -->
    <MultiFloatNode :itemData="itemData" titlename="position" :mykeys="['x', 'y']" hasInput="true"></MultiFloatNode>
    <!-- 旋转 -->
    <FloatNode :itemData="itemData" mykey="rotation" hasInput="true"></FloatNode>
    <!-- 缩放 -->
    <MultiFloatNode :itemData="itemData" titlename="scale" :mykeys="['scaleX', 'scaleY']" hasInput="true" step="0.01"></MultiFloatNode>
    <!-- 锚点 -->
    <MultiFloatNode :itemData="itemData" titlename="anchor" :mykeys="['anchorX', 'anchorY']" hasInput="true" step="0.01"></MultiFloatNode>
    <!-- 尺寸 -->
    <MultiFloatNode :itemData="itemData" titlename="size" :mykeys="['width', 'height']" hasInput="true"></MultiFloatNode>
    <!-- 透明度 -->
    <FloatNode :itemData="itemData" mykey="opacity" hasInput="true"></FloatNode>
    <!-- 斜切 -->
    <MultiFloatNode :itemData="itemData" titlename="skew" :mykeys="['skewX', 'skewY']" hasInput="true" step="1"></MultiFloatNode>

    <!-- <SlideNode name="zIndex">
      <span>{{itemData.zIndex}}</span>
    </SlideNode>
    <SlideNode name="childrenCount">
      <span>{{itemData.childrenCount}}</span>
    </SlideNode> -->

    <!-- 节点状态 -->
    <SlideNode name="active" v-if="typeof itemData['active'] != 'undefined'">
      <p v-if="itemData.active" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
        <input type="checkbox"
              style="width: 20px;height: 20px;"
              :checked="itemData.active"
              @click="onBtnClickNodeHide">
        隐藏节点
      </p>

      <p v-if="!itemData.active" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
        <input type="checkbox"
              style="width: 20px;height: 20px;"
              :checked="itemData.active"
              @click="onBtnClickNodeShow"
        >
        显示节点
      </p>
    </SlideNode>
    <!-- 颜色 -->
    <SlideNode name="color" v-if="typeof itemData['color'] != 'undefined'">
      <div style="float: left;width: 100%;height: 100%;">
        <div style="float: left;width: 50%; height: 100%;">
          <el-color-picker v-model="itemData.color" size="mini"
                          style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;"
                          @change="changeColor"></el-color-picker>
        </div>
        <div style="float: left;width: 50%;">
          <span>{{itemData.color}}</span>
        </div>
      </div>
    </SlideNode>
  </div>
</template>

<script>
  import configjs from '../config/nodebase.json'

  export default {
    mounted() {
      console.log(this.configs);
    },
    name: "app",
    data() {
      return {
        configs: JSON.parse(configjs),
      }
    },
    methods: {
      changeColor() {
        let color = this.itemData.color;
        console.log("color:" + color);
        this._evalCode(
          "window.pluginSetNodeColor('" +
          this.itemData.uuid + "','" +
          color + "');");
        this._freshNode();
      },
      onBtnClickNodeHide() {
        let uuid = this.itemData.uuid;
        if (uuid !== undefined) {
          let code = "window.pluginSetNodeActive('" + uuid + "', 0);";
          this._evalCode(code);
          this._freshNode();
        }
      },
      onBtnClickNodeShow() {
        let uuid = this.itemData.uuid;
        if (uuid !== undefined) {
          let code = "window.pluginSetNodeActive('" + uuid + "', 1);";
          this._evalCode(code);
          this._freshNode();
        }
      },
      _freshNode() {
        let uuid = this.itemData.uuid;
        let code2 = "window.getNodeInfo('" + uuid + "')";
        this._evalCode(code2);
      },
      _evalCode(code) {
        if (chrome && chrome.devtools) {
          chrome.devtools.inspectedWindow.eval(code);
        } else {
          console.log(code);
        }
      },
    },
    props: [
      'itemData'
    ]
  }
</script>

<style scoped>
  span {
    color: #fd942b;
  }

  .btnSize {
    padding: 5px 10px;
  }

  .comp {
    border: 2px solid #a1a1a1;
    padding: 5px 5px;
    background: #dddddd;
    width: 100%;
    border-radius: 5px;
    -moz-border-radius: 5px; /* 老的 Firefox */
  }

  .float-left {
    float: left;
  }

  .compBorder {
    border: 1px solid #b3b3b3;
    background: #ffffff
  }

  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
