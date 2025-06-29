import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api";
import { getAllAttributes } from "../../../../api/attribute.api";

type EditProductForm = {
  name: string;
  images?: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  attributes?: string[];
  album?: string;
  sku?: string;
};

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<EditProductForm>();

  const imageUrl = watch("images");
  const albumString = watch("album");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, attRes, productRes] = await Promise.all([
          getCategories(),
          getAllAttributes(),
          getProductById(id!),
        ]);
        setCategories(catRes.data.data);
        setAttributes(attRes.data.data);

        const product = productRes.data.data?.product;
        if (!product || !product._id) {
          alert("Không tìm thấy sản phẩm");
          navigate("/admin/product");
          return;
        }

        setValue("name", product.name);
        setValue("images", product.images || "");
        setValue("description", product.description || "");
        setValue("category_id", product.category_id._id);
        setValue("status", product.status || "active");
        setValue("attributes", product.attributes?.map((a: any) => a._id));
        setValue("album", product.album?.join(", ") || "");
        setValue("sku", product.sku || "");
      } catch {
        alert("Không tìm thấy sản phẩm");
        navigate("/admin/product");
      }
    };
    fetchData();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: EditProductForm) => {
    try {
      const payload = {
        ...data,
        album: data.album?.split(",").map((item) => item.trim()) || [],
      };
      await updateProduct(id!, payload);
      alert("Cập nhật thành công!");
      navigate("/admin/product");
    } catch {
      alert("Cập nhật thất bại!");
    }
  };

  const renderAlbumImages = () => {
    if (!albumString) return null;
    const urls = albumString.split(",").map((item) => item.trim());
    return (
      <div className="grid grid-cols-3 gap-3 mt-3">
        {urls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Ảnh phụ ${idx + 1}`}
            className="w-full h-24 object-cover border rounded"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sửa sản phẩm</h1>
        <Link
          to="/admin/product"
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ← Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 shadow rounded-lg">
        {/* Tên */}
        <div>
          <label className="block font-medium mb-1">Tên sản phẩm *</label>
          <input
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Ảnh chính */}
        <div>
          <label className="block font-medium mb-1">Ảnh chính</label>
          <input {...register("images")} className="w-full border px-3 py-2 rounded" />
          {imageUrl && (
            <img src={imageUrl} alt="Ảnh chính" className="h-32 mt-2 object-cover rounded border" />
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description")}
            className="w-full border px-3 py-2 rounded min-h-[100px]"
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block font-medium mb-1">Danh mục *</label>
          <select
            {...register("category_id", { required: "Chọn danh mục" })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
          )}
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block font-medium mb-1">Trạng thái</label>
          <select {...register("status")} className="w-full border px-3 py-2 rounded">
            <option value="active">Đang bán</option>
            <option value="disabled">Tạm tắt</option>
            <option value="new">Mới</option>
            <option value="bestseller">Bán chạy</option>
          </select>
        </div>

        {/* Thuộc tính */}
        <div>
          <label className="block font-medium mb-1">Thuộc tính</label>
          <div className="flex flex-wrap gap-3">
            {attributes.map((att: any) => (
              <label key={att._id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={att._id}
                  {...register("attributes")}
                  defaultChecked={watch("attributes")?.includes(att._id)}
                  className="accent-blue-600"
                />
                {att.name}
              </label>
            ))}
          </div>
        </div>

        {/* Album ảnh phụ */}
        <div>
          <label className="block font-medium mb-1">Album (ảnh phụ, phân cách dấu phẩy)</label>
          <input {...register("album")} className="w-full border px-3 py-2 rounded" />
          {renderAlbumImages()}
        </div>

        {/* SKU */}
        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input {...register("sku")} className="w-full border px-3 py-2 rounded" />
        </div>

        {/* Nút submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Cập nhật
          </button>
          <Link
            to="/admin/product"
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
