import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";


import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);




  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);

      try {
        // Gọi sản phẩm theo ID
        const res = await fetch(`http://localhost:5219/api-admin/LaySanPhamTheoMa?id=${id}`);
        const json = await res.json();
        const prod = json.data;
        setProduct(prod);
        setLoading(false);

        // Gọi các sản phẩm cùng danh mục
        const res2 = await fetch(`http://localhost:5219/api-admin/LaySanPham?id=${prod.maDanhMuc}`);
        const json2 = await res2.json();
        setSimilarProducts(json2.data || []);
        setLoading2(false);

        // Gọi danh sách bình luận
        const res3 = await fetch(`http://localhost:5219/api-admin6/LayBinhLuanTheoMa?id=${id}`);
        const json3 = await res3.json();
        setComments(json3.data || []);
        setLoading2(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
        setLoading2(false);
      }
    };

    getProduct();
  }, [id]);


  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3">
          <img
            className="img-fluid"
            src={"/assets/"+product.anh}
            alt={product.tenSanPham}
            width="400px"
            height="400px"
          />
        </div>
        <div className="col-md-6 py-5">
          <h4 className="text-uppercase text-muted">{product.tenDanhMuc}</h4>
          <h1 className="display-5">{product.tenSanPham}</h1>
          <h3 className="display-6 my-4">{product.gia?.toLocaleString()}đ</h3>
          <p className="lead">{product.moTa}</p>
          <button className="btn btn-outline-dark">
            Thêm vào giỏ hàng
          </button>
          <Link to="/checkout" state={{ selectedItems: [{ id: product.maSanPham, name: product.tenSanPham, quantity: 1, price: product.gia }] }} className="btn btn-dark mx-3">
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="my-4 py-4 d-flex">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mx-4">
          <Skeleton height={400} width={250} />
        </div>
      ))}
    </div>
  );

  const ShowSimilarProduct = () => (
    <div className="py-4 my-4 d-flex">
      {similarProducts
        .filter((item) => item.maSanPham !== product.maSanPham)
        .map((item) => (
          <div key={item.maSanPham} className="card mx-4 text-center">
            <img
              className="card-img-top p-3"
              src={"/assets/"+item.anh}
              alt={item.tenSanPham}
              height={300}
              width={300}
            />
            <div className="card-body">
              <h5 className="card-title">{item.tenSanPham}</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item lead">{item.gia?.toLocaleString()}đ</li>
            </ul>
            <div className="card-body">
              <Link to={`/product/${item.maSanPham}`} className="btn btn-dark m-1">
                Mua ngay
              </Link>
              <button className="btn btn-dark m-1">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  const CommentSection = () => (
    <div className="container my-5 py-5">
      <h2>Bình luận</h2>
      <div className="card p-4">
        <form>
          <div className="mb-3">
            <textarea
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-dark" disabled>
          </button>
        </form>
        <div className="mt-4">
          {comments.map((comment, index) => (
              <div key={index} className="border-bottom py-3">
                <p className="mb-1">{comment.noiDung}</p>
                <small className="text-muted">
                  {comment.taiKhoan}
                </small>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <CommentSection />
          <div className="d-none d-md-block">
            <h2 className="">Sản phẩm cùng danh mục</h2>
            <Marquee pauseOnHover pauseOnClick speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;