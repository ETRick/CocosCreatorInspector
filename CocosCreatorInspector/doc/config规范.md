# config规范

## nodebase.json文件说明

 - type - 页面上类型。<br>
可选（single / singlebool / multi / colorpicker）

 - 单节点(single / singlebool / colorpicker)：
    - key - 对应js中的项。

 - 多节点(multi)：
    - title - 多节点中的总名称。
    - keys - 多借点中对应js中的项。

 - 可选值：
   - readonly - 是否可修改。默认为false。
   - step - 左右拖动的间隔值，越大变化越快。默认为10。