import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [maGioHang, setMaGioHang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setError("Vui lòng đăng nhập để xem giỏ hàng!");
          setLoading(false);
          return;
        }

        // Lấy maGioHang từ API LayGioHang
        const cartResponse = await fetch("http://localhost:5219/api-admin2/LayGioHang");
        if (!cartResponse.ok) {
          throw new Error("Không thể lấy giỏ hàng!");
        }
        const cartData = await cartResponse.json();
        const userCart = cartData.data.find((cart) => cart.taiKhoan === user.id);
        if (!userCart) {
          setLoading(false);
          return;
        }
        setMaGioHang(userCart.maGioHang);

        // Lấy chi tiết giỏ hàng từ API LayTatCaChiTietGioHang, chỉ lấy stt = 1
        const detailsResponse = await fetch("http://localhost:5219/api-admin7/LayTatCaChiTietGioHang");
        if (!detailsResponse.ok) {
          throw new Error("Không thể lấy chi tiết giỏ hàng!");
        }
        const detailsData = await detailsResponse.json();
        const userCartItems = detailsData.data.filter(
          (item) => item.maGioHang === userCart.maGioHang && item.stt === 1
        );

        // Lấy chi tiết sản phẩm cho từng maSanPham
        const formattedItems = await Promise.all(
          userCartItems.map(async (item) => {
            const productResponse = await fetch(`http://localhost:5219/api-admin/LaySanPhamTheoMa?id=${item.maSanPham}`);
            if (!productResponse.ok) {
              throw new Error(`Không thể lấy thông tin sản phẩm ${item.maSanPham}!`);
            }
            const productData = await productResponse.json();
            const product = productData.data;
            return {
              id: item.maSanPham.toString(),
              name: product.tenSanPham,
              price: product.gia,
              quantity: item.soLuong,
              image: product.anh,
              category: 'Sản phẩm',
              description: product.moTa || 'Mô tả sản phẩm',
            };
          })
        );

        setCartItems(formattedItems);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const increaseQuantity = async (maSanPham) => {
    if (!maGioHang) return;
    try {
      const response = await fetch("http://localhost:5219/api-admin7/TangGioHang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maGioHang, maSanPham }),
      });
      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === maSanPham.toString() ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        alert("Không thể tăng số lượng sản phẩm");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi tăng số lượng sản phẩm");
    }
  };

  const decreaseQuantity = async (maSanPham) => {
    if (!maGioHang) return;
    try {
      const response = await fetch("http://localhost:5219/api-admin7/GiamGioHang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maGioHang, maSanPham }),
      });
      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === maSanPham.toString() && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
        alert("Không thể giảm số lượng sản phẩm");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi giảm số lượng sản phẩm");
    }
  };

  const removeItem = async (id) => {
    if (!maGioHang) return;
    try {
      const response = await fetch(
        `http://localhost:5219/api-admin7/XoaChiTietGioHang?id=${maGioHang}&id1=${parseInt(id)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        alert("Không thể xóa sản phẩm khỏi giỏ hàng");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 1000000 ? 0 : 50000;
  const total = subtotal + shippingFee;

  const toggleItemSelection = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  const EmptyCart = () => {
    return (
      <div style={{ flex: 1, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#000' }}>Giỏ hàng trống !!!</h4>
          <Link to="/" style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', borderRadius: 5, textDecoration: 'none' }}>Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  };

  const CartItemCard = ({ item }) => (
    <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, border: '1px solid #e9ecef', position: 'relative' }}>
      <img src={"/assets/"+item.image} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 15 }} alt={item.name} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h5 style={{ fontSize: 16, fontWeight: '600', color: '#000', flex: 1, marginRight: 10, margin: 0 }}>{item.name}</h5>
          <button
            style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer' }}
            onClick={() => removeItem(item.id)}
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#000', backgroundColor: '#e7f3ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 8, display: 'inline-block' }}>{item.category}</p>
        <p style={{ fontSize: 13, color: '#6c757d', lineHeight: '18px', marginBottom: 10 }}>{item.description}</p>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 16, fontWeight: 'bold', color: '#000', margin: 0 }}>{formatPrice(item.price)}</p>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 20, padding: 2 }}>
            <button
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                if (item.quantity > 1) {
                  decreaseQuantity(parseInt(item.id));
                } else {
                  alert('Số lượng tối thiểu là 1');
                }
              }}
            >
              −
            </button>
            <span style={{ fontSize: 16, fontWeight: '600', marginHorizontal: 15, minWidth: 30, textAlign: 'center' }}>{item.quantity}</span>
            <button
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', border: 'none', cursor: 'pointer' }}
              onClick={() => increaseQuantity(parseInt(item.id))}
            >
              +
            </button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e9ecef', paddingTop: 10 }}>
          <p style={{ fontSize: 14, color: '#6c757d', margin: 0 }}>
            Tổng: <span style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>{formatPrice(item.price * item.quantity)}</span>
          </p>
        </div>
      </div>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          border: '2px solid #000',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: selectedItems.has(item.id) ? '#000' : 'transparent',
          cursor: 'pointer'
        }}
        onClick={() => toggleItemSelection(item.id)}
      >
        {selectedItems.has(item.id) && <span style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✓</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
        <div style={{ color: '#000' }}>Đang tải giỏ hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, backgroundColor: '#fff', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ height: 60, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
        <Link to="/products" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#495057', fontSize: 20 }}>←</Link>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#000', margin: 0 }}>Giỏ Hàng</h1>
        <Link to="/" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#fff', fontSize: 16 }}>🏠</Link>
      </div>

      <div style={{ height: 'calc(100vh - 120px)', overflowY: 'scroll' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
          {/* Cart Items Section */}
          <div style={{ flex: 1, backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
            <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #000' }}>Sản phẩm trong giỏ ({cartItems.length})</h3>
            <div>
              {cartItems.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 20, color: '#000' }}>Giỏ hàng trống</p>
              ) : (
                cartItems.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div style={{ width: '400px', backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
            <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #000' }}>Chi tiết hóa đơn</h3>
            <div style={{ backgroundColor: '#f8f9fa', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
                <span style={{ fontSize: 14, color: '#6c757d' }}>Tạm tính ({selectedCartItems.length} sản phẩm)</span>
                <span style={{ fontSize: 14, color: '#000', fontWeight: '500' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
                <span style={{ fontSize: 14, color: '#6c757d' }}>Phí vận chuyển</span>
                <span style={{ fontSize: 14, color: '#000', fontWeight: '500' }}>
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ height: 1, backgroundColor: '#dee2e6', marginVertical: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, marginTop: 10, paddingTop: 15, borderTop: '2px solid #000' }}>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Tổng cộng</span>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{formatPrice(total)}</span>
              </div>

              {/* Promo Code Section */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #dee2e6' }}>
                <h4 style={{ fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 10 }}>Mã giảm giá</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: 8, fontSize: 14, color: '#6c757d' }}
                  />
                  <button style={{ backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, border: 'none', color: '#fff', fontSize: 14, fontWeight: '600', cursor: 'pointer' }}>Áp dụng</button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                style={{
                  width: '100%',
                  backgroundColor: '#000',
                  paddingVertical: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 20,
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
                onClick={() => navigate('/checkout', { state: { selectedItems: selectedCartItems } })}
              >
                Đặt hàng ({formatPrice(total)})
              </button>

              {/* Continue Shopping */}
              <button
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginTop: 10,
                  border: 'none',
                  color: '#000',
                  fontSize: 14,
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div style={{ height: 30 }} />
      </div>
    </div>
  );
};

export default Cart;
