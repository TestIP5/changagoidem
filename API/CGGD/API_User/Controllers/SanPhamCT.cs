using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamCT : ControllerBase
    {
        private readonly ISanPhamBS _iSanPhamBLL;

        public SanPhamCT(ISanPhamBS iSanPhamBLL)
        {
            _iSanPhamBLL = iSanPhamBLL ?? throw new ArgumentNullException(nameof(iSanPhamBLL));
        }
        [Route("LaySanPhamTheoMa")] 
        [HttpGet]
        public IActionResult GetByIDSanPham(int id)
        {
            try
            {
                var sanPham = _iSanPhamBLL.GetSanPhamByID(id);
                if (sanPham == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm với ID: " + id });
                }
                return Ok(new { message = "Tìm thành công.", data = sanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("LaySanPham")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iSanPhamBLL.GetAll();

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
