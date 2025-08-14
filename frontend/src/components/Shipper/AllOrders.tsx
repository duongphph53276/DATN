import ShipperOrders from './ShipperOrders';

const AllOrders = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tất cả đơn hàng của tôi</h1>
        <p className="text-gray-600">Quản lý tất cả đơn hàng được giao cho bạn</p>
      </div>
      
      <ShipperOrders />
    </div>
  );
};

export default AllOrders;