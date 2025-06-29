import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getAllAttributes, getAttributeValueById } from "../../../../api/attribute.api";
import { addVariant } from "../../../../api/variant.api";

interface IVariantAttribute {
  attribute_id: string;
  value_id: string;
}

interface IVariantForm {
  price: number;
  quantity: number;
  image?: string;
  attributes: IVariantAttribute[];
}

const AddVariant = () => {
  const { id: productId } = useParams(); // productId từ URL
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, setValue } = useForm<IVariantForm>({
    defaultValues: {
      attributes: [],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "attributes",
  });

  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, any[]>>({});

  // Lấy thuộc tính sản phẩm
  useEffect(() => {
    const fetchAttributes = async () => {
      const res = await getAllAttributes();
      const attrList = res.data.data || [];
      setAttributes(attrList);

      attrList.forEach((attr: any) => {
        append({ attribute_id: attr._id, value_id: "" });
      });
    };
    fetchAttributes();
  }, [append]);

  // Lấy giá trị thuộc tính
  useEffect(() => {
    const fetchValues = async () => {
      for (let attr of attributes) {
        const res = await getAttributeValueById(attr._id);
        setAttributeValues((prev) => ({ ...prev, [attr._id]: res.data.data || [] }));
      }
    };
    if (attributes.length > 0) fetchValues();
  }, [attributes]);

  const onSubmit = async (data: IVariantForm) => {
    try {
      const payload = { ...data, product_id: productId };
      await addVariant(payload);
      alert("Thêm biến thể thành công!");
      navigate(`/admin/product/${productId}`);
    } catch (err) {
      alert("Lỗi khi thêm biến thể");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Thêm biến thể</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-5">
        {/* Giá */}
        <div>
          <label className="block font-medium mb-1">Giá</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block font-medium mb-1">Số lượng</label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Ảnh */}
        <div>
          <label className="block font-medium mb-1">Ảnh (URL)</label>
          <input
            type="text"
            {...register("image")}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Thuộc tính */}
        <div>
          <label className="block font-semibold mb-2">Chọn thuộc tính</label>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1">
                  {attributes.find((a) => a._id === field.attribute_id)?.name || "Thuộc tính"}
                </label>
                <select
                  {...register(`attributes.${index}.value_id`)}
                  className="w-full border px-3 py-2 rounded"
                  defaultValue=""
                >
                  <option value="" disabled>-- Chọn giá trị --</option>
                  {attributeValues[field.attribute_id]?.map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.value}
                    </option>
                  ))}
                </select>
                {/* Hidden attribute_id */}
                <input
                  type="hidden"
                  value={field.attribute_id}
                  {...register(`attributes.${index}.attribute_id`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Nút Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Thêm biến thể
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVariant;
