using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GioHangCT : ControllerBase
    {
        private readonly IGioHangBS _iGioHangBLL;
        public GioHangCT(IGioHangBS iGioHangBLL)
        {
            _iGioHangBLL = iGioHangBLL ?? throw new Exception(nameof(iGioHangBLL));
        }


        [Route("ThemGioHang")]
        [HttpPost]
        public IActionResult CreateGioHang([FromBody] GioHang gioHang) 
        {
            try
            {
                _iGioHangBLL.InsertGioHang(gioHang);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaGioHang")]
        [HttpPost]
        public IActionResult DeleteGioHang(int id)
        {
            try
            {
                _iGioHangBLL.DeleteGioHang(id);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayGioHang")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iGioHangBLL.GetAll();

                if (danhSachSanPham == null || !danhSachSanPham.Any())
                {
                    return NotFound(new { message = "Không có sản phẩm nào được tìm thấy." });
                }

                return Ok(new { message = "Lấy danh sách sản phẩm thành công.", data = danhSachSanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Đã xảy ra lỗi khi lấy danh sách sản phẩm: " + ex.Message });
            }
        }
    }
}
