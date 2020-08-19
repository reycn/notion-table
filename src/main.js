import Vue from 'vue';
import 'ant-design-vue/dist/antd.css';
import App from './App';
import {
  InputNumber,
  Button,
  Switch,
  Icon,
  Row,
  Alert
}
from 'ant-design-vue';
import VueKatex from 'vue-katex';
import 'katex/dist/katex.min.css';

Vue.use(Button);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Alert);

Vue.config.productionTip = false;

Vue.use(VueKatex, {
  globalOptions: {
    //... Define globally applied KaTeX options here
  }
});
new Vue({
  render: h => h(App),
}).$mount('#app');