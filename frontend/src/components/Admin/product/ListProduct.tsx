import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, getProductById } from "../../../../api/product.api";
import { getVariantsByProduct } from "../../../../api/variant.api";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../../api/category.api";

const ListProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getAllProducts();
        console.log("Product data:", productRes.data); // Debug dữ liệu từ API
        const productsData = productRes.data.data || [];

        // Lấy danh sách biến thể cho từng sản phẩm
        const productsWithVariants = await Promise.all(
          productsData.map(async (product) => {
            const variantRes = await getVariantsByProduct(product._id);
            return { ...product, variants: variantRes.data.data || [] };
          })
        );

        setProducts(productsWithVariants);

        const categoryRes = await getCategories();
        console.log("Category data:", categoryRes.data); // Debug dữ liệu từ API
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        alert("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc API.");
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Không xác định";
  };

  const getPriceDisplay = (variants: any[]) => {
    if (variants.length === 0) return "N/A";
    if (variants.length === 1) return `${variants[0].price.toLocaleString()}đ`;
    const minPrice = Math.min(...variants.map((v) => v.price));
    const maxPrice = Math.max(...variants.map((v) => v.price));
    return `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      alert("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const openModal = async (productId: string) => {
    try {
      const res = await getProductById(productId);
      console.log("Product detail:", res.data); // Debug dữ liệu chi tiết
      setSelectedProduct(res.data.data.product);
      setOpenModalId(productId);
    } catch (error) {
      console.error("Lỗi khi mở modal sản phẩm:", error);
      alert("Không thể tải thông tin sản phẩm");
    }
  };

  const closeModal = () => {
    setOpenModalId(null);
    setSelectedProduct(null);
  };

  return (
    <div className="card">
      <div className="card-header border-bottom">
        <h5 className="card-title">Filter</h5>
        <div className="d-flex justify-content-between align-items-center row pt-4 gap-6 gap-md-0 g-md-6">
          <div className="col-md-4 product_status">
            <select id="ProductStatus" className="form-select text-capitalize">
              <option value="">Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Publish">Publish</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-4 product_category">
            <select id="ProductCategory" className="form-select text-capitalize">
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 product_stock">
            <select id="ProductStock" className="form-select text-capitalize">
              <option value="">Stock</option>
              <option value="Out_of_Stock">Out_of_Stock</option>
              <option value="In_Stock">In_Stock</option>
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
                  placeholder="Search Product"
                  aria-controls="DataTables_Table_0"
                />
                <label htmlFor="dt-search-0" />
              </div>
            </div>
            <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex flex-wrap gap-2 mb-md-0 mb-4 mt-0">
              <div className="dt-buttons btn-group flex-wrap">
                <div className="btn-group">
                  <button
                    className="btn buttons-collection btn-label-secondary dropdown-toggle me-4"
                    tabIndex={0}
                    aria-controls="DataTables_Table_0"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                  >
                    <span>
                      <span className="d-flex align-items-center gap-2">
                        <i className="icon-base bx bx-export icon-xs" /> <span className="d-none d-sm-inline-block">Export</span>
                      </span>
                    </span>
                  </button>
                </div>
                <button
                  className="btn add-new btn-primary"
                  tabIndex={0}
                  aria-controls="DataTables_Table_0"
                  type="button"
                  onClick={() => navigate("/admin/product/add")}
                >
                  <span>
                    <i className="icon-base bx bx-plus me-0 me-sm-1 icon-xs" />
                    <span className="d-none d-sm-inline-block">Add Product</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="justify-content-between dt-layout-table">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
              <table className="datatables-products table dataTable dtr-column collapsed" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" style={{ width: "100%" }}>
                <thead className="border-top">
                  <tr>
                    <th className="control dt-orderable-none" style={{}}><span className="dt-column-title" /><span className="dt-column-order" /></th>
                    <th className="dt-select dt-orderable-none"><span className="dt-column-title" /><span className="dt-column-order" /></th>
                    <th className="dt-orderable-none" aria-label="Ảnh" style={{}}><span className="dt-column-title">Image</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-asc dt-orderable-desc dt-ordering-asc" aria-sort="ascending" aria-label="Tên: Activate to invert sorting" tabIndex={0} style={{}}><span className="dt-column-title" role="button">Name</span></th>
                    <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" aria-label="Price: Activate to sort" tabIndex={0}><span className="dt-column-title" role="button">Price</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" aria-label="SKU: Activate to sort" tabIndex={0}><span className="dt-column-title" role="button">SKU</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-asc dt-orderable-desc" aria-label="Danh mục: Activate to sort" tabIndex={0}><span className="dt-column-title" role="button">Category</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" aria-label="Đã bán: Activate to sort" tabIndex={0}><span className="dt-column-title" role="button">Đã bán</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-asc dt-orderable-desc" aria-label="Trạng thái: Activate to sort" tabIndex={0}><span className="dt-column-title" role="button">Status</span><span className="dt-column-order" /></th>
                    <th className="dt-orderable-none" aria-label="Hành động"><span className="dt-column-title">Actions</span><span className="dt-column-order" /></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="control" tabIndex={0} />
                        <td className="dt-select"><button
                          className="btn btn-icon btn-primary "
                          onClick={() => openModal(product._id)}
                        >
                          <i className="bx bx-plus" />
                        </button></td>
                        <td>
                          {product.images ? (
                            <img src={product.images} alt={product.name} className="w-16 h-16 object-cover rounded border" />
                          ) : (
                            <span className="text-gray-400 italic">Không có ảnh</span>
                          )}
                        </td>
                        <td className="sorting_1">
                          <div className="d-flex justify-content-start align-items-center product-name">
                            <div className="d-flex flex-column">
                              <h6 className="text-nowrap mb-0">{product.name}</h6>
                              <small className="text-truncate d-none d-sm-block">{/* Description if available */}</small>
                            </div>
                          </div>
                        </td>
                        <td>{getPriceDisplay(product.variants)}</td>
                        <td>{product.sku || "N/A"}</td>
                        <td>{getCategoryName(product.category_id)}</td>
                        <td>{product.sold_quantity || 0}</td>
                        <td>
                          {product.status === "active" && <span className="badge bg-label-success text-capitalize">Đang bán</span>}
                          {product.status === "disabled" && <span className="badge bg-label-secondary text-capitalize">Tạm tắt</span>}
                          {product.status === "new" && <span className="badge bg-label-primary text-capitalize">Mới</span>}
                          {product.status === "bestseller" && <span className="badge bg-label-warning text-capitalize">Bán chạy</span>}
                        </td>
                        <td>
                          <div className="d-inline-block text-nowrap">
                            <button
                              className="btn btn-icon"
                              onClick={() => navigate(`/admin/product/${product._id}`)}
                            >
                              👁️
                            </button>
                            <button
                              className="btn btn-icon"
                              onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-icon"
                              onClick={() => handleDelete(product._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-gray-500 italic">
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot />
              </table>
            </div>
          </div>
          <div className="row mx-3 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
              <div className="dt-info" aria-live="polite" id="DataTables_Table_0_info" role="status">
                Showing 1 to {Math.min(10, products.length)} of {products.length} entries
              </div>
            </div>
            <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex flex-wrap gap-2 mb-md-0 mb-4 mt-0">
              <div className="dt-paging">
                <nav aria-label="pagination">
                  <ul className="pagination">
                    <li className="dt-paging-button page-item disabled">
                      <button
                        className="page-link previous"
                        role="link"
                        type="button"
                        aria-controls="DataTables_Table_0"
                        aria-disabled="true"
                        aria-label="Previous"
                        data-dt-idx="previous"
                        tabIndex={-1}
                      >
                        <i className="icon-base bx bx-chevron-left scaleX-n1-rtl icon-18px" />
                      </button>
                    </li>
                    <li className="dt-paging-button page-item active">
                      <button
                        className="page-link"
                        role="link"
                        type="button"
                        aria-controls="DataTables_Table_0"
                        aria-current="page"
                        data-dt-idx={0}
                      >
                        1
                      </button>
                    </li>
                    <li className="dt-paging-button page-item">
                      <button
                        className="page-link"
                        role="link"
                        type="button"
                        aria-controls="DataTables_Table_0"
                        data-dt-idx={1}
                      >
                        2
                      </button>
                    </li>
                    <li className="dt-paging-button page-item">
                      <button
                        className="page-link next"
                        role="link"
                        type="button"
                        aria-controls="DataTables_Table_0"
                        aria-label="Next"
                        data-dt-idx="next"
                      >
                        <i className="icon-base bx bx-chevron-right scaleX-n1-rtl icon-18px" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chi tiết sản phẩm (từ nút +) */}
      {openModalId && selectedProduct && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Details of <span className="text-primary">{selectedProduct.name}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr data-dt-row="12" data-dt-column="2">
                        <td>product:</td>
                        <td>
                          <div className="d-flex justify-content-start align-items-center product-name">
                            <div className="avatar-wrapper">
                              <div className="avatar avatar me-2 me-sm-4 rounded-2 bg-label-secondary">
                                {selectedProduct.images ? (
                                  <img
                                    src={selectedProduct.images}
                                    alt={selectedProduct.name}
                                    className="rounded"
                                  />
                                ) : (
                                  <span className="text-gray-400 italic">No Image</span>
                                )}
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <h6 className="text-nowrap mb-0">{selectedProduct.name}</h6>
                              <small className="text-truncate d-none d-sm-block">
                                {selectedProduct.description || "No description"}
                              </small>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="3">
                        <td>category:</td>
                        <td>
                          <span className="text-truncate d-flex align-items-center text-heading">
                            <span className="w-px-30 h-px-30 rounded-circle d-flex justify-content-center align-items-center bg-label-danger me-4">
                              <i className="icon-base bx bx-headphone icon-18px"></i>
                            </span>
                            {getCategoryName(selectedProduct.category_id)}
                          </span>
                        </td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="4">
                        <td>stock:</td>
                        <td>
                          <span className="text-truncate">
                            <label className="switch switch-primary switch-sm">
                              <input
                                type="checkbox"
                                className="switch-input"
                                id="switch"
                                checked={selectedProduct.stock === "In_Stock"}
                                disabled
                              />
                              <span className="switch-toggle-slider">
                                <span className="switch-off"></span>
                              </span>
                            </label>
                            <span className="d-none">
                              {selectedProduct.stock || "Out_of_Stock"}
                            </span>
                          </span>
                        </td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="5">
                        <td>sku:</td>
                        <td><span>{selectedProduct.sku || "N/A"}</span></td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="6">
                        <td>price:</td>
                        <td><span>{getPriceDisplay(selectedProduct.variants || [])}</span></td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="7">
                        <td>qty:</td>
                        <td><span>{selectedProduct.quantity || "0"}</span></td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="8">
                        <td>status:</td>
                        <td>
                          <span
                            className={`badge ${selectedProduct.status === "active"
                              ? "bg-label-success"
                              : selectedProduct.status === "disabled"
                                ? "bg-label-secondary"
                                : selectedProduct.status === "new"
                                  ? "bg-label-primary"
                                  : "bg-label-warning"
                              } text-capitalize`}
                          >
                            {selectedProduct.status || "Scheduled"}
                          </span>
                        </td>
                      </tr>
                      <tr data-dt-row="12" data-dt-column="9">
                        <td>Actions:</td>
                        <td>
                          <div className="d-inline-block text-nowrap">
                            <button
                              className="btn btn-icon"
                              onClick={() => navigate(`/admin/product/edit/${selectedProduct._id}`)}
                            >
                              <i className="icon-base bx bx-edit icon-md"></i>
                            </button>
                            <button
                              className="btn btn-icon dropdown-toggle hide-arrow"
                              data-bs-toggle="dropdown"
                            >
                              <i className="icon-base bx bx-dots-vertical-rounded icon-md"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end m-0">
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                                onClick={() => navigate(`/admin/product/${selectedProduct._id}`)}
                              >
                                View
                              </a>
                              <a href="javascript:void(0);" className="dropdown-item">
                                Suspend
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;