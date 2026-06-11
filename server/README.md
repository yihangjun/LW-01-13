# 商城后端 API

基于 Node.js + Express 的 REST API，数据持久化到 `server/data/db.json`。

前端已通过 `src/services/` 完成对接，页面组件通过 `ServiceContext` 使用各 Service，无需直接调用 `fetch`。

## 启动

```bash
npm run server
# 或与前端一起启动
npm run dev:all
```

服务默认运行在 `http://localhost:3001`，Vite 开发服务器通过代理将 `/api` 转发到后端。

## 接口一览

| 模块 | 路径 | 说明 |
|------|------|------|
| 健康检查 | `GET /api/health` | 服务状态 |
| 商品 | `GET/POST /api/goods` | 列表、新增 |
| 商品 | `GET /api/goods/hot` | 热门商品 |
| 商品 | `GET /api/goods/search?q=` | 搜索 |
| 商品 | `GET /api/goods/paged` | 分页热门商品 |
| 商品 | `GET /api/goods/category/:categoryId` | 按分类查询 |
| 商品 | `GET/PUT/DELETE /api/goods/:id` | 详情、更新、删除 |
| 商品 | `PATCH /api/goods/:id/toggle/:field` | 切换上下架等字段 |
| 分类 | `GET/PUT /api/categories` | 查询、批量更新 |
| 订单 | `GET/POST /api/orders` | 列表、创建 |
| 订单 | `GET /api/orders/:id` | 订单详情 |
| 订单 | `GET /api/orders/user/:userAccount` | 用户订单 |
| 订单 | `PATCH /api/orders/:id/pay\|ship\|complete\|cancel\|close` | 状态变更 |
| 订单 | `DELETE /api/orders/:id` | 删除订单 |
| 用户 | `POST /api/users/login` | 前台登录 |
| 用户 | `POST /api/users/register` | 注册 |
| 用户 | `PUT /api/users/:username` | 更新用户信息 |
| 购物车 | `GET/PUT /api/carts/:userAccount` | 查询、保存购物车 |
| 后台 | `POST /api/admin/login` | 管理员登录 |
| 后台 | `GET /api/admin/modules` | 可管理模块列表 |
| 后台 | `GET /api/admin/roles` | 角色列表 |
| 后台 | `PUT /api/admin/roles/:roleId/permissions` | 更新角色权限 |
| 后台 | `GET/POST/PUT/DELETE /api/admin/users` | 后台用户管理 |

## 响应格式

成功：

```json
{ "ok": true, "data": { ... } }
```

失败：

```json
{ "ok": false, "message": "错误说明" }
```

HTTP 状态码：400 参数错误、401 认证失败、404 不存在、409 冲突、500 服务器错误。

## 默认账号

- 前台体验账号：`member` / `123456`
- 后台管理员：`admin` / `admin123`
- 后台运营：`operator` / `123456`

## 数据持久化

- 数据文件：`server/data/db.json`（首次启动自动从 `seed.js` 生成）
- 商品数据版本号 `GOODS_VERSION` 变更时，自动合并升级种子数据并保留已有订单与用户
- 购物车按用户账号存储在 `carts` 字段中
