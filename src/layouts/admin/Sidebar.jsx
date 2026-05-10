import {
  Users,
  Package,
  ShoppingBag,
  LayoutDashboard,
  Settings,
  Zap,
  ChevronDown,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const menuItems = [
  {
    id: "TongQuan",
    icon: LayoutDashboard,
    label: "Tổng quan",
    path: "dashboard",
  },
  {
    id: "DanhMuc",
    icon: Package,
    label: "Danh mục",
    path: "catalog",
    submenu: [
      { id: "san-pham", label: "Sản phẩm", path: "product" },
      { id: "danh-muc-sp", label: "Danh mục sản phẩm", path: "categories" },
      { id: "thuong-hieu", label: "Thương hiệu", path: "brands" },
    ],
  },
  {
    id: "BanHang",
    icon: ShoppingBag,
    label: "Bán hàng",
    path: "sales-overview",
    submenu: [
      { id: "don-hang", label: "Đơn hàng", path: "orders" },
      { id: "thanh-toan", label: "Thanh toán", path: "payment" },
    ],
  },
  {
    id: "KhachHang",
    icon: Users,
    label: "Khách hàng",
    count: "1,2k",
    path: "users-list",
  },
  {
    id: "HeThong",
    icon: Settings,
    label: "Hệ thống",
    submenu: [
      { id: "quan-tri-vien", label: "Quản trị viên", path: "admin-info" },
      { id: "vai-tro", label: "Vai trò & Quyền hạn", path: "roles" },
    ],
  },
];

const Sidebar = ({ sideBarCollapsed, onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem('user')) ?? {};
  const [fullName, setFullName] = useState(user.fullName ?? '');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split("/").pop();

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user')) ?? {};
    setFullName(stored.fullName ?? '');
  }, []);

  return (
    <div
      className={`${sideBarCollapsed ? "w-20" : "w-72"} transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
      backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}
    >
      {/* Logo & Thông tin người dùng */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-linear-to-r from-orange-default to-orange-dark rounded-xl
              flex items-center justify-center shadow-lg"
          >
            <Zap className="w-6 h-6 text-white" />
          </div>

          {!sideBarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                {fullName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bảng điều khiển
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Điều hướng */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              className={`w-full flex items-center justify-between p-3
                rounded-xl transition-all duration-200 ${
                  currentPath === item.path ||
                  (item.submenu &&
                    item.submenu.some((sub) => sub.path === currentPath))
                    ? "bg-linear-to-r from-orange-default to-orange-dark text-white shadow-lg shadow-orange-default/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              onClick={() => {
                if (item.submenu) {
                  toggleExpanded(item.id);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <>
                  {!sideBarCollapsed && (
                    <span className="font-medium ml-2">{item.label}</span>
                  )}
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              </div>

              {!sideBarCollapsed && item.submenu && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedItems.has(item.id) ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {!sideBarCollapsed &&
              item.submenu &&
              expandedItems.has(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      className={`w-full text-sm text-left p-2 rounded-lg transition-all ${
                        currentPath === subItem.path
                          ? "text-orange-500 font-bold bg-orange-50 dark:bg-orange-500/10"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                      onClick={() => {
                        if (subItem.path) navigate(subItem.path);
                      }}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>

      {/* Hồ sơ người dùng */}
    </div>
  );
};

export default Sidebar;