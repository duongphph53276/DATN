import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="aside is-placed-left is-expanded">
      <div className="aside-tools">
        <div>
          Admin <b className="font-black">One</b>
        </div>
      </div>
      <div className="menu is-menu-main">
        <p className="menu-label">General</p>
        <ul className="menu-list">
          <li className="--set-active-index-html">
            <Link to="/admin">
              <span className="icon"><i className="mdi mdi-desktop-mac" /></span>
              <span className="menu-item-label">Dashboard</span>
            </Link>
          </li>
        </ul>
        <p className="menu-label">Examples</p>
        <ul className="menu-list">
          <li className="--set-active-tables-html">
            <Link to="/admin/category">
              <span className="icon"><i className="mdi mdi-table" /></span>
              <span className="menu-item-label">Danh mục</span>
            </Link>
          </li>
          <li className="--set-active-forms-html">
            <Link to="/admin/product">
              <span className="icon"><i className="mdi mdi-square-edit-outline" /></span>
              <span className="menu-item-label">Danh sách sản phẩm</span>
            </Link>
          </li>
          <li className="--set-active-forms-html">
            <Link to="/admin/attribute">
              <span className="icon"><i className="mdi mdi-shape" /></span>
              <span className="menu-item-label">Danh sách thuộc tính</span>
            </Link>
          </li>
          <li className="--set-active-profile-html">
            <a href="profile.html">
              <span className="icon"><i className="mdi mdi-account-circle" /></span>
              <span className="menu-item-label">Profile</span>
            </a>
          </li>
          <li>
            <a href="login.html">
              <span className="icon"><i className="mdi mdi-lock" /></span>
              <span className="menu-item-label">Login</span>
            </a>
          </li>
          <li>
            <a className="dropdown">
              <span className="icon"><i className="mdi mdi-view-list" /></span>
              <span className="menu-item-label">Submenus</span>
              <span className="icon"><i className="mdi mdi-plus" /></span>
            </a>
            <ul>
              <li>
                <a href="#void">
                  <span>Sub-item One</span>
                </a>
              </li>
              <li>
                <a href="#void">
                  <span>Sub-item Two</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        {/* <p className="menu-label">About</p>
        <ul className="menu-list">
          <li>
            <a href="https://justboil.me" onclick="alert('Coming soon'); return false" target="_blank" className="has-icon">
              <span className="icon"><i className="mdi mdi-credit-card-outline" /></span>
              <span className="menu-item-label">Premium Demo</span>
            </a>
          </li>
          <li>
            <a href="https://justboil.me/tailwind-admin-templates" className="has-icon">
              <span className="icon"><i className="mdi mdi-help-circle" /></span>
              <span className="menu-item-label">About</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/justboil/admin-one-tailwind" className="has-icon">
              <span className="icon"><i className="mdi mdi-github-circle" /></span>
              <span className="menu-item-label">GitHub</span>
            </a>
          </li>
        </ul> */}
      </div>
    </aside>

  )
}

export default Sidebar
