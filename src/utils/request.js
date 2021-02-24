import axios from "axios";
import router from "../router/index";
import { notification } from "ant-design-vue";
let request = axios.create({
  baseURL: "/",
  headers: {
    "content-type": "application/json"
  }
});
request.interceptors.request.use(
  config => {  
    const token = sessionStorage.getItem("token");
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.authorization = token; //Authorization是登录接口返回
      config.headers.type = "admin"; // type:admin   是固定的
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
request.interceptors.response.use(
  response => {
    return response;
  },
  //接口错误状态处理
  error => {
    const {
      response: { status}
    } = error;
    // 登录过期处理
    if (status == 401) {
      notification.error({
        // eslint-disable-next-line no-unused-vars
        message: h => <div>登录已过期，请重新登录</div>
      });
      router.replace({
        path: "/login",
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    } else {
      // 错误消息提示
      notification.error({
        // eslint-disable-next-line no-unused-vars
        message: h => (
          <div>
            请求错误 <span style="color: red">{status}</span>
          </div>
        )//,
        // description: statusText
      });
    }
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);
export default request;
