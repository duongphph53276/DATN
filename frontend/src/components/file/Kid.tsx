// src/components/ProductCard.tsx

import { useState } from "react";
import { Link } from "react-router-dom";

export interface Kid {
  id: string;
  img: string;
  name: string;
  price: string;
  oldPrice?: string;
  size?: string[];
}

const Kid = ({ id, img, name, price, oldPrice, size }: Kid) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="w-[250px] bg-white p-4 rounded-xl shadow hover:shadow-lg text-center flex flex-col">
      <img
        src={img}
        alt={name}
        className="w-full h-[220px] object-cover rounded-lg mb-4"
      />

      <h3 className="text-base font-semibold">{name}</h3>

      <div className="text-rose-500 font-bold mt-2">{price}</div>

      {oldPrice && (
        <div className="line-through text-gray-400 text-sm">{oldPrice}</div>
      )}

      {size && (
        <div className="flex flex-wrap justify-center gap-2 my-2">
          {size.map((s, index) => (
            <button
              key={index}
              onClick={() => setSelectedSize(s)}
              className={`text-sm px-3 py-1 rounded-full border transition 
                ${
                  selectedSize === s
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-pink-100 text-rose-500 hover:bg-rose-200"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Spacer để đẩy nút xuống đáy */}
      <div className="flex-grow" />

      <Link
        to={`/product/${id}`}
        className="inline-block mt-2 px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition"
      >
        Xem chi tiết
      </Link>
    </div>
  );
};

export default Kid;
