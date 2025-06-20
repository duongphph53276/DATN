import { useForm, SubmitHandler, WatchObserver } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts, postProduct } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { getAllAttributes } from "../../../api/attribute.api";

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
    <section className="section main-section">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon"><i className="mdi mdi-plus-box" /></span>
            Thêm sản phẩm
          </p>
        </header>

        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label className="label">Tên sản phẩm</label>
              <div className="control">
                <input
                  {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
                  className="input"
                  type="text"
                  placeholder="Tên sản phẩm"
                />
                {errors.name && <p className="help is-danger">{errors.name.message}</p>}
              </div>
            </div>

            <div className="field">
              <label className="label">Ảnh chính</label>
              <div className="control">
                <input {...register("images")} className="input" placeholder="Link ảnh chính" />
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Ảnh chính preview" className="h-32 object-cover border rounded" />
                </div>
              )}
            </div>

            <div className="field">
              <label className="label">Mô tả</label>
              <div className="control">
                <textarea {...register("description")} className="textarea" placeholder="Mô tả chi tiết" />
              </div>
            </div>

            <div className="field">
              <label className="label">Danh mục</label>
              <div className="control">
                <div className="select">
                  <select {...register("category_id", { required: "Bắt buộc chọn danh mục" })}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.category_id && <p className="help is-danger">{errors.category_id.message}</p>}
            </div>

            <div className="field">
              <label className="label">Trạng thái</label>
              <div className="control">
                <div className="select">
                  <select {...register("status")}>
                    <option value="active">Đang bán</option>
                    <option value="disabled">Tạm tắt</option>
                    <option value="new">Mới</option>
                    <option value="bestseller">Bán chạy</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Thuộc tính</label>
              <div className="field-body">
                <div className="field grouped multiline">
                  <div className="control">
                    {attributes.map((att: any) => (
                    <label className="checkbox mr-4" key={att._id}>
                      <input type="checkbox" value={att._id} {...register("attributes")} />
                      <span className="check" />
                      <span className="control-label">{att.name}</span>
                    </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Album (ảnh phụ, cách nhau bằng dấu phẩy)</label>
              <div className="control">
                <input {...register("album")} className="input" placeholder="https://... , https://..." />
              </div>
              {renderAlbumImages()}
            </div>

            <div className="field">
              <label className="label">SKU</label>
              <div className="control">
                <input {...register("sku")} className="input" placeholder="SKU" />
              </div>
            </div>

            <div className="field is-grouped mt-6">
              <div className="control">
                <button type="submit" className="button is-primary">Thêm sản phẩm</button>
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

export default AddProduct;
