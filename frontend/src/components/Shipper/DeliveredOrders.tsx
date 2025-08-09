import ShipperOrders from './ShipperOrders';

const DeliveredOrders = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đơn hàng đã giao</h1>
        <p className="text-gray-600">Lịch sử các đơn hàng đã giao thành công</p>
      </div>
      
      <ShipperOrders status="delivered" />
    </div>
  );
};

export default DeliveredOrders;

