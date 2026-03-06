import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [formData, setFormData] = useState({
    maSanPham: "",
    maDanhMuc: "",
    tenSanPham: "",
    gia: "",
    tinhTrang: "Mới",
    moTa: "",
    stt: 1,
    anh: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    tenDanhMuc: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);

  const truncateDescription = (description, maxLength = 50) => {
    if (description.length <= maxLength) {
      return description;
    }
    const twoThirds = Math.floor(maxLength * (2 / 3));
    return description.substring(0, twoThirds) + "...";
  };

  useEffect(() => {
    let componentMounted = true;

    const fetchProductsAndCategories = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch("http://localhost:5219/api-admin/LaySanPham");
        const productJson = await productResponse.json();

        const categoryResponse = await fetch("http://localhost:5219/api-admin4/LayDanhMuc");
        const categoryJson = await categoryResponse.json();

        if (componentMounted) {
          if (categoryJson.data) {
            const filteredCategories = categoryJson.data.filter((cat) => cat.stt === 1);
            setCategories(filteredCategories);

            if (productJson.data) {
              const filteredProducts = productJson.data.filter((product) =>
                filteredCategories.some((cat) => cat.maDanhMuc === product.maDanhMuc && product.stt === 1)
              );
              setData(filteredProducts);
              setFilter(filteredProducts);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Đã xảy ra lỗi khi tải dữ liệu!");
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

  useEffect(() => {
    let filtered = data;

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((item) => item.maDanhMuc === parseInt(selectedCategory));
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.tenSanPham.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilter(filtered);
  }, [data, selectedCategory, searchQuery]);

  const deleteProduct = async (maSanPham) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`http://localhost:5219/api-admin/XoaSanPham?id=${maSanPham}`, {
          method: "POST",
        });

        if (response.ok) {
          const updatedData = data.filter((product) => product.maSanPham !== maSanPham);
          setData(updatedData);
          setFilter(updatedData);
          alert("Xóa sản phẩm thành công!");
        } else {
          alert("Lỗi khi xóa sản phẩm!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Đã xảy ra lỗi khi xóa sản phẩm!");
      }
    }
  };

  const filterProductByCategory = (maDanhMuc) => {
    setSelectedCategory(maDanhMuc);
  };



  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        anh: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5219/api-admin/ThemSanPham", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          maDanhMuc: parseInt(formData.maDanhMuc),
          gia: parseFloat(formData.gia),
          stt: 1,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setData((prev) => [...prev, newProduct.data]);
        setFilter((prev) => [...prev, newProduct.data]);
        setShowModal(false);
        setFormData({
          maSanPham: "",
          maDanhMuc: "",
          tenSanPham: "",
          gia: "",
          tinhTrang: "Mới",
          moTa: "",
          stt: 1,
          anh: "",
        });
        alert("Thêm sản phẩm thành công!");
      } else {
        alert("Lỗi khi thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm!");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5219/api-admin/SuaSanPham?id=${editingProductId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maSanPham: parseInt(formData.maSanPham),
          maDanhMuc: parseInt(formData.maDanhMuc),
          tenSanPham: formData.tenSanPham,
          gia: parseFloat(formData.gia),
          tinhTrang: formData.tinhTrang,
          moTa: formData.moTa,
          stt: 1,
          anh: formData.anh || "",
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setData((prev) =>
          prev.map((product) =>
            product.maSanPham === editingProductId ? updatedProduct.data : product
          )
        );
        setFilter((prev) =>
          prev.map((product) =>
            product.maSanPham === editingProductId ? updatedProduct.data : product
          )
        );
        setShowModal2(false);
        setFormData({
          maSanPham: "",
          maDanhMuc: "",
          tenSanPham: "",
          gia: "",
          tinhTrang: "Mới",
          moTa: "",
          stt: 1,
          anh: "",
        });
        setEditingProductId(null);
        alert("Sửa sản phẩm thành công!");
      } else {
        alert("Lỗi khi sửa sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      alert("Đã xảy ra lỗi khi sửa sản phẩm!");
    }
  };

  const handleEditProduct = (maSanPham) => {
    const product = data.find((p) => p.maSanPham === maSanPham);
    if (product) {
      setFormData({
        maSanPham: product.maSanPham,
        maDanhMuc: product.maDanhMuc,
        tenSanPham: product.tenSanPham,
        gia: product.gia,
        tinhTrang: product.tinhTrang,
        moTa: product.moTa,
        stt: 1,
        anh: product.anh || "",
      });
      setEditingProductId(maSanPham);
      setShowModal2(true);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7041/api/DanhMucCT/ThemDanhMuc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenDanhMuc: categoryFormData.tenDanhMuc,
          stt: 1,
        }),
      });

      if (response.ok) {
        setShowCategoryModal(false);
        setCategoryFormData({ tenDanhMuc: "" });
        alert("Thêm danh mục thành công!");
        // Refresh categories
        const categoryResponse = await fetch("http://localhost:5219/api-admin4/LayDanhMuc");
        const categoryJson = await categoryResponse.json();
        if (categoryJson.data) {
          const filteredCategories = categoryJson.data.filter((cat) => cat.stt === 1);
          setCategories(filteredCategories);
        }
      } else {
        alert("Lỗi khi thêm danh mục!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      alert("Đã xảy ra lỗi khi thêm danh mục!");
    }
  };

  const deleteCategory = async (maDanhMuc) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`https://localhost:7041/api/DanhMucCT/XoaDanhMuc?id=${maDanhMuc}`, {
          method: "POST",
        });

        if (response.ok) {
          alert("Xóa danh mục thành công!");
          // Refresh categories
          const categoryResponse = await fetch("http://localhost:5219/api-admin4/LayDanhMuc");
          const categoryJson = await categoryResponse.json();
          if (categoryJson.data) {
            const filteredCategories = categoryJson.data.filter((cat) => cat.stt === 1);
            setCategories(filteredCategories);
            // Also refresh products to remove those in deleted categories
            const productResponse = await fetch("http://localhost:5219/api-admin/LaySanPham");
            const productJson = await productResponse.json();
            if (productJson.data) {
              const filteredProducts = productJson.data.filter((product) =>
                filteredCategories.some((cat) => cat.maDanhMuc === product.maDanhMuc && product.stt === 1)
              );
              setData(filteredProducts);
              setFilter(filteredProducts);
            }
          }
        } else {
          alert("Lỗi khi xóa danh mục!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Đã xảy ra lỗi khi xóa danh mục!");
      }
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

  const ShowProducts = () => (
    <>
      <div className="row">
        {filter.map((product) => (
          <div key={product.maSanPham} className="col-12 mb-3">
            <div className="card d-flex flex-row align-items-center p-3">
              <img
                src={"/assets/" + product.anh || "https://via.placeholder.com/150"}
                alt={product.tenSanPham}
                style={{ width: "150px", height: "auto", objectFit: "cover", marginRight: "20px" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">{product.tenSanPham}</h5>
                <p className="mb-1 text-muted">{truncateDescription(product.moTa)}</p>
                <span className="badge bg-secondary me-2">{product.tenDanhMuc}</span>
              </div>
              <div className="text-end">
                <p className="fw-bold text-primary mb-2">{product.gia.toLocaleString()} đ</p>
                <div>
                  <Link
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleEditProduct(product.maSanPham)}
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => deleteProduct(product.maSanPham)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Quản lý sản phẩm</h3>
              <div className="text-muted">
                Tổng số: {filter.length} sản phẩm
              </div>
            </div>
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Bộ lọc</h5>
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
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="ALL">Tất cả danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                          {cat.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("ALL");
                      }}
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách sản phẩm</h5>
                <div>
                  <button className="btn btn-dark btn-sm me-2" onClick={() => setShowCategoryModal(true)}>
                    <i className="fa fa-plus me-2"></i>Thêm danh mục
                  </button>
                  <button className="btn btn-outline-danger btn-sm me-2" onClick={() => setShowDeleteCategoryModal(true)}>
                    <i className="fa fa-trash me-2"></i>Xóa danh mục
                  </button>
                  <button className="btn btn-dark btn-sm" onClick={() => setShowModal(true)}>
                    <i className="fa fa-plus me-2"></i>Thêm sản phẩm
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                {loading ? <Loading /> : <ShowProducts />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content p-4" style={{ minWidth: "800px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold">THÊM MỚI SẢN PHẨM</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-5 text-center">
                    <div className="border rounded p-3 mb-3">
                      {formData.anh ? (
                        <p className="text-muted">{formData.anh}</p>
                      ) : (
                        <i className="fa fa-image fa-2x text-muted"></i>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tên sản phẩm</label>
                      <input
                        type="text"
                        name="tenSanPham"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm"
                        value={formData.tenSanPham}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tình trạng</label>
                      <input
                        type="text"
                        name="tinhTrang"
                        className="form-control"
                        placeholder="Nhập tình trạng"
                        value={formData.tinhTrang}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Chọn loại</label>
                      <select
                        name="maDanhMuc"
                        className="form-select"
                        value={formData.maDanhMuc}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn loại</option>
                        {categories.map((cat) => (
                          <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                            {cat.tenDanhMuc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Giá bán</label>
                      <input
                        type="number"
                        name="gia"
                        className="form-control"
                        placeholder="Nhập giá bán"
                        value={formData.gia}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Mô tả</label>
                      <textarea
                        name="moTa"
                        className="form-control"
                        placeholder="Nhập mô tả sản phẩm..."
                        rows="3"
                        value={formData.moTa}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                      <i className="fa fa-plus me-2"></i>THÊM SẢN PHẨM
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal2 && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content p-4" style={{ minWidth: "800px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold">SỬA SẢN PHẨM</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal2(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="row">
                  <div className="col-md-5 text-center">
                    <div className="border rounded p-3 mb-3">
                      {formData.anh ? (
                        <p className="text-muted">{formData.anh}</p>
                      ) : (
                        <i className="fa fa-image fa-2x text-muted"></i>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Mã sản phẩm</label>
                      <input
                        type="text"
                        name="maSanPham"
                        className="form-control"
                        value={formData.maSanPham}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tên sản phẩm</label>
                      <input
                        type="text"
                        name="tenSanPham"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm"
                        value={formData.tenSanPham}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tình trạng</label>
                      <input
                        type="text"
                        name="tinhTrang"
                        className="form-control"
                        placeholder="Nhập tình trạng"
                        value={formData.tinhTrang}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Chọn loại</label>
                      <select
                        name="maDanhMuc"
                        className="form-select"
                        value={formData.maDanhMuc}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn loại</option>
                        {categories.map((cat) => (
                          <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                            {cat.tenDanhMuc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Giá bán</label>
                      <input
                        type="number"
                        name="gia"
                        className="form-control"
                        placeholder="Nhập giá bán"
                        value={formData.gia}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Mô tả</label>
                      <textarea
                        name="moTa"
                        className="form-control"
                        placeholder="Nhập mô tả sản phẩm..."
                        rows="3"
                        value={formData.moTa}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                      <i className="fa fa-edit me-2"></i>SỬA SẢN PHẨM
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content p-4" style={{ minWidth: "800px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold">THÊM MỚI DANH MỤC</h5>
                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <form onSubmit={handleCategorySubmit}>
                <div className="row">
                  <div className="col-md-5 text-center">
                    <div className="border rounded p-3 mb-3">
                      <i className="fa fa-folder fa-2x text-muted"></i>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tên danh mục</label>
                      <input
                        type="text"
                        name="tenDanhMuc"
                        className="form-control"
                        placeholder="Nhập tên danh mục"
                        value={categoryFormData.tenDanhMuc}
                        onChange={handleCategoryInputChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                      <i className="fa fa-plus me-2"></i>THÊM DANH MỤC
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showDeleteCategoryModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content p-4" style={{ minWidth: "800px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold">XÓA DANH MỤC</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteCategoryModal(false)}></button>
              </div>
              <div className="row">
                <div className="col-md-5 text-center">
                  <div className="border rounded p-3 mb-3">
                    <i className="fa fa-folder fa-2x text-muted"></i>
                  </div>
                </div>
                <div className="col-md-7">
                  <h6 className="mb-3">Chọn danh mục để xóa:</h6>
                  <div className="list-group">
                    {categories.map((cat) => (
                      <button
                        key={cat.maDanhMuc}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        onClick={() => deleteCategory(cat.maDanhMuc)}
                      >
                        {cat.tenDanhMuc}
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
