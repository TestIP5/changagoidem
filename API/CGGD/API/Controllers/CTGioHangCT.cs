using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CTGioHangCT : ControllerBase
    {
        private readonly ICTGioHangBS _iCommentBLL;
        public CTGioHangCT(ICTGioHangBS iCommentBLL)
        {
            _iCommentBLL = iCommentBLL ?? throw new Exception(nameof(iCommentBLL));
        }


        [Route("ThemChiTietGioHang")]
        [HttpPost]
        public IActionResult CreateComment([FromBody] ChiTietGioHang1 comment)
        {
            try
            {
                _iCommentBLL.InsertCTGioHang(comment);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("TangGioHang")]
        [HttpPost]
        public IActionResult UpdateCommentI([FromBody] ChiTietGioHang1 comment)
        {
            try
            {
                _iCommentBLL.UpdateCTGioHangTang(comment);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GiamGioHang")]
        [HttpPost]
        public IActionResult UpdateCommentD([FromBody] ChiTietGioHang1 comment)
        {
            try
            {
                _iCommentBLL.UpdateCTGioHangGiam(comment);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaChiTietGioHang")]
        [HttpPost]
        public IActionResult DeleteComment(int id,int id1)
        {
            try
            {
                _iCommentBLL.DeleteCTGioHang(id,id1);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [Route("LayTatCaChiTietGioHang")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iCommentBLL.GetAll();

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
