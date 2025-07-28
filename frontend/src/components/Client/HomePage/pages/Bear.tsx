import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Gấu bông Brown siêu mềm",
    img: "https://pos.nvncdn.com/71a8b2-3946/ps/20150611_Rfk2jqYJ5VRfk8SS6S9kMXrK.jpg",
    price: "199.000₫",
  },
  {
    id: 2,
    name: "Gấu bông Stitch đáng yêu",
    img: "https://upload.bemori.vn/thu-bong-hoat-hinh/gau-bong-stitch/gau-bong-stitch-ngoi-doi-mu-om-kem/stitch-ngoi-doi-mu-om-kem-0.webp",
    price: "249.000₫",
  },
  {
    id: 3,
    name: "Gấu bông Doremon cổ điển",
    img: "https://upload.bemori.vn/thu-bong-hoat-hinh/nhan-vat-hoat-hinh/gau-bong-doraemon-cosplay-lotso/doraemon-cosplay-lotso-0.webp",
    price: "219.000₫",
  },
  {
    id: 4,
    name: "Gấu bông Pikachu ôm tim",
    img: "https://gaubongcaocap.com/?attachment_id=11252",
    price: "199.000₫",
  },
  {
    id: 5,
    name: "Gấu bông Totoro siêu mềm",
    img: "https://sothugaubong.com/wp-content/uploads/2018/08/totoro-mem-sac-mau.jpg",
    price: "239.000₫",
  },
  {
    id: 6,
    name: "Gấu bông vịt vàng đội mũ",
    img: "https://pos.nvncdn.com/71a8b2-3946/ps/20240504_PY1YSXpWiu.jpeg",
    price: "189.000₫",
  },
];

const accessories = [
  {
    id: 1,
    name: "Nơ đeo cổ cho gấu",
    img: "https://teddy.vn/wp-content/uploads/2021/12/cho-deo-no.jpg",
    price: "39.000₫",
  },
  {
    id: 2,
    name: "Ba lô mini cho gấu",
    img: "https://product.hstatic.net/200000178477/product/thiet_ke_chua_co_ten__56__eb5fb48d8b304a40ab29286ac134504d_grande.png",
    price: "59.000₫",
  },
  {
    id: 3,
    name: "Mắt kính siêu cute cho gấu",
    img: "https://bizweb.dktcdn.net/100/516/027/products/mat-kinh-mat-te-cho-be-gau-truc-ho2-d762fb62-ae95-4a6e-9d13-91440f574498-150de7de-277a-4765-a399-cd17a4acb5d5.jpg?v=1732784638787",
    price: "35.000₫",
  },
  {
    id: 4,
    name: "Kẹp tóc",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZA6w9-HDO8LvfjEOOPG7zTA96kLMd9EUkyQ&s",
    price: "35.000₫",
  },
  {
    id: 5,
    name: "Giày sneaker mini cho gấu",
    img: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzc81qcn8ejlfb",
    price: "69.000₫",
  },
  {
    id: 6,
    name: "Vương miện công chúa",
    img: "https://png.pngtree.com/png-vector/20250614/ourlarge/pngtree-cute-teddy-bear-with-crown-png-image_16536215.png",
    price: "45.000₫",
  },
];

const StuffedAnimals: React.FC = () => {
  return (
   <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-6 sm:p-10">
  <header className="text-center mb-14">
    <h1 className="text-5xl font-extrabold text-pink-600 drop-shadow-sm">Gấu Bông & Phụ Kiện</h1>
    <p className="text-gray-700 text-xl mt-3 font-medium">Đáng yêu - Mềm mại - Nhiều lựa chọn hấp dẫn!</p>
  </header>

  {/* Gấu bông nổi bật */}
  <section className="mb-20">
    <h2 className="text-3xl font-bold text-pink-700 text-center mb-8">🧸 Gấu Bông Nổi Bật</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col border border-pink-100 hover:scale-[1.02]"
        >
          <img
            src={item.img}
            alt={item.name}
            className="rounded-xl w-full h-48 object-cover mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-pink-600 font-bold text-lg mb-3">{item.price}</p>
         <Link
                  to="/checkout"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-yellow-500 hover:to-amber-600 focus:outline-none"
                >
                  Mua ngay
                </Link>
        </div>
      ))}
    </div>
  </section>

  {/* Phụ kiện */}
  <section>
    <h2 className="text-3xl font-bold text-pink-700 text-center mb-8">🎀 Phụ Kiện Cho Gấu</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {accessories.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col border border-pink-100 hover:scale-[1.02]"
        >
          <img
            src={item.img}
            alt={item.name}
            className="rounded-xl w-full h-48 object-cover mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-pink-600 font-bold text-lg mb-3">{item.price}</p>
         <Link
                           to="/checkout"
                           className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-yellow-500 hover:to-amber-600 focus:outline-none"
                         >
                           Mua ngay
                         </Link>
        </div>
      ))}
    </div>
  </section>
</div>


  );
};

export default StuffedAnimals;
