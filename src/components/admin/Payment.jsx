import React from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Payment = () => {
  // Dữ liệu giả lập cho danh sách giao dịch
  const transactions = [
    { id: '#TR-8821', customer: 'Nguyễn Văn A', date: '03/05/2026', amount: '2,500,000đ', status: 'Success', method: 'Visa' },
    { id: '#TR-8822', customer: 'Trần Thị B', date: '02/05/2026', amount: '1,200,000đ', status: 'Pending', method: 'Momo' },
    { id: '#TR-8823', customer: 'Lê Văn C', date: '01/05/2026', amount: '450,000đ', status: 'Success', method: 'Mastercard' },
    { id: '#TR-8824', customer: 'Phạm Minh D', date: '30/04/2026', amount: '9,800,000đ', status: 'Failed', method: 'Bank Transfer' },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thanh toán</h1>
          <p className="text-sm text-slate-500">Quản lý các giao dịch và phương thức thanh toán của hệ thống.</p>
        </div>
        <button className="bg-[#FF782E] hover:bg-[#E35600] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
          <CreditCard size={18} />
          Xuất báo cáo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold mt-1">128,450,000đ</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-[#FF782E]">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4 font-medium">+12.5% so với tháng trước</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium">Giao dịch chờ xử lý</p>
              <h3 className="text-2xl font-bold mt-1">14</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium">Cần duyệt trong 24h tới</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm ring-1 ring-[#FF782E]/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#E35600] font-bold uppercase tracking-wider">Số dư khả dụng</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800">45,200,000đ</h3>
            </div>
            <div className="p-2 bg-[#FF782E] rounded-lg text-white">
              <CreditCard size={20} />
            </div>
          </div>
          <button className="text-xs text-[#FF782E] mt-4 font-bold hover:underline">Rút tiền ngay →</button>
        </div>
      </div>

      {/* Main Content: Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-bold text-slate-700">Lịch sử giao dịch</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm mã GD, khách hàng..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#FF782E]/20 focus:border-[#FF782E]"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Mã giao dịch</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#E35600]">{item.id}</td>
                  <td className="px-6 py-4 font-medium">{item.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 font-bold">{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Success' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Hiển thị 1-4 trong số 120 giao dịch</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 bg-[#FF782E] text-white rounded font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;