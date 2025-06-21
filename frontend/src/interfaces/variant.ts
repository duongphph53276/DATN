export interface IVariantAttribute {
  attribute_id: string;
  value_id: string;
  attribute_name?: string; // để hiển thị rõ hơn ở FE
  value?: string;          // để hiển thị rõ hơn ở FE
}

export interface IVariant {
  _id?: string;
  product_id: string; // liên kết với sản phẩm cha
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
  attributes: IVariantAttribute[];
}
