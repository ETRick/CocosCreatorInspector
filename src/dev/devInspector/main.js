import Vue from 'vue';
import ElementUI from 'element-ui';
import '../../../theme/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import MyNode from './basenode/Node.vue';
import SlideNode from './basenode/SlideNode.vue';
import CheckBox from './basenode/CheckBox.vue';
import EnumNode from './basenode/EnumNode.vue';
import NumberNode from './basenode/NumberNode.vue';
import StringNode from './basenode/StringNode.vue'
import ColorPicker from './basenode/ColorPicker.vue'
import MultiNumberNode from './basenode/MultiNumberNode.vue';

import NodeTreeProperty from './compositenode/NodeTreeProperty.vue';
import NodeBaseProperty from './compositenode/NodeBaseProperty.vue';
import ComponentProperty from './compositenode/ComponentProperty.vue';
import ComponentsProperty from './compositenode/ComponentsProperty.vue';

// 自定义util函数加载
import util from './util.js';
util();

Vue.component('Node', MyNode);
Vue.component('SlideNode', SlideNode);
Vue.component('CheckBox', CheckBox);
Vue.component('EnumNode', EnumNode);
Vue.component('NumberNode', NumberNode);
Vue.component('StringNode', StringNode);
Vue.component('ColorPicker', ColorPicker);
Vue.component('MultiNumberNode', MultiNumberNode);

Vue.component('NodeTreeProperty', NodeTreeProperty);
Vue.component('NodeBaseProperty', NodeBaseProperty);
Vue.component('ComponentProperty', ComponentProperty);
Vue.component('ComponentsProperty', ComponentsProperty);

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});
