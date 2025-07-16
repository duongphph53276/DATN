// src/data/allProducts.ts

export interface Product {
    id: string;
   image: string;
  name: string;
  price: string;
  oldPrice?: string;
  size?: string[];
  category : string;
}

export const allProducts: Product[] = [
  { id: '1',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/04/Blindbox-Baby-Three-Day-Treo-Dien-Thoai-5.jpg',
    name: 'Blindbox Baby Three Dây Treo Điện Thoại' ,
    price: '165.000₫',
    size: ['13cm'],
     category: 'mini' 
  },
  { id : '2',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Baby-Three-1000-Bigsize-3.jpg',
    name: 'Blindbox Baby Three 1000% Big Size',
    price: '5.250.000₫',
     category: 'babythree' 
  },
  { id : '3',
    image: 'https://gaubongonline.vn/wp-content/uploads/2024/12/Blindbox_Baby_Three_Tho_Macaron-1.jpg',
    name: 'Blindbox Baby Three Thỏ Macaron',
    price: '390.000₫',
    category: 'babythree'

  },
  { id:'4',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/04/Blindbox-Baby-Three-Happy-Day-3.jpg',
    name: 'Blindbox Baby Three Happy Day',
    price: '276.500₫',
    size: ['25cm'],
    category: 'babythree'
  },
  { id:'5',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Cap-Doi-BearHug-Gau-Hugo-Rosie-13.jpg',
    name: 'Gấu Bông Cặp Đôi Hugo & Rosie',
    price: '285.000₫',
    size: ['25cm'],
     category: 'couple' 
  },
  { id:    '6',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Dau-Re-Capyboo-9.jpg',
    name: 'Gấu Bông Dâu Rể Capyboo',
    price: '295.000₫',
    size: ['28cm'],
    category: 'other'
  },
  { id: '7',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/01/Gau-Bong-Couple-Dau-Re-Tho-Snowy-7.jpg',
    name: 'Gấu Bông Dâu Rể Thỏ Snowy',
    price: '295.000₫',
    size: ['25cm'],
    category: 'other'
  },
   { id: '8',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/01/Gau-Bong-Cap-Doi-BearHug-Tho-Bunny-Daisy-8.jpg',
    name: 'Gấu Bông Cặp Đôi BearHug – Thỏ Bunny & Daisy ',
    price: '285.000₫',
    size: ['25cm'],
    category: 'couple'
  },
  {  id:'9',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Capybara-Khong-Lo-2.jpg",
        name: "Gấu Bông Baby Three Cosplay Capybara Khổng Lồ  ",
        price: "1.850.000₫",
        size: ["1m5 "],
        category: 'big'

      },
      { id:'10',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Gau-Bung-Sao-Khong-Lo-4.jpg",
        name: "Gấu Bông Baby Three Cosplay Gấu Bụng Sao Khổng Lồ ",
        price: "1.850.000₫",
      
        size: ["1m5"],
        category: 'big'
      },
      { id:'11', 
        image: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Tho-Hong-Khong-Lo-1.jpg",
        name: "Gấu Bông Baby Three Cosplay Thỏ Hồng Khổng Lồ ",
        price: "2.450.000₫",
      
        size: ["1m5"],
        category: 'big'
      },
      { id:'12',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/03/Canh-Cut-Bong-Deo-Yem-Khong-Lo-5.jpg",
        name: "Gấu Bông Baby Three Thỏ Đứng Đội Nơ ",
        price: "1.650.000₫",
       
         size: ["1m5"],
          category: 'babythree'
      },
      { id:'13',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/06/gau-mac-bo-tot-nghiep-lua-2.jpg',
    name: 'Gấu Trắng Mặc Bộ Tốt Nghiệp Lụa',
    price: '125.000₫',
    size: ['25cm'],
    category: 'graduate'
  },
  { id:'14',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/06/gau-tot-nghiep-canh-cut-4.jpg',
    name: 'Gấu Bông Tốt Nghiệp Hoạt Hình – Cánh Cụt',
    price: '155.000₫',
    size: ['30cm'],
    category: 'graduate'
  },
  { id:'15',
    image: 'https://gaubongonline.vn/wp-content/uploads/2024/05/gau-bong-tot-nghiep-1.jpg',
    name: 'Gấu Tốt Nghiệp',
    price: '95.000₫',
    size: ['20cm', '30cm', '40cm'],
    category: 'graduate'
  },
  { id:'16',
    image: 'https://gaubongonline.vn/wp-content/uploads/2024/05/head-tot-nghiep-ao-lua-1.jpg',
    name: 'Gấu Bông Head Lông Xoắn Áo Lụa Tốt Nghiệp',
    price: '125.000₫',
    size: ['25cm', '35cm'],
    category: 'graduate'
  },
  { id:'17',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Canh-Cut-Ca-Tim-3.jpg",
        name: "Gấu Bông Cánh Cụt Cà Tím",
        price: "155.000₫",
        size: ["25cm", "40cm", "70cm"],
        category: 'other' 
      },
      { id:'18',
        image: "https://gaubongonline.vn/wp-content/uploads/2024/05/Canh-cut-deo-yem-1-1.jpg",
        name: "Cánh Cụt Đeo Yếm",
        price: "135.000₫",
        size: ["30cm", "45cm", "60cm", "80cm", "1m5"],
        category: 'other' 
      },
      { id:'19',
        image: "https://gaubongonline.vn/wp-content/uploads/2024/08/Gau-Bong-Stitch-Om-Vit-4.jpg",
        name: "Gấu Bông Stitch Ôm Vịt",
        price: "195.000₫",
        size: ["28cm", "45cm", "60cm", "80cm"],
        category: 'other' 
      },
      { id:'20',
        image: "https://gaubongonline.vn/wp-content/uploads/2024/10/Gau-Bong-Thu-Mo-Vit-6.jpg",
        name: "Gấu Bông Thú Mỏ Vịt",
        price: "535.000₫",
        size: ["1m", "65cm"],
        category: 'other' 
      },
      { id:'21',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/05/tui-mu-khong-lo-1.jpg',
    name: 'Túi Mù Khổng Lồ',
    price: '399.000₫',
    oldPrice: '599.000₫',
    size: [],
    category: 'other' 
  },
  { id:'22', 
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/05/avt-bo-thu-me-con.jpg',
    name: 'Bộ Thú Bông Mẹ Con',
    price: '325.000₫',
    size: ['30cm'],
    category: 'other' 
  },
  { id:'23',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/05/bo-thu-cam-xuc-1.jpg',
    name: 'Bộ Thú Bông Cảm Xúc',
    price: '225.000₫',
    size: ['35cm', '55cm', '75cm'],
    category: 'other' 
  },
  { id:'24',
    image: 'https://gaubongonline.vn/wp-content/uploads/2025/05/avt_bo-thu-trai-cay-1.jpg',
    name: 'Bộ Thú Bông Trái Cây',
    price: '425.000₫',
    size: ['35cm'],
    category: 'other' 
  },
  { id:'25',
        image: "https://gaubongonline.vn/wp-content/uploads/2024/10/Gau-Bong-Raisca-Khung-Long-6.jpg",
        name: "Gấu Bông Raisca cosplay Khủng long ",
        price: "142.500₫",
        oldPrice: "285.000₫",
        size: ["30cm ", "40cm"],
         category: 'cosplay'
      },
      { id:'26',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/02/Blindbox-Baby-Three-Tho-Macaron-V2-9.jpg",
        name: "Blindbox Baby Three Macaron Ver 2 ",
        price: "245.000₫",
        oldPrice: "350.000₫",
        size: [],
         category: 'cosplay'
      },
      { id:'27',
        image: "https://gaubongonline.vn/wp-content/uploads/2024/05/Capybara-doi-vit-deo-tui-2.jpg",
        name: "Chuột Capybara Đội Vịt Đeo Túi ",
        price: "206.000₫",
        oldPrice: "295.000₫",
        size: ["35cm","45cm "],
         category: 'cosplay'
      },
      { id:'28',
        image: "https://gaubongonline.vn/wp-content/uploads/2025/01/Baby-Three-Tho-Long-Min-3.jpg",
        name: "Gấu Bông Baby Three Thỏ Đứng Đội Nơ ",
        price: "92.500₫",
        oldPrice: "105.000₫",
        size: ["30cm","40cm","55cm","75cm"],
         category: 'cosplay'
      },

];
