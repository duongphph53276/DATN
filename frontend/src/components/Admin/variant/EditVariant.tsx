import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { getVariantById, updateVariant } from "../../../../api/variant.api";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";
import { uploadToCloudinary } from "../../../lib/cloudinary";

type VariantForm = {
  price: number;
  quantity: number;
  image?: string;
  sold_quantity?: number;
};

type VariantAttribute = {
  attribute_id: string;
  value_id: string;
};

const EditVariant = () => {
  const { variantId, productId } = useParams<{ variantId: string; productId: string }>();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<VariantAttribute[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VariantForm>();

  useEffect(() => {
    const fetchData = async () => {
      if (!variantId) {
        setError("ID biến thể không hợp lệ");
        return;
      }

      try {
        const [variantRes, attrRes] = await Promise.all([
          getVariantById(variantId),
          getAllAttributes(),
        ]);

        const variant = variantRes.data.data;
        console.log("variant:", variant);

        if (!variant) {
          setError("Biến thể không tồn tại");
          return;
        }

        setValue("price", variant.price);
        setValue("quantity", variant.quantity);
        setValue("sold_quantity", variant.sold_quantity || 0);
        setImagePreview(variant.image || "");
        setAttributes(attrRes.data.data);

        if (Array.isArray(variant.attributes)) {
          const mappedAttrs: VariantAttribute[] = variant.attributes.map((attr: { attribute_id?: string; value_id?: string }) => ({
            attribute_id: attr.attribute_id || "",
            value_id: attr.value_id || "",
          }));

          console.log("mappedAttrs:", mappedAttrs);
          setSelectedAttributes(mappedAttrs);

          const validAttributeIds = mappedAttrs.map(attr => attr.attribute_id).filter(Boolean);
          const promises = validAttributeIds.map((attrId: string) => getAttributeValues(attrId));
          const res = await Promise.all(promises);
          const values = res.flatMap((r) => r.data.data || []);
          setAttributeValues(values);
        }
      } catch (err) {
        setError("Không thể tải thông tin biến thể");
        console.error("Lỗi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [variantId, setValue]);

  const handleAttributeChange = (index: number, field: keyof VariantAttribute, value: string) => {
    const updated = [...selectedAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedAttributes(updated);

    if (field === "attribute_id") {
      getAttributeValues(value).then(res => {
        setAttributeValues(prev => {
          const newValues = res.data.data || [];
          const merged = [...prev, ...newValues];
          return Array.from(new Map(merged.map(item => [item._id, item])).values());
        });
      });
    }
  };

  const handleSubmitForm: SubmitHandler<VariantForm> = async (data) => {
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        ...data,
        product_id: productId ?? "", // ép kiểu rõ ràng
        image: imageUrl,
        attributes: selectedAttributes,
      };

      await updateVariant(variantId as string, payload);
      alert("Cập nhật biến thể thành công!");
      navigate(`/admin/product/${productId}`);
    } catch (err) {
      console.error("Lỗi khi cập nhật biến thể:", err);
      alert("Cập nhật thất bại");
    }
  };

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sửa biến thể</h1>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        <div>
          <label className="block font-medium">Giá</label>
          <input
            type="number"
            {...register("price", { required: true, min: 0 })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.price && <p className="text-red-500 text-sm">Giá không hợp lệ</p>}
        </div>

        <div>
          <label className="block font-medium">Số lượng</label>
          <input
            type="number"
            {...register("quantity", { required: true, min: 0 })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.quantity && <p className="text-red-500 text-sm">Số lượng không hợp lệ</p>}
        </div>

        <div>
          <label className="block font-medium">Ảnh biến thể</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file || null);
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
            className="w-full"
          />
          {imagePreview && <img src={imagePreview} alt="preview" className="h-32 mt-2 object-cover border rounded" />}
        </div>

        <div>
          <label className="block font-medium mb-2">Thuộc tính</label>
          {selectedAttributes.map((attr, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={attr.attribute_id}
                onChange={(e) => handleAttributeChange(index, "attribute_id", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">-- Chọn thuộc tính --</option>
                {attributes.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <select
                value={attr.value_id}
                onChange={(e) => handleAttributeChange(index, "value_id", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">-- Chọn giá trị --</option>
                {attributeValues
                  .filter((val: any) => String(val.attribute_id) === String(attr.attribute_id))
                  .map((val: any) => (
                    <option key={val._id} value={val._id}>
                      {val.value}
                    </option>
                  ))}
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setSelectedAttributes([...selectedAttributes, { attribute_id: "", value_id: "" }])}
            className="text-blue-600 underline mt-2"
          >
            + Thêm thuộc tính
          </button>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Cập nhật
          </button>
          <Link to={`/admin/product/${productId}`} className="text-gray-600 hover:underline">
            ⬅ Quay lại
          </Link>
        </div>
      </form>
    </section>
  );
};

export default EditVariant;
