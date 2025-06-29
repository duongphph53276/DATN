import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow h-screen sticky top-0">
      <div className="p-6 text-xl font-bold border-b">Quản trị</div>
      <nav className="p-4 space-y-3">
        <Link to="/admin" className="block text-gray-700 hover:text-blue-500">🏠 Dashboard</Link>
        <Link to="/admin/category" className="block text-gray-700 hover:text-blue-500">📂 Danh mục</Link>
        <Link to="/admin/category/add" className="block text-gray-700 hover:text-blue-500">➕ Thêm danh mục</Link>
        <Link to="/admin/product" className="block text-gray-700 hover:text-blue-500"> Danh sách sản phẩm</Link>
        <Link to="/admin/attribute" className="block text-gray-700 hover:text-blue-500">Danh sách thuộc tính</Link>
        <Link to="/admin/users" className="block text-gray-700 hover:text-blue-500">👤 Quản lý User</Link>
        <Link to="/admin/roles" className="block text-gray-700 hover:text-blue-500">👤 Quản lý Role</Link>
        <Link to="/admin/roles/create" className="block text-gray-700 hover:text-blue-500">➕ Thêm Role</Link>
        <Link to="/admin/voucher" className="block text-gray-700 hover:text-blue-500">📂 mã giảm giá</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;