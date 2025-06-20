import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getAttributeById, updateAttribute } from "../../../api/attribute.api";

type AttributeForm = {
    name: string;
    display_name: string;
    type?: "number" | "boolean" | "text" | "select";
};

const EditAttribute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm<AttributeForm>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAttributeById(id as string);
                const data = res.data.data;
                setValue("name", data.name);
                setValue("display_name", data.display_name);
                setValue("type", data.type);
            } catch (err) {
                alert("Không tìm thấy thuộc tính");
            }
        };
        fetchData();
    }, [id, setValue]);

    const onSubmit = async (data: AttributeForm) => {
        try {
            await updateAttribute(id as string, data);
            alert("Cập nhật thành công!");
            navigate("/admin/attribute");
        } catch (err) {
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <section className="section main-section">
            <div className="card mb-6">
                <header className="card-header">
                    <p className="card-header-title">
                        <span className="icon"><i className="mdi mdi-pencil" /></span>
                        Cập nhật thuộc tính
                    </p>
                    <button
                        onClick={() => navigate("/admin/attribute")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Quay lại
                    </button>
                </header>
                <div className="card-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field">
                            <label className="label">Tên thuộc tính</label>
                            <div className="control icons-left">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="VD: Color, Size"
                                    {...register("name", { required: true })}
                                />
                                <span className="icon left"><i className="mdi mdi-tag" /></span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tên hiển thị (ví dụ: Kích thước)</label>
                            <div className="control has-icons-left">
                                <input
                                    {...register("display_name", { required: true })}
                                    className="input"
                                    type="text"
                                    placeholder="Tên hiển thị"
                                />
                                <span className="icon left"><i className="mdi mdi-text" /></span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Kiểu</label>
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

                        <div className="field grouped mt-6">
                            <div className="control">
                                <button type="submit" className="button green">
                                    Cập nhật
                                </button>
                            </div>
                            <div className="control">
                                <button type="reset" className="button red">
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

export default EditAttribute;
