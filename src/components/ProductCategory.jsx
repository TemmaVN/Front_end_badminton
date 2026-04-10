import React from 'react';
import MyCheckBox from './MyCheckBox';

const ProductCategory = ({ mainSub, items = [] }) => {
  const defaultItems = ["Vợt cầu lông", "Giày cầu lông", "Balo cầu lông", "Bao vợt cầu lông", "Quần áo cầu lông", "Phụ kiện Aolikes - Fbshop", "Quả Cầu Lông"];
  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="w-full">
      <h2 className="text-[#f15a22] text-lg font-bold mb-4">{mainSub}</h2>
      
      <div className="flex flex-col max-h-62.5 overflow-y-auto pr-2 
        /* Tùy chỉnh Scrollbar qua Tailwind Arbitrary Variants */
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-[#f15a22]">
        
        {displayItems.map((item, index) => (
          <MyCheckBox 
            key={index} 
            id={`${mainSub}-${index}`} 
            data={item} 
            className="font-medium"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;