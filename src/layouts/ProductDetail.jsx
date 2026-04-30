import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../api";

const ProductDetail = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Giả định có API để lấy sản phẩm bằng slug
        const response = await productApi.getBySlug(productSlug);
        setProduct(response.data);
      } catch (err) {
        setError("Không tìm thấy sản phẩm");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  if (loading) {
    return <div className="text-center p-20">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center p-20 text-red-500">
        {error || "Không có thông tin sản phẩm."}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">{product.productName}</h1>
      <p>Đây là trang chi tiết cho sản phẩm: {product.productName}</p>
      <p>Slug: {productSlug}</p>
      {/* Bạn có thể thêm chi tiết sản phẩm ở đây */}
    </div>
  );
};

export default ProductDetail;
