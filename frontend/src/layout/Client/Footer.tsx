const Footer = () => {
    return (
      <footer className="bg-gray-800 text-gray-200 p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Client Portal. All rights reserved.</p>
        </div>
      </footer>
    );
  };

export default Footer;