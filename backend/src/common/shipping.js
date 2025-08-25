// Danh sách tỉnh/thành được miễn phí vận chuyển
const FREE_SHIPPING_CITIES = [
  // Hiện tại không có thành phố nào được miễn phí ship
];

// Danh sách 34 tỉnh thành (28 tỉnh sau sáp nhập + 6 thành phố trực thuộc Trung ương)
const ALL_PROVINCES = [
  // 6 thành phố trực thuộc Trung ương (Phí ship 30k)
  'Hà Nội',
  'Thành phố Hồ Chí Minh',
  'Hải Phòng', 
  'Đà Nẵng',
  'Cần Thơ',
  'Huế',
  
  // 28 tỉnh (Phí ship 30k)
  'An Giang',
  'Bắc Ninh',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Tĩnh',
  'Lai Châu',
  'Lạng Sơn',
  'Lào Cai',
  'Lâm Đồng',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sơn La',
  'Tuyên Quang',
  'Thái Nguyên',
  'Thanh Hóa',
  'Tây Ninh',
  'Vĩnh Long',
  'Bình Dương',
  'Bình Phước'
];

// Hàm tính phí ship dựa trên tỉnh thành
const calculateShippingFee = (city) => {
  if (!city) return 30000; // Mặc định 30k nếu không có thành phố
  
  // Kiểm tra xem có phải thành phố freeship không
  const isFreeShipping = FREE_SHIPPING_CITIES.some(freeCity => 
    city.toLowerCase().includes(freeCity.toLowerCase()) ||
    freeCity.toLowerCase().includes(city.toLowerCase())
  );
  
  return isFreeShipping ? 0 : 30000;
};

// Hàm kiểm tra xem tỉnh thành có hợp lệ không
const isValidProvince = (city) => {
  if (!city) return false;
  
  return ALL_PROVINCES.some(province => 
    city.toLowerCase().includes(province.toLowerCase()) ||
    province.toLowerCase().includes(city.toLowerCase())
  );
};

export {
  FREE_SHIPPING_CITIES,
  ALL_PROVINCES,
  calculateShippingFee,
  isValidProvince
};
