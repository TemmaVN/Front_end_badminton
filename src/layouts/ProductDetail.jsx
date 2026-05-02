import React, { useState } from 'react';
import FlashButton from '../components/FlashButton';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useProduct } from "../contexts/ProductContext";

const ProductDetail = (
) => {
  const { currentProduct, setCurrentProduct } = useProduct();
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const tabs = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'specs', label: 'Thông số kỹ thuật' },
    { id: 'reviews', label: 'Đánh giá 0 ⭐' },
  ];
    useEffect(() => {
      fetchCart();
    }, []);
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <nav className="flex text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <a href="#" className="hover:text-orange-500">Trang chủ</a>
          <span className="mx-2">/</span>
          <a href="#" className="hover:text-orange-500">Phụ kiện thể thao</a>
          <span className="mx-2">/</span>
          <a href="#" className="hover:text-orange-500">Phụ kiện cầu lông</a>
          <span className="mx-2">/</span>
          <span className="text-orange-500 font-medium">Cước Đan Vợt Cầu Lông Yonex BG80 Power JP</span>
        </nav>

        {/* TOP SECTION: PRODUCT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left: Images */}
          <div>
            <div className="border border-gray-100 rounded-xl p-4 flex justify-center mb-4">
              <img src="https://fbshop.vn/wp-content/uploads/2023/04/bg-80-power-jp.jpg" alt="Yonex BG80 Power" className="max-h-[500px] object-contain" />
            </div>
            <div className="flex gap-3 overflow-x-auto">
               <img src={currentProduct.image} className="w-20 h-20 border rounded-lg p-1 flex-shrink-0 cursor-pointer hover:border-orange-500" />
            </div>
          </div>

          {/* Right: Summary & Order */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-snug">
              {currentProduct.productName}
            </h1>
            <div className="mb-4"><span className="bg-teal-400 text-white px-3 py-1 rounded text-xs font-bold uppercase">✨ Mới</span></div>
            
            <div className="flex gap-6 text-sm mb-6 pb-6 border-b border-gray-100">
              <p>Xuất xứ: <span className="font-bold text-gray-900">Nhật Bản</span></p>
              <p>Tình trạng: <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs border border-red-100">Hết hàng</span></p>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-orange-500">{currentProduct.sellingPrice}</span>
              {currentProduct.sellingPrice !== currentProduct.basePrice && <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-sm font-bold">-{currentProduct.discountPercent}%</span>}
              {currentProduct.sellingPrice !== currentProduct.basePrice && <span className="text-xl text-gray-400 line-through">{currentProduct.basePrice}</span>}
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-orange-800 mb-8">
              Liên hệ hotline <span className="font-bold">0979.170.274</span> để được tư vấn và đặt hàng nhanh nhất!
            </div>

            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-full px-4 py-2 w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))}>-</button>
                <span className="font-bold">{quantity < 10 ? `0${quantity}` : quantity}</span>
                <button onClick={() => setQuantity(quantity+1)}>+</button>
              </div>
            </div>

            <div className='flex  gap-4'>
              <Button 
              onClick={() => navigate("/cart")}
              className={`w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark`}>
                Thêm vào giỏ
              </Button>
               <Button className={`w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark`} >
                Mua ngay
               </Button>
            </div>
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