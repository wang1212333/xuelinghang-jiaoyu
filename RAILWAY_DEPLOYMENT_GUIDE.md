# Railway 后端部署指南

## 部署前准备

### 1. 确保代码已推送到 GitHub

### 2. 准备环境变量

在 Railway 部署时需要设置以下环境变量：

```
SUPABASE_URL=https://mxciauwvqwcjkpjhznwu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=3001
```

**注意：**
- `SUPABASE_SERVICE_ROLE_KEY` 需要从 Supabase 控制台获取（Project Settings → API → service_role key）
- `FRONTEND_URL` 部署完前端后填入实际的 Vercel/Netlify 地址

---

## Railway 部署步骤

### 第一步：注册/登录 Railway

1. 访问 https://railway.app/
2. 使用 GitHub 账号登录

### 第二步：创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的仓库 `wang1212333/xuelinghang-jiaoyu`

### 第三步：配置部署

1. **设置 Root Directory**: 输入 `backend`
2. Railway 会自动检测 `railway.json` 配置

### 第四步：添加环境变量

1. 在项目页面点击 "Variables" 标签
2. 点击 "New Variable" 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `SUPABASE_URL` | https://mxciauwvqwcjkpjhznwu.supabase.co |
| `SUPABASE_ANON_KEY` | sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_ |
| `SUPABASE_SERVICE_ROLE_KEY` | 从 Supabase 控制台获取 |
| `FRONTEND_URL` | 您的 Vercel 前端地址 |
| `NODE_ENV` | production |

### 第五步：部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后，您会获得一个域名，例如：
   ```
   https://mojin-academy-backend.up.railway.app
   ```

### 第六步：验证部署

访问健康检查接口：
```
https://your-backend-url.up.railway.app/api/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 更新前端配置

### 1. 更新 Vercel/Netlify 环境变量

部署 Railway 后端后，将后端地址添加到前端环境变量：

```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

### 2. 重新部署前端

在 Vercel/Netlify 中重新部署前端，使新环境变量生效。

---

## 故障排查

### 问题 1：部署失败

**检查：**
- 环境变量是否全部设置
- Supabase 服务密钥是否正确

### 问题 2：CORS 错误

**检查：**
- `FRONTEND_URL` 是否设置为正确的前端地址
- 后端 CORS 配置已更新支持 Vercel/Netlify 域名

### 问题 3：API 请求超时

**检查：**
- Railway 服务是否正常运行
- 健康检查接口 `/api/health` 是否可访问

---

## 中国用户访问优化

Railway 的服务器位于海外，中国用户访问可能较慢。如需优化：

1. **使用 CDN**: 前端部署在 Vercel（有香港/新加坡节点）
2. **考虑国内云服务**: 如腾讯云、阿里云（需要备案域名）

---

## 部署完成检查清单

- [ ] Railway 后端部署成功
- [ ] 健康检查接口可访问
- [ ] 前端环境变量 `VITE_API_URL` 已更新
- [ ] 前端重新部署完成
- [ ] 登录功能测试正常
