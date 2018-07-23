import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

import SlideNode from './basenode/SlideNode.vue'
import ColorPicker from './basenode/ColorPicker.vue'
import FloatNode from './basenode/FloatNode.vue'
import MultiFloatNode from './basenode/MultiFloatNode.vue'
import NodeBaseProperty from './compositenode/NodeBaseProperty.vue'
import SceneProperty from './compositenode/SceneProperty.vue'
import ComponentsProperty from './compositenode/ComponentsProperty.vue'

Vue.component('SlideNode', SlideNode);
Vue.component('ColorPicker', ColorPicker);
Vue.component('FloatNode', FloatNode);
Vue.component('MultiFloatNode', MultiFloatNode);
Vue.component('NodeBaseProperty', NodeBaseProperty);
Vue.component('SceneProperty', SceneProperty);
Vue.component('ComponentsProperty', ComponentsProperty);

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});
