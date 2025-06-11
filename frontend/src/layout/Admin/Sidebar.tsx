import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow h-screen sticky top-0">
      <div className="p-6 text-xl font-bold border-b">Quản trị</div>
      <nav className="p-4 space-y-3">
        <Link to="/admin" className="block text-gray-700 hover:text-blue-500">🏠 Dashboard</Link>
        <Link to="/admin/category" className="block text-gray-700 hover:text-blue-500">📂 Danh mục</Link>
        <Link to="/admin/category/add" className="block text-gray-700 hover:text-blue-500">➕ Thêm danh mục</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
