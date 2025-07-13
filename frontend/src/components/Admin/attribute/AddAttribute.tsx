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
    <div className="app-ecommerce p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4">
          <div className="d-flex flex-column justify-content-center">
            <h4 className="mb-1">Thêm thuộc tính mới</h4>
          </div>
          <div className="d-flex align-content-center flex-wrap gap-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/attribute")}
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card mb-6" style={{ minHeight: "400px" }}>
              <div className="card-header">
                <h5 className="card-title mb-0">Thông tin thuộc tính</h5>
              </div>
              <div className="card-body py-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="row">
                    {/* Tên thuộc tính */}
                    <div className="col-12 col-md-6 mb-6">
                      <label className="form-label" htmlFor="attribute-name">
                        Tên thuộc tính (vd: size, color)
                      </label>
                      <input
                        {...register("name", { required: "Không được để trống" })}
                        type="text"
                        className="form-control form-control-lg"
                        id="attribute-name"
                        placeholder="Nhập tên thuộc tính"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Tên hiển thị */}
                    <div className="col-12 col-md-6 mb-6">
                      <label className="form-label" htmlFor="attribute-display-name">
                        Tên hiển thị (vd: Kích thước)
                      </label>
                      <input
                        {...register("display_name", { required: "Không được để trống" })}
                        type="text"
                        className="form-control form-control-lg"
                        id="attribute-display-name"
                        placeholder="Nhập tên hiển thị"
                      />
                      {errors.display_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Loại thuộc tính (căn giữa) */}
                  <div className="text-center">
                    <label className="form-label" htmlFor="attribute-type">
                      Loại thuộc tính
                    </label>
                    <select
                      {...register("type")}
                      className="form-select form-select-lg d-inline-block w-auto"
                      id="attribute-type"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                </form>
              </div>
              {/* Buttons inside card footer */}
              <div className="card-footer d-flex justify-content-start gap-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  Thêm mới
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => reset()}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAttribute;