const OrderList = () => {
  const orders = [
    { id: 1, customer: 'Nguyễn Văn A', date: '2026-04-24', total: 5400000, status: 'Completed', method: 'VNPAY' },
    { id: 2, customer: 'Trần Thị B', date: '2026-04-25', total: 1200000, status: 'Pending', method: 'COD' },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Danh sách đơn hàng</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-orange-500">#ORD-{order.id}</td>
                <td className="p-4 font-medium dark:text-white">{order.customer}</td>
                <td className="p-4 text-slate-500">{order.date}</td>
                <td className="p-4 font-bold dark:text-white">{order.total.toLocaleString()}đ</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4"><button className="text-blue-500 hover:underline font-bold text-xs">Chi tiết</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;