import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save } from 'lucide-react';
import {useProduct} from "../../contexts/ProductContext";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {addProduct} = useProduct();
  
  const [productName]
  
  // State cho form thêm sản phẩm mới (khớp với CreateProductRequest bên C#)
  const [newProduct, setNewProduct] = useState({
    productName: '',
    brandId: 1,
    categoryId: 1,
    description: '',
    basePrice: 0,
    discountPrice: 0,
    mainImageUrl: '',
    productDetailRequests: [
      { serialNumber: '', weightClass: '', gripSize: '', stockQuantity: 1, price: 0 }
    ]
  });

  // Giả lập fetch dữ liệu từ API GetProductsForHomePageAsync
  useEffect(() => {
    // const data = await productService.getAll();
    const mockData = [
      { productId: 1, productName: 'Yonex Astrox 88D Pro', categoryName: 'Racket', brandName: 'Yonex', basePrice: 4500000, sellingPrice: 4200000, stock: 24, status: 'Active', slug: 'racket-yonex-astrox-88d-pro' },
    ];
    setProducts(mockData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await addProduct(newProduct);
      setProducts([...products, response.data]);
      
      setIsModalOpen(false);
      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Product Inventory</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64" />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Product Name</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Category/Brand</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Price (VND)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{item.productName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.slug}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700">{item.brandName}</div>
                    <div className="text-xs text-slate-500">{item.categoryName}</div>
                  </td>
                  <td className="p-4 text-sm font-semibold">
                    {item.sellingPrice?.toLocaleString()}₫
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">ACTIVE</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={16} /></button>
                      <button className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">New Product</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input name="productName" onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: Yonex Astrox..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand ID</label>
                  <input type="number" name="brandId" onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category ID</label>
                  <input type="number" name="categoryId" onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price</label>
                  <input type="number" name="basePrice" onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Main Image URL</label>
                  <input name="mainImageUrl" onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-slate-700">Product Details (Specifications)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="Serial No" className="p-2 text-sm border rounded-lg" />
                  <input placeholder="Weight (4U/3U)" className="p-2 text-sm border rounded-lg" />
                  <input placeholder="Grip Size" className="p-2 text-sm border rounded-lg" />
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Save size={18} /> Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;