import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;



  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Order items (from cart)
  const selectedItems = state?.selectedItems || [];
  const orderItems = selectedItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price * item.quantity,
  }));

  const shippingFee = 0;
  const total = orderItems.reduce((sum, item) => sum + item.price, 0) + shippingFee;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setEmail(user.id);
    }
    // Pre-fill form fields
    setFullName('Phạm Hưng');
    setAddress('96 Nguyễn Trãi');
    setPhone('0971841153');
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };



  const handlePayment = async () => {
    // Validate form
    if (!fullName.trim() || !email.trim() || !address.trim() || !phone.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    try {
      // Step 1: Create order
      const orderResponse = await fetch('https://localhost:7041/api/DonHangCT/ThemDonHang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taiKhoan: email,
          diaChi: address,
          ngayDat: new Date().toISOString(),
          trangThai: "Chờ xác nhận",
          stt: 1,
          soDienThoai: phone,
          hoTen: fullName,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const maDonHang = orderData.maDonHang;

      // Step 2: Create order details for each item
      for (const item of selectedItems) {
        const detailResponse = await fetch('https://localhost:7041/api/CTDonHangCT/ThemCTHoaDon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            maDonHang: maDonHang,
            maSanPham: parseInt(item.id),
            soLuong: item.quantity,
            stt: 1,
          }),
        });

        if (!detailResponse.ok) {
          throw new Error('Failed to create order detail');
        }
      }

      // Success - Show toast notification
      toast.success('Đặt hàng thành công!');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          <h4 style={{ color: '#000' }}>Không có sản phẩm nào để thanh toán !!!</h4>
          <Link to="/cart" style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', borderRadius: 5, textDecoration: 'none' }}>Quay lại giỏ hàng</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, backgroundColor: '#fff', padding: '0 20px' }}>


      {/* Header */}
      <div style={{ height: 60, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
        <Link to="/cart" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#495057', fontSize: 20 }}>←</Link>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', margin: 0 }}>Thanh Toán</h1>
        <Link to="/" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#fff', fontSize: 16 }}>🏠</Link>
      </div>

      <div style={{ height: 'calc(100vh - 60px)', overflowY: 'scroll' }}>
        <div style={{ padding: 15, maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px' }}>
          {/* Left Column */}
          <div style={{ flex: '0 0 70%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Order Information */}
            <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, border: '1px solid #ddd' }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20, textTransform: 'uppercase', position: 'relative', paddingLeft: '15px' }}>
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#007bff' }}></span>
                Thông tin đơn hàng
              </h3>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 15 }}>Hình thức thanh toán</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ flex: 1, padding: '15px', border: '2px solid #007bff', borderRadius: 8, backgroundColor: '#fff', color: '#007bff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🚚 Nhận hàng thanh toán
                  </button>
                  <button style={{ flex: 1, padding: '15px', border: '2px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa', color: '#666', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    💳 Chuyển khoản
                  </button>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, border: '1px solid #ddd' }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20, textTransform: 'uppercase', position: 'relative', paddingLeft: '15px' }}>
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#007bff' }}></span>
                Thông tin người nhận
              </h3>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 }}>Tên người nhận</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: 8, fontSize: 16, backgroundColor: '#fff', color: '#000' }}
                  placeholder="Nhập tên người nhận"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 }}>Số điện thoại nhận hàng</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: 8, fontSize: 16, backgroundColor: '#fff', color: '#000' }}
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 }}>Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: 8, fontSize: 16, backgroundColor: '#fff', color: '#000' }}
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={{ display: 'block', fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 }}>Email</label>
                <input
                  type="email"
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: 8, fontSize: 16, backgroundColor: '#f8f9fa', color: '#000' }}
                  placeholder="hp01@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: '0 0 30%' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 25, border: '2px solid #007bff', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20 }}>Đơn hàng</h3>

              {/* Product List */}
              <div style={{ marginBottom: 20 }}>
                {orderItems.map((item, index) => (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 14, color: '#000', margin: 0 }}>{item.quantity}x {item.name}</p>
                  </div>
                ))}
              </div>

              {/* Costs */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#666' }}>Tiền hàng ({orderItems.length} món)</span>
                  <span style={{ fontSize: 14, color: '#000' }}>{formatPrice(orderItems.reduce((sum, item) => sum + item.price, 0))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#666' }}>Mã giảm giá</span>
                  <span style={{ fontSize: 14, color: '#000' }}>{formatPrice(shippingFee)}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
              </div>

              {/* Terms */}
              <div style={{ marginBottom: 20, fontSize: 12, color: '#666' }}>
                Bằng việc bấm vào nút 'Đặt hàng', tôi đồng ý với <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>chính sách hoạt động</a> của chúng tôi.
              </div>

              {/* Total */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Tổng tiền</span>
                  <span style={{ fontSize: 20, fontWeight: 'bold', color: '#007bff' }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Order Button */}
              <button
                style={{
                  width: '100%',
                  backgroundColor: '#007bff',
                  padding: '15px',
                  borderRadius: 8,
                  border: 'none',
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,123,255,0.3)'
                }}
                onClick={handlePayment}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>

        <div style={{ height: 30 }} />
      </div>
    </div>
  );
};

export default Checkout;
