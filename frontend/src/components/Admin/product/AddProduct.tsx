import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts, postProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api";
import { getAllAttributes } from "../../../../api/attribute.api";

type AddProductForm = {
  name: string;
  images?: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  attributes?: string[];
  album?: string;
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [productId] = useState<number>(0);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AddProductForm>();

  const imageUrl = watch("images");
  const albumString = watch("album");

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getCategories();
      const attRes = await getAllAttributes();
      await getAllProducts();
      setCategories(catRes.data.data);
      setAttributes(attRes.data.data);
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<AddProductForm> = async (data) => {
    try {
      const payload = {
        ...data,
        product_id: productId,
        album: data.album?.split(",").map((item) => item.trim()) || [],
      };
      await postProduct(payload);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      alert("Thêm mới thất bại");
    }
  };

  const renderAlbumImages = () => {
    if (!albumString) return null;
    const urls = albumString.split(",").map((item) => item.trim());
    return (
      <div className="grid grid-cols-3 gap-2 mt-2">
        {urls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Ảnh phụ ${index + 1}`}
            className="w-full h-24 object-cover border rounded"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Tên sản phẩm</label>
            <input
              {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              type="text"
              placeholder="Tên sản phẩm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Ảnh chính</label>
            <input
              {...register("images")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Link ảnh chính"
            />
            {imageUrl && (
              <img src={imageUrl} alt="Ảnh chính preview" className="h-32 mt-2 object-cover border rounded" />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Mô tả</label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Mô tả chi tiết"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Danh mục</label>
            <select
              {...register("category_id", { required: "Bắt buộc chọn danh mục" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Trạng thái</label>
            <select
              {...register("status")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="active">Đang bán</option>
              <option value="disabled">Tạm tắt</option>
              <option value="new">Mới</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Thuộc tính</label>
            <div className="flex flex-wrap gap-4">
              {attributes.map((att: any) => (
                <label className="flex items-center gap-1" key={att._id}>
                  <input type="checkbox" value={att._id} {...register("attributes")} />
                  <span>{att.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Album (ảnh phụ, cách nhau bằng dấu phẩy)</label>
            <input
              {...register("album")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="https://... , https://..."
            />
            {renderAlbumImages()}
          </div>

          <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              {...register("sku")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="SKU"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Thêm sản phẩm
            </button>
            <Link to="/admin/product" className="text-gray-600 hover:underline">Quay lại</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
