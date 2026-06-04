import React, { useState } from "react";
import { X, Package, CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import { orderApi } from "../../api";

const STATUS_TIMELINE = [
  { id: 1, text: "Chờ xác nhận" },
  { id: 2, text: "Đã xác nhận" },
  { id: 3, text: "Đang xử lý" },
  { id: 4, text: "Đang đan lưới" },
  { id: 5, text: "Đang giao hàng" },
  { id: 6, text: "Đã giao hàng" },
];

const STATUS_INFO = {
  1: { text: "Chờ xác nhận",  badge: "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  2: { text: "Đã xác nhận",   badge: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  3: { text: "Đang xử lý",    badge: "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400" },
  4: { text: "Đang đan lưới", badge: "bg-fuchsia-100 dark:bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400" },
  5: { text: "Đang giao hàng",badge: "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  6: { text: "Đã giao hàng",  badge: "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400" },
  7: { text: "Hoàn tất",      badge: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  8: { text: "Đã huỷ",        badge: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400" },
};

const CANCEL_STATUS_ID = 8;

const NEXT_ACTIONS = {
  1: { nextStatusId: 2, label: "Xác nhận đơn hàng",      btnClass: "bg-blue-500 hover:bg-blue-600 text-white" },
  2: { nextStatusId: 3, label: "Bắt đầu xử lý",           btnClass: "bg-orange-500 hover:bg-orange-600 text-white" },
  3: { nextStatusId: 5, label: "Bàn giao vận chuyển",     btnClass: "bg-purple-500 hover:bg-purple-600 text-white" },
  4: { nextStatusId: 5, label: "Đan xong, bàn giao giao hàng", btnClass: "bg-purple-500 hover:bg-purple-600 text-white" },
  5: { nextStatusId: 6, label: "Xác nhận đã giao",        btnClass: "bg-green-500 hover:bg-green-600 text-white" },
  6: { nextStatusId: 7, label: "Hoàn thành đơn",          btnClass: "bg-emerald-500 hover:bg-emerald-600 text-white" },
};

const OrderDetail = ({ order, onClose, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const [localOrder, setLocalOrder] = useState(order);

  let currentStatusId = 1;
  const rawStatus = localOrder.status;

  if (rawStatus !== null && rawStatus !== undefined) {
    const parsedId = parseInt(rawStatus, 10);
    if (!isNaN(parsedId) && parsedId > 0 && parsedId <= 8) {
      currentStatusId = parsedId;
    } else {
      const normalized = String(rawStatus).trim().toLowerCase();
      const found = Object.entries(STATUS_INFO).find(
        ([, info]) => info.text.toLowerCase() === normalized,
      );
      if (found) {
        currentStatusId = parseInt(found[0], 10);
      } else if (normalized.includes("huỷ") || normalized.includes("hủy")) {
        currentStatusId = CANCEL_STATUS_ID;
      }
    }
  }

  const isCancelled = currentStatusId === CANCEL_STATUS_ID;
  const isCompleted = currentStatusId === 7;
  // Per state machine: cancel allowed from 1,2,3,5 (not 4=đan lưới, not 6,7,8)
  const canCancel = !isCancelled && !isCompleted && [1, 2, 3, 5].includes(currentStatusId);

  const handleUpdateStatus = async (newStatusId) => {
    let cancelReason = "";

    if (newStatusId === CANCEL_STATUS_ID) {
      cancelReason = window.prompt("Nhập lý do hủy đơn hàng:");
      if (cancelReason === null) return;

      cancelReason = cancelReason.trim();
      if (!cancelReason) {
        alert("Vui lòng nhập lý do hủy đơn.");
        return;
      }
    }

    const confirmationText =
      newStatusId === CANCEL_STATUS_ID
        ? "Bạn có chắc muốn HỦY đơn hàng này không?"
        : `Bạn có chắc muốn chuyển trạng thái đơn hàng?`;

    if (!window.confirm(confirmationText)) return;

    setIsUpdating(true);
    try {
      const response =
        newStatusId === CANCEL_STATUS_ID
          ? await orderApi.cancelByAdmin(localOrder.orderId, cancelReason)
          : await orderApi.updateStatus(localOrder.orderId, newStatusId);

      // 2. Cập nhật state nội bộ BẰNG DỮ LIỆU BE VỪA TRẢ VỀ (giúp UI nhảy trạng thái lập tức)
      const updatedOrderData = response.data?.data || response.data || response;
      setLocalOrder(updatedOrderData);

      // 3. Vẫn gọi onUpdate() để list ngầm cập nhật lại danh sách ở ngoài
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        "Cập nhật thất bại: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const action = NEXT_ACTIONS[currentStatusId];
  const currentStatusConfig = STATUS_INFO[currentStatusId] || {
    text: "Không xác định",
    badge: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              BWS-2026{localOrder.orderId.toString().padStart(4, "0")}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${currentStatusConfig.badge}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {currentStatusConfig.text}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Tạo lúc:{" "}
            {new Date(localOrder.orderDate).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {new Date(localOrder.orderDate).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 pt-5 bg-gray-50/50 dark:bg-slate-950/30">
          {/* Card: Tiến trình đơn hàng */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 mb-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Tiến trình đơn hàng
            </h3>

            {/* SỬA LỖI 2: Dòng kẻ động giữa các trạng thái */}
            <div className="flex justify-between items-start w-full px-2 mt-4">
              {STATUS_TIMELINE.map((status, index) => {
                const isPassed = currentStatusId >= status.id;
                const isCancelledState = isCancelled && status.id === 1;
                const isLast = index === STATUS_TIMELINE.length - 1;

                // Cấu hình đường kẻ line nối các bước
                const nextStatus = !isLast ? STATUS_TIMELINE[index + 1] : null;
                const isLineActive =
                  nextStatus && currentStatusId >= nextStatus.id;

                let circleClass = "bg-gray-200 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500";
                let textClass = "text-gray-400 dark:text-slate-500";

                if (isCancelled) {
                  if (isCancelledState) {
                    circleClass = "bg-red-500 border-red-500 text-white";
                    textClass = "text-red-500 font-medium";
                  }
                } else if (isPassed) {
                  textClass = "text-gray-800 dark:text-white font-medium";
                  if (status.id === 1) circleClass = "bg-yellow-500 border-yellow-500 text-white";
                  if (status.id === 2) circleClass = "bg-blue-500 border-blue-500 text-white";
                  if (status.id === 3) circleClass = "bg-orange-500 border-orange-500 text-white";
                  if (status.id === 4) circleClass = "bg-fuchsia-500 border-fuchsia-500 text-white";
                  if (status.id === 5) circleClass = "bg-purple-500 border-purple-500 text-white";
                  if (status.id === 6) circleClass = "bg-green-500 border-green-500 text-white";
                }

                return (
                  <React.Fragment key={status.id}>
                    {/* Chấm tròn & Chữ */}
                    <div className="flex flex-col items-center w-20 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 ${circleClass} shadow-sm transition-all duration-300`}
                      >
                        {isPassed && !isCancelled ? (
                          <CheckCircle size={20} />
                        ) : isCancelledState ? (
                          <XCircle size={20} />
                        ) : null}
                      </div>
                      <p
                        className={`mt-2 text-xs text-center leading-tight transition-all duration-300 ${textClass}`}
                      >
                        {status.text}
                      </p>
                    </div>

                    {/* Dòng kẻ nối với phần tử tiếp theo */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-1 mt-5 mx-1 rounded-full transition-all duration-500 ${isLineActive ? "bg-emerald-400" : "bg-gray-200 dark:bg-slate-700"}`}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Card: Thông tin khách hàng */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold text-lg">
                  {localOrder.receiverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {localOrder.receiverName}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-slate-300">
                <p className="flex items-center gap-3">
                  <span className="text-gray-400">📞</span>
                  {localOrder.phoneNumber}
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">📍</span>
                  {localOrder.shippingAddress}
                </p>
              </div>
            </div>

            {/* Card: Thông tin thanh toán */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">
                Thông tin thanh toán
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Phương thức</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{localOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Tạm tính</span>
                  <span className="text-gray-700 dark:text-slate-300">{(localOrder.subTotal ?? 0).toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Phí vận chuyển</span>
                  <span className="text-gray-700 dark:text-slate-300">{(localOrder.shippingFee ?? 0).toLocaleString()} đ</span>
                </div>
                {(localOrder.totalDiscount ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Giảm giá</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">− {localOrder.totalDiscount.toLocaleString()} đ</span>
                  </div>
                )}
                {localOrder.appliedVouchers?.length > 0 && (
                  <div className="pl-2 space-y-1 border-l-2 border-emerald-200 dark:border-emerald-500/30">
                    {localOrder.appliedVouchers.map((v, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 font-bold">{v.voucherCode}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">− {v.appliedDiscount.toLocaleString()} đ</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-slate-400">Trạng thái TT</span>
                  <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">Chưa thanh toán</span>
                </div>
                <div className="pt-3 mt-1 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-gray-800 dark:text-white">Tổng tiền</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {(localOrder.finalAmount ?? 0).toLocaleString()} đ
                  </span>
                </div>
              </div>
              {localOrder.note && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-start gap-2 text-sm text-gray-500 dark:text-slate-400">
                  <span className="mt-0.5 text-gray-400">📝</span>
                  {localOrder.note}
                </div>
              )}
              {isCancelled && localOrder.cancelReason && (
                <div className="mt-4 pt-4 border-t border-red-100 flex items-start gap-2 text-sm text-red-600">
                  <span className="mt-0.5">!</span>
                  <div>
                    <p className="font-semibold">Lý do hủy đơn</p>
                    <p>{localOrder.cancelReason}</p>
                    {localOrder.cancelledAt && (
                      <p className="mt-1 text-xs text-red-400">
                        {new Date(localOrder.cancelledAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Sản phẩm đặt hàng */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 p-5 pb-3 border-b border-gray-100 dark:border-slate-700">
              Sản phẩm đặt hàng
            </h3>
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="font-medium p-4 py-3">Sản phẩm</th>
                  <th className="font-medium p-4 py-3 text-center">SL</th>
                  <th className="font-medium p-4 py-3 text-right">Đơn giá</th>
                  <th className="font-medium p-4 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {localOrder.orderDetails.map((item, idx) => (
                  <tr key={idx} className="text-sm hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Sản phẩm</p>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-600 dark:text-slate-300">
                      x{item.quantity}
                    </td>
                    <td className="p-4 text-right text-gray-600 dark:text-slate-300">
                      {(item.unitPrice || 0).toLocaleString()} đ
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800 dark:text-white">
                      {((item.unitPrice || 0) * item.quantity).toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center text-xs text-gray-400 dark:text-slate-500 gap-1.5">
            <Clock size={14} />
            Cập nhật lúc:{" "}
            {new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <div className="flex gap-3">
            {canCancel && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(CANCEL_STATUS_ID)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Huỷ đơn
              </button>
            )}

            {action && !isCancelled && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(action.nextStatusId)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm ${action.btnClass}`}
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {action.label}
              </button>
            )}

            {isCompleted && (
              <span className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                Đơn hàng đã hoàn thành
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
