import React, { useState, useEffect} from 'react';
import { ChevronDown, Edit2, Trash2, Plus, Hash } from 'lucide-react';
import {useProduct} from '../../contexts/ProductContext';
import { useParams, useNavigate } from "react-router-dom";

const AdminProductDetail = () => {
  // Mock data dựa trên hình ảnh
  const productInfo = {
    name: "Victor Thruster K Falcon",
    brand: "Victor",
    category: "Vợt cầu lông",
    slug: "/victor-thruster-k-falcon",
    description: "Vợt cầu lông cao cấp từ Victor, thiết kế khung Pyrofil mang lại sức mạnh tấn công vượt trội, trọng lượng nhẹ.",
    stats: { originalPrice: "5.500.000 đ", salePrice: "5.200.000 đ", sold: 21, stock: 6, totalSerial: 7 }
  };

  const variants = [
    {
      id: "d2-1",
      specs: ["3U (85-89g)", "G4", "Head Heavy"],
      tech: ["Extra Stiff", "33 lbs"],
      price: "5.200.000 đ",
      stock: 4,
      serials: [
        { code: "SN-D2-1-0001", status: "available" },
        { code: "SN-D2-1-0002", status: "available" },
        { code: "SN-D2-1-0003", status: "available" },
        { code: "SN-D2-1-0004", status: "available" },
        { code: "SN-D2-1-0005", status: "sold" },
      ]
    },
    {
      id: "d2-2",
      specs: ["4U (80-84g)", "G5", "Head Heavy"],
      tech: ["Stiff", "30 lbs"],
      price: "5.200.000 đ",
      stock: 2,
      serials: [
        { code: "SN-D2-2-0001", status: "available" },
        { code: "SN-D2-2-0002", status: "pending" },
      ]
    }
  ];

  const {productSlug} = useParams();
  const { getProductDetaildBySlug } = useProduct();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedGrip, setSelectedGrip] = useState(null);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  };

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
  console.log(product)
  if (loading) return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Danh sách sản phẩm</span>
        <span className="mx-2 px-1">&gt;</span>
        <span className="font-medium text-gray-800">{product.productName}</span>
      </div>

      {/* Product Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex gap-6">
        <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden">
            <img src="https://via.placeholder.com/150" alt="product" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
          </div>
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-100">{productInfo.brand}</span>
            <span className="px-3 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">{productInfo.category}</span>
            <span className="text-gray-400 text-xs mt-1">{productSlug}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 max-w-2xl">{product.description || 'Chưa có mô tả sản phẩm nào'}</p>
          
          <div className="grid grid-cols-5 gap-8 border-t pt-4">
            <div><p className="text-gray-400 text-xs">Giá gốc</p><p className="font-bold text-gray-800">{product.basePrice}</p></div>
            <div><p className="text-gray-400 text-xs">Giá KM</p><p className="font-bold text-green-500">{product.sellingPrice}</p></div>
            <div><p className="text-gray-400 text-xs">Đã bán</p><p className="font-bold text-gray-800">{productInfo.stats.sold}</p></div>
            <div><p className="text-gray-400 text-xs">Tồn kho</p><p className="font-bold text-green-500">{productInfo.stats.stock}</p></div>
            <div><p className="text-gray-400 text-xs">Tổng serial</p><p className="font-bold text-blue-600">{productInfo.stats.totalSerial}</p></div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b">
          <div className="flex items-center gap-2 font-bold text-gray-800">
             <div className="p-1 bg-green-100 rounded text-green-600"><Plus size={16}/></div>
             Biến thể / Detail <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">{variants.length}</span>
          </div>
          {/* Custom Gradient Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF8C00] to-[#E65100] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={18} /> Thêm biến thể
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">Detail ID</div>
          <div className="col-span-3">Thông số vật lý</div>
          <div className="col-span-3">Kỹ thuật</div>
          <div className="col-span-2">Giá</div>
          <div className="col-span-1">Tồn kho</div>
          <div className="col-span-2 text-right">Thao tác</div>
        </div>

        {/* Variant Rows */}
        {variants.map((v, idx) => (
          <div key={v.id} className="border-b last:border-0">
            <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50">
              <div className="col-span-1 flex items-center gap-2 text-sm text-gray-600">
                <ChevronDown size={16} className="text-gray-400" /> {v.id}
              </div>
              <div className="col-span-3 flex gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{v.specs[0]}</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[10px] font-bold">{v.specs[1]}</span>
                <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">{v.specs[2]}</span>
              </div>
              <div className="col-span-3 flex gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{v.tech[0]}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{v.tech[1]}</span>
              </div>
              <div className="col-span-2 font-bold text-gray-800 text-sm">{v.price}</div>
              <div className="col-span-1">
                <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-bold text-xs">{v.stock}</span>
              </div>
              <div className="col-span-2 flex justify-end gap-3 items-center">
                <button className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                  <Hash size={12}/> {v.serials.length} SNs
                </button>
                <Edit2 size={16} className="text-gray-400 cursor-pointer hover:text-blue-500" />
                <Trash2 size={16} className="text-gray-400 cursor-pointer hover:text-red-500" />
              </div>
            </div>

            {/* Serial Numbers Sub-grid */}
            <div className="px-6 pb-6 pt-2">
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-gray-700 uppercase">Serial Numbers ({v.serials.length} tổng)</h4>
                        <div className="flex gap-4 text-[10px] font-bold uppercase">
                            <span className="text-green-500">Còn hàng: <span className="text-green-600">4</span></span>
                            <span className="text-gray-400">Đã bán: 1</span>
                            <span className="text-gray-400">Đã đặt: 0</span>
                            <span className="text-red-400">Lỗi: 0</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {v.serials.map((sn, sIdx) => (
                            <div key={sIdx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                sn.status === 'available' ? 'bg-green-50 text-green-700 border-green-100' : 
                                sn.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                'bg-gray-100 text-gray-500 border-gray-200 opacity-60'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    sn.status === 'available' ? 'bg-green-500' : 
                                    sn.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                                }`}></div>
                                {sn.code}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductDetail;