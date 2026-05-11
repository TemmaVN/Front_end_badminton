# Tài liệu Dự án: Badminton Shop Frontend

## Tổng quan dự án

Đây là ứng dụng **web bán cầu lông** (e-commerce) xây dựng bằng React 19, bao gồm:
- **Phía khách hàng**: Duyệt sản phẩm, giỏ hàng, thanh toán, quản lý tài khoản
- **Phía quản trị (Admin)**: Quản lý sản phẩm, đơn hàng, người dùng, analytics

---

## Kiến trúc tổng quan

```mermaid
graph TB
    subgraph Client["🌐 Client - React 19 + Vite"]
        subgraph Contexts["State Management (React Context)"]
            AC[AuthContext]
            CC[CartContext]
            PC[ProductContext]
            UC[UserContext]
            OC[OrderContext]
            CAC[CategoryContext]
        end

        subgraph CustomerPages["Trang Khách Hàng"]
            HP[HomePage]
            PL[Product Listing]
            PD[ProductDetail]
            CP[CartPage - Checkout]
            UI[UserInfo Dashboard]
            MO[MyOrders]
            LR[Login / Register]
        end

        subgraph AdminPages["Trang Admin"]
            DB[Dashboard]
            PM[Product Management]
            OM[Order Management]
            UM[User Management]
            CM[Category & Brand]
            SA[Sales Analytics]
        end
    end

    subgraph Backend["🖥️ Backend - localhost:5106"]
        AUTH["/auth"]
        PROD["/Product"]
        CAT["/Category"]
        BRAND["/Brand"]
        CART["/Cart"]
        ORDER["/Order"]
        USER["/User"]
    end

    AC -->|JWT Token| AUTH
    PC -->|CRUD| PROD
    CAC -->|CRUD| CAT
    CC -->|CRUD| CART
    OC -->|CRUD| ORDER
    UC -->|CRUD| USER

    style Client fill:#fff7ed,stroke:#fb923c
    style Backend fill:#f0fdf4,stroke:#22c55e
```

---

## Cấu trúc thư mục

```mermaid
graph LR
    SRC[src/]
    SRC --> API[api.js]
    SRC --> MAIN[main.jsx]
    SRC --> APP[App.jsx]
    SRC --> CTX[contexts/]
    SRC --> LAY[layouts/]
    SRC --> COMP[components/]
    SRC --> MYSTATE[mystate/]

    CTX --> C1[AuthContext.jsx]
    CTX --> C2[CartContext.jsx]
    CTX --> C3[ProductContext.jsx]
    CTX --> C4[UserContext.jsx]
    CTX --> C5[OrderContext.jsx]
    CTX --> C6[CategoryContext.jsx]

    LAY --> L1[HomePage.jsx]
    LAY --> L2[Product.jsx]
    LAY --> L3[ProductDetail.jsx]
    LAY --> L4[CartPage.jsx]
    LAY --> L5[UserInfo.jsx]
    LAY --> L6[MyOrders.jsx]
    LAY --> L7[Login.jsx]
    LAY --> L8[Register.jsx]
    LAY --> L9[MainHeader.jsx]
    LAY --> L10[Footer.jsx]
    LAY --> ADMIN_L[admin/]

    COMP --> CO1[ProtectedRoute.jsx]
    COMP --> CO2[ProductFrame_Minh.jsx]
    COMP --> CO3[Filter.jsx / PriceFilter.jsx]
    COMP --> CO4[CartDrawer.jsx]
    COMP --> CO5[Advertisement.jsx]
    COMP --> ADMIN_C[admin/]

    ADMIN_C --> A1[Dashboard.jsx]
    ADMIN_C --> A2[ProductList.jsx]
    ADMIN_C --> A3[OrderList.jsx]
    ADMIN_C --> A4[UserList.jsx]
    ADMIN_C --> A5[Categories.jsx]
    ADMIN_C --> A6[Brand.jsx]
    ADMIN_C --> A7[SalesOverview.jsx]
```

---

## Luồng dữ liệu & Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant AC as AuthContext
    participant API as Backend API

    U->>FE: Nhập thông tin đăng nhập
    FE->>API: POST /auth/login
    API-->>FE: JWT Token + User Data
    FE->>AC: Lưu token vào localStorage
    AC-->>FE: isAuthenticated = true, role = Admin/User
    FE->>FE: Redirect dựa theo role

    Note over FE,API: Mọi request sau đó tự động đính kèm Bearer Token

    U->>FE: Gọi API bất kỳ
    FE->>API: Request + Authorization: Bearer {token}
    API-->>FE: Response data
    alt Token hết hạn (401)
        API-->>FE: 401 Unauthorized
        FE->>AC: logout() + xóa localStorage
        FE->>U: Redirect về /login
    end
```

---

## Phân công công việc cho 3 thành viên

```mermaid
mindmap
  root((Badminton Shop))
    Người 1 - Minh
      UI/UX & Customer Pages
        HomePage
        Product Listing
        Product Detail
        Navigation Header
        Footer
        Responsive Design
    Người 2 - Nguyên
      Auth & User Account
        Login Page
        Register Page
        UserInfo Dashboard
        Password Change
        Cart Drawer
        CartPage Checkout
        MyOrders
    Người 3 - Temmavn
      Admin Panel & Backend
        Admin Dashboard
        Product CRUD
        Order Management
        User Management
        Category & Brand
        Sales Analytics
        API Integration
```

---

## Chi tiết công việc từng người

---

### 👤 Người 1 — UI/UX & Customer Pages

```mermaid
gantt
    title Người 1 - UI/UX & Customer Pages
    dateFormat  YYYY-MM-DD
    section Layout & Navigation
    MainHeader.jsx          :a1, 2025-01-01, 3d
    PageHeader.jsx mobile   :a2, after a1, 2d
    MenuHeader.jsx          :a3, after a2, 2d
    Footer.jsx              :a4, after a1, 2d

    section Trang chính
    HomePage.jsx            :b1, 2025-01-01, 4d
    Advertisement.jsx       :b2, after b1, 2d
    CategoryShowcase.jsx    :b3, after b2, 3d

    section Product
    Product.jsx listing     :c1, 2025-01-06, 4d
    Filter.jsx & PriceFilter:c2, after c1, 3d
    DrawerFilter mobile     :c3, after c2, 2d
    ProductDetail.jsx       :d1, after c1, 5d
    ProductFrame_Minh.jsx   :d2, after d1, 2d
    SearchDropDown.jsx      :d3, after d2, 2d
```

**File phụ trách:**
```mermaid
graph TD
    P1[👤 Người 1]
    P1 --> L1[layouts/HomePage.jsx]
    P1 --> L2[layouts/Product.jsx]
    P1 --> L3[layouts/ProductDetail.jsx]
    P1 --> L4[layouts/MainHeader.jsx]
    P1 --> L5[layouts/PageHeader.jsx]
    P1 --> L6[layouts/MenuHeader.jsx]
    P1 --> L7[layouts/Footer.jsx]
    P1 --> C1[components/Advertisement.jsx]
    P1 --> C2[components/CategoryShowcase.jsx]
    P1 --> C3[components/ProductFrame_Minh.jsx]
    P1 --> C4[components/Filter.jsx]
    P1 --> C5[components/PriceFilter.jsx]
    P1 --> C6[components/DrawerFilter.jsx]
    P1 --> C7[components/SearchDropDown.jsx]
    P1 --> C8[components/ProductCategory.jsx]
    P1 --> CTX[contexts/ProductContext.jsx - đọc dữ liệu]

    style P1 fill:#3b82f6,color:#fff
    style CTX fill:#fef9c3,stroke:#ca8a04
```

**Nhiệm vụ cụ thể:**

| STT | Công việc | File | Mô tả |
|-----|-----------|------|-------|
| 1 | Header điều hướng | `layouts/MainHeader.jsx` | Logo, search bar, cart icon, user menu |
| 2 | Header mobile | `layouts/PageHeader.jsx` | Hamburger menu, responsive nav |
| 3 | Trang chủ | `layouts/HomePage.jsx` | Banner carousel, category showcase, animation |
| 4 | Banner quảng cáo | `components/Advertisement.jsx` | Swiper carousel |
| 5 | Danh sách sản phẩm | `layouts/Product.jsx` | Grid sản phẩm, phân trang |
| 6 | Bộ lọc giá | `components/PriceFilter.jsx` | Slider lọc giá (Radix UI) |
| 7 | Drawer filter mobile | `components/DrawerFilter.jsx` | Bộ lọc trên điện thoại |
| 8 | Chi tiết sản phẩm | `layouts/ProductDetail.jsx` | Gallery ảnh, chọn variant, tabs |
| 9 | Card sản phẩm | `components/ProductFrame_Minh.jsx` | Hiển thị card trong danh sách |
| 10 | Search dropdown | `components/SearchDropDown.jsx` | Gợi ý tìm kiếm realtime |
| 11 | Footer | `layouts/Footer.jsx` | Links, contact info |
| 12 | Responsive design | Toàn bộ component phụ trách | Kiểm tra trên mobile/tablet |

---

### 👤 Người 2 — Authentication & User Account

```mermaid
graph TD
    P2[👤 Người 2]

    subgraph AUTH["🔐 Authentication"]
        LG[layouts/Login.jsx]
        RG[layouts/Register.jsx]
        AC[contexts/AuthContext.jsx]
        PR[components/ProtectedRoute.jsx]
    end

    subgraph USER["👤 User Account"]
        UI[layouts/UserInfo.jsx]
        INFO[components/Information.jsx]
        CP[components/ChangePass.jsx]
        ORD[components/Orders.jsx]
        MO[layouts/MyOrders.jsx]
        UC[contexts/UserContext.jsx]
        OC[contexts/OrderContext.jsx]
    end

    subgraph CART["🛒 Cart & Checkout"]
        CD[layouts/CartDrawer.jsx]
        CART_P[layouts/CartPage.jsx]
        CC[contexts/CartContext.jsx]
    end

    P2 --> AUTH
    P2 --> USER
    P2 --> CART

    style P2 fill:#22c55e,color:#fff
    style AUTH fill:#fce7f3,stroke:#ec4899
    style USER fill:#e0f2fe,stroke:#0284c7
    style CART fill:#fef3c7,stroke:#d97706
```

**Nhiệm vụ cụ thể:**

| STT | Công việc | File | Mô tả |
|-----|-----------|------|-------|
| 1 | Trang đăng nhập | `layouts/Login.jsx` | Form login, validation |
| 2 | Trang đăng ký | `layouts/Register.jsx` | Form đăng ký, validation |
| 3 | Context xác thực | `contexts/AuthContext.jsx` | JWT, login/logout, role check |
| 4 | Route bảo vệ | `components/ProtectedRoute.jsx` | Guard auth + admin-only |
| 5 | Dashboard tài khoản | `layouts/UserInfo.jsx` | Tab profile / password / orders |
| 6 | Form thông tin cá nhân | `components/Information.jsx` | Chỉnh sửa tên, SĐT, địa chỉ |
| 7 | Đổi mật khẩu | `components/ChangePass.jsx` | Form đổi pass với validation |
| 8 | Context user | `contexts/UserContext.jsx` | Fetch/update profile |
| 9 | Lịch sử đơn hàng | `layouts/MyOrders.jsx` + `components/Orders.jsx` | Danh sách orders, badge status |
| 10 | Context đơn hàng | `contexts/OrderContext.jsx` | Fetch orders, cancel order |
| 11 | Giỏ hàng (drawer) | `layouts/CartDrawer.jsx` | Sidebar cart, cập nhật số lượng |
| 12 | Trang thanh toán | `layouts/CartPage.jsx` | 2 bước: địa chỉ → thanh toán |
| 13 | Context giỏ hàng | `contexts/CartContext.jsx` | Add/update/delete cart items |
| 14 | Input components | `components/MyInput.jsx` `MyCheckBox.jsx` `MyRadio.jsx` | UI controls tái sử dụng |

**Luồng thanh toán (CartPage):**
```mermaid
stateDiagram-v2
    [*] --> BuocMotDiaChi: Vào /cart
    BuocMotDiaChi: Bước 1 - Nhập địa chỉ giao hàng
    BuocMotDiaChi --> XacNhanDiaChi: Điền đủ thông tin
    XacNhanDiaChi --> BuocHaiThanhToan: Tiếp tục
    BuocHaiThanhToan: Bước 2 - Chọn phương thức thanh toán
    BuocHaiThanhToan --> DatHang: COD / Chuyển khoản / MoMo / ZaloPay
    DatHang --> ThanhCong: POST /Order
    ThanhCong --> [*]: Redirect về trang chủ
```

---

### 👤 Người 3 — Admin Panel & API Integration

```mermaid
graph TD
    P3[👤 Người 3]

    subgraph API["⚙️ API Layer"]
        APIJS[src/api.js]
        CONST[src/constants.js]
    end

    subgraph ADMIN_LAYOUT["🏗️ Admin Layout"]
        ADMIN[layouts/Admin.jsx]
        SIDEBAR[layouts/admin/Sidebar.jsx]
        HEADER[layouts/admin/Header.jsx]
        ADMININFO[components/admin/AdminInfo.jsx]
    end

    subgraph DASHBOARD["📊 Dashboard"]
        DB[components/admin/Dashboard.jsx]
        STATS[components/admin/StatsGrid.jsx]
        REV[components/admin/RevenueChart.jsx]
        SC[components/admin/SalesChart.jsx]
        AF[components/admin/ActivityFeed.jsx]
        TS[components/admin/TableSection.jsx]
        SO[components/admin/SalesOverview.jsx]
    end

    subgraph PRODUCTS["📦 Product Management"]
        PL[components/admin/ProductList.jsx]
        APD[components/admin/AdminProductDetail.jsx]
        CAT[components/admin/Categories.jsx]
        BR[components/admin/Brand.jsx]
        CAT_CTX[contexts/CategoryContext.jsx]
    end

    subgraph ORDERS["🛍️ Order Management"]
        OL[components/admin/OrderList.jsx]
        OD[components/admin/OrderDetail.jsx]
    end

    subgraph USERS["👥 User Management"]
        UL[components/admin/UserList.jsx]
        PAR[components/admin/PermissionsAndRoles.jsx]
    end

    subgraph SETTINGS["⚙️ Settings"]
        PAY[components/admin/Payment.jsx]
        SYS[components/admin/System.jsx]
        CAT2[components/admin/Catalog.jsx]
    end

    P3 --> API
    P3 --> ADMIN_LAYOUT
    P3 --> DASHBOARD
    P3 --> PRODUCTS
    P3 --> ORDERS
    P3 --> USERS
    P3 --> SETTINGS

    style P3 fill:#f59e0b,color:#fff
    style API fill:#f1f5f9,stroke:#64748b
    style DASHBOARD fill:#f0fdf4,stroke:#22c55e
    style PRODUCTS fill:#eff6ff,stroke:#3b82f6
    style ORDERS fill:#fdf4ff,stroke:#a855f7
    style USERS fill:#fff7ed,stroke:#f97316
