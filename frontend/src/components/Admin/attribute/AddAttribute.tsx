import { useForm } from "react-hook-form";
import { createAttribute } from "../../../../api/attribute.api";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  display_name: string;
  type: "text" | "number" | "boolean" | "select";
};

const AddAttribute = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await createAttribute(data);
      alert("Thêm thuộc tính thành công!");
      navigate("/admin/attribute");
    } catch (err) {
      console.error("Lỗi thêm thuộc tính:", err);
      alert("Thêm thất bại");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm thuộc tính mới</h1>
        <button
          onClick={() => navigate("/admin/attribute")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white shadow-md p-6 rounded-lg">
        <div>
          <label className="block font-medium mb-1">Tên thuộc tính</label>
          <input
            {...register("name", { required: "Không được để trống" })}
            type="text"
            placeholder="VD: color, size"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Tên hiển thị</label>
          <input
            {...register("display_name", { required: "Không được để trống" })}
            type="text"
            placeholder="Tên hiển thị"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Loại thuộc tính</label>
          <select
            {...register("type")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Thêm mới
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

export default AddAttribute;