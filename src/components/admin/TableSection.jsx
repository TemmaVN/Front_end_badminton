import React, { useEffect, useState } from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import OrderDetail from './OrderDetail';


const topProducts = [
  {
    name: 'MacBook Pro 16"',
    sales: 1247,
    revenue: "$2,987,530",
    trend: "up",
    change: "+12%",
  },
  {
    name: "iPhone 15 Pro",
    sales: 842,
    revenue: "$925,300",
    trend: "up",
    change: "+8%",
  },
  {
    name: "AirPods Pro",
    sales: 642,
    revenue: "$160,250",
    trend: "down",
    change: "-5%",
  },
  {
    name: "iPad Air",
    sales: 442,
    revenue: "$265,150",
    trend: "up",
    change: "+10%",
  }
];

const STATUSES = {
  1: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-600" },
  2: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-600" },
  3: { text: "Đang xử lý", color: "bg-indigo-100 text-indigo-600" },
  4: { text: "Đang đan lưới", color: "bg-teal-100 text-teal-600" },
  5: { text: "Đang giao hàng", color: "bg-purple-100 text-purple-600" },
  6: { text: "Đã giao hàng", color: "bg-green-100 text-green-600" },
  7: { text: "Hoàn tất", color: "bg-emerald-100 text-emerald-600" },
  8: { text: "Đã huỷ", color: "bg-red-100 text-red-600" },
};


function TableSection() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };
  const getStatusColor = (status) => {
    // Tìm status trong object STATUSES dựa vào text
    const statusEntry = Object.values(STATUSES).find(
      (item) => item.text === status
    );
    
    if (statusEntry) {
      return statusEntry.color;
    }
    
    // Fallback nếu không tìm thấy
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  };

    const {orders, getAll, getRecentOrders} = useOrder();
    useEffect(() => {
      getAll({page: 1, pagesize: 200});
    } , []);

    const ordersList = getRecentOrders(orders, 4);
  return (
    <div className="space-y-6">
      {/* Recent Orders Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Latest customer orders
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Order ID
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Khách hàng
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Tổng tiền
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Ngày tạo
                </th>
              </tr>
            </thead>
                <tbody>
                {ordersList.map((order, index) => (
                    <tr 
                    onClick={() => setSelectedOrder(order)}
                    key={index} 
                    className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                    {/* Order ID */}
                    <td className="p-4">
                        <span className="text-sm font-medium text-blue-600">
                        {order.orderId}
                        </span>
                    </td>
                    <td className="p-4">
                        <span className="text-sm text-slate-800 dark:text-white">
                        {order.receiverName}
                        </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                        <span className="text-sm text-slate-800 dark:text-white">
                        {order.totalAmount}
                        </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                        </span>
                    </td>

                    {/* Date & Action */}
                    <td className="p-4">
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-800 dark:text-white">
                            {order.orderDate}
                        </span>
                        <button 
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
          </table>

        </div>
      </div>
      {/* Top Products Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Top Products
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                Best performing products
                </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
            </button>
            </div>
        </div>

        {/* Dynamic Data List */}
        <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
            <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                {/* Left side: Name and Sales */}
                <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                    {product.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {product.sales} Sales
                </p>
                </div>

                {/* Right side: Revenue and Trend */}
                <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {product.revenue}
                </p>
                <div className="flex items-center justify-end space-x-1">
                    {product.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                    )}
                    <span className={`text-xs font-medium ${product.trend === "up" ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {product.change}
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>

    </div>
  );
}

export default TableSection;