import axios from "axios";
import { Modal } from "antd";

//创建一个axios示例
const service = axios.create({
  baseURL: '', // api 的 base_url
  timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 打印请求信息
    console.log('🚀 请求发送:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    // Do something with request error
    console.error('❌ 请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 打印响应信息
    console.log('✅ 响应接收:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // 打印错误信息
    console.error('❌ 响应错误:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default service;
