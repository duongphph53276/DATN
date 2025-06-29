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
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm thuộc tính</h1>
        <button
          onClick={() => navigate("/admin/attribute")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 space-y-5">
        {/* Tên thuộc tính */}
        <div>
          <label className="block font-medium mb-1">Tên thuộc tính (vd: size, color)</label>
          <input
            {...register("name", { required: "Không được để trống" })}
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Nhập tên thuộc tính"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Tên hiển thị */}
        <div>
          <label className="block font-medium mb-1">Tên hiển thị (vd: Kích thước)</label>
          <input
            {...register("display_name", { required: "Không được để trống" })}
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Nhập tên hiển thị"
          />
          {errors.display_name && (
            <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
          )}
        </div>

        {/* Loại thuộc tính */}
        <div>
          <label className="block font-medium mb-1">Loại thuộc tính</label>
          <select
            {...register("type")}
            className="w-full border px-3 py-2 rounded bg-white"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="select">Select</option>
          </select>
        </div>

        {/* Button actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Thêm mới
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAttribute;
