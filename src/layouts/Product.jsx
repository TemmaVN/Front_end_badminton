// Product.jsx
import React, { useEffect, useState } from "react";
import Advertisement from "../components/Advertisement";
import Button from "../components/Button";
import { Search, FilterIcon, ChevronDown, X } from "lucide-react";
import FilterDrawer from "../components/DrawerFilter";
import { useMediaQuery } from "../mystate/useMediaQuery";
import Filter from "../components/Filter";
import { HiFire } from "react-icons/hi";
import ProductFrame_Minh from "../components/ProductFrame_Minh";
import { useParams, useSearchParams } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { useCategory } from "../contexts/CategoryContext";

const SORT_OPTIONS = [
  { value: "",           label: "Mặc định (Mới nhất)" },
  { value: "price_asc",  label: "Giá thấp → cao" },
  { value: "price_desc", label: "Giá cao → thấp" },
  { value: "name_asc",   label: "Tên A → Z" },
  { value: "name_desc",  label: "Tên Z → A" },
  { value: "oldest",     label: "Cũ nhất" },
];

const Product = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputKeyword, setInputKeyword] = useState(""); // chỉ dùng cho UI input

  const { categorySlug, "*": brandSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, searchProducts, pagination } = useProduct();
  const { pageCatagory } = useCategory();

  if (pageCatagory !== "") sessionStorage.setItem("pageCatagory", pageCatagory);
  const pageCatagorySession = sessionStorage.getItem("pageCatagory");

  const isMediumScreen     = useMediaQuery("(min-width: 1025px)");
  const isSmallScreen      = useMediaQuery("(max-width: 850px)");
  const isHighMediumScreen = useMediaQuery("(min-width: 1200px)");

  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2024/01/891903_627183127297272_1688220992_o-scaled.jpg",
  ];

  // ── Đọc filter từ URL ─────────────────────────────────────
  const keyword      = searchParams.get("keyword")      ?? "";
  const minPrice     = searchParams.get("minPrice")     ?? "";
  const maxPrice     = searchParams.get("maxPrice")     ?? "";
  const voucher      = searchParams.get("voucher")      === "true";
  const isBestSeller = searchParams.get("isBestSeller") === "true";
  const sortBy       = searchParams.get("sortBy")       ?? "";
  const page         = Number(searchParams.get("page")  ?? 1);

  // Sync inputKeyword khi URL thay đổi (ví dụ bấm Back)
  useEffect(() => {
    setInputKeyword(keyword);
  }, [keyword]);

  // ── Fetch khi searchParams hoặc slug thay đổi ─────────────
  useEffect(() => {
    searchProducts({
      ...(categorySlug   && { categorySlug }),
      ...(brandSlug      && { brandSlug }),
      ...(keyword        && { keyword }),
      ...(minPrice       && { minPrice }),
      ...(maxPrice       && { maxPrice }),
      ...(voucher        && { voucher }),
      ...(isBestSeller   && { isBestSeller }),
      ...(sortBy         && { sortBy }),
      page,
      pageSize: 12,
    });
  }, [searchParams, categorySlug, brandSlug]);

  // ── Helper: cập nhật URL ──────────────────────────────────
  const updateParams = (overrides = {}) => {
    const current = {
      ...(keyword      && { keyword }),
      ...(minPrice     && { minPrice }),
      ...(maxPrice     && { maxPrice }),
      ...(voucher      && { voucher: "true" }),
      ...(isBestSeller && { isBestSeller: "true" }),
      ...(sortBy       && { sortBy }),
      page,
    };

    const next = { ...current, page: 1, ...overrides };

    // Xóa các key falsy khỏi URL
    Object.keys(next).forEach((k) => {
      if (!next[k] && next[k] !== 0) delete next[k];
    });

    setSearchParams(next);
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleSearch           = () => updateParams({ keyword: inputKeyword });
  const handleKeyDown          = (e) => e.key === "Enter" && handleSearch();
  const handleSortChange       = (e) => updateParams({ sortBy: e.target.value });
  const handleVoucherToggle    = () => updateParams({ voucher: !voucher ? "true" : undefined });
  const handleBestSellerToggle = () => updateParams({ isBestSeller: !isBestSeller ? "true" : undefined });
  const handleApplyPrice       = (min, max) => updateParams({ minPrice: min, maxPrice: max });
  const handlePageChange       = (newPage) => updateParams({ page: newPage });

  const handleResetFilters = () => {
    setInputKeyword("");
    setSearchParams({}); // xóa toàn bộ query string
  };

  // ── Computed ─────────────────────────────────────────────
  const hasActiveFilters = keyword || minPrice || maxPrice || voucher || isBestSeller || sortBy;

  // ─────────────────────────────────────────────────────────
  return (
    <div className="w-full h-auto">
      <Advertisement linkAdvertisement={linkAdvertisement} />

      <div className="min-h-screen text-[#333] p-4">
        <FilterDrawer
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          rangePrice={[Number(minPrice) || 0, Number(maxPrice) || 10000000]}
          setRangePrice={([min, max]) => handleApplyPrice(min, max)}
        />

        <div className="container max-w-350 mx-auto px-4 py-8">
          {/* ── Quick-filter buttons ─────────────────────────── */}
          <div className={`flex grow ${isHighMediumScreen ? "" : "flex-col"} mb-20 items-center justify-between`}>
            <h2 className="font-bold whitespace-nowrap text-3xl px-8">
              Phân loại sản phẩm
            </h2>

            <div className={`flex ${isHighMediumScreen ? "gap-6" : "gap-2"} ${isSmallScreen ? "flex-col" : ""}`}>
              <div className={`flex ${isSmallScreen ? "gap-4 py-1" : ""} ${isHighMediumScreen ? "gap-6" : "gap-2"}`}>
                <Button
                  variant="search"
                  size="search"
                  onClick={handleBestSellerToggle}
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center ${isBestSeller ? "border-orange-500 bg-orange-50 text-orange-600" : ""}`}
                >
                  <HiFire className={`w-6 h-6 ${isBestSeller ? "text-orange-500" : "text-red-600"}`} />
                  Sản phẩm bán chạy
                  {isBestSeller && <X size={14} />}
                </Button>

                <Button
                  variant="search"
                  size="search"
                  onClick={handleVoucherToggle}
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center ${voucher ? "border-orange-500 bg-orange-50 text-orange-600" : ""}`}
                >
                  <img
                    src="https://static.fbshop.vn/template/assets/images/icon-cate-tag.png"
                    className="w-6 h-6"
                    alt=""
                  />
                  Có Voucher
                  {voucher && <X size={14} />}
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="search"
                  onClick={handleResetFilters}
                  className="whitespace-nowrap px-3 py-2 text-sm text-red-500 border border-red-200 hover:bg-red-50 gap-1 flex items-center rounded-lg"
                >
                  <X size={14} /> Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {isMediumScreen && (
              <Filter
                rangePrice={[Number(minPrice) || 0, Number(maxPrice) || 10000000]}
                setRangePrice={([min, max]) => handleApplyPrice(min, max)}
                className="w-100 shrink-0"
                isHasList={false}
              />
            )}

            <div className="flex-1">
              {/* ── Toolbar ───────────────────────────────────── */}
              <div className="flex flex-col justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{pageCatagorySession}</h1>
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {pagination.totalCount ?? 0} sản phẩm
                  </span>
                  {hasActiveFilters && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      Đang lọc
                    </span>
                  )}
                </div>

                <div className={`flex items-center justify-between gap-4 ${isSmallScreen ? "flex-col items-start" : ""}`}>
                  {/* Search input */}
                  <div className={`flex items-center flex-1 max-w-2xl ${isSmallScreen ? "w-full" : ""}`}>
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        value={inputKeyword}
                        onChange={(e) => setInputKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm kiếm sản phẩm trong danh mục..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-l-lg text-sm font-semibold hover:border-orange-500 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <Button
                      variant="find"
                      size="find"
                      onClick={handleSearch}
                      className="px-6 py-3 rounded-r-lg"
                    >
                      Tìm kiếm
                    </Button>
                  </div>

                  {/* Filter button (mobile) */}
                  {!isMediumScreen && (
                    <Button
                      variant="filter"
                      size="filter"
                      onClick={() => setIsFilterOpen(true)}
                      className={`${isSmallScreen ? "w-full justify-center" : "mx-4"}`}
                    >
                      <FilterIcon /> Bộ lọc
                    </Button>
                  )}

                  {/* Sort */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-medium text-gray-600 ${isMediumScreen ? "mx-2" : ""}`}>
                      Sắp xếp:
                    </span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer text-gray-800"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Product grid ──────────────────────────────── */}
              {loading ? (
                <div className="py-20 text-center font-bold text-gray-500">
                  Đang tải sản phẩm...
                </div>
              ) : error ? (
                <div className="py-20 text-center text-red-500 font-semibold">
                  Có lỗi xảy ra. Vui lòng thử lại.
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {products.map((product, idx) => (
                    <ProductFrame_Minh
                      key={product.Id || idx}
                      image={product.mainImageUrl}
                      productName={product.productName}
                      basePrice={product.basePrice}
                      sellingPrice={product.sellingPrice}
                      isBestSeller={product.IsBestSeller}
                      discountPercent={product.discountPercent}
                      categorySlug={categorySlug}
                      productDetailSlug={product.slug}
                    />
                  ))}
                </div>
              ) : (
                <div className="pt-24 pb-32 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {hasActiveFilters
                      ? "Không tìm thấy sản phẩm phù hợp với bộ lọc."
                      : "Chưa có sản phẩm nào trong danh mục này."}
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 text-orange-500 underline text-sm"
                    >
                      Xóa bộ lọc và xem tất cả
                    </button>
                  )}
                </div>
              )}

              {/* ── Pagination ────────────────────────────────── */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-sm text-slate-500">
                    Trang{" "}
                    <span className="font-semibold text-slate-800">{pagination.currentPage}</span>
                    {" "}trên{" "}
                    <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (pagination.totalPages > 5 && Math.abs(pageNum - pagination.currentPage) > 2)
                        return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            pagination.currentPage === pageNum
                              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                    </button>
                  </div>
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