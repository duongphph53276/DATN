export interface ICategory {
  description: any;
  _id?: string;
  name: string;
  slug?: string;
  parent_id?: string | { _id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Responses
export interface ICategoryResponse {
  message: string;
  status: boolean;
  data: ICategory[];
}

export interface ISingleCategoryResponse {
  message: string;
  status: boolean;
  data?: ICategory;
}

// ✅ Requests (dùng Pick/Omit)
export type IAddCategoryRequest = Pick<ICategory, 'name' | 'parent_id'>;
export type IEditCategoryRequest = Pick<ICategory, 'name'>;

// ✅ Error (không cần đổi vì không phụ thuộc ICategory)
export interface IErrorResponse {
  message: string;
  status: boolean;
  error: string;
}
