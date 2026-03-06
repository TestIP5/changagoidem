using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BinhLuanCT : ControllerBase
    {
        private readonly IBinhLuanBS _iCommentBLL;
        public BinhLuanCT(IBinhLuanBS iCommentBLL)
        {
            _iCommentBLL = iCommentBLL ?? throw new Exception(nameof(iCommentBLL));
        }


        [Route("ThemBinhLuan")]
        [HttpPost]
        public IActionResult CreateComment([FromBody] BinhLuan comment)
        {
            try
            {
                _iCommentBLL.InsertComment(comment);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaBinhLuan")]
        [HttpPost]
        public IActionResult UpdateComment([FromBody] BinhLuan comment)
        {
            try
            {
                _iCommentBLL.UpdateComment(comment);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaBinhLuan")]
        [HttpPost]
        public IActionResult DeleteComment(int id)
        {
            try
            {
                _iCommentBLL.DeleteComment(id);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayBinhLuanTheoMa")]
        [HttpGet]
        public IActionResult GetByID(int id)
        {
            try
            {
                var data = _iCommentBLL.GetCommentByID(id);
                if (data == null)
                {
                    return NotFound($"Không tìm thấy: {id}");
                }
                else return Ok(new { mesage = $"Tìm thấy {id}", data = data });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("LayBinhLuan")]
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
