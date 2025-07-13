import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của <a>
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <aside
        id="layout-menu"
        className={`layout-menu menu-vertical menu bg-menu-theme ${
          isCollapsed ? "layout-menu-collapsed" : ""
        }`}
      >
        <div className="app-brand demo">
          <a href="/" className="app-brand-link"> {/* Thay index.html bằng "/" cho React Router */}
            <span className="app-brand-logo demo">
              <span className="text-primary">
                <svg
                  width={25}
                  viewBox="0 0 25 42"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <path
                      d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                      id="path-1"
                    />
                    <path
                      d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                      id="path-3"
                    />
                    <path
                      d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                      id="path-4"
                    />
                    <path
                      d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                      id="path-5"
                    />
                  </defs>
                  <g
                    id="g-app-brand"
                    stroke="none"
                    strokeWidth={1}
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                      <g id="Icon" transform="translate(27.000000, 15.000000)">
                        <g id="Mask" transform="translate(0.000000, 8.000000)">
                          <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1" />
                          </mask>
                          <use fill="currentColor" xlinkHref="#path-1" />
                          <g id="Path-3" mask="url(#mask-2)">
                            <use fill="currentColor" xlinkHref="#path-3" />
                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3" />
                          </g>
                          <g id="Path-4" mask="url(#mask-2)">
                            <use fill="currentColor" xlinkHref="#path-4" />
                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4" />
                          </g>
                        </g>
                        <g
                          id="Triangle"
                          transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                        >
                          <use fill="currentColor" xlinkHref="#path-5" />
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </span>
            <span className="app-brand-text demo menu-text fw-bold ms-2">Sneat</span>
          </a>
          <a
            href="javascript:void(0);"
            className="layout-menu-toggle menu-link text-large ms-auto"
            onClick={toggleSidebar}
          >
            <i
              className={`bx ${
                isCollapsed ? "bx-chevron-right" : "bx-chevron-left"
              } d-block d-xl-none align-middle`}
            />
          </a>
        </div>
        <div className="menu-divider mt-0" />
        <div className="menu-inner-shadow" />
        <ul className="menu-inner py-1">
          {/* Dashboards */}
          <li
            className={`menu-item ${openMenu === "dashboards" ? "active open" : ""}`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("dashboards", e)}
            >
              <i className="menu-icon tf-icons bx bx-home-smile" />
              <div className="text-truncate" data-i18n="Dashboards">
                Dashboards
              </div>
            </a>
            <ul className={`menu-sub ${openMenu === "dashboards" ? "show" : ""}`}>
              <li className="menu-item active">
                <Link to="/" className="menu-link">
                  <div className="text-truncate" data-i18n="Analytics">
                    Analytics
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/dashboards-crm.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="CRM">
                    CRM
                  </div>
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-ecommerce-dashboard.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="eCommerce">
                    eCommerce
                  </div>
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-logistics-dashboard.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Logistics">
                    Logistics
                  </div>
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-academy-dashboard.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Academy">
                    Academy
                  </div>
                </a>
              </li>
            </ul>
          </li>
          {/* Product */}
          <li
            className={`menu-item ${openMenu === "front-pages" ? "active open" : ""}`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("front-pages", e)}
            >
              <i className="menu-icon tf-icons bx bx-store" />
              <div className="text-truncate" data-i18n="Front Pages">
                Product
              </div>
              <span className="badge rounded-pill bg-danger ms-auto">2</span>
            </a>
            <ul className={`menu-sub ${openMenu === "front-pages" ? "show" : ""}`}>
              <li className="menu-item">
                <Link to="/admin/product" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Product List
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/product/add" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Add Product
                  </div>
                </Link>
              </li>
            </ul>
          </li>
          {/* Category */}
          <li
            className={`menu-item ${openMenu === "category" ? "active open" : ""}`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("category", e)}
            >
              <i className="menu-icon tf-icons bx bx-store" />
              <div className="text-truncate" data-i18n="Front Pages">
                Category
              </div>
              <span className="badge rounded-pill bg-danger ms-auto">2</span>
            </a>
            <ul className={`menu-sub ${openMenu === "category" ? "show" : ""}`}>
              <li className="menu-item">
                <Link to="/admin/category" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Category List
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/category/add" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Add Category
                  </div>
                </Link>
              </li>
            </ul>
          </li>
          {/* Attribute */}
          <li
            className={`menu-item ${openMenu === "attribute" ? "active open" : ""}`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("attribute", e)}
            >
              <i className="menu-icon tf-icons bx bx-store" />
              <div className="text-truncate" data-i18n="Front Pages">
                Attribute
              </div>
              <span className="badge rounded-pill bg-danger ms-auto">2</span>
            </a>
            <ul className={`menu-sub ${openMenu === "attribute" ? "show" : ""}`}>
              <li className="menu-item">
                <Link to="/admin/attribute" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Attribute List
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/attribute/add" className="menu-link">
                  <div className="text-truncate" data-i18n="Landing">
                    Add Attribute
                  </div>
                </Link>
              </li>
            </ul>
          </li>
          {/* Apps & Pages */}
          <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Apps & Pages</span>
          </li>
          <li className="menu-item">
            <a
              href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-email.html"
              target="_blank"
              className="menu-link"
            >
              <i className="menu-icon tf-icons bx bx-envelope" />
              <div className="text-truncate" data-i18n="Email">
                Email
              </div>
            </a>
          </li>
          <li className="menu-item">
            <a
              href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-chat.html"
              target="_blank"
              className="menu-link"
            >
              <i className="menu-icon tf-icons bx bx-chat" />
              <div className="text-truncate" data-i18n="Chat">
                Chat
              </div>
            </a>
          </li>
          <li className="menu-item">
            <a
              href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-calendar.html"
              target="_blank"
              className="menu-link"
            >
              <i className="menu-icon tf-icons bx bx-calendar" />
              <div className="text-truncate" data-i18n="Calendar">
                Calendar
              </div>
            </a>
          </li>
          <li className="menu-item">
            <a
              href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-kanban.html"
              target="_blank"
              className="menu-link"
            >
              <i className="menu-icon tf-icons bx bx-grid" />
              <div className="text-truncate" data-i18n="Kanban">
                Kanban
              </div>
            </a>
          </li>
          {/* Pages */}
          <li
            className={`menu-item ${
              openMenu === "account-settings" ? "active open" : ""
            }`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("account-settings", e)}
            >
              <i className="menu-icon tf-icons bx bx-dock-top" />
              <div className="text-truncate" data-i18n="Account Settings">
                Account Settings
              </div>
            </a>
            <ul
              className={`menu-sub ${openMenu === "account-settings" ? "show" : ""}`}
            >
              <li className="menu-item">
                <Link to="/account-settings/account" className="menu-link">
                  <div className="text-truncate" data-i18n="Account">
                    Account
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link
                  to="/account-settings/notifications"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Notifications">
                    Notifications
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link
                  to="/account-settings/connections"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Connections">
                    Connections
                  </div>
                </Link>
              </li>
            </ul>
          </li>
          <li
            className={`menu-item ${
              openMenu === "authentications" ? "active open" : ""
            }`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("authentications", e)}
            >
              <i className="menu-icon tf-icons bx bx-lock-open-alt" />
              <div className="text-truncate" data-i18n="Authentications">
                Authentications
              </div>
            </a>
            <ul
              className={`menu-sub ${
                openMenu === "authentications" ? "show" : ""
              }`}
            >
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/auth-login-basic.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Basic">
                    Login
                  </div>
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/auth-register-basic.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Basic">
                    Register
                  </div>
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/auth-forgot-password-basic.html"
                  target="_blank"
                  className="menu-link"
                >
                  <div className="text-truncate" data-i18n="Basic">
                    Forgot Password
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <li
            className={`menu-item ${openMenu === "misc" ? "active open" : ""}`}
          >
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={(e) => toggleMenu("misc", e)}
            >
              <i className="menu-icon tf-icons bx bx-cube-alt" />
              <div className="text-truncate" data-i18n="Misc">
                Misc
              </div>
            </a>
            <ul className={`menu-sub ${openMenu === "misc" ? "show" : ""}`}>
              <li className="menu-item">
                <Link to="/misc-error" className="menu-link">
                  <div className="text-truncate" data-i18n="Error">
                    Error
                  </div>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/misc-under-maintenance" className="menu-link">
                  <div
                    className="text-truncate"
                    data-i18n="Under Maintenance"
                  >
                    Under Maintenance
                  </div>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;