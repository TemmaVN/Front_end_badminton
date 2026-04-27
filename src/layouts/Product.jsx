import React, { useEffect, useState } from "react";
import Advertisement from "../components/Advertisement";
import Button from "../components/Button";
import {
  File,
  FileDown,
  Folder,
  Search,
  FilterIcon,
  ChevronDown,
} from "lucide-react";
import FilterDrawer from "../components/DrawerFilter";
import { useMediaQuery } from "../mystate/useMediaQuery";
import Filter from "../components/Filter";
import { FcFolder, FcNews } from "react-icons/fc";
import { HiFire } from "react-icons/hi";
import { button, div, i } from "framer-motion/client";
import { productApi } from "../api";
import ProductFrame_Minh from "../components/ProductFrame_Minh";

const Product = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rangePrice, setRangePrice] = useState([0, 10000000]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMediumScreen = useMediaQuery("(min-width: 1025px");
  const isSmallScreen = useMediaQuery("(max-width: 850px)");
  const isHighMediumScreen = useMediaQuery("(min-width: 1200px)");
  const isColumnLayout = useMediaQuery("(min-width: 1100px)");
  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2024/01/891903_627183127297272_1688220992_o-scaled.jpg",
  ];

  //Gọi API khi component load lần đầu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getHomeProducts();
        setProducts(response.data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="w-full h-auto">
      <Advertisement linkAdvertisement={linkAdvertisement} />
      <div className="min-h-screen text-[#333] p-4">
        <FilterDrawer
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          rangePrice={rangePrice}
          setRangePrice={setRangePrice}
        />
        <div className="container max-w-350 mx-auto px-4 py-8 ">
          <div
            className={`flex grow ${isHighMediumScreen ? "" : "flex-col"} mb-20 items-center justify-between`}
          >
            <h2 className={`font-bold whitespace-nowrap text-3xl px-8`}>
              Phân loại sản phẩm
            </h2>
            <div
              className={`flex ${isHighMediumScreen ? "gap-6" : "gap-2"} ${isSmallScreen ? "flex-col" : ""}`}
            >
              <div
                className={`flex ${isSmallScreen ? "gap-4 py-1" : ""} ${isHighMediumScreen ? "gap-6" : "gap-2"} `}
              >
                <Button
                  variant="search"
                  size="search"
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center`}
                >
                  <FcFolder className="w-6 h-6" /> Sản phẩm Limited
                </Button>
                <Button
                  variant="search"
                  size="search"
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center`}
                >
                  <HiFire className="w-6 h-6 text-red-600" /> Sản phẩm bán chạy
                </Button>
              </div>
              <div
                className={`flex ${isSmallScreen ? "gap-4 py-1" : ""} ${isHighMediumScreen ? "gap-6" : "gap-2"} `}
              >
                <Button
                  variant="search"
                  size="search"
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center`}
                >
                  <img
                    src="https://static.fbshop.vn/template/assets/images/icon-cate-new.png"
                    className="w-6 h-6"
                  />{" "}
                  Sản phẩm Limited
                </Button>
                <Button
                  variant="search"
                  size="search"
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center`}
                >
                  <img
                    src="https://static.fbshop.vn/template/assets/images/icon-cate-tag.png"
                    className="w-6 h-6"
                  />{" "}
                  Sản phẩm Limited
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            {isMediumScreen && (
              <Filter
                rangePrice={rangePrice}
                setRangePrice={setRangePrice}
                className="w-100 shrink-0"
                isHasList={false}
              />
            )}
            <div className="flex-1">
              <div className="flex flex-col justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Dòng vợt Aeronaut</h1>
                  <span className="text-xs text-gray-400 bg-gray-bg px-3 py-1 rounded-full">
                    0 sản phẩm
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between gap-4 ${isSmallScreen ? "flex-col items-start" : ""}`}
                >
                  <div
                    className={`flex items-center flex-1 max-w-2xl ${isSmallScreen ? "w-full" : ""}`}
                  >
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search />
                      </span>
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm trong danh mục..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-l-lg text-sm font-semibold hover:border-orange-default"
                      />
                    </div>
                    <Button
                      variant="find"
                      size="find"
                      className="px-6 py-3 rounded-r-lg "
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                  {!isMediumScreen && (
                    <Button
                      variant="filter"
                      size="filter"
                      onClick={() => setIsFilterOpen(true)}
                      className={`${isSmallScreen ? "w-full justify-center" : "mx-4"}`}
                    >
                      {<FilterIcon />}
                      Bộ lọc
                    </Button>
                  )}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-sm font-medium text-gray-600 ${isMediumScreen ? "mx-4" : ""}`}
                    >
                      Sắp xếp:
                    </span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:ring-1 focus:ring-orange-default outline-none cursor-pointer text-gray-800"
                        name=""
                        id=""
                      >
                        <option>Mặc định</option>
                        <option>Giá thấp đến cao</option>
                        <option>Giá cao đến thấp</option>
                        <option>Mới nhất</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Khối Render danh sách sản phẩm */}
              {loading ? (
                <div className="py-20 text-center font-bold text-gray-500">
                  {" "}
                  Đang tải sản phẩm lên
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-3 sm:gird-cols-2 gap-3">
                  {products.map((product, idx) => (
                    <ProductFrame_Minh
                      key={product.Id || idx}
                      image={product.mainImageUrl}
                      productName={product.productName}
                      basePrice={product.basePrice}
                      sellingPrice={product.sellingPrice}
                      isBestSeller={product.IsBestSeller}
                      discountPercent={product.discountPercent}
                    />
                  ))}
                </div>
              ) : (
                <div className="pt-24 pb-32 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Chưa có sản phẩm nào trong danh sách
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
