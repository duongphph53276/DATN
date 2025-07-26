import React from "react";

const newsList = [
  {
    id: 1,
    title: "Summer Sale Party: Đại Tiệc Gấu Bông Mua 1 Tặng 1 Tại Bemori",
    date: "27/06/2025",
    time: "8:09",
    author: "quantriweb",
    desc: "SUMMER SALE PARTY – MUA 1 TẶNG 1 | Chỉ từ 399k chọn quà thả ga Hè 2025 này...",
    img: "https://bemori.vn/wp-content/uploads/2025/06/Thumb-bai-viet.webp",
  },
  {
    id: 2,
    title: "Summer Chill Bag: Blindbox Không Lỡ Phá Đảo Mùa Hè",
    date: "21/05/2025",
    time: "9:07",
    author: "quantriweb",
    desc: "Mùa hè đã đến và Quốc tế Thiếu nhi 1/6 đang cận kề rồi đó! Bạn đã sẵn sàng mang đến...",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/05/blindbox-khong-lo-2.jpg",
  },
  {
    id: 3,
    title: "Bemori Mở Xuyên Lễ 30/4 – 1/5 – Để Gửi Gắm Yêu Thương Không Cần Chờ",
    date: "28/04/2025",
    time: "10:15",
    author: "quantriweb",
    desc: "Giữa những ngày nghỉ lễ, khi phố xá thưa thớt người, hệ thống cửa hàng Bemori vẫn mở...",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/04/Bemori-hoat-dong-xuyen-le.jpg",
  },
   {
    id: 4,
    title: "Tự Hào Việt Nam Cùng Gấu Bông Áo Cờ Đỏ Sao Vàng",
    date: "25/04/2025",
    time: "16:23",
    author: "quantriweb",
    desc: "Mỗi dịp 30/4 đến gần, lòng người Việt lại rộn ràng trong niềm tự hào và xúc động...",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/04/Gau-Bong-Ao-Co-Do-Sao-3.jpg",
  },
  {
    id: 5,
    title: "Chiếc Lỗ Nhỏ Bí Mật Trên Gấu Bông Bemori – Hóa Ra Không Phải Lỗi!",
    date: "25/04/2025",
    time: "16:07",
    author: "quantriweb",
    desc: "Ngày đầu mang em gấu bông về nhà, bạn hét vì bất ngờ. Chiếc lỗ nhỏ đó thực ra là...",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/04/bi-mat-lo-nho-tren-gau-bong-2.jpg",
  },
  {
    id: 6,
    title: "Dịch Vụ In Ấn Gấu Bông Cá Nhân Hóa Theo Yêu Cầu",
    date: "11/04/2025",
    time: "17:11",
    author: "quantriweb",
    desc: "Có bao giờ bạn từng nghĩ rằng một chú gấu bông lại có thể kể câu chuyện của riêng mình?",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/04/Vi-tri-in-pho-bien.jpg",
  },
  {
    id: 7,
    title: "Deal Hot Bốc Khói – Gấu Sale Nửa Giá Tại Bemori!",
    date: "11/04/2025",
    time: "15:52",
    author: "quantriweb",
    desc: "Tháng 4 năm nay, Bemori chính thức tung chương trình sale nửa giá cực hot với rất nhiều mẫu gấu.",
    img: "https://upload.bemori.vn/chuyen-nha-gau/sale-boc-khoi-2025/sale-hot-boc-khoi-01.webp",
  },
];

const NewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 text-center mb-10">CHUYỆN CỦA GẤU</h1>

      <div className="space-y-8">
        {newsList.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <img
              src={item.img}
              alt={item.title}
              className="w-full md:w-60 h-40 object-cover rounded-md"
            />

            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-pink-600 transition cursor-pointer">
                {item.title}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                ⏰ {item.time} | 📅 {item.date} | Đăng bởi: <span className="font-medium">{item.author}</span>
              </div>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
