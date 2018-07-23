import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

import MovebleNode from './basenode/MovebleNode.vue'
import ColorPicker from './basenode/ColorPicker.vue'
import BaseNode from './basenode/BaseNode.vue'
import MultiNode from './basenode/MultiNode.vue'
import NodeBaseProperty from './compositenode/NodeBaseProperty.vue'
import SceneProperty from './compositenode/SceneProperty.vue'
import ComponentsProperty from './compositenode/ComponentsProperty.vue'



Vue.component('MovebleNode', MovebleNode);
Vue.component('ColorPicker', ColorPicker);
Vue.component('BaseNode', BaseNode);
Vue.component('MultiNode', MultiNode);
Vue.component('NodeBaseProperty', NodeBaseProperty);
Vue.component('SceneProperty', SceneProperty);
Vue.component('ComponentsProperty', ComponentsProperty);

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});
