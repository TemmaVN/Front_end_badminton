import React from 'react';
import { useCategory } from '../../contexts/CategoryContext'; // Đảm bảo đúng đường dẫn
import { Loader2, Box, ChevronRight } from 'lucide-react';

const Categories = () => {
  const { categories, loading } = useCategory();

  const getCategoryDisplay = (name) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('vợt') || lowerName.includes('racket')) 
    return { icon: '🏸', color: 'bg-orange-100 text-orange-600' };
    
  if (lowerName.includes('giày') || lowerName.includes('shoe')) 
    return { icon: '👟', color: 'bg-blue-100 text-blue-600' };
    
  if (lowerName.includes('áo') || lowerName.includes('quần') || lowerName.includes('apparel')) 
    return { icon: '👕', color: 'bg-purple-100 text-purple-600' };
    
  if (lowerName.includes('phụ kiện') || lowerName.includes('accessory')) 
    return { icon: '🎒', color: 'bg-amber-100 text-amber-600' };

  if (lowerName.includes('cước') || lowerName.includes('string')) 
    return { icon: '🧵', color: 'bg-rose-100 text-rose-600' };

  if (lowerName.includes('quả') || lowerName.includes('shuttle')) 
    return { icon: '🏸', color: 'bg-emerald-100 text-emerald-600' };

  return { icon: '📦', color: 'bg-slate-100 text-slate-600' };
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-slate-500 font-medium">Đang tải danh mục...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories && categories.length > 0 ? (
        categories.map((cat) => {
          const display = getCategoryDisplay(cat.categoryName);
          
          return (
            <div 
              key={cat.categoryId} 
              className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Trang trí nền khi hover */}
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />

              <div className="relative z-10">
                <div className={`w-14 h-14 ${display.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {display.icon}
                </div>
                
                <h4 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">
                  {cat.categoryName}
                </h4>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    /{cat.slug}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center p-10 bg-slate-50 rounded-2xl border border-dashed">
          <Box className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500">Không có danh mục nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;