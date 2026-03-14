import React from 'react'

const Racket = ({productCategories}) => {
  return (
    <div 
          className="top-full absolute left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 py-8 px-10"
        >
          <div className="container mx-auto grid grid-cols-4 gap-8">
            {productCategories.map((cat, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-orange-600 font-bold text-[18px] border-b border-gray-200 pb-2">
                  {cat.brand}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm hover:text-orange-500 cursor-pointer">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
  );
}

export default Racket;