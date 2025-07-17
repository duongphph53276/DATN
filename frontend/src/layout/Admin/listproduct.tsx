const Test = () => {
    return <>
        <div className="card">
            <div className="card-header border-bottom">
                <h5 className="card-title">Filter</h5>
                <div className="d-flex justify-content-between align-items-center row pt-4 gap-6 gap-md-0 g-md-6">
                    <div className="col-md-4 product_status"><select id="ProductStatus" className="form-select text-capitalize">
                        <option value="">Status</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Publish">Publish</option>
                        <option value="Inactive">Inactive</option>
                    </select></div>
                    <div className="col-md-4 product_category"><select id="ProductCategory" className="form-select text-capitalize">
                        <option value="">Category</option>
                        <option value="Household">Household</option>
                        <option value="Office">Office</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Game">Game</option>
                    </select></div>
                    <div className="col-md-4 product_stock"><select id="ProductStock" className="form-select text-capitalize">
                        <option value="">Stock</option>
                        <option value="Out_of_Stock">Out_of_Stock</option>
                        <option value="In_Stock">In_Stock</option>
                    </select></div>
                </div>
            </div>
            <div className="card-datatable">
                <div id="DataTables_Table_0_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                    <div className="row m-3 my-0 justify-content-between">
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-3">
                            <div className="dt-search mb-0 mb-md-6"><input type="search" className="form-control ms-0" id="dt-search-0" placeholder="Search Product" aria-controls="DataTables_Table_0" /><label htmlFor="dt-search-0" /></div>
                        </div>
                        <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex flex-wrap gap-2 mb-md-0 mb-4 mt-0">
                            <div className="dt-length mb-md-6 mb-4"><select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select" id="dt-length-0">
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select><label htmlFor="dt-length-0" /></div>
                            <div className="dt-buttons btn-group flex-wrap">
                                <div className="btn-group"><button className="btn buttons-collection btn-label-secondary dropdown-toggle me-4" tabIndex={0} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false"><span><span className="d-flex align-items-center gap-2"><i className="icon-base bx bx-export icon-xs" /> <span className="d-none d-sm-inline-block">Export</span></span></span></button></div>
                                <button className="btn add-new btn-primary" tabIndex={0} aria-controls="DataTables_Table_0" type="button"><span><i className="icon-base bx bx-plus me-0 me-sm-1 icon-xs" /><span className="d-none d-sm-inline-block">Add Product</span></span></button>
                            </div>
                        </div>
                    </div>
                    <div className="justify-content-between dt-layout-table">
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                            <table className="datatables-products table dataTable dtr-column collapsed" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" style={{ width: '100%' }}>
                                <colgroup>
                                    <col data-dt-column={0} style={{ width: '53.4028px' }} />
                                    <col data-dt-column={1} style={{ width: '64.5278px' }} />
                                    <col data-dt-column={2} style={{ width: '280.861px' }} />
                                    <col data-dt-column={4} style={{ width: '94.5417px' }} />
                                </colgroup>
                                <thead className="border-top">
                                    <tr>
                                        <th className="control dt-orderable-none" style={{}}><span className="dt-column-title" /><span className="dt-column-order" /></th>
                                        <th className="dt-select dt-orderable-none"><span className="dt-column-title" /><span className="dt-column-order" /><input className="form-check-input" type="checkbox" aria-label="Select all rows" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc dt-ordering-asc" aria-sort="ascending" aria-label="product: Activate to invert sorting" tabIndex={0} style={{}}><span className="dt-column-title" role="button">product</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc" aria-label="category: Activate to sort" tabIndex={0} ><span className="dt-column-title" role="button">category</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-none" aria-label="stock" style={{}}><span className="dt-column-title">stock</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" tabIndex={0} ><span className="dt-column-title" role="button">sku</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" aria-label="price: Activate to sort" tabIndex={0} ><span className="dt-column-title" role="button">price</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric" aria-label="qty: Activate to sort" tabIndex={0} ><span className="dt-column-title" role="button">qty</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-asc dt-orderable-desc" aria-label="status: Activate to sort" tabIndex={0} ><span className="dt-column-title" role="button">status</span><span className="dt-column-order" /></th>
                                        <th className="dt-orderable-none" aria-label="Actions" ><span className="dt-column-title">Actions</span><span className="dt-column-order" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="control" tabIndex={0} style={{}} />
                                        <td className="dt-select" style={{}}><input aria-label="Select row" className="form-check-input" type="checkbox" /></td>
                                        <td className="sorting_1" style={{}}>
                                            <div className="d-flex justify-content-start align-items-center product-name">
                                                <div className="avatar-wrapper">
                                                    <div className="avatar avatar me-2 me-sm-4 rounded-2 bg-label-secondary"><img src="../../assets/img/ecommerce-images/product-9.png" alt="Product-9" className="rounded" /></div>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <h6 className="text-nowrap mb-0">Air Jordan</h6>
                                                    <small className="text-truncate d-none d-sm-block">Air Jordan is a line of
                                                        basketball shoes produced by Nike</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="dtr-hidden" >
                                            <span className="text-truncate d-flex align-items-center text-heading">
                                                <span className="w-px-30 h-px-30 rounded-circle d-flex justify-content-center align-items-center bg-label-success me-4">
                                                    <i className="icon-base bx bx-walk icon-18px" />
                                                </span>Shoes
                                            </span>
                                        </td>
                                        <td style={{}}>
                                            <span className="text-truncate">
                                                <label className="switch switch-primary switch-sm">
                                                    <input type="checkbox" className="switch-input" id="switch" />
                                                    <span className="switch-toggle-slider">
                                                        <span className="switch-off" />
                                                    </span>
                                                </label>
                                                <span className="d-none">Out_of_Stock</span>
                                            </span>
                                        </td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>31063</span></td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>$125</span></td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>942</span></td>
                                        <td className="dtr-hidden" ><span className="badge bg-label-danger" text-capitalized>Inactive</span></td>
                                        <td className="dtr-hidden" >
                                            <div className="d-inline-block text-nowrap">
                                                <button className="btn btn-icon"><i className="icon-base bx bx-edit icon-md" /></button>
                                                <button className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="icon-base bx bx-dots-vertical-rounded icon-md" />
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end m-0">
                                                    <a href="javascript:void(0);" className="dropdown-item">View</a>
                                                    <a href="javascript:void(0);" className="dropdown-item">Suspend</a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="control" tabIndex={0} style={{}} />
                                        <td className="dt-select" style={{}}><input aria-label="Select row" className="form-check-input" type="checkbox" /></td>
                                        <td className="sorting_1" style={{}}>
                                            <div className="d-flex justify-content-start align-items-center product-name">
                                                <div className="avatar-wrapper">
                                                    <div className="avatar avatar me-2 me-sm-4 rounded-2 bg-label-secondary"><img src="../../assets/img/ecommerce-images/product-4.png" alt="Product-4" className="rounded" /></div>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <h6 className="text-nowrap mb-0">INZCOU Running Shoes</h6>
                                                    <small className="text-truncate d-none d-sm-block">Lightweight Tennis Shoes Non
                                                        Slip Gym Workout Shoes</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="dtr-hidden" >
                                            <span className="text-truncate d-flex align-items-center text-heading">
                                                <span className="w-px-30 h-px-30 rounded-circle d-flex justify-content-center align-items-center bg-label-success me-4">
                                                    <i className="icon-base bx bx-walk icon-18px" />
                                                </span>Shoes
                                            </span>
                                        </td>
                                        <td style={{}}>
                                            <span className="text-truncate">
                                                <label className="switch switch-primary switch-sm">
                                                    <input type="checkbox" className="switch-input" id="switch" />
                                                    <span className="switch-toggle-slider">
                                                        <span className="switch-off" />
                                                    </span>
                                                </label>
                                                <span className="d-none">Out_of_Stock</span>
                                            </span>
                                        </td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>49402</span></td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>$36.98</span></td>
                                        <td className="dt-type-numeric dtr-hidden" ><span>528</span></td>
                                        <td className="dtr-hidden" ><span className="badge bg-label-warning" text-capitalized>Scheduled</span></td>
                                        <td className="dtr-hidden" >
                                            <div className="d-inline-block text-nowrap">
                                                <button className="btn btn-icon"><i className="icon-base bx bx-edit icon-md" /></button>
                                                <button className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="icon-base bx bx-dots-vertical-rounded icon-md" />
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end m-0">
                                                    <a href="javascript:void(0);" className="dropdown-item">View</a>
                                                    <a href="javascript:void(0);" className="dropdown-item">Suspend</a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot />
                            </table>
                        </div>
                    </div>
                    <div className="row mx-3 justify-content-between">
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                            <div className="dt-info" aria-live="polite" id="DataTables_Table_0_info" role="status">Showing 1 to 10
                                of 100 entries</div>
                        </div>
                        <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex flex-wrap gap-2 mb-md-0 mb-4 mt-0">
                            <div className="dt-paging">
                                <nav aria-label="pagination">
                                    <ul className="pagination">
                                        <li className="dt-paging-button page-item disabled"><button className="page-link previous" role="link" type="button" aria-controls="DataTables_Table_0" aria-disabled="true" aria-label="Previous" data-dt-idx="previous" tabIndex={-1}><i className="icon-base bx bx-chevron-left scaleX-n1-rtl icon-18px" /></button>
                                        </li>
                                        <li className="dt-paging-button page-item active"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" aria-current="page" data-dt-idx={0}>1</button></li>
                                        <li className="dt-paging-button page-item"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx={1}>2</button></li>
                                        <li className="dt-paging-button page-item"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx={2}>3</button></li>
                                        <li className="dt-paging-button page-item"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx={3}>4</button></li>
                                        <li className="dt-paging-button page-item"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx={4}>5</button></li>
                                        <li className="dt-paging-button page-item disabled"><button className="page-link ellipsis" role="link" type="button" aria-controls="DataTables_Table_0" aria-disabled="true" data-dt-idx="ellipsis" tabIndex={-1}>…</button></li>
                                        <li className="dt-paging-button page-item"><button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx={9}>10</button>
                                        </li>
                                        <li className="dt-paging-button page-item"><button className="page-link next" role="link" type="button" aria-controls="DataTables_Table_0" aria-label="Next" data-dt-idx="next"><i className="icon-base bx bx-chevron-right scaleX-n1-rtl icon-18px" /></button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}
export default Test