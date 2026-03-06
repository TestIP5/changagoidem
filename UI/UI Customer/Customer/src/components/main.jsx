import React from "react";

const Home = () => {
  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-white border-0 mx-3">
          <img
            className="card-img img-fluid"
            src="./assets/main.png.jpg"
            alt="Card"
            height={500}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div className="container">
              <h5 className="card-title fs-1 text fw-lighter">CHÀO ĐÓN MÙA THU !!!</h5>
              <p className="card-text fs-5 d-none d-sm-block ">
                Chào đón mùa thu ấm áp cùng bộ sưu tập chăn ga gối đệm cao cấp, mềm mại, tinh tế – mang đến giấc ngủ trọn vẹn và không gian thư giãn hoàn hảo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
