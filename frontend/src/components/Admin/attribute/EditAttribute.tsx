import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getAttributeById, updateAttribute } from "../../../../api/attribute.api";
import { ToastSucess, ToastError } from "../../../utils/toast";

type AttributeForm = {
  name: string;
  display_name: string;
  type?: "number" | "boolean" | "text" | "select";
};

const EditAttribute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset } = useForm<AttributeForm>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAttributeById(id as string);
        const data = res.data.data;
        setValue("name", data.name);
        setValue("display_name", data.display_name);
        setValue("type", data.type);
      } catch (err) {
        ToastError("Không tìm thấy thuộc tính");
        navigate("/admin/attribute");
      }
    };
    fetchData();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: AttributeForm) => {
    try {
      await updateAttribute(id as string, data);
      ToastSucess("Cập nhật thành công!");
      navigate("/admin/attribute");
    } catch (err) {
      ToastError("Cập nhật thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cập nhật thuộc tính</h1>
        <button
          onClick={() => navigate("/admin/attribute")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white shadow-md p-6 rounded-lg">
        <div>
          <label className="block font-medium mb-1">Tên thuộc tính</label>
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="VD: color, size"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tên hiển thị</label>
          <input
            {...register("display_name", { required: true })}
            type="text"
            placeholder="Tên hiển thị"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Loại thuộc tính</label>
          <select
            {...register("type")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="select">Select</option>
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAttribute;
