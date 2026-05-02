import React from "react";
import { Link } from "react-router-dom";
import ProductFrame_Minh from "./ProductFrame_Minh";

const CategoryShowcase = ({ category, products, categoryImage }) => {
  if (!category || !products || products.length === 0) {
    return null; // Không hiển thị nếu thiếu dữ liệu
  }

  const displayedProducts = products.slice(0, 6);
  return (
    <div className="container mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-6 border-b-2 border-orange-500 pb-2">
        <h2 className="text-3xl font-bold text-gray-800 uppercase">
          {category.categoryName}
        </h2>
        <Link
          to={`/${category.slug}`}
          className="text-orange-500 font-semibold hover:underline"
        >
          Xem Tất cả &raquo;
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Banner Ảnh lớn bên trái */}
        <div className="w-full lg:w-1/3 shrink-0 h-full">
          <Link to={`/${category.slug}`} className="block h-full">
            <img
              src={categoryImage}
              alt={category.categoryName}
              className="w-full h-full min-h-[500px] object-cover rounded-xl border-2 border-orange-500 shadow-md hover:shadow-lg transition-shadow duration-300"
            />
          </Link>
        </div>

        {/* Lưới sản phẩm bên phải (Grid 3 cột) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
          {displayedProducts.map((product) => (
            <ProductFrame_Minh
              key={product.productId}
              image={product.mainImageUrl}
              productName={product.productName}
              basePrice={product.basePrice}
              sellingPrice={product.sellingPrice}
              isBestSeller={product.isBestSeller}
              discountPercent={product.discountPercent}
              productDetailSlug={product.slug} // Dữ liệu slug sản phẩm để vào trang detail
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;
