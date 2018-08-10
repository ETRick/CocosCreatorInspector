# config规范

> Author: huzi(moustache)<br>
> Date: 18-8-10 18:26

PS：修改config后，需要重新编译项目才能生效。

## injectedScripts.json文件说明

该文件控制注入脚本的程序的属性。

 - nodeRefleshInterval：节点属性值刷新的间隔，为0代表每帧刷新。
 - nodeTreeRefleshInterval：节点树刷新的间隔，为0代表每帧刷新。
 - graphicsRefleshInterval：cc.Graphics绘制刷新的间隔（DEBUG模式中边框刷新时间），为0代表每帧刷新。
 - DEBUG_MODE：DEBUG模式属性。
   - lineWidth：边框线的长度，单位为px。
   - clickedBorderColor：被点击节点的边框颜色。
   - hoverBorderColor：鼠标移动到节点上（未点击）显示的边框颜色。

## nodebase.json文件说明

该文件控制右半部分节点属性的显示。

 - type：页面上属性的类型。可选（single / bool / multi）
   - single：单节点。类似name。
     - key：在内存中的属性标识符名。
     - step(optional)：左右拖动的值变化速度，越大变化越快。默认为10。
     - readonly(optional)：是否只读。默认为false。
   - bool：选择框。类似active。
     - key：在内存中的属性标识符名。
   - multi：多节点。类似position(x, y)。
     - title：最左边的标题名。
     - keys：在内存中的属性标识符名数组。
     - step(optional)：左右拖动的值变化速度，越大变化越快。默认为10。
     - readonly(optional)：是否只读。默认为false。

举例：
~~~json
  {
    "type": "single",
    "key": "zIndex",
    "step": 1
  },
  {
    "type": "multi",
    "title": "position",
    "keys": ["x", "y", "z"],
    "readonly": true
  }
~~~

![](photo/演示图.png)