import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Navbar } from "../components";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    let componentMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5219/api-admin3/LayDonHang");
        const json = await response.json();

        if (componentMounted && json.data) {
          const fetchedOrders = json.data.filter((order) => order.stt >= 1);
          // Sắp xếp đơn hàng từ mới nhất đến cũ nhất theo ngày đặt
          fetchedOrders.sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat));
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders); // Ban đầu hiển thị tất cả
        }
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        if (componentMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (filterStatus !== "Tất cả") {
      filtered = filtered.filter((order) => order.trangThai === filterStatus);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order.taiKhoan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((order) =>
        new Date(order.ngayDat).getFullYear() === parseInt(selectedYear)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((order) =>
        new Date(order.ngayDat).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedDay) {
      filtered = filtered.filter((order) =>
        new Date(order.ngayDat).getDate() === parseInt(selectedDay)
      );
    }

    if (filterToday) {
      const today = new Date();
      const todayFormatted = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/'); // Ensure MM/DD/YYYY format
      
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.ngayDat);
        const orderFormatted = orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '/');
        return orderFormatted === todayFormatted;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, filterStatus, searchQuery, selectedYear, selectedMonth, selectedDay, filterToday]);

  const fetchOrderDetails = async (maDonHang) => {
    if (orderDetails[maDonHang]) {
      setSelectedOrder(maDonHang);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5219/api-admin5/LayCTHoaDonTheoMa?id=${maDonHang}`);
      const json = await response.json();

      if (json.gioHang) {
        const detailsWithProducts = await Promise.all(
          json.gioHang.map(async (item) => {
            const productResponse = await fetch(`http://localhost:5219/api-admin/LaySanPhamTheoMa?id=${item.maSanPham}`);
            const productJson = await productResponse.json();
            return { ...item, product: productJson.data };
          })
        );

        setOrderDetails((prev) => ({ ...prev, [maDonHang]: detailsWithProducts }));
        setSelectedOrder(maDonHang);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    }
  };

  const openStatusModal = (maDonHang, currentStatus) => {
    setCurrentOrderId(maDonHang);
    setSelectedStatus(currentStatus);
    setShowModal(true);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStatus("");
    setCurrentOrderId(null);
  };

  const updateOrderStatus = async () => {
    if (!currentOrderId || !selectedStatus) return;

    try {
      const response = await fetch(`http://localhost:5219/api-admin3/SuaDonHang?id=${currentOrderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maDonHang: currentOrderId,
          trangThai: selectedStatus,
        }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.maDonHang === currentOrderId ? { ...order, trangThai: selectedStatus } : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order.maDonHang === currentOrderId ? { ...order, trangThai: selectedStatus } : order
          )
        );
        alert("Cập nhật trạng thái thành công!");
        closeModal();
      } else {
        alert("Lỗi khi cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái!");
    }
  };

  const filterOrdersByStatus = (status) => {
    setFilterStatus(status);
  };

  const toggleTodayFilter = () => {
    setFilterToday(!filterToday);
  };

  const statusOptions = [
    "Tất cả",
    "Chờ xác nhận",
    "Chờ lấy hàng",
    "Chờ giao hàng",
    "Đã giao",
    "Đã hủy",
  ];

  const Loading = () => (
    <div className="row">
      {[...Array(6)].map((_, i) => (
        <div className="col-12 mb-3" key={i}>
          <Skeleton height={100} />
        </div>
      ))}
    </div>
  );

  const ShowOrders = () => (
    <>
      <div className="row">
        {filteredOrders.map((order) => (
          <div key={order.maDonHang} className="col-12 mb-3">
            <div
              className="card p-3"
              onClick={() => fetchOrderDetails(order.maDonHang)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted fw-bold">Khách hàng: {order.taiKhoan}</p>
                  <p className="mb-1 text-muted">Họ tên: {order.hoTen}</p>
                  <p className="mb-1 text-muted">Địa chỉ: {order.diaChi}</p>
                  <p className="mb-1 text-muted">Ngày đặt: {new Date(order.ngayDat).toLocaleString()}</p>
                  <p className="mb-1 text-muted">Số điện thoại: {order.soDienThoai}</p>
                </div>
                <div className="text-end" onClick={(e) => e.stopPropagation()}>
                  <span
                    className={`badge ${
                      order.trangThai === "Đã giao" ? "bg-success" :
                      order.trangThai === "Chờ giao hàng" ? "bg-primary" :
                      order.trangThai === "Chờ lấy hàng" ? "bg-info" :
                      order.trangThai === "Chờ xác nhận" ? "bg-secondary" :
                      order.trangThai === "Đã hủy" ? "bg-danger" : "bg-warning"
                    }`}
                    style={{ cursor: order.trangThai !== "Đã hủy" ? "pointer" : "default" }}
                    onClick={order.trangThai !== "Đã hủy" ? () => openStatusModal(order.maDonHang, order.trangThai) : undefined}
                  >
                    {order.trangThai}
                  </span>
                </div>
              </div>
              {selectedOrder === order.maDonHang && orderDetails[order.maDonHang] && (
                <div className="mt-3">
                  <hr />
                  <h6>Chi tiết đơn hàng</h6>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="fw-bold">Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails[order.maDonHang].map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={"/assets/"+item.product?.anh}
                                alt={item.product?.tenSanPham}
                                style={{
                                  width: "50px",
                                  height: "auto",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                              {item.product?.tenSanPham}
                            </div>
                          </td>
                          <td>{item.soLuong}</td>
                          <td>{item.product?.gia.toLocaleString()} đ</td>
                          <td>{(item.soLuong * item.product?.gia).toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Status Selection */}
      {showModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Chọn trạng thái đơn hàng</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="choXacNhan"
                      value="Chờ xác nhận"
                      checked={selectedStatus === "Chờ xác nhận"}
                      onChange={() => handleStatusChange("Chờ xác nhận")}
                    />
                    <label className="form-check-label" htmlFor="choXacNhan">
                      Chờ xác nhận
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="choLayHang"
                      value="Chờ lấy hàng"
                      checked={selectedStatus === "Chờ lấy hàng"}
                      onChange={() => handleStatusChange("Chờ lấy hàng")}
                    />
                    <label className="form-check-label" htmlFor="choLayHang">
                      Chờ lấy hàng
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="choGiaoHang"
                      value="Chờ giao hàng"
                      checked={selectedStatus === "Chờ giao hàng"}
                      onChange={() => handleStatusChange("Chờ giao hàng")}
                    />
                    <label className="form-check-label" htmlFor="choGiaoHang">
                      Chờ giao hàng
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="daGiao"
                      value="Đã giao"
                      checked={selectedStatus === "Đã giao"}
                      onChange={() => handleStatusChange("Đã giao")}
                    />
                    <label className="form-check-label" htmlFor="daGiao">
                      Đã giao
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Đóng
                  </button>
                  <button type="button" className="btn btn-primary" onClick={updateOrderStatus}>
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <div className="flex-fill d-flex justify-content-center" style={{ padding: "20px" }}>
          <div className="w-100" style={{ maxWidth: "1200px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Quản lý đơn hàng</h3>
              <div className="text-muted">
                Tổng số: {filteredOrders.length} đơn hàng
              </div>
            </div>
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Bộ lọc</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.398a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                        </svg>
                      </span>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Tìm kiếm theo tài khoản..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Năm</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Tháng</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                    >
                      <option value="">Ngày</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-1">
                    <button
                      className={`btn w-100 ${filterToday ? "btn-warning" : "btn-outline-warning"}`}
                      onClick={toggleTodayFilter}
                      title="Lọc đơn hàng hôm nay"
                    >
                      <i className="fa fa-calendar-day"></i>
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedYear("");
                        setSelectedMonth("");
                        setSelectedDay("");
                        setFilterStatus("Tất cả");
                        setFilterToday(false);
                      }}
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
                {filterToday && (
                  <div className="row mt-2">
                    <div className="col-12">
                      <div className="alert alert-warning py-2">
                        <i className="fa fa-info-circle me-2"></i>
                        Đang lọc đơn hàng của ngày hôm nay
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách đơn hàng</h5>
                <div className="btn-group" role="group">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${filterStatus === status ? "btn-dark" : "btn-outline-dark"}`}
                      onClick={() => filterOrdersByStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body p-0">
                {loading ? <Loading /> : <ShowOrders />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
