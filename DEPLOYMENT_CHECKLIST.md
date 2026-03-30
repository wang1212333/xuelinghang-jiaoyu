# 后端部署检查清单

## ✅ 必须检查的项目

### 1. 后端环境变量配置
确保后端的 `.env` 文件包含：
```
SUPABASE_URL=https://mxciauwvqwcjkpjhznwu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_
PORT=3001
```

### 2. 后端部署平台环境变量
如果部署在 Vercel/Railway/Render，需要在平台设置相同的环境变量：
- SUPABASE_URL
- SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_ROLE_KEY

### 3. 前端 API URL 配置
前端会调用你的后端 API，需要正确设置：
- 开发环境：`http://localhost:3001/api`
- 生产环境：`https://success-cyan-beta.vercel.app/api`

### 4. CORS 配置
后端已更新为支持跨域请求。需要在环境变量中设置：
```
FRONTEND_URL=你的前端部署地址
```

### 5. 测试健康检查
访问：`https://success-cyan-beta.vercel.app/api/health`
应该返回：`{ "status": "ok", "timestamp": "..." }`

## 🔍 测试登录流程

### 本地测试：
1. 后端：`npm run dev` (确保运行在 3001 端口)
2. 前端：`npm run dev` (应该运行在 3002 端口)
3. 打开浏览器 http://localhost:3002
4. 试用测试账号：
   - 邮箱：admin@xuelinghang.com
   - 密码：admin123456

### 生产测试：
1. 访问部署的前端地址
2. 打开浏览器开发者工具 (F12) > Console
3. 尝试登录
4. 查看控制台错误信息，了解具体问题

## 🐛 常见问题排查

### "请求失败" - 检查步骤：
1. 打开浏览器 DevTools (F12)
2. 点击登录
3. 查看 Console 输出的错误信息
4. 查看 Network 标签，检查请求是否到达后端
5. 检查 Response Status Code：
   - 404: API 路由不存在
   - 500: 后端出错
   - CORS error: 跨域配置问题
   - connection timeout: 后端未运行/无法访问

### 检查前端配置：
在浏览器 Console 执行：
```javascript
console.log(import.meta.env.VITE_API_URL)
```
应该输出正确的 API 地址。