```

**Nhiệm vụ cụ thể:**

| STT | Công việc | File | Mô tả |
|-----|-----------|------|-------|
| 1 | Cấu hình Axios | `src/api.js` | Interceptor JWT, xử lý lỗi 401 |
| 2 | Layout admin | `layouts/Admin.jsx` | Wrapper layout cho toàn admin |
| 3 | Sidebar điều hướng | `layouts/admin/Sidebar.jsx` | Menu điều hướng admin |
| 4 | Dashboard tổng quan | `components/admin/Dashboard.jsx` | Gọi các widget con |
| 5 | Lưới thống kê | `components/admin/StatsGrid.jsx` | KPI cards (đơn hàng, doanh thu...) |
| 6 | Biểu đồ doanh thu | `components/admin/RevenueChart.jsx` | Recharts line/bar chart |
| 7 | Biểu đồ bán hàng | `components/admin/SalesChart.jsx` | Sales metrics graph |
| 8 | Nhật ký hoạt động | `components/admin/ActivityFeed.jsx` | Recent activity log |
| 9 | Bảng đơn hàng gần đây | `components/admin/TableSection.jsx` | Recent orders widget |
| 10 | Tổng quan bán hàng | `components/admin/SalesOverview.jsx` | Analytics page |
| 11 | Danh sách sản phẩm | `components/admin/ProductList.jsx` | Bảng CRUD sản phẩm |
| 12 | Chỉnh sửa sản phẩm | `components/admin/AdminProductDetail.jsx` | Form tạo/sửa sản phẩm, variants |
| 13 | Quản lý danh mục | `components/admin/Categories.jsx` | CRUD categories |
| 14 | Context danh mục | `contexts/CategoryContext.jsx` | State cho categories |
| 15 | Quản lý thương hiệu | `components/admin/Brand.jsx` | CRUD brands |
| 16 | Danh sách đơn hàng | `components/admin/OrderList.jsx` | Bảng orders, lọc theo status |
| 17 | Chi tiết đơn hàng | `components/admin/OrderDetail.jsx` | Xem + cập nhật trạng thái |
| 18 | Danh sách người dùng | `components/admin/UserList.jsx` | Quản lý accounts |
| 19 | Phân quyền | `components/admin/PermissionsAndRoles.jsx` | Role management |
| 20 | Cấu hình thanh toán | `components/admin/Payment.jsx` | Cài đặt phương thức thanh toán |

---

## Luồng routing toàn ứng dụng

```mermaid
graph TD
    START((Người dùng truy cập)) --> APP[App.jsx]
    
    APP --> PUB{Public Routes}
    APP --> PROT{ProtectedRoute}
    APP --> ADMIN_R{Admin Routes}

    PUB --> HOME["/ : HomePage"]
    PUB --> LOGIN["/login : Login"]
    PUB --> REG["/register : Register"]
    PUB --> CONTRACT["/contract : Contract"]
    PUB --> SALES_P["/sales : Sales"]
    PUB --> CAT_ROUTE["/:categorySlug : Product List"]
    PUB --> PROD_ROUTE["/p/:productSlug : ProductDetail"]

    PROT -->|isAuthenticated| CART_R["/cart : CartPage"]
    PROT -->|isAuthenticated| USER_R["/user-info : UserInfo"]
    PROT -->|NOT authenticated| REDIR_LOGIN["Redirect /login"]

    ADMIN_R -->|isAdmin| DB_R["/admin/dashboard"]
    ADMIN_R -->|isAdmin| PROD_ADM["/admin/product"]
    ADMIN_R -->|isAdmin| CAT_ADM["/admin/categories"]
    ADMIN_R -->|isAdmin| BRAND_ADM["/admin/brands"]
    ADMIN_R -->|isAdmin| ORDER_ADM["/admin/orders"]
    ADMIN_R -->|isAdmin| USER_ADM["/admin/users-list"]
    ADMIN_R -->|isAdmin| SO_ADM["/admin/sales-overview"]
    ADMIN_R -->|NOT admin| REDIR_HOME["Redirect /"]

    style START fill:#6366f1,color:#fff
    style REDIR_LOGIN fill:#ef4444,color:#fff
    style REDIR_HOME fill:#ef4444,color:#fff
