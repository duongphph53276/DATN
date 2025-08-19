import api from '../../middleware/axios';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
    total_amount: number;
  }>;
  recentOrders: Array<{
    _id: string;
    user_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    user?: {
      name: string;
      email: string;
    };
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// Lấy thống kê đơn hàng
export const getOrderStatistics = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get(`/orders/statistics?${params.toString()}`);
  return response.data;
};

// Lấy thống kê user
export const getUserStatistics = async () => {
  const response = await api.get('/admin/users/statistics');
  return response.data;
};

// Lấy thống kê sản phẩm
export const getProductStatistics = async () => {
  const response = await api.get('/products/statistics');
  return response.data;
};

// Lấy đơn hàng gần đây
export const getRecentOrders = async (limit: number = 5) => {
  const response = await api.get(`/orders?limit=${limit}&sort_by=created_at&sort_order=desc`);
  return response.data;
};

// Lấy doanh thu theo tháng
export const getMonthlyRevenue = async (year?: number) => {
  const currentYear = year || new Date().getFullYear();
  const response = await api.get(`/orders/monthly-revenue?year=${currentYear}`);
  return response.data;
};

// Lấy doanh thu theo ngày trong tháng
export const getDailyRevenue = async (year?: number, month?: number) => {
  const y = year || new Date().getFullYear();
  const m = month || new Date().getMonth() + 1; // 1-12
  const response = await api.get(`/orders/daily-revenue?year=${y}&month=${m}`);
  return response.data;
};

// Lấy doanh thu theo năm trong khoảng
export const getYearlyRevenue = async (startYear?: number, endYear?: number) => {
  const currentYear = new Date().getFullYear();
  const start = startYear || currentYear - 4;
  const end = endYear || currentYear;
  const response = await api.get(`/orders/yearly-revenue?start_year=${start}&end_year=${end}`);
  return response.data;
};

// Lấy phân bố danh mục
export const getCategoryDistribution = async () => {
  const response = await api.get('/categories/distribution');
  return response.data;
};

// Lấy tất cả thống kê dashboard
export const getDashboardData = async (): Promise<DashboardStats> => {
  try {
    const [
      orderStats,
      userStats,
      productStats,
      recentOrders,
      monthlyRevenue,
      categoryDistribution
    ] = await Promise.all([
      getOrderStatistics(),
      getUserStatistics().catch(() => ({ data: { total_users: 0 } })),
      getProductStatistics().catch(() => ({ data: { total_products: 0 } })),
      getRecentOrders(4),
      getMonthlyRevenue().catch(() => ({ data: [] })),
      getCategoryDistribution().catch(() => ({ data: [] }))
    ]);

    // Debug logging
    console.log('Recent Orders Response:', recentOrders);
    console.log('Recent Orders Data:', recentOrders.data);
    console.log('Recent Orders Array:', recentOrders.data?.data?.orders);

    return {
      totalOrders: orderStats.data.overall_stats.total_orders || 0,
      totalRevenue: orderStats.data.overall_stats.total_revenue || 0,
      totalUsers: userStats.data?.total_users || 0,
      totalProducts: productStats.data?.total_products || 0,
      orderStatusBreakdown: orderStats.data.status_breakdown || [],
      recentOrders: recentOrders.data?.data?.orders || [],
      monthlyRevenue: monthlyRevenue.data || [],
      categoryDistribution: categoryDistribution.data || []
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
