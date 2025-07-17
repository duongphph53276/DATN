import React, { useState } from "react";
import { allProducts } from "../../../mock/allProduct";
import { useNavigate } from "react-router-dom";
import ProductFilters from "../../../layout/Client/ProductFilters";


// Hàm chuyển chuỗi giá về số
const parsePrice = (value: string): number => {
  return Number(value.replace(/[₫.]/g, ""));
};

const AllProducts: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: "", priceRange: "" });

  // Hàm lọc sản phẩm
  const filteredProducts = allProducts.filter((product) => {
    const price = parsePrice(product.price);
    const { category, priceRange } = filters;

    let matchCategory = true;
    let matchPrice = true;

    if (category) {
      matchCategory = product.category === category;
    }

    if (priceRange) {
      if (priceRange === "0-100") {
        matchPrice = price < 100000;
      } else if (priceRange === "100-300") {
        matchPrice = price >= 100000 && price <= 300000;
      } else if (priceRange === "300+") {
        matchPrice = price > 300000;
      }
    }

    return matchCategory && matchPrice;
  });

  const handleAddToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        price: parsePrice(product.price),
        oldPrice: product.oldPrice ? parsePrice(product.oldPrice) : undefined,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        🧸 Tất cả sản phẩm
      </h2>

      {/* 🔍 Bộ lọc */}
      <ProductFilters  onFilter={setFilters} />

      {/* 📦 Danh sách sản phẩm */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-rose-600 font-bold text-lg">
                    {parsePrice(product.price).toLocaleString()}₫
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {parsePrice(product.oldPrice).toLocaleString()}₫
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllProducts;
