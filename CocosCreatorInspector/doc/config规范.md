# config规范

## nodebase.json文件说明

 - 必选值：
    - type - 页面上类型。<br>
      可选值（single / singlebool / multi / multibool / colorpicker）

 - 单节点(single / singlebool / colorpicker)：
    - key - 对应js中的项。

    
//  title - 多节点中的名称。

// 可选值：
//  read-only - 是否可修改。默认为false。
//  step - 左右拖动的间隔值，越大变化越快。默认为10。