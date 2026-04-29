import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Sử dụng hook điều hướng
import { 
    Users, Package, ShoppingBag, LayoutDashboard, 
    Settings, Zap, ChevronDown, BarChart3 
} from 'lucide-react';
import { path } from 'framer-motion/client';
import { useUser } from '../../contexts/UserContext';

const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    {
        id: "catalog",
        icon: Package,
        label: "Catalog",
        path: "/admin/catalog",
        submenu: [
            { id: "products", label: "Products", path: "/admin/catalog/products" },
            { id: "categories", label: "Categories", path: "/admin/catalog/categories" },
            { id: "brands", label: "Brands", path: "/admin/catalog/brands" },
        ]
    },
    {
        id: "sales",
        icon: ShoppingBag,
        label: "Sales",
        path: "/admin/sales-overview",
        submenu: [
            { id: "orders", label: "Orders", path: "/admin/sales-overview/orders" },
            { id: "orders-detail", label: "Orders Detail", path: "/admin/sales-overview/orders-detail" },
            { id: "payments", label: "Payments", path: "/admin/sales-overview/payments" }
        ]
    },
    { id: "users", icon: Users, label: "Users", count: "1.2k" , path: "/admin/users-list" },
    {
        id: "system",
        icon: Settings,
        label: "System",
        path: "/admin/system",
        submenu: [
            { id: "info", label: "Info", path: "/admin/system/info" },
            { id: "permissions and roles", label: "Permissions and Roles", path: "/admin/system/permissions-and-roles" }
        ]
    }
];

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Lấy segment cuối cùng của URL để xác định trang hiện tại
    const currentPath = location.pathname.split('/').pop();

    const {getUserInfo} = useUser();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');

    const handleGetUserInfo = async () => {
        const result = await getUserInfo();
        if (result.success) {
            setFullName(result.user.fullName);
        }
    };

    useEffect(() => {
        handleGetUserInfo();
    }, []);

    const toggleExpanded = (itemid) => {
        setExpandedItems((prev) => {
            const newExpanded = new Set(prev);
            newExpanded.has(itemid) ? newExpanded.delete(itemid) : newExpanded.add(itemid);
            return newExpanded;
        });
    };

    const handleMenuClick = (item) => {
        if (item.submenu) {
            toggleExpanded(item.id);
            if (item.path) navigate(item.path); // navigate đến trang cha nếu có
        } else {
            navigate(item.path || `/admin/${item.id}`);
        }
    };

    // Kiểm tra xem item chính có đang active không (bao gồm cả con của nó)
    const isMainItemActive = (item) => {
        if (currentPath === item.id) return true;
        if (item.submenu) {
            return item.submenu.some(sub => sub.id === currentPath);
        }
        return false;
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}>
            {/* Logo Section */}
            <div className='p-6 border-b border-slate-200/50 dark:border-slate-700/50'>
                <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-linear-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg'>
                        <Zap className='w-6 h-6 text-white' />
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className='text-xl font-bold text-slate-800 dark:text-white'>{fullName}</h1>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>Adminstrator</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Section */}
            <nav className='flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar'>
                {menuItems.map((item) => {
                    const active = isMainItemActive(item);
                    
                    return (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    handleMenuClick(item);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                                ${active 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                <div className='flex items-center space-x-3'>
                                    <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-orange-500'}`} />
                                    {!collapsed && (
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium'>{item.label}</span>
                                            {item.count && (
                                                <span className={`px-2 py-0.5 text-[10px] rounded-full ${active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                    {item.count}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {!collapsed && item.submenu && (
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                                )}
                            </button>

                            {/* Submenu rendering */}
                            {!collapsed && item.submenu && expandedItems.has(item.id) && (
                                <div className='ml-9 mt-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-2 animate-in slide-in-from-top-2 duration-200'>
                                    {item.submenu.map((subitem) => (
                                        <button
                                            key={subitem.id}
                                            onClick={() => navigate(subitem.path)}
                                            className={`w-full text-sm text-left p-2.5 rounded-lg transition-all
                                            ${currentPath === subitem.id 
                                                ? 'text-orange-500 font-bold bg-orange-50 dark:bg-orange-500/10' 
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                        >
                                            {subitem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Profile Section */}
            {!collapsed && (
                <div className='p-4 border-t border-slate-200/50 dark:border-slate-700/50'>
                    <div className='flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer'>
                        <img src="https://i.pravatar.cc/300" alt="Avatar" className='w-10 h-10 rounded-full ring-2 ring-orange-500/20' />
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-bold text-slate-800 dark:text-white truncate'>Temma Admin</p>
                            <p className='text-[10px] text-slate-500 uppercase tracking-wider font-bold'>Super Admin</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;