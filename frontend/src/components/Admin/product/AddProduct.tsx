import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { postProduct } from "../../../../api/product.api";
import { getCategories } from "../../../../api/category.api.ts";
import { uploadToCloudinary } from "../../../lib/cloudinary.ts";

type AddProductForm = {
  name: string;
  category_id: string;
  description?: string;
  status?: "active" | "disabled" | "new" | "bestseller";
  sku?: string;
  average_rating?: number;
  sold_quantity?: number;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [productId] = useState<number>(0);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductForm>();

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getCategories();
      setCategories(catRes.data.data);
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<AddProductForm> = async (data) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const albumUrls = await Promise.all(
        albumFiles.map((file) => uploadToCloudinary(file))
      );

      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = {
        ...data,
        product_id: productId,
        images: imageUrl,
        album: albumUrls,
      };

      await postProduct(payload);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm mới thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-ecommerce p-6 max-w-7xl mx-auto">
      {/* Add Product */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4">
        <div className="d-flex flex-column justify-content-center">
          <h4 className="mb-1">Add a new Product</h4>

        </div>
        <div className="d-flex align-content-center flex-wrap gap-4">
          {/* <div className="d-flex gap-4"><button className="btn btn-label-secondary">Discard</button> <button className="btn btn-label-primary">Save draft</button></div> */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/product")}
          >
            Quay lại
          </button>
        </div>
      </div>
      <div className="row">
        {/* First column (2/3) */}
        <div className="col-12 col-lg-8">
          {/* Product Information */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Product Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-6">
                <label className="form-label" htmlFor="ecommerce-product-name">Name</label>
                <input
                  {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
                  type="text"
                  className="form-control"
                  id="ecommerce-product-name"
                  placeholder="Product title"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="row mb-6">
                <div className="col">
                  <label className="form-label" htmlFor="ecommerce-product-sku">SKU</label>
                  <input
                    {...register("sku")}
                    type="test"
                    className="form-control"
                    id="ecommerce-product-sku"
                    placeholder="SKU"
                  />
                </div>
                {/* <div className="col">
                  <label className="form-label" htmlFor="ecommerce-product-barcode">Barcode</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ecommerce-product-barcode"
                    placeholder="0123-4567"
                  />
                </div> */}
              </div>
              <div>
                <label className="mb-1">Description (Optional)</label>
                <textarea
                  {...register("description")}
                  className="form-control p-0"
                  rows={5}
                  placeholder="Product Description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second column (1/3) */}
        <div className="col-12 col-lg-4">
          {/* Organize */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Organize</h5>
            </div>
            <div className="card-body">
              <div className="mb-6">
                <label className="form-label mb-1" htmlFor="category-org">Category</label>
                <select
                  {...register("category_id", { required: "Bắt buộc chọn danh mục" })}
                  className="form-select"
                  id="category-org"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
              </div>
              <div className="mb-6">
                <label className="form-label mb-1" htmlFor="status-org">Status</label>
                <select
                  {...register("status")}
                  className="form-select"
                  id="status-org"
                >
                  <option value="active">Đang bán</option>
                  <option value="disabled">Tạm tắt</option>
                  <option value="new">Mới</option>
                  <option value="bestseller">Bán chạy</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="form-label mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="form-control"
                />
                {imageFile && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <img src={URL.createObjectURL(imageFile)} className="h-20 object-cover border rounded" />
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="form-label mb-1">Album ảnh</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setAlbumFiles(Array.from(e.target.files || []))}
                  className="form-control"
                />
                {albumFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {albumFiles.map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} className="h-20 object-cover border rounded" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Buttons (Left-aligned) */}
      <div className="flex justify-start gap-4 pt-4">

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default AddProduct;