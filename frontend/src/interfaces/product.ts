export interface IProduct {
  _id?: string | number; // ID MongoDB
  name: string;
  images?: string;
  album?: string[];
  category_id: string | { _id: string; name: string }; // là ObjectId, nhưng bạn dùng string ở frontend
  description?: string;
  status?: 'active' | 'disabled' | 'new' | 'bestseller';
  attributes?: string[]; // danh sách ObjectId của Attribute
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
}
