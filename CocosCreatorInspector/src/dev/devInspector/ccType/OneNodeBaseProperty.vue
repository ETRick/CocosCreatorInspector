<template>
  <div id="app">
    <div>
      <ui-prop name="key">
        <span> {{itemData[key]}}</span>
      </ui-prop>
  </div>
</template>

<script>


  export default {
    name: "app",
    data() {
      return {}
    },
    methods: {
      // changeSizeActionWidth(step) {
      //   let w = parseFloat(this.itemData.width);
      //   this.itemData.width = w + step;
      //   this.changeSize();
      // },
      changePosition() {
        // console.log("change changePositionX:" + this.itemData.x);
        // console.log("change changePositionY:" + this.itemData.y);
        this._evalCode(
          "window.pluginSetNodePosition(" +
          "'" + this.itemData.uuid + "'," +
          "'" + this.itemData.x + "'," +
          "'" + this.itemData.y + "'" +
          ")");
        this._freshNode();
      },
      changeSize() {
        // console.log("change width:" + this.itemData.width);
        // console.log("change height:" + this.itemData.height);
        this._evalCode(
          "window.pluginSetNodeSize(" +
          "'" + this.itemData.uuid + "'," +
          "'" + this.itemData.width + "'," +
          "'" + this.itemData.height + "'" +
          ")");
        this._freshNode();
      },
      changeRotation() {
        console.log("change rotation:" + this.itemData.rotation);
        this._evalCode(
          "window.pluginSetNodeRotation('" +
          this.itemData.uuid + "','" +
          this.itemData.rotation + "')");
        this._freshNode();
      },
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
      'itemData',
      'key'
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
