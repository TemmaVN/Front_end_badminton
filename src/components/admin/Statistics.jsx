import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, Users,
  Wallet, Award, Layers, Download, Tag,
} from 'lucide-react';
import {useStatistic} from "../../contexts/StatisticContext";

const monthly2025 = [
  { thang: "T1",  doanhThu: 42, chiPhi: 28, loiNhuan: 14, donHang: 187 },
  { thang: "T2",  doanhThu: 38, chiPhi: 26, loiNhuan: 12, donHang: 163 },
  { thang: "T3",  doanhThu: 55, chiPhi: 36, loiNhuan: 19, donHang: 241 },
  { thang: "T4",  doanhThu: 68, chiPhi: 44, loiNhuan: 24, donHang: 298 },
  { thang: "T5",  doanhThu: 72, chiPhi: 47, loiNhuan: 25, donHang: 315 },
  { thang: "T6",  doanhThu: 65, chiPhi: 43, loiNhuan: 22, donHang: 284 },
  { thang: "T7",  doanhThu: 58, chiPhi: 39, loiNhuan: 19, donHang: 254 },
  { thang: "T8",  doanhThu: 62, chiPhi: 41, loiNhuan: 21, donHang: 271 },
  { thang: "T9",  doanhThu: 75, chiPhi: 49, loiNhuan: 26, donHang: 328 },
  { thang: "T10", doanhThu: 82, chiPhi: 53, loiNhuan: 29, donHang: 358 },
  { thang: "T11", doanhThu: 88, chiPhi: 57, loiNhuan: 31, donHang: 385 },
  { thang: "T12", doanhThu: 70, chiPhi: 46, loiNhuan: 24, donHang: 306 },
];

const monthly2024 = [
  { thang: "T1",  doanhThu: 36, chiPhi: 25, loiNhuan: 11, donHang: 158 },
  { thang: "T2",  doanhThu: 33, chiPhi: 23, loiNhuan: 10, donHang: 142 },
  { thang: "T3",  doanhThu: 48, chiPhi: 33, loiNhuan: 15, donHang: 208 },
  { thang: "T4",  doanhThu: 58, chiPhi: 38, loiNhuan: 20, donHang: 254 },
  { thang: "T5",  doanhThu: 62, chiPhi: 41, loiNhuan: 21, donHang: 271 },
  { thang: "T6",  doanhThu: 55, chiPhi: 37, loiNhuan: 18, donHang: 241 },
  { thang: "T7",  doanhThu: 50, chiPhi: 34, loiNhuan: 16, donHang: 218 },
  { thang: "T8",  doanhThu: 54, chiPhi: 36, loiNhuan: 18, donHang: 236 },
  { thang: "T9",  doanhThu: 65, chiPhi: 43, loiNhuan: 22, donHang: 285 },
  { thang: "T10", doanhThu: 70, chiPhi: 46, loiNhuan: 24, donHang: 306 },
  { thang: "T11", doanhThu: 74, chiPhi: 49, loiNhuan: 25, donHang: 324 },
  { thang: "T12", doanhThu: 60, chiPhi: 40, loiNhuan: 20, donHang: 262 },
];

const compareData = monthly2025.map((d, i) => ({
  thang: d.thang,
  'Năm 2025': d.doanhThu,
  'Năm 2024': monthly2024[i].doanhThu,
}));

const categoryData = [
  { name: "Vợt cầu lông",  value: 42, color: "#fb923c", doanhThu: 360, daBan: 518 },
  { name: "Cầu lông",      value: 22, color: "#3b82f6", doanhThu: 189, daBan: 3780 },
  { name: "Giày cầu lông", value: 18, color: "#10b981", doanhThu: 155, daBan: 287 },
  { name: "Túi & Balo",    value:  8, color: "#8b5cf6", doanhThu:  69, daBan: 198 },
  { name: "Phụ kiện",      value:  7, color: "#f59e0b", doanhThu:  60, daBan: 1420 },
  { name: "Quần áo",       value:  3, color: "#ef4444", doanhThu:  25, daBan: 142 },
];

