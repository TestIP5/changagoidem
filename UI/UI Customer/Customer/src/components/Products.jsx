import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maGioHang, setMaGioHang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    let componentMounted = true;

    const fetchProductsAndCategories = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch("http://localhost:5219/api-admin/LaySanPham");
        if (!productResponse.ok) {
          throw new Error("Không thể lấy danh sách sản phẩm!");
        }
        const productJson = await productResponse.json();

        const categoryResponse = await fetch("http://localhost:5219/api-admin4/LayDanhMuc");
        if (!categoryResponse.ok) {
          throw new Error("Không thể lấy danh sách danh mục!");
        }
        const categoryJson = await categoryResponse.json();

        const user = JSON.parse(localStorage.getItem("user"));
        let userCart = null;
        if (user && user.id) {
          const cartResponse = await fetch("http://localhost:5219/api-admin2/LayGioHang");
          if (!cartResponse.ok) {
            throw new Error("Không thể lấy giỏ hàng!");
          }
          const cartData = await cartResponse.json();
          userCart = cartData.data.find((cart) => cart.taiKhoan === user.id);
          if (userCart && componentMounted) {
            setMaGioHang(userCart.maGioHang);
          }
        }

        if (componentMounted) {
          if (productJson.data) {
            setData(productJson.data);
            setFilter(productJson.data);
          }
          if (categoryJson.data) {
            setCategories(categoryJson.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error(error.message);
      } finally {
        if (componentMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductsAndCategories();

    return () => {
      componentMounted = false;
    };
  }, []);

  const filterProductByCategory = (maDanhMuc) => {
    let updatedList;
    if (maDanhMuc === "ALL") {
      updatedList = data;
    } else {
      updatedList = data.filter((item) => item.maDanhMuc === maDanhMuc);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      updatedList = updatedList.filter((item) =>
        item.tenSanPham.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filters
    if (minPrice !== "") {
      updatedList = updatedList.filter((item) => item.gia >= parseInt(minPrice));
    }
    if (maxPrice !== "") {
      updatedList = updatedList.filter((item) => item.gia <= parseInt(maxPrice));
    }

    // Apply sorting
    if (sortOrder === "asc") {
      updatedList = updatedList.sort((a, b) => a.gia - b.gia);
    } else if (sortOrder === "desc") {
      updatedList = updatedList.sort((a, b) => b.gia - a.gia);
    }

    setFilter(updatedList);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    let updatedList = data;
    if (searchQuery.trim()) {
      updatedList = data.filter((item) =>
        item.tenSanPham.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filters
    if (minPrice !== "") {
      updatedList = updatedList.filter((item) => item.gia >= parseInt(minPrice));
    }
    if (maxPrice !== "") {
      updatedList = updatedList.filter((item) => item.gia <= parseInt(maxPrice));
    }

    // Apply sorting
    if (sortOrder === "asc") {
      updatedList = updatedList.sort((a, b) => a.gia - b.gia);
    } else if (sortOrder === "desc") {
      updatedList = updatedList.sort((a, b) => b.gia - a.gia);
    }

    setFilter(updatedList);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    filterProductByCategory("ALL");
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToCart = async (maSanPham) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id || !maGioHang) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      const detailsResponse = await fetch("http://localhost:5219/api-admin7/LayTatCaChiTietGioHang");
      if (!detailsResponse.ok) {
        throw new Error("Không thể lấy chi tiết giỏ hàng!");
      }
      const detailsData = await detailsResponse.json();
      const existingItem = detailsData.data.find(
        (item) => item.maGioHang === maGioHang && item.maSanPham === maSanPham && item.stt === 1
      );

      let response;
      if (existingItem) {
        response = await fetch("http://localhost:5219/api-admin7/TangGioHang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ maGioHang, maSanPham }),
        });
        if (!response.ok) {
          throw new Error("Không thể tăng số lượng sản phẩm!");
        }
      } else {
        response = await fetch("http://localhost:5219/api-admin7/ThemChiTietGioHang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ maGioHang, maSanPham }),
        });
        if (!response.ok) {
          throw new Error("Không thể thêm sản phẩm vào giỏ hàng!");
        }
      }

      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const Loading = () => (
    <div className="row">
      {[...Array(6)].map((_, i) => (
        <div className="col-md-4 col-sm-6 col-12 mb-4" key={i}>
          <Skeleton height={592} />
        </div>
      ))}
    </div>
  );

  const ShowProducts = () => {
    const totalPages = Math.ceil(filter.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filter.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    return (
      <>
        <div className="buttons text-center py-4">
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProductByCategory("ALL")}>
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.maDanhMuc}
              className="btn btn-outline-dark btn-sm m-2"
              onClick={() => filterProductByCategory(cat.maDanhMuc)}
            >
              {cat.tenDanhMuc}
            </button>
          ))}
        </div>

        <div className="row">
          {currentProducts.map((product) => (
            <div key={product.maSanPham} className="col-md-4 col-sm-6 col-12 mb-4">
              <div className="card text-center h-100">
                <img
                  className="card-img-top p-3"
                  src={"./assets/" + product.anh}
                  alt={product.tenSanPham}
                  height={300}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.tenSanPham}</h5>
                  <p className="card-text">
                    {product.moTa.length > 100 ? product.moTa.substring(0, 40) + "..." : product.moTa}
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">{product.gia.toLocaleString()}đ</li>
                </ul>
                <div className="card-body">
                  <Link to={`/product/${product.maSanPham}`} className="btn btn-dark m-1">
                    Chi tiết
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => handleAddToCart(product.maSanPham)}
                  >
                    Thêm vào giỏ hàng
                  </button>
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
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Sản phẩm mới nhất</h2>
            <hr />
          </div>
        </div>

        <div
          className="d-flex align-items-center justify-content-center mb-4"
          style={{ width: "100%", gap: "10px", flexWrap: "wrap" }}
        >
          <div
            className="input-group"
            style={{ width: "20%", minWidth: "200px" }}
          >
            <span
              className="input-group-text"
              id="search-icon"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.398a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              </svg>
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Search"
              aria-describedby="search-icon"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>

          <div className="input-group" style={{ width: "15%", minWidth: "120px" }}>
            <span className="input-group-text">Giá từ</span>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ width: "15%", minWidth: "120px" }}>
            <span className="input-group-text">Đến</span>
            <input
              type="number"
              className="form-control"
              placeholder="∞"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ width: "15%", minWidth: "150px" }}>
            <span className="input-group-text">Sắp xếp</span>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Không sắp xếp</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>

          <button
            className="btn btn-outline-dark"
            onClick={applyFilters}
            style={{ minWidth: "100px" }}
          >
            Áp dụng
          </button>
        </div>

        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;