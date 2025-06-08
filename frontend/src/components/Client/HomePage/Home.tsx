const Home = () => {
    const featuredProducts = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      name: `Sản phẩm ${i + 1}`,
      price: `${(i + 1) * 1000000} VND`,
      image: `https://picsum.photos/200?random=${i + 1}`,
    }));
  
    const otherProducts = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Sản phẩm ${i + 5}`,
      price: `${(i + 5) * 1000000} VND`,
      image: `https://picsum.photos/200?random=${i + 5}`,
    }));
  
    const blindBox = Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      name: `Blind Box ${i + 1}`,
      price: `${(i + 1) * 2000000} VND`,
      image: `https://picsum.photos/200?random=bl${i + 1}`,
    }));
  
    const newPlush = Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      name: `Thú nhồi bông mới ${i + 1}`,
      price: `${(i + 1) * 1500000} VND`,
      image: `https://picsum.photos/200?random=np${i + 1}`,
    }));
  
    return (
      <div className="space-y-12">
        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(prod => (
              <div key={prod.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2 rounded" />
                <h3 className="font-medium">{prod.name}</h3>
                <p className="text-blue-600 font-bold">{prod.price}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Other Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Các sản phẩm khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map(prod => (
              <div key={prod.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2 rounded" />
                <h3 className="font-medium">{prod.name}</h3>
                <p className="text-blue-600 font-bold">{prod.price}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Blind Box & New Plush Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Blind Box</h2>
            <div className="grid grid-cols-2 gap-6">
              {blindBox.map(item => (
                <div key={item.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded" />
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-blue-600 font-bold">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Thú nhồi bông mới</h2>
            <div className="grid grid-cols-2 gap-6">
              {newPlush.map(item => (
                <div key={item.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded" />
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-blue-600 font-bold">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Contact Form */}
        <section>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Liên lạc, góp ý với chúng tôi tại đây</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Tên người dùng</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tên của bạn"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Tiêu đề</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tiêu đề"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Nội dung</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={5}
                placeholder="Nội dung..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition font-semibold"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </section>
      </div>
    );
  };
  
  export default Home;
  