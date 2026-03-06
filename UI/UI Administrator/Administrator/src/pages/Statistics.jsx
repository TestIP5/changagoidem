import React, { useState, useEffect } from "react";
import { Navbar } from "../components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    ordersByStatus: {},
    productsByCategory: {},
    revenueByMonth: [],
    topProducts: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productResponse = await fetch("http://localhost:5219/api-admin/LaySanPham");
        const productData = await productResponse.json();
        const products = productData.data ? productData.data.filter(p => p.stt === 1) : [];

        // Fetch categories
        const categoryResponse = await fetch("http://localhost:5219/api-admin4/LayDanhMuc");
        const categoryData = await categoryResponse.json();
        const categories = categoryData.data ? categoryData.data.filter(c => c.stt === 1) : [];

        // Fetch orders
        const orderResponse = await fetch("http://localhost:5219/api-admin3/LayDonHang");
        const orderData = await orderResponse.json();
        const orders = orderData.data ? orderData.data.filter(o => o.stt >= 1) : [];

        // Fetch users
        const userResponse = await fetch("http://localhost:5219/api-admin1/LayNguoiDung");
        const userData = await userResponse.json();
        const users = userData.data ? userData.data.filter(u => u.stt >= 1) : [];

        // Calculate statistics
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalUsers = users.length;

        // Calculate revenue
        let totalRevenue = 0;
        const revenueByMonth = [];
        const ordersByStatus = {};
        const productsByCategory = {};

        // Initialize products by category
        categories.forEach(cat => {
          productsByCategory[cat.tenDanhMuc] = 0;
        });

        // Count products by category
        products.forEach(product => {
          const category = categories.find(cat => cat.maDanhMuc === product.maDanhMuc);
          if (category) {
            productsByCategory[category.tenDanhMuc]++;
          }
        });

        // Process orders
        orders.forEach(order => {
          // Count orders by status
          ordersByStatus[order.trangThai] = (ordersByStatus[order.trangThai] || 0) + 1;

          // Calculate revenue from order details
          if (order.maDonHang) {
            // We'll need to fetch order details to calculate revenue
            // For now, assume we have a way to get total from order
            // Since the API might not provide total directly, we'll fetch details
          }

          // Revenue by month
          const orderDate = new Date(order.ngayDat);
          const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          // We'll calculate revenue per month later
        });

        // Filter orders for revenue calculation (only "Đã giao")
        const deliveredOrders = orders.filter(order => order.trangThai === "Đã giao");

        // Fetch order details for revenue calculation (only for delivered orders)
        const revenuePromises = deliveredOrders.map(async (order) => {
          try {
            const detailResponse = await fetch(`http://localhost:5219/api-admin5/LayCTHoaDonTheoMa?id=${order.maDonHang}`);
            const detailData = await detailResponse.json();
            if (detailData.gioHang) {
              let orderTotal = 0;
              const items = [];
              for (const item of detailData.gioHang) {
                const productResponse = await fetch(`http://localhost:5219/api-admin/LaySanPhamTheoMa?id=${item.maSanPham}`);
                const productData = await productResponse.json();
                if (productData.data) {
                  const itemTotal = item.soLuong * productData.data.gia;
                  orderTotal += itemTotal;
                  items.push({ ...item, product: productData.data, itemTotal });
                }
              }
              return { order, total: orderTotal, items };
            }
          } catch (error) {
            console.error(`Error fetching details for order ${order.maDonHang}:`, error);
          }
          return { order, total: 0, items: [] };
        });

        const orderTotals = await Promise.all(revenuePromises);
        const topProductsMap = {};

        orderTotals.forEach(({ order, total, items }) => {
          totalRevenue += total;

          const orderDate = new Date(order.ngayDat);
          const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          const existingMonth = revenueByMonth.find(m => m.month === monthKey);
          if (existingMonth) {
            existingMonth.revenue += total;
          } else {
            revenueByMonth.push({ month: monthKey, revenue: total });
          }

          // Aggregate top products
          items.forEach(item => {
            const productId = item.maSanPham;
            if (!topProductsMap[productId]) {
              topProductsMap[productId] = {
                product: item.product,
                totalQuantity: 0,
                totalRevenue: 0,
              };
            }
            topProductsMap[productId].totalQuantity += item.soLuong;
            topProductsMap[productId].totalRevenue += item.itemTotal;
          });
        });

        // Convert topProductsMap to array and sort by totalRevenue desc
        const topProducts = Object.values(topProductsMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

        // Sort revenue by month
        revenueByMonth.sort((a, b) => a.month.localeCompare(b.month));

        setStats({
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          ordersByStatus,
          productsByCategory,
          revenueByMonth,
          topProducts,
          orders,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const orderStatusChartData = {
    labels: Object.keys(stats.ordersByStatus),
    datasets: [
      {
        data: Object.values(stats.ordersByStatus),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const productCategoryChartData = {
    labels: Object.keys(stats.productsByCategory),
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: Object.values(stats.productsByCategory),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: stats.revenueByMonth.map(item => item.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: stats.revenueByMonth.map(item => item.revenue),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex" style={{ minHeight: "100vh" }}>
          <div className="flex-fill d-flex justify-content-center align-items-center" style={{ padding: "20px" }}>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const filteredOrders = stats.orders.filter(order => {
    const orderDate = new Date(order.ngayDat);
    const year = orderDate.getFullYear();
    const month = orderDate.getMonth() + 1;
    if (selectedYear && year !== parseInt(selectedYear)) return false;
    if (selectedMonth && month !== parseInt(selectedMonth)) return false;
    if (filterToday) {
      const today = new Date();
      if (year !== today.getFullYear() || month !== today.getMonth() + 1) return false;
    }
    return true;
  });

  const filteredTotalOrders = filteredOrders.length;

  const filteredRevenueByMonth = stats.revenueByMonth.filter(item => {
    const [year, month] = item.month.split('-').map(Number);
    if (selectedYear && year !== parseInt(selectedYear)) return false;
    if (selectedMonth && month !== parseInt(selectedMonth)) return false;
    if (filterToday) {
      const today = new Date();
      if (year !== today.getFullYear() || month !== today.getMonth() + 1) return false;
    }
    return true;
  });

  const filteredTotalRevenue = filteredRevenueByMonth.reduce((sum, item) => sum + item.revenue, 0);

  const filteredRevenueChartData = {
    labels: filteredRevenueByMonth.map(item => item.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: filteredRevenueByMonth.map(item => item.revenue),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const topProductsChartData = {
    labels: stats.topProducts.slice(0, 10).map(tp => tp.product.tenSanPham),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: stats.topProducts.slice(0, 10).map(tp => tp.totalRevenue),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <div className="flex-fill d-flex justify-content-center" style={{ padding: "20px" }}>
          <div className="w-100" style={{ maxWidth: "1200px" }}>
            <h2 className="mb-4">Thống kê</h2>

            {/* Filter Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Bộ lọc doanh thu</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Tất cả năm</option>
                      {Array.from(new Set(stats.revenueByMonth.map(item => item.month.split('-')[0]))).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Tất cả tháng</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="filterToday"
                        checked={filterToday}
                        onChange={(e) => setFilterToday(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="filterToday">
                        Chỉ tháng hiện tại
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setSelectedYear("");
                        setSelectedMonth("");
                        setFilterToday(false);
                      }}
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-white bg-primary mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Tổng sản phẩm</h5>
                    <h3>{stats.totalProducts}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-success mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Tổng đơn hàng</h5>
                    <h3>{filteredTotalOrders}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-info mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Tổng người dùng</h5>
                    <h3>{stats.totalUsers}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Tổng doanh thu</h5>
                    <h3>{filteredTotalRevenue.toLocaleString()} đ</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Đơn hàng theo trạng thái</h5>
                  </div>
                  <div className="card-body">
                    <Doughnut data={orderStatusChartData} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Sản phẩm theo danh mục</h5>
                  </div>
                  <div className="card-body">
                    <Bar data={productCategoryChartData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Doanh thu theo tháng</h5>
                  </div>
                  <div className="card-body">
                    <Line data={filteredRevenueChartData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Top 10 sản phẩm bán chạy nhất</h5>
                  </div>
                  <div className="card-body">
                    <Bar data={topProductsChartData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
