using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CTDonHangCT : ControllerBase
    {
        private readonly ICTDonHangBS _iCTHoaDonBLL;
        public CTDonHangCT(ICTDonHangBS iCTHoaDonBLL)
        {
            _iCTHoaDonBLL = iCTHoaDonBLL ?? throw new Exception(nameof(iCTHoaDonBLL));
        }


        [Route("ThemCTHoaDon")]
        [HttpPost]
        public IActionResult CreateCTHoaDon([FromBody] ChiTietDonHang ctHoaDon)
        {
            try
            {
                _iCTHoaDonBLL.InsertChiTietHoaDon(ctHoaDon);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaCTHoaDon")]
        [HttpPost]
        public IActionResult UpdateCTHoaDon([FromBody] ChiTietDonHang ctHoaDon)
        {
            try
            {
                _iCTHoaDonBLL.UpdateChiTietHoaDon(ctHoaDon);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaCTHoaDon")]
        [HttpPost]
        public IActionResult DeleteCTHoaDon(int id)
        {
            try
            {
                _iCTHoaDonBLL.DeleteChiTietHoaDon(id);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayCTHoaDonTheoMa")]
        [HttpGet]
        public IActionResult GetByID(int id)
        {
            try
            {
                var data = _iCTHoaDonBLL.GetCTHoaDonByID(id);
                if (data == null)
                {
                    return NotFound($"Không tìm thấy: {id}");
                }
                else return Ok(new { mesage = $"Tìm thấy {id}", gioHang = data });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayCTDonHang")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iCTHoaDonBLL.GetAll();

                if (danhSachSanPham == null || !danhSachSanPham.Any())
                {
                    return NotFound(new { message = "Không có danh mục  nào được tìm thấy." });
                }

                return Ok(new { message = "Lấy danh sách danh mục thành công.", data = danhSachSanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Đã xảy ra lỗi khi lấy danh sách danhh mục: " + ex.Message });
            }
        }
    }
}
