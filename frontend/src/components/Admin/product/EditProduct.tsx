import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { getAllAttributes } from "../../../api/attribute.api";

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
      } catch (err) {
        // console.log("API response productRes:", productRes.data?.data);
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
    } catch (err) {
      alert("Cập nhật thất bại!");
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
    <section className="section main-section">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon"><i className="mdi mdi-pencil" /></span>
            Sửa sản phẩm
          </p>
        </header>

        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Các field giống AddProduct */}
            <div className="field">
              <label className="label">Tên sản phẩm</label>
              <div className="control">
                <input {...register("name", { required: "Tên sản phẩm là bắt buộc" })} className="input" />
              </div>
              {errors.name && <p className="help is-danger">{errors.name.message}</p>}
            </div>

            <div className="field">
              <label className="label">Ảnh chính</label>
              <input {...register("images")} className="input" />
              {imageUrl && <img src={imageUrl} alt="Ảnh chính" className="h-32 mt-2 border rounded" />}
            </div>

            <div className="field">
              <label className="label">Mô tả</label>
              <textarea {...register("description")} className="textarea" />
            </div>

            <div className="field">
              <label className="label">Danh mục</label>
              <div className="select">
                <select {...register("category_id", { required: "Chọn danh mục" })}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {errors.category_id && <p className="help is-danger">{errors.category_id.message}</p>}
            </div>

            <div className="field">
              <label className="label">Trạng thái</label>
              <div className="select">
                <select {...register("status")}>
                  <option value="active">Đang bán</option>
                  <option value="disabled">Tạm tắt</option>
                  <option value="new">Mới</option>
                  <option value="bestseller">Bán chạy</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label">Thuộc tính</label>
              <div className="field-body">
                <div className="field grouped multiline">
                  {attributes.map((att: any) => (
                    <label className="checkbox mr-4" key={att._id}>
                      <input
                        type="checkbox"
                        value={att._id}
                        {...register("attributes")}
                        defaultChecked={watch("attributes")?.includes(att._id)}
                      />
                      <span className="check" />
                      <span className="control-label">{att.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Album (ảnh phụ)</label>
              <input {...register("album")} className="input" />
              {renderAlbumImages()}
            </div>

            <div className="field">
              <label className="label">SKU</label>
              <input {...register("sku")} className="input" />
            </div>

            <div className="field is-grouped mt-6">
              <div className="control">
                <button type="submit" className="button is-primary">Cập nhật</button>
              </div>
              <div className="control">
                <Link to="/admin/product" className="button is-light">Quay lại</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
