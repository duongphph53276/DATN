import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api";
import { uploadToCloudinary } from "../../../lib/cloudinary.ts";

type EditProductForm = {
  name: string;
  images?: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  album?: string;
  sku?: string;
};

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<EditProductForm>();

  const imageUrl = watch("images");
  const albumString = watch("album"); // Có thể là string | undefined

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, productRes] = await Promise.all([
          getCategories(),
          getProductById(id!),
        ]);
        setCategories(catRes.data.data);

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
        setValue("album", product.album?.join(", ") || ""); // Đảm bảo giá trị mặc định là chuỗi rỗng
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
      let imageUrl = data.images || "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const albumUrls = data.album ? data.album.split(",").map((item) => item.trim()) : [];
      if (albumFiles.length > 0) {
        const newAlbumUrls = await Promise.all(
          albumFiles.map((file) => uploadToCloudinary(file))
        );
        albumUrls.push(...newAlbumUrls);
      }

      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        ...data,
        images: imageUrl,
        album: albumUrls,
      };
      await updateProduct(id!, payload);
      alert("Cập nhật thành công!");
      navigate("/admin/product");
    } catch {
      alert("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAlbumImages = () => {
    if (!albumString) return null; // Kiểm tra nếu albumString là undefined
    const urls = albumString.split(",").map((item) => item.trim());
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {urls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Ảnh phụ ${idx + 1}`}
            className="h-20 object-cover border rounded"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bên trái 2/3 */}
        <div className="md:col-span-2 space-y-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="block font-medium mb-1">* Tên sản phẩm</label>
            <input
              {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Tên sản phẩm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              {...register("sku")}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Nếu để trống sẽ tự tạo"
            />
          </div>

          {/* Ảnh chính */}
          <div>
            <label className="block font-medium mb-1">Ảnh chính sản phẩm *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {(imageFile || imageUrl) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                className="h-32 mt-2 object-cover border rounded"
                alt="Ảnh chính"
              />
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block font-medium mb-1">Mô tả sản phẩm</label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded px-4 py-2"
              rows={5}
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </div>

          {/* Nút cập nhật/quay lại */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Cập nhật sản phẩm
            </button>
            <Link to="/admin/product" className="text-gray-600 hover:underline">⬅ Quay lại</Link>
          </div>
        </div>

        {/* Bên phải 1/3 */}
        <div className="space-y-6">
          {/* Danh mục */}
          <div>
            <label className="block font-medium mb-1">Danh mục sản phẩm *</label>
            <select
              {...register("category_id", { required: "Bắt buộc chọn danh mục" })}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block font-medium mb-1">Trạng thái</label>
            <select {...register("status")} className="w-full border border-gray-300 rounded px-4 py-2">
              <option value="active">Đang bán</option>
              <option value="disabled">Tạm tắt</option>
              <option value="new">Mới</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>

          {/* Album ảnh */}
          <div>
            <label className="block font-medium mb-1">Album ảnh</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setAlbumFiles(Array.from(e.target.files || []))}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {albumFiles.length > 0 || (albumString && albumString.trim() !== "") ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(albumFiles.length > 0
                  ? albumFiles
                  : albumString!.split(",").map((url) => ({ url: url.trim() }))
                ).map((fileOrUrl, i) => (
                  <img
                    key={i}
                    src={
                      "url" in fileOrUrl
                        ? fileOrUrl.url
                        : URL.createObjectURL(fileOrUrl)
                    }
                    className="h-20 object-cover border rounded"
                    alt={`Ảnh phụ ${i + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditProduct;