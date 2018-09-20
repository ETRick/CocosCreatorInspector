import Vue from 'vue';
import ElementUI from 'element-ui';
import '../../../theme/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

// 自定义util函数加载
import util from './util.js';
util();
// 自定义接口函数加载
import plugin from './plugin.js';
plugin();

// 加载自定义组件
let requireComponent = require.context(
  // 组件目录的相对路径
  './components',
  // 递归子目录
  true,
  // 正则表达式匹配
  /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
  // 获得组件配置
  const componentConfig = requireComponent(fileName);
  // 除去.vue和目录
  const componentName = fileName.replace(/\.\w+$/, '').replace(/^\.(\w|\/)+\//, '');
  // 全局加载组件
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});