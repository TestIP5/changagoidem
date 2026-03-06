import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        // Kiểm tra thông tin người dùng trong LocalStorage khi tải trang
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        // Xóa thông tin người dùng khỏi LocalStorage và cập nhật state
        localStorage.removeItem('user');
        setUser(null);
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> EVIRON</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item mx-3">
                            <NavLink className="nav-link" to="/">Trang chủ </NavLink>
                        </li>
                        <li className="nav-item mx-3">
                            <NavLink className="nav-link" to="/product">Sản phẩm</NavLink>
                        </li>
                        <li className="nav-item mx-3">
                            <NavLink className="nav-link" to="/about">Giới thiệu</NavLink>
                        </li>
                        <li className="nav-item mx-3">
                            <NavLink className="nav-link" to="/contact">Đơn hàng</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {user ? (
                            <>
                                <span className="navbar-text mx-2">Chào mừng, {user.id}</span>
                                <button onClick={handleLogout} className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-out-alt mr-1"></i> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-in-alt mr-1"></i> Đăng nhập
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-user-plus mr-1"></i> Đăng ký
                                </NavLink>
                            </>
                        )}
                        <NavLink to="/cart" className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Giỏ hàng
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>

        {showLogoutModal && (
            <div
                className="modal"
                style={{
                    display: 'block',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1050,
                }}
                onClick={cancelLogout}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: '400px', margin: 'auto' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="modal-content"
                        style={{
                            backgroundColor: '#fff',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            className="modal-header"
                            style={{
                                borderBottom: '1px solid #dee2e6',
                                padding: '16px 20px',
                                backgroundColor: '#f8f9fa',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                            }}
                        >
                            <h5
                                className="modal-title"
                                style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#000',
                                }}
                            >
                                Xác nhận đăng xuất
                            </h5>
                        </div>
                        <div
                            className="modal-body"
                            style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#000',
                            }}
                        >
                            Bạn có chắc muốn đăng xuất không?
                        </div>
                        <div
                            className="modal-footer"
                            style={{
                                borderTop: '1px solid #dee2e6',
                                padding: '16px 20px',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                            }}
                        >
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                                onClick={cancelLogout}
                            >
                                Không
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                                onClick={confirmLogout}
                            >
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default Navbar;