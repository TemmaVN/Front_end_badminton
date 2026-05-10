import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Edit2, Trash2, Plus, Hash, Loader2, X, Save, AlertCircle } from 'lucide-react';
import { useProduct } from '../../contexts/ProductContext';
import { useParams } from 'react-router-dom';

const DEFAULT_VARIANT_FORM = {
  weightClass: '', gripSize: '', balancePoint: '', stiffness: '',
  maxTension: '', price: '',
  serials: [{ serialNumber: '', stockQuantity: 1 }],
};
const DEFAULT_SERIAL_FORM = { serialNumber: '', price: '', stockQuantity: 1 };

const AdminProductDetail = () => {
  const { productSlug } = useParams();
  const { getProductDetaildBySlug, addProductDetails } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Modal state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetVariant, setTargetVariant] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [variantForm, setVariantForm] = useState(DEFAULT_VARIANT_FORM);
  const [serialForm, setSerialForm] = useState(DEFAULT_SERIAL_FORM);
  const [editForm, setEditForm] = useState({
    weightClass: '', gripSize: '', balancePoint: '', stiffness: '', maxTension: '', price: '',
  });

  const loadProduct = async () => {
    setLoading(true);
    try {
      const result = await getProductDetaildBySlug(productSlug);
      if (result) setProduct(result);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productSlug]);

  // Group flat variants list by specs combination
  const groupedVariants = useMemo(() => {
    if (!product?.variants?.length) return [];
    const map = new Map();
    product.variants.forEach((v) => {
      const key = `${v.weightClass ?? ''}|${v.gripSize ?? ''}|${v.balancePoint ?? ''}|${v.stiffness ?? ''}|${v.maxTension ?? ''}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          weightClass: v.weightClass,
          gripSize: v.gripSize,
          balancePoint: v.balancePoint,
          stiffness: v.stiffness,
          maxTension: v.maxTension,
          price: v.price,
          serials: [],
        });
      }
      map.get(key).serials.push(v);
    });
    return Array.from(map.values());
  }, [product?.variants]);

  const toggleExpanded = (key) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    setModalError(null);
    const dupes = variantForm.serials.map((s) => s.serialNumber.trim()).filter(Boolean);
    if (new Set(dupes).size !== dupes.length) {
      setModalError('Số seri trong danh sách bị trùng nhau.');
      return;
    }
    setModalLoading(true);
    const result = await addProductDetails(product.productId, {
      productDetailRequests: variantForm.serials.map((s) => ({
        serialNumber:  s.serialNumber.trim(),
        weightClass:   variantForm.weightClass.trim()  || null,
        gripSize:      variantForm.gripSize.trim()      || null,
        balancePoint:  variantForm.balancePoint.trim()  || null,
        stiffness:     variantForm.stiffness.trim()     || null,
        maxTension:    variantForm.maxTension ? parseInt(variantForm.maxTension) : null,
        price:         parseFloat(variantForm.price),
        stockQuantity: parseInt(s.stockQuantity) || 1,
      })),
    });
    setModalLoading(false);
    if (result) {
      setIsVariantModalOpen(false);
      setVariantForm(DEFAULT_VARIANT_FORM);
      await loadProduct();
    } else {
      setModalError('Thêm thất bại. Kiểm tra lại số seri (có thể đã tồn tại).');
    }
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setEditForm({
      weightClass:  group.weightClass  ?? '',
      gripSize:     group.gripSize     ?? '',
      balancePoint: group.balancePoint ?? '',
      stiffness:    group.stiffness    ?? '',
      maxTension:   group.maxTension   ?? '',
      price:        group.price        ?? '',
    });
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const handleAddSerial = async (e) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);
    const result = await addProductDetails(product.productId, {
      productDetailRequests: [{
        serialNumber:  serialForm.serialNumber.trim(),
        weightClass:   targetVariant.weightClass,
        gripSize:      targetVariant.gripSize,
        balancePoint:  targetVariant.balancePoint,
        stiffness:     targetVariant.stiffness,
        maxTension:    targetVariant.maxTension,
        price:         serialForm.price ? parseFloat(serialForm.price) : targetVariant.price,
        stockQuantity: parseInt(serialForm.stockQuantity) || 1,
      }],
    });
    setModalLoading(false);
    if (result) {
      setIsSerialModalOpen(false);
      setSerialForm(DEFAULT_SERIAL_FORM);
      setTargetVariant(null);
      await loadProduct();
    } else {
      setModalError('Thêm thất bại. Số seri có thể đã tồn tại.');
    }
  };

  const openSerialModal = (variant) => {
    setTargetVariant(variant);
    setSerialForm({ serialNumber: '', price: variant.price?.toString() ?? '', stockQuantity: 1 });
    setModalError(null);
    setIsSerialModalOpen(true);
  };

  const formatPrice = (price) =>
    price != null ? Number(price).toLocaleString('vi-VN') + ' ₫' : '—';

  if (loading) return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Danh sách sản phẩm</span>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-800">{product.productName}</span>
      </div>

      {/* Product Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex gap-6">
        <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
          {product.mainImageUrl
            ? <img src={product.mainImageUrl} alt="product" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-4xl">🏸</div>
          }
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{product.productName}</h1>
          <p className="text-gray-400 text-xs mb-3">{productSlug}</p>
          <p className="text-gray-500 text-sm mb-4 max-w-2xl">
            {product.description || 'Chưa có mô tả sản phẩm nào'}
          </p>
          <div className="grid grid-cols-5 gap-8 border-t pt-4">
            <div><p className="text-gray-400 text-xs">Giá gốc</p><p className="font-bold text-gray-800">{formatPrice(product.basePrice)}</p></div>
            <div><p className="text-gray-400 text-xs">Giá KM</p><p className="font-bold text-green-500">{formatPrice(product.sellingPrice)}</p></div>
            <div><p className="text-gray-400 text-xs">Giảm</p><p className="font-bold text-orange-500">{product.discountPercent ?? 0}%</p></div>
            <div><p className="text-gray-400 text-xs">Biến thể</p><p className="font-bold text-gray-800">{groupedVariants.length}</p></div>
            <div><p className="text-gray-400 text-xs">Tổng serial</p><p className="font-bold text-blue-600">{product.variants?.length ?? 0}</p></div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <div className="p-1 bg-green-100 rounded text-green-600"><Plus size={16} /></div>
            Biến thể / Detail
            <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
              {groupedVariants.length}
            </span>
          </div>
          <button
            onClick={() => { setVariantForm(DEFAULT_VARIANT_FORM); setModalError(null); setIsVariantModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF8C00] to-[#E65100] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Thêm biến thể
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">STT</div>
          <div className="col-span-3">Thông số vật lý</div>
          <div className="col-span-3">Kỹ thuật</div>
          <div className="col-span-2">Giá</div>
          <div className="col-span-1">SL</div>
          <div className="col-span-2 text-right">Thao tác</div>
        </div>

        {/* Variant Rows */}
        {groupedVariants.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Chưa có biến thể nào</div>
        ) : (
          groupedVariants.map((group, idx) => (
            <div key={group.key} className="border-b last:border-0">
              <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50">
                {/* STT + toggle */}
                <div
                  className="col-span-1 flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none"
                  onClick={() => toggleExpanded(group.key)}
                >
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${expandedItems.has(group.key) ? 'rotate-180' : ''}`}
                  />
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Thông số vật lý */}
                <div className="col-span-3 flex flex-wrap gap-1.5">
                  {group.weightClass  && <span className="px-2 py-1 bg-blue-50   text-blue-600   rounded text-[10px] font-bold">{group.weightClass}</span>}
                  {group.gripSize     && <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[10px] font-bold">{group.gripSize}</span>}
                  {group.balancePoint && <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">{group.balancePoint}</span>}
                </div>

                {/* Kỹ thuật */}
                <div className="col-span-3 flex flex-wrap gap-1.5">
                  {group.stiffness   && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{group.stiffness}</span>}
                  {group.maxTension  && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{group.maxTension} lbs</span>}
                </div>

                {/* Giá */}
                <div className="col-span-2 font-bold text-gray-800 text-sm">{formatPrice(group.price)}</div>

                {/* Số lượng serial */}
                <div className="col-span-1">
                  <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-bold text-xs">
                    {group.serials.length}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2 items-center">
                  <button
                    onClick={() => openSerialModal(group)}
                    className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors"
                  >
                    <Plus size={11} /> Seri
                  </button>
                  <button
                    onClick={() => toggleExpanded(group.key)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100"
                  >
                    <Hash size={11} /> {group.serials.length}
                  </button>
                  <Edit2
                    size={15}
                    className="text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => openEditModal(group)}
                  />
                  <Trash2
                    size={15}
                    className="text-gray-300 cursor-not-allowed"
                    title="Can backend endpoint DELETE /ProductDetail/{id}"
                  />
                </div>
              </div>

              {/* Serial Numbers Sub-grid */}
              {expandedItems.has(group.key) && (
                <div className="px-6 pb-6 pt-2">
                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase">
                        Serial Numbers ({group.serials.length} tổng)
                      </h4>
                      <div className="flex gap-4 text-[10px] font-bold uppercase">
                        <span className="text-green-500">
                          Còn hàng: <span className="text-green-600">{group.serials.filter((s) => s.inStock).length}</span>
                        </span>
                        <span className="text-gray-400">
                          Hết hàng: {group.serials.filter((s) => !s.inStock).length}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {group.serials.map((sn) => (
                        <div
                          key={sn.detailId}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                            sn.inStock
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${sn.inStock ? 'bg-green-500' : 'bg-gray-400'}`} />
                          Detail #{sn.detailId}
                          {sn.stockQuantity > 0 && (
                            <span className="text-[9px] opacity-60">×{sn.stockQuantity}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Modal: Thêm biến thể ── */}
      {isVariantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Thêm biến thể mới</h3>
              <button onClick={() => setIsVariantModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddVariant} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Weight Class</label>
                  <input
                    placeholder="VD: 3U, 4U"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.weightClass}
                    onChange={(e) => setVariantForm((p) => ({ ...p, weightClass: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grip Size</label>
                  <input
                    placeholder="VD: G4, G5"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.gripSize}
                    onChange={(e) => setVariantForm((p) => ({ ...p, gripSize: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Balance Point</label>
                  <input
                    placeholder="VD: Head Heavy"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.balancePoint}
                    onChange={(e) => setVariantForm((p) => ({ ...p, balancePoint: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stiffness</label>
                  <input
                    placeholder="VD: Stiff, Extra Stiff"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.stiffness}
                    onChange={(e) => setVariantForm((p) => ({ ...p, stiffness: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Tension (lbs)</label>
                  <input
                    type="number"
                    placeholder="VD: 30"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.maxTension}
                    onChange={(e) => setVariantForm((p) => ({ ...p, maxTension: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Giá (VND) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="VD: 5200000"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
              </div>
              {/* Serial rows */}
              <div className="border border-gray-100 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">Danh sach so seri *</span>
                  <button
                    type="button"
                    onClick={() => setVariantForm((p) => ({ ...p, serials: [...p.serials, { serialNumber: '', stockQuantity: 1 }] }))}
                    className="text-xs text-green-600 font-bold hover:text-green-700"
                  >
                    + Them seri
                  </button>
                </div>
                <div className="grid grid-cols-10 gap-2 text-[10px] text-gray-400 font-semibold uppercase px-1">
                  <span className="col-span-7">So seri</span>
                  <span className="col-span-2">So luong</span>
                </div>
                {variantForm.serials.map((row, i) => (
                  <div key={i} className="grid grid-cols-10 gap-2 items-center">
                    <input
                      required
                      placeholder="VD: SN-D3-001"
                      className="col-span-7 p-2 bg-gray-100 rounded-lg text-xs outline-none"
                      value={row.serialNumber}
                      onChange={(e) => setVariantForm((p) => {
                        const s = [...p.serials];
                        s[i] = { ...s[i], serialNumber: e.target.value };
                        return { ...p, serials: s };
                      })}
                    />
                    <input
                      type="number"
                      min="1"
                      className="col-span-2 p-2 bg-gray-100 rounded-lg text-xs outline-none"
                      value={row.stockQuantity}
                      onChange={(e) => setVariantForm((p) => {
                        const s = [...p.serials];
                        s[i] = { ...s[i], stockQuantity: e.target.value };
                        return { ...p, serials: s };
                      })}
                    />
                    <button
                      type="button"
                      disabled={variantForm.serials.length === 1}
                      onClick={() => setVariantForm((p) => ({ ...p, serials: p.serials.filter((_, idx) => idx !== i) }))}
                      className="col-span-1 text-red-400 hover:text-red-600 disabled:opacity-30 font-bold text-base text-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#E65100] text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {modalLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Lưu biến thể
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Sua bien the ── */}
      {isEditModalOpen && editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">Sua bien the</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <X size={18} />
              </button>
            </div>

            {/* Note về giới hạn backend */}
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              Chi chỉnh sửa thông số hiển thị. Để cập nhật giá hoặc specs lên database, backend cần trả về SerialNumber trong response GET.
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setIsEditModalOpen(false); }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'weightClass',  label: 'Weight Class',     placeholder: 'VD: 3U, 4U' },
                  { key: 'gripSize',     label: 'Grip Size',         placeholder: 'VD: G4, G5' },
                  { key: 'balancePoint', label: 'Balance Point',     placeholder: 'VD: Head Heavy' },
                  { key: 'stiffness',    label: 'Stiffness',         placeholder: 'VD: Stiff' },
                  { key: 'maxTension',   label: 'Max Tension (lbs)', placeholder: 'VD: 30', type: 'number' },
                  { key: 'price',        label: 'Gia (VND)',         placeholder: '5200000', type: 'number' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type={type ?? 'text'}
                      placeholder={placeholder}
                      className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                      value={editForm[key]}
                      onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={16} /> Dong
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Thêm seri ── */}
      {isSerialModalOpen && targetVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">Thêm số seri</h3>
              <button
                onClick={() => { setIsSerialModalOpen(false); setTargetVariant(null); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Biến thể: {[targetVariant.weightClass, targetVariant.gripSize, targetVariant.stiffness].filter(Boolean).join(' · ')}
            </p>

            {modalError && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddSerial} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Số seri *</label>
                <input
                  required
                  placeholder="VD: SN-D2-1-0010"
                  className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                  value={serialForm.serialNumber}
                  onChange={(e) => setSerialForm((p) => ({ ...p, serialNumber: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Giá (để trống = giá biến thể)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder={targetVariant.price}
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={serialForm.price}
                    onChange={(e) => setSerialForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 bg-gray-100 rounded-xl text-sm outline-none"
                    value={serialForm.stockQuantity}
                    onChange={(e) => setSerialForm((p) => ({ ...p, stockQuantity: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#E65100] text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {modalLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Lưu số seri
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetail;
