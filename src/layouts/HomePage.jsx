import React, { useEffect, useState } from "react";
import Advertisement from "../components/Advertisement";
import { useCategory } from "../contexts/CategoryContext";
import { productApi } from "../api";
import CategoryShowcase from "../components/CategoryShowcase";

const HomePage = () => {
  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2025/12/mua-do.png",
    "https://static.fbshop.vn/wp-content/uploads/2025/12/he-thong-cau-long.png",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-4-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-6-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg",
  ];

  const { categories } = useCategory();
  const [homeProducts, setHomeProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getHomeProducts();
        const allProducts = response.data.data || [];
        const groupedProducts = allProducts.reduce((acc, product) => {
          const { categoryName } = product;
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
          return acc;
        }, {});
        setHomeProducts(groupedProducts);
      } catch (error) {
        console.error("Failed to fetch home products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const categoryImages = {
    "Vợt cầu lông":
      "https://cdn.shopvnb.com/uploads/advertising/vot-cau-long.webp",
    "Giày cầu lông":
      "https://cdn.shopvnb.com/uploads/advertising/giay-cau-long.webp",
    "Bao vợt & Balo":
      "https://cdn.shopvnb.com/uploads/advertising/balo-tui-vnb.webp",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <Advertisement linkAdvertisement={linkAdvertisement} />
      <div className="bg-gray-50 py-1">
        {categories.map((category) => {
          const productsForCategory = homeProducts[category.categoryName];
          if (!productsForCategory || productsForCategory.length === 0) {
            return null;
          }
          return (
            <CategoryShowcase
              key={category.categoryId}
              category={category}
              products={productsForCategory}
              categoryImage={
                categoryImages[category.categoryName] ||
                "https://images.unsplash.com/photo-1599481238640-4c12727c393a?w=500&q=80"
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
