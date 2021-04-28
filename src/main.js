import Vue from 'vue';
// import 'ant-design-vue/dist/antd.css';b
import App from './App';
// import {
//   // InputNumber,
//   Button,
//   Switch,
//   Icon,
//   // Row,
//   Alert,
//   // Col,
//   // Table,
//   // Popconfirm,
//   // Input,
//   Popover
// }
// from 'ant-design-vue';
import VueKatex from 'vue-katex';
import 'katex/dist/katex.min.css';
import VueExcelEditor from 'vue-excel-editor'

Vue.use(VueExcelEditor)
// Vue.use(Button);
// // Vue.use(InputNumber);
// // Vue.use(Input);
// Vue.use(Switch);
// Vue.use(Icon);
// // Vue.use(Col);
// // Vue.use(Row);
// Vue.use(Alert);
// // Vue.use(Table);
// // Vue.use(Popconfirm);
// Vue.use(Popover);

Vue.config.productionTip = false;

Vue.use(VueKatex, {
  globalOptions: {
    //... Define globally applied KaTeX options here
  }
});
new Vue({
  render: h => h(App),
}).$mount('#app');