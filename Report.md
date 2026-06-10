# 第四次作业报告

**姓名：** 周一航  
**学号：** 23301174  
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
App（根组件，含 Outlet + 底部 TabBar）
├── HomePage              ← 商城主页面（搜索、轮播、热门商品、品牌区）
├── CategoryPage          ← 分类页（左侧分类 + 右侧子分类）
├── CartPage              ← 购物车
├── MyPage                ← 我的页面
├── LoginPage / RegisterPage ← 用户登录注册
├── DetailPage            ← 商品详情
├── CreateOrderPage       ← 确认订单
├── PayPage / PaySuccessPage ← 支付与支付成功
├── OrderListPage         ← 订单列表
├── OrderDetailPage       ← 订单详情
└── admin/*               ← 后台管理（独立布局）

components/  SearchBar, Carousel, ProductCard, TabBar
contexts/    UserContext, ServiceContext
services/    good, order, cart, category, admin
mock/        banners, categories, addresses
```

| 页面/组件 | 职责 |
|-----------|------|
| App | 前台布局容器，控制 TabBar 显示 |
| HomePage | 搜索、轮播、快捷入口、品牌区、热门商品分页加载 |
| LoginPage | 用户登录、体验账号、跳转注册 |
| DetailPage | 商品展示、加购、立即购买 |
| CartPage | 购物车增删改、全选、结算 |
| CreateOrderPage | 确认地址与商品清单、提交订单 |
| PayPage | 支付方式选择、倒计时、模拟二维码支付 |
| OrderListPage | 用户订单列表 |
| OrderDetailPage | 订单状态、物流、商品信息 |
| AdminLayout | 后台侧边栏、权限菜单 |
| AdminGoodsPage | 商品 CRUD、上下架开关 |
| AdminOrdersPage | 订单列表、发货操作 |

---

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面（搜索框/轮播图/热门商品） | `HomePage` + `SearchBar`/`Carousel`/`ProductCard`；`goodService.searchGoods` 与分页加载 |
| 分类页 | `CategoryPage` 左侧 `categoryService` 主分类，右侧子分类网格 |
| 购物车 | `cartService` + `CartPage`；localStorage 持久化 |
| 商品详情页 | `DetailPage` 展示规格价格，登录后可加购/购买 |
| 创建订单 | `CreateOrderPage` 支持单品与购物车两种入口 |
| 支付页面 | `PayPage` 模拟支付宝/微信，60s 倒计时 + 二维码动画 |
| 订单列表 | `OrderListPage` 按用户账号过滤 |
| 订单详情 | `OrderDetailPage` 展示状态、地址、物流说明 |
| 用户登录/注册 | `UserContext` + localStorage；表单校验 |

---

## 4. 后台管理端功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | `/admin/login`；账号 admin/admin123、operator/123456 |
| 权限管理 | `adminService` 角色权限：admin 全模块，operator 仅订单 |
| 商品管理 | `AdminGoodsPage` 增删改查、上架/新品开关 |
| 分类管理 | `AdminCategoriesPage` 分类 CRUD |
| 订单管理 | `AdminOrdersPage` 列表筛选、发货、删除 |

---

## 5. 路由设计

```jsx
// 前台（App 布局 + TabBar）
/  /category  /cart  /my
/login  /register  /detail/:goodId
/create-order/:goodId  /pay/:orderId  /pay-success/:orderId
/order-list  /order-detail/:orderId

// 后台（AdminLayout）
/admin/login
/admin/goods  /admin/categories  /admin/orders
```

路由使用 `React.lazy` 懒加载，非 Tab 页面隐藏底部导航。

---

## 6. 状态管理与数据存储

- **全局状态管理方式：** Context + Service 模式（`UserContext` 用户态，`ServiceContext` 注入各 Service）
- **数据存储方式：** localStorage（goodList、orderList、cartList、categoryList、mall_user、mall_admin）
- **前后台数据联动方式：** 后台修改商品写入 `goodList`，前台 `goodService` 读取同一份 localStorage；订单创建后后台 `orderService` 可见

---

## 7. 加分项完成情况

- [x] **数据持久化**：购物车、登录态、商品/订单/分类均 localStorage 持久化
- [x] **表单验证**：登录/注册用户名、密码长度校验并提示
- [x] **分页/无限滚动**：首页热门商品「加载更多」
- [x] **支付模拟优化**：60 秒倒计时 + 模拟二维码 + 不跳转真实支付
- [x] **响应式布局**：手机底部 Tab；平板 720px 内容区；电脑顶部导航 + 1200px 宽屏四列商品网格（非单纯拉伸）
- [x] **性能优化**：路由 `React.lazy` 懒加载、`ProductCard` 使用 `memo`
- [ ] **后端联动**：未接真实 API，使用 localStorage 模拟（作业允许）
- [ ] **单元测试**：时间关系未添加 Vitest
- [ ] **部署上线**：可部署至 Vercel，链接待补充

---

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 直接打开 index.html 白屏 | 使用 `npm run dev` 启动 Vite 开发服务器 |
| Gerrit push 报 no new changes | 先添加代码并 commit，再 push 到 refs/for/master |
| 旧版 order 数据结构不兼容 | orderService 增加 `_migrateLegacyOrders` 迁移 |
| 首页无商品（旧 localStorage 缺 isHot） | `goodListVersion` 版本号 + `initAppData` 自动修复数据 |
| 体验账号不明确 | 默认账号 member/123456，点击「获取体验账号」填入并自动登录 |
