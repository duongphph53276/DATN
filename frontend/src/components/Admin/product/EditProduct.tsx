import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, putProduct } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { getAllAttributes } from "../../../api/attribute.api";

type EditProductForm = {
  name: string;
  images?: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "draft" | "new" | "bestseller";
  attributes?: string[];
  album?: string;
  sku?: string;
};

const EditProduct = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProductForm>();

  // Load dữ liệu sản phẩm, danh mục, thuộc tính
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await getProductById(id);
      const product = res.data.data;

      // Gán dữ liệu vào form
      setValue("name", product.name);
      setValue("images", product.images || "");
      setValue("description", product.description || "");
      setValue("category_id", product.category_id);
      setValue("status", product.status);
      setValue("sku", product.sku || "");
      setValue("album", (product.album || []).join(","));

      setValue("attributes", product.attributes || []);

      const catRes = await getCategories();
      const attRes = await getAllAttributes();

      setCategories(catRes.data.data);
      setAttributes(attRes.data.data);
    };

    fetchData();
  }, [id, setValue]);

  // Xử lý submit form
  const onSubmit: SubmitHandler<EditProductForm> = async (data) => {
    if (!id) return;

    const payload = {
      ...data,
      album: data.album?.split(",").map((img) => img.trim()) || [],
    };

    try {
      await putProduct(id, payload);
      alert("Cập nhật thành công!");
      navigate("/admin/products"); // tùy đường dẫn
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="w-[80%] mx-auto rounded-lg bg-white p-8 shadow-lg">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
          placeholder="Tên sản phẩm"
          className="input"
        />
        <div className="text-red-500">{errors.name?.message}</div>

        <input {...register("images")} placeholder="Link ảnh chính" className="input" />

        <textarea {...register("description")} placeholder="Mô tả" className="input" rows={3} />

        <select {...register("category_id", { required: "Chọn danh mục" })} className="input">
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="text-red-500">{errors.category_id?.message}</div>

        <select {...register("status")} className="input">
          <option value="active">Kích hoạt</option>
          <option value="disabled">Tạm tắt</option>
          <option value="draft">Bản nháp</option>
          <option value="new">Mới</option>
          <option value="bestseller">Bán chạy</option>
        </select>

        <div className="space-y-2">
          <label className="block">Thuộc tính</label>
          {attributes.map((att) => (
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

        <input {...register("album")} placeholder="Ảnh phụ (phân cách bởi dấu phẩy)" className="input" />

        <input {...register("sku")} placeholder="SKU" className="input" />

        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
