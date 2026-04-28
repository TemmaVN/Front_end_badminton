import { NavLink } from 'react-router-dom'; // Thêm import này
import { 
    Users, Package, ShoppingBag, LayoutDashboard, 
    Settings, Zap, ChevronDown 
} from 'lucide-react';
import React, { useState } from 'react';

const menuItems = [
    {
        id: "dashboard", // Nên để lowercase cho đồng bộ URL
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin/dashboard" // Thêm path cụ thể
    },
    {
        id: "catalog",
        icon: Package,
        label: "Catalog",
        submenu: [
            { id: "products", label: "Products", path: "/admin/products" },
            { id: "categories", label: "Categories", path: "/admin/categories" },
            { id: "brands", label: "Brands", path: "/admin/brands" },
        ]
    },
    {
        id: "sales",
        icon: ShoppingBag,
        label: "Sales",
        submenu: [
            { id: "orders", label: "Orders", path: "/admin/orders" },
            { id: "sales-overview", label: "Overview", path: "/admin/sales-overview" }
        ]
    },
    // ... các item khác thêm path tương tự
];

const Sidebar = ({ collapsed }) => { // Bỏ setCurrentPage và currentPage props
    const [expandedItems, setExpandedItems] = useState(new Set());

    const toggleExpanded = (e, itemid) => {
        e.preventDefault(); // Chặn chuyển trang khi chỉ muốn đóng/mở submenu
        setExpandedItems((prev) => {
            const newExpanded = new Set(prev);
            newExpanded.has(itemid) ? newExpanded.delete(itemid) : newExpanded.add(itemid);
            return newExpanded;
        });
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-72'} transition-all duration-300 ...`}>
            {/* Logo Section */}
            <div className='p-6 border-b ...'>...</div>

            <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
                {menuItems.map((item) => (
                    <div key={item.id}>
                        {/* Menu chính */}
                        <NavLink
                            to={item.path || "#"}
                            onClick={(e) => item.submenu && toggleExpanded(e, item.id)}
                            className={({ isActive }) => `
                                w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                                ${isActive && !item.submenu 
                                    ? 'bg-linear-to-r from-orange-default to-orange-dark text-white shadow-lg' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
                            `}
                        >
                            <div className='flex items-center space-x-3'>
                                <item.icon className='w-5 h-5' />
                                {!collapsed && <span className='font-medium ml-2'>{item.label}</span>}
                            </div>
                            {!collapsed && item.submenu && (
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                            )}
                        </NavLink>

                        {/* Submenu */}
                        {!collapsed && item.submenu && expandedItems.has(item.id) && (
                            <div className='ml-8 mt-2 space-y-1'>
                                {item.submenu.map((subitem) => (
                                    <NavLink
                                        key={subitem.id}
                                        to={subitem.path}
                                        className={({ isActive }) => `
                                            block w-full text-sm text-left p-2 rounded-lg transition-all
                                            ${isActive 
                                                ? 'text-orange-default font-bold bg-orange-50 dark:bg-orange-500/10' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
                                        `}
                                    >
                                        {subitem.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Profile Section */}

        </div>
    );
};

export default Sidebar;