import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [confirmMatKhau, setConfirmMatKhau] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(taiKhoan)) {
      toast.error('Địa chỉ email không hợp lệ!');
      return;
    }

    // Kiểm tra mật khẩu nhập lại
    if (matKhau !== confirmMatKhau) {
      toast.error('Mật khẩu nhập lại không khớp!');
      return;
    }

    try {
      // Kiểm tra email đã tồn tại
      const checkResponse = await fetch(`http://localhost:5219/api-admin1/LayNguoiDungTheoMa?id=${taiKhoan}`);
      if (checkResponse.ok) {
          toast.error('Tài khoản đã tồn tại!');
          return;
      } else {
        const userResponse = await fetch('https://localhost:7041/api/NguoiDungCT/ThemNguoiDung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan,
          matKhau,
        }),
      });

      if (!userResponse.ok) {
        throw new Error('Lỗi khi tạo tài khoản!');
      }

      // Tạo giỏ hàng
      const cartResponse = await fetch('https://localhost:7041/api/GioHangCT/ThemGioHang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan,
          stt: 1,
        }),
      });

      if (cartResponse.ok) {
        toast.success('Tạo tài khoản thành công!');
        setTaiKhoan('');
        setMatKhau('');
        setConfirmMatKhau('');
        navigate('/login');
      } else {
        throw new Error('Lỗi khi tạo giỏ hàng!');
      }
      }


    } catch (error) {
      console.error('Lỗi:', error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">ĐĂNG KÝ</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="Email">Địa chỉ email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  placeholder="name@example.com"
                  value={taiKhoan}
                  onChange={(e) => setTaiKhoan(e.target.value)}
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Password">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password"
                  placeholder="Nhập mật khẩu"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="ConfirmPassword">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="ConfirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmMatKhau}
                  onChange={(e) => setConfirmMatKhau(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <p>Đã có tài khoản? <Link to="/login" className="text-decoration-underline text-info">Đăng nhập</Link></p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;