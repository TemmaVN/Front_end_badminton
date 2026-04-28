import React, { use } from "react";
import { Crown } from "lucide-react";
import Button from "./Button";

function ProductPrice({ basePrice, sellingPrice }) {
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0; // Nếu không có giá trị thì mặc định là 0
    return Number(String(priceStr).replace(/[^0-9]/g, "")); // Ép kiểu về String trước khi replace
  };
  const basePriceNum = parsePrice(basePrice);
  const sellingPriceNum = parsePrice(sellingPrice);
  if (basePriceNum === sellingPriceNum)
    return (
      <div className="text-orange-600 font-bold text-[20px] ">{basePrice}</div>
    );
  else
    return (
      <div className="flex  justify-between items-center">
        <div className="text-orange-600 font-bold text-[20px]">
          {sellingPrice}
        </div>
        <div className="text-gray-400 line-through text-[20px]">
          {basePrice}
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
}) {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <>
      <div 
      className=" flex flex-col relative w-full max-w-60 max-h-100 h-full  mx-auto rounded-b-lg p-4 shadow-sm hover:border-orange-500 hover:border-2 hover:scale-102 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      >
      
        <div className=" absolute top-4.5 right-4.5 flex flex-col gap-1.5 items-end ">
          {isBestSeller && (
            <div className=" flex items-center gap-1.5 right-2 top-2 bg-orange-400 p-1 rounded font-semibold text-[11px] ">
              <Crown />
              Bán chạy
            </div>
          )}
          {discountPercent != 0 && (
            <div className="font-bold text-white bg-rose-500 p-0.5 rounded text-[11px] border border-rose-500 ">
              -{discountPercent}
            </div>
          )}
        </div>
        <div className="w-full aspect-square ">
          <img
            src={image}
            alt=""
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {
          isHover && (
            <Button className="flex justify-center items-center bg-orange-default hover:bg-orange-dark text-white font-bold w-full h-full py-3 mt-4 rounded-2xl">
              Xem chi tiết
            </Button>
          )
        }
        <div className="pt-4 flex flex-col flex-grow gap-2">
          <h3 className="overflow-hidden text-[16px] text-black font-medium line-clamp-2">
            {productName}
          </h3>
          <div className="bg-white mt-auto pt-1">
            <ProductPrice basePrice={basePrice} sellingPrice={sellingPrice} />
          </div>
        </div>
      </div>
    </>
  );
}
