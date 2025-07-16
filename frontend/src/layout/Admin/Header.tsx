const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">Xin chào, Admin</span>
        <img
          src="https://picsum.photos/200"
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  )
}

export default Header