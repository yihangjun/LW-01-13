# 第四次作业报告

**姓名：** 王艺晓  
**学号：** 21301167  
**作业名称：** React 商城系统

---

## 1. 组员分工

> 由组长填写，列出每位成员的具体产出与贡献占比。贡献占比总和应为 100%。

| 姓名 | 学号 | 分工与产出 | 贡献占比 |
|------|------|-----------|---------|
| 王艺晓（组长） | 21301167 | 产品设计、UI设计、前台编码、后台编码、测试、文档撰写 | 100% |

**分工说明（参考分类）：** 产品设计、UI 设计、前台编码、后台编码、PPT 制作、测试、文档撰写等。  
**注意：** 非编码工作（产品设计、PPT、文档等）同样计入贡献。

---

## 2. 项目结构

请说明你的项目结构与组件拆分方式：

```
App（根组件，含 <Outlet /> 渲染子路由）
├── HomePage           ← 商城主页面（搜索框、轮播图、热门商品）
├── LoginPage          ← 用户登录/注册页
├── DetailPage         ← 商品详情页
├── CreateOrderPage    ← 创建订单页
├── PayPage            ← 支付页面
├── OrderListPage      ← 订单列表页
├── OrderDetailPage    ← 订单详情页
└── ...                ← 其他页面/组件
```

各页面/组件职责说明：

| 页面/组件 | 职责 |
|-----------|------|
| App | 根组件，包含导航栏和路由出口，根据路由显示不同页面 |
| HomePage | 商城主页面，展示搜索框和热门商品列表，支持加入购物车 |
| LoginPage | 用户登录/注册页，实现表单验证和数据持久化 |
| DetailPage | 商品详情页，展示商品详细信息，支持数量选择和加入购物车/立即购买 |
| CreateOrderPage | 创建订单页，确认商品信息并生成订单 |
| PayPage | 支付页面，模拟支付流程，更新订单状态 |
| OrderListPage | 订单列表页，展示当前用户的所有订单及状态 |
| OrderDetailPage | 订单详情页，展示订单完整信息和操作按钮 |
| CartPage | 购物车页面，管理购物车商品，支持增删改查和结算 |
| UserProfilePage | 个人中心页，查看和编辑用户信息，快捷操作入口 |
| CategoryPage | 分类页面，按分类浏览商品 |
| AdminLoginPage | 后台登录页，管理员身份验证 |
| AdminGoodsPage | 商品管理页，实现商品的增删改查功能 |

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面（搜索框/轮播图/热门商品） | 使用useState管理搜索关键词，实时过滤商品列表；采用Grid布局展示商品卡片，支持悬停效果 |
| 商品详情页 | 通过useParams获取商品ID，从ServiceContext获取商品数据；实现数量选择器和加入购物车/立即购买功能 |
| 购物车 | 创建CartContext管理全局购物车状态，使用localStorage持久化；支持增删改查、选中/全选、计算总价等功能 |
| 创建订单 | 从ServiceContext获取商品和用户信息，调用orderService创建订单，生成唯一订单号 |
| 支付页面 | 模拟支付流程，点击支付按钮后调用orderService.payOrder更新订单状态为已支付 |
| 订单列表 | 通过orderService.getOrdersByUserId获取当前用户订单，展示订单摘要信息和状态 |
| 订单详情 | 展示订单完整信息包括订单号、时间、商品详情、价格等，支持返回订单列表和去支付操作 |
| 用户登录/注册 | 创建userService管理用户数据，支持注册、登录、登出；使用localStorage持久化用户信息和登录状态 |

## 4. 后台管理端功能实现说明

> 商品管理、分类管理、订单管理中至少完成一个完整的管理功能。

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | 独立的AdminLoginPage，验证用户名是否为admin，检查权限后跳转到商品管理页 |
| 权限管理 | 在userService中设置role字段区分user和admin角色；AdminGoodsPage中检查用户权限，非管理员自动跳转 |
| 商品管理 | AdminGoodsPage实现完整的商品CRUD功能：表格展示、添加、编辑、删除；使用goodService的增删改查方法，数据持久化到localStorage |

## 5. 路由设计

请说明前台与后台的路由规划：

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { path: "/", Component: HomePage },
      { path: "/home", Component: HomePage },
      { path: "/login", Component: LoginPage },
      { path: "/cart", Component: CartPage },
      { path: "/profile", Component: UserProfilePage },
      { path: "/category", Component: CategoryPage },
      { path: "/detail/:goodId", Component: DetailPage },
      { path: "/createOrder/:goodId", Component: CreateOrderPage },
      { path: "/pay/:orderId", Component: PayPage },
      { path: "/orderList", Component: OrderListPage },
      { path: "/orderDetail/:orderId", Component: OrderDetailPage },
      // 后台管理路由
      { path: "/admin/login", Component: AdminLoginPage },
      { path: "/admin/goods", Component: AdminGoodsPage },
    ]
  }
]);
```

**路由说明：**
- 前台路由：以 `/` 开头，包含首页、登录、购物车、个人中心、分类、商品详情、订单相关页面
- 后台路由：以 `/admin` 开头，包含后台登录和商品管理页面
- App组件作为Layout，根据路径判断是否显示导航栏（后台页面不显示前台导航）

## 6. 状态管理与数据存储

请说明全局状态的管理方式（Context / Redux 等）以及数据持久化方案：

- **全局状态管理方式：** Context API + Service模式
  - ServiceContext：提供goodService、orderService、userService三个服务实例
  - CartContext：专门管理购物车状态，包括商品列表、数量、选中状态等
  
- **数据存储方式：** localStorage持久化
  - goodList：商品列表数据
  - orderList：订单列表数据
  - userList：用户列表数据
  - currentUser：当前登录用户信息
  - cart：购物车数据
  
- **前后台数据联动方式：** 
  - 前台下单后，订单数据保存到localStorage
  - 后台管理可以访问相同的localStorage数据，实现数据同步
  - 用户登录后，前台和后台共享用户信息

## 7. 加分项完成情况

- [x] **后端联动**：使用localStorage模拟后端API，实现数据持久化和前后台数据共享
- [x] **数据持久化**：刷新页面后购物车、登录状态、商品数据、订单数据均不丢失
- [x] **表单验证**：登录注册时验证用户名和密码必填；注册时验证昵称必填；商品管理时验证名称和价格必填
- [ ] **分页/无限滚动**：未实现（商品数量较少，暂不需要）
- [ ] **支付模拟优化**：未实现支付倒计时/二维码等功能
- [ ] **响应式布局**：使用Grid布局和flexbox，基本适配不同屏幕尺寸
- [ ] **性能优化**：使用了React Hooks进行状态管理，组件合理拆分
- [ ] **单元测试**：未编写单元测试
- [ ] **部署上线**：未部署到线上平台

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 购物车状态管理复杂 | 创建独立的CartContext，使用useState和useEffect结合localStorage实现状态管理和持久化 |
| 前后台路由共用Layout导致导航栏显示问题 | 在App组件中使用useLocation判断当前路径，如果是/admin开头则不显示前台导航栏 |
| 订单和商品数据关联 | 订单中只存储goodId，展示时通过goodService.getGoodById动态获取商品详细信息 |
| 用户登录状态跨页面保持 | 在userService中使用currentUser属性和localStorage保存，每次应用启动时自动加载 |
| 组件间数据传递繁琐 | 使用Context API提供全局服务，避免props层层传递 |
| PowerShell不支持&&命令分隔符 | 改用直接运行命令，或使用分号分隔多个命令 |
