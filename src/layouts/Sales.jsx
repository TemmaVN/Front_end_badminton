import React, { useState } from 'react'
import Filter from '../components/Filter'
import PriceFilter from '../components/PriceFilter'

const Sales = () => {
  const [rangePrice, setRangePrice] = useState([0, 5000000]);

  return (
    <div className='w-full flex justify-center py-20'>
      <div className='max-w-350 flex flex-col grow bg-amber-300 py-4'>
        <div className=''>
          <Filter className='pl-8' setRangePrice={setRangePrice}/>
          <PriceFilter rangePrice={rangePrice}
          setRangePrice={setRangePrice}
          />
          <div className='pt-16 pl-8 '> 
            <h1 className='text-2xl font-bold pb-4'>Danh mục sản phẩm</h1>
            <div>
              <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-[#f15a22] checked:border-[#f15a22] transition-all duration-200"
              />
              {/* Icon dấu tích trắng khi được chọn */}
              <svg
                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            </div>
          </div>
        </div>
        <div>

        </div>
        
      </div>
    </div>
  )
}

export default Sales