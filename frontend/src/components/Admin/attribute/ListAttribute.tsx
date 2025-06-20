import { useEffect, useState } from "react";
import {
    getAllAttributes,
    deleteAttribute,
    createAttributevalue,
    getAttributeValues,
    updateAttributeValue,
    deleteAttributeValue
} from "../../../api/attribute.api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface AttributeValue {
    _id: string;
    value: string;
}

const AttributeList = () => {
    const navigate = useNavigate()
    const [attributes, setAttributes] = useState<any[]>([]);
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
    const { register, handleSubmit, reset, setValue } = useForm<{ value: string }>();
    const [editingValueId, setEditingValueId] = useState<string | null>(null);

    const fetchAttributes = async () => {
        try {
            const res = await getAllAttributes();
            setAttributes(res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách thuộc tính:", err);
        }
    };

    const fetchAttributeValues = async (attributeId: string) => {
        try {
            const res = await getAttributeValues(attributeId);
            setAttributeValues(res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy giá trị:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Xác nhận xóa?")) return;
        try {
            await deleteAttribute(id);
            setAttributes(attributes.filter((attr) => attr._id !== id));
            alert("Xóa thuộc tính thành công");
        } catch (err) {
            console.error("Lỗi khi xóa thuộc tính:", err);
        }
    };

    const handleAddValue = async (attributeId: string, data: { value: string }) => {
        try {
            if (editingValueId) {
                await updateAttributeValue(editingValueId, data);
                alert("Cập nhật thành công");
            } else {
                await createAttributevalue({ attribute_id: attributeId, value: data.value });
                alert("Thêm giá trị thành công!");
            }
            await fetchAttributeValues(attributeId);
            reset();
            setEditingValueId(null);
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Thao tác thất bại!");
        }
    };

    const handleDeleteValue = async (id: string, attributeId: string) => {
        if (!window.confirm("Xóa giá trị này?")) return;
        try {
            await deleteAttributeValue(id);
            fetchAttributeValues(attributeId);
        } catch (err) {
            console.error("Lỗi xóa value:", err);
        }
    };

    const openModal = (attrId: string) => {
        setOpenModalId(attrId);
        fetchAttributeValues(attrId);
        reset();
        setEditingValueId(null);
    };

    const startEditValue = (val: AttributeValue) => {
        setValue("value", val.value);
        setEditingValueId(val._id);
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    return (
        <section className="section main-section">
            <div className="card has-table">
                <header className="card-header">
                    <p className="card-header-title">
                        <i className="mdi mdi-shape mr-2" />
                        Danh sách thuộc tính
                    </p>
                    <a href="/admin/attribute/add" className="button blue">Thêm thuộc tính</a>
                </header>
                <div className="card-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên thuộc tính</th>
                                <th>Kiểu</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attributes.map((attr) => (
                                <tr key={attr._id}>
                                    <td>{attr.name}</td>
                                    <td>{attr.type}</td>
                                    <td>
                                        <div className="buttons">
                                            <button onClick={() => openModal(attr._id)} className="button small green --jb-modal" data-target="sample-modal-2" type="button">
                                                <span className="icon"><i className="mdi mdi-eye" /></span>
                                            </button>
                                            {/* <a href={`/admin/attribute/edit/${attr._id}`} className="button small green">
                                                <i className="mdi mdi-pencil" />
                                            </a> */}
                                            <button
                                                className="button small bg-yellow-400 hover:bg-yellow-500 text-white" type="button"
                                                onClick={() => navigate(`/admin/attribute/edit/${attr._id}`)}
                                            >
                                                <span className="icon"><i className="mdi mdi-square-edit-outline text-xl" /></span>
                                            </button>

                                            <button onClick={() => handleDelete(attr._id)} className="button small red --jb-modal" data-target="sample-modal" type="button"                                       >
                                                <span className="icon"><i className="mdi mdi-trash-can" /></span>
                                            </button>
                                        </div>

                                        {/* Modal */}
                                        {openModalId === attr._id && (
                                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                                    <h2 className="text-lg font-bold mb-4">Giá trị cho: {attr.name}</h2>
                                                    <form onSubmit={handleSubmit((data) => handleAddValue(attr._id, data))}>
                                                        <input
                                                            {...register("value", { required: true })}
                                                            className="w-full p-2 border rounded mb-4"
                                                            placeholder="Nhập giá trị mới"
                                                        />
                                                        <div className="flex justify-between">
                                                            <button type="button" onClick={() => setOpenModalId(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                                                Đóng
                                                            </button>
                                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                                {editingValueId ? "Lưu" : "Thêm"}
                                                            </button>
                                                        </div>
                                                    </form>

                                                    <div className="mt-4">
                                                        <h3 className="font-semibold mb-2">Danh sách giá trị:</h3>
                                                        <ul className="space-y-2 max-h-48 overflow-auto">
                                                            {attributeValues.map((val) => (
                                                                <li key={val._id} className="flex justify-between items-center border px-2 py-1 rounded">
                                                                    <span>{val.value}</span>
                                                                    <div className="space-x-2">
                                                                        <button
                                                                            className="text-sm text-yellow-600 hover:underline"
                                                                            onClick={() => startEditValue(val)}
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                        <button
                                                                            className="text-sm text-red-600 hover:underline"
                                                                            onClick={() => handleDeleteValue(val._id, attr._id)}
                                                                        >
                                                                            Xoá
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AttributeList;
