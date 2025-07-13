const FormAdd = () => {
  return (
    <div className="app-ecommerce">
      {/* Add Product */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4">
        <div className="d-flex flex-column justify-content-center">
          <h4 className="mb-1">Add a new Product</h4>
          <p className="mb-0">Orders placed across your store</p>
        </div>
        <div className="d-flex align-content-center flex-wrap gap-4">
          <div className="d-flex gap-4"><button className="btn btn-label-secondary">Discard</button> <button className="btn btn-label-primary">Save draft</button></div>
          <button type="submit" className="btn btn-primary">Publish product</button>
        </div>
      </div>
      <div className="row">
        {/* First column*/}
        <div className="col-12 col-lg-8">
          {/* Product Information */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-tile mb-0">Product information</h5>
            </div>
            <div className="card-body">
              <div className="mb-6">
                <label className="form-label" htmlFor="ecommerce-product-name">Name</label>
                <input type="text" className="form-control" id="ecommerce-product-name" placeholder="Product title" name="productTitle" aria-label="Product title" />
              </div>
              <div className="row mb-6">
                <div className="col"><label className="form-label" htmlFor="ecommerce-product-sku">SKU</label> <input type="number" className="form-control" id="ecommerce-product-sku" placeholder="SKU" name="productSku" aria-label="Product SKU" /></div>
                <div className="col"><label className="form-label" htmlFor="ecommerce-product-barcode">Barcode</label> <input type="text" className="form-control" id="ecommerce-product-barcode" placeholder="0123-4567" name="productBarcode" aria-label="Product barcode" /></div>
              </div>
              {/* Description */}
              <div>
                <label className="mb-1">Description (Optional)</label>
                <div className="form-control p-0">
                  <div className="comment-toolbar border-0 border-bottom ql-toolbar ql-snow">
                    <div className="d-flex justify-content-start">
                      <span className="ql-formats me-0">
                        <button className="ql-bold" type="button"><svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z" /><path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z" /></svg></button>
                        <button className="ql-italic" type="button"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1={7} x2={13} y1={4} y2={4} /><line className="ql-stroke" x1={5} x2={11} y1={14} y2={14} /><line className="ql-stroke" x1={8} x2={10} y1={14} y2={4} /></svg></button>
                        <button className="ql-underline" type="button"><svg viewBox="0 0 18 18"><path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3" /><rect className="ql-fill" height={1} rx="0.5" ry="0.5" width={12} x={3} y={15} /></svg></button>
                        <button className="ql-list" value="ordered" type="button"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1={7} x2={15} y1={4} y2={4} /><line className="ql-stroke" x1={7} x2={15} y1={9} y2={9} /><line className="ql-stroke" x1={7} x2={15} y1={14} y2={14} /><line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5" /><path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z" /><path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156" /><path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109" /></svg></button>
                        <button className="ql-list" value="bullet" type="button"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1={6} x2={15} y1={4} y2={4} /><line className="ql-stroke" x1={6} x2={15} y1={9} y2={9} /><line className="ql-stroke" x1={6} x2={15} y1={14} y2={14} /><line className="ql-stroke" x1={3} x2={3} y1={4} y2={4} /><line className="ql-stroke" x1={3} x2={3} y1={9} y2={9} /><line className="ql-stroke" x1={3} x2={3} y1={14} y2={14} /></svg></button>
                        <button className="ql-link" type="button"><svg viewBox="0 0 18 18"><line className="ql-stroke" x1={7} x2={11} y1={7} y2={11} /><path className="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z" /><path className="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z" /></svg></button>
                        <button className="ql-image" type="button"><svg viewBox="0 0 18 18"><rect className="ql-stroke" height={10} width={12} x={3} y={4} /><circle className="ql-fill" cx={6} cy={7} r={1} /><polyline className="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12" /></svg></button>
                      </span>
                    </div>
                  </div>
                  <div className="comment-editor border-0 pb-6 ql-container ql-snow" id="ecommerce-category-description"><div className="ql-editor ql-blank" contentEditable="true" data-placeholder="Product Description"><p><br /></p></div><div className="ql-tooltip ql-hidden"><a className="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank" /><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL" /><a className="ql-action" /><a className="ql-remove" /></div></div>
                </div>
              </div>
            </div>
          </div>
          {/* /Product Information */}
          {/* Media */}
          <div className="card mb-6">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 card-title">Product Image</h5>
              <a href="javascript:void(0);" className="fw-medium">Add media from URL</a>
            </div>
            <div className="card-body">
              <form action="/upload" className="dropzone needsclick p-0 dz-clickable" id="dropzone-basic">
                <div className="dz-message needsclick">
                  <p className="h4 needsclick pt-4 mb-2">Drag and drop your image here</p>
                  <p className="h6 text-body-secondary d-block fw-normal mb-3">or</p>
                  <span className="needsclick btn btn-sm btn-label-primary" id="btnBrowse">Browse image</span>
                </div>
              </form>
            </div>
          </div>
          {/* /Media */}
          {/* Variants */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Variants</h5>
            </div>
            <div className="card-body">
              <form className="form-repeater">
                <div data-repeater-list="group-a">
                  <div data-repeater-item>
                    <div className="row g-6 mb-6">
                      <div className="col-4">
                        <label className="form-label" htmlFor="form-repeater-1-1">Options</label>
                        <div className="position-relative"><select id="form-repeater-1-1" className="select2 form-select select2-hidden-accessible" data-placeholder="Size" data-select2-id="form-repeater-1-1" tabIndex={-1} aria-hidden="true">
                          <option value="" data-select2-id={2}>Size</option>
                          <option value="size">Size</option>
                          <option value="color">Color</option>
                          <option value="weight">Weight</option>
                          <option value="smell">Smell</option>
                        </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={1} style={{ width: '233.725px' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-form-repeater-1-1-container"><span className="select2-selection__rendered" id="select2-form-repeater-1-1-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">Size</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
                      </div>
                      <div className="col-8">
                        <label className="form-label invisible" htmlFor="form-repeater-1-2">Not visible</label>
                        <input type="number" id="form-repeater-1-2" className="form-control" placeholder="Enter size" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn btn-primary" data-repeater-create>
                    <i className="icon-base bx bx-plus icon-sm me-2" />
                    Add another option
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* /Variants */}
          {/* Inventory */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Inventory</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Navigation */}
                <div className="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                  <div className="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                    <div className="nav-align-left">
                      <ul className="nav nav-pills flex-column w-100" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#restock" aria-selected="true" role="tab">
                            <i className="icon-base bx bx-cube icon-18px me-1_5" />
                            <span className="align-middle">Restock</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#shipping" aria-selected="false" tabIndex={-1} role="tab">
                            <i className="icon-base bx bx-car icon-18px me-1_5" />
                            <span className="align-middle">Shipping</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#global-delivery" aria-selected="false" tabIndex={-1} role="tab">
                            <i className="icon-base bx bx-globe icon-18px me-1_5" />
                            <span className="align-middle">Global Delivery</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#attributes" aria-selected="false" tabIndex={-1} role="tab">
                            <i className="icon-base bx bx-link icon-18px me-1_5" />
                            <span className="align-middle">Attributes</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#advanced" aria-selected="false" tabIndex={-1} role="tab">
                            <i className="icon-base bx bx-lock icon-18px me-1_5" />
                            <span className="align-middle">Advanced</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Navigation */}
                {/* Options */}
                <div className="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                  <div className="tab-content p-0 ps-md-4">
                    {/* Restock Tab */}
                    <div className="tab-pane fade show active" id="restock" role="tabpanel">
                      <h6 className="text-body">Options</h6>
                      <label className="form-label" htmlFor="ecommerce-product-stock">Add to Stock</label>
                      <div className="row mb-4 g-4 pe-md-4">
                        <div className="col-12 col-sm-9">
                          <input type="number" className="form-control" id="ecommerce-product-stock" placeholder="Quantity" name="quantity" aria-label="Quantity" />
                        </div>
                        <div className="col-12 col-sm-3">
                          <button className="btn btn-primary">Confirm</button>
                        </div>
                      </div>
                      <div>
                        <h6 className="mb-2 fw-normal">Product in stock now: <span className="text-body">54</span></h6>
                        <h6 className="mb-2 fw-normal">Product in transit: <span className="text-body">390</span></h6>
                        <h6 className="mb-2 fw-normal">Last time restocked: <span className="text-body">24th June, 2023</span></h6>
                        <h6 className="mb-0 fw-normal">Total stock over lifetime: <span className="text-body">2430</span></h6>
                      </div>
                    </div>
                    {/* Shipping Tab */}
                    <div className="tab-pane fade" id="shipping" role="tabpanel">
                      <h6 className="mb-3 text-body">Shipping Type</h6>
                      <div>
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="radio" name="shippingType" id="seller" />
                          <label className="form-check-label" htmlFor="seller">
                            <span className="mb-1 h6">Fulfilled by Seller</span><br />
                            <small>You'll be responsible for product delivery.<br />
                              Any damage or delay during shipping may cost you a Damage fee.</small>
                          </label>
                        </div>
                        <div className="form-check mb-6">
                          <input className="form-check-input" type="radio" name="shippingType" id="companyName" defaultChecked />
                          <label className="form-check-label" htmlFor="companyName">
                            <span className="mb-1 h6">Fulfilled by Company name &nbsp;<span className="badge rounded-2 badge-warning bg-label-warning fs-tiny py-1">RECOMMENDED</span></span><br />
                            <small>Your product, Our responsibility.<br />
                              For a measly fee, we will handle the delivery process for you.</small>
                          </label>
                        </div>
                        <p className="mb-0">See our <a href="javascript:void(0);">Delivery terms and conditions</a> for details</p>
                      </div>
                    </div>
                    {/* Global Delivery Tab */}
                    <div className="tab-pane fade" id="global-delivery" role="tabpanel">
                      <h6 className="mb-3 text-body">Global Delivery</h6>
                      {/* Worldwide delivery */}
                      <div className="form-check mb-4">
                        <input className="form-check-input" type="radio" name="globalDel" id="worldwide" />
                        <label className="form-check-label" htmlFor="worldwide">
                          <span className="mb-1 h6">Worldwide delivery</span><br />
                          <small>Only available with Shipping method: <a href="javascript:void(0);">Fulfilled by Company name</a></small>
                        </label>
                      </div>
                      {/* Global delivery */}
                      <div className="form-check mb-4">
                        <input className="form-check-input" type="radio" name="globalDel" defaultChecked />
                        <label className="form-check-label w-75 pe-12" htmlFor="country-selected">
                          <span className="mb-2 h6">Selected Countries</span>
                          <input type="text" className="form-control" placeholder="Type Country name" id="country-selected" />
                        </label>
                      </div>
                      {/* Local delivery */}
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="globalDel" id="local" />
                        <label className="form-check-label" htmlFor="local">
                          <span className="mb-1 h6">Local delivery</span><br />
                          <small>Deliver to your country of residence : <a href="javascript:void(0);">Change profile address</a></small>
                        </label>
                      </div>
                    </div>
                    {/* Attributes Tab */}
                    <div className="tab-pane fade" id="attributes" role="tabpanel">
                      <h6 className="mb-2 text-body">Attributes</h6>
                      <div>
                        {/* Fragile Product */}
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="checkbox" defaultValue="fragile" id="fragile" />
                          <label className="form-check-label" htmlFor="fragile">
                            <span className="fw-medium">Fragile Product</span>
                          </label>
                        </div>
                        {/* Biodegradable */}
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="checkbox" defaultValue="biodegradable" id="biodegradable" />
                          <label className="form-check-label" htmlFor="biodegradable">
                            <span className="fw-medium">Biodegradable</span>
                          </label>
                        </div>
                        {/* Frozen Product */}
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="checkbox" defaultValue="frozen" defaultChecked />
                          <label className="form-check-label w-75 pe-12" htmlFor="frozen">
                            <span className="mb-1 h6">Frozen Product</span>
                            <input type="number" className="form-control" placeholder="Max. allowed Temperature" id="frozen" />
                          </label>
                        </div>
                        {/* Exp Date */}
                        <div className="form-check mb-6">
                          <input className="form-check-input" type="checkbox" defaultValue="expDate" id="expDate" defaultChecked />
                          <label className="form-check-label w-75 pe-12" htmlFor="date-input">
                            <span className="mb-1 h6">Expiry Date of Product</span>
                            <input type="text" className="product-date form-control flatpickr-input" id="date-input" />
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* /Attributes Tab */}
                    {/* Advanced Tab */}
                    <div className="tab-pane fade" id="advanced" role="tabpanel">
                      <h6 className="mb-3 text-body">Advanced</h6>
                      <div className="row">
                        {/* Product Id Type */}
                        <div className="col">
                          <label className="form-label" htmlFor="product-id">
                            <span className="mb-1 h6">Product ID Type</span>
                          </label>
                          <div className="position-relative"><select id="product-id" className="select2 form-select select2-hidden-accessible" data-placeholder="ISBN" data-select2-id="product-id" tabIndex={-1} aria-hidden="true">
                            <option value="" data-select2-id={4}>ISBN</option>
                            <option value="ISBN">ISBN</option>
                            <option value="UPC">UPC</option>
                            <option value="EAN">EAN</option>
                            <option value="JAN">JAN</option>
                          </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={3} style={{ width: 'auto' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-product-id-container"><span className="select2-selection__rendered" id="select2-product-id-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">ISBN</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
                        </div>
                        {/* Product Id */}
                        <div className="col">
                          <label className="form-label" htmlFor="product-id-1">
                            <span className="mb-1 h6">Product ID</span>
                          </label>
                          <input type="number" id="product-id-1" className="form-control" placeholder="ISBN Number" />
                        </div>
                      </div>
                    </div>
                    {/* /Advanced Tab */}
                  </div>
                </div>
                {/* /Options*/}
              </div>
            </div>
          </div>
          {/* /Inventory */}
        </div>
        {/* /Second column */}
        {/* Second column */}
        <div className="col-12 col-lg-4">
          {/* Pricing Card */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Pricing</h5>
            </div>
            <div className="card-body">
              {/* Base Price */}
              <div className="mb-6">
                <label className="form-label" htmlFor="ecommerce-product-price">Base Price</label>
                <input type="number" className="form-control" id="ecommerce-product-price" placeholder="Price" name="productPrice" aria-label="Product price" />
              </div>
              {/* Discounted Price */}
              <div className="mb-6">
                <label className="form-label" htmlFor="ecommerce-product-discount-price">Discounted Price</label>
                <input type="number" className="form-control" id="ecommerce-product-discount-price" placeholder="Discounted Price" name="productDiscountedPrice" aria-label="Product discounted price" />
              </div>
              {/* Charge tax check box */}
              <div className="form-check ms-2 mt-7 mb-4">
                <input className="form-check-input" type="checkbox" defaultValue="" id="price-charge-tax" defaultChecked />
                <label className="switch-label" htmlFor="price-charge-tax"> Charge tax on this product </label>
              </div>
              {/* Instock switch */}
              <div className="d-flex justify-content-between align-items-center border-top pt-2">
                <span className="mb-0">In stock</span>
                <div className="w-25 d-flex justify-content-end">
                  <div className="form-check form-switch me-n3">
                    <input type="checkbox" className="form-check-input" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Pricing Card */}
          {/* Organize Card */}
          <div className="card mb-6">
            <div className="card-header">
              <h5 className="card-title mb-0">Organize</h5>
            </div>
            <div className="card-body">
              {/* Vendor */}
              <div className="mb-6 col ecommerce-select2-dropdown">
                <label className="form-label mb-1" htmlFor="vendor"> Vendor </label>
                <div className="position-relative"><select id="vendor" className="select2 form-select select2-hidden-accessible" data-placeholder="Select Vendor" data-select2-id="vendor" tabIndex={-1} aria-hidden="true">
                  <option value="" data-select2-id={6}>Select Vendor</option>
                  <option value="men-clothing">Men's Clothing</option>
                  <option value="women-clothing">Women's-clothing</option>
                  <option value="kid-clothing">Kid's-clothing</option>
                </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={5} style={{ width: '337.587px' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-vendor-container"><span className="select2-selection__rendered" id="select2-vendor-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">Select Vendor</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
              </div>
              {/* Category */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-6 col ecommerce-select2-dropdown">
                  <label className="form-label mb-1" htmlFor="category-org">
                    <span>Category</span>
                  </label>
                  <div className="position-relative"><select id="category-org" className="select2 form-select select2-hidden-accessible" data-placeholder="Select Category" data-select2-id="category-org" tabIndex={-1} aria-hidden="true">
                    <option value="" data-select2-id={6}>Select Vendor</option>
                    <option value="" data-select2-id={8}>Select Category</option>
                    <option value="Household">Household</option>
                    <option value="Management">Management</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Office">Office</option>
                    <option value="Automotive">Automotive</option>
                  </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={7} style={{ width: '283.587px' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-category-org-container"><span className="select2-selection__rendered" id="select2-category-org-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">Select Category</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
                </div>
                <a href="javascript:void(0);" className="fw-medium btn btn-icon btn-label-primary ms-4"><i className="icon-base bx bx-plus icon-md" /></a>
              </div>
              {/* Collection */}
              <div className="mb-6 col ecommerce-select2-dropdown">
                <label className="form-label mb-1" htmlFor="collection">Collection </label>
                <div className="position-relative"><select id="collection" className="select2 form-select select2-hidden-accessible" data-placeholder="Collection" data-select2-id="collection" tabIndex={-1} aria-hidden="true">
                  <option value="" data-select2-id={10}>Collection</option>
                  <option value="men-clothing">Men's Clothing</option>
                  <option value="women-clothing">Women's-clothing</option>
                  <option value="kid-clothing">Kid's-clothing</option>
                </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={9} style={{ width: '337.587px' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-collection-container"><span className="select2-selection__rendered" id="select2-collection-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">Collection</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
              </div>
              {/* Status */}
              <div className="mb-6 col ecommerce-select2-dropdown">
                <label className="form-label mb-1" htmlFor="status-org">Status </label>
                <div className="position-relative"><select id="status-org" className="select2 form-select select2-hidden-accessible" data-placeholder="Published" data-select2-id="status-org" tabIndex={-1} aria-hidden="true">
                  <option value="" data-select2-id={12}>Published</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Inactive">Inactive</option>
                </select><span className="select2 select2-container select2-container--default" dir="ltr" data-select2-id={11} style={{ width: '337.587px' }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex={0} aria-disabled="false" aria-labelledby="select2-status-org-container"><span className="select2-selection__rendered" id="select2-status-org-container" role="textbox" aria-readonly="true"><span className="select2-selection__placeholder">Published</span></span><span className="select2-selection__arrow" role="presentation"><b role="presentation" /></span></span></span><span className="dropdown-wrapper" aria-hidden="true" /></span></div>
              </div>
              {/* Tags */}
              {/* <div>
            <label htmlFor="ecommerce-product-tags" className="form-label mb-1">Tags</label>
            <tags className="tagify  form-control" tabIndex={-1}>
              <tag title="Normal" contentEditable="false" tabIndex={-1} className="tagify__tag tagify--noAnim" value="Normal"><x title tabIndex={-1} className="tagify__tag__removeBtn" role="button" aria-label="remove tag" /><div><span autoCapitalize="false" autoCorrect="off" spellCheck="false" className="tagify__tag-text">Normal</span></div></tag><tag title="Standard" contentEditable="false" tabIndex={-1} className="tagify__tag tagify--noAnim" value="Standard"><x title tabIndex={-1} className="tagify__tag__removeBtn" role="button" aria-label="remove tag" /><div><span autoCapitalize="false" autoCorrect="off" spellCheck="false" className="tagify__tag-text">Standard</span></div></tag><tag title="Premium" contentEditable="false" tabIndex={-1} className="tagify__tag tagify--noAnim" value="Premium"><x title tabIndex={-1} className="tagify__tag__removeBtn" role="button" aria-label="remove tag" /><div><span autoCapitalize="false" autoCorrect="off" spellCheck="false" className="tagify__tag-text">Premium</span></div></tag><span contentEditable tabIndex={0} data-placeholder="​" aria-placeholder className="tagify__input" role="textbox" autoCapitalize="false" autoCorrect="off" aria-autocomplete="both" aria-multiline="false" />
              ​
            </tags><input id="ecommerce-product-tags" className="form-control" name="ecommerce-product-tags" defaultValue="Normal,Standard,Premium" aria-label="Product Tags" tabIndex={-1} />
          </div> */}
            </div>
          </div>
          {/* /Organize Card */}
        </div>
        {/* /Second column */}
      </div>
    </div>

  )
}
export default FormAdd
