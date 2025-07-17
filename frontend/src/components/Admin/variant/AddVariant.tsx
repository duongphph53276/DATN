import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { postVariant } from "../../../../api/variant.api.ts";
import { getProductById } from "../../../../api/product.api.ts";
import { getVariantsByProduct } from "../../../../api/variant.api.ts";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api.ts";
import { uploadToCloudinary } from "../../../lib/cloudinary.ts";

type AddVariantForm = {
  product_id: string;
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
};

const AddVariant = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ attribute_id: string; value_id: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingVariants, setExistingVariants] = useState<any[]>([]);
  const [duplicateError, setDuplicateError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddVariantForm>();

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        alert("Không tìm thấy ID sản phẩm trong URL");
        navigate("/admin/product");
        return;
      }

      try {
        const [productRes, attRes, variantsRes] = await Promise.all([
          getProductById(productId),
          getAllAttributes(),
          getVariantsByProduct(productId),
        ]);
        setProduct(productRes.data.data?.product);
        setAttributes(attRes.data.data);
        setExistingVariants(variantsRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        alert("Không thể tải dữ liệu sản phẩm hoặc thuộc tính");
      }
    };
    fetchData();
  }, [productId, navigate]);

  useEffect(() => {
    const fetchAttributeValues = async () => {
      if (selectedAttributes.length > 0) {
        const promises = selectedAttributes.map((attr) =>
          attr.attribute_id ? getAttributeValues(attr.attribute_id) : Promise.resolve({ data: { data: [] } })
        );
        const results = await Promise.all(promises);
        const allValues = results.flatMap((res) => res.data.data);
        setAttributeValues(allValues);
      }
    };
    fetchAttributeValues();
  }, [selectedAttributes]);

  const normalizeAttributes = (attrs: { attribute_id: any; value_id: any }[] = []) =>
    attrs
      .map((a) => `${a.attribute_id}-${a.value_id}`)
      .sort() 
      .join("|");

  const onSubmit: SubmitHandler<AddVariantForm> = async (data) => {
    if (!productId) {
      alert("ID sản phẩm không hợp lệ");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (isSubmitting) return;
      setIsSubmitting(true);
      setDuplicateError(false);

      const validAttributes = selectedAttributes.filter((attr) => attr.attribute_id && attr.value_id);

      if (validAttributes.length === 0) {
        alert("Vui lòng chọn ít nhất một thuộc tính hợp lệ!");
        return;
      }

      const newKey = normalizeAttributes(validAttributes);
      const isDuplicate = existingVariants.some((variant) => {
        if (!Array.isArray(variant.attributes)) return false;
        const existingKey = normalizeAttributes(variant.attributes);
        return existingKey === newKey;
      });

      if (isDuplicate) {
        setDuplicateError(true);
        return;
      }

      const payload = {
        ...data,
        product_id: productId,
        image: imageUrl,
        sold_quantity: data.sold_quantity || 0,
        attributes: validAttributes,
      };

      await postVariant(payload);
      alert("Thêm biến thể thành công!");

      const variantsRes = await getVariantsByProduct(productId);
      setExistingVariants(variantsRes.data.data || []);
      navigate(`/admin/product/${productId}`);
    } catch (error: any) {
      console.error("Lỗi khi thêm biến thể:", error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Dữ liệu không hợp lệ");
      } else {
        alert("Thêm biến thể thất bại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAttribute = () => {
    setSelectedAttributes([...selectedAttributes, { attribute_id: "", value_id: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = selectedAttributes.filter((_, i) => i !== index);
    setSelectedAttributes(newAttributes);
  };

  const handleAttributeChange = (index: number, field: string, value: string) => {
    const newAttributes = [...selectedAttributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setSelectedAttributes(newAttributes);
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Thêm biến thể cho {product?.name}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block font-medium mb-1">* Giá</label>
            <input
              {...register("price", { required: "Giá là bắt buộc", min: 0 })}
              type="number"
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Nhập giá"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">* Số lượng</label>
            <input
              {...register("quantity", { required: "Số lượng là bắt buộc", min: 0 })}
              type="number"
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Nhập số lượng"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Ảnh biến thể</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                className="h-32 mt-2 object-cover border rounded"
                alt="Ảnh biến thể"
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Thuộc tính</label>
            {selectedAttributes.map((attr, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <select
                  value={attr.attribute_id || ""}
                  onChange={(e) => handleAttributeChange(index, "attribute_id", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">-- Chọn thuộc tính --</option>
                  {attributes.map((att: any) => (
                    <option key={att._id} value={att._id}>
                      {att.name}
                    </option>
                  ))}
                </select>
                <select
                  value={attr.value_id || ""}
                  onChange={(e) => handleAttributeChange(index, "value_id", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">-- Chọn giá trị --</option>
                  {attributeValues
                    .filter((val: any) => val.attribute_id === attr.attribute_id)
                    .map((val: any) => (
                      <option key={val._id} value={val._id}>
                        {val.value}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
            {duplicateError && (
              <p className="text-red-500 text-sm mt-1">
                Biến thể với thuộc tính này đã tồn tại trong sản phẩm.
              </p>
            )}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Thêm thuộc tính
            </button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Thêm biến thể
            </button>
            <Link to={`/admin/product/${productId}`} className="text-gray-600 hover:underline">
              ⬅ Quay lại
            </Link>
          </div>
        </div>

        <div className="space-y-6"></div>
      </form>
    </section>
  );
};

export default AddVariant;
