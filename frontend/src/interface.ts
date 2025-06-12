export interface IProduct {
  _id?: string; // ID MongoDB
  product_id?: number;
  name: string;
  images?: string;
  album?: string[];
  category_id: string; // là ObjectId, nhưng bạn dùng string ở frontend
  description?: string;
  status?: 'active' | 'disabled' | 'draft' | 'new' | 'bestseller';
  attributes?: string[]; // danh sách ObjectId của Attribute
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
}
