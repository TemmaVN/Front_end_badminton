import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, MapPin, CreditCard, User, Clock, Printer } from 'lucide-react';

const OrderDetail = ({ orderId, onBack }) => {
  // Trong thực tế, bạn sẽ fetch dữ liệu từ API dựa trên orderId
  // Ví dụ dữ liệu mẫu:
  const [order, setOrder] = useState({
    orderCode: "#ORD-1",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "vana@gmail.com",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    orderDate: "2026-04-24 14:30",
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Chuyển khoản ngân hàng",
    items: [
      { id: 1, productName: "Vợt cầu lông Yonex Astrox 100ZZ", quantity: 1, price: 4200000, image: "🏸" },
      { id: 2, productName: "Giày cầu lông Victor Auraspeed", quantity: 1, price: 1200000, image: "👟" }
    ],
    totalAmount: 5400000
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Điều hướng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Chi tiết đơn hàng <span className="text-orange-500">{order.orderCode}</span>
            </h2>
            <p className="text-sm text-slate-500">Ngày đặt: {order.orderDate}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-all">
          <Printer size={18} /> In hóa đơn
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 font-bold flex items-center gap-2">
              <Package size={18} className="text-orange-500" /> Danh sách sản phẩm
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="p-4 font-semibold">Sản phẩm</th>
                    <th className="p-4 font-semibold text-center">Số lượng</th>
                    <th className="p-4 font-semibold text-right">Đơn giá</th>
                    <th className="p-4 font-semibold text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xl">
                            {item.image}
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{item.productName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">x{item.quantity}</td>
                      <td className="p-4 text-right">{item.price.toLocaleString()}₫</td>
                      <td className="p-4 text-right font-bold text-slate-800 dark:text-white">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-end gap-10 text-sm">
                <div className="space-y-2 text-slate-500">
                  <p>Tạm tính:</p>
                  <p>Phí vận chuyển:</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">Tổng cộng:</p>
                </div>
                <div className="space-y-2 text-right font-medium">
                  <p>{order.totalAmount.toLocaleString()}₫</p>
                  <p>0₫</p>
                  <p className="text-base font-extrabold text-orange-600">{order.totalAmount.toLocaleString()}₫</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin khách hàng & Trạng thái */}
        <div className="space-y-6">
          {/* Thông tin khách hàng */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
              <User size={18} className="text-blue-500" /> Khách hàng
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Tên người nhận</p>
                <p className="text-sm font-semibold">{order.customerName}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase font-bold">Số điện thoại</p>
                  <p className="text-sm">{order.phone}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                  <p className="text-sm truncate">{order.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MapPin size={12} /> Địa chỉ giao hàng
                </p>
                <p className="text-sm leading-relaxed">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
              <CreditCard size={18} className="text-emerald-500" /> Thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Phương thức:</span>
                <span className="text-sm font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Trạng thái:</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold uppercase">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Vận chuyển:</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-bold uppercase">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;