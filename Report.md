# 第四次作业报告

**姓名：** 小明  
**学号：** 23300000  
**作业名称：** React 商城系统

---

## 1. 组员分工

| 姓名 | 学号 | 分工与产出 | 贡献占比 |
|------|------|-----------|---------|
| 周一航 | 23301174 |  |  |
| 罗督星 | 23301159 |  |  |
| 张喆 | 23301170 |  |  |
| 周锐 | 23301173 |  |  |
| 王艺晓 | 21301167 |  |  |

**分工说明：** 代码统一通过 Gerrit 评审合入。

---

## 2. 项目结构

```
项目根目录/
├── server/                 ← Node.js + Express 后端 API
│   ├── index.js
│   ├── routes/             ← 商品、订单、用户、购物车、后台接口
│   ├── lib/db.js           ← db.json 读写
│   └── data/db.json        ← 持久化数据
├── src/
│   ├── App.jsx             ← 前台布局（Header + Footer）
│   ├── router.jsx          ← 前台/后台路由
│   ├── pages/              ← 商城页面、登录注册、后台管理
│   ├── components/         ← Header、Footer、ProductGrid、Toast 等
│   ├── contexts/           ← UserContext、ServiceContext、CartContext
│   ├── services/           ← 对接 /api 的业务服务
│   └── utils/api.js        ← 统一 HTTP 请求
└── tool/                   ← check.cjs、pack.cjs
```

| 页面/组件 | 职责 |
|-----------|------|
| App | 商城布局容器；登录/注册/后台路径不显示 Header/Footer |
| Header / Footer | 宽屏顶部导航与页脚 |
| HomePage | 搜索、轮播、热门商品、分类入口 |
| CategoryPage | 分类侧栏 + 商品列表 |
| DetailPage | 商品详情、加购、立即购买 |
| CartPage | 购物车勾选、改数量、结算 |
| UserPage | 个人资料编辑、订单入口、后台管理入口 |
| LoginPage / RegisterPage | 前台登录注册与表单校验 |
| CreateOrderPage | 确认地址与商品清单、提交订单 |
| PayPage | 收银台、支付倒计时、模拟扫码支付 |
| OrderListPage / OrderDetailPage | 订单列表与详情、分页 |
| AdminLayout | 后台侧边栏与权限菜单 |
| AdminGoodsPage | 商品 CRUD、上下架与标签开关 |
| AdminCategoriesPage | 分类与子分类管理 |
| AdminOrdersPage | 订单筛选、发货、删除 |
| AdminRolesPage | 角色权限矩阵与后台用户管理 |

---

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面 | `HomePage` + `SearchBar`/`Carousel`/`ProductGrid`；`goodService` 从 API 拉取商品 |
| 分类页 | `CategoryPage` + `categoryService`；支持分类筛选与搜索参数 |
| 购物车 | `CartContext` + `cartService`；登录用户购物车同步至 `/api/carts` |
| 商品详情 | `DetailPage`；`useParams` 取商品 ID，支持加购与跳转下单 |
| 创建订单 | `CreateOrderPage`；支持单品与购物车结算，调用 `orderService.createOrder` |
| 支付页面 | `PayPage`；15 分钟倒计时、模拟二维码、调用 `payOrder` |
| 订单列表 | `OrderListPage`；按用户账号过滤，带状态筛选与分页 |
| 订单详情 | `OrderDetailPage`；展示状态流转、地址、商品明细 |
| 用户登录/注册 | `UserContext` + `/api/users/login`、`/register`；会话缓存于 `mall_user` |

---

## 4. 后台管理端功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | `/admin/login`；`adminService` 校验 `admin/admin123`、`operator/123456` |
| 权限管理 | `adminService` RBAC；`AdminRolesPage` 配置角色权限矩阵 |
| 商品管理 | `AdminGoodsPage` 增删改查、筛选、Modal 表单 |
| 分类管理 | `AdminCategoriesPage` 分类与子分类编辑、批量保存 |
| 订单管理 | `AdminOrdersPage` 列表筛选、发货、详情、删除 |

---

## 5. 路由设计

```jsx
// 前台（App 布局）
/  /category  /category/:categoryId  /cart  /user
/login  /register  /forgot-password  /detail/:goodId
/create-order  /create-order/:goodId  /pay/:orderId
/order-list  /order-detail/:orderId

// 后台（AdminLayout）
/admin/login
/admin/goods  /admin/categories  /admin/orders  /admin/roles
```

路由使用 `React.lazy` 懒加载；需登录页面通过 `ProtectedRoute` 守卫。旧 camelCase 路径（如 `/orderList`）重定向至 kebab-case。

**启动方式：**

```bash
npm run dev:all    # 同时启动前端与后端
# 或分别执行 npm run server（3001）与 npm run dev（5173）
```

---

## 6. 状态管理与数据存储

- **全局状态：** `UserContext`（前台用户）、`ServiceContext`（注入各 Service）、`CartContext`（购物车 UI 状态）、`ToastProvider`（全局提示）
- **后端持久化：** `server/data/db.json` 存储商品、订单、分类、用户、购物车、后台角色与用户
- **浏览器缓存：** `mall_user`（前台会话）、`mall_admin`（后台会话）、`cartList`（未登录购物车）、`checkoutItems`（结算临时数据）
- **前后台联动：** 前台与后台均通过 `/api/*` 读写同一份 `db.json`，后台改商品后前台刷新即可看到

---

## 7. 加分项完成情况

- [x] **后端联动**：Node.js + Express REST API，Vite 代理 `/api` 至 `localhost:3001`
- [x] **数据持久化**：`db.json` 持久化业务数据；登录态与购物车辅以 localStorage
- [x] **表单验证**：登录/注册、后台商品与分类表单校验并提示
- [x] **分页**：订单列表 `Pagination` 组件分页展示
- [x] **支付模拟优化**：支付倒计时、模拟二维码、超时自动取消
- [x] **响应式布局**：Header 移动端适配；商城 Grid 布局适配不同宽度
- [x] **性能优化**：路由 `React.lazy` 懒加载、`ProductCard` 使用 `memo`
- [ ] **单元测试**：未编写 Vitest 测试
- [ ] **部署上线**：未部署至 Vercel/Netlify，链接待补充

---

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 前端无法访问后端 | 配置 `vite.config.js` 代理 `/api`，使用 `npm run dev:all` 同时启动 |
| 未启动后端时白屏 | `ServiceContext` 检测 `/api/health`，提示运行 `npm run server` |
| 购物车登录前后不一致 | `cartService` 合并本地 `cartList` 与服务器购物车后清空本地缓存 |
| 后台权限勾选不生效 | `AdminRolesPage` 改为本地编辑后统一保存，避免即时写入异常 |
| 订单与商品展示分离 | 订单仅存 `goodId`，展示时通过 `goodService.getGoodById` 补全商品信息 |
| Gerrit 合入冲突 | `git rebase origin/master` 后重新 push 至 `refs/for/master` |
