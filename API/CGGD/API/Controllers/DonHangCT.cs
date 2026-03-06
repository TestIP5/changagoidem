using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangCT : ControllerBase
    {
        private readonly IDonHangBS _iHoaDonBLL;    
        public DonHangCT(IDonHangBS iHoaDonBLL)
        {
            _iHoaDonBLL = iHoaDonBLL ?? throw new Exception(nameof(iHoaDonBLL));
        }

        [Route("ThemDonHang")]
        [HttpPost]
        public IActionResult CreateHoaDon([FromBody] DonHang hoaDon)
        {
            try
            {
                var maDonHang = _iHoaDonBLL.InsertHoaDon(hoaDon);
                return Ok(new { message = "Tạo Hóa Đơn thành công", maDonHang = maDonHang });
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaDonHang")]
        [HttpPost]
        public IActionResult UpdateHoaDon([FromBody]TTDonHang hoaDon) 
        {
            try
            {
                _iHoaDonBLL.UpdateHoaDon(hoaDon);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaThongTinDonHang")]
        [HttpPost]
        public IActionResult UpdateTTHoaDon([FromBody] TTDonHang2 hoaDon)
        {
            try
            {
                _iHoaDonBLL.UpdateTTHoaDon(hoaDon);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaDonHang")]
        [HttpPost]
        public IActionResult DeleteHoaDon(int id) 
        {
            try
            {
                _iHoaDonBLL.DeleteHoaDon(id);
                return Ok(new { mesage = $"Delete thành công {id}" });
            }
            catch (Exception ex) 
            { 
                return BadRequest(ex.Message);
            }
        }

        [Route("LayDonHangTheoMa")]
        [HttpGet]
        public IActionResult GetByID(int id) 
        {
            try
            {
                var hoaDon = _iHoaDonBLL.GetHoaDonByID(id);
                if (hoaDon == null)
                {
                    return NotFound($"Không tìm thấy hóa đơn có ID: {id}");
                }
                else
                {
                    return Ok(new {mesage = $"Tìm thấy Hóa Đơn có ID: {id}", data = hoaDon});
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [Route("LayDonHang")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iHoaDonBLL.GetAll();

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
