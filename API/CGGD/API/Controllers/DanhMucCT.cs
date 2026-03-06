using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucCT : ControllerBase
    {
        private readonly IDanhMucBS _iDanhMucBLL;
        public DanhMucCT(IDanhMucBS iDanhMucBLL)
        {
            _iDanhMucBLL = iDanhMucBLL ?? throw new Exception(nameof(iDanhMucBLL));
        }


        [Route("ThemDanhMuc")]
        [HttpPost]
        public IActionResult CreateDanhMuc([FromBody] DanhMuc danhMuc)
        {
            try
            {
                _iDanhMucBLL.InsertDanhMuc(danhMuc);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaDanhMuc")]
        [HttpPost]
        public IActionResult UpdateDanhMuc([FromBody] DanhMuc danhMuc)
        {
            try
            {
                _iDanhMucBLL.UpdateDanhMuc(danhMuc);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaDanhMuc")]
        [HttpPost]
        public IActionResult DeleteDanhMuc(int id)
        {
            try
            {
                _iDanhMucBLL.DeleteDanhMuc(id);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayDanhMucTheoMa")]
        [HttpGet]
        public IActionResult GetByID(int id)
        {
            try
            {
                var data = _iDanhMucBLL.GetDanhMucByID(id);
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

        [Route("LayDanhMuc")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iDanhMucBLL.GetAll();

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
