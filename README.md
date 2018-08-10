# CocosCreatorInspector

> Github原地址: 见fork地址<br>
> Author: huzi(moustache)<br>
> Date: 18-7-26 21:27

## 文档

 - [如何运行项目](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE.md)
 - [项目功能演示](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E9%A1%B9%E7%9B%AE%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA.md)
 - [项目工作原理](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E9%A1%B9%E7%9B%AE%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
 - [config规范](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/config%E8%A7%84%E8%8C%83.md)

## 版本变化

### v1.0

 1. 修改文件结构，使其更加模板化。
 2. 新增node节点可修改数量。
 3. 所有属性都能进行修改并且反馈到实际游戏内。

### v2.0

 1. 添加自定义的component属性显示。
 2. 可以进行component属性的修改，并且反馈到实际游戏内了。
 3. 现在的节点树属性可以进行动态变化了。

### v2.2

PS: 此分支是一个额外版本，使用了DOM树进行了边框的绘制，因此出现了很多问题，也有很多缺点。目前已经抛弃。接下来将重新使用cc.Graphics进行边框绘制。如果有人有兴趣的话，可以在此继续进行开发。

 1. 游戏中节点出现增加或减少的时候，节点树不会收回了。
 1. 可以高亮显示当前点击的节点了。
 1. 添加了边框显示，点击节点的右键，可以进入DEBUG模式，显示该节点和其子节点的所有边框。
 2. 在DEBUG模式下，点击树上的节点，可以提示节点对应的边框（变成红色）。
 3. 在DEBUG模式下，点击游戏中的节点，可以提示节点树上的对应节点。
 3. 添加了搜索框，可以搜索uuid和name和组件名。

### v3.0

PS: 此分支使用cc.Graphics进行边框绘制，因此修改了DEBUG模式的用法。详情请见功能演示。

 1. 修改了UI，现在每个组件的分界线更明显。
 2. 修改了UI，现在uuid显示在组件名上。
 2. 修改了UI，当节点或插件不可用时，添加下划线显示。
 3. 修改了UI，现在active和enable显示在组件左上角。
 4. 修改了UI，现在点击任何一个组件都可以缩放该组件。
 2. 使用cc.Graphics重构了DEBUG模式，现在单机右上角的DEBUG按钮后，才会进入DEBUG模式，并且点击游戏中节点时，不会出现遮挡了。
 3. 可以在节点树中拖拽节点，改变节点在树中的位置。
 4. 在cocos creator中保存场景修改，刷新页面后，可以实时显示在插件上了。
 5. 将文件结构和其中的代码进行了简化和分离。
