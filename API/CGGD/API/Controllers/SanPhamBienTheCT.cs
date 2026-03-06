using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamBienTheCT : ControllerBase
    {
        private readonly ISanPhamBienTheBS _iSanPhamBLL;

        public SanPhamBienTheCT(ISanPhamBienTheBS iSanPhamBLL)
        {
            _iSanPhamBLL = iSanPhamBLL ?? throw new ArgumentNullException(nameof(iSanPhamBLL));
        }

        [Route("ThemSanPhamBienThe")]
        [HttpPost]
        public IActionResult CreateSanPham([FromBody] SanPhamBienThe sanPham)
        {
            try
            {
                _iSanPhamBLL.InsertSanPhamBienThe(sanPham);
                return Ok(new { message = "Sản phẩm đã được thêm thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
            

        [Route("SuaSanPhamBienThe")]
        [HttpPost] 
        public IActionResult UpdateSanPhamBienThe([FromBody] SanPhamBienThe sanPham)
        {
            try
            {
                _iSanPhamBLL.UpdateSanPhamBienThe(sanPham);
                return Ok(new { message = "Sản phẩm đã được sửa thành công." });
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("XoaSanPhamBienThe")]
        [HttpPost]
        public IActionResult DeleteSanPhamBienThe(int id)
        {
            try
            {
                _iSanPhamBLL.DeleteSanPhamBienThe(id);
                return Ok(new { message = "Sản phẩm đã được xóa thành công."});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("LaySanPhamBienTheTheoMa")] 
        [HttpGet]
        public IActionResult GetByIDSanPhamBienThe(int id)
        {
            try
            {
                var sanPham = _iSanPhamBLL.GetSanPhamBienTheByID(id);
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

        [Route("LaySanPhamBienThe")]
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
