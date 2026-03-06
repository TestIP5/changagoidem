import React from 'react'
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Về chúng tôi</h1>
        <hr />
        <p className="lead text-center">
          Chúng tôi là thương hiệu chuyên cung cấp chăn ga gối đệm chất lượng cao, 
          mang đến sự êm ái và thoải mái cho mọi không gian sống. Với tiêu chí “Ngủ ngon – Sống khỏe”, 
          chúng tôi luôn chú trọng từ chất liệu đến thiết kế để mỗi sản phẩm không chỉ bền đẹp mà còn an toàn cho sức khỏe người dùng.
         Đội ngũ giàu kinh nghiệm, dịch vụ tận tâm cùng chính sách hậu mãi hấp dẫn chính là cam kết từ chúng tôi để mang lại sự hài lòng tuyệt đối cho khách hàng. 
         Chào đón bạn đến với không gian nghỉ ngơi lý tưởng!
        </p>

        <h2 className="text-center py-4">Danh mục sản phẩm</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="./assets/chan.jpg" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Chăn</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="./assets/ga.jpg" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Ga</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="./assets/goi.jpg" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Gối</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="./assets/dem.jpg" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Đệm</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage