import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartCountBadge: React.FC = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateQuantity = () => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      const cart = JSON.parse(stored);
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } else {
      setTotalQuantity(0);
    }
  };

  useEffect(() => {
    updateQuantity(); // load ban đầu

    const handler = () => updateQuantity();
    window.addEventListener("cartUpdated", handler);

    return () => {
      window.removeEventListener("cartUpdated", handler);
    };
  }, []);

  return (
    <Link to="/cart" className="relative text-rose-300 hover:text-rose-700">
      <FaShoppingCart size={24} />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartCountBadge;