const CAT_KEYS = ["Vợt", "Cầu", "Giày", "Túi", "Phụ kiện", "Quần áo"];
const CAT_COLORS = ["#fb923c", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const categoryMonthly = monthly2025.map((d) => ({
  thang: d.thang,
  "Vợt":       Math.round(d.doanhThu * 0.42),
  "Cầu":       Math.round(d.doanhThu * 0.22),
  "Giày":      Math.round(d.doanhThu * 0.18),
  "Túi":       Math.round(d.doanhThu * 0.08),
  "Phụ kiện":  Math.round(d.doanhThu * 0.07),
  "Quần áo":   Math.round(d.doanhThu * 0.03),
}));

const brandData = [
  { ten: "Yonex",    doanhThu: 323, donHang: 984 },
  { ten: "Victor",   doanhThu: 213, donHang: 648 },
  { ten: "Li-Ning",  doanhThu: 153, donHang: 412 },
  { ten: "Kawasaki", doanhThu:  85, donHang: 278 },
  { ten: "RSL",      doanhThu:  56, donHang: 1240 },
  { ten: "Forza",    doanhThu:  28, donHang: 185 },
];
const BRAND_COLORS = ["#fb923c", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const topProductsData = [
  { rank: 1, ten: "Vợt Yonex Astrox 88D",         danhMuc: "Vợt cầu lông",  thuongHieu: "Yonex",   daBan: 234,  doanhThu: "1.170.000.000", trend: "up",   change: "+18%" },
  { rank: 2, ten: "Vợt Victor Thruster K 12M",     danhMuc: "Vợt cầu lông",  thuongHieu: "Victor",  daBan: 186,  doanhThu: "892.800.000",   trend: "up",   change: "+12%" },
  { rank: 3, ten: "Cầu RSL Gold (hộp 12 quả)",     danhMuc: "Cầu lông",      thuongHieu: "RSL",     daBan: 1520, doanhThu: "760.000.000",   trend: "up",   change: "+24%" },
  { rank: 4, ten: "Giày Yonex SHB 65Z3",           danhMuc: "Giày cầu lông", thuongHieu: "Yonex",   daBan: 142,  doanhThu: "567.000.000",   trend: "down", change: "-5%"  },
  { rank: 5, ten: "Vợt Li-Ning Aeronaut 9000",      danhMuc: "Vợt cầu lông",  thuongHieu: "Li-Ning", daBan: 98,   doanhThu: "490.000.000",   trend: "up",   change: "+8%"  },
  { rank: 6, ten: "Cầu Victor Gold (hộp 12 quả)",  danhMuc: "Cầu lông",      thuongHieu: "Victor",  daBan: 987,  doanhThu: "493.500.000",   trend: "up",   change: "+15%" },
  { rank: 7, ten: "Grip Yonex AC102 (bộ 3)",       danhMuc: "Phụ kiện",      thuongHieu: "Yonex",   daBan: 892,  doanhThu: "133.800.000",   trend: "up",   change: "+31%" },
  { rank: 8, ten: "Túi Yonex BA92026EX 6-vợt",     danhMuc: "Túi & Balo",    thuongHieu: "Yonex",   daBan: 124,  doanhThu: "372.000.000",   trend: "down", change: "-3%"  },
];

const orderStatusData = [
  { name: "Hoàn tất",    value: 68, color: "#10b981" },
  { name: "Đang xử lý",  value: 14, color: "#3b82f6" },
  { name: "Đang giao",   value: 10, color: "#8b5cf6" },
  { name: "Đã hủy",      value:  8, color: "#ef4444" },
];

const orderTrendData = monthly2025.map((d) => ({
  thang:          d.thang,
  "Hoàn tất":    Math.round(d.donHang * 0.68),
  "Đang xử lý":  Math.round(d.donHang * 0.14),
  "Đang giao":   Math.round(d.donHang * 0.10),
  "Đã hủy":      Math.round(d.donHang * 0.08),
}));

// ─── Helpers ─────────────────────────────────────────────────────────
const fmtM = (v) => `${v}M`;
const tooltipStyle = {
  backgroundColor: "rgba(255,255,255,0.97)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
};
const axisProps = { stroke: "#94a3b8", fontSize: 11, tickLine: false, axisLine: false };

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
}

// ─── Revenue Tab ──────────────────────────────────────────────────────
function RevenueTab({ period }) {
  const { revenueByMonth } = useStatistic();

  const data = useMemo(() => {
    const sample = period === '2025' ? monthly2025 : monthly2024;
    if (revenueByMonth && period === '2025') {
      return sample.map((d, i) => {
        const real = revenueByMonth.find((r) => r.month === i + 1);
        if (!real) return d;
        return {
          ...d,
          doanhThu: real.totalRevenue / 1_000_000,
          donHang:  real.totalOrders,
        };
      });
    }
    return sample;
  }, [period, revenueByMonth]);

  const totalDT = data.reduce((s, d) => s + d.doanhThu, 0);
  const totalCP = data.reduce((s, d) => s + d.chiPhi,   0);
  const totalLN = data.reduce((s, d) => s + d.loiNhuan, 0);
  const totalDH = data.reduce((s, d) => s + d.donHang,  0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area chart */}
        <Card className="p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Doanh thu theo tháng</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Năm {period} · đơn vị: triệu đồng</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLN" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="thang" {...axisProps} />
                <YAxis tickFormatter={fmtM} {...axisProps} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, n) => [
                    `${v} triệu đ`,
                    n === 'doanhThu' ? 'Doanh thu' : n === 'chiPhi' ? 'Chi phí' : 'Lợi nhuận',
                  ]}
                />
                <Legend
                  formatter={(v) =>
                    v === 'doanhThu' ? 'Doanh thu' : v === 'chiPhi' ? 'Chi phí' : 'Lợi nhuận'
                  }
                />
                <Area type="monotone" dataKey="doanhThu" stroke="#fb923c" strokeWidth={2.5} fill="url(#gDT)" />
                <Area type="monotone" dataKey="chiPhi"   stroke="#94a3b8" strokeWidth={2}   fill="url(#gCP)" />
                <Area type="monotone" dataKey="loiNhuan" stroke="#10b981" strokeWidth={2.5} fill="url(#gLN)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar comparison 2024 vs 2025 */}
        <Card className="p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">So sánh năm 2024 – 2025</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Doanh thu theo tháng · triệu đồng</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="thang" {...axisProps} />
                <YAxis tickFormatter={fmtM} {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v} triệu đ`, n]} />
                <Legend />
                <Bar dataKey="Năm 2024" fill="#94a3b8" radius={[3, 3, 0, 0]} maxBarSize={22} />
                <Bar dataKey="Năm 2025" fill="#fb923c" radius={[3, 3, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly summary table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-base font-bold text-slate-800 dark:text-white">Tổng hợp doanh thu theo tháng</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                {["Tháng", "Doanh thu", "Chi phí", "Lợi nhuận", "Đơn hàng", "TB/đơn"].map((h) => (
                  <th key={h} className={`p-4 font-semibold text-slate-600 dark:text-slate-400 ${h === "Tháng" ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-white">Tháng {i + 1}</td>
                  <td className="p-4 text-right font-semibold text-orange-500">{(d.doanhThu * 1_000_000).toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 text-right text-slate-500 dark:text-slate-400">{(d.chiPhi   * 1_000_000).toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 text-right font-semibold text-emerald-600">{(d.loiNhuan * 1_000_000).toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 text-right text-slate-700 dark:text-slate-300">{d.donHang.toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-500 dark:text-slate-400">
                    {Math.round((d.doanhThu * 1_000_000) / d.donHang).toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              ))}
              <tr className="bg-orange-50/50 dark:bg-orange-900/10 font-bold border-t-2 border-orange-100 dark:border-orange-900/30">
                <td className="p-4 text-slate-800 dark:text-white">Tổng cộng</td>
                <td className="p-4 text-right text-orange-500">{(totalDT * 1_000_000).toLocaleString('vi-VN')} đ</td>
                <td className="p-4 text-right text-slate-500">{(totalCP * 1_000_000).toLocaleString('vi-VN')} đ</td>
                <td className="p-4 text-right text-emerald-600">{(totalLN * 1_000_000).toLocaleString('vi-VN')} đ</td>
                <td className="p-4 text-right text-slate-800 dark:text-white">{totalDH.toLocaleString()}</td>
                <td className="p-4 text-right text-slate-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Category Tab ─────────────────────────────────────────────────────
function CategoryTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stacked bar */}
        <Card className="xl:col-span-2 p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Doanh thu theo danh mục & tháng</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Năm 2025 · triệu đồng</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMonthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="thang" {...axisProps} />
                <YAxis tickFormatter={fmtM} {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v} triệu đ`, n]} />
                <Legend />
                {CAT_KEYS.map((k, i) => (
                  <Bar key={k} dataKey={k} stackId="a" fill={CAT_COLORS[i]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut */}
        <Card className="p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Phân bổ danh mục</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Theo doanh thu năm 2025</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[i] }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{item.doanhThu}M</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white w-8 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-base font-bold text-slate-800 dark:text-white">Chi tiết theo danh mục</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Danh mục</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Doanh thu</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Đã bán</th>
                <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Tỷ lệ</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Phân bổ</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[i] }} />
                      <span className="font-medium text-slate-800 dark:text-white">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold text-orange-500">
                    {(cat.doanhThu * 1_000_000).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-4 text-right text-slate-600 dark:text-slate-400">
                    {cat.daBan.toLocaleString()} sp
                  </td>
                  <td className="p-4 text-right font-bold text-slate-800 dark:text-white">{cat.value}%</td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.value}%`, backgroundColor: CAT_COLORS[i] }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Brand Tab ────────────────────────────────────────────────────────
