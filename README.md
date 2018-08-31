# Cocos Creator Inspector

> Github 原地址: 见 fork 地址<br>
> Author: huzi(moustache)<br>
> Date: 18-7-26 21:27

## 文档

（PS：对应版本的文档请见 doc 文件夹，以下链接为 master 的）

- [如何运行项目](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE.md)
- [项目功能演示](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E9%A1%B9%E7%9B%AE%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA.md)
- [项目工作原理](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/%E9%A1%B9%E7%9B%AE%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
- [config 规范](https://github.com/bilibiliChangKai/CocosCreatorInspector/blob/master/doc/config%E8%A7%84%E8%8C%83.md)

## 版本变化

### v1.0

1.  修改文件结构，使其更加模板化。
2.  新增 node 节点可修改数量。
3.  所有属性都能进行修改并且反馈到实际游戏内。

### v2.0

1.  添加自定义的 component 属性显示。
2.  可以进行 component 属性的修改，并且反馈到实际游戏内了。
3.  现在的节点树属性可以进行动态变化了。

### v2.2

PS: 此分支是一个额外版本，使用了 DOM 树进行了边框的绘制，因此出现了很多问题，也有很多缺点。目前已经抛弃。接下来将重新使用 cc.Graphics 进行边框绘制。如果有人有兴趣的话，可以在此继续进行开发。

1.  游戏中节点出现增加或减少的时候，节点树不会收回了。
1.  可以高亮显示当前点击的节点了。
1.  添加了边框显示，点击节点的右键，可以进入 DEBUG 模式，显示该节点和其子节点的所有边框。
1.  在 DEBUG 模式下，点击树上的节点，可以提示节点对应的边框（变成红色）。
1.  在 DEBUG 模式下，点击游戏中的节点，可以提示节点树上的对应节点。
1.  添加了搜索框，可以搜索 uuid 和 name 和组件名。

### v3.0

PS: 此分支使用 cc.Graphics 进行边框绘制，因此修改了 DEBUG 模式的用法。详情请见功能演示。

1.  修改了 UI，现在每个组件的分界线更明显。
2.  修改了 UI，现在 uuid 显示在组件名上。
3.  修改了 UI，当节点或插件不可用时，添加下划线显示。
4.  修改了 UI，现在 active 和 enable 显示在组件左上角。
5.  修改了 UI，现在点击任何一个组件都可以隐藏该组件。
6.  使用 cc.Graphics 重构了 DEBUG 模式，现在单机右上角的 DEBUG 按钮后，才会进入 DEBUG 模式，并且点击游戏中节点时，不会出现遮挡了。
7.  可以在节点树中拖拽节点，改变节点在树中的位置。
8.  在 cocos creator 中保存场景修改，刷新页面后，可以实时显示在插件上了。
9.  将文件结构和其中的代码进行了简化和分离。
10. 可以通过 ccIns.n0 访问点击的节点
11. 可以通过 src/config 文件夹中的 json 文件修改属性

### v3.1

1. 修改了通讯结构，现在可以查看组件的更多信息了
2. 修改了popup，现在显示的是我自己的连接了

### v4.0

PS：从此版本起，该插件只支持cocos creator 2.0以上的版本。

1. 完全重构通讯结构，现在可以查看大部分属性信息了
2. 重构了vue脚本，降低组件之间的耦合度
3. 添加了Enum类型，现在可以显示并修改Enum类型了
4. 添加了Array类型，现在可以显示并修改Array类型了