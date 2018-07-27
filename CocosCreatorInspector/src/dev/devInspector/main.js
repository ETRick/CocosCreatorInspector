import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

import MyNode from './basenode/Node.vue'
import SlideNode from './basenode/SlideNode.vue'
// import ColorPicker from './basenode/ColorPicker.vue'
import CheckBox from './basenode/CheckBox.vue'
import SingleNode from './basenode/SingleNode.vue'
import MultiNode from './basenode/MultiNode.vue'
import NodeBaseProperty from './compositenode/NodeBaseProperty.vue'
import SceneProperty from './compositenode/SceneProperty.vue'
import ComponentProperty from './compositenode/ComponentProperty.vue'
import ComponentsProperty from './compositenode/ComponentsProperty.vue'

import util from './util.js'

util();

Vue.component('Node', MyNode);
Vue.component('SlideNode', SlideNode);
// Vue.component('ColorPicker', ColorPicker);
Vue.component('CheckBox', CheckBox);
Vue.component('SingleNode', SingleNode);
Vue.component('MultiNode', MultiNode);
Vue.component('NodeBaseProperty', NodeBaseProperty);
Vue.component('SceneProperty', SceneProperty);
Vue.component('ComponentProperty', ComponentProperty);
Vue.component('ComponentsProperty', ComponentsProperty);

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});
