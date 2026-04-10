import React, { memo } from 'react';
import PriceFilter from './PriceFilter';
import ProductCategory from './ProductCategory';

const Filter = memo(({ setRangePrice, rangePrice, className }) => {
  // Giả lập danh sách Thương hiệu dài để test thanh cuộn
  const brandList = [
    "Yonex", "Victor", "Lining", "Lefus", "Kamito", "Mizuno", 
    "Kawasaki", "Kumpoo", "Proace", "Apacs", "Kizuna", "Aolikes",
    "Ashaway", "Zubon", "Forza", "Felet", "Fleet"
  ];

  return (
    <div className={`${className} flex flex-col text-black bg-white p-6 shadow-sm border border-gray-100 rounded-lg select-none`}>
      <h1 className='text-3xl font-bold mb-8'>Bộ lọc</h1>
      
      {/* 1. CHỌN MỨC GIÁ (RADIO) */}
      <h2 className='text-xl font-bold text-[#f15a22] pb-4'>Chọn mức giá</h2>
      <div className="flex flex-col gap-3 mb-6">
        {[
          { label: "Giá dưới 500.000đ", value: [0, 500000] },
          { label: "500.000đ - 1 triệu", value: [500000, 1000000] },
          { label: "1 - 2 triệu", value: [1000000, 2000000] },
          { label: "2 - 3 triệu", value: [2000000, 3000000] },
          { label: "Giá trên 3 triệu", value: [3000000, 10000000] },
        ].map((item, index) => (
          <label key={index} className="flex items-center cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="price-filter" 
                onChange={() => setRangePrice(item.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#f15a22] transition-all duration-200"
              />
              <div className="absolute w-2.5 h-2.5 bg-[#f15a22] rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
              {item.label}
            </span>
          </label>
        ))}
      </div>

      <hr className="border-gray-200 mb-6 border-dashed" />

      {/* 2. SLIDER CHỌN KHOẢNG GIÁ */}
      <PriceFilter rangePrice={rangePrice} setRangePrice={setRangePrice} />

      <hr className="border-gray-200 my-6 border-dashed" />

      {/* 3. DANH MỤC & THƯƠNG HIỆU (VỚI SCROLLBAR THUẦN TAILWIND) */}
      <div className="flex flex-col gap-8">
        <ProductCategory 
          mainSub="Danh mục sản phẩm" 
          // items mặc định bên trong ProductCategory
        />
        
        <ProductCategory 
          mainSub="Thương hiệu" 
          items={brandList} // Truyền thương hiệu vào
        />
      </div>
    </div>
  );
});

export default Filter;