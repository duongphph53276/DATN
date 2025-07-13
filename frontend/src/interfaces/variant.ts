export interface IVariantAttribute {
  attribute_id: string;
  value_id: string;
  attribute_name?: string; // để hiển thị rõ hơn ở FE
  value?: string;          // để hiển thị rõ hơn ở FE
}

export interface IVariant {
  _id?: string | number; // ID MongoDB
  product_id: string | number; // liên kết với sản phẩm cha
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
}
