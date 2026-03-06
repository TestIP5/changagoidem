using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NguoiDungCT : ControllerBase
    {
        private readonly INguoiDungBS _iNguoiDungBLL;

        public NguoiDungCT(INguoiDungBS iNguoiDungBLL)
        {
            _iNguoiDungBLL = iNguoiDungBLL ?? throw new Exception(nameof(iNguoiDungBLL));
        }

        [Route("ThemNguoiDung")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] NguoiDungDoi nguoiDung)
        {
            try
            {
                _iNguoiDungBLL.InsertNguoiDung(nguoiDung);
                return Ok(new { message = "User đã được thêm thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("SuaNguoiDung")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] NguoiDungDoi nguoiDung)
        {
            try
            {
                _iNguoiDungBLL.UpdateNguoiDung(nguoiDung);
                return Ok(new { mesage = " Update User thành công" });
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("XoaNguoiDung")]
        [HttpPost] 
        public IActionResult DeleteUser(string id)
        {
            try
            {
                _iNguoiDungBLL.DeleteNguoiDung(id);
                return Ok(new {mesage = " Delete ok"});
            }
            catch(Exception ex)
            {
                return BadRequest(new {mesage = ex.Message});
            }
        }

        [Route("LayNguoiDungTheoMa")]
        [HttpGet]
        public IActionResult GetByID(string id)
        {
            try
            {
                var sanPham = _iNguoiDungBLL.GetUserByID(id);
                if (sanPham == null)
                {
                    return NotFound(new { message = $"Không tìm thấy User có {id}" });
                }
                return Ok(new { mesage = $"Tìm thấy", data = sanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Route("LayNguoiDung")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var danhSachSanPham = _iNguoiDungBLL.GetAll();

                if (danhSachSanPham == null || !danhSachSanPham.Any())
                {
                    return NotFound(new { message = "Không có người dùng nào được tìm thấy." });
                }

                return Ok(new { message = "Lấy danh sách người dùng thành công.", data = danhSachSanPham });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Đã xảy ra lỗi khi lấy danh sách người dùng: " + ex.Message });
            }
        }
    }
}
