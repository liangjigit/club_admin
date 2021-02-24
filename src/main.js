/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  Button,
  Breadcrumb,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  FormModel,
  Input,
  Select,
  ConfigProvider,
  Dropdown,
  DatePicker,
  Badge,
  Tabs,
  Spin,
  List,
  Avatar,
  Tooltip,
  Tag,
  Checkbox,
  Col,
  Row,
  Popover,
  Progress,
  Alert,
  BackTop,
  Skeleton,
  Steps,
  Message,
  Cascader,
  InputNumber,
  Card,
  Switch,
  Rate,
  TimePicker,
  Table,
  Divider,
  Popconfirm,
  Pagination,
  Upload,
  Modal,
  Descriptions
} from "ant-design-vue";
Vue.use(TimePicker);
Vue.use(Button);
Vue.use(Breadcrumb);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Select);
Vue.use(ConfigProvider);
Vue.use(Dropdown);
Vue.use(DatePicker);
Vue.use(Avatar);
Vue.use(Tooltip);
Vue.use(Badge);
Vue.use(Tabs);
Vue.use(Spin);
Vue.use(List);
Vue.use(Tag);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Alert);
Vue.use(BackTop);
Vue.use(Skeleton);
Vue.use(Steps);
Vue.use(Message);
Vue.use(Cascader);
Vue.use(InputNumber);
Vue.use(Card);
Vue.use(Switch);
Vue.use(Rate);
Vue.use(Table);
Vue.use(Divider);
Vue.use(Popconfirm);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Modal);
Vue.use(Descriptions);
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
  const token = sessionStorage["token"];
  const username = sessionStorage["username"];
  if(token){
    this.$store.commit("login/CHANGELOGINSTATUS", {token,username});
  }
}
}).$mount("#app");
