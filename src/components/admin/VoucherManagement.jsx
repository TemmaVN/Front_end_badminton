import { useState } from "react";
import { Plus, Tag, CheckCircle, AlertCircle } from "lucide-react";
import { voucherApi } from "../../api";

const initialForm = {
  voucherCode: "",
  description: "",
  isPercent: true,
  discountValue: "",
  maxDiscountAmount: "",
  minOrderValue: "",
  startDate: "",
  endDate: "",
  isGlobal: true,
  usageLimit: "",
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500";

const VoucherManagement = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const payload = {
        voucherCode: form.voucherCode || undefined,
        description: form.description || undefined,
        isPercent: form.isPercent,
        discountValue: parseFloat(form.discountValue),
        maxDiscountAmount:
          form.isPercent && form.maxDiscountAmount
            ? parseFloat(form.maxDiscountAmount)
            : undefined,
        minOrderValue: parseFloat(form.minOrderValue) || 0,
        startDate: form.startDate || undefined,
        endDate: form.endDate,
        isGlobal: form.isGlobal,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
      };
      const res = await voucherApi.adminCreate(payload);
      setResult({ success: true, message: "Tạo voucher thành công!", code: res.data?.voucherCode });
      setForm(initialForm);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message ?? "Đã xảy ra lỗi khi tạo voucher.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Quản lý Voucher</h3>
              <p className="text-xs text-slate-500">Tạo mã giảm giá mới</p>
            </div>
          </div>

          {/* Result banner */}
          {result && (
            <div
              className={`mx-6 mt-6 p-4 rounded-xl flex items-start gap-3 ${
                result.success
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    result.success ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>
                {result.code && (
                  <code className="mt-1 inline-block text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {result.code}
                  </code>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Code + flags */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mã voucher (tự sinh nếu bỏ trống)">
                <input
                  name="voucherCode"
                  value={form.voucherCode}
                  onChange={handleChange}
                  placeholder="VD: SUMMER25"
                  className={inputCls + " font-mono uppercase"}
                  style={{ textTransform: "uppercase" }}
                />
              </Field>
              <div className="flex flex-col justify-end gap-3 pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isGlobal"
                    checked={form.isGlobal}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">🌐 Toàn sàn</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPercent"
                    checked={form.isPercent}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-700">% Phần trăm</span>
                </label>
              </div>
            </div>

            {/* Discount value + max */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Giá trị giảm" required>
                <div className="relative">
                  <input
                    name="discountValue"
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={handleChange}
                    required
                    placeholder={form.isPercent ? "10" : "50000"}
                    className={inputCls + " pr-10"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {form.isPercent ? "%" : "₫"}
                  </span>
                </div>
              </Field>
              {form.isPercent && (
                <Field label="Giảm tối đa">
                  <div className="relative">
                    <input
                      name="maxDiscountAmount"
                      type="number"
                      min="0"
                      value={form.maxDiscountAmount}
                      onChange={handleChange}
                      placeholder="100000"
                      className={inputCls + " pr-6"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₫</span>
                  </div>
                </Field>
              )}
            </div>

            {/* Min order + usage limit */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Đơn tối thiểu">
                <div className="relative">
                  <input
                    name="minOrderValue"
                    type="number"
                    min="0"
                    value={form.minOrderValue}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls + " pr-6"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₫</span>
                </div>
              </Field>
              <Field label="Giới hạn sử dụng">
                <input
                  name="usageLimit"
                  type="number"
                  min="1"
                  value={form.usageLimit}
                  onChange={handleChange}
                  placeholder="Không giới hạn"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ngày bắt đầu">
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
              <Field label="Ngày hết hạn" required>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Mô tả">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Nhập mô tả voucher..."
                className={inputCls + " resize-none"}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-60 transition-all"
            >
              <Plus className="w-4 h-4" />
              {submitting ? "Đang tạo..." : "Tạo voucher"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VoucherManagement;
