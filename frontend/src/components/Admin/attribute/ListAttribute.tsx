import { useEffect, useState } from "react";
import {
  getAllAttributes,
  deleteAttribute,
  createAttributevalue,
  getAttributeValues,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../../../api/attribute.api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface AttributeValue {
  _id: string;
  value: string;
}

const AttributeList = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState<any[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<{ value: string }>();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await getAllAttributes();
        setAttributes(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách thuộc tính:", err);
      }
    };
    fetchAttributes();
  }, []);

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
      alert("Xóa thành công");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  const handleAddOrUpdateValue = async (attributeId: string, data: { value: string }) => {
    try {
      if (editingValueId) {
        await updateAttributeValue(editingValueId, data);
        alert("Cập nhật thành công");
      } else {
        await createAttributevalue({ attribute_id: attributeId, value: data.value });
        alert("Thêm thành công");
      }
      await fetchAttributeValues(attributeId);
      reset();
      setEditingValueId(null);
    } catch (err) {
      console.error(err);
      alert("Thao tác thất bại!");
    }
  };

  const handleDeleteValue = async (valueId: string, attributeId: string) => {
    if (!window.confirm("Xóa giá trị này?")) return;
    try {
      await deleteAttributeValue(valueId);
      fetchAttributeValues(attributeId);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách thuộc tính</h1>
        <button
          onClick={() => navigate("/admin/attribute/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm thuộc tính
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-left text-sm border">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="p-3 border">Tên thuộc tính</th>
              <th className="p-3 border">Loại</th>
              <th className="p-3 border w-44">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr._id} className="hover:bg-gray-50">
                <td className="p-3 border">{attr.name}</td>
                <td className="p-3 border">{attr.type}</td>
                <td className="p-3 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(attr._id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Giá trị
                    </button>
                    <button
                      onClick={() => navigate(`/admin/attribute/edit/${attr._id}`)}
                      className="text-yellow-600 hover:underline text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(attr._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </div>

                  {/* Modal */}
                  {openModalId === attr._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                          Giá trị cho thuộc tính: <span className="text-blue-600">{attr.name}</span>
                        </h2>

                        <form
                          onSubmit={handleSubmit((data) => handleAddOrUpdateValue(attr._id, data))}
                          className="mb-4"
                        >
                          <input
                            {...register("value", { required: true })}
                            className="w-full border px-3 py-2 rounded mb-2"
                            placeholder="Nhập giá trị mới"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenModalId(null);
                                setEditingValueId(null);
                                reset();
                              }}
                              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                              Đóng
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {editingValueId ? "Cập nhật" : "Thêm"}
                            </button>
                          </div>
                        </form>

                        <h3 className="font-medium mb-2">Danh sách giá trị:</h3>
                        <ul className="space-y-1 max-h-40 overflow-y-auto border rounded p-2">
                          {attributeValues.map((val) => (
                            <li
                              key={val._id}
                              className="flex justify-between items-center px-2 py-1 border rounded"
                            >
                              <span>{val.value}</span>
                              <div className="space-x-2 text-sm">
                                <button
                                  className="text-yellow-600 hover:underline"
                                  onClick={() => startEditValue(val)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="text-red-600 hover:underline"
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeList;