function BrandTab() {
  const maxDT = Math.max(...brandData.map((b) => b.doanhThu));
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Doanh thu theo thương hiệu</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Năm 2025 · triệu đồng</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} horizontal={false} />
              <XAxis type="number" tickFormatter={fmtM} {...axisProps} />
              <YAxis type="category" dataKey="ten" {...axisProps} width={72} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} triệu đ`, 'Doanh thu']} />
              <Bar dataKey="doanhThu" radius={[0, 4, 4, 0]} maxBarSize={32}>
                {brandData.map((_, i) => <Cell key={i} fill={BRAND_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-base font-bold text-slate-800 dark:text-white">Chi tiết theo thương hiệu</h4>
        </div>
        <div className="p-6 space-y-4">
          {brandData.map((brand, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow"
                style={{ backgroundColor: BRAND_COLORS[i] }}
              >
                {brand.ten[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">{brand.ten}</span>
                  <span className="text-xs text-slate-400">{brand.donHang.toLocaleString()} đơn</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(brand.doanhThu / maxDT) * 100}%`, backgroundColor: BRAND_COLORS[i] }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white shrink-0 w-14 text-right">
                {brand.doanhThu}M
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────
function ProductsTab() {
  const [filterCat,   setFilterCat]   = useState('all');
  const [filterTrend, setFilterTrend] = useState('all');

  const cats = ['all', ...new Set(topProductsData.map((p) => p.danhMuc))];
  const filtered = topProductsData
    .filter((p) => filterCat   === 'all' || p.danhMuc === filterCat)
    .filter((p) => filterTrend === 'all' || p.trend   === filterTrend);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Sản phẩm bán chạy</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Năm 2025 · top {filtered.length} sản phẩm</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Tất cả danh mục</option>
              {cats.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterTrend}
              onChange={(e) => setFilterTrend(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Tất cả xu hướng</option>
              <option value="up">Đang tăng</option>
              <option value="down">Đang giảm</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <th className="text-center p-4 font-semibold text-slate-600 dark:text-slate-400 w-12">#</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Sản phẩm</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Danh mục</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Thương hiệu</th>
              <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Đã bán</th>
              <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Doanh thu</th>
              <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">Xu hướng</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-600">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${p.rank <= 3 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-white">{p.ten}</td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{p.danhMuc}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-slate-500 dark:text-slate-400">{p.thuongHieu}</td>
                  <td className="p-4 text-right text-slate-700 dark:text-slate-300">{p.daBan.toLocaleString()}</td>
                  <td className="p-4 text-right font-semibold text-orange-500">{p.doanhThu} đ</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.trend === 'up'
                        ? <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />
                        : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                      <span className={`text-xs font-semibold ${p.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────
function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stacked bar order trend */}
        <Card className="xl:col-span-2 p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Xu hướng đơn hàng theo tháng</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Năm 2025 · phân theo trạng thái</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="thang" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="Hoàn tất"    stackId="a" fill="#10b981" />
                <Bar dataKey="Đang xử lý"  stackId="a" fill="#3b82f6" />
                <Bar dataKey="Đang giao"   stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Đã hủy"      stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut status */}
        <Card className="p-6">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">Phân bổ trạng thái</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Tổng cộng 2.847 đơn</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {orderStatusData.map((_, i) => <Cell key={i} fill={orderStatusData[i].color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {orderStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Order KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng đơn hàng",  value: "2.847",    sub: "Năm 2025",               color: "text-blue-500" },
          { label: "Tỉ lệ hoàn tất", value: "68%",      sub: "+5% so với 2024",         color: "text-emerald-500" },
          { label: "Tỉ lệ hủy đơn",  value: "8%",       sub: "−2% so với 2024",         color: "text-rose-500" },
          { label: "TB thời gian XL", value: "2,4 ngày", sub: "Xác nhận → Giao hàng",   color: "text-purple-500" },
        ].map((kpi, i) => (
          <Card key={i} className="p-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
const TABS = [
  { id: 'revenue',  label: 'Doanh thu',    icon: Wallet },
  { id: 'category', label: 'Danh mục',     icon: Layers },
  { id: 'brand',    label: 'Thương hiệu',  icon: Award },
  { id: 'products', label: 'Sản phẩm',     icon: Package },
  { id: 'orders',   label: 'Đơn hàng',     icon: ShoppingCart },
];

const SUMMARY = [
  { title: "Tổng doanh thu",  value: "856 triệu đ", change: "+18,1%", trend: "up", color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/20",   icon: Wallet },
  { title: "Tổng đơn hàng",  value: "2.847",        change: "+15,3%", trend: "up", color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20",       icon: ShoppingCart },
  { title: "Khách hàng",     value: "1.247",         change: "+8,2%",  trend: "up", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: Users },
  { title: "TB giá trị/đơn", value: "300.800 đ",     change: "+2,4%",  trend: "up", color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-900/20",   icon: Tag },
];

export default function Statistics() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [period,    setPeriod]    = useState('2025');

  const renderTab = () => {
    switch (activeTab) {
      case 'revenue':  return <RevenueTab period={period} />;
      case 'category': return <CategoryTab />;
      case 'brand':    return <BrandTab />;
      case 'products': return <ProductsTab />;
      case 'orders':   return <OrdersTab />;
      default:         return null;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Thống kê & Báo cáo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dữ liệu mô phỏng · Cập nhật 12/05/2025</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="2025">Năm 2025</option>
            <option value="2024">Năm 2024</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY.map((s, i) => (
          <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.title}</p>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-tight">{s.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {s.trend === 'up'
                ? <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
              <span className="text-xs font-semibold text-emerald-500">{s.change}</span>
              <span className="text-xs text-slate-400">vs năm trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? 'bg-orange-default text-white shadow-lg shadow-orange-default/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {renderTab()}
    </div>
  );
}
