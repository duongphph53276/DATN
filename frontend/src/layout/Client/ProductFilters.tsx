// components/ProductFilters.tsx
import   { useState } from "react";

const ProductFilters = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleFilter = () => {
    onFilter({ category, priceRange });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white shadow rounded-xl">
      <div>
        <label className="mr-2 font-semibold">Danh mục:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="couple">Gấu Couple</option>
          <option value="mini">Gấu Mini</option>
          <option value="babythree">BaByThree</option>
          <option value="big">Gấu To </option>
          <option value="graduate">Gấu Tốt Nghiệp </option>
          <option value="cosplay">Gấu Cosplay </option>
          <option value="other">Khác </option>
        </select>
      </div>
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
