import ShipperOrders from './ShipperOrders';

const ShippingOrders = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đơn hàng đang giao</h1>
        <p className="text-gray-600">Quản lý các đơn hàng đang trong quá trình giao hàng</p>
      </div>
      
      <ShipperOrders status="shipping" />
    </div>
  );
};

export default ShippingOrders;

