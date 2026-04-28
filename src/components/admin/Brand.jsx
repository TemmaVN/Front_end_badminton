import React from 'react';
import { Edit2, Trash2, Plus, Globe, Package } from 'lucide-react';

const Brand = () => {
  // Dữ liệu mẫu khớp với các hãng cầu lông lớn
  const brands = [
    { id: 1, name: 'Yonex', origin: 'Japan', productCount: 450, logo: 'Y' },
    { id: 2, name: 'Lining', origin: 'China', productCount: 320, logo: 'L' },
    { id: 3, name: 'Victor', origin: 'Taiwan', productCount: 280, logo: 'V' },
    { id: 4, name: 'Mizuno', origin: 'Japan', productCount: 150, logo: 'M' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Thương hiệu</h2>
          <p className="text-sm text-slate-500">Quản lý các đối tác và nhãn hàng cung cấp</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all">
          <Plus size={20} /> Thêm Brand
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-black text-xl">
                {brand.logo}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 rounded-lg"><Edit2 size={14}/></button>
                <button className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{brand.name}</h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Globe size={14} /> <span>Xuất xứ: {brand.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Package size={14} /> <span>{brand.productCount} sản phẩm</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;