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
    <div className="card">
      <div className="card-header border-bottom">
        <h5 className="card-title">Filter</h5>
        <div className="d-flex justify-content-between align-items-center row pt-4 gap-6 gap-md-0 g-md-6">
          <div className="col-md-4 product_status">
            <select id="AttributeStatus" className="form-select text-capitalize">
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-4 product_category">
            <select id="AttributeType" className="form-select text-capitalize">
              <option value="">Type</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
          </div>
          <div className="col-md-4 product_stock">
            <select id="AttributeValueCount" className="form-select text-capitalize">
              <option value="">Value Count</option>
              <option value="0">0</option>
              <option value="1-5">1-5</option>
              <option value="6+">6+</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card-datatable">
        <div id="DataTables_Table_0_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
          <div className="row m-3 my-0 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-3">
              <div className="dt-search mb-0 mb-md-6">
                <input
                  type="search"
                  className="form-control ms-0"
                  id="dt-search-0"
                  placeholder="Search Attribute"
                  aria-controls="DataTables_Table_0"
                />
                <label htmlFor="dt-search-0" />
              </div>
            </div>
            <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex flex-wrap gap-2 mb-md-0 mb-4 mt-0">
              <div className="dt-buttons btn-group flex-wrap">
                <button
                  className="btn add-new btn-primary"
                  onClick={() => navigate("/admin/attribute/add")}
                >
                  <span>
                    <i className="icon-base bx bx-plus me-0 me-sm-1 icon-xs" />
                    <span className="d-none d-sm-inline-block">Add Attribute</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="justify-content-between dt-layout-table">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
              <table className="datatables-products table table-hover table-bordered" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info">
                <thead className="border-top">
                  <tr>
                    <th className="dt-orderable-asc dt-orderable-desc dt-ordering-asc" aria-sort="ascending" aria-label="Tên: Activate to invert sorting" tabIndex={0}>
                      <span className="dt-column-title" role="button">Attribute Name</span>
                    </th>
                    <th className="dt-orderable-asc dt-orderable-desc" aria-label="Loại: Activate to sort" tabIndex={0}>
                      <span className="dt-column-title" role="button">Type</span>
                    </th>
                    <th className="dt-orderable-none" aria-label="Hành động">
                      <span className="dt-column-title">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr) => (
                    <tr key={attr._id} className="align-middle">
                      <td className="sorting_1">{attr.name}</td>
                      <td>{attr.type}</td>
                      <td>
                        <div className="d-inline-block text-nowrap">
                          <button
                            className="btn btn-icon btn-primary"
                            onClick={() => openModal(attr._id)}
                          >
                            <i className="bx bx-list-ul" />
                          </button>
                          <button
                            className="btn btn-icon btn-warning dropdown-toggle hide-arrow ms-2"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bx bx-dots-vertical-rounded" />
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a
                              href="#"
                              className="dropdown-item"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/admin/attribute/edit/${attr._id}`);
                              }}
                            >
                              Sửa
                            </a>
                            <a
                              href="#"
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(attr._id);
                              }}
                            >
                              Xóa
                            </a>
                          </div>
                        </div>

                        {/* Modal */}
                        {openModalId === attr._id && (
                          <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">
                                    Giá trị cho thuộc tính: <span className="text-primary">{attr.name}</span>
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                      setOpenModalId(null);
                                      setEditingValueId(null);
                                      reset();
                                    }}
                                  />
                                </div>
                                <div className="modal-body">
                                  <form
                                    onSubmit={handleSubmit((data) => handleAddOrUpdateValue(attr._id, data))}
                                    className="mb-3"
                                  >
                                    <div className="mb-3">
                                      <input
                                        {...register("value", { required: true })}
                                        className="form-control"
                                        placeholder="Nhập giá trị mới"
                                      />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                          setOpenModalId(null);
                                          setEditingValueId(null);
                                          reset();
                                        }}
                                      >
                                        Đóng
                                      </button>
                                      <button type="submit" className="btn btn-primary">
                                        {editingValueId ? "Cập nhật" : "Thêm"}
                                      </button>
                                    </div>
                                  </form>

                                  <h6 className="mb-2">Danh sách giá trị:</h6>
                                  <div className="list-group">
                                    {attributeValues.map((val) => (
                                      <div
                                        key={val._id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                      >
                                        <span>{val.value}</span>
                                        <div className="btn-group" role="group">
                                          <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => startEditValue(val)}
                                          >
                                            Sửa
                                          </button>
                                          <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteValue(val._id, attr._id)}
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
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
      </div>
      </div>
  );
};

export default AttributeList;