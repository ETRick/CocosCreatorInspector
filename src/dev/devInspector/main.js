import Vue from 'vue';
import ElementUI from 'element-ui';
import '../../../theme/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

// 左侧组件
import MyNode from './basenode/left/Node.vue';
import SlideNode from './basenode/left/SlideNode.vue';

// 右侧组件
import CheckBox from './basenode/right/CheckBox.vue';
import ColorPicker from './basenode/right/ColorPicker.vue';
import InputBox from './basenode/right/InputBox.vue';
import SelectBox from './basenode/right/SelectBox.vue';

// 单一节点组件（由上述节点组合而成）
import BoolNode from './basenode/BoolNode.vue';
import EnumNode from './basenode/EnumNode.vue';
import NumberNode from './basenode/NumberNode.vue';
import StringNode from './basenode/StringNode.vue';
import ColorNode from './basenode/ColorNode.vue';
import ArrayNode from './basenode/ArrayNode.vue';
import VectorNode from './basenode/VectorNode.vue';
import MultiNumberNode from './basenode/MultiNumberNode.vue';

// 复合节点组件
import NodeTreeProperty from './compositenode/NodeTreeProperty.vue';
import NodeBaseProperty from './compositenode/NodeBaseProperty.vue';
import ComponentProperty from './compositenode/ComponentProperty.vue';
import ComponentsProperty from './compositenode/ComponentsProperty.vue';

// 自定义util函数加载
import util from './util.js';
util();

// 自定义接口函数加载
import plugin from './plugin.js';
plugin();

Vue.component('Node', MyNode);
Vue.component('SlideNode', SlideNode);

Vue.component('CheckBox', CheckBox);
Vue.component('ColorPicker', ColorPicker);
Vue.component('InputBox', InputBox);
Vue.component('SelectBox', SelectBox);

Vue.component('BoolNode', BoolNode);
Vue.component('EnumNode', EnumNode);
Vue.component('NumberNode', NumberNode);
Vue.component('StringNode', StringNode);
Vue.component('ColorNode', ColorNode);
Vue.component('ArrayNode', ArrayNode);
Vue.component('VectorNode', VectorNode);
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