```

---

## API Endpoints theo nhóm

```mermaid
graph LR
    subgraph AUTH_EP["🔐 Auth Endpoints"]
        A1[POST /auth/login]
        A2[POST /auth/register]
    end

    subgraph PROD_EP["📦 Product Endpoints"]
        P1[GET /Product/home]
        P2[GET /Product/searchAsync]
        P3[GET /Product/getDetailBySlug/:slug]
        P4[POST /Product/add]
        P5[PUT /Product/update/:id]
        P6[DELETE /Product/:id]
    end

    subgraph CART_EP["🛒 Cart Endpoints"]
        C1[GET /Cart/my-cart]
        C2[POST /Cart/add-to-cart]
        C3[PUT /Cart/update]
        C4[DELETE /Cart/:itemId]
    end

    subgraph ORDER_EP["🛍️ Order Endpoints"]
        O1[GET /Order/my-orders]
        O2[GET /Order/all-orders]
        O3[POST /Order]
        O4[PUT /Order/updateStatus]
        O5[PUT /Order/cancel/:id]
    end

    subgraph USER_EP["👤 User Endpoints"]
        U1[GET /User/user-info]
        U2[GET /User/getAll]
        U3[PUT /User/profile]
        U4[PUT /User/change-password]
    end

    subgraph CAT_EP["🏷️ Category & Brand"]
        CA1[GET /Category]
        CA2[POST /Category]
        CA3[PUT /Category/:id]
        CA4[DELETE /Category/:id]
        B1[GET /Brand]
        B2[POST /Brand]
    end

    P1_RESP[👤 Người 1 - đọc] --> PROD_EP
    P2_RESP[👤 Người 2 - đọc/ghi] --> CART_EP
    P2_RESP --> ORDER_EP
    P2_RESP --> AUTH_EP
    P2_RESP --> USER_EP
    P3_RESP[👤 Người 3 - quản lý] --> PROD_EP
    P3_RESP --> ORDER_EP
    P3_RESP --> USER_EP
    P3_RESP --> CAT_EP
```

---

## Tóm tắt phân công

```mermaid
pie title Phân chia số lượng file theo người
    "Người 1 - UI/UX & Customer" : 14
    "Người 2 - Auth & Account" : 14
    "Người 3 - Admin & API" : 22
```

```mermaid
graph TB
    subgraph P1_SUMMARY["👤 Người 1 - UI/UX & Customer Pages"]
        direction LR
        S1A["📄 14 files"]
        S1B["🎯 Trọng tâm: Hiển thị & trải nghiệm người dùng"]
        S1C["🛠️ Stack: Tailwind, Framer Motion, Swiper, Radix UI"]
    end

    subgraph P2_SUMMARY["👤 Người 2 - Auth & User Account"]
        direction LR
        S2A["📄 14 files"]
        S2B["🎯 Trọng tâm: Xác thực & luồng mua hàng"]
        S2C["🛠️ Stack: JWT, Context API, React Router guards"]
    end

    subgraph P3_SUMMARY["👤 Người 3 - Admin Panel & API"]
        direction LR
        S3A["📄 22 files"]
        S3B["🎯 Trọng tâm: CRUD quản trị & tích hợp backend"]
        S3C["🛠️ Stack: Recharts, Axios interceptors, admin CRUD"]
    end

    style P1_SUMMARY fill:#dbeafe,stroke:#3b82f6
    style P2_SUMMARY fill:#dcfce7,stroke:#22c55e
    style P3_SUMMARY fill:#fef3c7,stroke:#f59e0b
```

---

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| React | 19.2.0 | UI Framework |
| React Router DOM | 7.14.0 | Client-side routing |
| Axios | 1.15.0 | HTTP client + JWT interceptor |
| Tailwind CSS | 4.2.1 | Utility-first styling |
| DaisyUI | 5.5.19 | Component library |
| Framer Motion | 12.35.1 | Animations |
| Recharts | 3.8.1 | Charts & graphs |
| Swiper | 12.1.2 | Carousel/slider |
| jwt-decode | 4.0.0 | Parse JWT tokens |
| Lucide React | 0.577.0 | Icons |
| Radix UI Slider | 1.3.6 | Price range slider |
| Vite | 7.3.1 | Build tool |

---

*Tài liệu tạo ngày 2026-05-11*
