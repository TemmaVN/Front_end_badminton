import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const OrderAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(0); // 0 là tất cả

  // Mapping màu sắc cho các trạng thái (Dựa trên OrderStatusEnum của bạn)
  const statusConfig = {
    "Chờ xác nhận": { color: "bg-yellow-100 text-yellow-700", icon: <Clock size={16} /> },
    "Đã xác nhận": { color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={16} /> },
    "Đang xử lý": { color: "bg-purple-100 text-purple-700", icon: <Package size={16} /> },
    "Đang giao hàng": { color: "bg-orange-100 text-orange-700", icon: <Truck size={16} /> },
    "DaHuy": { color: "bg-red-100 text-red-700", icon: <XCircle size={16} /> },
    "HoanTat": { color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = currentStatus === 0 
        ? `/api/Order/all-orders?page=${page}&pageSize=10`
        : `/api/Order/all-orders-by-status/${currentStatus}?page=${page}&pageSize=10`;
      
      const response = await axios.get(url);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, currentStatus]);

  const handleUpdateStatus = async (orderId, newStatusId) => {
    try {
      await axios.put(`/api/Order/updateStatus/${orderId}`, newStatusId, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); // Refresh lại danh sách
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật"));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="text-blue-600" /> Quản lý đơn hàng
        </h1>

        {/* Bộ lọc trạng thái */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang xử lý', 'Đang giao', 'Hoàn tất', 'Đã hủy'].map((label, index) => (
            <button
              key={index}
              onClick={() => { setCurrentStatus(index); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentStatus === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bảng đơn hàng */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Đang tải dữ liệu...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">#{order.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.receiverName}</div>
                    <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {order.totalAmount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                      {statusConfig[order.status]?.icon}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-3">
                    <button className="text-gray-400 hover:text-blue-600" title="Xem chi tiết">
                      <Eye size={20} />
                    </button>
                    {/* Select nhanh để đổi trạng thái - Dành cho Admin */}
                    <select 
                      className="border rounded text-xs p-1"
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Đổi trạng thái</option>
                      <option value="2">Xác nhận</option>
                      <option value="3">Xử lý/Đóng gói</option>
                      <option value="4">Giao hàng</option>
                      <option value="6">Hoàn tất</option>
                      <option value="7">Hủy đơn</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-6 flex justify-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded bg-white disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">Trang {page} / {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded bg-white disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderAdminPage;