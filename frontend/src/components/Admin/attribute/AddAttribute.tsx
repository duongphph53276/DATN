import { useForm } from "react-hook-form";
import { createAttribute } from "../../../api/attribute.api";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  display_name: string;
  type: "text" | "number" | "boolean" | "select";
};

const AddAttribute = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<FormData>();

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
    <section className="section main-section">
      <div className="card mb-6">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon"><i className="mdi mdi-shape" /></span>
            Thêm thuộc tính
          </p>
          <button
            onClick={() => navigate("/admin/attribute")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Quay lại
          </button>
        </header>

        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="field">
              <label className="label">Tên thuộc tính (ví dụ: size, color)</label>
              <div className="control has-icons-left">
                <input
                  {...register("name", { required: "Không được để trống" })}
                  className="input"
                  type="text"
                  placeholder="Tên thuộc tính mới"
                />
                <span className="icon left"><i className="mdi mdi-tag-outline" /></span>
              </div>
              <p className="help is-danger">{errors.name?.message}</p>
            </div>

            <div className="field">
              <label className="label">Tên hiển thị (ví dụ: Kích thước)</label>
              <div className="control has-icons-left">
                <input
                  {...register("display_name", { required: "Không được để trống" })}
                  className="input"
                  type="text"
                  placeholder="Tên hiển thị"
                />
                <span className="icon left"><i className="mdi mdi-text" /></span>
              </div>
              <p className="help is-danger">{errors.display_name?.message}</p>
            </div>

            <div className="field">
              <label className="label">Loại</label>
              <div className="control">
                <div className="select">
                  <select {...register("type")}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field grouped">
              <div className="control">
                <button type="submit" className="button green">
                  Thêm mới
                </button>
              </div>
              <div className="control">
                <button type="button" className="button red" onClick={() => reset()}>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddAttribute;
