import { Checkbox } from '@headlessui/react'
import React, { memo } from 'react'
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Filter = memo(({setRangePrice, className}) => {
  console.log("Filter Rendered!");
  return (
    <div className={`${className} flex flex-col text-black`}>
      <h1 className='text-4xl font-bold py-8'>Bộ lọc</h1>
      <h2 className='text-2xl font-semibold text-orange-default pb-4'>Chọn mức giá</h2>
      <div className="flex flex-col gap-4 p-4">
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="price-filter" 
              onChange={() => setRangePrice([0, 500000])}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full bg-white checked:bg-[#e31e24] checked:border-[#e31e24] transition-all duration-200"
            />
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
            Giá dưới 500.000đ
          </span>
        </label>

        
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="price-filter" 
              onChange={() => setRangePrice([500000,1000000])}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full bg-white checked:bg-[#e31e24] checked:border-[#e31e24] transition-all duration-200"
            />
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
            500.000đ - 1 triệu
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="price-filter" 
              onChange={() => setRangePrice([1000000,2000000])}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full bg-white checked:bg-[#e31e24] checked:border-[#e31e24] transition-all duration-200"
            />
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
            1 - 2 triệu
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="price-filter" 
              onChange={() => setRangePrice([2000000,3000000])}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full bg-white checked:bg-[#e31e24] checked:border-[#e31e24] transition-all duration-200"
            />
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
            2 - 3 triệu
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="price-filter" 
              onChange={() => setRangePrice([3000000,10000000])}
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full bg-white checked:bg-[#e31e24] checked:border-[#e31e24] transition-all duration-200"
            />
            <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
            Giá trên 3 triệu
          </span>
        </label>
      </div>
    </div>
  )
})

export default Filter