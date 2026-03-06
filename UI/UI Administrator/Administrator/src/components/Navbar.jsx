import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

  return (
    <div
      className="bg-dark border-end position-fixed top-0 start-0 vh-100 p-3 d-flex flex-column"
      style={{ width: "250px", zIndex: 1000 }}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-white mb-0">EVIRON</h2>
        <div className="border-bottom border-light mt-2"></div>
      </div>

      {/* Menu */}
      <nav className="nav flex-column flex-grow-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link text-white fs-5 mb-2 px-3 py-2 rounded text-start d-flex align-items-center ${
              isActive ? 'bg-primary' : 'hover-bg-secondary'
            }`
          }
          style={{
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
        >
          <i className="fa fa-cube me-3"></i>
          Quản lý sản phẩm
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `nav-link text-white fs-5 mb-2 px-3 py-2 rounded text-start d-flex align-items-center ${
              isActive ? 'bg-primary' : 'hover-bg-secondary'
            }`
          }
          style={{
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
        >
          <i className="fa fa-shopping-cart me-3"></i>
          Quản lý đơn hàng
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `nav-link text-white fs-5 mb-2 px-3 py-2 rounded text-start d-flex align-items-center ${
              isActive ? 'bg-primary' : 'hover-bg-secondary'
            }`
          }
          style={{
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
        >
          <i className="fa fa-users me-3"></i>
          Quản lý người dùng
        </NavLink>
        <NavLink
          to="/statistics"
          className={({ isActive }) =>
            `nav-link text-white fs-5 mb-2 px-3 py-2 rounded text-start d-flex align-items-center ${
              isActive ? 'bg-primary' : 'hover-bg-secondary'
            }`
          }
          style={{
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
        >
          <i className="fa fa-chart-bar me-3"></i>
          Thống kê
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button className="btn btn-outline-light w-100 text-start d-flex align-items-center">
          <i className="fa fa-sign-out-alt me-3"></i>
          Thoát
        </button>
      </div>

      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Navbar
