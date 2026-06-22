import React, { useState, useEffect, useRef } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Save,
  Loader2,
  RotateCcw,
  AlertCircle,
  Eye,
  Images,
  ArrowUp,
  ArrowDown,
  Star,
  StarOff,
  ZoomIn,
  ArrowLeft,
  ArrowRight,
  Import,
  Upload,
} from "lucide-react";
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext";
import { brandApi, productApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { BiExport } from "react-icons/bi";

const PRICE_RANGE_OPTIONS = [
  { id: "under-500k", label: "DÆ°á»›i 500K", min: 0, max: 500000 },
  { id: "500k-1m", label: "500K - 1 triá»‡u", min: 500000, max: 1000000 },
  { id: "1m-2m", label: "1 - 2 triá»‡u", min: 1000000, max: 2000000 },
  { id: "2m-5m", label: "2 - 5 triá»‡u", min: 2000000, max: 5000000 },
  { id: "over-5m", label: "TrÃªn 5 triá»‡u", min: 5000000, max: null },
];

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Ä‘/g, "d")
    .replace(/Ä/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const rangeKey = (range) => `${range.min ?? ""}-${range.max ?? ""}`;

const toggleValue = (list, value) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

const ProductList = () => {
  const navigate = useNavigate();
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    clearError,
    importFromFile,
    exportFromFile,
  } = useProduct();

  const { categories } = useCategory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const importFileRef = useRef(null);
  const mainImageInputRef = useRef(null);
  const galleryImageInputRef = useRef(null);

  // â”€â”€ Image management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [imageModalProduct, setImageModalProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState("");
  const [newImageIsMain, setNewImageIsMain] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [mainImageFileName, setMainImageFileName] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    categorySlugs: [],
    brandSlugs: [],
    priceRanges: [],
    page: 1,
    pageSize: 10,
  });

  // Separate input state for price â€” debounced 600ms before hitting API
  const defaultForm = {
    productName: "",
    brandId: "",
    categoryId: "",
    basePrice: "",
    discountPrice: "",
    mainImageUrl: "",
    description: "",
  };
  const [formData, setFormData] = useState(defaultForm);

  const normalizeImageUrl = (url) => {
    if (!url || url.startsWith("data:") || url.startsWith("blob:"))
      return url || "";
    if (url.startsWith("/uploads/")) return url;

    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return url;
    }

    return url;
  };

  const getUploadedImageUrl = (response) =>
    normalizeImageUrl(
      response.data?.imageUrl ??
        response.data?.ImageUrl ??
        response.data?.data?.imageUrl ??
        response.data?.data?.ImageUrl ??
        response.data?.url ??
        response.data?.Url ??
        "",
    );

  const validateImageFile = (file) => {
    if (!file) return false;
    if (!file.type?.startsWith("image/")) {
      alert("Vui lÃ²ng chá»n Ä‘Ãºng file áº£nh.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandApi.getAll();
        setBrands(res.data?.data ?? res.data ?? []);
      } catch (err) {
        alert(err.data?.message);
      }
    };
    fetchBrands();
  }, []);

  const refreshProducts = async (nextFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.filter({
        keyword: nextFilters.keyword?.trim() || null,
        categorySlugs: nextFilters.categorySlugs,
        brandSlugs: nextFilters.brandSlugs,
        priceRanges: nextFilters.priceRanges,
        page: nextFilters.page,
        pageSize: nextFilters.pageSize,
      });
      const data = res.data;
      setProducts(data.items ?? []);
      setPagination({
        totalCount: data.totalCount ?? 0,
        totalPages: data.totalPages ?? 0,
        currentPage: data.page ?? nextFilters.page,
      });
    } catch (err) {
      setProducts([]);
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleKeywordChange = (e) => {
    setFilters((prev) => ({ ...prev, keyword: e.target.value, page: 1 }));
  };

  const handleToggleCategory = (slug) => {
    setFilters((prev) => ({
      ...prev,
      categorySlugs: toggleValue(prev.categorySlugs, slug),
      page: 1,
    }));
  };

  const handleToggleBrand = (slug) => {
    setFilters((prev) => ({
      ...prev,
      brandSlugs: toggleValue(prev.brandSlugs, slug),
      page: 1,
    }));
  };

  const handleTogglePriceRange = (range) => {
    setFilters((prev) => {
      const exists = prev.priceRanges.some((item) => rangeKey(item) === rangeKey(range));
      const priceRanges = exists
        ? prev.priceRanges.filter((item) => rangeKey(item) !== rangeKey(range))
        : [...prev.priceRanges, { min: range.min, max: range.max }].slice(0, 2);

      return { ...prev, priceRanges, page: 1 };
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      categorySlugs: [],
      brandSlugs: [],
      priceRanges: [],
      page: 1,
      pageSize: 10,
    });
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  // â”€â”€ Modal open/close â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openCreate = () => {
    setEditingProduct(null);
    setFormData(defaultForm);
    setMainImageFileName("");
    clearError();
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    // Look up brandId/categoryId by name since admin response only has names
    const brand = brands.find((b) => b.brandName === product.brandName);
    const category = categories.find(
      (c) => c.categoryName === product.categoryName,
    );
    setFormData({
      productName: product.productName ?? "",
      brandId: brand?.brandId ?? product.brandId ?? "",
      categoryId: category?.categoryId ?? product.categoryId ?? "",
      basePrice: product.basePrice ?? "",
      discountPrice: product.discountPrice ?? "",
      mainImageUrl: product.mainImageUrl ?? "",
      description: product.description ?? "",
    });
    setMainImageFileName("");
    clearError();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setMainImageFileName("");
    clearError();
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!validateImageFile(file)) return;

    setMainImageUploading(true);
    try {
      const res = await productApi.uploadImage(file);
      const uploadedUrl = getUploadedImageUrl(res);
      if (!uploadedUrl) {
        throw new Error("Backend khÃ´ng tráº£ vá» Ä‘Æ°á»ng dáº«n áº£nh.");
      }
      setFormData((prev) => ({ ...prev, mainImageUrl: uploadedUrl }));
      setMainImageFileName(file.name);
    } catch (err) {
      alert(
        err.response?.data?.message ??
          err.response?.data?.Message ??
          err.message ??
          "Táº£i áº£nh tháº¥t báº¡i",
      );
    } finally {
      setMainImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mainImageUploading) {
      alert("áº¢nh chÃ­nh Ä‘ang Ä‘Æ°á»£c táº£i lÃªn, vui lÃ²ng chá» hoÃ n táº¥t.");
      return;
    }
    if (!formData.productName.trim()) return;
    if (!formData.categoryId || !formData.brandId) {
      alert("Vui lÃ²ng chá»n danh má»¥c vÃ  thÆ°Æ¡ng hiá»‡u!");
      return;
    }
    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      alert("GiÃ¡ gá»‘c pháº£i lá»›n hÆ¡n 0!");
      return;
    }
    if (
      formData.discountPrice &&
      Number(formData.discountPrice) >= Number(formData.basePrice)
    ) {
      alert("GiÃ¡ khuyáº¿n mÃ£i pháº£i nhá» hÆ¡n giÃ¡ gá»‘c!");
      return;
    }

    const payload = {
      productName: formData.productName.trim(),
      brandId: parseInt(formData.brandId),
      categoryId: parseInt(formData.categoryId),
      basePrice: parseFloat(formData.basePrice),
      discountPrice: formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : null,
      mainImageUrl: formData.mainImageUrl?.trim() || null,
      description: formData.description?.trim() || null,
    };

    setSubmitLoading(true);
    try {
      const result = editingProduct
        ? await updateProduct(editingProduct.productId, payload)
        : await addProduct(payload);

      if (result !== null) {
        closeModal();
        refreshProducts();
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // â”€â”€ Image modal functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openImageModal = async (e, product) => {
    e.stopPropagation();
    if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    setImageModalProduct(product);
    setNewImageFile(null);
    setNewImagePreviewUrl("");
    setNewImageIsMain(false);
    setOrderChanged(false);
    setImageLoading(true);
    try {
      const res = await productApi.getImages(product.productId);
      setImages(
        (res.data?.data ?? res.data ?? []).sort(
          (a, b) => a.displayOrder - b.displayOrder,
        ),
      );
    } catch {
      setImages([]);
    } finally {
      setImageLoading(false);
    }
  };

  const closeImageModal = () => {
    setImageModalProduct(null);
    setImages([]);
    setOrderChanged(false);
    setPreviewImage(null);
    if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    setNewImageFile(null);
    setNewImagePreviewUrl("");
  };

  const handleGalleryImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!validateImageFile(file)) return;

    if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    setNewImageFile(file);
    setNewImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleAddImage = async () => {
    if (!newImageFile) return;
    setAddingImage(true);
    try {
      const uploadRes = await productApi.uploadImage(newImageFile);
      const uploadedUrl = getUploadedImageUrl(uploadRes);
      if (!uploadedUrl) {
        throw new Error("Backend khÃ´ng tráº£ vá» Ä‘Æ°á»ng dáº«n áº£nh.");
      }
      await productApi.addImage(imageModalProduct.productId, {
        imageUrl: uploadedUrl,
        isMain: newImageIsMain,
      });
      const res = await productApi.getImages(imageModalProduct.productId);
      setImages(
        (res.data?.data ?? res.data ?? []).sort(
          (a, b) => a.displayOrder - b.displayOrder,
        ),
      );
      if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
      setNewImageFile(null);
      setNewImagePreviewUrl("");
      setNewImageIsMain(false);
      refreshProducts();
    } catch (err) {
      alert(
        err.response?.data?.message ??
          err.response?.data?.Message ??
          err.message ??
          "ThÃªm áº£nh tháº¥t báº¡i",
      );
    } finally {
      setAddingImage(false);
    }
  };

  const handleSetMain = async (imageId) => {
    try {
      await productApi.setMainImage(imageModalProduct.productId, imageId);
      const res = await productApi.getImages(imageModalProduct.productId);
      setImages(
        (res.data?.data ?? res.data ?? []).sort(
          (a, b) => a.displayOrder - b.displayOrder,
        ),
      );
      refreshProducts();
    } catch (err) {
      alert(err.response?.data?.message ?? "Thao tÃ¡c tháº¥t báº¡i");
    }
  };

  const handleDeleteImage = async (imageId, isMain) => {
    if (isMain) {
      alert("KhÃ´ng thá»ƒ xÃ³a áº£nh Ä‘áº¡i diá»‡n. HÃ£y Ä‘áº·t áº£nh khÃ¡c lÃ m Ä‘áº¡i diá»‡n trÆ°á»›c.");
      return;
    }
    if (!window.confirm("XÃ³a áº£nh nÃ y?")) return;
    try {
      await productApi.deleteImage(imageId);
      setImages((prev) => prev.filter((i) => i.imageId !== imageId));
    } catch (err) {
      alert(err.response?.data?.message ?? "XÃ³a áº£nh tháº¥t báº¡i");
    }
  };

  const handleMoveImage = (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const updated = [...images];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    updated.forEach((img, i) => {
      img.displayOrder = i + 1;
    });
    setImages(updated);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const payload = images.map((img) => ({
        imageId: img.imageId,
        displayOrder: img.displayOrder,
      }));
      await productApi.reorderImages(imageModalProduct.productId, payload);
      setOrderChanged(false);
      refreshProducts();
    } catch (err) {
      alert(err.response?.data?.message ?? "LÆ°u thá»© tá»± tháº¥t báº¡i");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `XÃ³a "${name}"?\n\nThao tÃ¡c sáº½ xÃ³a táº¥t cáº£ biáº¿n thá»ƒ vÃ  áº£nh liÃªn quan (CASCADE).`,
      )
    )
      return;
    const ok = await deleteProduct(id);
    if (!ok) {
      alert("KhÃ´ng thá»ƒ xÃ³a. Sáº£n pháº©m cÃ³ thá»ƒ Ä‘Ã£ tá»“n táº¡i trong Ä‘Æ¡n hÃ ng.");
    }
  };

  const handleImportFromFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".xlsx")) {
      alert("âš ï¸ Chá»‰ cháº¥p nháº­n file .xlsx");
      return;
    }
    setImportLoading(true);
    try {
      const res = await importFromFile(f);
      if (res?.success) {
        alert(res.message || "Nháº­p sáº£n pháº©m thÃ nh cÃ´ng!");
        refreshProducts();
      } else {
        alert("Nháº­p tháº¥t báº¡i: " + (res?.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh"));
      }
    } finally {
      setImportLoading(false);
    }
  };

  const handleExportFile = async () => {
    setExportLoading(true);
    try {
      const result = await exportFromFile();
      if (result) {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setExportLoading(false);
    }
  };

  const stockColor = (qty) => {
    if (qty === null || qty === undefined) return "text-slate-400";
    if (qty <= 2) return "text-rose-500 font-bold";
    if (qty <= 5) return "text-amber-500 font-bold";
    return "text-emerald-500 font-bold";
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + " â‚«" : "â€”";

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* â”€â”€ Header & Filters â”€â”€ */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                Quáº£n lÃ½ kho hÃ ng
              </h3>
              {pagination?.totalCount > 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {pagination.totalCount} sáº£n pháº©m
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <input
                ref={importFileRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleImportFromFile}
              />
              <button
                onClick={() => importFileRef.current?.click()}
                disabled={importLoading}
                className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {importLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Import size={16} />
                )}
                Nháº­p tá»« file
              </button>
              <button
                onClick={handleExportFile}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {exportLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <BiExport size={16} />
                )}
                Xuáº¥t ra file
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-orange-default hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <Plus size={16} /> ThÃªm sáº£n pháº©m
              </button>
            </div>
          </div>

          {/* Multi-condition filters */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_auto] gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  value={filters.keyword}
                  onChange={handleKeywordChange}
                  placeholder="Tìm tên sản phẩm..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:border-orange-default dark:focus:border-orange-400 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none transition-all"
                />
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium transition-all"
              >
                <RotateCcw size={14} /> Làm mới
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Khoảng giá (tối đa 2)
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGE_OPTIONS.map((range) => {
                    const active = filters.priceRanges.some((item) => rangeKey(item) === rangeKey(range));
                    const disabled = !active && filters.priceRanges.length >= 2;
                    return (
                      <button
                        key={range.id}
                        onClick={() => handleTogglePriceRange(range)}
                        disabled={disabled}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 ${
                          active
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Danh mục ({filters.categorySlugs.length})
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {categories.map((cat) => {
                    const slug = cat.slug ?? slugify(cat.categoryName);
                    return (
                      <label key={cat.categoryId ?? slug} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categorySlugs.includes(slug)}
                          onChange={() => handleToggleCategory(slug)}
                          className="accent-orange-500"
                        />
                        <span className="truncate">{cat.categoryName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Thương hiệu ({filters.brandSlugs.length})
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {brands.map((brand) => {
                    const slug = brand.slug ?? slugify(brand.brandName);
                    return (
                      <label key={brand.brandId ?? slug} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brandSlugs.includes(slug)}
                          onChange={() => handleToggleBrand(slug)}
                          className="accent-orange-500"
                        />
                        <span className="truncate">{brand.brandName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* ── Table â”€â”€ */}
          <div className="overflow-x-auto relative" style={{ minHeight: 300 }}>
            {loading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-orange-500" size={28} />
              </div>
            )}

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700">
                  <th className="px-5 py-3 w-72">Sáº£n pháº©m</th>
                  <th className="px-4 py-3">ThÆ°Æ¡ng hiá»‡u</th>
                  <th className="px-4 py-3">Danh má»¥c</th>
                  <th className="px-4 py-3 text-right">GiÃ¡ gá»‘c</th>
                  <th className="px-4 py-3 text-right">GiÃ¡ KM</th>
                  <th className="px-4 py-3 text-center">Biáº¿n thá»ƒ</th>
                  <th className="px-4 py-3 text-center">Tá»“n kho</th>
                  <th className="px-4 py-3 text-center">ÄÃ£ bÃ¡n</th>
                  <th className="px-4 py-3 text-center w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {products.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">ðŸ¸</span>
                        <span>KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m nÃ o</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr
                      key={item.productId}
                      onClick={() =>
                        navigate(`/admin/product/${item.productId}`, {
                          state: { product: item },
                        })
                      }
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Sáº£n pháº©m */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {item.mainImageUrl ? (
                            <img
                              src={normalizeImageUrl(item.mainImageUrl)}
                              alt={item.productName}
                              className="w-11 h-11 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 border border-slate-200 dark:border-slate-700">
                              ðŸ¸
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-45">
                              {item.productName}
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate max-w-45">
                              /{item.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ThÆ°Æ¡ng hiá»‡u */}
                      <td className="px-4 py-3">
                        {item.brandName ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-medium border border-orange-200 dark:border-orange-500/30">
                            {item.brandName}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            â€”
                          </span>
                        )}
                      </td>

                      {/* Danh má»¥c */}
                      <td className="px-4 py-3">
                        {item.categoryName ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-500/30">
                            {item.categoryName}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            â€”
                          </span>
                        )}
                      </td>

                      {/* GiÃ¡ gá»‘c */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          {formatPrice(item.basePrice)}
                        </span>
                      </td>

                      {/* GiÃ¡ KM */}
                      <td className="px-4 py-3 text-right">
                        {item.discountPrice || item.discountPercent > 0 ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                            {formatPrice(item.discountPrice)}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            â€”
                          </span>
                        )}
                      </td>

                      {/* Biáº¿n thá»ƒ */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.variantsCount ?? item.variantCount ?? "â€”"}
                        </span>
                      </td>

                      {/* Tá»“n kho */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={stockColor(
                            item.totalStock ?? item.stockQuantity,
                          )}
                        >
                          {item.totalStock ?? item.stockQuantity ?? "â€”"}
                        </span>
                      </td>

                      {/* ÄÃ£ bÃ¡n */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {item.soldQuantity ?? item.totalSold ?? 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/product/${item.productId}`, {
                                state: { product: item },
                              });
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                            title="Xem"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => openImageModal(e, item)}
                            className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 rounded-lg transition-colors"
                            title="Quáº£n lÃ½ áº£nh"
                          >
                            <Images size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(item);
                            }}
                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                            title="Sá»­a"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={(e) =>
                              handleDelete(e, item.productId, item.productName)
                            }
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition-colors"
                            title="XÃ³a"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* â”€â”€ Pagination â”€â”€ */}
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {pagination?.totalCount ?? 0} sáº£n pháº©m
                {pagination?.totalPages > 1 && (
                  <>
                    {" "}
                    Â· Trang{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {pagination.currentPage}
                    </span>
                    /
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {pagination.totalPages}
                    </span>
                  </>
                )}
              </div>

              {pagination?.totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                  >
                    TrÆ°á»›c
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pagination.totalPages > 7 &&
                      Math.abs(pageNum - filters.page) > 2
                    )
                      return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                          filters.page === pageNum
                            ? "bg-linear-to-r from-orange-default to-orange-dark text-white shadow-lg shadow-orange-default/25"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= pagination.totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* â”€â”€ Modal ThÃªm / Sá»­a â”€â”€ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {editingProduct ? "Sá»­a sáº£n pháº©m" : "ThÃªm sáº£n pháº©m má»›i"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                {editingProduct
                  ? "CÃ¢n nháº¯c trÆ°á»›c khi thay Ä‘á»•i thÃ´ng tin"
                  : "Äiá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin sáº£n pháº©m"}
              </p>

              {error && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-sm text-rose-700 dark:text-rose-400">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-slate-700">
                    TÃªn sáº£n pháº©m
                  </label>
                  <input
                    required
                    placeholder="TÃªn sáº£n pháº©m *"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm focus:ring-2 focus:ring-orange-default placeholder:text-slate-400"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Danh má»¥c
                    </label>
                    <select
                      required
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm focus:ring-orange-default"
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                    >
                      <option value="">Chá»n danh má»¥c *</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      ThÆ°Æ¡ng hiá»‡u
                    </label>
                    <select
                      required
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm focus:ring-orange-default"
                      value={formData.brandId}
                      onChange={(e) =>
                        setFormData({ ...formData, brandId: e.target.value })
                      }
                    >
                      <option value="">Chá»n thÆ°Æ¡ng hiá»‡u *</option>
                      {brands.map((b) => (
                        <option key={b.brandId} value={b.brandId}>
                          {b.brandName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      GiÃ¡ gá»‘c
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder="GiÃ¡ gá»‘c (VND) *"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm focus:ring-orange-default"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      GiÃ¡ khuyáº¿n mÃ£i
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="GiÃ¡ khuyáº¿n mÃ£i"
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm focus:ring-orange-default"
                      value={formData.discountPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    áº¢nh chÃ­nh
                  </label>
                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageChange}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={mainImageUploading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-60 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
                    >
                      {mainImageUploading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Upload size={15} />
                      )}
                      {formData.mainImageUrl ? "Äá»•i áº£nh" : "Chá»n áº£nh"}
                    </button>
                    <span className="min-w-0 flex-1 truncate text-xs text-slate-400 dark:text-slate-500">
                      {mainImageUploading
                        ? "Äang táº£i áº£nh lÃªn..."
                        : mainImageFileName ||
                          (formData.mainImageUrl
                            ? "ÄÃ£ cÃ³ áº£nh chÃ­nh"
                            : "ChÆ°a chá»n áº£nh")}
                    </span>
                  </div>
                  {formData.mainImageUrl && (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2">
                      <img
                        src={normalizeImageUrl(formData.mainImageUrl)}
                        alt="áº¢nh chÃ­nh"
                        className="h-16 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <p className="min-w-0 flex-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {formData.mainImageUrl}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    MÃ´ táº£ sáº£n pháº©m
                  </label>
                  <textarea
                    placeholder="MÃ´ táº£ sáº£n pháº©m"
                    rows={2}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline-none text-sm resize-none focus:ring-orange-default placeholder:text-slate-400"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitLoading || mainImageUploading}
                  className="w-full bg-orange-default hover:bg-orange-dark text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {submitLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingProduct ? "Cáº­p nháº­t sáº£n pháº©m" : "LÆ°u sáº£n pháº©m"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* â”€â”€ Modal Quáº£n lÃ½ áº£nh â”€â”€ */}
        {imageModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Quáº£n lÃ½ áº£nh
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs">
                    {imageModalProduct.productName}
                  </p>
                </div>
                <button
                  onClick={closeImageModal}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ThÃªm áº£nh má»›i */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  ThÃªm áº£nh má»›i
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    ref={galleryImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryImageChange}
                  />
                  <button
                    type="button"
                    onClick={() => galleryImageInputRef.current?.click()}
                    disabled={addingImage}
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors"
                  >
                    <Upload size={15} />
                    {newImageFile ? newImageFile.name : "Chá»n áº£nh tá»« mÃ¡y"}
                  </button>
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={newImageIsMain}
                      onChange={(e) => setNewImageIsMain(e.target.checked)}
                      className="accent-orange-500 w-4 h-4"
                    />
                    áº¢nh chÃ­nh
                  </label>
                  <button
                    onClick={handleAddImage}
                    disabled={addingImage || !newImageFile}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-default text-white rounded-xl text-sm font-semibold hover:bg-orange-dark disabled:opacity-50 transition-colors"
                  >
                    {addingImage ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    ThÃªm
                  </button>
                </div>
                {newImagePreviewUrl && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
                    <img
                      src={newImagePreviewUrl}
                      alt="áº¢nh sáº½ thÃªm"
                      className="h-16 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {newImageFile?.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        áº¢nh sáº½ Ä‘Æ°á»£c táº£i lÃªn khi báº¥m ThÃªm.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newImagePreviewUrl)
                          URL.revokeObjectURL(newImagePreviewUrl);
                        setNewImageFile(null);
                        setNewImagePreviewUrl("");
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Bá» chá»n"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Danh sÃ¡ch áº£nh */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {imageLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2
                      className="animate-spin text-slate-400"
                      size={24}
                    />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    ChÆ°a cÃ³ áº£nh nÃ o.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {images.map((img, idx) => (
                      <div
                        key={img.imageId}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${img.isMain ? "border-orange-200 dark:border-orange-500/40 bg-orange-50/50 dark:bg-orange-500/10" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative shrink-0 cursor-zoom-in group/thumb"
                          onClick={() => setPreviewImage(img)}
                        >
                          <img
                            src={normalizeImageUrl(img.imageUrl)}
                            alt=""
                            className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              e.target.src = "";
                              e.target.className =
                                "w-14 h-14 bg-slate-200 rounded-lg";
                            }}
                          />
                          {img.isMain && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-default text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                              MAIN
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            <ZoomIn size={16} className="text-white" />
                          </div>
                        </div>

                        {/* Order + URL */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                            #{img.displayOrder}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {img.imageUrl}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveImage(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-25 transition-colors"
                            title="LÃªn"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveImage(idx, 1)}
                            disabled={idx === images.length - 1}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-25 transition-colors"
                            title="Xuá»‘ng"
                          >
                            <ArrowDown size={14} />
                          </button>
                          {!img.isMain && (
                            <button
                              onClick={() => handleSetMain(img.imageId)}
                              className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                              title="Äáº·t lÃ m áº£nh chÃ­nh"
                            >
                              <Star size={14} />
                            </button>
                          )}
                          {img.isMain && (
                            <div
                              className="p-1.5 text-orange-400"
                              title="Äang lÃ  áº£nh chÃ­nh"
                            >
                              <StarOff size={14} />
                            </div>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteImage(img.imageId, img.isMain)
                            }
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                            title="XÃ³a"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer â€” lÆ°u thá»© tá»± */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {images.length} áº£nh
                  {orderChanged && (
                    <span className="ml-2 text-amber-500 font-semibold">
                      Â· ChÆ°a lÆ°u thá»© tá»±
                    </span>
                  )}
                </p>
                <button
                  onClick={handleSaveOrder}
                  disabled={!orderChanged || savingOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-default text-white rounded-xl text-sm font-semibold hover:bg-orange-dark disabled:opacity-40 transition-colors"
                >
                  {savingOrder ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  LÆ°u thá»© tá»±
                </button>
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ Lightbox xem áº£nh â”€â”€ */}
        {previewImage &&
          (() => {
            const idx = images.findIndex(
              (i) => i.imageId === previewImage.imageId,
            );
            return (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/90"
                onClick={() => setPreviewImage(null)}
              >
                {/* NÃºt Ä‘Ã³ng */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  onClick={() => setPreviewImage(null)}
                >
                  <X size={20} />
                </button>

                {/* Badge thá»© tá»± + MAIN */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-white/70 text-sm font-medium">
                    {idx + 1} / {images.length}
                  </span>
                  {previewImage.isMain && (
                    <span className="px-2 py-0.5 bg-orange-default text-white text-xs font-bold rounded-full">
                      MAIN
                    </span>
                  )}
                </div>

                {/* MÅ©i tÃªn trÃ¡i */}
                {images.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      idx > 0 && setPreviewImage(images[idx - 1]);
                    }}
                    disabled={idx === 0}
                    className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowLeft size={22} />
                  </button>
                )}

                {/* áº¢nh */}
                <img
                  src={normalizeImageUrl(previewImage.imageUrl)}
                  alt=""
                  className="max-w-[180vw] max-h-[170vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                {/* MÅ©i tÃªn pháº£i */}
                {images.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      idx < images.length - 1 &&
                        setPreviewImage(images[idx + 1]);
                    }}
                    disabled={idx === images.length - 1}
                    className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowRight size={22} />
                  </button>
                )}
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default ProductList;



