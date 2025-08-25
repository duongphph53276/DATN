import { useState, useEffect } from "react";
import { getCategories } from "../../../api/category.api";

const ProductFilters = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.data || []); // API trả về {data: [...]}
      } catch (err) {
        console.error("Lỗi khi load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFilter = () => {
    onFilter({ category, priceRange, status });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white shadow rounded-xl mb-6">
      {/* Danh mục */}
      <div>
        <label className="mr-2 font-semibold">Danh mục:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Giá */}
      <div>
        <label className="mr-2 font-semibold">Giá:</label>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="0-100">Dưới 100k</option>
          <option value="100-300">100k - 300k</option>
          <option value="300+">Trên 300k</option>
        </select>
      </div>

      {/* Nút lọc */}
      <button
        onClick={handleFilter}
        className="bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600"
      >
        Lọc
      </button>
    </div>
  );
};

export default ProductFilters;
