import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Navbar } from "../components";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let componentMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5219/api-admin1/LayNguoiDung");
        const json = await response.json();

        if (componentMounted && json.data) {
          const activeUsers = json.data.filter((user) => user.stt >= 1);
          setUsers(activeUsers);
          setFilteredUsers(activeUsers);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
        alert("Đã xảy ra lỗi khi tải danh sách người dùng!");
      } finally {
        if (componentMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      filtered = filtered.filter((user) =>
        user.taiKhoan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  const fetchUserOrders = async (taiKhoan) => {
    try {
      const response = await fetch("http://localhost:5219/api-admin3/LayDonHang");
      const json = await response.json();

      if (json.data) {
        const userOrders = json.data.filter(
          (order) => order.taiKhoan === taiKhoan && order.stt >= 1
        );
        setSelectedUserOrders(userOrders);
        setSelectedUser(taiKhoan);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng của người dùng:", error);
      alert("Đã xảy ra lỗi khi tải đơn hàng!");
    }
  };

  const fetchOrderDetails = async (maDonHang) => {
    if (orderDetails[maDonHang]) {
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
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      alert("Đã xảy ra lỗi khi tải chi tiết đơn hàng!");
    }
  };



  const openEditModal = (user) => {
    setEditFormData({
      taiKhoan: user.taiKhoan,
      matKhau: user.matKhau,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5219/api-admin1/SuaNguoiDung`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taiKhoan: editFormData.taiKhoan,
          matKhau: editFormData.matKhau,
        }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.taiKhoan === editFormData.taiKhoan
              ? { ...user, matKhau: editFormData.matKhau }
              : user
          )
        );
        setFilteredUsers((prev) =>
          prev.map((user) =>
            user.taiKhoan === editFormData.taiKhoan
              ? { ...user, matKhau: editFormData.matKhau }
              : user
          )
        );
        alert("Sửa mật khẩu thành công!");
        closeEditModal();
      } else {
        alert("Lỗi khi sửa mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi khi sửa người dùng:", error);
      alert("Đã xảy ra lỗi khi sửa mật khẩu!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUserOrders([]);
    setSelectedUser(null);
    setOrderDetails({});
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      taiKhoan: "",
      matKhau: "",
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const Loading = () => (
    <div className="row">
      {[...Array(6)].map((_, i) => (
        <div className="col-12 mb-3" key={i}>
          <Skeleton height={100} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Quản lý người dùng</h3>
              <div className="text-muted">
                Tổng số: {filteredUsers.length} người dùng
              </div>
            </div>
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Tìm kiếm</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
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
                        onChange={handleSearchInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Danh sách người dùng</h5>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <Loading />
                ) : (
                  <div className="row">
                    {filteredUsers.map((user) => (
                      <div key={user.taiKhoan} className="col-12 mb-3">
                        <div
                          className="card d-flex flex-row align-items-center p-3 mx-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => fetchUserOrders(user.taiKhoan)}
                        >
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{user.taiKhoan}</h5>
                            <p className="mb-1 text-muted">Mật khẩu: {user.matKhau}</p>
                          </div>
                          <div className="text-end" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openEditModal(user)}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Đơn hàng của {selectedUser}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {selectedUserOrders.length === 0 ? (
                    <p className="text-muted">Người dùng này chưa có đơn hàng nào.</p>
                  ) : (
                    selectedUserOrders.map((order) => (
                      <div key={order.maDonHang} className="mb-4">
                        <div
                          className="card p-3"
                          onClick={() => fetchOrderDetails(order.maDonHang)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="mb-1 text-muted fw-bold">Mã đơn hàng: {order.maDonHang}</p>
                              <p className="mb-1 text-muted">Ngày đặt: {new Date(order.ngayDat).toLocaleString()}</p>
                              <p className="mb-1 text-muted">Địa chỉ: {order.diaChi}</p>
                            </div>
                            <div className="text-end">
                              <span
                                className={`badge ${
                                  order.trangThai === "Hoàn thành" ? "bg-success" :
                                  order.trangThai === "Đang giao hàng" ? "bg-primary" :
                                  order.trangThai === "Đã xử lý" ? "bg-info" :
                                  order.trangThai === "Chờ xác nhận" ? "bg-secondary" :
                                  order.trangThai === "Đã giao hàng" ? "bg-success" : "bg-warning"
                                }`}
                              >
                                {order.trangThai}
                              </span>
                            </div>
                          </div>
                          {orderDetails[order.maDonHang] && (
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
                                            src={item.product?.anh || "https://via.placeholder.com/50"}
                                            alt={item.product?.tenSanPham}
                                            style={{
                                              width: "50px",
                                              height: "auto",
                                              objectFit: "cover",
                                              marginRight: "10px",
                                            }}
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                                          />
                                          {item.product?.tenSanPham || "Không có tên sản phẩm"}
                                        </div>
                                      </td>
                                      <td>{item.soLuong || 0}</td>
                                      <td>{(item.product?.gia || 0).toLocaleString()} đ</td>
                                      <td>{((item.soLuong || 0) * (item.product?.gia || 0)).toLocaleString()} đ</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sửa mật khẩu người dùng: {editFormData.taiKhoan}</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={updateUser}>
                    <div className="mb-3">
                      <label htmlFor="taiKhoan" className="form-label fw-semibold">
                        Tài khoản
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="taiKhoan"
                        name="taiKhoan"
                        value={editFormData.taiKhoan}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="matKhau" className="form-label fw-semibold">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="matKhau"
                        name="matKhau"
                        value={editFormData.matKhau}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={closeEditModal}>
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;