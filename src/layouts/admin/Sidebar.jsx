import { button, div, label, sub } from 'framer-motion/client'
import { 
    Users,
    Package,
    ShoppingBag,
    LayoutDashboard,
    Settings,
    Zap,
    ChevronDown,
    BarChart3,

} from 'lucide-react'
import React, {useState} from 'react'

const menuItems = [
    {
        id: "Dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        id: "Catalog",
        icon: Package,
        label: "Catalog",
        submenu: [
            { id: "products", label: "Products" }, // dbo.Products
            { id: "categories", label: "Categories" }, // dbo.Categories
            { id: "brands", label: "Brands" }, // dbo.Brands
        ]
    },
    {
        id: "Sales",
        icon: ShoppingBag,
        label: "Sales",
        submenu: [
            { id: "orders", label: "Orders" }, // dbo.Orders
            { id: "order-details", label: "Order Details" }, // dbo.OrderDetails
            { id: "payments", label: "Payments" } // dbo.Payments
        ]
    },
    {
        id: "Customers",
        icon: Users,
        label: "Customers", // dbo.Customers
        count: "1.2k",
    },
    {
        id: "System",
        icon: Settings,
        label: "System",
        submenu: [
            { id: "users", label: "Admin Users" }, // dbo.Users
            { id: "roles", label: "Roles & Permissions" }, // dbo.Roles, dbo.UserRoles
            { id: "vouchers", label: "Vouchers" }, // dbo.VoucherConditions
            { id: "tickets", label: "Service Tickets" } // dbo.ServiceTickets
        ]
    }
];

const Sidebar = ({collapsed, onToggle, currentPage, setCurrentPage}) => {
    const [expandedItems, setExpandedItems] = useState(new Set());

    const toggleExpanded = (itemid) => {
        setExpandedItems((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(itemid)) {
                newExpanded.delete(itemid);
            } else {
                newExpanded.add(itemid);
            }
            return newExpanded
        })

    };
  return (
    <div className={`${collapsed? 'w-20':'w-72'} transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}>
        {/*logo*/}
        <div className='p-6 border-b border-slate-200/50 dark:border-slate-700/50'> 
            <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-linear-to-r from-orange-default to-orange-dark rounded-xl
                flex items-center justify-center shadow-lg'>
                    <Zap className='w-6 h-6 text-white'/>
                </div>
                {/*Conditional rendering*/}
                {!collapsed &&
                <div>
                    <h1 className='text-xl font-bold text-slate-800 dark:text-white'>
                        Temma Admin
                    </h1>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                        Dashboard
                    </p>
                </div>
                }
            </div>
        </div>
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
            {menuItems.map((item) => (
                <div key={item.id}>
                    <button 
                        className={`w-full flex items-center justify-between p-3
                        rounded-xl transition-all duration-200 ${currentPage === item.id || item.active? 
                        'bg-linear-to-r from-orange-default to-orange-dark text-white shadow-lg shadow-orange-default/25':
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                        onClick={() => {
                            if (item.submenu) {
                                toggleExpanded(item.id);
                            }
                            setCurrentPage(item.id);
                        }}
                        >
                        <div className='flex items-center space-x-3'>
                            <item.icon className={`w-5 h-5`}/>
                            <>
                                {!collapsed && <span className='font-medium ml-2'>{item.label}</span>}
                                {item.badge && <span className='px-2 py-1 text-xs bg-red-500 text-white- rounded-full'>
                                    {item.badge}
                                </span>}
                                {item.count && <span className='px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-full'>
                                    {item.count}
                                </span>}
                            </>
                        </div>

                         {!collapsed && item.submenu &&
                            <ChevronDown className={`w-4 h-4 transition-transform`}/>}
                    </button>

                    {/* Subs Menus */}
                    {   !collapsed && 
                        item.submenu && 
                        expandedItems.has(item.id) && (
                        <div className='ml-8 mt-2 space-y-1'>
                            {item.submenu.map((subitem) => {
                                return (<button className='w-full text-sm text-left p-2 text-slate-600
                                        dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200
                                        hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg
                                        transition-all'
                                        onClick={() => {
                                            setCurrentPage(subitem.id);
                                        }}
                                        >
                                    {subitem.label}
                                </button>)
                            })}
                        </div>
                    )}
                </div>
            ))}
        </nav>
        {/*User Profile*/}
        
    </div>
  )
}

export default Sidebar