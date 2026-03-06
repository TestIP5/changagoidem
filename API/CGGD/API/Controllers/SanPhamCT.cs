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

        [Route("ThemSanPham")]
        [HttpPost]
        public IActionResult CreateSanPham([FromBody] SanPhamAdd sanPham)
        {
            try
            {
                _iSanPhamBLL.InsertSanPham(sanPham);
                return Ok(new { message = "Sản phẩm đã được thêm thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
            

        [Route("SuaSanPham")]
        [HttpPost] 
        public IActionResult UpdateSanPham([FromBody] SanPham sanPham)
        {
            try
            {
                _iSanPhamBLL.UpdateSanPham(sanPham);
                return Ok(new { message = "Sản phẩm đã được sửa thành công." });
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("XoaSanPham")]
        [HttpPost]
        public IActionResult DeleteSanPham(int id)
        {
            try
            {
                _iSanPhamBLL.DeleteSanPham(id);
                return Ok(new { message = "Sản phẩm đã được xóa thành công."});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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

        [Route("LaySanPhamTheoMaDanhMuc")]
        [HttpGet]
        public IActionResult GetSanPhamByIDDM(int id)
        {
            try
            {
                var danhSachSanPham = _iSanPhamBLL.GetSanPhamByIDDM(id);

                if (danhSachSanPham == null || !danhSachSanPham.Any())
                {
                    return NotFound(new { message = "Không có sản phẩm nào được tìm thấy." });
                }

                return Ok(new { message = "Lấy danh sách sản phẩm thành công.", data = danhSachSanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
