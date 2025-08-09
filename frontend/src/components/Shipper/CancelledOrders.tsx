import ShipperOrders from './ShipperOrders';

const CancelledOrders = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đơn hàng đã hủy</h1>
        <p className="text-gray-600">Danh sách các đơn hàng bạn đã hủy giao</p>
      </div>
      
      <ShipperOrders status="cancelled" />
    </div>
  );
};

export default CancelledOrders;
