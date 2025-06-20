const Footer = () => {
  return (
    <footer className="footer">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
        <div className="flex items-center justify-start space-x-3">
          <div>
            © 2021, JustBoil.me
          </div>
          <div>
            <p>Distributed By: <a href="https://themewagon.com/" target="_blank">ThemeWagon</a></p>
          </div>
          <a href="https://github.com/justboil/admin-one-tailwind" style={{ height: 20 }}>
            <img src="https://img.shields.io/github/v/release/justboil/admin-one-tailwind?color=%23999" />
          </a>
        </div>
      </div>
    </footer>

  )
}

export default Footer
