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
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4 border-b">
        <h5 className="text-lg font-semibold text-gray-800">Bộ lọc</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <select
              id="AttributeStatus"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div>
            <select
              id="AttributeType"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Loại</option>
              <option value="text">Văn bản</option>
              <option value="number">Số</option>
              <option value="select">Lựa chọn</option>
            </select>
          </div>
          <div>
            <select
              id="AttributeValueCount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Số lượng giá trị</option>
              <option value="0">0</option>
              <option value="1-5">1-5</option>
              <option value="6+">6+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="dt-search-0"
              placeholder="Tìm kiếm thuộc tính"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => navigate("/admin/attribute/add")}
          >
            <i className="bx bx-plus text-lg" />
            <span className="hidden sm:inline">Thêm thuộc tính</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="border-t bg-gray-50">
              <tr>
                <th className="p-3">Tên thuộc tính</th>
                <th className="p-3">Loại</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{attr.name}</td>
                  <td className="p-3">{attr.type}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button  
                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/attribute/edit/${attr._id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(attr._id);
                        }}
                      >
                        <MdDelete />
                      </button>             
                    </div>

                    {openModalId === attr._id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg w-full max-w-lg">
                          <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold text-gray-800">
                              Giá trị cho thuộc tính: <span className="text-blue-600">{attr.name}</span>
                            </h5>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                setOpenModalId(null);
                                setEditingValueId(null);
                                reset();
                              }}
                            >
                              <i className="bx bx-x text-xl" />
                            </button>
                          </div>
                          <div className="p-4">
                            <form
                              onSubmit={handleSubmit((data) => handleAddOrUpdateValue(attr._id, data))}
                              className="mb-4"
                            >
                              <div className="mb-4">
                                <input
                                  {...register("value", { required: true })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Nhập giá trị mới"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                  onClick={() => {
                                    setOpenModalId(null);
                                    setEditingValueId(null);
                                    reset();
                                  }}
                                >
                                  Đóng
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  {editingValueId ? "Cập nhật" : "Thêm"}
                                </button>
                              </div>
                            </form>

                            <h6 className="text-base font-medium mb-2">Danh sách giá trị:</h6>
                            <div className="space-y-2">
                              {attributeValues.map((val) => (
                                <div
                                  key={val._id}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                                >
                                  <span>{val.value}</span>
                                  <div className="flex gap-2">
                                    <button
                                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                                      onClick={() => startEditValue(val)}
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                      onClick={() => handleDeleteValue(val._id, attr._id)}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {attributeValues.length === 0 && (
                                <p className="text-gray-500 italic">Không có giá trị nào</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {attributes.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500 italic">
                    Không có thuộc tính nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttributeList;