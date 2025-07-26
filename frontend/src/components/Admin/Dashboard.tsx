import React from "react";
import {
  LineChart,
  
  ResponsiveContainer,
  CartesianGrid,

} from "recharts";

const revenueData = [
  { month: "Tháng 1", revenue: 5000000 },
  { month: "Tháng 2", revenue: 7200000 },
  { month: "Tháng 3", revenue: 6100000 },
  { month: "Tháng 4", revenue: 8900000 },
  { month: "Tháng 5", revenue: 7600000 },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">Tổng đơn</h2>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">120</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">Doanh thu</h2>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">35.200.000₫</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">Khách hàng</h2>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">340</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">Sản phẩm tồn</h2>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">89</p>
        </div>
      </div>

      {/* Biểu đồ đường doanh thu */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Doanh thu theo tháng (VNĐ)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
      
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
