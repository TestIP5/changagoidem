import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Navbar } from "../components";
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ maDonHang: "", diaChi: "", soDienThoai: "", hoTen: "" });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let componentMounted = true;
    const user = JSON.parse(localStorage.getItem("user")) || { id: "" };
    const taiKhoan = user.id;

    if (taiKhoan) {
      setIsLoggedIn(true);
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch("https://localhost:7041/api/DonHangCT/LayDonHang");
          const json = await response.json();

          if (componentMounted && json.data) {
            const fetchedOrders = json.data.filter(
              (order) => order.taiKhoan === taiKhoan
            ).sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat));
            setOrders(fetchedOrders);
            setFilteredOrders(fetchedOrders);
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
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }

    return () => {
      componentMounted = false;
    };
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Giả định API đăng nhập ở đây
      const response = await fetch("http://localhost:5219/api-admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify({ id: userData.email }));
        setIsLoggedIn(true);
        setLoginForm({ email: "", password: "" });
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Đăng nhập thất bại! Vui lòng kiểm tra email hoặc mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập!");
    }
  };

  const fetchOrderDetails = async (maDonHang) => {
    if (orderDetails[maDonHang]) {
      setSelectedOrder(maDonHang);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5219/api-admin5/LayCTHoaDonTheoMa?id=${maDonHang}`
      );
      const json = await response.json();

      if (json.gioHang) {
        const detailsWithProducts = await Promise.all(
          json.gioHang.map(async (item) => {
            const productResponse = await fetch(
              `http://localhost:5219/api-admin/LaySanPhamTheoMa?id=${item.maSanPham}`
            );
            const productJson = await productResponse.json();
            return { ...item, product: productJson.data || {} };
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
    if (currentStatus === "Chờ xác nhận" || currentStatus === "Chờ lấy hàng") {
      setCurrentOrderId(maDonHang);
      setSelectedStatus("Đã hủy");
      setShowModal(true);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const updateOrderStatus = async () => {
    if (!currentOrderId || selectedStatus !== "Đã hủy") return;

    try {
      const response = await fetch(
        `https://localhost:7041/api/DonHangCT/SuaDonHang`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            maDonHang: currentOrderId,
            trangThai: "Đã hủy",
          }),
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.maDonHang === currentOrderId ? { ...order, trangThai: "Đã hủy" } : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order.maDonHang === currentOrderId ? { ...order, trangThai: "Đã hủy" } : order
          )
        );
        toast.success("Hủy đơn thành công!");
        closeModal();
      } else {
        toast.error("Lỗi khi hủy đơn!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Đã xảy ra lỗi khi hủy đơn!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStatus("");
    setCurrentOrderId(null);
  };

  const openEditModal = (order) => {
    setEditForm({
      maDonHang: order.maDonHang,
      diaChi: order.diaChi,
      soDienThoai: order.soDienThoai,
      hoTen: order.hoTen,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({ maDonHang: "", diaChi: "", soDienThoai: "", hoTen: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(editForm.soDienThoai)) {
      toast.error('Số điện thoại không hợp lệ! Phải bắt đầu bằng 0 và có 10 chữ số.');
      return;
    }

    try {
      const response = await fetch("https://localhost:7041/api/DonHangCT/SuaThongTinDonHang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maDonHang: editForm.maDonHang,
          diaChi: editForm.diaChi,
          soDienThoai: editForm.soDienThoai,
          hoTen: editForm.hoTen,
        }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.maDonHang === editForm.maDonHang
              ? { ...order, diaChi: editForm.diaChi, soDienThoai: editForm.soDienThoai, hoTen: editForm.hoTen }
              : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order.maDonHang === editForm.maDonHang
              ? { ...order, diaChi: editForm.diaChi, soDienThoai: editForm.soDienThoai, hoTen: editForm.hoTen }
              : order
          )
        );
        toast.success("Cập nhật đơn hàng thành công!");
        closeEditModal();
      } else {
        toast.error("Lỗi khi cập nhật đơn hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật đơn hàng!");
    }
  };



  const filterOrdersByStatus = (status) => {
    setFilterStatus(status);
    if (status === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.trangThai === status));
    }
    setCurrentPage(1);
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

  const LoginForm = () => (
    <h4 className="text-center mb-4">Vui lòng đăng nhập !!!</h4>
  );

  const ShowOrders = () => {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    return (
      <>
        <div className="buttons text-center py-4">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`btn btn-outline-dark btn-sm m-2 ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => filterOrdersByStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="row">
          {currentOrders.map((order) => (
            <div key={order.maDonHang} className="col-12 mb-3">
              <div
                className="card p-3"
                onClick={() => {
                  fetchOrderDetails(order.maDonHang);
                  setShowOrderModal(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 text-muted fw-bold">Khách hàng: {order.taiKhoan}</p>
                    <p className="mb-1 text-muted">Họ tên: {order.hoTen}</p>
                    <p className="mb-1 text-muted">Địa chỉ: {order.diaChi}</p>
                    <p className="mb-1 text-muted">
                      Ngày đặt: {new Date(order.ngayDat).toLocaleString()}
                    </p>
                    <p className="mb-1 text-muted">Số điện thoại: {order.soDienThoai}</p>
                  </div>
                  <div className="text-end" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`badge ${
                        order.trangThai === "Đã giao"
                          ? "bg-success"
                          : order.trangThai === "Chờ giao hàng"
                          ? "bg-primary"
                          : order.trangThai === "Chờ lấy hàng"
                          ? "bg-info"
                          : order.trangThai === "Chờ xác nhận"
                          ? "bg-secondary"
                          : order.trangThai === "Đã hủy"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                      style={{
                        cursor: (order.trangThai === "Chờ xác nhận" || order.trangThai === "Chờ lấy hàng") ? "pointer" : "default",
                      }}
                      onClick={() => openStatusModal(order.maDonHang, order.trangThai)}
                    >
                      {order.trangThai}
                    </span>
                    {(order.trangThai === "Chờ xác nhận" || order.trangThai === "Chờ lấy hàng") && (
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => openStatusModal(order.maDonHang, order.trangThai)}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" style={{ color: 'black' }} onClick={() => handlePageChange(currentPage - 1)}>
                    Trước
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                    <button className="page-link" style={{ color: 'black' }} onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" style={{ color: 'black' }} onClick={() => handlePageChange(currentPage + 1)}>
                    Tiếp theo
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h3 className="mb-4">Quản lý đơn hàng</h3>
        <div className="row justify-content-center">
          {isLoggedIn ? loading ? Loading() : ShowOrders() : LoginForm()}
        </div>
      </div>

      {showModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hủy đơn hàng</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Bạn chắc chắn sẽ hủy đơn hàng này chứ?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Đóng
                </button>
                <button type="button" className="btn btn-danger" onClick={updateOrderStatus}>
                  Hủy đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && selectedOrder && orderDetails[selectedOrder] && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 1040,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflowY: "auto",
              zIndex: 1050,
              width: "1000px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "30px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Chi tiết đơn hàng
            </h2>

            {/* Order Info Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "#000" }}>
                  <strong style={{ color: "#28a745" }}>Đơn hàng: #{selectedOrder}</strong>
                </p>
                <p style={{ margin: 0, color: "#6c757d" }}>
                  Thời gian đặt hàng: {new Date(orders.find(o => o.maDonHang === selectedOrder)?.ngayDat).toLocaleString()}
                </p>
              </div>
              <div>
                <span
                  className={`badge ${
                    orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Đã giao"
                      ? "bg-success"
                      : orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ giao hàng"
                      ? "bg-primary"
                      : orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng"
                      ? "bg-info"
                      : orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận"
                      ? "bg-secondary"
                      : orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Đã hủy"
                      ? "bg-danger"
                      : "bg-warning"
                  }`}
                  style={{
                    fontSize: "14px",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                  }}
                >
                  {orders.find(o => o.maDonHang === selectedOrder)?.trangThai}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              {/* Left Column */}
              <div style={{ flex: "0 0 70%", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Recipient Info */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "15px", color: "#000", textTransform: "uppercase" }}>
                    NGƯỜI NHẬN
                  </h4>
                  <p style={{ margin: 0, color: "#000" }}>
                    <strong>{orders.find(o => o.maDonHang === selectedOrder)?.hoTen}</strong>
                  </p>
                  <p style={{ margin: 0, color: "#6c757d" }}>
                    {orders.find(o => o.maDonHang === selectedOrder)?.soDienThoai}
                  </p>
                  <p style={{ margin: 0, color: "#6c757d", wordWrap: "break-word" }}>
                    {orders.find(o => o.maDonHang === selectedOrder)?.diaChi}
                  </p>
                </div>

                {/* Product List */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "15px", color: "#000" }}>Danh sách sản phẩm</h4>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#e9ecef" }}>
                          <th style={{ padding: "10px", textAlign: "left", fontWeight: "bold", color: "#000" }}>
                            Tên sản phẩm
                          </th>
                          <th style={{ padding: "10px", textAlign: "center", fontWeight: "bold", color: "#000" }}>
                            Số lượng
                          </th>
                          <th style={{ padding: "10px", textAlign: "center", fontWeight: "bold", color: "#000" }}>
                            Đơn giá
                          </th>
                          <th style={{ padding: "10px", textAlign: "center", fontWeight: "bold", color: "#000" }}>
                            Tổng tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails[selectedOrder].map((item, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "10px" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                  src={"/assets/" + item.product?.anh || "https://via.placeholder.com/50"}
                                  alt={item.product?.tenSanPham || "Sản phẩm không tên"}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    borderRadius: "4px",
                                  }}
                                  onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                                />
                                <span style={{ fontWeight: "bold", color: "#000" }}>
                                  {item.product?.tenSanPham || "Không có tên sản phẩm"}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "10px", textAlign: "center", color: "#000" }}>
                              {item.soLuong || 0}
                            </td>
                            <td style={{ padding: "10px", textAlign: "center", color: "#000" }}>
                              {(item.product?.gia || 0).toLocaleString("vi-VN")} VND
                            </td>
                            <td style={{ padding: "10px", textAlign: "center", color: "#000" }}>
                              {((item.soLuong || 0) * (item.product?.gia || 0)).toLocaleString("vi-VN")} VND
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ flex: "0 0 30%", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Payment Method */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "15px", color: "#000", textTransform: "uppercase" }}>
                    Phương thức thanh toán
                  </h4>
                  <p style={{ margin: 0, color: "#000", textAlign: "center" }}>Nhận hàng thanh toán</p>
                </div>

                {/* Order Summary */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "15px", color: "#000" }}>Tổng kết chi phí</h4>
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#6c757d" }}>Tạm tính</span>
                      <span style={{ color: "#000" }}>
                        {orderDetails[selectedOrder]
                          .reduce((sum, item) => sum + (item.soLuong || 0) * (item.product?.gia || 0), 0)
                          .toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#6c757d" }}>Phí vận chuyển</span>
                      <span style={{ color: "#28a745" }}>Miễn phí</span>
                    </div>
                    <hr style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                      <span style={{ color: "#000", fontWeight: "bold" }}>Thành tiền</span>
                      <span style={{ color: "#000", fontWeight: "bold" }}>
                        {orderDetails[selectedOrder]
                          .reduce((sum, item) => sum + (item.soLuong || 0) * (item.product?.gia || 0), 0)
                          .toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <span style={{ color: "#dc3545", fontSize: "24px", fontWeight: "bold" }}>
                        {orderDetails[selectedOrder]
                          .reduce((sum, item) => sum + (item.soLuong || 0) * (item.product?.gia || 0), 0)
                          .toLocaleString("vi-VN")} VND
                      </span>
                      <br />
                      <small style={{ color: "#6c757d" }}>
                        ({orderDetails[selectedOrder].reduce((sum, item) => sum + (item.soLuong || 0), 0)} sản phẩm)
                      </small>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 style={{ marginBottom: "15px", color: "#000" }}>Hành động đơn hàng</h4>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #dee2e6",
                        backgroundColor: "#fff",
                        color: "#6c757d",
                        borderRadius: "4px",
                        cursor: (orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng") ? "pointer" : "not-allowed",
                        opacity: (orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng") ? 1 : 0.5,
                      }}
                      disabled={!(orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng")}
                      onClick={() => {
                        openEditModal(orders.find(o => o.maDonHang === selectedOrder));
                        setShowOrderModal(false);
                      }}
                    >
                      Sửa đơn
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #dee2e6",
                        backgroundColor: "#fff",
                        color: "#6c757d",
                        borderRadius: "4px",
                        cursor: (orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng") ? "pointer" : "not-allowed",
                        opacity: (orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng") ? 1 : 0.5,
                      }}
                      disabled={!(orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ xác nhận" || orders.find(o => o.maDonHang === selectedOrder)?.trangThai === "Chờ lấy hàng")}
                      onClick={() => {
                        openStatusModal(selectedOrder, orders.find(o => o.maDonHang === selectedOrder)?.trangThai);
                        setShowOrderModal(false);
                      }}
                    >
                      Hủy đơn
                    </button>
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#fd7e14",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 1040,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => closeEditModal()}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "500px",
              width: "100%",
              zIndex: 1050,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", textTransform: "uppercase" }}>
                SỬA HÓA ĐƠN
              </h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
                onClick={() => closeEditModal()}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Mã hóa đơn</label>
              <input
                type="text"
                name="maDonHang"
                value={editForm.maDonHang}
                disabled
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={editForm.diaChi}
                onChange={handleEditChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Số điện thoại</label>
              <input
                type="text"
                name="soDienThoai"
                value={editForm.soDienThoai}
                onChange={handleEditChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Họ tên người nhận</label>
              <input
                type="text"
                name="hoTen"
                value={editForm.hoTen}
                onChange={handleEditChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                }}
              />
            </div>

            <button
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onClick={handleEditSubmit}
            >
              ✏️ SỬA HÓA ĐƠN
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
