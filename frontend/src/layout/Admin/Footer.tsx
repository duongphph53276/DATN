const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>© {new Date().getFullYear()} Admin Panel</span>
          <span>•</span>
          <span>Duong</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-green-500">●</span>
          <span>System Online</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer