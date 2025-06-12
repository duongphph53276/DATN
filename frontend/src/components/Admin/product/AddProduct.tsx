import { useForm, SubmitHandler } from "react-hook-form";
import { getAllProducts, postProduct } from "../../../api/product.api";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/category.api";
import { getAllAttributes } from "../../../api/attribute.api"; // bạn cần có API này

type AddProductForm = {
  name: string;
  images?: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "draft" | "new" | "bestseller";
  attributes?: string[];
  album?: string;
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
};

const AddProduct = () => {
  // const navigate = useNavigate();
  const [productId, setProductId] = useState<number>(0);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getCategories();
      const attRes = await getAllAttributes();
      const res = await getAllProducts();
      const data = res.data.data;
      setCategories(catRes.data.data);
      setAttributes(attRes.data.data);
      const maxId = data.reduce((max: number, pro: any) => (
        pro.product_id > max ? pro.product_id : max
      ), 0);

      setProductId(maxId + 1);
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductForm>();

  const onSubmit: SubmitHandler<AddProductForm> = async (data) => {
    try {
      const payload = {
        ...data,
        product_id: productId,
        album: data.album?.split(',').map(item => item.trim()) || [],
      };
      await postProduct(payload);
      alert('Thêm thành công!');
      //   navigate("/admin");
    } catch {
      alert("Thêm mới thất bại");
    }
  };

  return (
    <div className="w-[80%] mx-auto rounded-lg bg-white p-8 shadow-lg">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Mã sản phẩm (product_id)</label>
          <input
            type="number"
            className="w-full p-2 border rounded bg-gray-100 text-gray-500"
            value={productId}
            readOnly
          />
        </div>
        {/* Name */}
        <input {...register("name", { required: "Tên sản phẩm là bắt buộc" })} placeholder="Tên sản phẩm" className="input" />
        <div className="text-red-500">{errors.name?.message}</div>

        {/* Ảnh đại diện */}
        <input {...register("images")} placeholder="Link ảnh chính" className="input" />

        {/* Mô tả */}
        <textarea {...register("description")} placeholder="Mô tả" className="input" rows={3} />

        {/* Danh mục */}
        <select {...register("category_id", { required: "Chọn danh mục" })} className="input">
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <div className="text-red-500">{errors.category_id?.message}</div>

        {/* Trạng thái */}
        <select {...register("status")} className="input">
          <option value="active">Kích hoạt</option>
          <option value="disabled">Tạm tắt</option>
          <option value="draft">Bản nháp</option>
          <option value="new">Mới</option>
          <option value="bestseller">Bán chạy</option>
        </select>

        <div className="space-y-2">
          <label className="block">Thuộc tính</label>
          {attributes.map((att: any) => (
            <div key={att._id}>
              <input
                type="checkbox"
                value={att._id}
                {...register("attributes")}
                className="mr-2"
              />
              {att.name}
            </div>
          ))}
        </div>

        <input
          {...register("album")}
          placeholder="Link ảnh phụ (cách nhau bởi dấu phẩy)"
          className="input"
        />

        {/* SKU */}
        <input {...register("sku")} placeholder="SKU" className="input" />

        {/* Submit */}
        <button type="submit" className="bg-green-500 text-white py-2 px-6 rounded">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;
