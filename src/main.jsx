import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// 注释掉下面这行可以禁用 mock，在 Network 面板中查看真实请求
import "./mock";
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
    <App />
)
