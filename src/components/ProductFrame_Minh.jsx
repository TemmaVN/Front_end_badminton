import React from "react";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

function ProductPrice({ basePrice, sellingPrice }) {
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    return Number(String(priceVal).replace(/[^0-9]/g, ""));
  };

  const basePriceNum = parsePrice(basePrice);
  const sellingPriceNum = parsePrice(sellingPrice);

  const formatVND = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  if (basePriceNum === sellingPriceNum)
    return (
      <div className="text-[#f97316] font-bold text-[16px] md:text-[18px]">
        {basePriceNum === 0 ? "0đ" : formatVND(basePriceNum)}
      </div>
    );
  else
    return (
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-1">
        <div className="text-[#f97316] font-bold text-[16px] md:text-[18px]">
          {formatVND(sellingPriceNum)}
        </div>
        <div className="text-gray-400 line-through text-[13px] md:text-[14px]">
          {formatVND(basePriceNum)}
        </div>
      </div>
    );
}

export default function ProductFrame_Minh({
  image,
  productName,
  basePrice,
  sellingPrice,
  isBestSeller,
  discountPercent,
  productDetailSlug,
  categorySlug,
}) {
  return (
    // Bỏ w-full ở Link, thay bằng h-full để thẻ con trải dài hết chiều cao của ô Grid
    <Link to={`/product/${productDetailSlug}`} className="block h-full group">
      {/* 
        SỬA LẠI:
        - XÓA max-w-[240px] và max-h-[365px]
        - Giữ lại w-full h-full để nó điền đầy ô grid
      */}
      <div className="flex flex-col relative w-full h-full bg-white rounded-lg p-[10px] border-[1.6px] border-transparent group-hover:border-[#f97316] group-hover:shadow-md transition-all duration-300">
        {/* Nhãn Bán chạy & Giảm giá */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
          {isBestSeller && (
            <div className="flex items-center gap-1 bg-[#f97316] px-2 py-0.5 rounded text-white font-semibold text-[10px] md:text-[11px] shadow-sm">
              <Crown size={12} />
              Bán chạy
            </div>
          )}
          {discountPercent > 0 && (
            <div className="font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded text-[10px] md:text-[11px] shadow-sm">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Khu vực Hình ảnh */}
        {/* Vẫn giữ aspect-square để ảnh vuông */}
        <div className="relative w-full aspect-square bg-white overflow-hidden rounded-md flex items-center justify-center">
          <img
            src={image}
            alt={productName}
            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* KHOẢNG TRỐNG ẢO DÀNH CHO NÚT "XEM CHI TIẾT" */}
        <div className="w-full h-10 mt-1 mb-2 overflow-hidden flex items-center justify-center">
          <div className="w-[90%] bg-[#f97316] text-white font-bold py-2 rounded text-[12px] md:text-[13px] text-center shadow-md uppercase opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            Xem chi tiết
          </div>
        </div>

        {/* Nội dung Tên và Giá */}
        <div className="flex flex-col flex-grow justify-between gap-2">
          <h3 className="text-[16px] text-gray-800 font-medium line-clamp-2 leading-snug group-hover:text-[#f97316] transition-colors">
            {productName}
          </h3>
          <div className="mt-auto pt-1 border-t border-gray-50">
            <ProductPrice basePrice={basePrice} sellingPrice={sellingPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
}
