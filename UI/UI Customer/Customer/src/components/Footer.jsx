import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Thông tin công ty */}
          <div className="col-md-6 mb-3 mb-md-0">
            <h6 className="fw-light mb-1">CÔNG TY TNHH EVIRON</h6>
            <p className="mb-0 small">
              Địa chỉ: 05 Bà Triệu, P.Lê Lợi, TP. Hưng Yên<br />
              Email: hp01417@gmail.com | Hotline: 0971841153
            </p>
          </div>

          {/* Điều hướng nhanh */}
          <div className="col-md-6 text-md-end">
            <a className="text-white text-decoration-none me-3 small">
              Giới thiệu
            </a>
            <a className="text-white text-decoration-none me-3 small">
              Chính sách
            </a>
            <a className="text-white text-decoration-none small">
              Liên hệ
            </a>
          </div>
        </div>

        <hr className="border-light my-3" />

        <div className="text-center small">
          © 2025 Eviron. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
