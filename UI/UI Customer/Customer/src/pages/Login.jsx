import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5219/api-admin1/LayNguoiDungTheoMa?id=${email}`);
            if (!response.ok) {
                throw new Error("Tài khoản không tồn tại hoặc mật khẩu không đúng!");
            }
            const result = await response.json();
            const userData = result.data;
            // Kiểm tra mật khẩu
            if (userData && userData.matKhau === password) {
                // Lưu thông tin người dùng vào LocalStorage
                localStorage.setItem('user', JSON.stringify({ id: userData.taiKhoan }));
                toast.success("Đăng nhập thành công!");
                setTimeout(() => navigate("/"), 2000); // Chuyển hướng về trang chủ sau 2 giây
            } else {
                toast.error("Tài khoản không tồn tại hoặc mật khẩu không đúng!");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">ĐĂNG NHẬP</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleLogin}>
                            <div className="my-3">
                                <label htmlFor="floatingInput">Địa chỉ email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="floatingPassword">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="my-3">
                                <p>Chưa có tài khoản? <Link to="/register" className="text-decoration-underline text-info">Đăng ký</Link></p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">
                                    Đăng nhập
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

export default Login;