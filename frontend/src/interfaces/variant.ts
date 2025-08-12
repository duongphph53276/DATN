export interface IVariantAttribute {
  attribute_id: string;
  value_id: string;
  attribute_name?: string;
  value?: string;         
}

export interface IVariant {
  _id?: string | number; 
  product_id: string | number; 
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
}

export interface IVariantDisplay {
  _id?: string | number;
  product_id: string | number;
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
  attributes: {
    attribute_id: string;
    value_id: string;
    attribute_name: string; 
    value: string;          
    display_name?: string; 
  }[];
}
