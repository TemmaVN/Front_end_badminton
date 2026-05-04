import React, { useState, useEffect } from 'react';
import FlashButton from '../components/FlashButton';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";


const ProductDetail = (
) => {
  const { productSlug } = useParams();
const [loading, setLoading] = useState(true);
const { getCart, addToCart, fetchCart } = useCart();
const { getProductDetaildBySlug } = useProduct();
const [activeTab, setActiveTab] = useState('description');
const [quantity, setQuantity] = useState(1);
const [product, setProduct] = useState(null);
const navigate = useNavigate();

const tabs = [
  { id: 'description', label: 'Mô tả sản phẩm' },
  { id: 'specs', label: 'Thông số kỹ thuật' },
  { id: 'reviews', label: 'Đánh giá 0 ⭐' },
];

// Thêm state cho variant
const [selectedWeight, setSelectedWeight] = useState(null);
const [selectedGrip, setSelectedGrip] = useState(null);

useEffect(() => {
  const loadProduct = async () => {
    setLoading(true); // ✅ Thêm loading khi bắt đầu fetch
    try {
      const result = await getProductDetaildBySlug(productSlug);
      if (result) {
        setProduct(result);
        console.log('Product loaded:', result);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false); // ✅ Set loading false sau khi fetch xong
    }
  };
  loadProduct();
}, [productSlug]);

// ✅ Khởi tạo variant mặc định khi product load xong
useEffect(() => {
  if (product?.variants?.length > 0) {
    // Chỉ set nếu chưa có variant được chọn
    if (!selectedWeight || !selectedGrip) {
      setSelectedWeight(product.variants[0].weightClass);
      setSelectedGrip(product.variants[0].gripSize);
    }
  }
}, [product]);

// Helper functions với kiểm tra null an toàn
const weightOptions = [...new Set(product?.variants?.map(v => v.weightClass) ?? [])];
const gripOptions = [...new Set(product?.variants?.map(v => v.gripSize) ?? [])];

const isWeightAvailable = (w) => {
  if (!product?.variants) return false;
  return product.variants.some(v => v.weightClass === w && v.gripSize === selectedGrip);
};

const isGripAvailable = (g) => {
  if (!product?.variants) return false;
  return product.variants.some(v => v.gripSize === g && v.weightClass === selectedWeight);
};

// ✅ selectedVariant với fallback an toàn
const selectedVariant = product?.variants?.find(
  v => v.weightClass === selectedWeight && v.gripSize === selectedGrip
) || product?.variants?.[0]; // Fallback về variant đầu tiên nếu không tìm thấy

console.log('Selected variant:', selectedVariant);

const handleSelectWeight = (w) => {
  if (!isWeightAvailable(w)) return;
  setSelectedWeight(w);
  // Fallback grip nếu combo không tồn tại
  if (!product.variants.find(v => v.weightClass === w && v.gripSize === selectedGrip)) {
    const fallback = product.variants.find(v => v.weightClass === w);
    if (fallback) setSelectedGrip(fallback.gripSize);
  }
};

const handleSelectGrip = (g) => {
  if (!isGripAvailable(g)) return;
  setSelectedGrip(g);
};

// ✅ Xử lý add to cart an toàn
const handleAddToCart = async () => {
  // Kiểm tra variant tồn tại
  if (!selectedVariant?.detailId) {
    alert('Vui lòng chọn phân loại sản phẩm!');
    return;
  }
  
  try {
    const result = await addToCart(selectedVariant.detailId, quantity);
    if (result) {
      fetchCart();
      setQuantity(1);
      alert('Đã thêm vào giỏ hàng!');
    }
  } catch (err) {
    console.error('Failed to add to cart:', err);
    alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
  }
};

// ✅ Xử lý order an toàn
const handleOrder = () => {
  // Kiểm tra variant tồn tại
  if (!selectedVariant?.detailId) {
    alert('Vui lòng chọn phân loại sản phẩm!');
    return;
  }

  navigate("/cart", {
    state: {
      productItem: {
        detailId: selectedVariant.detailId,
        imageUrl: product.image,
        productName: product.productName,
        variantInfo: `${selectedVariant.weightClass} / ${selectedVariant.gripSize}`,
        quantity: quantity,
        unitPrice: product.sellingPrice,
        subTotal: product.sellingPrice * quantity,
      }
    }
  });
};
  if (loading) return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  if (!product) return <div className="text-center py-20">Không tìm thấy sản phẩm</div>;
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BREADCRUMB */}

        {/* TOP SECTION: PRODUCT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left: Images */}
          <div>
            <div className="border border-gray-100 rounded-xl p-4 flex justify-center mb-4">
              <img src={product.image} alt="Yonex BG80 Power" className="max-h-[500px] object-contain" />
            </div>
            <div className="flex gap-3 overflow-x-auto">
               <img src={product.image} className="w-20 h-20 border rounded-lg p-1 flex-shrink-0 cursor-pointer hover:border-orange-500" />
            </div>
          </div>

          {/* Right: Summary & Order */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-snug">
              {product.productName}
            </h1>
            <div className="mb-4"><span className="bg-teal-400 text-white px-3 py-1 rounded text-xs font-bold uppercase">✨ Mới</span></div>
            
            <div className="flex gap-6 text-sm mb-6 pb-6 border-b border-gray-100">
              <p>Xuất xứ: <span className="font-bold text-gray-900">Nhật Bản</span></p>
              <p>Tình trạng: {
                !selectedVariant.inStock ? <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs border border-red-100">Hết hàng</span> : <span className="bg-green-50 text-green-500 px-3 py-1 rounded-full text-xs border border-green-100">Còn hàng</span>
                  }</p>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-orange-500">{product.sellingPrice}</span>
              {product.sellingPrice !== product.basePrice && <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-sm font-bold">-{product.discountPercent}%</span>}
              {product.sellingPrice !== product.basePrice && <span className="text-xl text-gray-400 line-through">{product.basePrice}</span>}
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-orange-800 mb-8">
              Liên hệ hotline <span className="font-bold">0979.170.274</span> để được tư vấn và đặt hàng nhanh nhất!
            </div>
            {/* Variant Selector */}
        <div className="mb-6 space-y-5">
          {/* Weight Class */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Trọng lượng: <span className="text-gray-900">{selectedWeight}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {weightOptions.map(w => {
                const avail = isWeightAvailable(w);
                return (
                  <button
                    key={w}
                    onClick={() => handleSelectWeight(w)}
                    disabled={!avail}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all
                      ${selectedWeight === w
                        ? 'border-orange-500 bg-orange-50 text-orange-500'
                        : avail
                          ? 'border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-400'
                          : 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                      }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

      {/* Grip Size */}
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Cỡ cán: <span className="text-gray-900">{selectedGrip}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {gripOptions.map(g => {
            const avail = isGripAvailable(g);
            return (
              <button
                key={g}
                onClick={() => handleSelectGrip(g)}
                disabled={!avail}
                className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all
                  ${selectedGrip === g
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : avail
                      ? 'border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-400'
                      : 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thông tin variant được chọn */}
      {selectedVariant && (
        <div className="flex flex-wrap gap-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
          <span>Cân bằng: <strong className="text-gray-800">{selectedVariant.balancePoint}</strong></span>
          <span>Độ cứng: <strong className="text-gray-800">{selectedVariant.stiffness}</strong></span>
          <span>Căng max: <strong className="text-gray-800">{selectedVariant.maxTension} lbs</strong></span>
          <span>Tồn kho: <strong className="text-gray-800">{selectedVariant.stockQuantity} cái</strong></span>
        </div>
      )}
    </div>

            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-full px-4 py-2 w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))}>-</button>
                <span className="font-bold">{quantity < 10 ? `0${quantity}` : quantity}</span>
                <button onClick={() => setQuantity(Math.min(quantity+1, selectedVariant.stockQuantity))}>+</button>
              </div>
            </div>
            {selectedVariant.inStock?
                <div className='flex gap-4'>
                <Button 
                onClick={() => {
                  handleAddToCart();
                }}
                className={`w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark`}>
                  Thêm vào giỏ
                </Button>
                <Button 
                onClick={() => handleOrder()}
                className={`w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark`} >
                  Mua ngay
                </Button>
              </div>
              : <Button className={`w-50 rounded-2xl bg-gray-200 text-slate-400 hover:cursor-not-allowed`} disabled={true}>
                  Đang hết hàng
              </Button>
            }
          </div>
        </div>

        {/* BOTTOM SECTION: TABS & CONTENT */}
        <div className="mt-12 bg-[#FFF7F2] rounded-3xl p-6 md:p-10 border border-orange-50">
          {/* Tab Headers */}
          <div className="flex flex-wrap gap-4 mb-8 border-b border-orange-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-4 font-bold text-lg transition-all relative ${
                  activeTab === tab.id 
                  ? 'text-orange-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-gray-700 leading-relaxed text-lg">
            {activeTab === 'description' && (
              <div className="space-y-6 animate-fadeIn">
                <p>
                  <span className="font-bold text-red-600">Cước đan vợt cầu lông Yonex BG80 Power JP</span> từ lâu đã khẳng định được vị thế của mình...
                </p>
                <p>Với độ cứng đặc trưng và âm thanh nổ đanh thép, sợi cước này không chỉ mang lại cảm giác cầu chân thực...</p>
                
                <h2 className="text-2xl font-bold text-slate-800 mt-8">1. Giới thiệu cước đan vợt cầu lông Yonex BG80 Power JP</h2>
                <p>Cước đan vợt cầu lông Yonex BG80 Power JP là phiên bản nâng cấp hoàn hảo của dòng BG80 huyền thoại...</p>
                
                <div className="my-8 rounded-2xl overflow-hidden shadow-sm">
                  <img src="https://fbshop.vn/wp-content/uploads/2023/04/bg-80-power-jp-1.jpg" alt="Mô tả" className="w-full" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800">3. Công nghệ tích hợp</h2>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Công nghệ Multi Filament:</strong> Giúp sợi dây có độ đàn hồi cực cao...</li>
                  <li><strong>Pha sợi Vectran:</strong> Tăng cường độ cứng cho dây, giữ sức căng ổn định...</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="animate-fadeIn space-y-4 max-w-2xl">
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Mã sản phẩm</span>
                  <span className="font-bold">BG 80 POWER (Mã JP)</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Đường kính dây</span>
                  <span className="font-bold">0.68 mm</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Chiều dài</span>
                  <span className="font-bold">10 mét</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Cảm giác đánh</span>
                  <span className="font-bold text-red-600">Cứng (Hard Feeling)</span>
                </div>
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Nguồn gốc</span>
                  <span className="font-bold">Nhật Bản</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="py-20 text-center text-gray-400 animate-fadeIn">
                Chưa có đánh giá nào cho sản phẩm này.
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab(false)}
            className="mt-10 mx-auto block text-orange-500 font-bold border-b border-orange-500 hover:text-orange-700 transition-colors">
            Thu gọn
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;