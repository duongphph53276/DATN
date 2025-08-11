export interface IVariantAttribute {
  attribute_id?: string;
  attribute_name?: string;
  value?: string;
}

export interface IVariant {
  attributes?: IVariantAttribute[];
  createdAt: string;
  image?: string
  price: number
  product_id: string
  quantity: number
  sold_quantity: number
  updatedAt: string
  _id: string
}

export interface CartItem {
  id: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: IVariant;
}

export interface Address {
  _id: string;
  user_id: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountInfo {
  max_discount_amount: any;
  discount_type: string;
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  start_date: string;
  end_date: string;
  quantity: number;
  used_quantity: number;
  is_active: boolean;
  min_order_value: number;
  max_user_number: number;
  applicable_products: string[];
}