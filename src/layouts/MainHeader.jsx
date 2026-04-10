import React, { useState } from 'react';
import Racket from '../components/Racket';
import { Link } from 'react-router-dom';

const MainHeader = () => {
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [page, setPage] = useState('home');
  const racketProducts = [
    {
      brand: "VỢT CẦU LÔNG YONEX",
      items: ["Dòng vợt Nanoflare", "Dòng vợt Astrox", "Dòng vợt Duora", "Dòng vợt Nanoray"]
    },
    {
      brand: "VỢT CẦU LÔNG LINING",
      items: ["Dòng vợt Aeronaut", "Dòng vợt Tectonic", "Dòng vợt Windstorm", "Dòng vợt Calibar"]
    },
    {
      brand: "VỢT CẦU LÔNG VICTOR",
      items: ["Dòng vợt DriveX", "Dòng vợt Hypernano", "Dòng vợt Brave Sword", "Dòng vợt Meteor X"]
    },
    {
      brand: "VỢT CẦU LÔNG MIZUNO",
      items: ["Speedflex", "Carbo Pro", "Promax", "Caliber"]
    }
  ];
  const shoesProducts = [
  {
    brand: "GIÀY CẦU LÔNG YONEX",
    items: ["Dòng Power Cushion 65Z", "Dòng Aerus Z", "Dòng Eclipsion", "Dòng Comfort Z"]
  },
  {
    brand: "GIÀY CẦU LÔNG LINING",
    items: ["Dòng Ranger", "Dòng Shadow", "Dòng Saga", "Dòng Halberd"]
  },
  {
    brand: "GIÀY CẦU LÔNG VICTOR",
    items: ["Dòng P9200", "Dòng A970", "Dòng P8500", "Dòng S82"]
  },
  {
    brand: "GIÀY CẦU LÔNG MIZUNO",
    items: ["Wave Claw", "Wave Fang", "Sky Blaster", "Gate Sky"]
  }
];
  const bagProducts = [
  {
    brand: "BALO CẦU LÔNG YONEX",
    items: ["Balo Expert Series", "Balo Tournament", "Balo Active", "Balo Team Series"]
  },
  {
    brand: "BALO CẦU LÔNG LINING",
    items: ["Balo Đa Năng", "Balo Chống Thấm", "Balo Đựng Vợt Chuyên Dụng", "Balo Thời Trang"]
  },
  {
    brand: "BALO CẦU LÔNG VICTOR",
    items: ["Balo Crown Collection", "Balo BR Series", "Balo Team Collection", "Balo Backpack"]
  }
];
const accessoryProducts = [
  {
    brand: "QUẤN CÁN VỢT",
    items: ["Quấn cán Yonex AC102EX", "Quấn cán vải", "Quấn cán lỗ", "Quấn cán Lining/Victor"]
  },
  {
    brand: "CƯỚC CẦU LÔNG",
    items: ["Cước Yonex BG65/65Ti", "Cước Yonex BG80/80P", "Cước Lining No.1/No.7", "Cước Victor VBS"]
  },
  {
    brand: "PHỤ KIỆN KHÁC",
    items: ["Băng chặn mồ hôi", "Tất (vớ) chuyên dụng", "Bột quấn cán", "Móc khóa cầu lông"]
  }
];
const racketBagProducts = [
  {
    brand: "BAO VỢT YONEX",
    items: [
      "Bao vợt Yonex 2 ngăn (6 chiếc)",
      "Bao vợt Yonex 3 ngăn (9 chiếc)",
      "Bao vợt Yonex Tour Edition",
      "Bao vợt vuông (Rectangular Bag)"
    ]
  },
  {
    brand: "BAO VỢT LINING",
    items: [
      "Bao vợt Lining dòng National",
      "Bao vợt Lining 2 ngăn lớn",
      "Bao vợt Lining 3 ngăn chuyên nghiệp",
      "Túi đựng vợt Lining cầm tay"
    ]
  },
  {
    brand: "BAO VỢT VICTOR",
    items: [
      "Bao vợt Victor BR9213",
      "Bao vợt Victor BR9612",
      "Bao vợt Victor Crown Collection",
      "Túi đựng vợt Victor hình chữ nhật"
    ]
  },
  {
    brand: "BAO VỢT MIZUNO",
    items: [
      "Mizuno 2 ngăn cao cấp",
      "Mizuno 3 ngăn Tour",
      "Túi đựng vợt Mizuno cầm tay",
      "Bao vợt chống thấm nước"
    ]
  }
];


  return (
    <nav className="relative bg-white  text-gray-700 font-sans flex justify-center"
    onMouseLeave={() => setIsProductHovered(false)}
    >
      <div className="container shadow-md border-x border-t border-gray-200 flex grow max-w-325 items-center justify-center">
        <div className="flex space-x-15 uppercase text-sm font-bold py-4">
          <Link
          onClick={() => setPage('home')} 
          to="/" 
          className={`pb-3 border-orange-500 hover:text-orange-500 hover:border-b-2 ${page === 'home' ? 'text-orange-500 border-b-2 ' : ''}`}>Trang chủ</Link>          
          <div 
            className="relative cursor-pointer pb-3 hover:border-b-2 border-orange-500 hover:text-orange-500 transition-colors"
            onMouseEnter={() => {
              setCurrentProduct(racketProducts);
              setIsProductHovered(true);
            }}
          >
            VỢT CẦU LÔNG <span className="text-[10px]">▼</span>
          </div>
          <div 
            className="relative cursor-pointer pb-3 hover:border-b-2 border-orange-500 hover:text-orange-500 transition-colors"
              onMouseEnter={() => {
              setCurrentProduct(shoesProducts);
              setIsProductHovered(true);
            }}
          >
            GIÀY <span className="text-[10px]">▼</span>
          </div>
          <div 
            className="relative cursor-pointer pb-3 hover:border-b-2 border-orange-500 hover:text-orange-500 transition-colors"
              onMouseEnter={() => {
              setCurrentProduct(bagProducts);
              setIsProductHovered(true);
            }}
          >
            BALO <span className="text-[10px]">▼</span>
          </div>
          <div 
            className="relative cursor-pointer pb-3 hover:border-b-2 border-orange-500 hover:text-orange-500 transition-colors"
              onMouseEnter={() => {
              setCurrentProduct(racketBagProducts);
              setIsProductHovered(true);
            }}
          >
            BAO VỢT <span className="text-[10px]">▼</span>
          </div>
          <div 
            className="relative cursor-pointer pb-3 hover:border-b-2 border-orange-500 hover:text-orange-500 transition-colors"
              onMouseEnter={() => {
              setCurrentProduct(accessoryProducts);
              setIsProductHovered(true);

            }}
          >
            PHỤ KIỆN <span className="text-[10px]">▼</span>
          </div>
          <Link 
          to="/sales" 
          onClick={() => setPage('sale')} 
          className={`hover:text-orange-500 pb-3 hover:border-b-2 border-orange-500 ${page === 'sale' ? 'text-orange-500 border-b-2 border-orange-500' : ''}`}>GIẢM GIÁ</Link>
          <Link to="/contract" onClick={() => setPage('contract')} className={`hover:text-orange-500 pb-3 hover:border-b-2 border-orange-500 ${page === 'contract' ? 'text-orange-500 border-b-2 border-orange-500' : ''}`}>Liên hệ</Link>

        </div>
      </div>
      {isProductHovered && (
        <Racket productCategories={currentProduct}/>
      )}
    </nav>
  );
};

export default MainHeader;