import Mock from "mockjs";
import tableAPI from "./table";

// 通过环境变量控制是否启用 mock
// 设置 VITE_USE_MOCK=false 可以禁用 mock，在 Network 面板中查看真实请求
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

if (USE_MOCK) {
  // table
  Mock.mock(/\/table\/list/, "post", tableAPI.tableList);
  Mock.mock(/\/table\/delete/, "post", tableAPI.deleteItem);
  Mock.mock(/\/table\/edit/, "post", tableAPI.editItem);
  console.log('📦 Mock 已启用，请求将被拦截');
} else {
  console.log('🌐 Mock 已禁用，请求将发送到真实服务器');
}

export default Mock;
