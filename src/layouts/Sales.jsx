import React, { use, useState } from 'react';
import Filter from '../components/Filter';
import { useMediaQuery } from '../mystate/useMediaQuery';
import FilterDrawer from '../components/DrawerFilter';

const Sales = () => {
  const [rangePrice, setRangePrice] = useState([0, 10000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMediumScreen = useMediaQuery('(min-width: 1025px)');
  const isSmallScreen = useMediaQuery('(max-width: 850px)');
  return (
    <div className="min-h-screen text-[#333]">
      <FilterDrawer
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        rangePrice={rangePrice}
        setRangePrice={setRangePrice}
      />
      <div className="container max-w-350 mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* SIDEBAR BỘ LỌC (DESKTOP) */}
          {isMediumScreen && <Filter 
            rangePrice={rangePrice} 
            setRangePrice={setRangePrice} 
            className="w-100 shrink-0" 
          />}

          <div className="flex-1">
            {/* THANH CÔNG CỤ TÌM KIẾM VÀ SẮP XẾP */}
            <div className="flex flex-col justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
              {/* Tiêu đề & số lượng */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Giảm Giá</h1>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">0 sản phẩm</span>
              </div>

              <div className={`flex items-center justify-between gap-4 ${isSmallScreen ? 'flex-col items-start' : ''}`}>
                {/* Nhóm tìm kiếm & nút */}
              <div className={`flex items-center flex-1 max-w-2xl ${isSmallScreen ? 'w-full' : ''}`}>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-l-lg text-sm bg-white focus:border-[#f15a22] focus:ring-1 focus:ring-[#f15a22] transition outline-none"
                  />
                </div>
                
                <button className="bg-[#f15a22] text-white px-6 py-3 rounded-r-lg text-sm font-semibold hover:bg-[#e14a12] transition">
                  Tìm kiếm
                </button>
              </div>
              {!isMediumScreen && <button
                onClick={() => setIsFilterOpen(true)} 
                className={`flex items-center gap-2 border border-gray-200 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition text-gray-700 ${isSmallScreen ? 'w-full justify-center' : 'mx-4 '}`}>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Bộ lọc
                </button>}
              {/* Sắp xếp dropdown */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-sm font-medium text-gray-600 ${isMediumScreen ? 'mx-4' : ''}`}>Sắp xếp:</span>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:ring-1 focus:ring-[#f15a22] outline-none cursor-pointer text-gray-800">
                    <option>Mặc định</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Mới nhất</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              </div>
            </div>

            {/* PHẦN HIỂN THỊ TRẠNG THÁI TRỐNG (VỚI THANH CUỘN THUẦN TAILWIND CHO CONTAINER CHÍNH NẾU CẦN) */}
            <div className="flex flex-col items-center justify-center pt-24 pb-32 text-center 
              /* Tùy chỉnh Scrollbar qua Tailwind Arbitrary Variants trực tiếp */
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-[#f15a22]">
              
              <h3 className="text-xl font-bold text-gray-800">Chưa có sản phẩm nào trong danh sách giảm giá.</h3>
              {/* Bạn có thể thêm icon hoặc nút quay lại ở đây */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;